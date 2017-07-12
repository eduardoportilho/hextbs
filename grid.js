function Grid(dimension) {
  this.dimension = dimension;
  this.canvas = document.getElementById('game');
  this.ctx = this.canvas.getContext('2d');

  this.canvas.onmousemove = this.onMouseMove.bind(this);
  this.canvas.onmousedown = this.onClick.bind(this);

  this.cells = {};
  this.highlightedCell = undefined;
  this.buildCells();
}

Grid.FIRST_CELL_CENTER_POSITION =  {x: 60, y: 60};

Grid.prototype.buildCells = function() {
  this.cells = {};
  for (var row = 0; row < this.dimension ; row++) {
    this.cells[row] = {};

    for (var col = 0; col < this.dimension ; col++) {
      var centerPosition = _getHexCenterPosition(
        row,
        col,
        Hex.HEX_EDGE_SIZE,
        Grid.FIRST_CELL_CENTER_POSITION
      );
      this.cells[row][col] = new Hex(row, col, centerPosition);
    }
  }
}

Grid.prototype.draw = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  for (var row = 0; row < this.dimension ; row++) {
    for (var col = 0; col < this.dimension ; col++) {
      var hex = this.cells[row][col];
      if (!hex.isEmpty) {
        this.setHexBackgroundStyle(hex);
        this.ctx.fill(hex.path);
        this.ctx.stroke(hex.path);

        this.setHexTextStyle();
        this.ctx.fillText(hex.population, hex.centerPosition.x, hex.centerPosition.y);
      }
    }
  }
}

/**
 * Change the context style for painting the hex background.
 * @param {Hex} hex
 */
Grid.prototype.setHexBackgroundStyle = function(hex) {
  if (hex.isSelected) {
    this.ctx.fillStyle = 'red';
    this.ctx.strokeStyle = 'blue';
  }
  else if (_isSameCell(hex, this.highlightedCell)) {
    this.ctx.fillStyle = 'blue';
    this.ctx.strokeStyle = 'orange';
  } else {
    this.ctx.fillStyle = 'orange';
    this.ctx.strokeStyle = 'blue';
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
  if (!_isSameCell(cellOverMouse, this.highlightedCell)) {
    this.highlightedCell = cellOverMouse;
    this.draw();
  }
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
  if (cellOverMouse !== undefined) {
    cellOverMouse.isSelected = !cellOverMouse.isSelected;
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
  for (var row = 0; row < this.dimension ; row++) {
    for (var col = 0; col < this.dimension ; col++) {
      var cell = this.cells[row][col];
      if (this.ctx.isPointInPath(cell.path, point.x, point.y)) {
        return cell;
      }
    }
  }
  return undefined;
}

Grid.prototype.setEmptyCells = function(board) {
  for (var row = 0; row < this.dimension ; row++) {
    for (var col = 0; col < this.dimension ; col++) {
      var cell = this.cells[row][col];
      cell.isEmpty = !board[row][col].hasCell;
    }
  }
};

/**
 * Get the position of the center of the hex.
 * @param  {number} row - Hex row index.
 * @param  {number} col - Hex column index.
 * @param  {number} edgeSize - Size of the hex edge.
 * @param  {Point} origin - [X, Y] position of the center of the first (0,0) hex.
 * @return {Point} [X, Y] position of the center of the hex at [row, col].
 */
function _getHexCenterPosition(row, col, edgeSize, origin) {
  origin = origin;
  edgeSize = edgeSize || 50;
  var hexHeight = edgeSize * 2;
  var hexWidth = Math.sqrt(3)/2 * hexHeight;
  
  var x = col * hexWidth;
  var y = row * (3 * hexHeight / 4);
  if (row % 2 !== 0) {
    x += hexWidth / 2;
  }

  return {
    x: origin.x + x,
    y: origin.y + y,
  }
}

/**
 * Check if 2 cells are the same looking to their coordinates.
 * @param  {Hex} cell1
 * @param  {Hex} cell2
 * @return {Boolean}
 */
function _isSameCell(cell1, cell2) {
  var row1 = cell1 ? cell1.row : undefined,
      row2 = cell2 ? cell2.row : undefined,
      col1 = cell1 ? cell1.col : undefined,
      col2 = cell2 ? cell2.col : undefined;
  return row1 === row2 && col1 === col2;
}
