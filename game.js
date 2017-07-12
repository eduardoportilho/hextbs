function Game(gridDimention) {
  this.gridDimention = gridDimention;
}

Game.prototype.init = function() {
  this.grid = new Grid(this.gridDimention);
  this.grid.draw();
};

var game = new Game(10);
game.init();