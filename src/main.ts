"use strict";

window.addEventListener("error", function (event) {
  console.error(event);
});

import { gc } from "./gameController";
import { Updater } from "./updater";

function startGame() {
  gc.interval = setInterval(updateGameArea, 20);
}

function updateGameArea() {
  Updater.Instance.updateBoardSize(gc.boardSize());
  Updater.Instance.updateWH();
  gc.update();
}

startGame();

document.onkeydown = (e) => {
  console.log(e);

  gc.handleEvent(e);
};

import { cardTest } from "./regressionTest";
cardTest();
