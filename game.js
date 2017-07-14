/**
 * Knows about initial game setup and player actions.
 */

function Game(gridDimension, playerCount) {
  this.gridDimension = gridDimension;
  this.playerCount = playerCount;
  this.npcs = [];
  this.player = undefined;
}

Game.PLAYER_ID = 0;
Game.MAX_POPULATION = 10;

Game.prototype.init = function() {
  var boardGenerator = new BoardGenerator(this.gridDimension, this.playerCount)
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

var game = new Game(10, 5);
game.init();
