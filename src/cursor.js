import { cardWidth, xToCoord, yToCoord, gc } from "./gameController.js";
import { clamp } from "./util.js";

class Cursor {
  constructor(size) {
    this.x = Math.ceil(size / 2);
    this.y = Math.ceil(size / 2);
    this.size = size;
    // this.ctx = ctx
  }

  move(direction) {
    console.log("MOVE", direction);
    switch (direction) {
      case "u":
        this.y -= 1;
        break;
      case "d":
        this.y += 1;
        break;
      case "l":
        this.x -= 1;
        break;
      case "r":
        this.x += 1;
        break;
    }
    this.x = clamp(0, this.x, this.size - 1);
    this.y = clamp(0, this.y, this.size - 1);
  }

  push(direction) {
    console.log("cursor push", this.x, this.y, direction);
    const c = gc.board.getCard(this.x, this.y);
    if (c) gc.push(this.x, this.y, direction);
  }

  update(ctx) {
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.rect(
      xToCoord(this.x) + ctx.lineWidth / 2,
      yToCoord(this.y) + ctx.lineWidth / 2,
      cardWidth - ctx.lineWidth,
      cardWidth - ctx.lineWidth
    );
    ctx.stroke();
  }
}

export { Cursor };
