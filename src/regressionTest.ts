"use strict";

import { Board, EDirection } from "./board";
import { Card, CardStat } from "./card";

type Test = {
  p: {
    size: number;
    direction: EDirection;
    pushed: {
      stats: CardStat;
      x: number;
      y: number;
      color: string;
      name: string;
    }[];
    pusher: {
      stats: CardStat;
      x: number;
      y: number;
      color: string;
      name: string;
    };
  };
  w: {
    board: {
      x: number;
      y: number;
      name?: string | boolean;
      color?: string | boolean;
    }[];
    want: boolean;
  };
};

function cardTest() {
  console.log("BEGIN TEST");
  //   const c = new Card("blue", "test", { l: { v: 1 } });
  const cpush = [
    {
      d: EDirection.Left,
      stats: { dirs: { l: { v: 1 } } },
      w: true,
    },
    {
      d: EDirection.Right,
      stats: { dirs: { l: { v: 1 } } },
      w: false,
    },
    {
      d: EDirection.Right,
      stats: { dirs: { r: { v: 2 } } },
      w: true,
    },
  ];
  for (let i = 0; i < cpush.length; i++) {
    const t = cpush[i];
    const c = new Card("blue", "test", t.stats);
    const got = c.canPush(t.d);
    if (t.w !== got) {
      console.warn("canpush test fail: want:", t.w, "got:", got);
    }
  }
  const cbp = [
    {
      p: {
        stats: { dirs: { l: { v: 1 } } },
        d: EDirection.Left,
        p: 1,
      },
      w: true,
    },
    {
      p: {
        stats: { dirs: { l: { v: 1 } } },
        d: EDirection.Right,
        p: 1,
      },
      w: false,
    },
    {
      p: {
        stats: { dirs: { l: { v: 1 } } },
        d: EDirection.Left,
        p: 2,
      },
      w: true,
    },
    {
      p: {
        stats: { dirs: { l: { v: 1 } } },
        d: EDirection.Right,
        p: 2,
      },
      w: true,
    },
    {
      p: {
        stats: { dirs: { l: { v: 1 } } },
        d: EDirection.Up,
        p: 1,
      },
      w: true,
    },
    {
      p: {
        stats: { dirs: { l: { v: 1 } } },
        d: EDirection.Down,
        p: 1,
      },
      w: true,
    },
    {
      p: {
        stats: { dirs: { l: { v: 1 } } },
        d: EDirection.Up,
        p: 2,
      },
      w: true,
    },
    {
      p: {
        stats: { dirs: { l: { v: 1 } } },
        d: EDirection.Down,
        p: 2,
      },
      w: true,
    },

    {
      p: {
        stats: {
          dirs: {
            l: { v: 1 },
            u: { v: 2 },
          },
        },
        d: EDirection.Left,
        p: 1,
      },
      w: true,
    },
    {
      p: {
        stats: {
          dirs: {
            l: { v: 1 },
            u: { v: 2 },
          },
        },
        d: EDirection.Right,
        p: 1,
      },
      w: false,
    },
    {
      p: {
        stats: {
          dirs: {
            l: { v: 1 },
            u: { v: 2 },
          },
        },
        d: EDirection.Up,
        p: 1,
      },
      w: true,
    },
    {
      p: {
        stats: {
          dirs: {
            l: { v: 1 },
            u: { v: 2 },
          },
        },
        d: EDirection.Down,
        p: 1,
      },
      w: false,
    },

    {
      p: {
        stats: {
          dirs: {
            l: { v: 1 },
            r: { v: 2 },
            d: { v: 1 },
          },
        },
        d: EDirection.Right,
        p: 2,
      },
      w: true,
    },
  ];
  for (let i = 0; i < cbp.length; i++) {
    const t = cbp[i];
    const c = new Card("blue", "test", t.p.stats);
    const got = c.canBePushed(t.p.d, t.p.p);
    if (t.w !== got) {
      console.warn("canbepushed test fail: want:", t.w, "got:", got);
    }
  }

  const cardPushes = [
    {
      p: {
        pusher: { dirs: { l: { v: 1 } } }, // blue
        pushed: { dirs: { l: { v: 2 } } }, // red
        d: EDirection.Left,
      },
      boardPoss: [
        {
          x: 1,
          y: 1,
          color: "blue",
        },
        {
          x: 0,
          y: 1,
          color: "red",
        },
      ],
      w: true,
    },
    {
      p: {
        pusher: { dirs: { l: { v: 1 } } }, // blue
        pushed: { dirs: { l: { v: 2 } } }, // red
        d: EDirection.None,
      },
      boardPoss: [
        {
          x: 1,
          y: 1,
          color: "red",
        },
      ],
      w: false,
    },
    {
      p: {
        pusher: {
          dirs: {
            l: { v: 1 },
            r: { v: 3 },
          },
        }, // blue
        pushed: {
          dirs: {
            l: { v: 2 },
            u: { v: 2 },
            d: { v: 2 },
          },
        }, // red
        d: EDirection.Right,
      },
      boardPoss: [
        {
          x: 1,
          y: 1,
          color: "blue",
        },
        {
          x: 2,
          y: 1,
          color: "red",
        },
      ],
      w: true,
    },
    {
      p: {
        pusher: { dirs: { l: { v: 1 } } }, // blue
        pushed: {
          dirs: {
            l: { v: 2 },
            r: { v: 1 },
          },
        }, // red
        d: EDirection.Left,
      },
      boardPoss: [
        {
          x: 1,
          y: 1,
          color: "red",
        },
      ],
      w: false,
    },
  ];
  for (let i = 0; i < cardPushes.length; i++) {
    const t = cardPushes[i];
    const pusher = new Card("blue", "test1", t.p.pusher);
    const pushed = new Card("red", "test2", t.p.pushed);
    const board = new Board(3, false);
    const wasSet = board.setCard(1, 1, pushed);
    if (!wasSet) {
      console.error("regression test in setCard, returned", wasSet);
    }
    const got = board.playCard(1, 1, t.p.d, pusher);
    if (got !== t.w) {
      console.warn("cardPush test", i, "fail: want:", t.w, "got:", got);
    }

    for (let j = 0; j < t.boardPoss.length; j++) {
      const e = t.boardPoss[j];
      const [x, y, expectedColor] = [e.x, e.y, e.color];
      const _card = board.getCard(x, y);
      if (_card && _card.color == expectedColor) {
        continue;
      }
      console.warn("board pos wrong");
    }
  }

  const tests: Test[] = [
    {
      p: {
        size: 5,
        direction: EDirection.Right,
        pushed: [
          {
            stats: {
              dirs: {},
            },
            x: 0,
            y: 0,
            color: "red",
            name: "r1",
          },
          {
            stats: {
              dirs: {
                l: { v: 2 },
              },
            },
            x: 1,
            y: 0,
            color: "red",
            name: "r2",
          },
        ],
        pusher: {
          stats: {
            dirs: {
              r: { v: 2 },
            },
          },
          x: 0,
          y: 0,
          color: "blue",
          name: "b1",
        },
      },
      w: {
        board: [],
        want: false,
      },
    },
  ];
  const slamTests: Test[] = [
    {
      p: {
        size: 5,
        direction: EDirection.None,
        pushed: [
          {
            stats: {
              dirs: {
                l: { v: 1 },
                u: { v: 1 },
                d: { v: 1 },
              },
            },
            x: 3,
            y: 3,
            color: "red",
            name: "test2",
          },
        ],

        pusher: {
          stats: {
            dirs: {
              l: {
                v: 1,
                slam: true,
              },
            },
          },
          x: 4,
          y: 3,
          color: "blue",
          name: "test1",
        },
      },

      w: {
        board: [
          {
            x: 4,
            y: 3,
            name: "test1",
            color: "blue",
          },
          {
            x: 2,
            y: 3,
            name: "test2",
            color: "red",
          },
          {
            x: 3,
            y: 3,
            name: false,
          },
        ],

        want: true,
      },
    },
    {
      p: {
        size: 5,
        direction: EDirection.Left,
        pushed: [
          {
            stats: {
              dirs: {
                l: { v: 1 },
                u: { v: 1 },
                d: { v: 1 },
              },
            },
            x: 3,
            y: 3,
            color: "red",
            name: "test2",
          },
        ],

        pusher: {
          stats: {
            dirs: {
              l: {
                v: 1,
                slam: true,
              },
            },
          },
          x: 3,
          y: 3,
          color: "blue",
          name: "test1",
        },
      },

      w: {
        board: [
          {
            x: 3,
            y: 3,
            name: "test1",
            color: "blue",
          },
          {
            x: 1,
            y: 3,
            name: "test2",
            color: "red",
          },
          {
            x: 2,
            y: 3,
            name: false,
          },
        ],

        want: true,
      },
    },
    {
      p: {
        size: 5,
        direction: EDirection.Left,
        pushed: [
          {
            stats: {
              dirs: {
                l: { v: 1 },
                u: { v: 1 },
                d: { v: 1 },
              },
            },
            x: 3,
            y: 3,
            color: "red",
            name: "test2",
          },
        ],

        pusher: {
          stats: {
            dirs: {
              l: {
                v: 1,
                slam: true,
              },
              r: {
                v: 1,
                slam: true,
              },
              u: {
                v: 1,
                slam: true,
              },
              d: {
                v: 1,
                slam: true,
              },
            },
          },
          x: 3,
          y: 3,
          color: "blue",
          name: "test1",
        },
      },

      w: {
        board: [
          {
            x: 3,
            y: 3,
            name: "test1",
            color: "blue",
          },
          {
            x: 1,
            y: 3,
            name: "test2",
            color: "red",
          },
          {
            x: 2,
            y: 3,
            name: false,
          },
        ],
        want: true,
      },
    },
    {
      p: {
        size: 5,
        pushed: [
          {
            stats: {
              dirs: {
                l: { v: 1 },
                u: { v: 1 },
                d: { v: 1 },
              },
            },
            x: 1,
            y: 1,
            color: "red",
            name: "r1",
          },
        ],

        direction: EDirection.None,
        pusher: {
          stats: {
            dirs: {
              l: {
                v: 1,
                slam: true,
              },
              r: {
                v: 1,
                slam: true,
              },
              u: {
                v: 1,
                slam: true,
              },
              d: {
                v: 1,
                slam: true,
              },
            },
          },
          x: 2,
          y: 1,
          color: "blue",
          name: "b1",
        },
      },

      w: {
        board: [
          {
            x: 2,
            y: 1,
            color: "blue",
            name: "b1",
          },
          {
            x: 0,
            y: 1,
            color: "red",
            name: "r1",
          },
        ],
        want: true,
      },
    },
    {
      p: {
        size: 5,
        pushed: [
          {
            stats: {
              dirs: {
                l: { v: 1 },
                u: { v: 1 },
                d: { v: 1 },
              },
            },
            x: 1,
            y: 1,
            color: "red",
            name: "r1",
          },
          {
            stats: {
              dirs: {
                l: { v: 1 },
                u: { v: 1 },
                d: { v: 1 },
              },
            },
            x: 0,
            y: 1,
            color: "red",
            name: "r2",
          },
        ],

        direction: EDirection.None,
        pusher: {
          stats: {
            dirs: {
              l: {
                v: 1,
                slam: true,
              },
              r: {
                v: 1,
                slam: true,
              },
              u: {
                v: 1,
                slam: true,
              },
              d: {
                v: 1,
                slam: true,
              },
            },
          },
          x: 2,
          y: 1,
          color: "blue",
          name: "b1",
        },
      },

      w: {
        board: [
          {
            x: 2,
            y: 1,
            color: "blue",
            name: "b1",
          },
          {
            x: 1,
            y: 1,
            color: "red",
            name: "r1",
          },
          {
            x: 0,
            y: 1,
            color: "red",
            name: "r2",
          },
        ],
        want: true,
      },
    },
  ];
  const windTests: Test[] = [
    {
      p: {
        size: 5,
        direction: EDirection.Left,
        pushed: [
          {
            stats: {
              dirs: {
                l: { v: 1 },
                u: { v: 1 },
                d: { v: 1 },
              },
            },
            x: 3,
            y: 3,
            color: "red",
            name: "test2",
          },
        ],
        pusher: {
          stats: {
            dirs: {
              l: {
                v: 1,
                wind: true,
              },
            },
          },
          x: 3,
          y: 3,
          color: "blue",
          name: "test1",
        },
      },
      w: {
        board: [
          {
            x: 3,
            y: 3,
            name: "test1",
            color: "blue",
          },
          {
            x: 2,
            y: 3,
            name: "test2",
            color: "blue",
          },
          {
            x: 1,
            y: 3,
            name: false,
          },
        ],
        want: true,
      },
    },
    {
      p: {
        size: 5,
        direction: EDirection.Left,
        pushed: [
          {
            stats: {
              dirs: {},
            },
            x: 1,
            y: 1,
            color: "red",
            name: "test2",
          },
          {
            stats: {
              dirs: {},
            },
            x: 0,
            y: 1,
            color: "red",
            name: "test3",
          },
        ],
        pusher: {
          stats: {
            dirs: {
              l: {
                v: 1,
                wind: true,
              },
            },
          },
          x: 1,
          y: 1,
          color: "blue",
          name: "test1",
        },
      },
      w: {
        board: [
          {
            x: 1,
            y: 1,
            name: "test2",
            color: "red",
          },
          {
            x: 0,
            y: 1,
            color: "red",
            name: "test3",
          },
          {
            x: 1,
            y: 3,
            name: false,
          },
        ],
        want: false,
      },
    },
    {
      p: {
        size: 5,
        direction: EDirection.Left,
        pushed: [
          {
            stats: {
              dirs: {},
            },
            x: 1,
            y: 1,
            color: "red",
            name: "test2",
          },
          {
            stats: {
              dirs: {},
            },
            x: 2,
            y: 1,
            color: "red",
            name: "test3",
          },
          {
            stats: {
              dirs: {},
            },
            x: 3,
            y: 1,
            color: "blue",
            name: "test4",
          },
        ],
        pusher: {
          stats: {
            dirs: {
              l: {
                v: 1,
                wind: true,
              },
            },
          },
          x: 3,
          y: 1,
          color: "blue",
          name: "test1",
        },
      },
      w: {
        board: [
          {
            x: 3,
            y: 1,
            color: "blue",
            name: "test1",
          },
          {
            x: 0,
            y: 1,
            color: "blue",
            name: "test2",
          },
          {
            x: 1,
            y: 1,
            color: "blue",
            name: "test3",
          },
          {
            x: 2,
            y: 1,
            color: "red",
            name: "test4",
          },
        ],
        want: true,
      },
    },
  ];
  const bombTests: Test[] = [
    {
      p: {
        size: 5,
        direction: EDirection.Right,
        pushed: [
          {
            stats: {
              dirs: {
                r: {
                  v: 1,
                  bomb: true,
                },
              },
            },
            x: 0,
            y: 0,
            color: "red",
            name: "r1",
          },
          {
            stats: {
              dirs: {
                l: { v: 2 },
              },
            },
            x: 1,
            y: 0,
            color: "red",
            name: "r2",
          },
        ],
        pusher: {
          stats: {
            dirs: {
              r: {
                v: 3,
              },
            },
          },
          x: 0,
          y: 0,
          color: "blue",
          name: "b1",
        },
      },
      w: {
        board: [
          {
            x: 0,
            y: 0,
            color: "blue",
            name: "b1",
          },
          {
            x: 1,
            y: 0,
            color: "red",
            name: "r1",
          },
          {
            x: 2,
            y: 0,
            color: false,
          },
        ],
        want: true,
      },
    },
    {
      p: {
        size: 5,
        direction: EDirection.Right,
        pushed: [
          {
            stats: {
              dirs: {
                r: {
                  v: 1,
                  bomb: true,
                },
              },
            },
            x: 0,
            y: 0,
            color: "red",
            name: "r1",
          },
          {
            stats: {
              dirs: {
                l: { v: 2 },
              },
            },
            x: 1,
            y: 0,
            color: "red",
            name: "r2",
          },
        ],
        pusher: {
          stats: {
            dirs: {
              r: {
                v: 2,
              },
            },
          },
          x: 0,
          y: 0,
          color: "blue",
          name: "b1",
        },
      },
      w: {
        board: [],
        want: false,
      },
    },
    {
      p: {
        size: 5,
        direction: EDirection.Right,
        pushed: [
          {
            stats: {
              dirs: {
                r: {
                  v: 1,
                  bomb: true,
                },
              },
            },
            x: 0,
            y: 0,
            color: "red",
            name: "r1",
          },
          {
            stats: {
              dirs: {
                l: { v: 2 },
              },
            },
            x: 1,
            y: 0,
            color: "red",
            name: "r2",
          },
        ],
        pusher: {
          stats: {
            dirs: {
              r: {
                v: 2,
                bomb: true,
              },
            },
          },
          x: 0,
          y: 0,
          color: "blue",
          name: "b1",
        },
      },
      w: {
        board: [],
        want: false,
      },
    },
  ];
  console.log("BEGIN THE GOOD TEST");
  doTest("tests", tests);
  doTest("slamTests", slamTests);
  // wind tests
  doTest("windTests", windTests);
  // bomb tests
  doTest("bombTests", bombTests);
  // TODO: add grave tests

  console.log("TESTS DONE");
  return 0;
}

