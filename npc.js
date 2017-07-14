function Npc(id, board) {
  this.id = id;
  this.board = board;
}

Npc.prototype.playTurn = function() {
  var cellsWith2orMore = this.board.getPlayerCells(this.id).filter(function(cell) {
    return cell.population > 1;
  });
  cellsWith2orMore.forEach(this.playCell.bind(this));
};

Npc.prototype.playCell = function(cell) {
  var emptyAdjacents = this.board.getAdjacentCells(cell).filter(function(cell) {
    return cell.population === 0;
  });

  while (cell.population > 1 && emptyAdjacents.length > 0) {
    var target = emptyAdjacents.pop();
    target.player = this.id;
    target.population += 1;
    cell.population -= 1;
  }
};
