/**
 * Define the ways that a NPC can act given a list of possible actions.
 */

import Attack from './attack';

function NpcActionResolvers() {}

NpcActionResolvers.singleCellMove = function(possibleActions) {
  var moveActions = possibleActions
    .filter(function(a) {return a.type === 'move';})
    .sort(function(a1, a2) {return a2.origin.population - a1.origin.population;}); 
  if (!moveActions.length) {
    return false;
  }
  var origin = moveActions[0].origin;
  var target = moveActions[0].targets[0];
  var playerId = origin.player;
  var movingPopulation = origin.population - 1;

  target.player = playerId;
  target.population = movingPopulation;
  origin.population = 1;
  console.log('NPC ' + playerId + ': singleCellMove');
  return true;
};

NpcActionResolvers.spreadMove = function(possibleActions) {
  var moveActions = possibleActions
    .filter(function(a) {return a.type === 'move';})
    .sort(function(a1, a2) {return a2.targetCount - a1.targetCount;});
  if (!moveActions.length) {
    return false;
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
  console.log('NPC ' + playerId + ': spreadMove');
  return true;
};

NpcActionResolvers.stay = function(possibleActions) {
  var stayAction = possibleActions.find(function (a) {return a.type === 'stay';});
  if (stayAction) {
    stayAction.origin.noAction = true;
    console.log('NPC ' + stayAction.origin.player + ': stay');
    return true;
  } else {
    return false;
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
    return false;
  }
  var origin = attackActions[0].origin;
  var target = attackActions[0].target;
  var playerId = origin.player;
  var attackingPopulation = origin.population - 1;

  var attackResult = Attack.simulateRiskAttack(attackingPopulation, target.population);
  Attack.updatePopulationAfterAttack(origin, target, attackResult);
  console.log('NPC ' + playerId + ': kamikazeAttack');
  return true;
};

/**
 * Attack if the chances are good.
 */
NpcActionResolvers.attackIfStronger = function(possibleActions) {
  var attackActions = possibleActions
    .filter(function(a) {return a.type === 'attack' && a.chances > 0; })
    .sort(function(a1, a2) {return a2.positiveChances - a1.positiveChances;});
  if (!attackActions.length) {
    return false;
  }
  var origin = attackActions[0].origin;
  var target = attackActions[0].target;
  var playerId = origin.player;
  var attackingPopulation = origin.population - 1;

  var attackResult = Attack.simulateRiskAttack(attackingPopulation, target.population);
  Attack.updatePopulationAfterAttack(origin, target, attackResult);
  console.log('NPC ' + playerId + ': attackIfStronger');
  return true;
};

export default NpcActionResolvers;
