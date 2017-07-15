/**
 * Knows how to draw a hex path.
 */

function HexPath() {}

HexPath.HEX_EDGE_SIZE = 30;

/**
 * Build a hex path with center on the provided position.
 * @param  {Point} center - [X, Y] position of the center of the hex.
 * @param  {number} edgeSize - Size of the hex edge.
 * @return {Path2D} Hex path.
 */
HexPath.buidHexPath = function(center, edgeSize) {
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
HexPath.getHexCenterPosition = function(row, col, edgeSize, origin) {
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

HexPath.getHexDimensions = function() {
  var height = HexPath.HEX_EDGE_SIZE * 2;
  var width = Math.sqrt(3)/2 * height;
  return {
    height: height,
    width: width
  };  
};

HexPath.calculateGridSize = function(viewportSize) {
  var hexDimensions = HexPath.getHexDimensions();
  var firstHexHeigth = hexDimensions.height;
  var nthHexHeigth = Math.ceil(hexDimensions.height * 3 / 4);
  
  var rowCount = Math.floor((viewport.height - firstHexHeigth) / nthHexHeigth) + 1;
  var colCount = Math.floor(viewport.width / hexDimensions.width);
  colCount = Math.min(colCount, rowCount);
  return {
    rowCount: rowCount,
    colCount: colCount,
  }
};
