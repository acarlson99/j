"use strict";


import { Board } from "./board";
import { Cursor } from "./cursor";
import { Card } from "./card";
import { colorDeck, Deck } from "./deck";
import { Direction, directionToStr } from "./board";

export var cardWidth = 100;

class CardEditor {
  canvas: HTMLCanvasElement;
  context: any;
  ctx: any;
  color: string;
  stats: {};
  constructor() {
    // this.canvas = document.createElement("canvas");
    this.canvas = document.getElementById(
      "cardEditCanvas"
    ) as HTMLCanvasElement;
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
    return new Card(this.color, "edit", this.stats);
  }
  setC(c: Card) {
    const c_ = c.copy();
    this.stats = c_.stats;
    this.color = c_.color;
  }
  update() {
    const c = this.c();
    c.width = this.canvas.width;
    c.update(this.ctx, 0, 0);
  }
}

export { CardEditor };

class Hand {
  size: number;
  cs: Card[];
  constructor(size) {
    this.size = size;
    this.cs = [];
  }

  push(c: Card) {
    if (this.cs.length >= this.size) return false;
    return this.cs.push(c);
  }

  pop(i: number) {
    if (i >= this.size)
      throw "`pop(" + String(i) + ") exceeds size " + String(this.size);
    if (i >= this.cs.length) return undefined;
    return this.cs.splice(i, i)[0];
  }
}

class Player {
  h: Hand;
  d: Deck;
  constructor(hand, deck) {
    console.log("DECK", deck);
    this.h = hand;
    this.d = deck;
  }
  draw() {
    if (this.d.size() > 0) return this.h.push(this.d.draw());
    else return false;
  }
  play(i) {
    const c = this.h.pop(i);
    if (!c) return false;
  }

  handAt(i) {
    console.log("HAND", this.h);
    return this.h.cs[i];
  }
  hand() {
    return [...this.h.cs];
  }
}

class Game {
  size: number;
  p1: Player;
  p2: Player;
  board: Board;
  boardSize: () => any;
  push: (x: number, y: number, d: Direction, p: number) => any;
  pushC: (x: number, y: number, d: Direction, c: Card) => any;
  canPush: (x: number, y: number, d: Direction, p: number) => any;
  canPushC: (x: number, y: number, d: Direction, c: Card) => any;

  constructor(size: number) {
    this.size = size;
    this.p1 = new Player(new Hand(3), colorDeck(20, "blue"));
    this.p2 = new Player(new Hand(3), colorDeck(20, "red"));
    for (let i = 0; i < 3; i++) {
      console.log(this.p1.draw());
      console.log(this.p2.draw());
    }
    this.board = new Board(size);
    this.boardSize = function () {
      return this.board.size;
    };
    this.push = (x, y, d, p) => this.board.push(x, y, d, p, false);
    this.pushC = (x, y, d, c) => this.board.pushC(x, y, d, c, false);
    this.canPush = (x, y, d, p) => this.board.push(x, y, d, p, true);
    this.canPushC = (x, y, d, c) => this.board.pushC(x, y, d, c, true);
    console.log("boardsize", this.boardSize());
  }
  update(ctx: HTMLCanvasElement) {
    this.board.update(ctx);
    const [b, r] = this.board.getScore();
    if (b.toString() != document.getElementById("p1score").innerHTML)
      document.getElementById("p1score").innerHTML = b.toString();
    if (r.toString() != document.getElementById("p2score").innerHTML)
      document.getElementById("p2score").innerHTML = r.toString();
  }
}

export { Game };

class GameController {
  ce: CardEditor;
  canvas: HTMLCanvasElement;
  interval: any;
  game: Game;
  cursor: Cursor;
  boardSize: () => any;
  context: any;
  ctx: any;
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
    // this.cursor = new Cursor(this.boardSize());
    // this.push = (x, y, d, p) => this.board.push(x, y, d, p, false);
    // this.pushC = (x, y, d, c) => this.board.pushC(x, y, d, c, false);
    // this.canPush = (x, y, d, p) => this.board.push(x, y, d, p, true);
    // this.canPushC = (x, y, d, c) => this.board.pushC(x, y, d, c, true);
    // console.log("boardsize", this.boardSize());

    this.canvas.width = this.boardSize() * cardWidth;
    this.canvas.height = this.boardSize() * cardWidth;

    // this.canvas.width = this.canvas.height;
    // cardWidth = this.canvas.width / this.boardSize();
    this.context = this.canvas.getContext("2d");
    this.ctx = this.context;
    // document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    console.log("GAEM", this.game);
  }
  update() {
    // console.log("CLEARING", 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.game.update(this.ctx);
    this.ce.update();
    this.cursor.update(this.ctx);
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

var gc: GameController;
try {
  gc = new GameController(5);
} catch (e) {
  console.warn(e);
}

export { gc };
