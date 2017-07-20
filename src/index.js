import Grid from './grid';
import Game from './game';

var canvasSize = Grid.calculateCanvasSize();
var canvas = document.getElementById('game');
canvas.height = canvasSize.height;
canvas.width = canvasSize.width;

var container = document.querySelector('.container');
container.setAttribute("style", "width: " + canvasSize.width + "px;");

var game = new Game(canvasSize.rowCount, canvasSize.colCount, 5);
game.init();
