"use strict";

import { Card } from "./card";
import { Direction, Board } from "./board";

function cardTest() {
  console.log("BEGIN TEST");
  const c = new Card("blue", "test", { l: { v: 1 } });
  const cpush = [
    { d: Direction.Left, stats: { l: { v: 1 } }, w: true },
    { d: Direction.Right, stats: { l: { v: 1 } }, w: false },
    { d: Direction.Right, stats: { r: { v: 2 } }, w: true },
  ];
  for (let i = 0; i < cpush.length; i++) {
    const t = cpush[i];
    let c = new Card("blue", "test", t.stats);
    const got = c.canPush(t.d);
    if (t.w !== got) {
      console.warn("canpush test fail: want:", t.w, "got:", got);
    } else {
    }
  }
  const cbp = [
    { p: { stats: { l: { v: 1 } }, d: Direction.Left, p: 1 }, w: true },
    { p: { stats: { l: { v: 1 } }, d: Direction.Right, p: 1 }, w: false },
    { p: { stats: { l: { v: 1 } }, d: Direction.Left, p: 2 }, w: true },
    { p: { stats: { l: { v: 1 } }, d: Direction.Right, p: 2 }, w: true },
    { p: { stats: { l: { v: 1 } }, d: Direction.Up, p: 1 }, w: true },
    { p: { stats: { l: { v: 1 } }, d: Direction.Down, p: 1 }, w: true },
    { p: { stats: { l: { v: 1 } }, d: Direction.Up, p: 2 }, w: true },
    { p: { stats: { l: { v: 1 } }, d: Direction.Down, p: 2 }, w: true },

    {
      p: { stats: { l: { v: 1 }, u: { v: 2 } }, d: Direction.Left, p: 1 },
      w: true,
    },
    {
      p: { stats: { l: { v: 1 }, u: { v: 2 } }, d: Direction.Right, p: 1 },
      w: false,
    },
    {
      p: { stats: { l: { v: 1 }, u: { v: 2 } }, d: Direction.Up, p: 1 },
      w: true,
    },
    {
      p: { stats: { l: { v: 1 }, u: { v: 2 } }, d: Direction.Down, p: 1 },
      w: false,
    },

    {
      p: {
        stats: { l: { v: 1 }, r: { v: 2 }, d: { v: 1 } },
        d: Direction.Right,
        p: 2,
      },
      w: true,
    },
  ];
  for (let i = 0; i < cbp.length; i++) {
    const t = cbp[i];
    // console.log("t:", t);
    // console.log(t.p.stats);
    let c = new Card("blue", "test", t.p.stats);
    // console.log("RUN TEST c:", c);
    const got = c.canBePushed(t.p.d, t.p.p);
    if (t.w !== got) {
      console.warn("canbepushed test fail: want:", t.w, "got:", got);
    }
  }

  const cardPushes = [
    {
      p: {
        pusher: { l: { v: 1 } }, // blue
        pushed: { l: { v: 2 } }, // red
        d: Direction.Left,
      },
      boardPoss: [
        { x: 1, y: 1, color: "blue" },
        { x: 0, y: 1, color: "red" },
      ],
      w: true,
    },
    {
      p: {
        pusher: { l: { v: 1 }, r: { v: 3 } }, // blue
        pushed: { l: { v: 2 }, u: { v: 2 }, d: { v: 2 } }, // red
        d: Direction.Right,
      },
      boardPoss: [
        { x: 1, y: 1, color: "blue" },
        { x: 2, y: 1, color: "red" },
      ],
      w: true,
    },
    {
      p: {
        pusher: { l: { v: 1 } }, // blue
        pushed: { l: { v: 2 }, r: { v: 1 } }, // red
        d: Direction.Left,
      },
      boardPoss: [
        { x: 1, y: 1, color: "red" },
        // { x: 0, y: 1, color: "red" },
      ],
      w: false,
    },
  ];
  for (let i = 0; i < cardPushes.length; i++) {
    let t = cardPushes[i];
    let pusher = new Card("blue", "test1", t.p.pusher);
    let pushed = new Card("red", "test2", t.p.pushed);
    let board = new Board(3, false);
    // console.log("board", board);
    let wasSet = board.setCard(1, 1, pushed);
    if (!wasSet) console.error("regression test in setCard, returned", wasSet);
    // console.log(board);
    let got = board.pushC(1, 1, t.p.d, pusher);
    // console.log("cardPushes", got, t.w);
    // console.log(board);
    if (got !== t.w) {
      console.warn("cardPush test", i, "fail: want:", t.w, "got:", got);
    }

    for (let j = 0; j < t.boardPoss.length; j++) {
      let e = t.boardPoss[j];
      let [x, y, expectedColor] = [e.x, e.y, e.color];
      let _card = board.getCard(x, y);
      if (_card && _card.color == expectedColor) continue;
      console.warn("board pos wrong");
    }
  }

  console.log("TESTS DONE");
  return 0;
}

export { cardTest };
