import { Entity } from "./entity";
import { Point, Type } from "./models";
import { Renderer } from "./renderer";

class Space {
  private readonly changedCells = new Set<number>();
  private readonly space: number[] = [];
  private changes: number[] = [];

  constructor(readonly width: number, readonly height: number) {
    this.space = this.buildSpace(width, height);
  }

  applyChanges() {
    this.changes.forEach((x, i) => (this.space[i] = x));
    this.changes = [];
  }

  change(x: number, y: number, value: number) {
    this.changes[this.getIndex(x, y)] = value;
  }

  changed(x: number, y: number) {
    return this.changedCells.has(this.getIndex(x, y));
  }

  getValue(x: number, y: number) {
    return this.get(x, y) || this.changes[this.getIndex(x, y)];
  }

  get(x: number, y: number) {
    return this.space[this.getIndex(x, y)];
  }

  set(x: number, y: number, value: number) {
    const index = this.getIndex(x, y);
    this.changes[index] = value;
    this.changedCells.add(index);
    return index;
  }

  private getIndex(x: number, y: number) {
    return x + y * this.width;
  }

  private buildSpace(width: number, height: number) {
    return new Array(width * height).fill(0);
  }
}

export class World {
  readonly space: Space;
  readonly entities: Entity[] = [];

  constructor(
    readonly width: number,
    readonly height: number,
    readonly renderer: Renderer
  ) {
    this.space = new Space(width, height);
    this.renderer.init(this);
    this.renderer.start();
  }

  tick() {
    this.space.applyChanges();
    this.entities.forEach((x) => x.tick());
    this.space.applyChanges();
    this.renderer.renderFrame();
  }

  createEntity(entityType: Type<Entity>, point: Point) {
    const entity = new entityType(this, point);
    this.add(entity);
  }

  get(x: number, y: number) {
    return this.space.get(x, y);
  }

  set(x: number, y: number, value: number) {
    this.space.set(x, y, value);
  }

  destroy() {
    this.renderer.stop();
    this.renderer.remove();
  }

  private add(entity: Entity) {
    this.entities.push(entity);
  }
}
