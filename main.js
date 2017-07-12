var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var gridDimension = 5;
var edgeSize = 50;
var origin =  {x: 100, y: 100};

var hexes = {};
var highlightedHex = undefined;

canvas.onmousemove = function(e) {
  var mousePosition = {
    x: e.clientX - e.target.offsetLeft,
    y: e.clientY - e.target.offsetTop    
  };
  var hexOverMouse = getHexContainingPoint(mousePosition);
  if (!isSameHexCoords(hexOverMouse, highlightedHex)) {
    highlightedHex = hexOverMouse;
    draw();
  }
};

function draw() {

  hexes = {};
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var row = 0; row < gridDimension ; row++) {
    hexes[row] = {};

    for (var col = 0; col < gridDimension ; col++) {
      var isHover = highlightedHex && highlightedHex.col === col && highlightedHex.row === row;
      style(isHover);

      var center = getHexCenterPoint(row, col, edgeSize, origin);
      var hex = buildHex(edgeSize, center);
      hexes[row][col] = hex;
      ctx.fill(hex);
      ctx.stroke(hex);
    }
  }
}

function style(hover) {
  if (hover) {
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'orange';
  } else {
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = 'blue';
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
function getHexCenterPoint(row, col, edgeSize, origin) {
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

function getHexContainingPoint(point) {
  for (var row = 0; row < gridDimension ; row++) {
    for (var col = 0; col < gridDimension ; col++) {
      var hex = hexes[row][col];
      if (ctx.isPointInPath(hex, point.x, point.y)) {
        return {row: row, col: col};
      }
    }
  }
  return undefined;
}

function isSameHexCoords(coord1, coord2) {
  var row1 = coord1 ? coord1.row : undefined,
      row2 = coord2 ? coord2.row : undefined,
      col1 = coord1 ? coord1.col : undefined,
      col2 = coord2 ? coord2.col : undefined;
  return row1 === row2 && col1 === col2;
}
