"use strict";

import { DeckBuilderController } from "./deckBuilder";
import { GameController } from "./gameController";
import { IUpdater } from "./IUpdater";
import { Updater } from "./updater";
import { AMenu } from "./AMenu";

enum EScreenType {
  Game = 0,
  Map,
  MainMenu,
  DeckBuilder,
  __LENGTH,
}

export { EScreenType };

interface IController extends IUpdater {
  handleEvent(e: KeyboardEvent): IController | EScreenType | undefined;
}

export { IController };

class Menu extends AMenu implements IController {
  menuItems = ["play", "who?", "deck", "controls"];

  selectCurrentMenuItem(): EScreenType | undefined {
    switch (this.menuItems[this.arrowPos]) {
    case "play":
      return EScreenType.Game;
    case "who?":
      window.location.href = "/";
      break;
    case "deck":
      return EScreenType.DeckBuilder;
    }
  }

  update() {
    Updater.Instance.drawAMenu(this);
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

export class PauseMenu extends AMenu implements IController {
  bkg: IController;
  menuItems = ["continue", "main menu"];

  constructor(bkg: IController) {
    super();
    this.bkg = bkg;
  }

  selectCurrentMenuItem(): IController | EScreenType | undefined {
    switch (this.menuItems[this.arrowPos]) {
    case "continue":
      return this.bkg;
      break;
    case "main menu":
      return EScreenType.MainMenu;
      break;
    }
  }

  handleEvent(e: KeyboardEvent): IController | EScreenType | undefined {
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

  update() {
    this.bkg.update();
    Updater.Instance.drawAMenu(this);
  }
}

class Controller {
  interval: any;
  frameNo: number;
  handleEvent: (e: KeyboardEvent) => void;
  gameScreenType: EScreenType = EScreenType.MainMenu;
  screen?: IController;

  constructor() {
    this.interval = undefined;
    this.frameNo = 0;
    this.setScreen(EScreenType.MainMenu);
    this.handleEvent = (() => {
      return (e: KeyboardEvent) => {
        if (e.key === "p") {
          if (!(this.screen instanceof PauseMenu) && this.screen) {
            this.screen = new PauseMenu(this.screen);
          }
        } else {
          console.log("Handle event", e);
          const newScreen = this.screen?.handleEvent(e);
          console.log(newScreen);
          if (newScreen?.handleEvent) {
            // IController instance
            this.screen = newScreen as IController;
          } else if (newScreen !== undefined) {
            // EScreenType
            this.setScreen(newScreen as EScreenType);
          }
        }
      };
    })();
  }

  setScreen(stype: EScreenType) {
    switch (stype as EScreenType) {
    case EScreenType.Game:
      this.screen = new GameController(8);
      break;
    case EScreenType.MainMenu:
      this.screen = new Menu();
      break;
    case EScreenType.DeckBuilder:
      this.screen = new DeckBuilderController();
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
