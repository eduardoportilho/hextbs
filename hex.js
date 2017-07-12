function Hex(row, col, centerPosition) {
  this.row = row;
  this.col = col;
  this.centerPosition = centerPosition;
  this.path = _buidHexPath(Hex.HEX_EDGE_SIZE, centerPosition);
  this.population =  0;
  this.isSelected = false;
}

Hex.HEX_EDGE_SIZE = 30;

/**
 * Build a hex path with center on the provided position.
 * @param  {number} edgeSize - Size of the hex edge.
 * @param  {Point} center - [X, Y] position of the center of the hex.
 * @return {Path2D} Hex path.
 */
function _buidHexPath(edgeSize, center) {
  var cornerPoint = {x:null, y:null},
    angleDeg, 
    angleRad;

  var hexPath = new Path2D();

  for (var cornerIndex = 0; cornerIndex <= 6; cornerIndex++) {
    angleDeg = 60 * cornerIndex + 30;
    angleRad = Math.PI / 180 * angleDeg;
    cornerPoint.x = center.x + edgeSize * Math.cos(angleRad);
    cornerPoint.y = center.y + edgeSize * Math.sin(angleRad);

    if (cornerIndex === 0) {
      hexPath.moveTo(cornerPoint.x, cornerPoint.y);
    } else {
      hexPath.lineTo(cornerPoint.x, cornerPoint.y);
    }
  }
  return hexPath;
}
