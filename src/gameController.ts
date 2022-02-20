"use strict";

import { Board } from "./board";
import { Cursor } from "./cursor";
import { colorDeck } from "./deck";
import { EDirection } from "./board";
import { Card } from "./card";
import { Player, Hand } from "./player";
import { Updater } from "./updater";
import { CardEditor } from "./cardEditor";

enum EScreenType {
  Game = 0,
  Map,
  __LENGTH,
}

class Game {
  size: number;
  players: Player[] = [];
  board: Board;
  turnCount = 0;

  constructor(size: number) {
    this.size = size;
    this.players.push(
      new Player(new Hand(3), colorDeck(10, Player.colors[0]), 0)
    );
    this.players.push(
      new Player(new Hand(3), colorDeck(10, Player.colors[1]), 1)
    );
    for (let i = 0; i < 3; i++) {
      this.players.forEach((player) => {
        player.draw(i);
      });
    }
    this.board = new Board(size);
  }

  boardSize() {
    return this.board.size;
  }

  playCard(x: number, y: number, d: EDirection, c: Card) {
    return this.board.playCard(x, y, d, c, false);
  }

  canPlayCard(x: number, y: number, d: EDirection, c: Card) {
    return this.board.playCard(x, y, d, c, true);
  }

  endTurn() {
    this.turnCount++;
    this.board.turnEnded();
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
  handleEvent: (e: KeyboardEvent) => void;
  gameScreenType: EScreenType = 0;

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

    this.handleEvent = (() => {
      const handPosArr = [0, 0];

      return (e: KeyboardEvent) => {
        let playerIdx = this.game.turnCount % 2;
        let currentPlayer = this.game.players[playerIdx % 2];
        const cursor = this.cursor;
        const handPos = handPosArr[playerIdx];

        const _playHeldCard = (dir: EDirection) => {
          switch (this.gameScreenType) {
          case EScreenType.Game:
            cursor.holdCard(currentPlayer.handAt(handPos));
            if (cursor.playHeldCard(dir)) {
              // cursor.holdCard(currentPlayer.handAt(handPos));
              console.log("playing card at hand pos:", handPos);
              currentPlayer.play(handPos);
              this.game.endTurn();
            }
            break;
          case EScreenType.Map:
            console.log("editing board");
            cursor.boardEdit();
            break;
          }
        };
        switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          cursor.move(
            {
              ArrowUp: EDirection.Up,
              ArrowDown: EDirection.Down,
              ArrowLeft: EDirection.Left,
              ArrowRight: EDirection.Right,
            }[e.key]
          );
          break;
        case "w":
        case "a":
        case "s":
        case "d":
        case " ":
          _playHeldCard(
            {
              w: EDirection.Up,
              a: EDirection.Left,
              s: EDirection.Down,
              d: EDirection.Right,
              " ": EDirection.None,
            }[e.key]
          );
          break;
        case "m":
          this.gameScreenType += 1;
          if (this.gameScreenType >= EScreenType.__LENGTH) {
            this.gameScreenType = 0;
          }
          break;
        case "1":
        case "2":
        case "3":
          handPosArr[playerIdx] = Number(e.key) - 1;
          break;
        }
        playerIdx = this.game.turnCount % 2;
        currentPlayer = this.game.players[playerIdx % 2];
        this.ce.selectCard(handPosArr[playerIdx], currentPlayer.color);
        if (!e) {
          return;
        }
        console.log("HAND:", currentPlayer.h.cs);
        console.log("decksize:", currentPlayer.d.size());
        // check if valid move exists
        let playableMove = false;
        const cs = currentPlayer.hand();
        console.log("BEGIN CAN BE PLAYED CHECK");
        for (let i = 0; i < cs.length; i++) {
          const c = cs[i];
          const canBePlayed = this.game.board.canBePlayed(c);
          if (canBePlayed) {
            playableMove = true;
            break;
          }
        }
        console.log("END CAN BE PLAYED CHECK");
        if (!playableMove) {
          console.log("no possible moves");
        }

        // console.log("playerIdx", playerIdx);
        // const c = (playerIdx == 0 ? this.game.p1 : this.game.p2).handAt(handPosArr[playerIdx]);
        // console.log("HOLD", c);
        // if (!c) console.log("CARD NOT FOUND");
        // else this.ce.setC(c);
        // this.ce.color = playerIdx == 0 ? "blue" : "red";
        // console.log("clr", this.ce.color);
      };
    })();
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
