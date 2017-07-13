function Board(dimension) {
  this.dimension = dimension;
  this.cells = {};
  this.cellArray = [];
  this._init();
}

Board.prototype._init = function() {
  this.cells = {};
  this.cellArray = [];
  for (var row = 0; row < this.dimension ; row++) {
    this.cells[row] = {};
    for (var col = 0; col < this.dimension ; col++) {
      var cell = {
        row: row,
        col: col,
        isEmpty: false
      };
      this.cells[row][col] = cell;
      this.cellArray.push(cell);
    }
  }
};

Board.prototype.getCell = function(coord) {
  return this.cells[coord.row][coord.col];
};

Board.prototype.clearCell = function(coord) {
  this.cells[coord.row][coord.col].isEmpty = true;
};

Board.prototype.unclearCell = function(coord) {
  this.cells[coord.row][coord.col].isEmpty = false;
};

Board.prototype.getNonEmptyCells = function() {
  return this.cellArray.filter(function(cell) {
    return !cell.isEmpty;
  });
};

Board.prototype.getAllCells = function() {
  return this.cellArray;
};

Board.prototype.getFirstNonEmptyCell = function() {
  return this.cellArray.find(function(cell) {
    return !cell.isEmpty;
  });
};

Board.prototype.getAdjacentCells = function(cell) {
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
      !this.cells[coord.row][coord.col].isEmpty;
  }.bind(this));

  // return actual cells
  return adjacentCoords.map(function (coord) {
    return this.cells[coord.row][coord.col];
  }.bind(this));
}
