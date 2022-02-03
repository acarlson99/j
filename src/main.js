"use strict";

window.addEventListener("error", function (event) {
  console.log("BAD", event);
});

var myCard;

Image.prototype.rotate = function (angle) {
  var c = document.createElement("canvas");
  c.width = this.width;
  c.height = this.height;
  var ctx = c.getContext("2d");
  ctx.rotate(angle);
  var imgData = ctx.createImageData(this.width, this.height);
  ctx.putImageData(imgData, 0, 0);
  return new Image(imgData);
};

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

var cardWidth = 100;

function startGame() {
  for (var i = 1; i < myGameArea.boardSize - 1; i++) {
    for (var j = 1; j < myGameArea.boardSize - 1; j++) {
      let c = trouppleAcolyte((i + j) % 2 == 0 ? "blue" : "red");
      if (i % 2 == 0) c = shieldKnight(c.color);
      console.log(c);
      myGameArea.setCard(i, j, c);
    }
  }
  myGameArea.start();

  try {
    console.log(myGameArea.push(6, 6, "l"));
    console.log(myGameArea.push(5, 6, "u"));
    console.log(myGameArea.push(5, 5, "l"));
    console.log(myGameArea.push(4, 5, "u"));
    // console.log(myGameArea.push(4, 4, "l"));
    // console.log(myGameArea.push(3, 4, "u"));
    // console.log(myGameArea.push(3, 3, "l"));
    // console.log(myGameArea.push(2, 3, "u"));
    // console.log(myGameArea.push(2, 2, "l"));
    // console.log(myGameArea.push(1, 2, "u"));
    // console.log(myGameArea.push(1, 1, "l"));
    // console.log(myGameArea.push(0, 1, "d"));
    // console.log(myGameArea.push(0, 2, "d"));
    console.log(myGameArea.cardMap);
  } catch (error) {
    console.log(error);
  }
}

class Cursor {
  constructor(ctx, size) {
    this.x = Math.ceil(size / 2);
    this.y = Math.ceil(size / 2);
    this.ctx = ctx
  }

  update() {
    const ctx = this.ctx;
    ctx.lineWidth = 10;
    ctx.rect(
      myGameArea.xToCoord(this.x)+ctx.lineWidth/2,
      myGameArea.xToCoord(this.y)+ctx.lineWidth/2,
      cardWidth-ctx.lineWidth,
      cardWidth-ctx.lineWidth
    );
    ctx.stroke();
  }
}

class Game {
  canvas = document.createElement("canvas");
  cardMap = new Array(8);

  constructor(boardSize) {
    this.boardSize = boardSize;
    this.cardMap = new Array(this.boardSize);
    for (let i = 0; i < this.cardMap.length; i++) {
      this.cardMap[i] = new Array(this.boardSize);
    }
    console.log("boardsize", boardSize);
  }
  start() {
    this.canvas.width = this.boardSize * cardWidth;
    this.canvas.height = this.boardSize * cardWidth;
    this.context = this.canvas.getContext("2d");
    this.ctx = this.context;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.cursor = new Cursor(this.ctx, 8);
    this.interval = setInterval(updateGameArea, 20);
  }
  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.boardSize && y < this.boardSize;
  }
  xToCoord(x) {
    return x * cardWidth;
  }
  yToCoord(y) {
    return y * cardWidth;
  }
  update() {
    for (var i = 0; i < this.cardMap.length; i++) {
      for (var j = 0; j < this.cardMap.length; j++) {
        let c = this.getCard(i, j);
        if (c && c.update) {
          c.update(this.ctx, this.xToCoord(i), this.yToCoord(j));
        }
      }
    }
    this.cursor.update();
    this.cursor.x++
    if (this.cursor.x >= this.boardSize) this.cursor.x=0
  }
  // if card exists then return it
  // false -> out of bounds
  // true -> empty square
  getCard(x, y) {
    if (!this.inBounds(x, y)) return false;
    else if (this.cardMap[y][x]) return this.cardMap[y][x];
    return undefined;
  }
  setCard(x, y, c) {
    if (!c) {
      console.log("NOTE: UNSETTING CARD", x, y);
    }
    if (!this.inBounds(x, y)) return false;
    this.cardMap[y][x] = c;
  }
  directions = {
    u: [(x) => x, (y) => y - 1],
    d: [(x) => x, (y) => y + 1],
    l: [(x) => x - 1, (y) => y],
    r: [(x) => x + 1, (y) => y],
  };
  push(x, y, direction) {
    // console.log(direction);
    // console.log(this.directions);
    // console.log(this.directions[direction]);
    const xf = this.directions[direction][0];
    const yf = this.directions[direction][1];
    let nx = xf(x);
    let ny = yf(y);

    // find if it can push the next card
    const nc = this.getCard(nx, ny);
    const c = this.getCard(x, y);
    if (nc === false) return false;
    if (nc !== undefined) {
      const cando = this.push(nx, ny, direction);
      if (!cando) return false; // cannot push for some reason
    }
    this.setCard(nx, ny, c);
    delete this.cardMap[y][x];
    return true;
  }
}

var myGameArea = new Game(10);

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

function updateGameArea() {
  myGameArea.update();
  // canvas_arrow(0, 0, 100, 100);
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

startGame();
