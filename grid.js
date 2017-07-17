/**
 * Knows how to draw the grid and pass user action to 'game'.
 */

function Grid(board, game) {
  this.board = board;
  this.game = game;
  this.highlightedCell = undefined;
  this.selectedCell = undefined;

  this.canvas = document.getElementById('game');
  this.ctx = this.canvas.getContext('2d');

  this.canvas.onmousemove = this.onMouseMove.bind(this);

  document.getElementById('advance').onclick = function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.game.onAdvanceTurn.call(this.game);
  }.bind(this);

  document.onclick = this.onClick.bind(this);

  document.onkeydown = function(e) {
    if (e.keyCode === 32) {
      this.game.onAdvanceTurn.call(this.game);
      return e.preventDefault();
    }
  }.bind(this);

  this.buildCellPaths();
}

Grid.PLAYER_COLORS = [
  'red',
  'gold',
  'green',
  'chocolate',
  'cyan',
];

Grid.CELL_STYLES = {
  'unoccupied': {
    'bg' : 'lightgray',
    'border': 'white'
  },
  'occupied': {
    'border': 'white'
  },
  'selected': {
    'border': 'blue'
  }
};

/**
 * Build each cell path and store it on the cell object.
 */
Grid.prototype.buildCellPaths = function() {
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

/**
 * Redraw the whole grid.
 */
Grid.prototype.draw = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.board.getNonEmptyCells().forEach(function (cell) {
    var hex = cell.hex;
    this.setHexBackgroundStyle(cell);
    this.ctx.fill(cell.hex.path);

    if (Board.isSameCoordinates(cell, this.selectedCell)) {
      this.ctx.stroke(cell.hex.path);
    }

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
  this.ctx.lineWidth = 2;
  this.ctx.globalAlpha = 1;

  if (Board.isSameCoordinates(cell, this.selectedCell)) {
    this.ctx.fillStyle = Grid.PLAYER_COLORS[cell.player];
    this.ctx.strokeStyle = Grid.CELL_STYLES.selected.border;
  }
  else if (cell.player != undefined) {
    this.ctx.fillStyle = Grid.PLAYER_COLORS[cell.player];
    this.ctx.strokeStyle = Grid.CELL_STYLES.occupied.border;
  } else {
    this.ctx.fillStyle = Grid.CELL_STYLES.unoccupied.bg;
    this.ctx.strokeStyle = Grid.CELL_STYLES.unoccupied.border;
  }

  if (Board.isSameCoordinates(cell, this.highlightedCell)) {
    this.ctx.globalAlpha = 0.75;
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

Grid.prototype.selectCell = function(cell) {
  this.selectedCell = cell;
};

Grid.prototype.unselectCell = function() {
  this.selectedCell = undefined;
};

Grid.prototype._highlightCell = function(cell) {
  if (!Board.isSameCoordinates(cell, this.highlightedCell)) {
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

/**
 * Calculate the canvas size and grid dimension based on the current viewport size.
 * @return {Object} canvasSize - Canvas size.
 *         {number} canvasSize.height - Canvas height.
 *         {number} canvasSize.width - Canvas width.
 *         {number} canvasSize.rowCount - Number of rows in the grid.
 *         {number} canvasSize.colCount - Number of columns in the grid.
 */
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
