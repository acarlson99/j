"use strict";

import Papa from "papaparse";
import { Card, CardStat } from "./card";

function makeCardStat(
  u: number,
  l: number,
  d: number,
  r: number,
  us: string[] = [],
  ls: string[] = [],
  ds: string[] = [],
  rs: string[] = [],
  graveyard = false
) {
  const stat: CardStat = {
    dirs: {},
  };
  if (u) {
    stat.dirs.u = { v: u };
  }
  if (d) {
    stat.dirs.d = { v: d };
  }
  if (l) {
    stat.dirs.l = { v: l };
  }
  if (r) {
    stat.dirs.r = { v: r };
  }
  us.forEach((e: string) => {
    if (stat.dirs.u) {
      stat.dirs.u[e] = true;
    }
  });
  ds.forEach((e) => {
    if (stat.dirs.d) {
      stat.dirs.d[e] = true;
    }
  });
  ls.forEach((e) => {
    if (stat.dirs.l) {
      stat.dirs.l[e] = true;
    }
  });
  rs.forEach((e) => {
    if (stat.dirs.r) {
      stat.dirs.r[e] = true;
    }
  });
  stat.graveyard = graveyard;
  return stat;
}

const cardStatList: CardStat[] = [
  // 1
  makeCardStat(1, 0, 0, 0),
  makeCardStat(0, 1, 0, 0),
  makeCardStat(0, 0, 1, 0),
  makeCardStat(0, 0, 0, 1),
  // 2
  makeCardStat(1, 1, 0, 0),
  makeCardStat(0, 1, 1, 0),
  makeCardStat(0, 0, 1, 1),
  makeCardStat(1, 0, 0, 1),
  makeCardStat(1, 0, 1, 0),
  makeCardStat(0, 1, 0, 1),
  // 3
  makeCardStat(1, 1, 1, 0),
  makeCardStat(0, 1, 1, 1),
  makeCardStat(1, 0, 1, 1),
  makeCardStat(1, 1, 0, 1),
  // 4
  makeCardStat(1, 1, 1, 1),
  // 0, rookie
  makeCardStat(0, 0, 0, 0),
  // 3, bard,cooper
  makeCardStat(1, 0, 1, 1),
  makeCardStat(1, 1, 0, 1),
  // 1, double
  makeCardStat(2, 0, 0, 0),
  makeCardStat(0, 2, 0, 0),
  makeCardStat(0, 0, 2, 0),
  makeCardStat(0, 0, 0, 2),
  // 2
  makeCardStat(2, 1, 0, 0),
  makeCardStat(1, 2, 0, 0),
  makeCardStat(0, 1, 2, 0),
  makeCardStat(0, 2, 1, 0),
  makeCardStat(0, 0, 2, 1),
  makeCardStat(0, 0, 1, 2),
  makeCardStat(2, 0, 0, 1),
  makeCardStat(1, 0, 0, 2),
  makeCardStat(2, 0, 1, 0),
  makeCardStat(1, 0, 2, 0),
  makeCardStat(0, 2, 0, 1),
  makeCardStat(0, 1, 0, 2),
  // 3
  makeCardStat(2, 1, 1, 0),
  makeCardStat(0, 2, 1, 1),
  makeCardStat(1, 0, 2, 1),
  makeCardStat(1, 1, 0, 2),

  makeCardStat(2, 1, 0, 1),
  makeCardStat(1, 2, 1, 0),
  makeCardStat(0, 1, 2, 1),
  makeCardStat(1, 0, 1, 2),

  makeCardStat(1, 1, 2, 0),
  makeCardStat(0, 1, 1, 2),
  makeCardStat(2, 0, 1, 1),
  makeCardStat(1, 2, 0, 1),
  // slammers
  makeCardStat(2, 0, 0, 0, ["slam"], [], [], []),
  makeCardStat(0, 2, 0, 0, [], ["slam"], [], []),
  makeCardStat(0, 0, 2, 0, [], [], ["slam"], []),
  makeCardStat(0, 0, 0, 2, [], [], [], ["slam"]),

  makeCardStat(1, 1, 1, 1, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(0, 2, 0, 2, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(2, 0, 2, 0, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(0, 1, 2, 1, [], ["slam", "bomb"], ["slam"], ["slam", "bomb"]),

  makeCardStat(2, 2, 0, 0, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(0, 2, 2, 0, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(0, 0, 2, 2, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(2, 0, 0, 2, ["slam"], ["slam"], ["slam"], ["slam"]),

  makeCardStat(0, 2, 0, 2, [], [], [], [], true),
  makeCardStat(2, 0, 2, 0, [], [], [], [], true),
  makeCardStat(2, 2, 2, 0, [], [], [], [], true),
  makeCardStat(2, 0, 2, 2, [], [], [], [], true),

  makeCardStat(0, 2, 2, 2, [], [], ["auto"], [], true),

  makeCardStat(0, 3, 0, 3, [], [], [], [], true),
  makeCardStat(3, 0, 3, 0, [], [], [], [], true),
];

// TODO: save/load to/from localstorage for dynamic cardlists
const cardStatExtras: Card[] = [
  new Card("blue", "test", makeCardStat(1, 1, 1, 1, [], [], [], [], true)),
  new Card("blue", "test", makeCardStat(1, 1, 1, 1, ["slam"], ["slam"], ["slam"], ["slam"], false)),
  new Card("blue", "test", makeCardStat(1, 1, 1, 1, ["wind"], ["wind"], ["wind"], ["wind"], false)),
  new Card("blue", "test", makeCardStat(1, 1, 1, 1, ["bomb"], ["bomb"], ["bomb"], ["bomb"], false)),
  new Card("blue", "test", makeCardStat(1, 1, 1, 1, ["swap"], ["swap"], ["swap"], ["swap"], false)),
  new Card("blue", "test", makeCardStat(1, 1, 1, 1, ["auto"], ["auto"], ["auto"], ["auto"], false)),
  new Card("blue", "test", makeCardStat(1, 1, 1, 1, ["slam", "wind", "bomb", "swap", "auto"], ["slam", "wind", "bomb", "swap", "auto"], ["slam", "wind", "bomb", "swap", "auto"], ["slam", "wind", "bomb", "swap", "auto"], false)),
];

const cardList: Card[] = Array(cardStatList.length);

export { cardList };

console.log("READ");

Papa.parse("./cards.csv", {
  download: true,
  step: function (row) {
    const i = Number(row.data[3]) - 1;
    if (cardStatList[i]) {
      cardList[i] = new Card("blue", row.data[2], cardStatList[i]);
    }
  },
  complete: function () {
    if (!cardList[0]) {
      console.warn("could not read cards.csv, attempting backup cardList population");
      for (let i = 0; i < cardStatList.length; i++) {
        const c = cardStatList[i];
        cardList[i] = new Card("blue", "maidenless", c);
      }
    }
    console.log("All done!");
    console.log(cardList);
  },
});

cardStatExtras.forEach(c => {
  cardList.push(c);
});

console.log("END");
