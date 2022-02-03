import { xToCoord, yToCoord } from "./gameController.js";

const directions = {
  u: [(x) => x, (y) => y - 1],
  d: [(x) => x, (y) => y + 1],
  l: [(x) => x - 1, (y) => y],
  r: [(x) => x + 1, (y) => y],
};

class Board {
  constructor(size) {
    this.size = size;
    this.cardMap = new Array(this.size);
    for (let i = 0; i < this.cardMap.length; i++) {
      this.cardMap[i] = new Array(this.size);
    }
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
  setCard(x, y, c) {
    if (!c) {
      console.log("NOTE: UNSETTING CARD", x, y);
    }
    if (!this.inBounds(x, y)) {
      return false;
    }
    this.cardMap[y][x] = c;
  }

  push(x, y, direction) {
    console.log("PUSHING", x, y, direction);
    const xf = directions[direction][0];
    const yf = directions[direction][1];
    let nx = xf(x);
    let ny = yf(y);

    // find if it can push the next card
    const nc = this.getCard(nx, ny);
    const c = this.getCard(x, y);
    if (!c) {
      return undefined;
    }
    if (nc === false) {
      return false;
    }
    if (nc !== undefined) {
      const cando = this.push(nx, ny, direction);
      if (!cando) {
        return false;
      } // cannot push for some reason
    }
    this.setCard(nx, ny, c);
    delete this.cardMap[y][x];
    return true;
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
  }
}

export { Board };
