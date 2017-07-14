/**
 * Knows about initial game setup and player actions.
 */

function Game(gridDimension, playerCount) {
  this.gridDimension = gridDimension;
  this.playerCount = playerCount;
  this.players = [];
}

Game.PLAYER_ID = 0;

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
    cell.population += growth;
  });
};

Game.prototype.onAdvanceTurn = function() {
  this.players.forEach(function (player) { player.play.call(player); });
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

  var defendingPopulation = targetCell.population;
  for (var i = 0 ; i < attackingCells.length ; i++) {
    var attackerCell = attackingCells[i];
    var attackingPopulation = attackerCell.population - 1;
    var result = this.simulateRiskAttack(attackingPopulation, defendingPopulation);

    attackingPopulation -= result.attackerKills;
    if (result.attackWin) {
      attackerCell.population = 1;
      targetCell.population = attackingPopulation;
      targetCell.player = attackerId;
      break;
    } else {
      defendingPopulation -= result.defenderKills;
      attackerCell.population = attackingPopulation + 1;
      targetCell.population = defendingPopulation;
    }
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
Game.prototype.simulateRiskAttack = function(attackingPopulation, defendingPopulation) {
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
}

/**
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
