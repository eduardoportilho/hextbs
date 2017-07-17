/**
 * Knows how to execute player actions.
 */

function Player(id) {
  this.id = id;
}

Player.prototype.moveToCell = function(originCell, targetCell, populationToMove) {
  if (originCell.player != this.id) {
    throw new Error('Trying to move from a cell that is not occupied by player!');
  }
  var availablePopulation = originCell.population - 1;
  var movingPopulation = Math.min(populationToMove, availablePopulation);
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
