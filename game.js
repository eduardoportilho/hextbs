/**
 * Knows about initial game setup and player actions.
 */

function Game(rowCount, colCount, playerCount, viewPort) {
  this.rowCount = rowCount;
  this.colCount = colCount;
  this.playerCount = playerCount;
  this.npcs = [];
  this.player = undefined;
}

Game.PLAYER_ID = 0;
Game.MAX_POPULATION = 10;

Game.prototype.init = function() {
  var boardGenerator = new BoardGenerator(this.rowCount, this.colCount, this.playerCount)
  this.board = boardGenerator.generateBoard();
  this.player = new Player(Game.PLAYER_ID);
  this.npcs = [];
  for (var player = 1; player < this.playerCount; player++) {
    this.npcs.push(new Npc(player, this.board));
  }

  this.grid = new Grid(this.board, this);
  this.grid.draw();
};

Game.prototype.grow = function() {
  this.board.getOcuppiedCells().forEach(function(cell) {
    var max = Math.min(cell.population, 3);
    var growth = Random.getRandomIntInclusive(0, max);
    var newPopulation = Math.min(cell.population + growth, Game.MAX_POPULATION);
    cell.population = newPopulation;
  });
};

Game.prototype.onAdvanceTurn = function() {
  this.npcs.forEach(function (player) { player.playTurn.call(player); });
  this.grow();
  this.grid.draw();
};

Game.prototype.onPlayerClick = function(targetCell) {
  // ignore click on player cells
  if (targetCell.player === Game.PLAYER_ID) {
    return;
  }
  // if target cell is not ocuppied, move
  if (targetCell.player === undefined) {
    this.player.moveToEmptyCell(targetCell);
  }
  // if target cell is ocuppied, attack
  else {
    this.player.attack(targetCell); 
  }
  this.grid.draw();
};

var viewportWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || 0) - 30;
var viewportHeight = Math.min(document.documentElement.clientHeight, window.innerHeight || 0) - 50;
var viewport = {width: viewportWidth, height: viewportHeight};


var canvas = document.getElementById('game');
canvas.width = viewportWidth;
canvas.height = viewportHeight;

var container = document.querySelector('.container');

var hexDimensions = HexPath.getHexDimensions();
var firstHexHeigth = hexDimensions.height;
var nthHexHeigth = Math.ceil(hexDimensions.height * 3 / 4);


var rowCount = Math.floor((viewportHeight - firstHexHeigth) / nthHexHeigth) + 1;
var colCount = Math.floor(viewportWidth / hexDimensions.width);
colCount = Math.min(colCount, rowCount);

var canvasWidth = (colCount + 1) * hexDimensions.width;
canvas.width = canvasWidth;
container.setAttribute("style", "width: " + canvasWidth + "px;");


var game = new Game(rowCount, colCount, 5, viewport);
game.init();
