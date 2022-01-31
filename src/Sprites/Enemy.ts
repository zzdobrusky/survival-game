import { extractPropertyFromTile } from '../Tools/helpers';
import MatterEntity from '../Types/MatterEntity';
import MainScene from '../Scenes/MainScene';
import { TileResource } from '../Types/TileResource';

const CIRCLE_RADIUS = 15;
const SENSING_CIRCLE_RADIUS = 80;

export default class Enemy extends MatterEntity {
  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('enemies', 'assets/animations/enemies.png', 'assets/animations/enemies_atlas.json');
    scene.load.animation('enemies_anim', 'assets/animations/enemies_anim.json');
    scene.load.audio('bear', 'assets/audio/bear.wav');
    scene.load.audio('ent', 'assets/audio/ent.wav');
    scene.load.audio('wolf', 'assets/audio/wolf.wav');
  }

  constructor(scene: MainScene, tileResource: TileResource) {
    const drops = extractPropertyFromTile<[]>(tileResource, 'drops', 'string', []);
    const health = extractPropertyFromTile<number>(tileResource, 'health', 'number', 0);
    super(
      scene,
      tileResource.x,
      tileResource.y,
      'enemies',
      `${tileResource.type}_idle_1`,
      tileResource.type,
      health,
      0,
      drops,
      0.36,
      CIRCLE_RADIUS,
      SENSING_CIRCLE_RADIUS,
    );
  }
}
