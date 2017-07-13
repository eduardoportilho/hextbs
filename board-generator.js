var CONTINUE_TRACK_CHANCE = 0.7;

function BoardGenerator(dimension) {
  this.dimension = dimension;
  this.maxEmpty = Math.round((this.dimension * this.dimension) / 2);
  this.minEmpty = Math.round(this.maxEmpty * 0.7);
}

BoardGenerator.prototype.generateBoard = function() {
  this.emptyCount = 0;
  this.board = _generateEmptyBoard(this.dimension);
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
    var cell = this.board[row][col];
    if (!cell.isEmpty) {
      return cell;
    }
  }
};

BoardGenerator.prototype.getAdjacentCells = function(cell) {
  var adjacentCoords;
  var r = cell.row, c = cell.col;
  if (r % 2 === 0) {
    adjacentCoords = [
      {row: r-1, col: c-1},
      {row: r, col: c-1},
      {row: r+1, col: c},
      {row: r, col: c+1},
      {row: r-1, col: c+1},
      {row: r-1, col: c},
    ];
  } else {
    adjacentCoords = [
      {row: r, col: c-1},
      {row: r+1, col: c-1},
      {row: r+1, col: c},
      {row: r+1, col: c+1},
      {row: r, col: c+1},
      {row: r-1, col: c},
    ];
  }

  // remove out of grid and already removed
  adjacentCoords = adjacentCoords.filter(function(coord) {
    return coord.row >= 0 &&
      coord.col >= 0 &&
      coord.row < this.dimension &&
      coord.col < this.dimension &&
      !this.board[coord.row][coord.col].isEmpty;
  }.bind(this));

  return adjacentCoords.map(function (coord) {
    return this.board[coord.row][coord.col];
  }.bind(this));
}

BoardGenerator.prototype.getRandomAdjacentCell = function(cell) {
  var adjacentCells = this.getAdjacentCells(cell);
  if (adjacentCells.length === 0) {
    return undefined;
  }
  var index = _getRandomInt(0, adjacentCells.length);
  return adjacentCells[index];
};

BoardGenerator.prototype.removeCell = function(coord) {
  this.board[coord.row][coord.col].isEmpty = true;
  this.emptyCount++;
};

BoardGenerator.prototype.undoRemoveCell = function(coord) {
  this.board[coord.row][coord.col].isEmpty = false;
  this.emptyCount--;
};

BoardGenerator.prototype.isBoardConnected = function() {
  //clear connected flag and find first cell
  var firstCell = undefined;
  for (var row = 0; row < this.dimension ; row++) {
    for (var col = 0; col < this.dimension ; col++) {
      var cell = this.board[row][col];
      if (!firstCell && !cell.isEmpty) {
        firstCell = cell;
      }
      cell.isConnected = false;
    }
  }

  // set connected flag
  this.connectCellAndAdjcent(firstCell);

  // check for unconected cells
  for (var row = 0; row < this.dimension ; row++) {
    for (var col = 0; col < this.dimension ; col++) {
      var cell = this.board[row][col];
      if (!cell.isConnected && !cell.isEmpty) {
        return false;
      }
    }
  }
  return true;
}

BoardGenerator.prototype.connectCellAndAdjcent = function(cell) {
  cell.isConnected = true;
  var adjacentCells = this.getAdjacentCells(cell);
  for (var i = 0; i < adjacentCells.length ; i++) {
      var adjacent = adjacentCells[i];
      if (!adjacent.isConnected && !adjacent.isEmpty) {
        this.connectCellAndAdjcent(adjacent);
      }
  }
}

function _generateEmptyBoard(dimension) {
  var board = {};
  for (var row = 0; row < dimension ; row++) {
    board[row] = {};
    for (var col = 0; col < dimension ; col++) {
      board[row][col] = {
        row: row,
        col: col,
        isEmpty: false
      };
    }
  }
  return board;
}

function _yesOrNo(yesChance) {
  return Math.random() < yesChance;
}

function _getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
