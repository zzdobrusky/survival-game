import MainScene from './MainScene';
import MatterEntity from './MatterEntity';

type TiledResource = {
  x?: number;
  y?: number;
  type: string;
  properties?: { name: string; value: number | string }[];
};

const CIRCLE_RADIUS = 18;

export default class Resource extends MatterEntity {
  constructor(scene: MainScene, resource: TiledResource) {
    const foundDepth = resource.properties.find((p) => p.name === 'depth');
    const depth = foundDepth && typeof foundDepth.value === 'number' ? foundDepth.value : 0;
    const foundDrops = resource.properties.find((p) => p.name === 'drops');
    const drops = foundDrops && typeof foundDrops.value === 'string' ? JSON.parse(foundDrops.value) : [];

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

  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
    scene.load.audio('tree', 'assets/audio/tree.wav');
    scene.load.audio('rock', 'assets/audio/rock.wav');
    scene.load.audio('bush', 'assets/audio/bush.wav');
  }
}
