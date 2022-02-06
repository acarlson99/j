"use strict";

class Deck {
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
    this.cs.sort(() => Math.random - 0.5);
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

import { card } from "./card.js";

const trouppleAcolyte = (color) =>
  new card(color, "Troupple Acolyte", {
    u: { v: Math.floor(Math.random() * 3) },
    l: { v: Math.floor(Math.random() * 3) },
    r: { v: Math.floor(Math.random() * 3) },
    d: { v: Math.floor(Math.random() * 3) },
  });

function colorDeck(size, color) {
  var a = [];
  for (let i = 0; i < 10; i++) {
    a.push(trouppleAcolyte(color));
  }
  return new Deck(a);
}

export { colorDeck };
