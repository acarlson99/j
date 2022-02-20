import { Updater } from "./updater";

enum EObstacleName {
  gem = "gem",
  illegal = "illegal",
  graveyard = "graveyard", // cannot place, must push here
  pitfall = "pitfall",
}

const obstacleList = [
  EObstacleName.gem,
  EObstacleName.illegal,
  EObstacleName.graveyard,
  EObstacleName.pitfall,
];

export { EObstacleName };

class Obstacle {
  name: EObstacleName;
  x: number;
  y: number;

  constructor(name: EObstacleName) {
    this.name = name;
    this.x = -1;
    this.y = -1;
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  update() {
    Updater.Instance.updateObstacle(this.name, this.x, this.y);
    // console.warn("naughty update");
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
  copy() {
    const o = new Obstacle(this.name);
    o.x = this.x;
    o.y = this.y;
  }
}

function makeObstacle(name: EObstacleName) {
  return new Obstacle(name);
}

class Obstacles {
  size: number;
  m: Obstacle[][];

  constructor(size: number, numGems: number) {
    this.size = size;
    if (numGems === undefined || numGems < 0) {
      numGems = Math.floor(size / 4) * 2 + 1;
      // console.log(numGems);
    }
    this.m = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.m[i] = new Array(this.size);
    }
    for (let i = 0; i < size; i++) {
      this.setM_(0, i, makeObstacle(EObstacleName.illegal));
      this.setM_(i, 0, makeObstacle(EObstacleName.illegal));
      this.setM_(i, size - 1, makeObstacle(EObstacleName.illegal));
      this.setM_(size - 1, i, makeObstacle(EObstacleName.illegal));
    }
    for (let i = 1; i < size - 1; i++) {
      this.setM_(1, i, makeObstacle(EObstacleName.graveyard));
      this.setM_(i, 1, makeObstacle(EObstacleName.graveyard));
      this.setM_(i, size - 2, makeObstacle(EObstacleName.graveyard));
      this.setM_(size - 2, i, makeObstacle(EObstacleName.graveyard));
    }
    this.setM_(1, 1, makeObstacle(EObstacleName.illegal));
    this.setM_(1, size - 2, makeObstacle(EObstacleName.illegal));
    this.setM_(size - 2, 1, makeObstacle(EObstacleName.illegal));
    this.setM_(size - 2, size - 2, makeObstacle(EObstacleName.illegal));
    for (let i = 0; i < numGems; i++) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);
      if (this.m[y][x]) {
        i--;
        continue;
      }

      this.setM_(x, y, makeObstacle(EObstacleName.gem));
    }
  }

  deserialize(input: string) {
    const obj = JSON.parse(input);
    this.size = obj.size;
    this.m = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.m[i] = new Array(this.size);
      for (let j = 0; j < this.size; j++) {
        console.log("CUM");
        const obcp = obj.m[i][j];
        if (obcp) {
          this.setM_(j, i, new Obstacle(obcp.name));
        } else {
          this.unsetM_(j, i);
        }
      }
    }

    return this;
  }

  setM_(x: number, y: number, o: Obstacle) {
    if (!o) {
      delete this.m[y][x];
    } else {
      o.x = x;
      o.y = y;
      this.m[y][x] = o;
    }
  }

  unsetM_(x: number, y: number) {
    delete this.m[y][x];
  }

  incrementObstacleAt(x: number, y: number) {
    console.log("incrementing obstacle");
    const name = this.m[y][x]?.name;
    if (!name) {
      this.setM_(x, y, makeObstacle(obstacleList[0]));
    }
    let i = obstacleList.indexOf(name);
    i++;
    // this.setM_(x, y, undefined);
    this.unsetM_(x, y);
    if (i === obstacleList.length) {
      return;
    }
    this.setM_(x, y, makeObstacle(obstacleList[i]));
  }

  // card can be played on space (by place or played with push)
  isSettable(x: number, y: number, withPush: boolean, graveyard: boolean) {
    withPush = !!withPush;
    const ob = this.m[y][x];
    switch (ob?.name) {
    case undefined:
      return true;
    case EObstacleName.gem:
      return withPush;
    case EObstacleName.illegal:
      return false;
      break;
    case EObstacleName.graveyard:
      return graveyard;
      break;
    case EObstacleName.pitfall:
      return true;
      break;
    }
    console.error("fallthrough case");
    return false;
  }

  // check if card can be pushed onto space
  isPushable(x: number, y: number) {
    switch (this.m[y][x]?.name) {
    case undefined:
      return true;
    case EObstacleName.gem:
      return true;
    case EObstacleName.illegal:
      return false;
      break;
    case EObstacleName.graveyard:
      return true;
      break;
    case EObstacleName.pitfall:
      return true;
      break;
    }
    console.error("fallthrough case");
    return false;
  }

  getGemsPos() {
    // this.m.flatMap((a) => console.log(a));
    return this.m
      .flat()
      .filter((o: Obstacle) => o?.name == EObstacleName.gem)
      .map((v: Obstacle) => [v.x, v.y]);
  }

  numGems() {
    return this.getGemsPos().length;
  }

  gemAt(x: number, y: number) {
    const g = this.m[y][x];
    return g && g.name == EObstacleName.gem;
  }

  update() {
    this.m.forEach((a) => a.forEach((o) => (o ? o.update() : o)));
  }
}

export { Obstacles, Obstacle };
