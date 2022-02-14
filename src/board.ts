"use strict";

import { clamp } from "./util";
import { Card, statDirection } from "./card";
import { Obstacles } from "./obstacles";
import { Updater } from "./updater";

enum EDirection {
  None = "NONE",
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

const dss = {
  [EDirection.None]: "X",
  [EDirection.Up]: "u",
  [EDirection.Down]: "d",
  [EDirection.Left]: "l",
  [EDirection.Right]: "r",
};

const opposites = {
  [EDirection.Up]: EDirection.Down,
  [EDirection.Down]: EDirection.Up,
  [EDirection.Right]: EDirection.Left,
  [EDirection.Left]: EDirection.Right,
  [EDirection.None]: EDirection.None,
};

const directionToStr = (d: EDirection) => dss[d];

const strToDirection = (s: string) => {
  switch (s) {
  case EDirection.Up:
    return EDirection.Up;
  case EDirection.Down:
    return EDirection.Down;
  case EDirection.Left:
    return EDirection.Left;
  case EDirection.Right:
    return EDirection.Right;
  default:
    throw "strToDirection invalid string: '" + s + "'";
  }
};

export { EDirection, opposites, directionToStr, strToDirection };

const directionF = {
  [EDirection.Up]: [(x: number) => x, (y: number) => y - 1],
  [EDirection.Down]: [(x: number) => x, (y: number) => y + 1],
  [EDirection.Left]: [(x: number) => x - 1, (y: number) => y],
  [EDirection.Right]: [(x: number) => x + 1, (y: number) => y],
  [EDirection.None]: undefined,
};

// class Obstacle {
//   name: string;

//   constructor(name: string) {
//     this.name = name;
//   }
//   /* eslint-disable @typescript-eslint/no-unused-vars */
//   update(context: CanvasRenderingContext2D, cardWidth: number) {
//     // console.warn("naughty update");
//   }
//   /* eslint-enable @typescript-eslint/no-unused-vars */
// }

// class Gem {
//   x: number;
//   y: number;
//   name: EObstacleName;
//   // update: (context: any) => void;

//   constructor(x: number, y: number) {
//     this.x = x;
//     this.y = y;
//     this.name = EObstacleName.gem;
//   }
//   update(context) {
//     const radius = cardWidth / 3;
//     const centerX = xToCoord(this.x) + cardWidth / 2;
//     const centerY = yToCoord(this.y) + cardWidth / 2;

//     context.beginPath();
//     context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//     context.fillStyle = "lavender";
//     context.fill();
//     context.lineWidth = 5;
//     context.strokeStyle = "#003300";
//     context.stroke();
//   }
// }

// class Illegal {
//   x: number;
//   y: number;
//   name: EObstacleName;
//   constructor(x: number, y: number) {
//     this.x = x;
//     this.y = y;
//     this.name = EObstacleName.illegal;
//   }
//   update(context: CanvasRenderingContext2D) {
//     context.fillStyle = "grey";
//     context.fillRect(xToCoord(this.x), yToCoord(this.y), cardWidth, cardWidth);
//   }
// }

class Board {
  size: number;
  cardMap: Card[][];
  obstacles: Obstacles | undefined;
  gameover: boolean;
  constructor(size: number, createObstacles = true) {
    this.size = size;
    this.cardMap = new Array(this.size);
    for (let i = 0; i < this.cardMap.length; i++) {
      this.cardMap[i] = new Array(this.size);
    }
    // obstacles
    if (createObstacles) {
      this.obstacles = new Obstacles(size, -1);
    } else {
      this.obstacles = undefined;
    }
    this.gameover = false;
  }

  inBounds(x: number, y: number) {
    return x >= 0 && y >= 0 && x < this.size && y < this.size;
  }

  // if Card exists then return it
  // false -> out of bounds
  // true -> empty square
  getCard(x: number, y: number) {
    if (!this.inBounds(x, y)) {
      return false;
    } else if (this.cardMap[y][x]) {
      return this.cardMap[y][x];
    }
    return undefined;
  }

  canSet(x: number, y: number) {
    if (!this.obstacles) {
      return true;
    }
    return this.obstacles.isSettable(x, y, false);
  }

  setCard(x: number, y: number, c: Card, dontSet = false) {
    // console.log("this board", this);
    if (this.gameover) {
      return false;
    }
    if (!c) {
      console.warn("NOTE: UNSETTING CARD", x, y);
    }
    // cannot place on gem
    if (!this.canSet(x, y)) {
      return false;
    }
    return this.setCard_(x, y, c, dontSet);
    // this.cardMap[y][x] = c;
    // return true;
  }

  // unsafe, private function
  // will just slap that bad boy down
  // will not check for gem intersection
  setCard_(x: number, y: number, c: any, dontSet = false) {
    if (!c) {
      console.warn("NOTE: UNSETTING CARD", x, y);
    }
    if (!this.inBounds(x, y)) {
      return false;
    }
    if (!dontSet) {
      this.cardMap[y][x] = c.copy();
    }
    return true;
  }

