"use strict";

import { Card } from "./card";

class Deck {
  cs: Card[];
  constructor(cs) {
    this.cs = new Array();
    for (const k in cs) {
      if (cs.hasOwnProperty(k)) {
        const c = cs[k];
        this.cs.push(c);
      }
    }
    console.log("NEW DECK", this.cs);
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
    u: { v: Math.floor(Math.random() * 3) },
    l: { v: Math.floor(Math.random() * 3) },
    r: { v: Math.floor(Math.random() * 3) },
    d: { v: Math.floor(Math.random() * 3) },
  });

function colorDeck(size, color) {
  var a = [];
  for (let i = 0; i < size; i++) {
    // a.push(trouppleAcolyte(color));
    let t = trouppleAcolyte(color);
    console.log("keys", Object.keys(t));
    Object.keys(t.stats).forEach((i) => {
      // console.log("CUMMMMMM", t, i, t[i]);
      if (t.stats[i].v == 0) delete t.stats[i];
      // else console.log("no lol", t[i].v);
    });
    a.push(t);
  }
  return new Deck(a);
}

export { colorDeck };
