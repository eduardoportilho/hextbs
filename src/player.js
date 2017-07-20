/**
 * Knows how to execute player actions.
 */

import Attack from './attack';

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
    var result = Attack.simulateRiskAttack(attackingPopulation, defendingPopulation);
    Attack.updatePopulationAfterAttack(originCell, targetCell, result);
};

Player.prototype.attackFromAllAdjacent = function(targetCell) {
  var attackerCells = this._getAdjcentPlayerCellsWithPopulation(targetCell);
  for (var i = 0 ; i < attackerCells.length ; i++) {
    var attackerCell = attackerCells[i];
    var attackingPopulation = attackerCell.population - 1;
    var defendingPopulation = targetCell.population;
    var result = Attack.simulateRiskAttack(attackingPopulation, defendingPopulation);

    Attack.updatePopulationAfterAttack(attackerCell, targetCell, result);
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

export default Player;
