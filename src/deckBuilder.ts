"use strict";

import * as R from "ramda";
import { Board } from "./board";
import { Card, CardStat } from "./card";
import { cardList } from "./cardList";
import { EScreenType, IController } from "./controller";
import { Cursor } from "./cursor";
import { Deck } from "./deck";
import { Updater } from "./updater";

function deckBuildCard(c: Card): DeckBuildCard {
  return new DeckBuildCard(c.color, c.name, c.stats);
}

class DeckBuildCard extends Card {
  selected = false;

  constructor(color: string, name: string, stats: CardStat) {
    super(color, name, stats);
  }

  update(x: number, y: number) {
    const clr = this.color;
    if (this.selected) {
      this.color = "purple";
    }
    super.update(x, y);
    this.color = clr;
  }
}

class DeckBuilderController implements IController {
  board: Board;
  cursor: Cursor;

  constructor() {
    this.board = new Board(Math.ceil(Math.sqrt(cardList.length)), false);
    this.cursor = new Cursor(this.board.size);
    // TODO: mark selected cards as selected
    const store = window.localStorage;
    const d = store.getItem("deck");
    const selectedStatSet = new Set();
    if (d) {
      R.map(
        R.compose(str => selectedStatSet.add(str), JSON.stringify, ({ stats }) => stats),
        Deck.deserialize(d).cs
      );
      // Deck.deserialize(d).cs.map(({ stats }) =>
      //   selectedStatSet.add(JSON.stringify(stats))
      // );
    }
    for (let i = 0; i < cardList.length; i++) {
      if (!cardList[i]) {
        console.error("card empty, possibly error related to cards.csv");
        continue;
      }
      const c = deckBuildCard(cardList[i]);
      const x = i % this.board.size;
      const y = Math.floor(i / this.board.size);
      if ((x + y) % 2) {
        c.swapColor();
      }
      const statString = JSON.stringify(c.stats);
      if (selectedStatSet.has(statString)) {
        c.selected = true;
        selectedStatSet.delete(statString);
      }
      this.board.setCard_(x, y, c);
    }
  }

  update() {
    Updater.Instance.updateBoardSize(this.board.size);
    this.board.update();
    this.cursor.update();
  }

  markedCards() {
    return this.board.cardMap.flat().filter(({ selected }) => selected);
  }

  handleEvent(e: KeyboardEvent) {
    switch (e.key) {
    case "q":
      return EScreenType.MainMenu;
      break;
    case " ":
      this.board.getCard(this.cursor.x, this.cursor.y).selected ^= true;
      break;
    case "s":
      {
        const deck = new Deck(this.markedCards(), "blue").serialize();
        window.localStorage.setItem("deck_" + (prompt("deck name") || "TEMP"), deck);
      }
      break;
    default:
      this.cursor.handleEvent(e);
    }
  }
}

export { DeckBuilderController };
