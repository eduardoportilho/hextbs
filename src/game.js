/**
 * Initial game setup  ; player click handler ; main game events (advance, grow)
 */

function Game(rowCount, colCount, playerCount) {
  this.rowCount = rowCount;
  this.colCount = colCount;
  this.playerCount = playerCount;
  this.npcs = [];
  this.player = undefined;
  this.originCell = undefined;
}

Game.PLAYER_ID = 0;
Game.MAX_POPULATION = 10;

Game.prototype.init = function() {
  var boardGenerator = new BoardGenerator(this.rowCount, this.colCount, this.playerCount)
  this.board = boardGenerator.generateBoard();
  this.player = new Player(Game.PLAYER_ID);
  this.npcs = [];
  for (var player = 1; player < this.playerCount; player++) {
    this.npcs.push(new Npc(player, this.board));
  }

  this.grid = new Grid(this.board, this);
  this.grid.draw();
};

Game.prototype.grow = function() {
  this.board.getOcuppiedCells().forEach(function(cell) {
    var max = Math.min(cell.population, 3);
    var growth = Random.getRandomIntInclusive(0, max);
    var newPopulation = Math.min(cell.population + growth, Game.MAX_POPULATION);
    cell.population = newPopulation;
  });
};

Game.prototype.onAdvanceTurn = function() {
  this.unselectOrigin();
  this.npcs.forEach(function (player) { player.playTurn.call(player); });
  this.grow();
  this.grid.draw();
};

Game.prototype.onPlayerDoubleClick = function(clickedCell) {
  this.resolvePlayerAction(clickedCell, Player.MOVE_TYPE_GROUP);
};

Game.prototype.onPlayerShiftClick = function(clickedCell) {
  this.unselectOrigin();
  this.player.moveAllAdjacentToCell(clickedCell);
  this.grid.draw();
};

Game.prototype.onPlayerClick = function(clickedCell) {
  this.resolvePlayerAction(clickedCell, Player.MOVE_TYPE_SINGLE);
};

Game.prototype.resolvePlayerAction = function(clickedCell, moveType) {
  moveType = moveType || Player.MOVE_TYPE_SINGLE;
  var isClickOnEmpty = (clickedCell === undefined);
  var isOriginSet = (this.originCell !== undefined);
  var isTargetOccupiedByPlayer = (clickedCell && clickedCell.player === Game.PLAYER_ID);
  var isTargetUnoccupied = (clickedCell && clickedCell.player === undefined);
  var isTargetOccupiedByOtherPlayer = (!isTargetOccupiedByPlayer && !isTargetUnoccupied);

  if (isClickOnEmpty) {
      this.unselectOrigin();
  }
  else if (!isOriginSet) {
    // CLICKED is player cell?
    if (isTargetOccupiedByPlayer) {
      // set ORIGIN
      this.originCell = clickedCell;
      this.grid.selectCell(this.originCell);
    }
    // CLICKED is NOT player cell? -> ignore.
  }
  // ORIGIN is set:
  else {
    var isTargetAndOriginTheSame = Board.isSameCoordinates(this.originCell, clickedCell);
    var isTargetAndOriginAdjacent = Board.isAdjacent(this.originCell, clickedCell);

    if(isTargetAndOriginTheSame) {
      // unset ORIGIN
      this.unselectOrigin();
    }
    else if (isTargetAndOriginAdjacent) {
      if (isTargetOccupiedByOtherPlayer) {
        // Attack
        this.player.attack(this.originCell, clickedCell); 
      }
      // TARGET is occupied by player or unoccupied
      else {
        // move 1 pop to CLICKED
        this.player.moveToCell(this.originCell, clickedCell, moveType);
      }
    }
    // CLICKED is NOT adjacent to ORIGIN
    else {
      if (isTargetOccupiedByPlayer) {
        // set ORIGIN
        this.originCell = clickedCell;
        this.grid.selectCell(this.originCell);
      }
      // TARGET is occupied by other player or unoccupied
      else {
        this.unselectOrigin();
      }
    }
  }
  // unselect cell if no more actions are possible
  if (this.originCell && this.originCell.population === 1) {
    this.unselectOrigin();
  }

  this.grid.draw();
};

Game.prototype.unselectOrigin = function(cell) {
  this.originCell = undefined;
  this.grid.unselectCell();
};

var canvasSize = Grid.calculateCanvasSize();
var canvas = document.getElementById('game');
canvas.height = canvasSize.height;
canvas.width = canvasSize.width;

var container = document.querySelector('.container');
container.setAttribute("style", "width: " + canvasSize.width + "px;");

var game = new Game(canvasSize.rowCount, canvasSize.colCount, 5);
game.init();
