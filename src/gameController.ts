"use strict";

import { Board } from "./board";
import { Cursor } from "./cursor";
import { Card } from "./card";
import { colorDeck, Deck } from "./deck";
import { Direction, directionToStr } from "./board";

export var cardWidth = 100;

class CardEditor {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  ctx: CanvasRenderingContext2D;
  board: Board;
  cursor: Cursor;
  i: number;
  j: number;
  constructor() {
    // this.canvas = document.createElement("canvas");
    this.i = 0;
    this.j = 0;
    this.canvas = document.getElementById(
      "cardEditCanvas"
    ) as HTMLCanvasElement;
    this.canvas.width = cardWidth * 3;
    this.canvas.height = cardWidth * 3;
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
  selectCard(i, c) {
    this.i = i;
    this.j = c == "blue" ? 0 : 2;
    this.cursor.x = this.j;
    this.cursor.y = this.i;
  }
  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "blueviolet";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // const c = this.c();
    // c.width = this.canvas.width;
    // c.update(this.ctx, 0, 0);
    let h1 = gc.game.p1.h.cs;
    let h2 = gc.game.p2.h.cs;
    for (let i = 0; i < 3; i++) {
      if (h1[i]) this.board.setCard(0, i, h1[i]);
      else this.board.unsetCard(0, i);
      if (h2[i]) this.board.setCard(2, i, h2[i]);
      else this.board.unsetCard(0, i);
    }
    this.board.update(this.ctx);
    this.cursor.update(this.ctx);
  }
}

export { CardEditor };

class Hand {
  size: number;
  cs: Card[];
  constructor(size: number) {
    this.size = size;
    this.cs = new Array(size);
  }

  push(i: number, c: Card) {
    console.log("in push");
    if (i >= this.size) return false;
    // return this.cs.push(c);
    console.log("set", i, c);
    console.log(this.cs);
    this.cs[i] = c;
    console.log(this.cs);
    return true;
  }

  pop(i: number) {
    if (i >= this.size)
      throw "`pop(" + String(i) + ") exceeds size " + String(this.size);
    const c = this.cs[i];
    this.cs[i] = undefined;
    return c;
  }

  shift() {
    this.cs = this.cs.filter((c) => c);
  }
}

class Player {
  h: Hand;
  d: Deck;
  constructor(hand: Hand, deck: Deck) {
    console.log("PLAYER DECK", deck);
    this.h = hand;
    this.d = deck;
  }

  draw(i: number) {
    console.log("drawing into handpos", i);
    if (this.d.size() > 0) return this.h.push(i, this.d.draw());
    else return false;
  }

  play(i: number) {
    const c = this.h.pop(i);
    if (!c) return false;
    if (this.d.size() > 0) return this.draw(i);
    else this.h.shift();
    return true;
  }

  handAt(i) {
    console.log("PLAYER HAND", this.h);
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
    this.p1 = new Player(new Hand(3), colorDeck(7, "blue"));
    this.p2 = new Player(new Hand(3), colorDeck(7, "red"));
    for (let i = 0; i < 3; i++) {
      this.p1.draw(i);
      this.p2.draw(i);
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

  update(ctx: CanvasRenderingContext2D) {
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
  console.log("CREATE GLOBAL GAME CONTROLLER");
  gc = new GameController(5);
} catch (e) {
  console.warn(e);
}

export { gc };
