"use strict";

import { Board } from "./board";
import { Cursor } from "./cursor";
import { colorDeck } from "./deck";
import { EDirection } from "./board";
import { Card, Rock } from "./card";
import { Player, Hand } from "./player";

class CardEditor {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  ctx: CanvasRenderingContext2D;
  board: Board;
  cursor: Cursor;
  i: number;
  j: number;
  cardWidth: number;

  constructor() {
    // this.canvas = document.createElement("canvas");
    this.i = 0;
    this.j = 0;
    this.canvas = document.getElementById(
      "cardEditCanvas"
    ) as HTMLCanvasElement;
    this.cardWidth = 100;
    this.canvas.width = this.cardWidth * 3;
    this.canvas.height = this.cardWidth * 3;
    this.context = this.canvas.getContext("2d");
    this.ctx = this.context;
    // document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    // document.body.insertBefore("<br>", document.body.childNodes[0]);
    // this.color = "blue";
    // this.stats = {};
    this.board = new Board(3, false);
    this.cursor = new Cursor(undefined, undefined); //FIXME: dont break lmao
    this.cursor.x = this.i;
    this.cursor.y = this.j;
  }
  // c() {
  //   return new Card(this.color, "edit", this.stats);
  // }
  // setC(c: Card) {
  //   const c_ = c.copy();
  //   this.stats = c_.stats;
  //   this.color = c_.color;
  // }
  selectCard(i: number, color: string) {
    this.i = i;
    this.j = color == "blue" ? 0 : 2;
    this.cursor.x = this.j;
    this.cursor.y = this.i;
    console.log(this.board);
  }
  update() {
    // this.board = new Board(3, false);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "blueviolet";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // const c = this.c();
    // c.width = this.canvas.width;
    // c.update(this.ctx, 0, 0);
    const h1 = gc.game.p1.hand();
    const h2 = gc.game.p2.hand();
    for (let i = 0; i < 3; i++) {
      if (h1[i]) {
        this.board.setCard(0, i, h1[i]);
      } else {
        this.board.unsetCard(0, i);
      }
      if (h2[i]) {
        this.board.setCard(2, i, h2[i]);
      } else {
        this.board.unsetCard(2, i);
      }
    }
    this.board.update(this.ctx, this.cardWidth);
    this.cursor.update(this.ctx, this.cardWidth);
  }
}

export { CardEditor };

class Game {
  size: number;
  p1: Player;
  p2: Player;
  board: Board;
  boardSize: () => number;
  push: (x: number, y: number, d: EDirection, p: number) => any;
  pushC: (x: number, y: number, d: EDirection, c: Card) => any;
  canPush: (x: number, y: number, d: EDirection, p: number) => any;
  canPushC: (x: number, y: number, d: EDirection, c: Card) => any;

  constructor(size: number) {
    this.size = size;
    this.p1 = new Player(new Hand(3), colorDeck(15, "blue"));
    this.p2 = new Player(new Hand(3), colorDeck(15, "red"));
    for (let i = 0; i < 3; i++) {
      this.p1.draw(i);
      this.p2.draw(i);
    }
    this.board = new Board(size);
    this.boardSize = function () {
      return this.board.size;
    };
    this.board.setCard(1, 1, new Rock());
    // console.log("set rock:", this.board.setCard(1, 1, new Rock()));
    console.log(this.board);

    this.push = (x, y, d, p) => this.board.push(x, y, d, p, false);
    this.pushC = (x, y, d, c) => this.board.pushC(x, y, d, c, false);
    this.canPush = (x, y, d, p) => this.board.push(x, y, d, p, true);
    this.canPushC = (x, y, d, c) => this.board.pushC(x, y, d, c, true);
    console.log("boardsize", this.boardSize());
  }

  update(ctx: CanvasRenderingContext2D, cardWidth: number) {
    this.board.update(ctx, cardWidth);
    const [b, r] = this.board.getScore();
    if (b.toString() != document.getElementById("p1score").innerHTML) {
      document.getElementById("p1score").innerHTML = b.toString();
    }
    if (r.toString() != document.getElementById("p2score").innerHTML) {
      document.getElementById("p2score").innerHTML = r.toString();
    }
  }
}

export { Game };

class GameController {
  ce: CardEditor;
  canvas: HTMLCanvasElement;
  interval: any;
  game: Game;
  cursor: Cursor;
  boardSize: () => number;
  context: CanvasRenderingContext2D;
  ctx: CanvasRenderingContext2D;
  frameNo: number;

  constructor(boardSize) {
    this.ce = new CardEditor();

    // this.canvas = document.createElement("canvas");
    this.canvas = document.getElementById("boardCanvas") as HTMLCanvasElement;
    this.interval = undefined;

    this.game = new Game(boardSize);
    this.cursor = new Cursor(this.game, this.ce);

    // this.p1 = new Player(new Hand(3), colorDeck("blue"));
    // this.p2 = new Player(new Hand(3), colorDeck("red"));
    // for (let i = 0; i < 3; i++) {
    //   console.log(this.p1.draw());
    //   console.log(this.p2.draw());
    // }
    // this.board = new Board(boardSize);
    this.boardSize = function () {
      return this.game.boardSize();
    };

    // this.canvas.width = this.boardSize() * cardWidth;
    // this.canvas.height = this.boardSize() * cardWidth;
    this.canvas.width = window.innerWidth / 2;
    this.canvas.height = window.innerHeight;

    // this.canvas.width = this.canvas.height;
    // this.cardWidth = this.canvas.width / this.boardSize();
    this.context = this.canvas.getContext("2d");
    this.ctx = this.context;
    // document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    console.log("GAEM", this.game);
  }

  getCardSize() {
    // NOTE: using `ceil` instead of `floor` to avoid weird looking margins
    return Math.ceil(
      Math.min(this.canvas.width, this.canvas.height) / this.boardSize()
    );
  }

  update() {
    // dynamic resizing lol
    this.canvas.width = window.innerWidth / 2;
    this.canvas.height = window.innerHeight;

    // clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "green";
    // background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // update
    this.game.update(this.ctx, this.getCardSize());
    this.ce.update();
    this.cursor.update(this.ctx, this.getCardSize());
    // this.board.update(this.ctx);
    // this.cursor.update(this.ctx);
    // this.ce.update();
    // const [b, r] = this.board.getScore();
    // if (b != document.getElementById("p1score").innerHTML)
    //   document.getElementById("p1score").innerHTML = b;
    // if (r != document.getElementById("p2score").innerHTML)
    //   document.getElementById("p2score").innerHTML = r;
  }
}

export { GameController };

export function xToCoord(x, cardWidth) {
  return x * cardWidth;
}

export function yToCoord(y, cardWidth) {
  return y * cardWidth;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function everyinterval(n) {
  if ((gc.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}
/* eslint-enable @typescript-eslint/no-unused-vars */

let gc: GameController;
try {
  console.log("CREATE GLOBAL GAME CONTROLLER");
  gc = new GameController(6);
} catch (e) {
  console.warn("UNABLE TO CREATE CONTROLLER:", e);
}

export { gc };
