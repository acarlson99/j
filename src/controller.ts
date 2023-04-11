"use strict";

import { DeckBuilderController } from "./deckBuilder";
import { GameController } from "./gameController";
import { IUpdater } from "./IUpdater";
import { Updater } from "./updater";
import { AMenu } from "./AMenu";
import { Board } from "./board";
import { Cursor } from "./cursor";
import { getDirname } from "./util";

enum EScreenType {
  Game = 0,
  Map,
  MainMenu,
  DeckBuilder,
  BoardEdit,
  __LENGTH,
}

export { EScreenType };

interface IController extends IUpdater {
  handleEvent(e: KeyboardEvent): IController | EScreenType | undefined;
}

export { IController };

class Menu extends AMenu implements IController {
  menuItems = ["play", "deck builder", "board editor", "who?", "doc"];

  selectCurrentMenuItem(): EScreenType | IController | undefined {
    switch (this.menuItems[this.arrowPos]) {
    case "play":
      return EScreenType.Game;
    case "who?":
      window.location.href = "/";
      break;
    case "deck builder":
      return EScreenType.DeckBuilder;
    case "board editor":
      const size = Number(prompt("size (min 6)"));
      return new BoardEditor(Math.max(6, size));
    case "doc":
      window.location.href = getDirname() + "doc/";
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

class BoardEditor implements IController {
  board: Board;
  cursor: Cursor;

  constructor(size: number) {
    this.board = new Board(size, true);
    this.cursor = new Cursor(size);
  }

  handleEvent(e: KeyboardEvent): EScreenType | IController | undefined {
    switch (e.key) {
    case " ":
      this.board.changeObstacleAt(this.cursor.x, this.cursor.y);
      break;
    case "s": {
      const store = window.localStorage;
      alert("saved");
      store.setItem("board", this.board.serialize());
      break;
    }
    case "q":
    case "Esc":
    case "Escape":
      return EScreenType.MainMenu;
    default:
      this.cursor.handleEvent(e);
      break;
    }
    return;
  }

  update() {
    Updater.Instance.updateBoardSize(this.board.size);
    this.board.update();
    this.cursor.update();
  }
}

class Controller {
  interval: any;
  frameNo: number;
  handleEvent: (e: KeyboardEvent) => void;
  gameScreenType: EScreenType = EScreenType.MainMenu;
  screen?: IController;
  defaultSize = 8;

  constructor() {
    this.interval = undefined;
    this.frameNo = 0;
    this.setScreen(EScreenType.MainMenu);
    this.handleEvent = (() => {
      return (e: KeyboardEvent) => {
        if (e.key === "p") {
          if (!(this.screen instanceof PauseMenu) && this.screen) {
            this.screen = new PauseMenu(this.screen);
          } else if (this.screen instanceof PauseMenu) {
            this.screen = this.screen.bkg;
          }
        } else {
          const newScreen = this.screen?.handleEvent(e);
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
    case EScreenType.BoardEdit:
      this.screen = new BoardEditor(this.defaultSize);
      break;
    case EScreenType.Game:
      const s = prompt("load saved board?");
      if (!s || s[0] == "n") {
        this.screen = new GameController(this.defaultSize);
      } else {
        const board = Board.fromStore("board");
        if (!board) {
          console.warn("error loading board");
        } else if (board) {
          this.screen = new GameController(board);
        }
      }
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
    Updater.Instance.updateController(this);
    this.screen?.update();
  }
}

export { Controller };

let controller: Controller;
try {
  console.log("CREATE GLOBAL GAME CONTROLLER");
  controller = new Controller();
} catch (e) {
  console.error("UNABLE TO CREATE CONTROLLER:", e);
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
