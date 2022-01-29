import { extractPropertyFromTile } from '../Tools/helpers';
import MatterEntity from '../Types/MatterEntity';
import MainScene from '../Scenes/MainScene';
import { TiledResource } from '../Types/TiledResource';

const CIRCLE_RADIUS = 18;

export default class Enemy extends MatterEntity {
  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('enemies', 'assets/animations/enemies.png', 'assets/animations/enemies_atlas.json');
    scene.load.animation('enemies_anim', 'assets/animations/enemies_anim.json');
  }

  constructor(scene: MainScene, resource: TiledResource) {
    const drops = extractPropertyFromTile<[]>(resource, 'drops', 'string', []);
    const health = extractPropertyFromTile<number>(resource, 'health', 'number', 0);
    super(
      scene,
      resource.x,
      resource.y,
      'enemies',
      'bear_idle_1',
      resource.type,
      health,
      0,
      drops,
      0.36,
      CIRCLE_RADIUS,
      0,
    );
  }
}
