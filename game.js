/**
 * Knows about initial game setup and player actions.
 */

function Game(gridDimension, playerCount) {
  this.gridDimension = gridDimension;
  this.playerCount = playerCount;
  this.players = [];
}

Game.PLAYER_ID = 0;
Game.MAX_POPULATION = 10;

Game.prototype.init = function() {
  var boardGenerator = new BoardGenerator(this.gridDimension, this.playerCount)
  this.board = boardGenerator.generateBoard();
  this.players = [];
  for (var player = 1; player < this.playerCount; player++) {
    this.players.push(new Npc(player, this.board));
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
  this.players.forEach(function (player) { player.playTurn.call(player); });
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
  var movingPopulation = this.allocateAdjacentPopulation(targetCell, Game.PLAYER_ID, false);
  if (movingPopulation > 0) {
    targetCell.player = Game.PLAYER_ID;
    targetCell.population = movingPopulation;
  }
};

Game.prototype.attack = function(targetCell) {
  var attackerId = Game.PLAYER_ID;
  var attackingCells = this.board.getAdjacentCells(targetCell)
    .filter(function(adjacent) {
      return adjacent.player === attackerId &&
        adjacent.population > 1;
    });

  for (var i = 0 ; i < attackingCells.length ; i++) {
    var attackerCell = attackingCells[i];
    var attackingPopulation = attackerCell.population - 1;
    var defendingPopulation = targetCell.population;
    var result = Random.simulateRiskAttack(attackingPopulation, defendingPopulation);

    CellMovement.updatePopulationAfterAttack(attackerCell, targetCell, result);
    if (result.attackWin) {
      break;
    }
  }
};

/**
 * TODO: refator - find a better name.
 * 
 * Subtract half of the population of all player cells adjacent
 * to target and return the total subtracted.
 * @param  {Cell} targetCell - Destination cell.
 * @param  {number} playerId - Player of interest.
 * @return {number} Subtracted population.
 */
Game.prototype.allocateAdjacentPopulation = function(targetCell, playerId) {
  var adjcentPlayerCells = this.board.getAdjacentCells(targetCell)
    .filter(function(adjacent) {
      return adjacent.player === playerId &&
        adjacent.population > 1;
    });

  var movingTotal = 0;
  adjcentPlayerCells.forEach(function (playerCell) {
    var moving = Math.ceil(playerCell.population / 2);
    movingTotal += moving;
    playerCell.population -= moving;
  });
  return movingTotal;
};

var game = new Game(10, 5);
game.init();
