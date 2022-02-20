"use strict";

import { Board } from "./board";
import { Cursor } from "./cursor";
import { Updater } from "./updater";
import { gc } from "./gameController";
import { Player } from "./player";

class CEBoard extends Board {
  update() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const c = this.getCard(i, j);
        if (c && c.update) {
          c.update(
            Updater.Instance.boardSize + j,
            i > 0 ? Updater.Instance.boardSize - 1 : 0
          );
        }
      }
    }
  }
}

class CECursor extends Cursor {
  update() {
    Updater.Instance.updateCursor(
      this,
      Updater.Instance.boardSize + this.y,
      this.x > 0 ? Updater.Instance.boardSize - 1 : 0
    );
  }
}

export { CEBoard, CECursor };

class CardEditor {
  board: CEBoard;
  cursor: CECursor;
  i: number;
  j: number;
  cardWidth: number;

  constructor() {
    this.i = 0;
    this.j = 0;
    this.cardWidth = 100;
    this.board = new CEBoard(3, false);
    this.cursor = new CECursor(undefined, undefined); //FIXME: dont break lmao
    this.cursor.x = this.i;
    this.cursor.y = this.j;
  }
  selectCard(i: number, color: string) {
    this.i = i;
    this.j = color == "blue" ? 0 : 2;
    this.cursor.x = this.j;
    this.cursor.y = this.i;
  }
  update() {
    Updater.Instance.updateCardEditor(this);
    const [h1, h2, rest] = gc.game.players.map((p: Player) => p.hand());
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
    this.board.update();
    this.cursor.update();
  }
}

export { CardEditor };
