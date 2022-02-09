"use strict";

import { xToCoord, yToCoord } from "./gameController";
// import { cardWidth } from "./gameController";
import { clamp } from "./util";
import { Card, Rock, Unplacable, statDirection } from "./card";

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
  [EDirection.Up]: [EDirection.Down],
  [EDirection.Down]: [EDirection.Up],
  [EDirection.Right]: [EDirection.Left],
  [EDirection.Left]: [EDirection.Right],
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
};

enum EObstacleName {
  gem = "gem",
  illegal = "illegal",
  noPlace = "noPlace", // cannot place, must push here
  pitfall = "pitfall",
}

const obstacleList = [
  EObstacleName.gem,
  EObstacleName.illegal,
  EObstacleName.noPlace,
  EObstacleName.pitfall,
];

class Obstacles {
  size: number;
  m: any[];
  x: number;
  y: number;
  s: string;
  gem: any;

  constructor(size: number, numGems = undefined) {
    this.size = size;
    if (numGems === undefined) {
      numGems = Math.floor(size / 4) * 2 + 1;
      // console.log(numGems);
    }
    this.m = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.m[i] = new Array(this.size);
    }
    for (let i = 0; i < size; i++) {
      this.setM_(0, i, this.makeObstacle(EObstacleName.illegal));
      this.setM_(i, 0, this.makeObstacle(EObstacleName.illegal));
      this.setM_(i, size - 1, this.makeObstacle(EObstacleName.illegal));
      this.setM_(size - 1, i, this.makeObstacle(EObstacleName.illegal));
    }
    for (let i = 1; i < size - 1; i++) {
      this.setM_(1, i, this.makeObstacle(EObstacleName.noPlace));
      this.setM_(i, 1, this.makeObstacle(EObstacleName.noPlace));
      this.setM_(i, size - 2, this.makeObstacle(EObstacleName.noPlace));
      this.setM_(size - 2, i, this.makeObstacle(EObstacleName.noPlace));
    }
    this.setM_(1, 1, this.makeObstacle(EObstacleName.illegal));
    this.setM_(1, size - 2, this.makeObstacle(EObstacleName.illegal));
    this.setM_(size - 2, 1, this.makeObstacle(EObstacleName.illegal));
    this.setM_(size - 2, size - 2, this.makeObstacle(EObstacleName.illegal));
    for (let i = 0; i < numGems; i++) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);
      if (this.m[y][x]) {
        i--;
        continue;
      }

      this.setM_(x, y, this.makeObstacle(EObstacleName.gem));
    }
    // this.setM_(0, 0, this.makeObstacle(EObstacleName.illegal));
    // this.setM_(0, 1, this.makeObstacle(EObstacleName.noPlace));
    // this.setM_(0, 2, this.makeObstacle(EObstacleName.pitfall));
  }

  setM_(x: number, y: number, o) {
    if (!o) {
      delete this.m[y][x];
    } else {
      o.x = x;
      o.y = y;
      this.m[y][x] = o;
    }
  }

  incrementObstacleAt(x: number, y: number) {
    console.log("incrementing obstacle");
    const name = this.m[y][x]?.name;
    if (!name) {
      this.setM_(x, y, this.makeObstacle(obstacleList[0]));
    }
    let i = obstacleList.indexOf(name);
    i++;
    this.setM_(x, y, undefined);
    if (i === obstacleList.length) {
      return;
    }
    this.setM_(x, y, this.makeObstacle(obstacleList[i]));
  }

  makeObstacle(name: EObstacleName) {
    console.log("creating obstacle");
    const f = function () {
      this.name = name;
      // this.x = x;
      // this.y = y;
      this.update = function (context: CanvasRenderingContext2D) {
        console.warn("naughty update");
      };
    };

    const o = new f();
    switch (name) {
    case EObstacleName.gem:
      o.update = function (
        context: CanvasRenderingContext2D,
        cardWidth: number
      ) {
        const radius = cardWidth / 3;
        const centerX = xToCoord(this.x, cardWidth) + cardWidth / 2;
        const centerY = yToCoord(this.y, cardWidth) + cardWidth / 2;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = "lavender";
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = "#003300";
        context.stroke();
      };
      break;
    case EObstacleName.illegal:
      o.update = function (
        context: CanvasRenderingContext2D,
        cardWidth: number
      ) {
        context.fillStyle = "grey";
        context.fillRect(
          xToCoord(this.x, cardWidth),
          yToCoord(this.y, cardWidth),
          cardWidth,
          cardWidth
        );
      };
      break;
    case EObstacleName.noPlace:
      o.update = function (
        context: CanvasRenderingContext2D,
        cardWidth: number
      ) {
        context.globalAlpha = 0.75;
        context.fillStyle = "darkgreen";
        context.fillRect(
          xToCoord(this.x, cardWidth),
          yToCoord(this.y, cardWidth),
          cardWidth,
          cardWidth
        );
        context.globalAlpha = 1.0;
      };
      break;
    case EObstacleName.pitfall:
      o.update = function (
        context: CanvasRenderingContext2D,
        cardWidth: number
      ) {
        context.globalAlpha = 0.5;
        context.fillStyle = "brown";
        context.fillRect(
          xToCoord(this.x, cardWidth),
          yToCoord(this.y, cardWidth),
          cardWidth,
          cardWidth
        );
        context.globalAlpha = 1.0;
      };
      break;
    }
    return o;
  }

  isSettable(x: number, y: number) {
    const ob = this.m[y][x];
    switch (ob?.name) {
    case undefined:
      return true;
    case EObstacleName.gem:
      return false;
    case EObstacleName.illegal:
      return false;
      break;
    case EObstacleName.noPlace:
      return false;
      break;
    case EObstacleName.pitfall:
      return true;
      break;
    }
    console.error("fallthrough case");
    return false;
  }

  // check if card can be pushed onto space
  isPushable(x: number, y: number) {
    switch (this.m[y][x]?.name) {
    case undefined:
      return true;
    case EObstacleName.gem:
      return true;
    case EObstacleName.illegal:
      return false;
      break;
    case EObstacleName.noPlace:
      return true;
      break;
    case EObstacleName.pitfall:
      return true;
      break;
    }
    console.error("fallthrough case");
    return false;
  }

  getGemsPos() {
    // this.m.flatMap((a) => console.log(a));
    return this.m
      .flat()
      .filter((o) => o?.name == EObstacleName.gem)
      .map((v) => [v.x, v.y]);
  }

  numGems() {
    return this.getGemsPos().length;
  }

  gemAt(x: number, y: number) {
    const g = this.m[y][x];
    return g && g.name == EObstacleName.gem;
  }

  update(ctx: CanvasRenderingContext2D, cardWidth: number) {
    this.m.forEach((a) => a.forEach((o) => (o ? o.update(ctx, cardWidth) : o)));
  }
}

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
  obstacles: Obstacles;
  gameover: boolean;
  constructor(size: number, createObstacles = true) {
    this.size = size;
    this.cardMap = new Array(this.size);
    for (let i = 0; i < this.cardMap.length; i++) {
      this.cardMap[i] = new Array(this.size);
    }
    // obstacles
    if (createObstacles) {
      this.obstacles = new Obstacles(size);
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
    return this.obstacles.isSettable(x, y);
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
    this.cardMap[y][x] = undefined;
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
      if (this.obstacles && !this.obstacles.isPushable(x, y)) {
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
        (this.obstacles && !this.obstacles.isSettable(x, y)) ||
        this.getCard(x, y)
      ) {
        // console.log("got a card :/");
        return false;
      }
      return this.setCard(x, y, c, dontPush);
    }
  }

  changeObstacleAt(x: number, y: number) {
    this.obstacles.incrementObstacleAt(x, y);
  }

  // can card `c` be played anywhere legally on `board`
  canBePlayed(c: Card) {
    // console.log("try to play c", c);
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const keys = Object.keys(EDirection);
        for (let ki = 0; ki < keys.length; ki++) {
          const k = keys[ki];
          if (this.pushC(i, j, EDirection[k], c, true)) {
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

  update(ctx: CanvasRenderingContext2D, cardWidth: number) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const c = this.getCard(i, j);
        if (c && c.update) {
          c.update(
            ctx,
            xToCoord(i, cardWidth),
            yToCoord(j, cardWidth),
            cardWidth
          );
        }
      }
    }
    this.obstacles?.update(ctx, cardWidth);
  }
}

export { Board };
