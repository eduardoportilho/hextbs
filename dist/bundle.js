/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Random() {}

Random.yesOrNo = function(yesChance) {
  yesChance = yesChance || 0.5;
  return Math.random() < yesChance;
};

Random.getRandomIntExclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

Random.getRandomIntInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};

Random.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/* harmony default export */ __webpack_exports__["a"] = (Random);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Board);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hex_path__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__board__ = __webpack_require__(1);
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
  document.ondblclick = this.onDoubleClick.bind(this);

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
  var hexDimensions = __WEBPACK_IMPORTED_MODULE_0__hex_path__["a" /* default */].getHexDimensions();
  var firstCellCenter = {x: Math.ceil(hexDimensions.width / 2), y: Math.ceil(hexDimensions.height / 2)};
  this.board.getNonEmptyCells().forEach(function (cell) {
    var hexCenter = __WEBPACK_IMPORTED_MODULE_0__hex_path__["a" /* default */].getHexCenterPosition(
      cell.row,
      cell.col,
      __WEBPACK_IMPORTED_MODULE_0__hex_path__["a" /* default */].HEX_EDGE_SIZE,
      firstCellCenter
    );
    var path = __WEBPACK_IMPORTED_MODULE_0__hex_path__["a" /* default */].buidHexPath(hexCenter, __WEBPACK_IMPORTED_MODULE_0__hex_path__["a" /* default */].HEX_EDGE_SIZE);
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

    if (__WEBPACK_IMPORTED_MODULE_1__board__["a" /* default */].isSameCoordinates(cell, this.selectedCell)) {
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

  if (__WEBPACK_IMPORTED_MODULE_1__board__["a" /* default */].isSameCoordinates(cell, this.selectedCell)) {
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

  if (__WEBPACK_IMPORTED_MODULE_1__board__["a" /* default */].isSameCoordinates(cell, this.highlightedCell)) {
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
  if (e.shiftKey) {
    this.game.onPlayerShiftClick(cellOverMouse);
  } else {
    this.game.onPlayerClick(cellOverMouse);
  }
}

Grid.prototype.onDoubleClick = function(e) {
  var mousePosition = {
    x: e.clientX - e.target.offsetLeft,
    y: e.clientY - e.target.offsetTop    
  };
  var cellOverMouse = this.getCellOnPoint(mousePosition);
  this.game.onPlayerDoubleClick(cellOverMouse);
}

Grid.prototype.selectCell = function(cell) {
  this.selectedCell = cell;
};

Grid.prototype.unselectCell = function() {
  this.selectedCell = undefined;
};

Grid.prototype._highlightCell = function(cell) {
  if (!__WEBPACK_IMPORTED_MODULE_1__board__["a" /* default */].isSameCoordinates(cell, this.highlightedCell)) {
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
  var gridSize = __WEBPACK_IMPORTED_MODULE_0__hex_path__["a" /* default */].calculateGridSize(viewportSize);
  var hexDimensions = __WEBPACK_IMPORTED_MODULE_0__hex_path__["a" /* default */].getHexDimensions();
  var canvasWidth = (gridSize.colCount + 1) * hexDimensions.width;

  return {
    height: viewportHeight,
    width: canvasWidth,
    rowCount: gridSize.rowCount,
    colCount: gridSize.colCount
  };
};

/* harmony default export */ __webpack_exports__["a"] = (Grid);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__random__ = __webpack_require__(0);
/**
 * Konws how to simulate attacks and update population after.
 */



function Attack() {}

Attack.updatePopulationAfterAttack = function (attackerCell, defendingCell, attackResult) {
    var attackingSurvivors = attackerCell.population - 1 - attackResult.attackerKills;
    if (attackResult.attackWin) {
      attackerCell.population = 1;
      defendingCell.population = attackingSurvivors;
      defendingCell.player = attackerCell.player;
    } else {
      attackerCell.population = attackingSurvivors + 1;
      defendingCell.population -= attackResult.defenderKills;
    }
};


/**
 * Simulate attack using risk logic: each atacker-defesor pair generates a dice roll and 
 * only one will survive. The attack is successfull if all defensors die.
 * @param  {number} attackingPopulation
 * @param  {number} defendingPopulation
 * @return {Object} result - Result object.
 *         {number} result.attackerKills - How many attacker died?
 *         {number} result.defenderKills - How many defensors died?
 *         {boolean} result.attackWin - Attack successfull?
 */
Attack.simulateRiskAttack = function(attackingPopulation, defendingPopulation) {
  var attacks = Math.min(attackingPopulation, defendingPopulation);
  var attackerKills = 0, defenderKills = 0;
  while (attacks-- > 0) {
    if (__WEBPACK_IMPORTED_MODULE_0__random__["a" /* default */].yesOrNo()) {
      defenderKills++;
    } else {
      attackerKills++;
    }
  }
  return {
    attackerKills: attackerKills,
    defenderKills: defenderKills,
    attackWin: defenderKills === defendingPopulation
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Attack);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__grid__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(6);



var canvasSize = __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */].calculateCanvasSize();
var canvas = document.getElementById('game');
canvas.height = canvasSize.height;
canvas.width = canvasSize.width;

var container = document.querySelector('.container');
container.setAttribute("style", "width: " + canvasSize.width + "px;");

var game = new __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */](canvasSize.rowCount, canvasSize.colCount, 5);
game.init();


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Knows how to draw a hex path.
 */

function HexPath() {}

HexPath.HEX_EDGE_SIZE = 30;

/**
 * Build a hex path with center on the provided position.
 * @param  {Point} center - [X, Y] position of the center of the hex.
 * @param  {number} edgeSize - Size of the hex edge.
 * @return {Path2D} Hex path.
 */
HexPath.buidHexPath = function(center, edgeSize) {
  var cornerPoint = {x:null, y:null},
    angleDeg, 
    angleRad;
  edgeSize = edgeSize || HexPath.HEX_EDGE_SIZE;
  // pseudo-stroke: leave some space between hexes
  edgeSize -= 1.5;

  var hexPath = new Path2D();

  for (var cornerIndex = 0; cornerIndex <= 6; cornerIndex++) {
    angleDeg = 60 * cornerIndex + 30;
    angleRad = Math.PI / 180 * angleDeg;
    cornerPoint.x = center.x + edgeSize * Math.cos(angleRad);
    cornerPoint.y = center.y + edgeSize * Math.sin(angleRad);

    if (cornerIndex === 0) {
      hexPath.moveTo(cornerPoint.x, cornerPoint.y);
    } else {
      hexPath.lineTo(cornerPoint.x, cornerPoint.y);
    }
  }
  return hexPath;
}

/**
 * Get the position of the center of the hex.
 * @param  {number} row - Hex row index.
 * @param  {number} col - Hex column index.
 * @param  {number} edgeSize - Size of the hex edge.
 * @param  {Point} origin - [X, Y] position of the center of the first (0,0) hex.
 * @return {Point} [X, Y] position of the center of the hex at [row, col].
 */
HexPath.getHexCenterPosition = function(row, col, edgeSize, origin) {
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

HexPath.getHexDimensions = function() {
  var height = HexPath.HEX_EDGE_SIZE * 2;
  var width = Math.sqrt(3)/2 * height;
  return {
    height: height,
    width: width
  };  
};

HexPath.calculateGridSize = function(viewportSize) {
  var hexDimensions = HexPath.getHexDimensions();
  var firstHexHeigth = hexDimensions.height;
  var nthHexHeigth = Math.ceil(hexDimensions.height * 3 / 4);
  
  var rowCount = Math.floor((viewportSize.height - firstHexHeigth) / nthHexHeigth) + 1;
  var colCount = Math.floor(viewportSize.width / hexDimensions.width);
  colCount = Math.min(colCount, rowCount);
  return {
    rowCount: rowCount,
    colCount: colCount,
  }
};

/* harmony default export */ __webpack_exports__["a"] = (HexPath);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board_generator__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__player__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__npc__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__grid__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__random__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__board__ = __webpack_require__(1);
/**
 * Initial game setup  ; player click handler ; main game events (advance, grow)
 */








function Game(rowCount, colCount, playerCount) {
  this.rowCount = rowCount;
  this.colCount = colCount;
  this.playerCount = playerCount;
  this.npcs = [];
  this.player = undefined;
  this.originCell = undefined;
}

Game.PLAYER_ID = 0;
Game.MAX_POPULATION = 10;

Game.prototype.init = function() {
  var boardGenerator = new __WEBPACK_IMPORTED_MODULE_0__board_generator__["a" /* default */](this.rowCount, this.colCount, this.playerCount)
  this.board = boardGenerator.generateBoard();
  this.player = new __WEBPACK_IMPORTED_MODULE_1__player__["a" /* default */](Game.PLAYER_ID);
  this.npcs = [];
  for (var player = 1; player < this.playerCount; player++) {
    this.npcs.push(new __WEBPACK_IMPORTED_MODULE_2__npc__["a" /* default */](player, this.board));
  }

  this.grid = new __WEBPACK_IMPORTED_MODULE_3__grid__["a" /* default */](this.board, this);
  this.grid.draw();
};

Game.prototype.grow = function() {
  this.board.getOcuppiedCells().forEach(function(cell) {
    var max = Math.min(cell.population, 3);
    var growth = __WEBPACK_IMPORTED_MODULE_4__random__["a" /* default */].getRandomIntInclusive(0, max);
    var newPopulation = Math.min(cell.population + growth, Game.MAX_POPULATION);
    cell.population = newPopulation;
  });
};

Game.prototype.onAdvanceTurn = function() {
  this.unselectOrigin();
  this.npcs.forEach(function (player) { player.playTurn.call(player); });
  this.grow();
  this.grid.draw();
};

Game.prototype.onPlayerDoubleClick = function(clickedCell) {
  this.resolvePlayerAction(clickedCell, __WEBPACK_IMPORTED_MODULE_1__player__["a" /* default */].MOVE_TYPE_GROUP);
};

Game.prototype.onPlayerShiftClick = function(clickedCell) {
  this.unselectOrigin();
  this.player.moveAllAdjacentToCell(clickedCell);
  this.grid.draw();
};

Game.prototype.onPlayerClick = function(clickedCell) {
  this.resolvePlayerAction(clickedCell, __WEBPACK_IMPORTED_MODULE_1__player__["a" /* default */].MOVE_TYPE_SINGLE);
};

Game.prototype.resolvePlayerAction = function(clickedCell, moveType) {
  moveType = moveType || __WEBPACK_IMPORTED_MODULE_1__player__["a" /* default */].MOVE_TYPE_SINGLE;
  var isClickOnEmpty = (clickedCell === undefined);
  var isOriginSet = (this.originCell !== undefined);
  var isTargetOccupiedByPlayer = (clickedCell && clickedCell.player === Game.PLAYER_ID);
  var isTargetUnoccupied = (clickedCell && clickedCell.player === undefined);
  var isTargetOccupiedByOtherPlayer = (!isTargetOccupiedByPlayer && !isTargetUnoccupied);

  if (isClickOnEmpty) {
      this.unselectOrigin();
  }
  else if (!isOriginSet) {
    // CLICKED is player cell?
    if (isTargetOccupiedByPlayer) {
      // set ORIGIN
      this.originCell = clickedCell;
      this.grid.selectCell(this.originCell);
    }
    // CLICKED is NOT player cell? -> ignore.
  }
  // ORIGIN is set:
  else {
    var isTargetAndOriginTheSame = __WEBPACK_IMPORTED_MODULE_5__board__["a" /* default */].isSameCoordinates(this.originCell, clickedCell);
    var isTargetAndOriginAdjacent = __WEBPACK_IMPORTED_MODULE_5__board__["a" /* default */].isAdjacent(this.originCell, clickedCell);

    if(isTargetAndOriginTheSame) {
      // unset ORIGIN
      this.unselectOrigin();
    }
    else if (isTargetAndOriginAdjacent) {
      if (isTargetOccupiedByOtherPlayer) {
        // Attack
        this.player.attack(this.originCell, clickedCell); 
      }
      // TARGET is occupied by player or unoccupied
      else {
        // move 1 pop to CLICKED
        this.player.moveToCell(this.originCell, clickedCell, moveType);
      }
    }
    // CLICKED is NOT adjacent to ORIGIN
    else {
      if (isTargetOccupiedByPlayer) {
        // set ORIGIN
        this.originCell = clickedCell;
        this.grid.selectCell(this.originCell);
      }
      // TARGET is occupied by other player or unoccupied
      else {
        this.unselectOrigin();
      }
    }
  }
  // unselect cell if no more actions are possible
  if (this.originCell && this.originCell.population === 1) {
    this.unselectOrigin();
  }

  this.grid.draw();
};

Game.prototype.unselectOrigin = function(cell) {
  this.originCell = undefined;
  this.grid.unselectCell();
};

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__random__ = __webpack_require__(0);
/**
 * Generate random board configurations.
 */




var CONTINUE_TRACK_CHANCE = 0.7;

function BoardGenerator(rowCount, colCount, playerCount) {
  this.playerCount = playerCount;
  this.rowCount = rowCount;
  this.colCount = colCount;
  var maxDimension = Math.max(rowCount, colCount);
  this.maxEmpty = Math.round((maxDimension * maxDimension) / 2);
  this.minEmpty = Math.round(this.maxEmpty * 0.7);
}

BoardGenerator.prototype.generateBoard = function() {
  this.emptyCount = 0;
  this.board = new __WEBPACK_IMPORTED_MODULE_0__board__["a" /* default */](this.rowCount, this.colCount);
  this.removeSomeCells();

  var playerCells = this.getRandomCells(this.playerCount);
  playerCells.forEach(function (cell, index) {
    cell.player = index;
    cell.population = 3;
  });

  return this.board;
}

BoardGenerator.prototype.removeSomeCells = function() {
  while (this.emptyCount < this.minEmpty) {
    var cell = this.getRandomCells()[0];
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
      __WEBPACK_IMPORTED_MODULE_1__random__["a" /* default */].yesOrNo(CONTINUE_TRACK_CHANCE)) {
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

BoardGenerator.prototype.getRandomCells = function(count) {
  count = count || 1;
  var cells = [];
  var nonEmpty = this.board.getNonEmptyCells();

  while (cells.length < count && nonEmpty.length > 0) {
    var index = __WEBPACK_IMPORTED_MODULE_1__random__["a" /* default */].getRandomIntExclusive(0, nonEmpty.length);
    cells.push(nonEmpty[index]);
    nonEmpty.splice(index, 1);
  }
  return cells;
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
  var index = __WEBPACK_IMPORTED_MODULE_1__random__["a" /* default */].getRandomIntExclusive(0, adjacentCells.length);
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
  if (cell.isConnected) {
    return;
  }
  cell.isConnected = true;
  var adjacentCells = this.board.getAdjacentCells(cell);

  adjacentCells.filter(function(adjacent) {
    return !adjacent.isConnected && !adjacent.isEmpty;
  }).forEach(function (adjacent) {
    this.connectCellAndAdjcent(adjacent);
  }.bind(this));
}

/* harmony default export */ __webpack_exports__["a"] = (BoardGenerator);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__attack__ = __webpack_require__(3);
/**
 * Knows how to execute player actions.
 */



function Player(id) {
  this.id = id;
}
Player.POPULATION_GROUP_SIZE = 3;
Player.MOVE_TYPE_ALL = 'all';
Player.MOVE_TYPE_GROUP = 'group';
Player.MOVE_TYPE_SINGLE = 'single';

Player.prototype.moveAllAdjacentToCell = function(targetCell) {
  if (targetCell.player != this.id && targetCell.player !== undefined) {
    //Trying to move to an cell occupied by other player!
    return;
  }
  var adjcentPlayerCellsWithPopulation = this._getAdjcentPlayerCellsWithPopulation(targetCell);
  adjcentPlayerCellsWithPopulation.forEach(function (originCell) {
    this.moveToCell(originCell, targetCell, Player.MOVE_TYPE_ALL);
  }.bind(this));
};
/**
 * Move population from origin to target.
 * @param  {Cell} originCell
 * @param  {Cell} targetCell 
 * @param  {string} typeOfMove - Determine the population to move:
 *    all: move all available population.
 *    group: move a fixed number (POPULATION_GROUP_SIZE).
 *    sigle: move 1.
 */
Player.prototype.moveToCell = function(originCell, targetCell, typeOfMove) {
  if (originCell.player != this.id) {
    //Trying to move from a cell that is not occupied by player!
    return;
  }
  var availablePopulation = originCell.population - 1;
  if (availablePopulation < 1) {
    return;
  }

  var movingPopulation = 1;
  if (typeOfMove === 'all') {
    movingPopulation = availablePopulation;
  } else if (typeOfMove === 'group') {
    Math.min(availablePopulation, Player.POPULATION_GROUP_SIZE);
  }

  if (movingPopulation > 0) {
    originCell.population -= movingPopulation;
    targetCell.player = this.id;
    targetCell.population += movingPopulation;
  }
};

Player.prototype.moveToEmptyCell = function(targetCell) {
  if (targetCell.population > 0) {
    return;
  }
  var adjcentPlayerCellsWithPopulation = this._getAdjcentPlayerCellsWithPopulation(targetCell);

  var totalMovingPopulation = 0;
  adjcentPlayerCellsWithPopulation.forEach(function (playerCell) {
    var moving = Math.ceil(playerCell.population / 2);
    totalMovingPopulation += moving;
    playerCell.population -= moving;
  });

  if (totalMovingPopulation > 0) {
    targetCell.player = this.id;
    targetCell.population = totalMovingPopulation;
  }
};

Player.prototype.attack = function(originCell, targetCell) {
    var attackingPopulation = originCell.population - 1;
    var defendingPopulation = targetCell.population;
    var result = __WEBPACK_IMPORTED_MODULE_0__attack__["a" /* default */].simulateRiskAttack(attackingPopulation, defendingPopulation);
    __WEBPACK_IMPORTED_MODULE_0__attack__["a" /* default */].updatePopulationAfterAttack(originCell, targetCell, result);
};

Player.prototype.attackFromAllAdjacent = function(targetCell) {
  var attackerCells = this._getAdjcentPlayerCellsWithPopulation(targetCell);
  for (var i = 0 ; i < attackerCells.length ; i++) {
    var attackerCell = attackerCells[i];
    var attackingPopulation = attackerCell.population - 1;
    var defendingPopulation = targetCell.population;
    var result = __WEBPACK_IMPORTED_MODULE_0__attack__["a" /* default */].simulateRiskAttack(attackingPopulation, defendingPopulation);

    __WEBPACK_IMPORTED_MODULE_0__attack__["a" /* default */].updatePopulationAfterAttack(attackerCell, targetCell, result);
    if (result.attackWin) {
      break;
    }
  }
};

Player.prototype._getAdjcentPlayerCellsWithPopulation = function(targetCell) {
  var playerId = this.id;
  return targetCell.board
    .getAdjacentCells(targetCell)
    .filter(function(c) { return c.player === playerId && c.population > 1; });
};

/* harmony default export */ __webpack_exports__["a"] = (Player);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__random__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__npc_action_resolvers__ = __webpack_require__(10);
/**
 * Knows how to play as a NPC.
 */




function Npc(id, board) {
  this.id = id;
  this.board = board;
  this.actionResolvers = [
    __WEBPACK_IMPORTED_MODULE_1__npc_action_resolvers__["a" /* default */].spreadMove,
    __WEBPACK_IMPORTED_MODULE_1__npc_action_resolvers__["a" /* default */].stay,
    __WEBPACK_IMPORTED_MODULE_1__npc_action_resolvers__["a" /* default */].kamikazeAttack,
    __WEBPACK_IMPORTED_MODULE_1__npc_action_resolvers__["a" /* default */].attackIfStronger
  ];
}

Npc.prototype.playTurn = function() {
  //remove noAction flags
  this.board.getPlayerCells(this.id).forEach(function (c) {c.noAction = false;});
  var resolvers = this.actionResolvers;

  var possibleActions = this.getPossibleActions();
  // TODO Here the magic should happen: given the possible actions and the resolvers, the NPC should decide what to do.
  while(possibleActions.length) {
    resolvers = __WEBPACK_IMPORTED_MODULE_0__random__["a" /* default */].shuffle(resolvers);
    resolvers.forEach(function(actionResolverFn) {
      actionResolverFn(possibleActions);
      possibleActions = this.getPossibleActions();
    }.bind(this));
  }
};

Npc.prototype.getPossibleActions = function() {
  var cellsWithPossibleActions = this.board.getPlayerCells(this.id).filter(function(cell) {
    return cell.population > 1 && cell.noAction !== true;
  });
  var possibleActions = cellsWithPossibleActions.map(this.getPossibleActionsOnCell.bind(this));
  // flatten possibleActions, an array of arrays
  return [].concat.apply([], possibleActions);
};

Npc.prototype.getPossibleActionsOnCell = function(originCell) {
  var playerId = this.id;
  var adjacentCells = this.board.getAdjacentCells(originCell);
  var emptyCells = adjacentCells.filter(function(c) { return c.population === 0; });
  var enemyCells = adjacentCells.filter(function(c) { return c.population > 0 && c.player !== playerId; });

  var possibleActions = [{
      type: 'stay',
      origin: originCell
    }];
  
  // move to empty
  possibleActions.push({
    type: 'move',
    origin: originCell,
    targetCount: emptyCells.length,
    targets: emptyCells
  });

  //attack enemy
  enemyCells.forEach(function (enemyCell) {
    possibleActions.push({
      type: 'attack',
      origin: originCell,
      target: enemyCell,
      attackingPopulation: originCell.population,
      defendingPopulation: enemyCell.population,
      // add 50 to keep it positive
      positiveChances: 50 +  originCell.population - enemyCell.population,
      chances: originCell.population - enemyCell.population,
    });
  });
  return possibleActions;
};

/* harmony default export */ __webpack_exports__["a"] = (Npc);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__attack__ = __webpack_require__(3);
/**
 * Define the ways that a NPC can act given a list of possible actions.
 */



function NpcActionResolvers() {}

NpcActionResolvers.spreadMove = function(possibleActions) {
  var moveActions = possibleActions
    .filter(function(a) {return a.type === 'move';})
    .sort(function(a1, a2) {return a2.targetCount - a1.targetCount;});
  if (!moveActions.length) {
    return;
  }
  var origin = moveActions[0].origin;
  var targets = moveActions[0].targets;
  var playerId = origin.player;
  while (origin.population > 1 && targets.length > 0) {
    var target = targets.pop();
    var movingPopulation = 1;
    var stayingPopulation = origin.population - 1;
    // On the last target, move all
    if (!targets.length) {
      movingPopulation = origin.population - 1;
      stayingPopulation = 1;
    }
    target.player = playerId;
    target.population = movingPopulation;
    origin.population = stayingPopulation;
  }
};

NpcActionResolvers.stay = function(possibleActions) {
  var stayAction = possibleActions.find(function (a) {return a.type === 'stay';});
  if (stayAction) {
    stayAction.origin.noAction = true;
  }
};

/**
 * Attack without looking at the chances.
 */
NpcActionResolvers.kamikazeAttack = function(possibleActions) {
  var attackActions = possibleActions
    .filter(function(a) {return a.type === 'attack';})
    .sort(function(a1, a2) {return a2.positiveChances - a1.positiveChances;});
  if (!attackActions.length) {
    return;
  }
  var origin = attackActions[0].origin;
  var target = attackActions[0].target;
  var playerId = origin.player;

  var attackResult = __WEBPACK_IMPORTED_MODULE_0__attack__["a" /* default */].simulateRiskAttack(origin.population, target.population);
  __WEBPACK_IMPORTED_MODULE_0__attack__["a" /* default */].updatePopulationAfterAttack(origin, target, attackResult);
};

/**
 * Attack if the chances are good.
 */
NpcActionResolvers.attackIfStronger = function(possibleActions) {
  var attackActions = possibleActions
    .filter(function(a) {return a.type === 'attack' && a.chances > 0; })
    .sort(function(a1, a2) {return a2.positiveChances - a1.positiveChances;});
  if (!attackActions.length) {
    return;
  }
  var origin = attackActions[0].origin;
  var target = attackActions[0].target;
  var playerId = origin.player;

  var attackResult = __WEBPACK_IMPORTED_MODULE_0__attack__["a" /* default */].simulateRiskAttack(origin.population, target.population);
  __WEBPACK_IMPORTED_MODULE_0__attack__["a" /* default */].updatePopulationAfterAttack(origin, target, attackResult);
};

/* harmony default export */ __webpack_exports__["a"] = (NpcActionResolvers);


/***/ })
/******/ ]);