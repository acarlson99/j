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
  MainMenu,
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
    this.players.forEach((player) => {
      player.drawHand();
    });
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

class Menu {
  arrowPos = 0;
  menuItems = ["play", "who?", "controls"];

  // constructor() {}
  clampPos() {
    this.arrowPos =
      (this.arrowPos + this.menuItems.length) % this.menuItems.length;
  }
  arrowUp() {
    this.arrowPos -= 1;
    this.clampPos();
  }
  arrowDown() {
    this.arrowPos += 1;
    this.clampPos();
  }
  selectCurrentMenuItem(gc: GameController) {
    switch (this.menuItems[this.arrowPos]) {
    case "play":
      console.log("play");
      gc.startGame();
      break;
    case "who?":
      window.location.href = "/";
      break;
    }
  }
  update() {
    Updater.Instance.drawMenu(this);
  }
}

export { Menu };

class GameController {
  ce?: CardEditor;
  interval: any;
  game?: Game;
  cursor?: Cursor;
  menu?: Menu;
  boardSize: () => number;
  frameNo: number;
  handleEvent: (e: KeyboardEvent) => void;
  // TODO: probably move screen types to their own classes
  gameScreenType: EScreenType = EScreenType.MainMenu;
  size: number;

  constructor(boardSize: number) {
    this.interval = undefined;

    this.boardSize = function () {
      return this.game?.boardSize() || 0;
    };
    this.size = boardSize;
    this.frameNo = 0;

    this.mainMenu();

    this.handleEvent = (() => {
      const handPosArr = [0, 0];

      return (e: KeyboardEvent) => {
        switch (this.gameScreenType) {
        case EScreenType.Game: {
          let playerIdx = (this.game?.turnCount || 0) % 2;
          let currentPlayer = this.game?.players[playerIdx % 2];
          const cursor = this.cursor;
          const handPos = handPosArr[playerIdx];
          if (!this.game || !cursor || !currentPlayer || !this.ce) {
            console.error("game not defined, screentype of type game");
            return;
          }

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
            {
              const dir = {
                w: EDirection.Up,
                a: EDirection.Left,
                s: EDirection.Down,
                d: EDirection.Right,
                " ": EDirection.None,
              }[e.key];
              cursor.holdCard(currentPlayer.handAt(handPos));
              if (cursor.playHeldCard(dir, this.game)) {
                // cursor.holdCard(currentPlayer.handAt(handPos));
                console.log("playing card at hand pos:", handPos);
                currentPlayer.play(handPos);
                this.game.endTurn();
              }
            }
            break;
          case "m":
            this.gameScreenType = EScreenType.Map;
            break;
          case "1":
          case "2":
          case "3":
            handPosArr[playerIdx] = Number(e.key) - 1;
            break;
          case "r":
            this.mainMenu();
            return;
          case "v":
            {
              const prompt = window.prompt("enter deck code");
              console.log(prompt);
              if (!(prompt && prompt.length > 0)) {
                break;
              }
              const b = atob(prompt);
              currentPlayer.d.deserialize(b);
              currentPlayer.h.clear();
              currentPlayer.d.shuffle();
              currentPlayer.drawHand();
            }
            break;
          case "c":
            alert(
              btoa(currentPlayer.d.serialize())
                .match(/.{1,75}/g)
                ?.join("\n")
            );
          }

          console.log(
            "current player deck",
            btoa(currentPlayer.d.serialize())
          );
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

          break;
        }
        case EScreenType.Map: {
          const cursor = this.cursor;
          if (!cursor || !this.game) {
            console.error("cursor not defined, screentype map");
            return;
          }
          switch (e.key) {
          case " ":
            cursor.boardEdit(this.game.board);
            break;
          case "m":
            this.gameScreenType = EScreenType.Game;
            break;
          }
          break;
        }
        case EScreenType.MainMenu:
          switch (e.key) {
          case "ArrowUp":
            this.menu.arrowUp();
            break;
          case "ArrowDown":
            this.menu.arrowDown();
            break;
          case " ":
          case "Enter":
            this.menu.selectCurrentMenuItem(this);
          }
          break;
        }
      };
    })();
  }

  startGame() {
    this.ce = new CardEditor();
    this.game = new Game(this.size);
    this.cursor = new Cursor(this.size);
    this.menu = undefined;
    this.gameScreenType = EScreenType.Game;
  }

  mainMenu() {
    this.ce = undefined;
    this.game = undefined;
    this.cursor = undefined;
    this.menu = new Menu();
    this.gameScreenType = EScreenType.MainMenu;
  }

  update() {
    // clear
    // update
    switch (this.gameScreenType) {
    case EScreenType.Game:
      Updater.Instance.updateGameController(this);
      this.ce?.update();
      this.game?.update();
      this.cursor?.update();
      break;
    case EScreenType.Map:
      Updater.Instance.updateGameController(this, "purple");
      this.game?.board?.obstacles?.update();
      this.cursor?.update();
      break;
    case EScreenType.MainMenu:
      Updater.Instance.updateGameController(this);
      this.menu?.update();
      break;
    }
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
