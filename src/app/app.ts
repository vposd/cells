import { LangtonAnt } from './entity';
import { World } from './world';

class View {
  static interval = 0;
  static world: World;

  static init() {
    View.world = new World(250, 180);
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
View.world.renderer.onClick(cell => {
  View.world.createCell(LangtonAnt, cell);
});

document.querySelectorAll('button').forEach(button => {
  const action = button.getAttribute('action');
  if (action) {
    button.addEventListener('click', View[action as 'start' | 'stop'] as unknown as () => void);
  }
});
