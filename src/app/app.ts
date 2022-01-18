import { LangtonAnt } from './entity';
import { Renderer } from './renderer';
import { World } from './world';
import '../style.css';

class View {
  static interval = 0;
  static world: World;
  static renderer: Renderer;

  static init() {
    View.renderer = new Renderer({ cellSize: 5 });
    View.world = new World(300, 150, View.renderer);
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
View.renderer.onClick(cell => {
  View.world.createEntity(LangtonAnt, cell);
});

document.querySelectorAll('button').forEach(button => {
  const action = button.getAttribute('action');
  if (action) {
    button.addEventListener('click', View[action as 'start' | 'stop'] as unknown as () => void);
  }
});
