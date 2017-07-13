function Grid(board) {
  this.canvas = document.getElementById('game');
  this.ctx = this.canvas.getContext('2d');

  this.canvas.onmousemove = this.onMouseMove.bind(this);
  this.canvas.onmousedown = this.onClick.bind(this);

  this.board = board;
  this.dimension = board.dimension;
  this.highlightedCell = undefined;
  this.buildCells();
}

Grid.FIRST_CELL_CENTER_POSITION =  {x: 60, y: 60};
Grid.PLAYER_COLORS = [
  'red',
  'yellow',
  'green',
  'grey',
  'cyan',
];

Grid.prototype.buildCells = function() {
  this.board.getNonEmptyCells().forEach(function (cell) {
    var hexCenter = Hex.getHexCenterPosition(
      cell.row,
      cell.col,
      Hex.HEX_EDGE_SIZE,
      Grid.FIRST_CELL_CENTER_POSITION
    );
    var path = Hex.buidHexPath(hexCenter, Hex.HEX_EDGE_SIZE);
    cell.hex = {
      path: path,
      center: hexCenter
    };
  });
}

Grid.prototype.draw = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.board.getNonEmptyCells().forEach(function (cell) {
    var hex = cell.hex;
    this.setHexBackgroundStyle(cell);
    this.ctx.fill(cell.hex.path);
    this.ctx.stroke(cell.hex.path);

    if (cell.population !== undefined) {
      this.setHexTextStyle();
      var label = cell.population;
      this.ctx.fillText(label, cell.hex.center.x, cell.hex.center.y); 
    }
  }.bind(this));
}

/**
 * Change the context style for painting the hex background.
 * @param {Hex} hex
 */
Grid.prototype.setHexBackgroundStyle = function(cell) {
  if (cell.isSelected) {
    this.ctx.fillStyle = 'red';
    this.ctx.strokeStyle = 'blue';
  }
  else if (cell.player != undefined) {
    this.ctx.fillStyle = Grid.PLAYER_COLORS[cell.player];
    this.ctx.strokeStyle = 'blue';
  } else {
    this.ctx.fillStyle = 'orange';
    this.ctx.strokeStyle = 'blue';
  }

  if (_isSameCoordinates(cell, this.highlightedCell)) {
    this.ctx.globalAlpha = 0.75;
  } else {
    this.ctx.globalAlpha = 1;
  }
}

/**
 * Change the context style for painting the hex text.
 */
Grid.prototype.setHexTextStyle = function() {
  this.ctx.font = '13px monospace';
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';
  this.ctx.fillStyle = 'black';
}

/**
 * Highligh cell on hover.
 * @param  {MouseEvent} e
 */
Grid.prototype.onMouseMove = function(e) {
  var mousePosition = {
    x: e.clientX - e.target.offsetLeft,
    y: e.clientY - e.target.offsetTop    
  };
  var cellOverMouse = this.getCellOnPoint(mousePosition);
  this._highlightCell(cellOverMouse);
};

/**
 * Select cell on click.
 * @param  {MouseEvent} e
 */
Grid.prototype.onClick = function(e) {
  var mousePosition = {
    x: e.clientX - e.target.offsetLeft,
    y: e.clientY - e.target.offsetTop    
  };
  var cellOverMouse = this.getCellOnPoint(mousePosition);
  // this._selectAdjacentCells(cellOverMouse);
}

Grid.prototype._highlightCell = function(cell) {
  if (!_isSameCoordinates(cell, this.highlightedCell)) {
    this.highlightedCell = cell;
    this.draw();
  }
}

Grid.prototype._selectCell = function(cell) {
  if (cell !== undefined) {
    cell.isSelected = !cell.isSelected;
    this.draw();
  }
}

Grid.prototype._selectAdjacentCells = function(cell) {
  if (cell !== undefined) {
    this.board.getAdjacentCells(cell).forEach(function (adjacent) {
      adjacent.isSelected = !adjacent.isSelected;
    });
    this.draw();
  }
}

/**
 * Get the coordinates of the hex containing the point or undefined if the point
 * is not contained by any hex.
 * @param  {Point} point - [X, Y] point.
 * @return {Coordinate} Hex coordinate or undefined.
 */
Grid.prototype.getCellOnPoint = function(point) {
  return this.board.getNonEmptyCells().find(function (cell) {
    return this.ctx.isPointInPath(cell.hex.path, point.x, point.y);
  }.bind(this));
}


/**
 * Check if 2 cells are the same looking to their coordinates.
 * @param  {Hex} cell1
 * @param  {Hex} cell2
 * @return {Boolean}
 */
function _isSameCoordinates(cell1, cell2) {
  var row1 = cell1 ? cell1.row : undefined,
      row2 = cell2 ? cell2.row : undefined,
      col1 = cell1 ? cell1.col : undefined,
      col2 = cell2 ? cell2.col : undefined;
  return row1 === row2 && col1 === col2;
}
