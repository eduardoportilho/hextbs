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