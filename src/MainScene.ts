import Player from './Player';
import Resource from './Resource';

export default class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Sprite;
  private map: Phaser.Tilemaps.Tilemap;
  private resources: Resource[];

  constructor() {
    super('MainScene');
  }

  public preload(): void {
    Player.preload(this);
    Resource.preload(this);
    this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/images/map.json');
  }

  public create(): void {
    this.map = this.make.tilemap({ key: 'map' });
    const tileset = this.map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0);
    const layer1 = this.map.createLayer('Tile Layer 1', tileset, 0, 0);
    const layer2 = this.map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);

    // add resources
    this.resources = this.map
      .getObjectLayer('Resources')
      .objects.map((resource) => new Resource({ scene: this, resource }));

    this.player = new Player({
      scene: this,
      x: 450,
      y: 300,
      texture: 'female',
      frame: 'townsfolk_f_idle_1',
    });
  }

  update(): void {
    this.player.update();

    // collisions with resources
    this.resources.forEach((resource) => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), resource.getBounds())) {
        console.log('collision started');
      } else {
        // console.log('collision ended');
      }
    });
  }
}
