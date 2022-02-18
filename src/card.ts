"use strict";

// import { cardWidth } from "./gameController";
import { EDirection, opposites } from "./board";
import { Updater } from "./updater";

// function rock() {
//   var c = new Card("brown", "rock", {});
//   c.canBePushed = () => false;
//   return c;
// }

// export { rock };

type DirStat = {
  v: number;
  slam?: boolean;
  wind?: boolean;
};

type CardStat = {
  l?: DirStat;
  r?: DirStat;
  u?: DirStat;
  d?: DirStat;
};

export { DirStat, CardStat };

function statDirection(stats: CardStat, direction: EDirection) {
  // console.log("in statdirection");
  // console.log("stats:", stats);
  // console.log(stats, directionToStr(direction));
  if (!stats) {
    return undefined;
  }
  switch (direction) {
    case EDirection.Up:
      return stats.u;
    case EDirection.Down:
      return stats.d;
    case EDirection.Left:
      return stats.l;
    case EDirection.Right:
      return stats.r;
  }
  return undefined;
}

export { statDirection };

// color -- red/blue
// x,y   -- x,y coords on board
class Card {
  color: string;
  name: string;
  stats: CardStat;
  // colors = ["black", "white", "maroon"];

  constructor(color: string, name: string, stats: CardStat) {
    // console.log("construct card");
    this.color = color;
    this.name = name;
    // this.width = cardWidth;
    // lmao no deep copy method so i do this :shrug:
    this.stats = JSON.parse(JSON.stringify(stats));
    // console.log("constructed");
  }

  canPush(direction: EDirection) {
    // console.log("in can push");
    // console.log(opposites, direction);
    // console.log(this.stats);
    // console.log("stat direction", statDirection(this.stats, direction)?.v);
    return (statDirection(this.stats, direction)?.v || 0) > 0;
  }

  canBePushed(direction: EDirection, priority: number) {
    // console.log("in can be pushed");
    // console.log(opposites, direction);
    // console.log("sd", statDirection(this.stats, opposites[direction]));
    // console.log("in can be pushed");
    const p = statDirection(this.stats, opposites[direction])?.v || 0;
    // console.log("cbp", p, priority);
    // if (this.opposites[direction])
    return p < priority;
  }

  // be pushed in direction. This is where `swap` would happen
  bePushed(direction: EDirection) {}

  setColor(c: string) {
    this.color = c;
  }

  swapColor() {
    if (this.color == "blue") this.setColor("red");
    else if (this.color == "red") this.setColor("blue");
  }

  // NOTE: send card a msg that a turn ended (for use by 3-arrow countdown,auto)
  turnEnded() {}

  update(x: number, y: number) {
    Updater.Instance.updateCard(this, x, y);
  }

  copy() {
    return new Card(this.color, this.name, this.stats);
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
class Rock extends Card {
  constructor() {
    super("brown", "rock", {});
  }

  canPush(direction: EDirection) {
    return false;
  }

  canBePushed(direction: EDirection, priority: number) {
    return false;
  }

  copy() {
    return this.constructor();
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars */

export { Card, Rock };
