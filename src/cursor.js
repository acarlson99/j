"use strict";

import { cardWidth, xToCoord, yToCoord, gc } from "./gameController.js";
import { clamp } from "./util.js";

class Cursor {
  constructor(size) {
    this.x = Math.floor(size / 2);
    this.y = Math.floor(size / 2);
    this.size = size;
    this.heldCard = undefined;
  }

  move(direction) {
    console.log("MOVE", direction);
    switch (direction) {
      case "u":
        this.y -= 1;
        break;
      case "d":
        this.y += 1;
        break;
      case "l":
        this.x -= 1;
        break;
      case "r":
        this.x += 1;
        break;
    }
    this.x = clamp(0, this.x, this.size - 1);
    this.y = clamp(0, this.y, this.size - 1);
  }

  holdCard(c) {
    this.heldCard = c;
    console.log("HOLDING CARD", this.heldCard);
  }

  pushHeldCard(direction) {
    console.log("cursor push", this.x, this.y, direction);
    const c = gc.board.getCard(this.x, this.y);
    if (!c || !this.heldCard) return false;
    const pushed = gc.pushC(this.x, this.y, direction, this.heldCard);
    console.log("PUSH RETURNED:", pushed);
    if (!pushed) return false;
    this.heldCard = undefined;

    // FIXME: this does not belong here
    const winner = gc.board.checkWin();
    if (winner) {
      document.getElementById(
        winner == 1 ? "p1score" : "p2score"
      ).style.background = "lavender";
    }
    return true;
  }

  placeHeldCard() {
    // if (gc.board.getCard(this.x, this.y) !== undefined) return false;
    const r = gc.pushC(this.x, this.y, false, this.heldCard);
    console.log("PUSH RETURNED:", r);

    // FIXME: this does not belong here
    const winner = gc.board.checkWin();
    if (winner) {
      document.getElementById(
        winner == 1 ? "p1score" : "p2score"
      ).style.background = "lightgreen";
    }
    return r;
    // return gc.pushC(this.x, this.y, this.heldCard);
  }

  update(ctx) {
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.rect(
      xToCoord(this.x) + ctx.lineWidth / 2,
      yToCoord(this.y) + ctx.lineWidth / 2,
      cardWidth - ctx.lineWidth,
      cardWidth - ctx.lineWidth
    );
    ctx.stroke();
  }
}

export { Cursor };