  unsetCard(x: number, y: number) {
    // this.cardMap[y][x] = undefined;
    delete this.cardMap[y][x];
  }

  push(
    x: number,
    y: number,
    direction: EDirection,
    priority: any,
    dontPush = false
  ) {
    if (this.gameover) {
      return false;
    }
    // console.log("PUSHING", x, y, direction);
    if (direction === EDirection.None) {
      return false;
    }
    const [xf, yf] = directionF[direction];
    const nx = xf(x);
    const ny = yf(y);
    // console.log(x, y);
    // console.log("TO");
    // console.log(nx, ny);

    if (!this.inBounds(nx, ny)) {
      return false;
    }

    // find if it can push the next Card
    const c = this.getCard(x, y);
    if (!c) {
      return undefined;
    } else if (!c.canBePushed(direction, priority)) {
      // can this Card be pushed in direction
      // console.log("cannot be pushed");
      return false;
    }
    const nc = this.getCard(nx, ny);
    // cannot push card into obstacle
    if (this.obstacles && !this.obstacles.isPushable(nx, ny)) {
      return false;
    }
    if (nc !== undefined) {
      // next to non-empty space
      // attempt to push next Card out of the way
      const cando = this.push(nx, ny, direction, priority, dontPush);
      // console.log("cando", cando);
      if (!cando) {
        return false;
      } // cannot push for some reason
    }
    const r = this.setCard_(nx, ny, c, dontPush);
    // console.log("SET:", r);
    if (!dontPush) {
      delete this.cardMap[y][x];
    }
    return r;
  }

  // place card on board with direction or no direction to set
  pushC(
    x: number,
    y: number,
    direction: EDirection,
    c: Card,
    dontPush = false
  ) {
    // console.log(x, y, direction, c, dontPush);
    // FIXME: make different functions to interface with internal push func
    // bc you WILL DEFINITELY forget about the `dontPush` param and pull out all your hair
    // console.log("a", this.gameover);
    if (this.gameover) {
      return false;
    }
    // console.log("dir", direction, EDirection.None);
    if (direction != EDirection.None) {
      if (this.obstacles && !this.obstacles.isSettable(x, y, true)) {
        return false;
      }
      // console.log("NOT NONE");
      // console.log("C:", c);
      // console.log("dir", direction);
      // cannot push in direction
      // console.log("CAN PUSH", c.canPush(direction));
      const p = statDirection(c.stats, direction)?.v;
      // console.log("priority", p, direction);
      // if (!c.canBePushed(direction, p)) return false;
      if (p && this.push(x, y, direction, p, dontPush)) {
        return this.setCard_(x, y, c, dontPush);
      }
      return false;
    } else {
      if (
        (this.obstacles && !this.obstacles.isSettable(x, y, false)) ||
        this.getCard(x, y)
      ) {
        // console.log("got a card :/");
        return false;
      }
      return this.setCard(x, y, c, dontPush);
    }
  }

  changeObstacleAt(x: number, y: number) {
    this.obstacles?.incrementObstacleAt(x, y);
  }

  // can card `c` be played anywhere legally on `board`
  canBePlayed(c: Card) {
    // console.log("try to play c", c);
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        // const keys = Object.keys(EDirection);
        const dirs = [
          EDirection.None,
          EDirection.Up,
          EDirection.Down,
          EDirection.Left,
          EDirection.Right,
        ];
        for (let ki = 0; ki < dirs.length; ki++) {
          if (this.pushC(i, j, dirs[ki], c, true)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getScore() {
    const poss = this.obstacles?.getGemsPos();
    if (!poss) {
      return [0, 0];
    }
    let scoreB = 0;
    let scoreR = 0;
    poss.map(([x, y]) => {
      const c = this.getCard(x, y);
      if (!c) {
        return;
      }
      if (c.color == "blue") {
        scoreB++;
      }
      if (c.color == "red") {
        scoreR++;
      }
    });
    return [scoreB, scoreR];
  }

  checkWin() {
    // const poss = this.obstacles.getGemsPos();
    if (!this.obstacles) {
      return undefined;
    }
    const [scoreB, scoreR] = this.getScore();
    if (scoreB + scoreR < this.obstacles.numGems()) {
      return undefined;
    }
    // if (scoreB + scoreR < poss.length) return undefined;
    const v = clamp(-1, scoreB - scoreR, 1);
    console.log("WINNER WINNER CHICKEN DINNER", v);
    this.gameover = true;
    return v;
  }

  update() {
    Updater.Instance.update(this);
    for (let i = 0; i < Updater.Instance.boardSize; i++) {
      for (let j = 0; j < Updater.Instance.boardSize; j++) {
        const c = this.getCard(i, j);
        if (c && c.update) {
          c.update(i, j);
        }
      }
    }

    this.obstacles?.update();
  }
}

export { Board };
