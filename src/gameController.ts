"use strict";

import { Board, EDirection } from "./board";
import { Card } from "./card";
import { EScreenType, IController } from "./controller";
import { Cursor } from "./cursor";
import { colorDeck, Deck } from "./deck";
import { Hand, Player } from "./player";
import { Updater } from "./updater";

class Game {
  size: number;
  players: Player[] = [];
  board: Board;
  turnCount = 0;

  constructor(size: number) {
    this.size = size;
    const store = window.localStorage;
    let d1 = colorDeck(10, Player.colors[0]);
    let d2 = colorDeck(10, Player.colors[1]);
    const s = store.getItem("deck");
    if (s) {
      const d1_ = Deck.fromStore("deck", Player.colors[0]);
      if (d1_) {
        d1 = d1_;
      }
      const d2_ = Deck.fromStore("deck", Player.colors[1]);
      if (d2_) {
        d2 = d2_;
      }
    }
    d1.shuffle();
    d2.shuffle();
    this.players.push(new Player(new Hand(3), d1, 0));
    this.players.push(new Player(new Hand(3), d2, 1));
    this.players.forEach((player) => {
      player.drawHand();
    });
    this.board = new Board(size, true);
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
    this.players.forEach((p) => p.update());
    const [s1, s2] = this.board.getScore();
    Updater.Instance.updateGame(this, s1, s2);
  }
}

class GameController implements IController {
  game: Game;
  cursor: Cursor;
  handPosArr = [0, 0];
  mapEdit = false;

  constructor(size: number) {
    this.game = new Game(size);
    this.cursor = new Cursor(size);
  }

  getPlayer() {
    return this.game.turnCount % 2;
  }

  getPlayerHandPos() {
    return this.handPosArr[this.getPlayer()];
  }

  handleEvent(e: KeyboardEvent) {
    let playerIdx = this.getPlayer();
    let currentPlayer = this.game.players[playerIdx];
    const cursor = this.cursor;
    const handPos = this.handPosArr[playerIdx];

    switch (e.key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      cursor.handleEvent(e);
      break;
    case "w":
    case "a":
    case "s":
    case "d":
    case " ":
      {
        if (this.mapEdit) {
          cursor.boardEdit(this.game.board);
          break;
        }
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
      this.mapEdit = !this.mapEdit;
      break;
    case "1":
    case "2":
    case "3":
      this.handPosArr[playerIdx] = Number(e.key) - 1;
      break;
    case "q":
      return EScreenType.MainMenu;
    case "v":
      {
        const prompt = window.prompt("enter deck code");
        console.log(prompt);
        if (!(prompt && prompt.length > 0)) {
          break;
        }
        const b = atob(prompt);
        currentPlayer.d = Deck.deserialize(b);
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

    console.log("current player deck", btoa(currentPlayer.d.serialize()));
    playerIdx = this.game.turnCount % 2;
    currentPlayer = this.game.players[playerIdx % 2];
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
  }

  update() {
    Updater.Instance.updateBoardSize(this.game.boardSize());
    Updater.Instance.updateGameController(
      this,
      this.mapEdit ? "purple" : undefined
    );
    this.game.update();
    this.cursor.update();
    // cursor over cards in hand
    Updater.Instance.drawCursor(
      Updater.Instance.boardSize + this.getPlayerHandPos(),
      this.getPlayer() == 0 ? 0 : Updater.Instance.boardSize - 1
    );
  }
}

export { GameController, Game };
