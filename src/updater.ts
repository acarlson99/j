"use strict";

import { Card } from "./card";
import { Board } from "./board";
import { Cursor } from "./cursor";
import { EObstacleName } from "./obstacles";
import { GameController, Game } from "./gameController";
import { CardEditor } from "./cardEditor";
import { clamp } from "./util";

class Updater {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  colors = ["black", "white", "maroon"];

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

  updateWH() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scw = h + (h / this.boardSize) * 3;
    const sch = w - (w / this.boardSize) * 3;
    // console.log(w, h, scw);
    if (w >= scw) {
      this.canvas.height = h;
      this.canvas.width = scw;
      return true;
    } else {
      // TODO: fix this to avoid weird gap on skinny window
      this.canvas.height = sch;
      this.canvas.width = w;
      return true;
    }
  }

  xToCoord(x: number, cardWidth: number) {
    return x * cardWidth;
  }

  yToCoord(y: number, cardWidth: number) {
    return y * cardWidth;
  }

  getCardWidth() {
    // NOTE: using `ceil` instead of `floor` to avoid weird looking margins
    return Math.min(
      Math.ceil(this.canvas.width / (this.boardSize + 3)),
      Math.ceil(this.canvas.height / this.boardSize)
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

  drawCardArrows(x: number, y: number, cardWidth: number, stats: any) {
    // 1/5 wide/ 3/5 long
    const border = 2;
    const margin = cardWidth / 5;
    const width = cardWidth / 5 - border;
    const ctx = this.ctx;
    ctx.fillStyle = "black";
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

    // console.log("stats", stats);
    arrowFuncs.forEach((e) => {
      if (!(e.d in stats)) {
        return;
      }
      const s = stats[e.d];
      if (!(s.v > 0)) {
        return;
      }
      const c = this.colors[clamp(0, s.v - 1, 3)];
      ctx.fillStyle = c;
      ctx.fillRect(e.v[0], e.v[1], e.v[2], e.v[3]);
    });
  }

  updateCard(v: Card, x: number, y: number) {
    const ctx = this.ctx;
    const cardWidth = this.getCardWidth();
    x *= cardWidth;
    y *= cardWidth;
    ctx.fillStyle = v.color;
    ctx.fillRect(x, y, cardWidth, cardWidth);
    ctx.fillStyle = "black";
    if (v.stats) {
      this.drawCardArrows(x, y, cardWidth, v.stats);
    } else {
      console.warn("no stats");
    }
  }

  updateCursor(v: Cursor, x: number, y: number) {
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

  updateGameController(v: GameController) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "green";
    // background
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateGame(v: Game, s1: number, s2: number) {
    const ctx = this.ctx;
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(
      String(s1),
      this.xToCoord(this.boardSize + 1, this.getCardWidth()),
      this.yToCoord(2, this.getCardWidth())
    );
    ctx.fillText(
      String(s2),
      this.xToCoord(this.boardSize + 1, this.getCardWidth()),
      this.yToCoord(this.boardSize - 2, this.getCardWidth())
    );
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  updateCardEditor(v: CardEditor) {}
  updateBoard(v: Board) {}
  /* eslint-enable @typescript-eslint/no-empty-function */
}

export { Updater };
