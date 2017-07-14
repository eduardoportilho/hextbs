function CellMovement() {}

CellMovement.updatePopulationAfterAttack = function (attackerCell, defendingCell, attackResult) {
    var attackingSurvivors = attackerCell.population - 1 - attackResult.attackerKills;
    if (attackResult.attackWin) {
      attackerCell.population = 1;
      defendingCell.population = attackingSurvivors;
      defendingCell.player = attackerCell.player;
      console.log(`Attacker won!`, attackerCell, defendingCell, attackResult); 
    } else {
      attackerCell.population = attackingSurvivors + 1;
      defendingCell.population -= attackResult.defenderKills;
    }
};
