"use strict";

import { Board } from "./board";
import { Cursor } from "./cursor";
import { colorDeck } from "./deck";
import { EDirection } from "./board";
import { Card, Rock } from "./card";
import { Player, Hand } from "./player";
import { Updater } from "./updater";

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
    Updater.Instance.update(
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
    console.log(this.board);
  }
  update() {
    Updater.Instance.update(this);
    const h1 = gc.game.p1.hand();
    const h2 = gc.game.p2.hand();
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

class Game {
  size: number;
  p1: Player;
  p2: Player;
  board: Board;
  boardSize: () => number;
  push: (x: number, y: number, d: EDirection, p: number) => any;
  pushC: (x: number, y: number, d: EDirection, c: Card) => any;
  canPush: (x: number, y: number, d: EDirection, p: number) => any;
  canPushC: (x: number, y: number, d: EDirection, c: Card) => any;

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
    this.board.setCard(1, 1, new Rock());
    // console.log("set rock:", this.board.setCard(1, 1, new Rock()));
    console.log(this.board);

    this.push = (x, y, d, p) => this.board.push(x, y, d, p, false);
    this.pushC = (x, y, d, c) => this.board.pushC(x, y, d, c, false);
    this.canPush = (x, y, d, p) => this.board.push(x, y, d, p, true);
    this.canPushC = (x, y, d, c) => this.board.pushC(x, y, d, c, true);
    console.log("boardsize", this.boardSize());
  }

  update() {
    this.board.update();
    // TODO: draw score
    const [s1, s2] = this.board.getScore();
    Updater.Instance.update(this, s1, s2);
    // const [b, r] = this.board.getScore();
    // const p1s = document.getElementById("p1score");
    // const p2s = document.getElementById("p2score");
    // if (p1s && b.toString() != p1s.innerHTML) {
    //   p1s.innerHTML = b.toString();
    // }
    // if (p2s && r.toString() != p2s.innerHTML) {
    //   p2s.innerHTML = r.toString();
  }
}

export { Game };

class GameController {
  ce: CardEditor;
  // canvas: HTMLCanvasElement;
  interval: any;
  game: Game;
  cursor: Cursor;
  boardSize: () => number;
  // context: CanvasRenderingContext2D;
  // ctx: CanvasRenderingContext2D;
  frameNo: number;

  constructor(boardSize: number) {
    this.ce = new CardEditor();

    // this.canvas = document.createElement("canvas");
    // this.canvas = document.getElementById("boardCanvas") as HTMLCanvasElement;
    this.interval = undefined;

    this.game = new Game(boardSize);
    this.cursor = new Cursor(this.game, this.ce);

    this.boardSize = function () {
      return this.game.boardSize();
    };
    this.frameNo = 0;
    console.log("GAEM", this.game);
  }

  // getCardSize() {
  //   // NOTE: using `ceil` instead of `floor` to avoid weird looking margins
  //   return Math.ceil(
  //     Math.min(this.canvas.width, this.canvas.height) / this.boardSize()
  //   );
  // }

  update() {
    // dynamic resizing lol
    // this.canvas.width = window.innerWidth;
    // this.canvas.height = window.innerHeight;

    // clear
    Updater.Instance.update(this);

    // update
    // console.log("editor");
    this.ce?.update();
    // console.log("GAME");
    this.game.update();
    // console.log("cursor");
    this.cursor.update();

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
