"use strict";

import { CardStat, Card } from "./card";
import Papa from "papaparse";

console.log("READ");

Papa.parse("/cards.csv", {
  download: true,
  step: function (row) {
    console.log("Row:", row.data);
    const i = Number(row.data[3]) - 1;
    if (cardStatList[i]) {
      cardList[i] = new Card("blue", row.data[2], cardStatList[i]);
    }
  },
  complete: function () {
    console.log("All done!");
    console.log(cardList);
  },
});
console.log("END");

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
    if (stat.dirs.u) stat.dirs.u[e] = true;
  });
  ds.forEach((e) => {
    if (stat.dirs.d) stat.dirs.d[e] = true;
  });
  ls.forEach((e) => {
    if (stat.dirs.l) stat.dirs.l[e] = true;
  });
  rs.forEach((e) => {
    if (stat.dirs.r) stat.dirs.r[e] = true;
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
  // 0
  makeCardStat(0, [], 0, [], 0, [], 0, []),
  // 3
  makeCardStat(1, [], 0, [], 1, [], 1, []),
  makeCardStat(1, [], 1, [], 0, [], 1, []),
  // 1, double
  makeCardStat(2, [], 0, [], 0, [], 0, []),
  makeCardStat(0, [], 2, [], 0, [], 0, []),
  makeCardStat(0, [], 0, [], 2, [], 0, []),
  makeCardStat(0, [], 0, [], 0, [], 2, ["wind"]),
];

const cardList: Card[] = Array(cardStatList.length);

console.log("cardList", cardList);

export { cardList };
