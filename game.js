/**
 * Knows about initial game setup and player actions.
 */

function Game(gridDimension) {
  this.gridDimension = gridDimension;
}

Game.PLAYER_ID = 0;

Game.prototype.init = function() {
  var boardGenerator = new BoardGenerator(this.gridDimension)
  this.board = boardGenerator.generateBoard(5);
  this.grid = new Grid(this.board, this);
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
  // assume that targetCell is occupied
  var attackingPopulation = this.allocateAdjacentPopulation(targetCell, Game.PLAYER_ID, true);
  var deffendingPopulation = targetCell.population;
  var battleResult = this.battleResult(attackingPopulation, deffendingPopulation);

  targetCell.population = battleResult.survivors;
  if (battleResult.attackWin) {
    targetCell.player = Game.PLAYER_ID;
  }
};


Game.prototype.battleResult = function(attackingPopulation, deffendingPopulation) {
  // TODO: implement battle logic
  var atackWin = Random.yesOrNo();
  var survivors = Random.getRandomInt(1, (atackWin ? attackingPopulation : deffendingPopulation));
  return {
    attackWin: atackWin,
    survivors: survivors
  };
}

/**
 * Subtract half of the population of all player cells adjacent
 * to target and return the total subtracted.
 * @param  {Cell} targetCell - Destination cell.
 * @return {number} Subtracted population
 */
Game.prototype.allocateAdjacentPopulation = function(targetCell, playerId, attack) {
  var adjcentPlayerCells = this.board.getAdjacentCells(targetCell)
    .filter(function(adjacent) {
      return adjacent.player === playerId &&
        adjacent.population > 1;
    });

  var movingTotal = 0;
  adjcentPlayerCells.forEach(function (playerCell) {
    var moving = attack ? 
      playerCell.population - 1 :
      Math.floor(playerCell.population / 2);
    movingTotal += moving;
    playerCell.population -= moving;
  });
  return movingTotal;
};

var game = new Game(10);
game.init();
