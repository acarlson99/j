import { cardWidth } from "./gameController.js";

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
      if (!(e.d in this.stats)) {
        return;
      }
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
    if (this.stats) {
      this.drawArrows(ctx, x, y);
    } else {
      console.warn("no stats");
    }
  };
  this.copy = function () {
    return new card(color, name, stats);
  };
}

export { card };
