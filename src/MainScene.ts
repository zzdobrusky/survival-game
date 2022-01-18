import Player from './Player';
import Resource from './Resource';

export default class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Sprite;
  private map: Phaser.Tilemaps.Tilemap;
  private resources: Resource[];
  private isColliding: boolean;

  constructor() {
    super('MainScene');
    this.isColliding = true;
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
      x: 430,
      y: 330,
      texture: 'female',
      frame: 'townsfolk_f_idle_1',
    });
  }

  update(): void {
    this.player.update();

    // collisions with resources
    this.resources.every((resource) => {
      if (
        Phaser.Geom.Intersects.CircleToCircle(
          new Phaser.Geom.Circle(this.player.x, this.player.y, 12),
          new Phaser.Geom.Circle(resource.x, resource.y, 12),
        )
      ) {
        console.log('collision obj: ', resource.type);
        this.isColliding = true;
        return false;
      }
      this.isColliding = false;
      return true;
    });
  }
}
