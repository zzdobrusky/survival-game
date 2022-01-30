import DropItem from '../Sprites/DropItem';
import Enemy from '../Sprites/Enemy';
import Player from '../Sprites/Player';
import Resource from '../Sprites/Resource';

export default class MainScene extends Phaser.Scene {
  private _player: Player;
  private _map: Phaser.Tilemaps.Tilemap;
  private _resources: Resource[];
  private _enemies: Enemy[];
  private _collidingResource: Resource;
  private _collidingWithResource: boolean;
  private _droppedItems: DropItem[];
  private _collidingDroppedItem: DropItem;
  private _collidingWithDroppedItem: boolean;
  private _collidingEnemy: Enemy;
  private _collidingWithEnemy: boolean;

  constructor() {
    super('MainScene');
    this._collidingResource = null;
    this._collidingWithResource = false;
    this._droppedItems = [];
    this._collidingDroppedItem = null;
    this._collidingWithDroppedItem = false;
    this._collidingEnemy = null;
    this._collidingWithEnemy = false;
  }

  public preload(): void {
    // load sprites
    Player.preload(this);
    Resource.preload(this);
    DropItem.preload(this);
    Enemy.preload(this);
    // load tiled background
    this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/images/map.json');
  }

  public create(): void {
    // create tiled background
    this._map = this.make.tilemap({ key: 'map' });
    const tileset = this._map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0);
    const layer1 = this._map.createLayer('Tile Layer 1', tileset, 0, 0);
    this._map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);
    // populate the tiled map
    this._resources = this._map.getObjectLayer('Resources').objects.map((resource) => new Resource(this, resource));
    this._enemies = this._map.getObjectLayer('Enemies').objects.map((enemy) => new Enemy(this, enemy));
    this._player = new Player(this, 430, 330, 'female', 'townsfolk_f_idle_1');
  }

  public update(): void {
    this._player.update();

    // collisions with resources
    this._collidingResource = this._resources.find((resource) =>
      Phaser.Geom.Intersects.CircleToCircle(this._player.circle, resource.circle),
    );

    if (this._collidingResource && !this._collidingWithResource) {
      this._collidingWithResource = true;
      this._player.setCollidingResource(this._collidingResource);
    }

    if (!this._collidingResource && this._collidingWithResource) {
      this._collidingWithResource = false;
      this._player.setCollidingResource(null);
    }

    // collisions with dropped items
    this._collidingDroppedItem = this._droppedItems.find((droppedItem) =>
      Phaser.Geom.Intersects.CircleToCircle(this._player.circle, droppedItem.circle),
    );

    if (this._collidingDroppedItem && !this._collidingWithDroppedItem) {
      this._collidingWithDroppedItem = true;
      this._collidingDroppedItem.pickup();
      this.removeDroppedItem(this._collidingDroppedItem);
    }

    if (!this._collidingDroppedItem && this._collidingWithDroppedItem) {
      this._collidingWithDroppedItem = false;
    }

    // collisions with enemiesas
    this._collidingEnemy = this._enemies.find((enemy) =>
      Phaser.Geom.Intersects.CircleToCircle(this._player.circle, enemy.circle),
    );

    if (this._collidingEnemy && !this._collidingWithEnemy) {
      this._collidingWithEnemy = true;
      this._collidingEnemy.hit();
      // this.removeDroppedItem(this._collidingEnemy);aa
    }

    if (!this._collidingEnemy && this._collidingWithEnemy) {
      this._collidingWithEnemy = false;
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
        this._collidingWithResource = false;
        this._player.setCollidingResource(null);
      }
    }
  }

  public addDroppedItem(droppedItem: DropItem): void {
    this._droppedItems.push(droppedItem); // split into 3 different arrays (for rock, tree, bush?)
    console.log('this._droppedItems: ', this._droppedItems);
  }

  public removeDroppedItem(droppedItem: DropItem): void {
    if (droppedItem) {
      // first remove from the array if exists
      const index = this._droppedItems.indexOf(droppedItem);
      if (index !== -1) {
        this._droppedItems.splice(index, 1);
        // then destroy
        droppedItem.destroy();
        // and reset collisions
        this._collidingWithDroppedItem = false;
      }
    }
  }
}