function doTest(testName: string, tests: Test[]) {
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    const params = t.p;
    const pusher = new Card(
      params.pusher.color,
      params.pusher.name,
      params.pusher.stats
    );
    const board = new Board(params.size, false);
    params.pushed.forEach((e) => {
      const pushed = new Card(e.color, e.name, e.stats);
      if (!board.setCard(e.x, e.y, pushed)) {
        console.error("regression test in setCard: ", e);
      }
    });
    const got = board.playCard(
      params.pusher.x,
      params.pusher.y,
      params.direction,
      pusher
    );
    let didError = false;
    t.w.board?.forEach((e) => {
      const [x, y, name, color] = [e.x, e.y, e.name, e.color];
      const c = board.getCard(x, y);
      if (
        c === false ||
        (name !== undefined && (c?.name || false) !== name) ||
        (color !== undefined && (c?.color || false) !== color)
      ) {
        if (c === false) {
          console.error("card out of bounds at", x, y);
          didError = true;
          return;
        }
        let sa = "(";
        let sb = "(";
        if (name !== undefined) {
          sa += "name: " + name;
          sb += "name: " + c?.name;
        }
        if (color !== undefined) {
          if (sa.length > 1) {
            sa += ",";
            sb += ",";
          }
          sa += "color: " + color;
          sb += "color: " + c?.color;
        }
        console.warn(
          testName,
          i,
          "card out of place at",
          x,
          y,
          "expected:",
          sa + ")",
          "got:",
          sb + ")"
        );
        didError = true;
      }
    });
    if (didError) {
      console.warn(board);
    }
    if (got != t.w.want) {
      console.warn(testName, i, "fail: want:", t.w.want, "got:", got);
    }
  }
}

export { cardTest };
