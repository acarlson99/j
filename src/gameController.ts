"use strict";

import { Board } from "./board";
import { Cursor } from "./cursor";
import { colorDeck } from "./deck";
import { EDirection } from "./board";
import { Card } from "./card";
import { Player, Hand } from "./player";
import { Updater } from "./updater";
import { CardEditor } from "./cardEditor";

class Game {
  size: number;
  p1: Player;
  p2: Player;
  board: Board;
  boardSize: () => number;
  pushC: (x: number, y: number, d: EDirection, c: Card) => any;
  canPushC: (x: number, y: number, d: EDirection, c: Card) => any;
  endTurn: () => void;

  constructor(size: number) {
    this.size = size;
    this.p1 = new Player(new Hand(3), colorDeck(10, "blue"));
    this.p2 = new Player(new Hand(3), colorDeck(10, "red"));
    for (let i = 0; i < 3; i++) {
      this.p1.draw(i);
      this.p2.draw(i);
    }
    this.board = new Board(size);
    this.boardSize = function () {
      return this.board.size;
    };
    console.log(this.board);

    this.pushC = (x, y, d, c) => this.board.pushC(x, y, d, c, false);
    this.canPushC = (x, y, d, c) => this.board.pushC(x, y, d, c, true);
    this.endTurn = () => this.board.turnEnded();
    console.log("boardsize", this.boardSize());
  }

  update() {
    this.board.update();
    // TODO: draw score
    const [s1, s2] = this.board.getScore();
    Updater.Instance.updateGame(this, s1, s2);
  }
}

export { Game };

class GameController {
  ce: CardEditor;
  interval: any;
  game: Game;
  cursor: Cursor;
  boardSize: () => number;
  frameNo: number;

  constructor(boardSize: number) {
    this.ce = new CardEditor();
    this.interval = undefined;

    this.game = new Game(boardSize);
    this.cursor = new Cursor(this.game, this.ce);

    this.boardSize = function () {
      return this.game.boardSize();
    };
    this.frameNo = 0;
    console.log("GAEM", this.game);
  }

  update() {
    // clear
    Updater.Instance.updateGameController(this);
    // update
    this.ce?.update();
    this.game.update();
    this.cursor.update();
  }
}

export { GameController };

/* eslint-disable @typescript-eslint/no-unused-vars */
function everyinterval(n: number) {
  if ((gc.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}
/* eslint-enable @typescript-eslint/no-unused-vars */

let gc: GameController;
try {
  console.log("CREATE GLOBAL GAME CONTROLLER");
  gc = new GameController(8);
} catch (e) {
  console.warn("UNABLE TO CREATE CONTROLLER:", e);
}

export { gc };
