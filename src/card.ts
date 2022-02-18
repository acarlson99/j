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
  bomb?: boolean;
};

type CardStat = {
  dirs: { l?: DirStat; r?: DirStat; u?: DirStat; d?: DirStat };
  graveyard?: boolean;
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
    return stats.dirs.u;
  case EDirection.Down:
    return stats.dirs.d;
  case EDirection.Left:
    return stats.dirs.l;
  case EDirection.Right:
    return stats.dirs.r;
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
    this.color = color;
    this.name = name;
    // lmao no deep copy method so i do this :shrug:
    this.stats = JSON.parse(JSON.stringify(stats));
  }

  canPush(direction: EDirection) {
    return (statDirection(this.stats, direction)?.v || 0) > 0;
  }

  canBePushed(direction: EDirection, priority: number) {
    const p = statDirection(this.stats, opposites[direction])?.v || 0;
    return p < priority;
  }

  setColor(c: string) {
    this.color = c;
  }

  swapColor() {
    if (this.color == "blue") {
      this.setColor("red");
    } else if (this.color == "red") {
      this.setColor("blue");
    }
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  // be pushed in direction. This is where `swap` would happen
  bePushed(direction: EDirection) {}

  // NOTE: send card a msg that a turn ended (for use by 3-arrow countdown,auto)
  turnEnded() {}
  /* eslint-enable @typescript-eslint/no-empty-function */

  update(x: number, y: number) {
    Updater.Instance.updateCard(this, x, y);
  }

  copy() {
    return new Card(this.color, this.name, this.stats);
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: make bomb break rocks
class Rock extends Card {
  constructor() {
    super("brown", "rock", { dirs: {} });
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
