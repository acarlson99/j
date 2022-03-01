"use strict";

import { Card, cardStatDirs, statDirection, setStatDirection } from "./card";
import { sds } from "./board";
import ISerializable from "./ISerializable";

class Deck implements ISerializable {
  cs: Card[];
  constructor(cs: Card[], color?: string) {
    this.cs = [];
    for (let i = 0; i < cs.length; i++) {
      const c = cs[i].copy();
      if (color) {
        c.color = color;
      }
      this.cs.push(c);
    }
  }

  static new() {
    return new Deck([], "blue");
  }

  instanceMethod() {
    console.log("instance method");
  }

  static staticMethod() {
    console.log("static method");
  }

  setColor(color: string) {
    this.cs.map((c) => c.setColor(color));
    return this;
  }

  shuffle() {
    this.cs.sort(() => Math.random() - 0.5);
    return this;
  }

  static fromStore(storeName: string, color?: string) {
    const store = window.localStorage;
    const s = store.getItem(storeName);
    if (!s) {
      return undefined;
    }
    const deck = Deck.deserialize(s);
    if (color) {
      deck.setColor(color);
    }
    return deck;
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

  serialize(): string {
    return JSON.stringify(this);
  }

  static deserialize(text: string): Deck {
    const obj = JSON.parse(text);
    if (!obj.cs) {
      // TODO: different exception
      throw "bad deck deserialize";
      return new Deck([]);
    }
    const cs: Card[] = [];
    obj.cs.forEach((c: Card) => {
      cs.push(new Card(c.color, c.name, c.stats));
    });
    return new Deck(cs);
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
    graveyard: color == "blue",
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
