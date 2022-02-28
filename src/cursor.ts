"use strict";

import { clamp } from "./util";
import { EDirection, Board } from "./board";
import { Game } from "./gameController";
import { Card } from "./card";
import { Updater } from "./updater";

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

  playHeldCard(direction: EDirection, game: Game) {
    console.log("cursor push", this.x, this.y, direction);
    // const c = this.game.board.getCard(this.x, this.y);
    // if (!c || !this.heldCard) return false;
    const pushed = game.playCard(this.x, this.y, direction, this.heldCard);
    console.log("PUSH RETURNED:", pushed);
    if (!pushed) {
      console.log(game.board.lastPushError);
      return false;
    }
    this.heldCard = undefined;

    // FIXME: this does not belong here
    const winner = game.board.checkWin();
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
