import { GameController } from "./gameController";
import { Updater } from "./updater";

class Menu {
  arrowPos = 0;
  menuItems = ["play", "who?", "controls"];

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

  selectCurrentMenuItem() {
    switch (this.menuItems[this.arrowPos]) {
    case "play":
      return EScreenType.Game;
    case "who?":
      window.location.href = "/";
      break;
    }
  }

  update() {
    Updater.Instance.drawMenu(this);
  }

  handleEvent(e: KeyboardEvent) {
    switch (e.key) {
    case "ArrowUp":
      this.arrowUp();
      break;
    case "ArrowDown":
      this.arrowDown();
      break;
    case " ":
    case "Enter":
      return this.selectCurrentMenuItem();
    }
  }
}

export { Menu };

enum EScreenType {
  Game = 0,
  Map,
  MainMenu,
  __LENGTH,
}

export { EScreenType };

class Controller {
  interval: any;
  frameNo: number;
  handleEvent: (e: KeyboardEvent) => void;
  gameScreenType: EScreenType = EScreenType.MainMenu;
  screen?: GameController | Menu;

  constructor() {
    this.interval = undefined;
    this.frameNo = 0;
    this.setScreen(EScreenType.MainMenu);
    this.handleEvent = (() => {
      return (e: KeyboardEvent) => {
        const newScreen = this.screen?.handleEvent(e);
        if (newScreen !== undefined) {
          this.setScreen(newScreen);
        }
      };
    })();
  }

  setScreen(stype: any) {
    switch (stype as EScreenType) {
    case EScreenType.Game:
      this.screen = new GameController(8);
      break;
    case EScreenType.MainMenu:
      this.screen = new Menu();
      break;
    }
  }

  update() {
    this.screen?.update();
  }
}

export { Controller };

let controller: Controller;
try {
  console.log("CREATE GLOBAL GAME CONTROLLER");
  controller = new Controller();
} catch (e) {
  console.warn("UNABLE TO CREATE CONTROLLER:", e);
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function everyinterval(n: number) {
  if ((controller.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export { controller, everyinterval };
