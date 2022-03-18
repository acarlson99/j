"use strict";

import { Board, sds, EDirection, opposites } from "./board";
import { Card, CardStat, statDirection } from "./card";
import { Controller, Menu, PauseMenu, EScreenType } from "./controller";
import { Cursor } from "./cursor";
import { Game, GameController } from "./gameController";
import { EObstacleName } from "./obstacles";
import { clamp } from "./util";
import { AMenu } from "./AMenu";

// TODO: change board width/height and card width/height calculations
class Updater {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pieceColors = {
    swap: "darkgrey",
    auto: "green",
    cardRed: "red",
    cardBlue: "blue",
    grave: "#13070C",
    bomb: "#FF1B1C",
    slam: "#3C88B1",
    wind: "#FF3366",
    arrow1: "black",
    arrow2: "white",
    arrow3: "yellow",
  };
  arrowColors = [
    "grey",
    this.pieceColors.arrow1,
    this.pieceColors.arrow2,
    this.pieceColors.arrow3,
  ];

  private static _instance: Updater;
  boardSize: number;

  private constructor() {
    if (Updater._instance) {
      console.error("creating duplicate updater");
    }
    this.boardSize = 1;
    this.canvas = document.createElement("canvas");
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw "CANVAS GETCONTEXT FAIL";
    }
    this.ctx = ctx;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.updateWH();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  updateBoardSize(n: number) {
    this.boardSize = n;
  }

