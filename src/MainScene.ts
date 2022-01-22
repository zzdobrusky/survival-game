import Player from './Player';
import Resource from './Resource';

export default class MainScene extends Phaser.Scene {
  private player: Player;
  private map: Phaser.Tilemaps.Tilemap;
  private resources: Resource[];
  private collidingResource: Resource;
  private colliding: boolean;

  constructor() {
    super('MainScene');
    this.collidingResource = null;
    this.colliding = false;
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

  public update(): void {
    this.player.update();

    // collisions with resources
    this.collidingResource = this.resources.find((resource) =>
      Phaser.Geom.Intersects.CircleToCircle(
        new Phaser.Geom.Circle(this.player.x, this.player.y, 12),
        new Phaser.Geom.Circle(resource.x, resource.y, 12),
      ),
    );

    if (this.collidingResource && !this.colliding) {
      console.log('started collision with: ', this.collidingResource.type);
      this.colliding = true;
      this.player.setCollidingResource(this.collidingResource);
    }

    if (!this.collidingResource && this.colliding) {
      console.log('ended collision');
      this.colliding = false;
      this.player.setCollidingResource(this.collidingResource);
    }
  }

  public removeResource(resource: Resource): void {
    if (resource) {
      // first remove from the array if exists
      const index = this.resources.indexOf(resource);
      if (index !== -1) {
        this.resources.splice(index, 1);
        // then destroy
        resource.destroy();
      }
    }
  }
}
