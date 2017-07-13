function Game(gridDimension) {
  this.gridDimension = gridDimension;
}

Game.prototype.init = function() {
  var boardGenerator = new BoardGenerator(this.gridDimension)
  this.board = boardGenerator.generateBoard(5);
  this.grid = new Grid(this.board);
  this.grid.draw();
};

var game = new Game(10);
game.init();
