import { Board } from "./board.js";
import { Cursor } from "./cursor.js";
import { card } from "./card.js";

export var cardWidth = 100;

class CardEditor {
  constructor() {
    // this.canvas = document.createElement("canvas");
    this.canvas = document.getElementById("cardEditCanvas");
    this.canvas.width = cardWidth * 3;
    this.canvas.height = cardWidth * 3;
    this.context = this.canvas.getContext("2d");
    this.ctx = this.context;
    // document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    // document.body.insertBefore("<br>", document.body.childNodes[0]);
    this.color = "blue";
    this.stats = {};
  }
  c() {
    return new card(this.color, "edit", this.stats);
  }
  update() {
    const c = this.c();
    c.width = this.canvas.width;
    c.update(this.ctx, 0, 0);
  }
}

class GameController {
  constructor(boardSize) {
    this.ce = new CardEditor();

    // this.canvas = document.createElement("canvas");
    this.canvas = document.getElementById("boardCanvas");
    this.interval = undefined;
    // console.log("CANVAS", this.canvas);
    this.board = new Board(boardSize);
    this.boardSize = function () {
      return this.board.size;
    };
    this.cursor = new Cursor(this.boardSize());
    this.push = (x, y, d, p) => this.board.push(x, y, d, p);
    this.pushC = (x, y, d, c) => this.board.pushC(x, y, d, c);
    console.log("boardsize", this.boardSize());

    this.canvas.width = this.boardSize() * cardWidth;
    this.canvas.height = this.boardSize() * cardWidth;

    // this.canvas.width = this.canvas.height;
    // cardWidth = this.canvas.width / this.boardSize();
    this.context = this.canvas.getContext("2d");
    this.ctx = this.context;
    // document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
  }
  update() {
    // console.log("CLEARING", 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.board.update(this.ctx);
    this.cursor.update(this.ctx);
    this.ce.update();
    const [b, r] = this.board.getScore();
    console.log("SCORE", b, r);
    if (b != document.getElementById("p1score").innerHTML)
      document.getElementById("p1score").innerHTML = b;
    if (r != document.getElementById("p2score").innerHTML)
      document.getElementById("p2score").innerHTML = r;
  }
}

export { GameController };

export function xToCoord(x) {
  return x * cardWidth;
}
export function yToCoord(y) {
  return y * cardWidth;
}

function everyinterval(n) {
  if ((gc.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

export var gc = new GameController(6);
