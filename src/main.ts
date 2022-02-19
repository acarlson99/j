"use strict";

window.addEventListener("error", function (event) {
  console.error(event);
});

import { gc } from "./gameController";
import { EDirection } from "./board";
import { Updater } from "./updater";

function startGame() {
  gc.interval = setInterval(updateGameArea, 20);
}

function updateGameArea() {
  Updater.Instance.updateBoardSize(gc.boardSize());
  Updater.Instance.updateWH();
  gc.update();
}

startGame();

const doEvent = (() => {
  let turn = 0;
  const turnC = ["blue", "red"];
  const cardHeld = [0, 0];
  let mapEditor = false;

  return function (e: KeyboardEvent) {
    let p = turn == 0 ? gc.game.p1 : gc.game.p2;
    const cursor = gc.cursor;
    const cardHeldPos = cardHeld[turn];
    switch (e.key) {
    case "ArrowUp":
      cursor.move(EDirection.Up);
      break;
    case "ArrowDown":
      cursor.move(EDirection.Down);
      break;
    case "ArrowLeft":
      cursor.move(EDirection.Left);
      break;
    case "ArrowRight":
      cursor.move(EDirection.Right);
      break;
    case "w":
      cursor.holdCard(p.handAt(cardHeldPos));
      if (cursor.pushHeldCard(EDirection.Up)) {
        console.log("playing card at hand pos:", cardHeldPos);
        p.play(cardHeldPos);
        turn++;
        gc.game.endTurn();
      }
      break;
    case "a":
      cursor.holdCard(p.handAt(cardHeldPos));
      if (cursor.pushHeldCard(EDirection.Left)) {
        console.log("playing card at hand pos:", cardHeldPos);
        p.play(cardHeldPos);
        turn++;
        gc.game.endTurn();
      }
      break;
    case "s":
      cursor.holdCard(p.handAt(cardHeldPos));
      if (cursor.pushHeldCard(EDirection.Down)) {
        console.log("playing card at hand pos:", cardHeldPos);
        p.play(cardHeldPos);
        turn++;
        gc.game.endTurn();
      }
      break;
    case "d":
      cursor.holdCard(p.handAt(cardHeldPos));
      if (cursor.pushHeldCard(EDirection.Right)) {
        console.log("playing card at hand pos:", cardHeldPos);
        p.play(cardHeldPos);
        turn++;
        gc.game.endTurn();
      }
      break;
    case " ":
      console.log("space bar pressed.  mapeditor set to:", mapEditor);
      if (mapEditor) {
        console.log("editing board");
        cursor.boardEdit();
        break;
      }
      cursor.holdCard(p.handAt(cardHeldPos));
      if (cursor.pushHeldCard(EDirection.None)) {
        console.log("playing card at hand pos:", cardHeldPos);
        p.play(cardHeldPos);
        turn++;
        gc.game.endTurn();
      }
      break;
    case "m":
      mapEditor = !mapEditor;
      console.log("MAP EDITOR:", mapEditor);
      break;
    case "1":
    case "2":
    case "3":
      cardHeld[turn] = Number(e.key) - 1;
      break;
    }
    turn = turn % 2;
    p = turn == 0 ? gc.game.p1 : gc.game.p2;
    gc.ce.selectCard(cardHeld[turn], turnC[turn]);
    console.log("HAND:", p.h.cs);
    console.log("decksize:", p.d.size());
    // check if valid move exists
    let playableMove = false;
    const cs = p.hand();
    console.log("BEGIN CAN BE PLAYED CHECK");
    for (let i = 0; i < cs.length; i++) {
      const c = cs[i];
      const canBePlayed = gc.game.board.canBePlayed(c);
      if (canBePlayed) {
        playableMove = true;
        break;
      }
    }
    console.log("END CAN BE PLAYED CHECK");
    if (!playableMove) {
      console.log("no possible moves");
    }

    // console.log("turn", turn);
    // const c = (turn == 0 ? gc.game.p1 : gc.game.p2).handAt(cardHeld[turn]);
    // console.log("HOLD", c);
    // if (!c) console.log("CARD NOT FOUND");
    // else gc.ce.setC(c);
    // gc.ce.color = turn == 0 ? "blue" : "red";
    // console.log("clr", gc.ce.color);
  };
})();

document.onkeydown = (e) => {
  console.log(e);
  // const e_ = e || window.event;

  doEvent(e);
};

import { cardTest } from "./regressionTest";
cardTest();
