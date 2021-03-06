import { LangtonAnt, LifeEntity } from "./entity";
import { Renderer } from "./renderer";
import { World } from "./world";
import "../style.css";
import { Point } from "./models";

class View {
  static interval = 0;
  static world: World;
  static renderer: Renderer;

  static init() {
    View.renderer = new Renderer({ cellSize: 15 });
    View.world = new World(50, 50, View.renderer);

    for (let i = 0; i < View.world.width; i++) {
      for (let j = 0; j < View.world.width; j++) {
        View.world.createEntity(LifeEntity, new Point(i, j));
      }
    }
  }

  static start() {
    View.stop();
    View.interval = setInterval(() => View.world.tick()) as unknown as number;
  }

  static stop() {
    clearInterval(View.interval);
  }

  static tick() {
    View.world.tick();
  }

  static tick1000() {
    for (let i = 0; i < 1000; i++) {
      View.world.tick();
    }
  }

  static clear() {
    View.world?.destroy();
    View.init();
  }
}

View.init();
View.renderer.onClick((cell) => {
  const value = View.world.space.getValue(cell.x, cell.y);
  View.world.set(cell.x, cell.y, value ? 0 : 1);
  // View.world.createEntity(LangtonAnt, cell);
  View.renderer.renderFrame();
});

document.querySelectorAll("button").forEach((button) => {
  const action = button.getAttribute("action");
  if (action) {
    button.addEventListener(
      "click",
      View[action as "start" | "stop"] as unknown as () => void
    );
  }
});
