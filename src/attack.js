/**
 * Konws how to simulate attacks and update population after.
 */

import Random from './random';

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
    if (Random.yesOrNo()) {
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

export default Attack;
