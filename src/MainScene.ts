import DropItem from './DropItem';
import Player from './Player';
import Resource from './Resource';

export default class MainScene extends Phaser.Scene {
  private _player: Player;
  private _map: Phaser.Tilemaps.Tilemap;
  private _resources: Resource[];
  private _collidingResource: Resource;
  private _colliding: boolean;

  constructor() {
    super('MainScene');
    this._collidingResource = null;
    this._colliding = false;
  }

  public preload(): void {
    Player.preload(this);
    Resource.preload(this);
    DropItem.preload(this);
    this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/images/map.json');
  }

  public create(): void {
    this._map = this.make.tilemap({ key: 'map' });
    const tileset = this._map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0);
    const layer1 = this._map.createLayer('Tile Layer 1', tileset, 0, 0);
    this._map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);

    // add resources
    this._resources = this._map
      .getObjectLayer('Resources')
      .objects.map((resource) => new Resource({ scene: this, resource }));

    this._player = new Player({
      scene: this,
      x: 430,
      y: 330,
      texture: 'female',
      frame: 'townsfolk_f_idle_1',
    });
  }

  public update(): void {
    this._player.update();

    // collisions with resources
    this._collidingResource = this._resources.find((resource) =>
      Phaser.Geom.Intersects.CircleToCircle(this._player.circle, resource.circle),
    );

    if (this._collidingResource && !this._colliding) {
      this._colliding = true;
      this._player.setCollidingResource(this._collidingResource);
    }

    if (!this._collidingResource && this._colliding) {
      this._colliding = false;
      this._player.setCollidingResource(null);
    }
  }

  public removeResource(resource: Resource): void {
    if (resource) {
      // first remove from the array if exists
      const index = this._resources.indexOf(resource);
      if (index !== -1) {
        this._resources.splice(index, 1);
        // then destroy
        resource.destroy();
        // and reset collisions
        this._colliding = false;
        this._player.setCollidingResource(null);
      }
    }
  }
}
