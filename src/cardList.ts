"use strict";

import Papa from "papaparse";
import { Card, CardStat } from "./card";

function makeCardStat(
  u: number,
  us: string[],
  l: number,
  ls: string[],
  d: number,
  ds: string[],
  r: number,
  rs: string[],
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
  makeCardStat(1, [], 0, [], 0, [], 0, []),
  makeCardStat(0, [], 1, [], 0, [], 0, []),
  makeCardStat(0, [], 0, [], 1, [], 0, []),
  makeCardStat(0, [], 0, [], 0, [], 1, []),
  // 2
  makeCardStat(1, [], 1, [], 0, [], 0, []),
  makeCardStat(0, [], 1, [], 1, [], 0, []),
  makeCardStat(0, [], 0, [], 1, [], 1, []),
  makeCardStat(1, [], 0, [], 0, [], 1, []),
  makeCardStat(1, [], 0, [], 1, [], 0, []),
  makeCardStat(0, [], 1, [], 0, [], 1, []),
  // 3
  makeCardStat(1, [], 1, [], 1, [], 0, []),
  makeCardStat(0, [], 1, [], 1, [], 1, []),
  makeCardStat(1, [], 0, [], 1, [], 1, []),
  makeCardStat(1, [], 1, [], 0, [], 1, []),
  // 4
  makeCardStat(1, [], 1, [], 1, [], 1, []),
  // 0, rookie
  makeCardStat(0, [], 0, [], 0, [], 0, []),
  // 3, bard,cooper
  makeCardStat(1, [], 0, [], 1, [], 1, []),
  makeCardStat(1, [], 1, [], 0, [], 1, []),
  // 1, double
  makeCardStat(2, [], 0, [], 0, [], 0, []),
  makeCardStat(0, [], 2, [], 0, [], 0, []),
  makeCardStat(0, [], 0, [], 2, [], 0, []),
  makeCardStat(0, [], 0, [], 0, [], 2, []),
];

// TODO: save/load to/from localstorage for dynamic cardlists
const cardStatExtras: Card[] = [
  new Card("blue", "test", makeCardStat(1, [], 1, [], 1, [], 1, [], true)),
  new Card("blue", "test", makeCardStat(1, ["slam"], 1, ["slam"], 1, ["slam"], 1, ["slam"], false)),
  new Card("blue", "test", makeCardStat(1, ["wind"], 1, ["wind"], 1, ["wind"], 1, ["wind"], false)),
  new Card("blue", "test", makeCardStat(1, ["bomb"], 1, ["bomb"], 1, ["bomb"], 1, ["bomb"], false)),
  new Card("blue", "test", makeCardStat(1, ["swap"], 1, ["swap"], 1, ["swap"], 1, ["swap"], false)),
  new Card("blue", "test", makeCardStat(1, ["auto"], 1, ["auto"], 1, ["auto"], 1, ["auto"], false)),
  new Card("blue", "test", makeCardStat(1, ["slam", "wind", "bomb", "swap", "auto"], 1, ["slam", "wind", "bomb", "swap", "auto"], 1, ["slam", "wind", "bomb", "swap", "auto"], 1, ["slam", "wind", "bomb", "swap", "auto"], false)),
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
