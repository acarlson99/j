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

function rot4(
  u: number,
  d: number,
  l: number,
  r: number,
  us: string[] = [],
  ds: string[] = [],
  ls: string[] = [],
  rs: string[] = [],
  grave = false
) {
  return [
    // 2 2 0 0
    makeCardStat(u, d, l, r, us, ds, ls, rs, grave),
    // 0 2 2 0
    makeCardStat(r, u, d, l, rs, us, ds, ls, grave),
    // 0 0 2 2
    makeCardStat(l, r, u, d, ls, rs, us, ds, grave),
    // 2 0 0 2
    makeCardStat(d, l, r, u, ds, ls, rs, us, grave),
  ];
}

function rot2(
  ud: number,
  lr: number,
  uds: string[] = [],
  lrs: string[] = [],
  grave = false
) {
  return rot4(ud, lr, ud, lr, uds, lrs, uds, lrs, grave).slice(0, 2);
}

function allStat(ss) {
  return [ss, ss, ss, ss];
}

const cardStatList: CardStat[] = [
  // 1
  // makeCardStat(1, 0, 0, 0),
  // makeCardStat(0, 1, 0, 0),
  // makeCardStat(0, 0, 1, 0),
  // makeCardStat(0, 0, 0, 1),
  rot4(1, 0, 0, 0),
  // 2
  // makeCardStat(1, 1, 0, 0),
  // makeCardStat(0, 1, 1, 0),
  // makeCardStat(0, 0, 1, 1),
  // makeCardStat(1, 0, 0, 1),
  rot4(1, 1, 0, 0),
  // makeCardStat(1, 0, 1, 0),
  // makeCardStat(0, 1, 0, 1),
  rot2(1, 0),
  // 3
  // makeCardStat(1, 1, 1, 0),
  // makeCardStat(0, 1, 1, 1),
  // makeCardStat(1, 0, 1, 1),
  // makeCardStat(1, 1, 0, 1),
  rot4(1, 1, 1, 0),
  // 4
  makeCardStat(1, 1, 1, 1),
  // 0, rookie
  makeCardStat(0, 0, 0, 0),
  // 3, bard,cooper
  makeCardStat(1, 0, 1, 1),
  makeCardStat(1, 1, 0, 1),
  // 1, double
  // makeCardStat(2, 0, 0, 0),
  // makeCardStat(0, 2, 0, 0),
  // makeCardStat(0, 0, 2, 0),
  // makeCardStat(0, 0, 0, 2),
  rot4(2, 0, 0, 0),
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
  // makeCardStat(2, 1, 1, 0),
  // makeCardStat(0, 2, 1, 1),
  // makeCardStat(1, 0, 2, 1),
  // makeCardStat(1, 1, 0, 2),
  rot4(2, 1, 1, 0),

  // makeCardStat(2, 1, 0, 1),
  // makeCardStat(1, 2, 1, 0),
  // makeCardStat(0, 1, 2, 1),
  // makeCardStat(1, 0, 1, 2),
  rot4(2, 1, 0, 1),

  // makeCardStat(1, 1, 2, 0),
  // makeCardStat(0, 1, 1, 2),
  // makeCardStat(2, 0, 1, 1),
  // makeCardStat(1, 2, 0, 1),
  rot4(1, 1, 2, 0),
  // slammers
  // makeCardStat(2, 0, 0, 0, ["slam"], [], [], []),
  // makeCardStat(0, 2, 0, 0, [], ["slam"], [], []),
  // makeCardStat(0, 0, 2, 0, [], [], ["slam"], []),
  // makeCardStat(0, 0, 0, 2, [], [], [], ["slam"]),
  rot4(2, 0, 0, 0, ["slam"]),

  makeCardStat(1, 1, 1, 1, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(0, 2, 0, 2, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(2, 0, 2, 0, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(0, 1, 2, 1, [], ["slam", "bomb"], ["slam"], ["slam", "bomb"]),

  // makeCardStat(2, 2, 0, 0, ["slam"], ["slam"], ["slam"], ["slam"]),
  // makeCardStat(0, 2, 2, 0, ["slam"], ["slam"], ["slam"], ["slam"]),
  // makeCardStat(0, 0, 2, 2, ["slam"], ["slam"], ["slam"], ["slam"]),
  // makeCardStat(2, 0, 0, 2, ["slam"], ["slam"], ["slam"], ["slam"]),
  rot4(2, 2, 0, 0, ["slam"], ["slam"]),

  // makeCardStat(0, 2, 0, 2, [], [], [], [], true),
  // makeCardStat(2, 0, 2, 0, [], [], [], [], true),
  rot2(0, 2, [], [], true),
  makeCardStat(2, 2, 2, 0, [], [], [], [], true),
  makeCardStat(2, 0, 2, 2, [], [], [], [], true),

  makeCardStat(0, 2, 2, 2, [], [], ["auto"], [], true),

  // makeCardStat(0, 3, 0, 3, [], [], [], [], true),
  // makeCardStat(3, 0, 3, 0, [], [], [], [], true),
  rot2(0, 3, [], [], true),
  rot4(2, 2, 0, 0),
  rot2(2, 0),
  rot4(2, 2, 2, 0),
  rot4(1, 0, 0, 0, ["bomb"]),
  rot4(1, 1, 0, 0, ["bomb"], ["bomb"]),
  rot4(1, 1, 1, 0, ["bomb"], ["bomb"], ["bomb"]),
  makeCardStat(1, 1, 1, 1, ["bomb"], ["bomb"], ["bomb"], ["bomb"]),
  makeCardStat(2, 2, 0, 0, ["swap"], ["swap"]),

  makeCardStat(2, 2, 0, 0, [], ["swap"]),
  makeCardStat(0, 0, 2, 2, [], [], [], ["swap"]),

  makeCardStat(2, 0, 0, 2, ["swap"]),
  makeCardStat(0, 2, 2, 0, [], [], ["swap"]),
  makeCardStat(1, 1, 0, 0, ["bomb", "swap"], ["bomb", "swap"]),
  makeCardStat(2, 2, 0, 0, ["swap"]),
  makeCardStat(0, 0, 2, 2, [], [], ["swap"]),
  makeCardStat(1, 0, 0, 2, ["bomb", "swap"], [], [], ["swap"]),
  rot4(0, 2, 1, 2, [], [], ["bomb", "swap"], []).slice(0, 3),
  makeCardStat(0, 2, 2, 2, [], [], ["swap"]),
  rot4(2, 0, 0, 0, ["auto"]),
  rot4(2, 2, 0, 0, [], ["auto"]),

  makeCardStat(2, 0, 0, 2, ["auto", "swap"], [], [], ["swap"]),
  makeCardStat(0, 0, 0, 2, [], [], [], ["swap"]),
  makeCardStat(2, 2, 0, 0, [], ["auto", "swap"], [], []),
  makeCardStat(2, 2, 0, 0, ["swap", "auto"], [], [], []),
  makeCardStat(2, 2, 0, 0, ["swap"], ["auto"], [], []),
  makeCardStat(2, 2, 2, 0, ["slam"], ["slam"], ["slam"]),
  makeCardStat(2, 0, 2, 2, ["swap"], ["swap"], ["swap"], ["swap"]),

  rot4(2, 0, 0, 0, ["wind"]),
  rot4(2, 2, 0, 0, ["wind"], ["wind"]),
  rot2(2, 0, ["wind"]),
  makeCardStat(2, 0, 2, 0, ["wind"], [], ["wind", "auto"]),
  makeCardStat(2, 2, 2, 0, ["wind"], ["wind"], ["wind"]),
  makeCardStat(2, 0, 2, 2, ["wind"], [], ["wind"], ["wind"]),

  rot4(3, 3, 0, 0),
  rot2(0, 3),
  rot4(3, 3, 3, 0),

  makeCardStat(2, 3, 0, 3, ["auto"]),
  makeCardStat(3, 2, 0, 2, ["wind"], ["wind"], ["wind"], ["wind"]),
  makeCardStat(0, 2, 3, 2, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(3, 2, 3, 0),
  makeCardStat(3, 0, 3, 2, ["slam"], ["slam"], ["slam"], ["slam"]),
  makeCardStat(2, 3, 2, 0, ...allStat(["wind"])),
  makeCardStat(0, 3, 3, 3, ...allStat(["wind"])),
  makeCardStat(3, 3, 3, 3, ...allStat(["slam"])),
  makeCardStat(
    1,
    3,
    1,
    3,
    ["slam", "bomb"],
    ["slam"],
    ["slam", "bomb"],
    ["slam"]
  ),
].flat();

// TODO: save/load to/from localstorage for dynamic cardlists
const cardStatExtras: Card[] = [
  new Card("blue", "test", makeCardStat(1, 1, 1, 1, [], [], [], [], true)),
  new Card(
    "blue",
    "test",
    makeCardStat(1, 1, 1, 1, ["slam"], ["slam"], ["slam"], ["slam"], false)
  ),
  new Card(
    "blue",
    "test",
    makeCardStat(1, 1, 1, 1, ["wind"], ["wind"], ["wind"], ["wind"], false)
  ),
  new Card(
    "blue",
    "test",
    makeCardStat(1, 1, 1, 1, ["bomb"], ["bomb"], ["bomb"], ["bomb"], false)
  ),
  new Card(
    "blue",
    "test",
    makeCardStat(1, 1, 1, 1, ["swap"], ["swap"], ["swap"], ["swap"], false)
  ),
  new Card(
    "blue",
    "test",
    makeCardStat(1, 1, 1, 1, ["auto"], ["auto"], ["auto"], ["auto"], false)
  ),
  new Card(
    "blue",
    "test",
    makeCardStat(
      1,
      1,
      1,
      1,
      ["slam", "wind", "bomb", "swap", "auto"],
      ["slam", "wind", "bomb", "swap", "auto"],
      ["slam", "wind", "bomb", "swap", "auto"],
      ["slam", "wind", "bomb", "swap", "auto"],
      false
    )
  ),
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
      console.warn(
        "could not read cards.csv, attempting backup cardList population"
      );
      for (let i = 0; i < cardStatList.length; i++) {
        const c = cardStatList[i];
        cardList[i] = new Card("blue", "maidenless", c);
      }
    }
    console.log("All done!");
    console.log(cardList);
  },
});

cardStatExtras.forEach((c) => {
  cardList.push(c);
});

console.log("END");
