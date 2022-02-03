"use strict";

import { cardWidth, gc } from "./gameController.js";

// window.addEventListener("error", function (event) {
//   console.error(event);
// });

const trouppleAcolyte = (color) =>
  new card(color, "Troupple Acolyte", {
    l: { v: 1 },
    r: { v: 2 },
    d: { v: 1 },
  });
const shieldKnight = (color) =>
  new card(color, "Shield Knight", {
    l: { v: 2, wind: true },
    r: { v: 2, wind: true },
    u: { v: 3, wind: true },
  });

// Game Controller
// var gc = new GameController(10);

function startGame() {
  gc.interval = setInterval(updateGameArea, 20);
  for (var i = 1; i < gc.boardSize() - 1; i++) {
    for (var j = 1; j < gc.boardSize() - 1; j++) {
      let c = trouppleAcolyte((i + j) % 2 == 0 ? "blue" : "red");
      if (i % 2 == 0) c = shieldKnight(c.color);
      console.log(c);
      gc.board.setCard(i, j, c);
    }
  }
  gc.start();
  gc.update();

  try {
    // console.log(gc.push(6, 6, "l"));
    // console.log(gc.push(5, 6, "u"));
    // console.log(gc.push(5, 5, "l"));
    // console.log(gc.push(4, 5, "u"));
    // console.log(gc.push(4, 4, "l"));
    // console.log(gc.push(3, 4, "u"));
    // console.log(gc.push(3, 3, "l"));
    // console.log(gc.push(2, 3, "u"));
    // console.log(gc.push(2, 2, "l"));
    // console.log(gc.push(1, 2, "u"));
    // console.log(gc.push(1, 1, "l"));
    // console.log(gc.push(0, 1, "d"));
    // console.log(gc.push(0, 2, "d"));
    console.log(gc.cardMap);
  } catch (error) {
    console.log(error);
  }
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

// color -- red/blue
// x,y   -- x,y coords on board
function card(color, name, stats) {
  // var img = new Image();
  // img.src = cardNames[name][color];
  // img.name = name;
  this.color = color;
  this.name = name;
  // img.src =
  //   "https://static.wikia.nocookie.net/shovelknight/images/8/8b/CardCloakedFigure.png";
  // if (this.color == "red") {
  //   img.src =
  //     "https://static.wikia.nocookie.net/shovelknight/images/d/d3/RedCardCloakedFigure.png";
  // }
  // img.name = "Cloaked Figure";
  // this.img = img;
  this.stats = stats;
  const colors = {
    1: "black",
    2: "white",
    3: "maroon",
  };

  this.drawArrows = function (ctx, x, y) {
    // 1/5 wide/ 3/5 long
    const border = 2;
    const margin = cardWidth / 5;
    const width = cardWidth / 5 - border;
    // l
    ctx.fillStyle = "black";
    const l = [
      {
        d: "l",
        v: [x + border, y + margin, width, cardWidth - margin * 2],
      },
      {
        d: "r",
        v: [
          x + cardWidth - width - border,
          y + margin,
          width,
          cardWidth - margin * 2,
        ],
      },
      {
        d: "u",
        v: [x + margin, y + border, cardWidth - margin * 2, width],
      },
      {
        d: "d",
        v: [
          x + margin,
          y + cardWidth - width - border,
          cardWidth - margin * 2,
          width,
        ],
      },
    ];

    l.forEach((e) => {
      if (!(e.d in this.stats)) return;
      const s = this.stats[e.d];
      const c = colors[s.v];
      ctx.fillStyle = c;
      ctx.fillRect(...e.v);
    });
  };
  this.update = function (ctx, x, y) {
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, cardWidth, cardWidth);
    ctx.fillStyle = "black";
    if (this.stats) this.drawArrows(ctx, x, y);
    else console.warn("no stats");
  };
  this.also = function () {
    return new card(color, name, stats);
  };
}
function cardtob(v) {
  return btoa(JSON.stringify(v));
}

function btocard(v) {
  return JSON.parse(atob(v));
}

function everyinterval(n) {
  if ((gc.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

startGame();

console.log(gc.board.push(6, 6, "l"));
console.log(gc.board.push(5, 6, "u"));
console.log(gc.board.push(5, 5, "l"));
console.log(gc.board.push(4, 5, "u"));

document.onkeydown = (e) => {
  console.log(e);
  var cursor = gc.cursor;
  e = e || window.event;
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
      cursor.push("u");
      break;
    case "a":
      cursor.push("l");
      break;
    case "s":
      cursor.push("d");
      break;
    case "d":
      cursor.push("r");
      break;
  }
};
