var CONTINUE_TRACK_CHANCE = 0.7;

function BoardGenerator(dimension) {
  this.dimension = dimension;
  this.maxEmpty = Math.round((this.dimension * this.dimension) / 2);
  this.minEmpty = Math.round(this.maxEmpty * 0.7);
}

BoardGenerator.prototype.setBoard = function(board) {
  this.board = board;
};

BoardGenerator.prototype.generateBoard = function() {
  this.emptyCount = 0;
  this.board = new Board(this.dimension);
  this.removeSomeCells();
  return this.board;
}

BoardGenerator.prototype.removeSomeCells = function() {
  while (this.emptyCount < this.minEmpty) {
    var cell = this.getRandomCell();
    if (!cell) {
      break;
    }
    this.removeCell(cell);
    if (!this.isBoardConnected(this.board)) {
      this.undoRemoveCell(cell);
      break;
    }

    //should continue track?
    while (this.emptyCount < this.maxEmpty && 
      _yesOrNo(CONTINUE_TRACK_CHANCE)) {
      cell = this.getRandomAdjacentCell(cell);
      if(cell) {
        this.removeCell(cell);
        if (!this.isBoardConnected(this.board)) {
          this.undoRemoveCell(cell);
          break;
        }
      } else {
        break;
      }
    }
  }
};

BoardGenerator.prototype.getRandomCell = function() {
  while (true) {
    var row = _getRandomInt(0, this.dimension);
    var col = _getRandomInt(0, this.dimension);
    var cell = this.board.getCell({row: row, col: col});
    if (!cell.isEmpty) {
      return cell;
    }
  }
};

BoardGenerator.prototype.removeCell = function(coord) {
  this.board.clearCell(coord);
  this.emptyCount++;
};

BoardGenerator.prototype.undoRemoveCell = function(coord) {
  this.board.unclearCell(coord);
  this.emptyCount--;
};

BoardGenerator.prototype.getRandomAdjacentCell = function(cell) {
  var adjacentCells = this.board.getAdjacentCells(cell);
  if (adjacentCells.length === 0) {
    return undefined;
  }
  var index = _getRandomInt(0, adjacentCells.length);
  return adjacentCells[index];
};

BoardGenerator.prototype.isBoardConnected = function() {
  //clear connected flag and find first cell
  var firstCell = this.board.getFirstNonEmptyCell();
  this.board.getAllCells().forEach(function (cell) {
    cell.isConnected = false;
  });

  // set connected flag
  this.connectCellAndAdjcent(firstCell);

  // check for unconected cells
  var unconnectedIndex = this.board.getNonEmptyCells().findIndex(function (cell) {
    return !cell.isConnected;
  });

  return unconnectedIndex < 0;
}

BoardGenerator.prototype.connectCellAndAdjcent = function(cell) {
  cell.isConnected = true;
  var adjacentCells = this.board.getAdjacentCells(cell);

  adjacentCells.filter(function(adjacent) {
    return !adjacent.isConnected && !adjacent.isEmpty;
  }).forEach(function (adjacent) {
    this.connectCellAndAdjcent(adjacent);
  }.bind(this));
}

function _yesOrNo(yesChance) {
  return Math.random() < yesChance;
}

function _getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
