import { Entity, LangtonAnt } from './entity';
import { Point, Type } from './models';
import { Renderer } from './renderer';

export class World {
  readonly space: number[] = [];
  readonly entities: Entity[] = [];
  private readonly changedCells = new Set<number>();

  constructor(readonly width: number, readonly height: number, readonly renderer: Renderer) {
    this.space = this.buildSpace(width, height);
    this.renderer.init(this);
    this.renderer.start();
  }

  tick() {
    this.entities.forEach(e => e.tick());
  }

  createEntity(entityType: Type<Entity>, point: Point) {
    const entity = new entityType(this, point);
    this.add(entity);
  }

  get(x: number, y: number) {
    return this.space[this.getIndex(x, y)];
  }

  set(x: number, y: number, value: number) {
    const index = this.getIndex(x, y);
    this.space[index] = value;
    this.changedCells.add(index);
  }

  changed(x: number, y: number) {
    return this.changedCells.has(this.getIndex(x, y));
  }

  destroy() {
    this.renderer.stop();
    this.renderer.remove();
  }

  private getIndex(x: number, y: number) {
    return x + y * this.width;
  }

  private add(entity: Entity) {
    this.entities.push(entity);
  }

  private buildSpace(width: number, height: number) {
    return new Array(width * height).fill(0);
  }
}
