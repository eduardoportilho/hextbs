function draw() {
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');


  var center = {x:100, y:100},
    cornerPoint = {x:0, y:0},
    edgeSize = 50,
    angleDeg, 
    angleRad;

  ctx.beginPath();
  for (var cornerIndex = 0; cornerIndex <= 6; cornerIndex++) {
    angleDeg = 60 * cornerIndex + 30;
    angleRad = Math.PI / 180 * angleDeg;
    cornerPoint.x = center.x + edgeSize * Math.cos(angleRad);
    cornerPoint.y = center.y + edgeSize * Math.sin(angleRad);

    if (cornerIndex === 0) {
      ctx.moveTo(cornerPoint.x, cornerPoint.y);
    } else {
      ctx.lineTo(cornerPoint.x, cornerPoint.y);
    }
  }
  ctx.fill();
}