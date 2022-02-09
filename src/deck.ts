"use strict";

import { Card } from "./card";

class Deck {
  cs: Card[];
  constructor(cs) {
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

const trouppleAcolyte = (color) =>
  new Card(color, "Troupple Acolyte", {
    u: { v: Math.floor(Math.random() * 4) },
    l: { v: Math.floor(Math.random() * 4) },
    r: { v: Math.floor(Math.random() * 4) },
    d: { v: Math.floor(Math.random() * 4) },
  });

function colorDeck(size: number, color: string) {
  const a = [];
  for (let i = 0; i < size; i++) {
    // a.push(trouppleAcolyte(color));
    const t = trouppleAcolyte(color);
    // console.log("keys", Object.keys(t));
    Object.keys(t.stats).forEach((k) => {
      // console.log("CUMMMMMM", t, k, t[k]);
      if (t.stats[k].v == 0) {
        delete t.stats[k];
      }
      // else console.log("no lol", t[i].v);
    });
    a.push(t);
  }
  return new Deck(a);
}

export { colorDeck };
