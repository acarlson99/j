"use strict";

import { cardWidth } from "./gameController.js";

const opposites = {
  l: "r",
  r: "l",
  u: "d",
  d: "u",
};

function rock() {
  var c = new card("brown", "rock", {});
  c.canBePushed = () => false;
  return c;
}

export { rock };

// color -- red/blue
// x,y   -- x,y coords on board
function card(color, name, stats) {
  this.color = color;
  this.name = name;
  this.width = cardWidth;
  // lmao no deep copy method so i do this :shrug:
  this.stats = JSON.parse(JSON.stringify(stats));
  const colors = {
    1: "black",
    2: "white",
    3: "maroon",
  };

  this.canBePushed = function (direction, priority) {
    if (priority === undefined) return this.canBePushed(direction, 1);
    if (opposites[direction] in stats) {
      return stats[opposites[direction]].v < priority;
    }
    return true;
  };

  this.drawArrows = function (ctx, x, y) {
    // 1/5 wide/ 3/5 long
    const border = 2;
    const margin = this.width / 5;
    const width = this.width / 5 - border;
    ctx.fillStyle = "black";
    const arrowFuncs = [
      {
        d: "l",
        v: [x + border, y + margin, width, this.width - margin * 2],
      },
      {
        d: "r",
        v: [
          x + this.width - width - border,
          y + margin,
          width,
          this.width - margin * 2,
        ],
      },
      {
        d: "u",
        v: [x + margin, y + border, this.width - margin * 2, width],
      },
      {
        d: "d",
        v: [
          x + margin,
          y + this.width - width - border,
          this.width - margin * 2,
          width,
        ],
      },
    ];

    arrowFuncs.forEach((e) => {
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
    ctx.fillRect(x, y, this.width, this.width);
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
