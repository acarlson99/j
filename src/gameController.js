import { Board } from "./board.js";
import { Cursor } from "./cursor.js";

export var cardWidth = 100;

class GameController {
  constructor(boardSize) {
    this.canvas = document.createElement("canvas");
    this.interval = undefined;
    // console.log("CANVAS", this.canvas);
    this.board = new Board(boardSize);
    this.boardSize = function () {
      return this.board.size;
    };
    this.cursor = new Cursor(this.boardSize());
    this.push = (x, y, d) => this.board.push(x, y, d);
    console.log("boardsize", this.boardSize());

    this.canvas.width = this.boardSize() * cardWidth;
    this.canvas.height = this.boardSize() * cardWidth;
    this.context = this.canvas.getContext("2d");
    this.ctx = this.context;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
  }
  update() {
    // console.log("CLEARING", 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.board.update(this.ctx);
    this.cursor.update(this.ctx);
    // this.cursor.x++;
    // if (this.cursor.x >= this.boardSize()) this.cursor.x = 0;
  }
}
export { GameController };

export function xToCoord(x) {
  return x * cardWidth;
}
export function yToCoord(y) {
  return y * cardWidth;
}

export var gc = new GameController(10);
