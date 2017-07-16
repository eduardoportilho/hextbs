/**
 * Knows how to draw the grid and pass user action to 'game'.
 */

function Grid(board, game) {
  this.board = board;
  this.game = game;
  this.highlightedCell = undefined;

  this.canvas = document.getElementById('game');
  this.ctx = this.canvas.getContext('2d');

  this.canvas.onmousemove = this.onMouseMove.bind(this);
  this.canvas.onmousedown = this.onClick.bind(this);

  document.getElementById('advance').onclick = this.game.onAdvanceTurn.bind(this.game);
  document.onkeydown = function(e) {
    if (e.keyCode === 32) {
      this.game.onAdvanceTurn.call(this.game);
      return e.preventDefault();
    }
  }.bind(this);

  this.buildCells();
}

Grid.PLAYER_COLORS = [
  'red',
  'yellow',
  'green',
  'grey',
  'cyan',
];

Grid.prototype.buildCells = function() {
  var hexDimensions = HexPath.getHexDimensions();
  var firstCellCenter = {x: Math.ceil(hexDimensions.width / 2), y: Math.ceil(hexDimensions.height / 2)};
  this.board.getNonEmptyCells().forEach(function (cell) {
    var hexCenter = HexPath.getHexCenterPosition(
      cell.row,
      cell.col,
      HexPath.HEX_EDGE_SIZE,
      firstCellCenter
    );
    var path = HexPath.buidHexPath(hexCenter, HexPath.HEX_EDGE_SIZE);
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

    if (cell.population > 0) {
      this.setHexTextStyle();
      var label = cell.population;
      this.ctx.fillText(label, cell.hex.center.x, cell.hex.center.y); 
    }
  }.bind(this));
}

/**
 * Change the context style for painting the hex background.
 * @param {Cell} cell
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
  this.game.onPlayerClick(cellOverMouse);
}

Grid.prototype._highlightCell = function(cell) {
  if (!_isSameCoordinates(cell, this.highlightedCell)) {
    this.highlightedCell = cell;
    this.draw();
  }
}

/**
 * Get the coordinates of the hex containing the point or undefined if the point
 * is not contained by any hex.
 * @param  {Point} point - [X, Y] point.
 * @return {Cell} Cell or undefined.
 */
Grid.prototype.getCellOnPoint = function(point) {
  return this.board.getNonEmptyCells().find(function (cell) {
    return this.ctx.isPointInPath(cell.hex.path, point.x, point.y);
  }.bind(this));
}

Grid.calculateCanvasSize = function() {
  var viewportWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || 0) - 30;
  var viewportHeight = Math.min(document.documentElement.clientHeight, window.innerHeight || 0) - 50;
  var viewportSize = {width: viewportWidth, height: viewportHeight};
  var gridSize = HexPath.calculateGridSize(viewportSize);
  var hexDimensions = HexPath.getHexDimensions();
  var canvasWidth = (gridSize.colCount + 1) * hexDimensions.width;

  return {
    height: viewportHeight,
    width: canvasWidth,
    rowCount: gridSize.rowCount,
    colCount: gridSize.colCount
  };
};


/**
 * Check if 2 cells are the same looking to their coordinates.
 * @param  {Cell} cell1
 * @param  {Cell} cell2
 * @return {Boolean}
 */
function _isSameCoordinates(cell1, cell2) {
  var row1 = cell1 ? cell1.row : undefined,
      row2 = cell2 ? cell2.row : undefined,
      col1 = cell1 ? cell1.col : undefined,
      col2 = cell2 ? cell2.col : undefined;
  return row1 === row2 && col1 === col2;
}
