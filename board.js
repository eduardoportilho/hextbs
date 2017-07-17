/**
 * Knows about the state of the board.
 */

function Board(rowCount, colCount) {
  this.rowCount = rowCount;
  this.colCount = colCount;
  this.cells = {};
  this.cellArray = [];
  this._init();
}

Board.prototype._init = function() {
  this.cells = {};
  this.cellArray = [];
  for (var row = 0; row < this.rowCount ; row++) {
    this.cells[row] = {};
    for (var col = 0; col < this.colCount ; col++) {
      var cell = {
        row: row,
        col: col,
        population: 0,
        isEmpty: false,
        board: this
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

Board.prototype.getOcuppiedCells = function() {
  return this.cellArray.filter(function(cell) {
    return !cell.isEmpty && cell.player !== undefined;
  });
};

Board.prototype.getPlayerCells = function(playerId) {
  return this.cellArray.filter(function(cell) {
    return !cell.isEmpty && cell.player === playerId;
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
  var adjacentCoords = Board.getAdjacentCoordinates(cell);
  // remove out of grid and already removed
  adjacentCoords = adjacentCoords.filter(function(coord) {
    return coord.row >= 0 &&
      coord.col >= 0 &&
      coord.row < this.rowCount &&
      coord.col < this.colCount &&
      !this.cells[coord.row][coord.col].isEmpty;
  }.bind(this));

  // return actual cells
  return adjacentCoords.map(function (coord) {
    return this.cells[coord.row][coord.col];
  }.bind(this));
};


Board.getAdjacentCoordinates = function(cell) {
  var adjacentCoords;
  var r = cell.row, c = cell.col;
  if (r % 2 === 0) {
    adjacentCoords = [
      {row: r-1, col: c-1 },
      {row: r-1, col: c   },
      {row: r,   col: c+1 },
      {row: r+1, col: c   },
      {row: r+1, col: c-1 },
      {row: r,   col: c-1 },
    ];
  } else {
    adjacentCoords = [
      {row: r-1, col: c   },
      {row: r-1, col: c+1 },
      {row: r,   col: c+1 },
      {row: r+1, col: c+1 },
      {row: r+1, col: c   },
      {row: r,   col: c-1 },
    ];
  }
  return adjacentCoords;
}

/**
 * Check if 2 cells have the same coordinates.
 * @param  {Cell} cell1
 * @param  {Cell} cell2
 * @return {Boolean}
 */
Board.isSameCoordinates = function(cell1, cell2) {
  var row1 = cell1 ? cell1.row : undefined,
      row2 = cell2 ? cell2.row : undefined,
      col1 = cell1 ? cell1.col : undefined,
      col2 = cell2 ? cell2.col : undefined;
  return row1 === row2 && col1 === col2;
}

Board.isAdjacent = function(cell1, cell2) {
  var adjacentCoords = Board.getAdjacentCoordinates(cell1);
  return adjacentCoords.findIndex(function (coord) {
    return coord.row === cell2.row && 
      coord.col === cell2.col;
  }) >= 0;
};
