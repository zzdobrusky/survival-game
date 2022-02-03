import MainScene from '../Scenes/MainScene';
import MatterEntity from '../Types/MatterEntity';
import { TileResource } from '../Types/TileResource';
import { extractPropertyFromTile } from '../Tools/helpers';

const CIRCLE_RADIUS = 15;
const SENSING_CIRCLE_RADIUS = 19;

export default class Resource extends MatterEntity {
  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
    scene.load.audio('tree', 'assets/audio/tree.wav');
    scene.load.audio('rock', 'assets/audio/rock.wav');
    scene.load.audio('bush', 'assets/audio/bush.wav');
  }

  constructor(scene: MainScene, tileResource: TileResource) {
    const depth = extractPropertyFromTile<number>(tileResource, 'depth', 'number', 0);
    const drops = extractPropertyFromTile<[]>(tileResource, 'drops', 'string', []);

    super(
      scene,
      tileResource.x,
      tileResource.y,
      'resources',
      tileResource.type,
      tileResource.type,
      5,
      depth,
      drops,
      1,
      CIRCLE_RADIUS,
      SENSING_CIRCLE_RADIUS,
    );

    const yOrigin = tileResource.properties.find((p) => p.name === 'yOrigin').value;
    if (typeof yOrigin === 'number') {
      this.y += this.height * (yOrigin - 1.5);
      this.setOrigin(0.5, yOrigin);
    }
  }
}
