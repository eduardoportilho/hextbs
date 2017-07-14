function Npc(id, board) {
  this.id = id;
  this.board = board;
  this.actionResolvers = [
    Npc.ACTION_RESOLVERS.spreadMove,
    Npc.ACTION_RESOLVERS.stay,
  ];
}

Npc.prototype.playTurn = function() {
  //remove noAction flags
  this.board.getPlayerCells(this.id).forEach(function (c) {c.noAction = false;});

  var possibleActions = this.getPossibleActions();
  while(possibleActions.length) {
    this.actionResolvers.forEach(function(actionResolverFn) {
      actionResolverFn(possibleActions);
      possibleActions = this.getPossibleActions();
    }.bind(this));
  }
};

Npc.prototype.getPossibleActions = function() {
  var cellsWithPossibleActions = this.board.getPlayerCells(this.id).filter(function(cell) {
    return cell.population > 1 && cell.noAction !== true;
  });
  var possibleActions = cellsWithPossibleActions.map(this.getPossibleActionsOnCell.bind(this));
  // flatten possibleActions, an array of arrays
  return [].concat.apply([], possibleActions);
};

Npc.prototype.getPossibleActionsOnCell = function(originCell) {
  var playerId = this.id;
  var adjacentCells = this.board.getAdjacentCells(originCell);
  var emptyCells = adjacentCells.filter(function(c) { return c.population === 0; });
  var enemyCells = adjacentCells.filter(function(c) { return c.population > 0 && c.player !== playerId; });

  var possibleActions = [{
      type: 'stay',
      origin: originCell
    }];
  
  // move to empty
  possibleActions.push({
    type: 'move',
    origin: originCell,
    targetCount: emptyCells.length,
    targets: emptyCells
  });

  //attack enemy
  enemyCells.forEach(function (enemyCell) {
    possibleActions.push({
      type: 'attack',
      origin: originCell,
      target: enemyCell,
      attackingPopulation: originCell.population,
      defendingPopulation: enemyCell.population,
      chances: originCell.population - enemyCell.population,
    });
  });
  return possibleActions;
};

Npc.ACTION_RESOLVERS = {
  spreadMove: function(possibleActions) {
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
  },
  stay: function(possibleActions) {
    var stayAction = possibleActions.find(function (a) {return a.type === 'stay';});
    if (stayAction) {
      stayAction.origin.noAction = true;
    }
  }
};
