import { Point } from './models';
import { World } from './world';

export abstract class Entity {
  get position() {
    return new Point(this._position.x, this._position.y);
  }

  constructor(protected readonly world: World, point: Point) {
    this._position = point;
  }

  protected _position: Point;

  abstract tick(): void;
}

export abstract class WalkableEntity extends Entity {
  protected direction: number = 0;
  constructor(world: World, point: Point) {
    super(world, point);
  }

  protected turnRight() {
    this.direction = (this.direction + 1) % 4;
  }

  protected turnLeft() {
    this.direction = ((this.direction === 0 ? 4 : this.direction) - 1) % 4;
  }

  protected step(steps = 1) {
    switch (this.direction) {
      case 0:
        this._position = new Point(this._position.x, this._position.y - steps);
        break;

      case 1:
        this._position = new Point(this._position.x + steps, this._position.y);
        break;

      case 2:
        this._position = new Point(this._position.x, this._position.y + steps);
        break;

      case 3:
        this._position = new Point(this._position.x - steps, this._position.y);
        break;

      default:
        break;
    }
  }
}

export class LangtonAnt extends WalkableEntity {
  constructor(world: World, point: Point) {
    super(world, point);
  }

  tick() {
    const point = this.position;
    const world = this.world;
    const cell = world.get(point.x, point.y);
    if (cell === undefined) {
      return;
    }

    if (cell === 0) {
      world.set(point.x, point.y, 1);
      this.turnRight();
      this.step();
      return;
    }

    if (cell === 1) {
      world.set(point.x, point.y, 0);
      this.turnLeft();
      this.step();
      return;
    }
  }
}

export class OtherAnt extends WalkableEntity {
  constructor(world: World, point: Point) {
    super(world, point);
  }

  tick() {
    const point = this.position;
    const world = this.world;
    const cell = world.get(point.x, point.y);
    if (cell === undefined) {
      return;
    }

    if (cell === 0) {
      world.set(point.x, point.y, 1);
      this.turnRight();
      this.step();
      return;
    }

    if (cell === 1) {
      world.set(point.x, point.y, 0);
      this.turnLeft();
      this.step();
      return;
    }
  }
}

export class LifeEntity extends Entity {
  private alive = false;

  constructor(world: World, point: Point) {
    super(world, point);
    this.alive = world.get(point.x, point.y) === 1;
  }

  tick() {
    const neighbours = this.getNeighbours();
    const aliveNeighbours = neighbours.filter(x => x === 1);
    const shouldBorn = aliveNeighbours.length === 3;
    if (shouldBorn) {
      return this.world.set(this.position.x, this.position.y, 1);
    }

    const shouldKeepLiving =
      this.alive && (aliveNeighbours.length === 2 || aliveNeighbours.length === 3);
    if (!shouldKeepLiving) {
      this.alive = false;
      return this.world.set(this.position.x, this.position.y, 0);
    }
  }

  private getNeighbours() {
    return [
      this.world.get(this.position.x - 1, this.position.y + 1),
      this.world.get(this.position.x, this.position.y + 1),
      this.world.get(this.position.x + 1, this.position.y + 1),
      this.world.get(this.position.x - 1, this.position.y),
      this.world.get(this.position.x + 1, this.position.y),
      this.world.get(this.position.x - 1, this.position.y - 1),
      this.world.get(this.position.x, this.position.y - 1),
      this.world.get(this.position.x + 1, this.position.y - 1)
    ];
  }
}
