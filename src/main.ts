"use strict";

window.addEventListener("error", function (event) {
  console.error(event);
});

import { controller } from "./controller";
// import { cardTest } from "./regressionTest";
import { Updater } from "./updater";

function startGame() {
  controller.interval = setInterval(updateGameArea, 20);
}

function updateGameArea() {
  Updater.Instance.updateWH();
  controller.update();
}

startGame();

document.onkeydown = (e) => {
  controller.handleEvent(e);
};

// cardTest();