  // FIXME: this function is bad and wrong
  updateWH() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scw = h + (h / this.boardSize) * 3; // TODO: dont do this, scale board properly, dont change canvas size based on difference like this
    if (w >= scw) {
      this.canvas.height = h;
      this.canvas.width = scw;
    } else {
      // TODO: avoid big margin on botton with skinny window
      this.canvas.height = h;
      this.canvas.width = w;
    }
  }

  xToCoord(x: number, cardWidth: number) {
    return x * cardWidth;
  }

  yToCoord(y: number, cardWidth: number) {
    return y * cardWidth;
  }

  getCardWidth() {
    return Math.min(
      Math.floor(this.canvas.width / (this.boardSize + 3)), // FIXME: remove scaling
      Math.floor(this.canvas.height / this.boardSize)
    );
  }

  updateObstacle(name: EObstacleName, x: number, y: number) {
    const ctx = this.ctx;
    const cardWidth = this.getCardWidth();
    switch (name) {
    case EObstacleName.gem: {
      const radius = cardWidth / 3;
      const centerX = this.xToCoord(x, cardWidth) + cardWidth / 2;
      const centerY = this.yToCoord(y, cardWidth) + cardWidth / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = "lavender";
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#003300";
      ctx.stroke();
      break;
    }
    case EObstacleName.illegal: {
      ctx.fillStyle = "grey";
      ctx.fillRect(
        this.xToCoord(x, cardWidth),
        this.yToCoord(y, cardWidth),
        cardWidth,
        cardWidth
      );
      break;
    }
    case EObstacleName.graveyard: {
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = "darkgreen";
      ctx.fillRect(
        this.xToCoord(x, cardWidth),
        this.yToCoord(y, cardWidth),
        cardWidth,
        cardWidth
      );
      ctx.globalAlpha = 1.0;
      break;
    }
    case EObstacleName.pitfall: {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "brown";
      ctx.fillRect(
        this.xToCoord(x, cardWidth),
        this.yToCoord(y, cardWidth),
        cardWidth,
        cardWidth
      );
      ctx.globalAlpha = 1.0;
      break;
    }
    }
  }

  drawCardArrows(x: number, y: number, cardWidth: number, stats: CardStat) {
    // 1/5 wide/ 3/5 long
    const border = 2;
    const margin = cardWidth / 5;
    const width = cardWidth / 5 - border;
    const ctx = this.ctx;
    const arrowFuncs = [
      {
        d: "l",
        v: [x + border, y + margin, width, cardWidth - margin * 2],
      },
      {
        d: "r",
        v: [
          x + cardWidth - width - border,
          y + margin,
          width,
          cardWidth - margin * 2,
        ],
      },
      {
        d: "u",
        v: [x + margin, y + border, cardWidth - margin * 2, width],
      },
      {
        d: "d",
        v: [
          x + margin,
          y + cardWidth - width - border,
          cardWidth - margin * 2,
          width,
        ],
      },
    ];

    ctx.fillStyle = "darkgrey";
    // if (
    //   statDirection(stats, EDirection.Up)?.swap ||
    //   statDirection(stats, EDirection.Down)?.swap
    // ) {
    //   ctx.fillRect(
    //     x + (cardWidth / 5) * 2,
    //     y + margin,
    //     cardWidth / 5,
    //     cardWidth - margin * 2
    //   );
    // }
    // if (
    //   statDirection(stats, EDirection.Left)?.swap ||
    //   statDirection(stats, EDirection.Right)?.swap
    // ) {
    //   ctx.fillRect(
    //     x + margin,
    //     y + (cardWidth / 5) * 2,
    //     cardWidth - margin * 2,
    //     cardWidth / 5
    //   );
    // }

    const drawRectFromCenter = (
      ctx: CanvasRenderingContext2D,
      ratio: number,
      dir: string
    ) => {
      const width = cardWidth / ratio;
      if (dir == "u" || dir == "d") {
        ctx.fillRect(
          x + width * ((ratio - 1) / 2),
          y + (dir == "d" ? cardWidth / 2 : border),
          width,
          cardWidth / 2 - border
        );
      } else {
        ctx.fillRect(
          x + (dir == "r" ? cardWidth / 2 : border),
          y + width * ((ratio - 1) / 2),
          cardWidth / 2 - border,
          width
        );
      }
    };

    arrowFuncs.forEach((e) => {
      const s = statDirection(stats, sds[e.d]);
      if (!s || s?.v < 0) {
        return;
      }
      // auto
      if (s.auto) {
        ctx.fillStyle = this.pieceColors.auto;
        drawRectFromCenter(ctx, 3, e.d);
      }
    });

    arrowFuncs.forEach((e) => {
      const s = statDirection(stats, sds[e.d]);
      if (!s || s?.v < 0) {
        return;
      }
      // swap
      if (s.swap || statDirection(stats, opposites[sds[e.d]])?.swap) {
        ctx.fillStyle = this.pieceColors.swap;
        drawRectFromCenter(ctx, 6, e.d);
      }
      const c = this.arrowColors[clamp(0, s.v, 3)];
      ctx.fillStyle = c;
      ctx.fillRect(e.v[0], e.v[1], e.v[2], e.v[3]);

      const numBands = 2;
      const drawF = (color: string, bandPos: number) => {
        ctx.fillStyle = color;
        // swap direction of bands on opposite sides
        if (e.d == "d" || e.d == "r") {
          bandPos = numBands - bandPos - 1;
        }
        if (e.d == "u" || e.d == "d") {
          const h = e.v[3] / 4;
          const w = e.v[2] / numBands;
          ctx.fillRect(
            e.v[0] + w * bandPos,
            e.v[1] + (e.d == "d" ? 0 : e.v[3] - h),
            w,
            h
          );
          ctx.fillRect(
            e.v[0] + w * bandPos,
            e.v[1] + (e.d == "d" ? e.v[3] - h : 0),
            w,
            h
          );
        } else {
          const h = e.v[3] / numBands;
          const w = e.v[2] / 4;
          ctx.fillRect(
            e.v[0] + (e.d == "r" ? 0 : e.v[2] - w),
            e.v[1] + h * bandPos,
            w,
            h
          );
          ctx.fillRect(
            e.v[0] + (e.d == "r" ? e.v[2] - w : 0),
            e.v[1] + h * bandPos,
            w,
            h
          );
        }
      };
      // bomb
      if (s.bomb) {
        ctx.fillStyle = this.pieceColors.bomb;
        const w = e.v[2] / 2;
        const h = e.v[3] / 2;
        ctx.fillRect(e.v[0] + w / 2, e.v[1] + h / 2, w, h);
      }
      // slam
      if (s.slam) {
        drawF(this.pieceColors.slam, 1);
      }
      // wind
      if (s.wind) {
        drawF(this.pieceColors.wind, 0);
      }
    });
    // grave
    if (stats.graveyard) {
      const h = margin;
      const w = margin;
      ctx.fillStyle = "white";
      ctx.fillRect(x, y + cardWidth - h, w, h);
      ctx.fillStyle = this.pieceColors.grave;
      ctx.fillRect(
        x + border,
        y + cardWidth + border - h,
        w - border * 2,
        h - border * 2
      );
    }
  }

  updateCard(v: Card, x: number, y: number) {
    const ctx = this.ctx;
    const cardWidth = this.getCardWidth();
    x *= cardWidth;
    y *= cardWidth;
    ctx.fillStyle =
      v.color == "blue" ? this.pieceColors.cardBlue : this.pieceColors.cardRed;
    ctx.fillRect(x, y, cardWidth, cardWidth);
    ctx.fillStyle = "black";
    if (v.stats) {
      this.drawCardArrows(x, y, cardWidth, v.stats);
    }
  }

  drawCursor(x: number, y: number) {
    const ctx = this.ctx;
    const cardWidth = this.getCardWidth();
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.rect(
      this.xToCoord(x, cardWidth) + ctx.lineWidth / 2,
      this.yToCoord(y, cardWidth) + ctx.lineWidth / 2,
      cardWidth - ctx.lineWidth,
      cardWidth - ctx.lineWidth
    );
    ctx.stroke();
  }

  updateCursor(v: Cursor, x: number, y: number) {
    this.drawCursor(x, y);
  }

  updateGameController(v: GameController, color = "green") {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = color;
    // background
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    document.body.style.backgroundColor = color;
  }

  updateController(c: Controller) {
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    document.body.style.backgroundColor = "green";
  }

  updateGame(v: Game, s1: number, s2: number) {
    const ctx = this.ctx;
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    const winner = v.getWinner();
    ctx.fillStyle = "black";
    ctx.fillText(
      String(s1),
      this.xToCoord(this.boardSize + 1, this.getCardWidth()),
      this.yToCoord(2, this.getCardWidth())
    );
    if (winner === 1) {
      ctx.fillStyle = "gold";
      ctx.fillRect(
        this.xToCoord(this.boardSize + 1, this.getCardWidth()),
        this.yToCoord(2, this.getCardWidth()),
        this.getCardWidth(),
        this.getCardWidth()
      );
    }
    ctx.fillStyle = "black";
    ctx.fillText(
      String(s2),
      this.xToCoord(this.boardSize + 1, this.getCardWidth()),
      this.yToCoord(this.boardSize - 2, this.getCardWidth())
    );
    if (winner === -1) {
      ctx.fillStyle = "gold";
      ctx.fillRect(
        this.xToCoord(this.boardSize + 1, this.getCardWidth()),
        this.yToCoord(this.boardSize - 2, this.getCardWidth()),
        this.getCardWidth(),
        this.getCardWidth()
      );
    }
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  // TODO: something here
  updateBoard(v: Board) {}
  /* eslint-enable @typescript-eslint/no-empty-function */

  drawAMenu(m: AMenu) {
    for (let i = 0; i < m.menuItems.length; i++) {
      const s = m.menuItems[i];
      this.ctx.fillStyle = "black";
      let height = 75;
      this.ctx.font = String(height) + "px Arial";
      while (
        height > 10 &&
        m.menuItems
          .map((st: string) => this.ctx.measureText("> " + st + " <").width)
          .reduce((a: number, b: number) => Math.max(a, b)) > this.canvas.width
      ) {
        // TODO: not this; this is bad
        height--;
        this.ctx.font = String(height) + "px Courier";
      }
      const metrics = this.ctx.measureText(s);
      if (i != m.arrowPos) {
        this.ctx.fillText(
          s,
          this.canvas.width / 2 - metrics.width / 2,
          (i + 1) * height * 1.5
        );
      } else {
        this.ctx.fillText(
          "> " + s + " <",
          this.canvas.width / 2 -
            metrics.width / 2 -
            this.ctx.measureText("> ").width,
          (i + 1) * height * 1.5
        );
      }
    }
  }
}

export { Updater };
