"use strict";

export abstract class AMenu {
  arrowPos = 0;
  menuItems: any[] = [];

  // constructor() {}

  clampPos() {
    this.arrowPos =
      (this.arrowPos + this.menuItems.length) % this.menuItems.length;
  }

  arrowUp() {
    this.arrowPos -= 1;
    this.clampPos();
  }

  arrowDown() {
    this.arrowPos += 1;
    this.clampPos();
  }

  abstract selectCurrentMenuItem();
}
