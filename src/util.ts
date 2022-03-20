"use strict";

import { Card } from "./card";

const getDirname = () => {
  let dirname = window.location.pathname;
  if (!dirname.endsWith("/")) {
    const dn = dirname.split("/");
    dn.splice(-1);
    dirname = dn.join("/");
    if (!dirname.endsWith("/")) {
      dirname += "/";
    }
  } return dirname;
};

export { getDirname };

export function clamp(l: number, n: number, u: number) {
  if (n < l) {
    return l;
  } else if (n > u) {
    return u;
  } else {
    return n;
  }
}

class FString extends String {
  constructor(...args: any) {
    super(...args);
  }
  format(...args: any[]) {
    let a = this.replace("", "");
    for (const k in args) {
      a = a.replace("{" + k + "}", args[k]);
    }
    return a;
  }
}

export { FString };

/* eslint-disable @typescript-eslint/no-unused-vars */
const trouppleAcolyte = (color: string) =>
  new Card(color, "Troupple Acolyte", {
    dirs: {
      l: { v: 1 },
      r: { v: 2 },
      d: { v: 1 },
    },
  });

const shieldKnight = (color: string) =>
  new Card(color, "Shield Knight", {
    dirs: {
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
    },
  });

const propellerRat = (color: string, p: number) =>
  new Card(color, "Propeller Rat", {
    dirs: {
      u: { v: p ? p : 1 },
    },
  });

const blitzsteed = (color: string, p: number) =>
  new Card(color, "blitzsteed", {
    dirs: {
      l: { v: p ? p : 1 },
    },
  });

const blorb = (color: string, p: number) =>
  new Card(color, "blorb", {
    dirs: {
      d: { v: p ? p : 1 },
    },
  });

const beeto = (color: string, p: number) =>
  new Card(color, "beeto", {
    dirs: {
      r: { v: p ? p : 1 },
    },
  });

const kingPridemoor = (color: string) =>
  new Card(color, "King Pridemoor", {
    dirs: {
      u: {
        v: 2,
        slam: true,
      },
      l: {
        v: 2,
        slam: true,
      },
    },
  });

function cardtob(v: any) {
  return btoa(JSON.stringify(v));
}

function btocard(v: string) {
  return JSON.parse(atob(v));
}
/* eslint-enable @typescript-eslint/no-unused-vars */
