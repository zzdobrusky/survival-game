import MainScene from '../Scenes/MainScene';
import MatterEntity from '../Types/MatterEntity';
import { TiledResource } from '../Types/TiledResource';
import { extractPropertyFromTile } from '../Tools/helpers';

const CIRCLE_RADIUS = 18;

export default class Resource extends MatterEntity {
  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
    scene.load.audio('tree', 'assets/audio/tree.wav');
    scene.load.audio('rock', 'assets/audio/rock.wav');
    scene.load.audio('bush', 'assets/audio/bush.wav');
  }

  constructor(scene: MainScene, resource: TiledResource) {
    const depth = extractPropertyFromTile<number>(resource, 'depth', 'number', 0);
    const drops = extractPropertyFromTile<[]>(resource, 'drops', 'string', []);

    super(
      scene,
      resource.x,
      resource.y,
      'resources',
      resource.type,
      resource.type,
      5,
      depth,
      drops,
      1,
      CIRCLE_RADIUS,
      0,
    );

    const yOrigin = resource.properties.find((p) => p.name === 'yOrigin').value;
    if (typeof yOrigin === 'number') {
      this.y += this.height * (yOrigin - 1.5);
      this.setOrigin(0.5, yOrigin);
    }
  }
}
