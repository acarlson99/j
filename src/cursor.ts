"use strict";

import { clamp } from "./util";
import { EDirection } from "./board";
import { Game, CardEditor } from "./gameController";
import { Card } from "./card";
import { Updater } from "./updater";

class Cursor {
  size: number;
  game: Game | undefined;
  ce: CardEditor | undefined;
  x: number;
  y: number;
  heldCard: any;

  constructor(game: Game | undefined, ce: CardEditor | undefined) {
    this.size = game?.boardSize() || 0;
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
    const pushed = this.game?.pushC(this.x, this.y, direction, this.heldCard);
    console.log("PUSH RETURNED:", pushed);
    if (!pushed) {
      return false;
    }
    this.heldCard = undefined;

    // FIXME: this does not belong here
    const winner = this.game?.board.checkWin();
    if (winner) {
      const winnerScore = document.getElementById(
        winner == 1 ? "p1score" : "p2score"
      );
      if (winnerScore) {
        winnerScore.style.background = "lavender";
      }
    }
    console.log("push success");
    return true;
  }

  boardEdit() {
    console.log("board edit made");
    this.game?.board.changeObstacleAt(this.x, this.y);
  }

  // placeHeldCard() {
  //   return this.pushHeldCard(EDirection.None);
  // }

  update() {
    Updater.Instance.update(this, this.x, this.y);
  }
}

// class Cursor

export { Cursor };
