import { Point } from './models';
import { World } from './world';

interface RenderConfig {
  cellSize?: number;
}

export class Renderer {
  private context: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private cell = {
    width: 5,
    height: 5
  };
  private world!: World;
  private readonly clickHandlers: ((position: Point) => void)[] = [];
  private started = true;

  constructor(config: RenderConfig) {
    this.cell.width = this.cell.height = config.cellSize || 5;
  }

  start() {
    this.started = true;
  }

  stop() {
    this.started = false;
  }

  renderFrame() {
    requestAnimationFrame(() => {
      if (!this.context) {
        return;
      }

      const world = this.world;

      for (let x = 0; x < world.width; x++) {
        for (let y = 0; y < world.width; y++) {
          if (!this.world.changed(x, y)) {
            continue;
          }
          this.context.fillStyle = '#fff';
          this.context.strokeStyle = '#999';
          this.context.fillRect(
            this.cell.width * x,
            this.cell.height * y,
            this.cell.width,
            this.cell.height
          );
          this.context.strokeRect(
            this.cell.width * x,
            this.cell.height * y,
            this.cell.width,
            this.cell.height
          );
          if (this.get(x, y) !== 0) {
            this.context.fillStyle = '#1976D2';
            this.context.fillRect(
              1 + this.cell.width * x,
              1 + this.cell.height * y,
              this.cell.width - 1,
              this.cell.height - 1
            );
          }
        }
      }

      world.entities.forEach(e => {
        if (!this.context) {
          return;
        }
        this.context.fillStyle = '#212121';
        this.context.fillRect(
          1 + this.cell.width * e.position.x,
          1 + this.cell.height * e.position.y,
          this.cell.width - 1,
          this.cell.height - 1
        );
      });

      if (this.started) {
        this.renderFrame();
      }
    });
  }

  onClick(func: (position: Point) => void) {
    this.clickHandlers.push(func);
  }

  remove() {
    this.canvas?.remove();
  }

  init(world: World) {
    this.world = world;
    this.canvas = document.createElement('canvas');
    this.canvas.width = world.width * this.cell.width;
    this.canvas.height = world.height * this.cell.height;
    document.body.append(this.canvas);
    this.context = this.canvas.getContext('2d');

    this.canvas.addEventListener('click', (e: any) => {
      const x = e.layerX;
      const y = e.layerY;
      this.clickHandlers.forEach(func =>
        func(new Point(Math.floor(x / this.cell.width), Math.floor(y / this.cell.height)))
      );
    });

    if (!this.context) {
      return;
    }

    this.context.lineWidth = 1;
    this.context.strokeStyle = '#999';
    this.context.translate(0.5, 0.5);

    for (let x = 0; x < world.width; x++) {
      for (let y = 0; y < world.width; y++) {
        this.context.strokeRect(
          this.cell.width * x,
          this.cell.height * y,
          this.cell.width,
          this.cell.height
        );
      }
    }

    this.renderFrame();
  }

  private get(x: number, y: number) {
    return this.world.space[x + y * this.world.width];
  }
}
