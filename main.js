function draw() {
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');

  var edgeSize = 50,
    origin =  {x: 100, y: 100};

  ctx.fillStyle = 'orange';
  ctx.strokeStyle = 'blue';

  for (var row = 0; row < 5 ; row++) {
    for (var col = 0; col < 5 ; col++) {
      var center = offsetCoordPoint(row, col, edgeSize, origin);
      var hex = buildHex(edgeSize, center);
      ctx.fill(hex);
      ctx.stroke(hex);
    }
  }
}

/**
 * Build a hex path with center on the provided position.
 * @param  {number} edgeSize - Size of the hex edge.
 * @param  {Point} center - [X, Y] position of the center of the hex.
 * @return {Path2D} Hex path.
 */
function buildHex(edgeSize, center) {
  var cornerPoint = {x:0, y:0},
    angleDeg, 
    angleRad;
  edgeSize = edgeSize || 50;
  center = center || {x:0, y:0};

  var hex = new Path2D();
  for (var cornerIndex = 0; cornerIndex <= 6; cornerIndex++) {
    angleDeg = 60 * cornerIndex + 30;
    angleRad = Math.PI / 180 * angleDeg;
    cornerPoint.x = center.x + edgeSize * Math.cos(angleRad);
    cornerPoint.y = center.y + edgeSize * Math.sin(angleRad);

    if (cornerIndex === 0) {
      hex.moveTo(cornerPoint.x, cornerPoint.y);
    } else {
      hex.lineTo(cornerPoint.x, cornerPoint.y);
    }
  }
  return hex;
}

/**
 * Convert an offset cordinate (i.e. hex row and column index) to [X, Y] values. 
 * @param  {number} row - Hex row index.
 * @param  {number} col - Hex column index.
 * @param  {number} edgeSize - Size of the hex edge.
 * @param  {Point} origin - [X, Y] position of the center of the first (0,0) hex.
 * @return {Point} [X, Y] position of the center of the hex at [row, col].
 */
function offsetCoordPoint(row, col, edgeSize, origin) {
  origin = origin || {x:0, y:0};
  edgeSize = edgeSize || 50;
  var hexHeight = edgeSize * 2;
  var hexWidth = Math.sqrt(3)/2 * hexHeight;
  
  var x = col * hexWidth;
  var y = row * (3 * hexHeight / 4);
  if (row % 2 === 0) {
    x += hexWidth / 2;
  }

  return {
    x: origin.x + x,
    y: origin.y + y,
  }
}
