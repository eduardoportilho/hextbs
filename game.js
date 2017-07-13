/**
 * Knows about initial game setup and player actions.
 */

function Game(gridDimension) {
  this.gridDimension = gridDimension;
}

Game.PLAYER_ID = 0;

Game.prototype.init = function() {
  var boardGenerator = new BoardGenerator(this.gridDimension)
  this.board = boardGenerator.generateBoard(5);
  this.grid = new Grid(this.board, this);
  this.grid.draw();
};

Game.prototype.onPlayerClick = function(targetCell) {
  // ignore click on player cells
  if (targetCell.player === Game.PLAYER_ID) {
    return;
  }
  // if target cell is not ocuppied, move
  if (targetCell.player === undefined) {
    this.move(targetCell);
  }
  // if target cell is ocuppied, attack
  else {
    this.attack(targetCell); 
  }
  this.grid.draw();
};

Game.prototype.move = function(targetCell) {
  // assume that targetCell is not occupied
  var adjcentPlayerCells = this.board.getAdjacentCells(targetCell).filter(function(adjacent) {
    return adjacent.player === Game.PLAYER_ID &&
      adjacent.population > 1;
  });

  var movingPopulation = 0;
  adjcentPlayerCells.forEach(function (playerCell) {
    var half = Math.round(playerCell.population / 2);
    movingPopulation += half;
    playerCell.population -= half;
  });

  if (movingPopulation > 0) {
    targetCell.player = Game.PLAYER_ID;
    targetCell.population = movingPopulation;
  }
};

Game.prototype.attack = function(targetCell) {};

var game = new Game(10);
game.init();
