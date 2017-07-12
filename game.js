function Game(gridDimension) {
  this.gridDimension = gridDimension;
}

Game.prototype.init = function() {
  this.grid = new Grid(this.gridDimension);
  var boardGenerator = new BoardGenerator(this.gridDimension)
  var board = boardGenerator.generateBoard();
  this.grid.setEmptyCells(board);
  this.grid.draw();
};


Game.prototype.buildBoard = function() {
  var board = [];
  for (var row = 0; row < this.dimension ; row++) {
    board.push([]);
    for (var col = 0; col < this.dimension ; col++) {
      board.push(true);
    }
  }
}

var game = new Game(10);
game.init();