"use strict";

window.addEventListener("error", function (event) {
  console.error(event);
});

import { gc } from "./gameController";
import { EDirection } from "./board";

function startGame() {
  // for (var i = 1; i < gc.boardSize() - 1; i++) {
  //   for (var j = 1; j < gc.boardSize() - 1; j++) {
  //     let c = trouppleAcolyte((i + j) % 2 == 0 ? "blue" : "red");
  //     if (i % 2 == 0) {
  //       c = shieldKnight(c.color);
  //     }
  //     gc.game.board.setCard(i, j, c);
  //   }
  // }
  gc.interval = setInterval(updateGameArea, 20);
}

function updateGameArea() {
  gc.update();
}

// const cardNames = {
//   "Cloaked Figure": {
//     blue:
//       "https://static.wikia.nocookie.net/shovelknight/images/8/8b/CardCloakedFigure.png",
//     red:
//       "https://static.wikia.nocookie.net/shovelknight/images/d/d3/RedCardCloakedFigure.png",
//   },
//   "Shovel Knight": {
//     blue:
//       "https://static.wikia.nocookie.net/shovelknight/images/e/e5/CardShovelKnight.png",
//     red:
//       "https://static.wikia.nocookie.net/shovelknight/images/c/c7/RedCardShovelKnight.png",
//   },
//   "Troupple Acolyte": {
//     blue:
//       "https://static.wikia.nocookie.net/shovelknight/images/a/a8/CardTrouppleAcolyte.png",
//     red:
//       "https://static.wikia.nocookie.net/shovelknight/images/a/a5/RedCardTrouppleAcolyte.png/revision/latest?cb=20200316213347",
//   },
// };

// const arrowImg = new Image(cardWidth, cardWidth);
// arrowImg.src = "http://cdn.onlinewebfonts.com/svg/img_209407.png";

startGame();

// console.log(gc.board.push(6, 6, "l"));
// console.log(gc.board.push(5, 6, "u"));
// console.log(gc.board.push(5, 5, "l"));
// console.log(gc.board.push(4, 5, "u"));

// const keyFuncs = {
//   ArrowUp: () => cursor.move('u'),
//   ArrowDown: () => cursor.move('d'),
//   ArrowLeft: () => cursor.move('l'),
//   ArrowRight: () => cursor.move('r'),
//   w: () => cursor.push('u'),
//   s: () => cursor.push('d'),
//   a: () => cursor.push('l'),
//   d: () => cursor.push('r'),
// }

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
      }
      break;
    case "a":
      cursor.holdCard(p.handAt(cardHeldPos));
      if (cursor.pushHeldCard(EDirection.Left)) {
        console.log("playing card at hand pos:", cardHeldPos);
        p.play(cardHeldPos);
        turn++;
      }
      break;
    case "s":
      cursor.holdCard(p.handAt(cardHeldPos));
      if (cursor.pushHeldCard(EDirection.Down)) {
        console.log("playing card at hand pos:", cardHeldPos);
        p.play(cardHeldPos);
        turn++;
      }
      break;
    case "d":
      cursor.holdCard(p.handAt(cardHeldPos));
      if (cursor.pushHeldCard(EDirection.Right)) {
        console.log("playing card at hand pos:", cardHeldPos);
        p.play(cardHeldPos);
        turn++;
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
    gc.ce.selectCard(cardHeld[turn], turnC[turn]);
    p = turn == 0 ? gc.game.p1 : gc.game.p2;
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
  const e_ = e || window.event;

  doEvent(e_);
};

import { cardTest } from "./regressionTest";

cardTest();
