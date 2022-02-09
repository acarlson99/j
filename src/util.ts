"use strict";

import { Card } from "./card";

export function clamp(l, n, u) {
  if (n < l) {
    return l;
  } else if (n > u) {
    return u;
  } else {
    return n;
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const trouppleAcolyte = (color) =>
  new Card(color, "Troupple Acolyte", {
    l: { v: 1 },
    r: { v: 2 },
    d: { v: 1 },
  });

const shieldKnight = (color) =>
  new Card(color, "Shield Knight", {
    l: {
      v: 2,
      wind: true,
    },
    r: {
      v: 2,
      wind: true,
    },
    u: {
      v: 3,
      wind: true,
    },
  });

const propellerRat = (color, p) =>
  new Card(color, "Propeller Rat", {
    u: { v: p ? p : 1 },
  });

const blitzsteed = (color, p) =>
  new Card(color, "blitzsteed", {
    l: { v: p ? p : 1 },
  });

const blorb = (color, p) =>
  new Card(color, "blorb", {
    d: { v: p ? p : 1 },
  });

const beeto = (color, p) =>
  new Card(color, "beeto", {
    r: { v: p ? p : 1 },
  });

function cardtob(v) {
  return btoa(JSON.stringify(v));
}

function btocard(v) {
  return JSON.parse(atob(v));
}
/* eslint-enable @typescript-eslint/no-unused-vars */
