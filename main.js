function draw() {
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');

  var edgeSize = 50;
  var hexHeight = edgeSize * 2;
  var hexWidth = Math.sqrt(3)/2 * hexHeight;
  var centerDistance = {
    x: hexWidth / 2,
    y: 3 * hexHeight/4
  }

  var hex = buildHex(edgeSize);

  ctx.fillStyle = 'orange';
  ctx.strokeStyle = 'blue';

  ctx.translate(100, 100);

  ctx.fill(hex);
  ctx.stroke(hex);

  ctx.translate(centerDistance.x, centerDistance.y);
  ctx.fill(hex);
  ctx.stroke(hex);

  ctx.translate(centerDistance.x, - centerDistance.y);
  ctx.fill(hex);
  ctx.stroke(hex);
}

function buildHex(edgeSize) {
  var cornerPoint = {x:0, y:0},
    angleDeg, 
    angleRad;
  edgeSize = edgeSize || 50;

  var hex = new Path2D();
  for (var cornerIndex = 0; cornerIndex <= 6; cornerIndex++) {
    angleDeg = 60 * cornerIndex + 30;
    angleRad = Math.PI / 180 * angleDeg;
    cornerPoint.x = edgeSize * Math.cos(angleRad);
    cornerPoint.y = edgeSize * Math.sin(angleRad);

    if (cornerIndex === 0) {
      hex.moveTo(cornerPoint.x, cornerPoint.y);
    } else {
      hex.lineTo(cornerPoint.x, cornerPoint.y);
    }
  }
  return hex;
}