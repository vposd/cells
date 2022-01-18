import { Entity, LangtonAnt } from './entity';
import { Point, Type } from './models';
import { Renderer } from './renderer';

export class World {
  readonly space: number[] = [];
  readonly entities: Entity[] = [];
  readonly renderer: Renderer;

  constructor(readonly width: number, readonly height: number) {
    this.space = this.buildSpace(width, height);
    this.renderer = new Renderer(this);
    this.renderer.start();
  }

  tick() {
    this.entities.forEach(e => e.tick());
  }

  createCell(entityType: Type<Entity>, point: Point) {
    const entity = new entityType(this, point);
    this.createEntity(entity);
  }

  get(x: number, y: number) {
    return this.space[x + y * this.width];
  }

  set(x: number, y: number, value: number) {
    this.space[x + y * this.width] = value;
  }

  destroy() {
    this.renderer.stop();
    this.renderer.remove();
  }

  private createEntity(entity: Entity) {
    this.entities.push(entity);
  }

  private buildSpace(width: number, height: number) {
    return new Array(width * height).fill(0);
  }
}
