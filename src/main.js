"use strict";

import { gc } from "./gameController.js";
import { card } from "./card.js";

window.addEventListener("error", function (event) {
  console.error(event);
});

const trouppleAcolyte = (color) =>
  new card(color, "Troupple Acolyte", {
    l: { v: 1 },
    r: { v: 2 },
    d: { v: 1 },
  });
const shieldKnight = (color) =>
  new card(color, "Shield Knight", {
    l: {
      v: 2,
      wind: true,
    },
    r: {
      v: 2,
      wind: true,
    },
    u: {
      v: 3,
      wind: true,
    },
  });
const propellerRat = (color, p) =>
  new card(color, "Propeller Rat", {
    u: { v: p ? p : 1 },
  });
const blitzsteed = (color, p) =>
  new card(color, "blitzsteed", {
    l: { v: p ? p : 1 },
  });
const blorb = (color, p) =>
  new card(color, "blorb", {
    d: { v: p ? p : 1 },
  });
const beeto = (color, p) =>
  new card(color, "beeto", {
    r: { v: p ? p : 1 },
  });

function startGame() {
  for (var i = 1; i < gc.boardSize() - 1; i++) {
    for (var j = 1; j < gc.boardSize() - 1; j++) {
      let c = trouppleAcolyte((i + j) % 2 == 0 ? "blue" : "red");
      if (i % 2 == 0) {
        c = shieldKnight(c.color);
      }
      gc.game.board.setCard(i, j, c);
    }
  }
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

function cardtob(v) {
  return btoa(JSON.stringify(v));
}

function btocard(v) {
  return JSON.parse(atob(v));
}

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
  var priority;
  var turn = 0;
  const turnC = ["blue", "red"];
  var cardHeld = [0, 0];

  const c = (turn == 0 ? gc.game.p1 : gc.game.p2).handAt(cardHeld[turn]);
  console.log("HOLD", c);
  if (!c) console.log("CARD NOT FOUND");
  else gc.ce.setC(c);
  gc.ce.color = turn == 0 ? "blue" : "red";

  return function (e) {
    var cursor = gc.cursor;
    console.log(priority);
    switch (e.key) {
      case "ArrowUp":
        cursor.move("u");
        break;
      case "ArrowDown":
        cursor.move("d");
        break;
      case "ArrowLeft":
        cursor.move("l");
        break;
      case "ArrowRight":
        cursor.move("r");
        break;
      case "w":
        cursor.holdCard(gc.ce.c());
        if (cursor.pushHeldCard("u")) turn++;
        break;
      case "a":
        cursor.holdCard(gc.ce.c());
        if (cursor.pushHeldCard("l")) turn++;
        break;
      case "s":
        cursor.holdCard(gc.ce.c());
        if (cursor.pushHeldCard("d")) turn++;
        break;
      case "d":
        cursor.holdCard(gc.ce.c());
        if (cursor.pushHeldCard("r")) turn++;
        break;
      case " ":
        // console.log(turn);
        cursor.holdCard(gc.ce.c());
        if (cursor.placeHeldCard()) turn++;
        break;
      case "1":
      case "2":
      case "3":
        cardHeld[turn] = Number(e.key) - 1;
      // case "4":
      //   const udlr = "udlr";
      //   const stats = gc.ce.stats;
      //   const k = udlr[Number(e.key) - 1];
      //   if (k in stats) {
      //     stats[k].v += 1;
      //     if (stats[k].v > 3) delete stats[k];
      //   } else {
      //     stats[k] = { v: 1 };
      //   }
      //   break;
      // // priority = Number(e.key);
    }
    turn = turn % 2;
    console.log("turn", turn);
    const c = (turn == 0 ? gc.game.p1 : gc.game.p2).handAt(cardHeld[turn]);
    console.log("HOLD", c);
    if (!c) console.log("CARD NOT FOUND");
    else gc.ce.setC(c);
    gc.ce.color = turn == 0 ? "blue" : "red";
    console.log("clr", gc.ce.color);
  };
})();

document.onkeydown = (e) => {
  console.log(e);
  e = e || window.event;

  doEvent(e);
};
