"use strict";

import { cardWidth, xToCoord, yToCoord } from "./gameController";
import { clamp } from "./util";
import { EDirection } from "./board";
import { Game, CardEditor } from "./gameController";
import { Card } from "./card";

class Cursor {
  size: number;
  game: Game;
  ce: any;
  x: number;
  y: number;
  heldCard: any;

  constructor(game: Game, ce: CardEditor) {
    this.size = game?.boardSize();
    this.game = game;
    this.ce = ce;
    this.x = Math.floor(this.size / 2);
    this.y = Math.floor(this.size / 2);
    this.heldCard = undefined;
  }

  move(direction: EDirection) {
    console.log("MOVE", direction);
    switch (direction) {
      case EDirection.Up:
        this.y -= 1;
        break;
      case EDirection.Down:
        this.y += 1;
        break;
      case EDirection.Left:
        this.x -= 1;
        break;
      case EDirection.Right:
        this.x += 1;
        break;
    }
    this.x = clamp(0, this.x, this.size - 1);
    this.y = clamp(0, this.y, this.size - 1);
  }

  holdCard(c: Card) {
    this.heldCard = c;
    console.log("HOLDING CARD", this.heldCard);
  }

  pushHeldCard(direction: EDirection) {
    console.log("cursor push", this.x, this.y, direction);
    // const c = this.game.board.getCard(this.x, this.y);
    // if (!c || !this.heldCard) return false;
    const pushed = this.game.pushC(this.x, this.y, direction, this.heldCard);
    console.log("PUSH RETURNED:", pushed);
    if (!pushed) return false;
    this.heldCard = undefined;

    // FIXME: this does not belong here
    const winner = this.game.board.checkWin();
    if (winner) {
      document.getElementById(
        winner == 1 ? "p1score" : "p2score"
      ).style.background = "lavender";
    }
    console.log("push success");
    return true;
  }

  boardEdit() {
    console.log("board edit made");
    this.game.board.changeObstacleAt(this.x, this.y);
  }

  // placeHeldCard() {
  //   return this.pushHeldCard(EDirection.None);
  // }

  update(ctx: CanvasRenderingContext2D) {
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

// class Cursor

export { Cursor };
