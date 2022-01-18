import { Point } from './models';
import { World } from './world';

export abstract class Entity {
  get position() {
    return new Point(this._position.x, this._position.y);
  }

  protected _position: Point;
  protected direction: number = 0;
  constructor(protected readonly world: World, point: Point) {
    this._position = point;
  }

  abstract tick(): void;

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

export class LangtonAnt extends Entity {
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

export class OtherAnt extends Entity {
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
