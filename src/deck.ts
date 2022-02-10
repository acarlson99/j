"use strict";

import { Card } from "./card";

class Deck {
  cs: Card[];
  constructor(cs: Card[]) {
    this.cs = [];
    for (let i = 0; i < cs.length; i++) {
      const c = cs[i];
      this.cs.push(c);
    }
    // console.log("NEW DECK", this.cs);
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
    u: { v: Math.floor(Math.random() * 4) },
    l: { v: Math.floor(Math.random() * 4) },
    r: { v: Math.floor(Math.random() * 4) },
    d: { v: Math.floor(Math.random() * 4) },
  });

function colorDeck(size: number, color: string) {
  const a = [];
  for (let i = 0; i < size; i++) {
    const t = trouppleAcolyte(color);
    Object.keys(t.stats).forEach((k) => {
      if (t.stats[k].v == 0) {
        delete t.stats[k];
      }
    });
    // only 3 arrows, not 4 silly goose
    if (Object.keys(t.stats).length == 4) {
      delete t.stats["udlr"[Math.floor(Math.random() * 4)]];
    }
    a.push(t);
  }
  return new Deck(a);
}

export { colorDeck };
