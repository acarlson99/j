"use strict";

import { Board, EDirection } from "./board";
import { Card } from "./card";
import { Game } from "./gameController";
import { Updater } from "./updater";
import { clamp } from "./util";

class Cursor {
  size: number;
  x: number;
  y: number;
  heldCard: any;

  constructor(size: number) {
    this.size = size;
    this.x = Math.floor(this.size / 2);
    this.y = Math.floor(this.size / 2);
    this.heldCard = undefined;
  }

  move(direction: EDirection) {
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
    // this.x = clamp(0, this.x, this.size - 1);
    // this.y = clamp(0, this.y, this.size - 1);
    this.x = (this.x + this.size) % this.size;
    this.y = (this.y + this.size) % this.size;
  }

  holdCard(c: Card) {
    this.heldCard = c;
  }

  playHeldCard(direction: EDirection, game: Game) {
    // const c = this.game.board.getCard(this.x, this.y);
    // if (!c || !this.heldCard) return false;
    const pushed = game.playCard(this.x, this.y, direction, this.heldCard);
    if (!pushed) {
      console.log("last push error:", game.board.lastPushError);
      return false;
    }
    this.heldCard = undefined;

    console.log("push success");
    return true;
  }

  boardEdit(board: Board) {
    board.changeObstacleAt(this.x, this.y);
  }

  // placeHeldCard() {
  //   return this.playHeldCard(EDirection.None);
  // }

  update() {
    Updater.Instance.updateCursor(this, this.x, this.y);
  }

  handleEvent(e: KeyboardEvent) {
    switch (e.key) {
    case "ArrowUp":
      this.move(EDirection.Up);
      break;
    case "ArrowDown":
      this.move(EDirection.Down);
      break;
    case "ArrowLeft":
      this.move(EDirection.Left);
      break;
    case "ArrowRight":
      this.move(EDirection.Right);
      break;
    }
  }
}

// class Cursor

export { Cursor };
