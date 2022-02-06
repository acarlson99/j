"use strict";

import { Board } from "./board.js";
import { Cursor } from "./cursor.js";
import { card } from "./card.js";
import { colorDeck } from "./deck.js";

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
  setC(c) {
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

class Hand {
  constructor(size) {
    this.size = size;
    this.cs = [];
  }

  push(c) {
    if (this.cs.length >= this.size) return false;
    return this.cs.push(c);
  }

  pop(i) {
    if (i >= this.size)
      throw "`pop(" + String(i) + ") exceeds size " + String(this.size);
    if (i >= this.cs.length) return undefined;
    return this.cs.pop(i);
  }
}

class Player {
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
    console.log(this.h);
    return this.h.cs[i];
  }
  hand() {
    return [...this.h.cs];
  }
}

class GameController {
  constructor(boardSize) {
    this.ce = new CardEditor();

    // this.canvas = document.createElement("canvas");
    this.canvas = document.getElementById("boardCanvas");
    this.interval = undefined;

    this.p1 = new Player(new Hand(3), colorDeck("blue"));
    this.p2 = new Player(new Hand(3), colorDeck("red"));
    for (let i = 0; i < 3; i++) {
      console.log(this.p1.draw());
      console.log(this.p2.draw());
    }
    this.board = new Board(boardSize);
    this.boardSize = function () {
      return this.board.size;
    };
    this.cursor = new Cursor(this.boardSize());
    this.push = (x, y, d, p) => this.board.push(x, y, d, p, false);
    this.pushC = (x, y, d, c) => this.board.pushC(x, y, d, c, false);
    this.canPush = (x, y, d, p) => this.board.push(x, y, d, p, true);
    this.canPushC = (x, y, d, c) => this.board.pushC(x, y, d, c, true);
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

export var gc = new GameController(2);
