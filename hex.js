function Hex(row, col, centerPosition) {
  this.row = row;
  this.col = col;
  this.centerPosition = centerPosition;
  this.path = Hex.buidHexPath(centerPosition);
  this.population =  0;
  this.isSelected = false;
  this.isEmpty = false;
}

Hex.HEX_EDGE_SIZE = 30;

/**
 * Build a hex path with center on the provided position.
 * @param  {Point} center - [X, Y] position of the center of the hex.
 * @param  {number} edgeSize - Size of the hex edge.
 * @return {Path2D} Hex path.
 */
Hex.buidHexPath = function(center, edgeSize) {
  var cornerPoint = {x:null, y:null},
    angleDeg, 
    angleRad;
  edgeSize = edgeSize || Hex.HEX_EDGE_SIZE;

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

/**
 * Get the position of the center of the hex.
 * @param  {number} row - Hex row index.
 * @param  {number} col - Hex column index.
 * @param  {number} edgeSize - Size of the hex edge.
 * @param  {Point} origin - [X, Y] position of the center of the first (0,0) hex.
 * @return {Point} [X, Y] position of the center of the hex at [row, col].
 */
Hex.getHexCenterPosition = function(row, col, edgeSize, origin) {
  origin = origin;
  edgeSize = edgeSize || 50;
  var hexHeight = edgeSize * 2;
  var hexWidth = Math.sqrt(3)/2 * hexHeight;
  
  var x = col * hexWidth;
  var y = row * (3 * hexHeight / 4);
  if (row % 2 !== 0) {
    x += hexWidth / 2;
  }

  return {
    x: origin.x + x,
    y: origin.y + y,
  }
}
