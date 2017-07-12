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

    //should continue track?
    while (this.emptyCount < this.maxEmpty && 
      _yesOrNo(CONTINUE_TRACK_CHANCE)) {
      cell = this.getRandomAdjacentCell(cell);
      if(cell) {
        this.removeCell(cell);
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
    if (cell.hasCell) {
      return cell;
    }
  }
};

BoardGenerator.prototype.getRandomAdjacentCell = function(cell) {
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
      this.board[coord.row][coord.col].hasCell;
  });
  if (adjacentCoords.length === 0) {
    return undefined;
  }
  var index = _getRandomInt(0, adjacentCoords.length);
  return adjacentCoords[index];
};

BoardGenerator.prototype.removeCell = function(coord) {
  this.board[coord.row][coord.col].hasCell = false;
  this.emptyCount++;
};

function _generateEmptyBoard(dimension) {
  var board = {};
  for (var row = 0; row < dimension ; row++) {
    board[row] = {};
    for (var col = 0; col < dimension ; col++) {
      board[row][col] = {
        row: row,
        col: col,
        hasCell: true
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
