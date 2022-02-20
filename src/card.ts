"use strict";

// import { cardWidth } from "./gameController";
import { EDirection, opposites, sds } from "./board";
import { Updater } from "./updater";

type DirStat = {
  v: number;
  slam?: boolean;
  wind?: boolean;
  bomb?: boolean;
  swap?: boolean;
  auto?: boolean;
};

type CardStat = {
  dirs: { l?: DirStat; r?: DirStat; u?: DirStat; d?: DirStat };
  graveyard?: boolean;
};

export { DirStat, CardStat };

export const cardStatDirs = ["u", "d", "l", "r"];

function statDirection(stats: CardStat, direction: EDirection) {
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

function setStatDirection(
  stats: CardStat,
  direction: EDirection,
  dirStat: DirStat | undefined
) {
  if (!stats) {
    return undefined;
  }
  switch (direction) {
  case EDirection.Up:
    return (stats.dirs.u = dirStat);
  case EDirection.Down:
    return (stats.dirs.d = dirStat);
  case EDirection.Left:
    return (stats.dirs.l = dirStat);
  case EDirection.Right:
    return (stats.dirs.r = dirStat);
  }
  return undefined;
}

export { statDirection, setStatDirection };

// color -- red/blue
// x,y   -- x,y coords on board
class Card {
  color: string;
  name: string;
  stats: CardStat;
  turnsInPlay: number;
  // colors = ["black", "white", "maroon"];

  constructor(color: string, name: string, stats: CardStat) {
    this.color = color;
    this.name = name;
    // lmao no deep copy method so i do this :shrug:
    this.stats = JSON.parse(JSON.stringify(stats));
    this.turnsInPlay = -1;
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
  bePushed(direction: EDirection) {
    // switch/swap logic
    const f = (l: EDirection, r: EDirection) => {
      const sdl = statDirection(this.stats, l);
      const sdr = statDirection(this.stats, r);
      if (sdl?.swap || sdr?.swap) {
        setStatDirection(this.stats, l, sdr);
        setStatDirection(this.stats, r, sdl);
      }
    };
    f(EDirection.Up, EDirection.Down);
    f(EDirection.Left, EDirection.Right);
  }

  tickModifierTimer() {
    this.turnsInPlay += 1;
  }

  // for deleting 3-arrow after 3 turns
  modifierCheck() {
    if (this.turnsInPlay > 3 * 2) {
      cardStatDirs.forEach((ds) => {
        const sd = statDirection(this.stats, sds[ds]);
        if (sd?.v == 3) {
          sd.v = 0;
        }
      });
    }
  }

  autoDirs() {
    const ads: EDirection[] = [];
    cardStatDirs.forEach((ds) => {
      if (statDirection(this.stats, sds[ds])?.auto) {
        ads.push(sds[ds]);
      }
    });
    return ads;
  }

  autoDirsToPush() {
    if (this.turnsInPlay < 1 || this.turnsInPlay % 2 == 1) {
      return [];
    }
    return this.autoDirs();
  }
  /* eslint-enable @typescript-eslint/no-empty-function */

  update(x: number, y: number) {
    Updater.Instance.updateCard(this, x, y);
  }

  copy() {
    const c = new Card(this.color, this.name, this.stats);
    c.turnsInPlay = this.turnsInPlay;
    return c;
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
