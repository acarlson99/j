"use strict";

import { Card, cardStatDirs, statDirection, setStatDirection } from "./card";
import { sds } from "./board";

class Deck {
  cs: Card[];
  constructor(cs: Card[]) {
    this.cs = [];
    for (let i = 0; i < cs.length; i++) {
      const c = cs[i];
      this.cs.push(c);
    }
  }

  shuffle() {
    this.cs.sort(() => Math.random() - 0.5);
  }

  draw() {
    return this.cs.pop();
  }

  size() {
    return this.cs.length;
  }

  empty() {
    return this.cs.length === 0;
  }

  copy() {
    return new Deck([...this.cs]);
  }
}

export { Deck };

const trouppleAcolyte = (color: string) =>
  new Card(color, "Troupple Acolyte", {
    dirs: {
      u: {
        v: Math.floor(Math.random() * 4),
      },
      l: {
        v: Math.floor(Math.random() * 4),
      },
      r: {
        v: Math.floor(Math.random() * 4),
      },
      d: {
        v: Math.floor(Math.random() * 4),
      },
    },
  });

function colorDeck(size: number, color: string) {
  const a = [];
  for (let i = 0; i < size; i++) {
    const t = trouppleAcolyte(color);
    cardStatDirs.forEach((k) => {
      if (statDirection(t.stats, sds[k])?.v == 0) {
        setStatDirection(t.stats, sds[k], undefined);
      }
    });
    // only 3 arrows, not 4 silly goose
    if (cardStatDirs.length == 4) {
      const randDir = sds[cardStatDirs[Math.floor(Math.random() * 4)]];
      setStatDirection(t.stats, randDir, undefined);
    }
    a.push(t);
  }
  return new Deck(a);
}

export { colorDeck };
