function Npc(id, board) {
  this.id = id;
  this.board = board;
  this.actionResolvers = [
    NpcActionResolvers.spreadMove,
    NpcActionResolvers.stay,
  ];
}

Npc.prototype.playTurn = function() {
  //remove noAction flags
  this.board.getPlayerCells(this.id).forEach(function (c) {c.noAction = false;});
  var resolvers = this.actionResolvers;

  var possibleActions = this.getPossibleActions();
  while(possibleActions.length) {
    resolvers = Random.shuffle(resolvers);
    resolvers.forEach(function(actionResolverFn) {
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
