"use strict";

import { xToCoord, yToCoord } from "./gameController.js";
import { cardWidth } from "./gameController.js";
import { clamp } from "./util.js";
import { rock } from "./card.js";

const directionF = {
  u: [(x) => x, (y) => y - 1],
  d: [(x) => x, (y) => y + 1],
  l: [(x) => x - 1, (y) => y],
  r: [(x) => x + 1, (y) => y],
};

class Obstacles {
  constructor(size, numGems = undefined) {
    this.size = size;
    if (numGems === undefined) {
      numGems = Math.floor(size / 4) * 2 + 1;
      console.log(numGems);
    }
    this.numGems = numGems;
    this.m = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.m[i] = new Array(this.size);
    }
    for (let i = 0; i < this.numGems; i++) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);
      if (this.m[y][x]) {
        i--;
        continue;
      }

      this.m[y][x] = new this.gem(x, y);
      //   console.log("GEM", x, y);
    }
    // console.log(this.getGemsPos());
  }
  getGemsPos() {
    // this.m.flatMap((a) => console.log(a));
    return this.m.flat().map((v) => [v.x, v.y]);
  }
  getGem(x, y) {
    const g = this.m[y][x];
    return g && g.s == new this.gem().s;
  }
  gem(x, y) {
    this.x = x;
    this.y = y;
    this.s = "gem";
    this.update = (context) => {
      const radius = cardWidth / 3;
      const centerX = xToCoord(x) + cardWidth / 2;
      const centerY = yToCoord(y) + cardWidth / 2;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = "green";
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = "#003300";
      context.stroke();
    };
  }
  update(ctx) {
    this.m.forEach((a) => a.forEach((o) => (o ? o.update(ctx) : o)));
  }
}

class Board {
  constructor(size) {
    this.size = size;
    this.cardMap = new Array(this.size);
    for (let i = 0; i < this.cardMap.length; i++) {
      this.cardMap[i] = new Array(this.size);
    }
    // obstacles
    // this.cardMap[0][0] = rock();
    this.obstacles = new Obstacles(size);
    this.gameover = false;
  }

  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.size && y < this.size;
  }
  // if card exists then return it
  // false -> out of bounds
  // true -> empty square
  getCard(x, y) {
    if (!this.inBounds(x, y)) {
      return false;
    } else if (this.cardMap[y][x]) {
      return this.cardMap[y][x];
    }
    return undefined;
  }

  setCard(x, y, c, dontSet) {
    if (this.gameover) return false;
    // if (!c) {
    //   console.warn("NOTE: UNSETTING CARD", x, y);
    // }
    // cannot place on gem
    if (this.obstacles.getGem(x, y)) return false;
    return this.setCard_(x, y, c, dontSet);
    // this.cardMap[y][x] = c;
    // return true;
  }

  // unsafe, private function
  // will just slap that bad boy down
  // will not check for gem intersection
  setCard_(x, y, c, dontSet) {
    if (!c) {
      console.warn("NOTE: UNSETTING CARD", x, y);
    }
    if (!this.inBounds(x, y)) {
      return false;
    }
    if (!dontSet) this.cardMap[y][x] = c;
    return true;
  }

  push(x, y, direction, priority, dontPush) {
    if (this.gameover) return false;
    console.log("PUSHING", x, y, direction);
    const [xf, yf] = directionF[direction];
    const nx = xf(x);
    const ny = yf(y);

    // find if it can push the next card
    const nc = this.getCard(nx, ny);
    const c = this.getCard(x, y);
    if (!c) {
      return undefined;
    } else if (!c.canBePushed(direction, priority)) {
      // can this card be pushed in direction
      return false;
    }
    if (nc === false) {
      return false;
    }
    if (nc !== undefined) {
      // next to non-empty space
      // attempt to push next card out of the way
      const cando = this.push(nx, ny, direction, priority, dontPush);
      if (!cando) {
        return false;
      } // cannot push for some reason
    }
    const r = this.setCard_(nx, ny, c, dontPush);
    if (!dontPush) delete this.cardMap[y][x];
    return r;
  }

  // direction param optional
  // sans direction this function places instead
  pushC(x, y, direction, c, dontPush) {
    // FIXME: make different functions to interface with internal push func
    // bc you WILL DEFINITELY forget about the `dontPush` param and pull out all your hair
    console.log("a", this.gameover);
    if (this.gameover) return false;
    if (direction) {
      // cannot push in direction
      console.log("C:", c);
      console.log("dir", direction);
      if (!(c.stats && direction in c.stats)) return false;
      const p = c.stats[direction].v;
      console.log("p", p);
      if (this.push(x, y, direction, p, dontPush))
        return this.setCard_(x, y, c, dontPush);
      return false;
    } else {
      if (this.getCard(x, y)) return false;
      console.log("c");
      return this.setCard(x, y, c, dontPush);
    }
  }

  getScore() {
    const poss = this.obstacles.getGemsPos();
    var scoreB = 0;
    var scoreR = 0;
    poss.map(([x, y]) => {
      const c = this.getCard(x, y);
      if (!c) return;
      if (c.color == "blue") scoreB++;
      if (c.color == "red") scoreR++;
    });
    return [scoreB, scoreR];
  }

  checkWin() {
    // const poss = this.obstacles.getGemsPos();
    const [scoreB, scoreR] = this.getScore();
    if (scoreB + scoreR < this.obstacles.numGems) return undefined;
    // if (scoreB + scoreR < poss.length) return undefined;
    const v = clamp(-1, scoreB - scoreR, 1);
    console.log("WINNER WINNER CHICKEN DINNER", v);
    this.gameover = true;
    return v;
  }

  update(ctx) {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        let c = this.getCard(i, j);
        if (c && c.update) {
          c.update(ctx, xToCoord(i), yToCoord(j));
        }
      }
    }
    this.obstacles.update(ctx);
  }
}

export { Board };
