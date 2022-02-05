import ManageIntersections from '../Managers/ManageIntersections';
import DropItem from '../Sprites/DropItem';
import Enemy from '../Sprites/Enemy';
import Player from '../Sprites/Player';
import Resource from '../Sprites/Resource';

export default class MainScene extends Phaser.Scene {
  private _player: Player;
  private _map: Phaser.Tilemaps.Tilemap;
  private _resources: Resource[];
  private _enemies: Enemy[];
  private _droppedItems: DropItem[];
  private _manageSensingWithResources: ManageIntersections;
  private _manageSensingWithEnemies: ManageIntersections;
  private _manageCollisionsWithDrops: ManageIntersections;

  // private _collidingResource: Resource;
  // private _sensingResource: Resource;
  // private _startedCollidingWithResource: boolean;
  // private _startedSensingWithResource: boolean;

  // private _collidingDroppedItem: DropItem;
  // private _startedCollidingWithDroppedItem: boolean;
  // private _collidingEnemy: Enemy;
  // private _sensingEnemy: Enemy;
  // private _startedCollidingWithEnemy: boolean;
  // private _startedSensingWithEnemy: boolean;

  constructor() {
    super('MainScene');
    // this._collidingResource = null;
    // this._startedCollidingWithResource = false;
    // this._startedSensingWithResource = false;
    this._droppedItems = [];
    // this._collidingDroppedItem = null;
    // this._startedCollidingWithDroppedItem = false;
    // this._collidingEnemy = null;
    // this._sensingEnemy = null;
    // this._startedCollidingWithEnemy = false;
    // this._startedSensingWithEnemy = false;
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
    // manage intersections
    this._manageSensingWithResources = new ManageIntersections(this._player, this._resources, true);
    this._manageSensingWithEnemies = new ManageIntersections(this._player, this._enemies, true, (enemy) =>
      enemy.startedTracking(),
    );
    this._manageCollisionsWithDrops = new ManageIntersections(this._player, this._droppedItems, false, (drop) => {
      drop.pickup();
      this.removeDroppedItem(drop);
    });
  }

  public update(): void {
    this._player.update();
    // source sensing a player
    this._manageSensingWithResources.update();
    // enemies sensing a player
    this._manageSensingWithEnemies.update();
    // dropped items colliding with a player
    this._manageCollisionsWithDrops.update();
    // this._collidingDroppedItem = this._droppedItems.find((droppedItem) =>
    //   Phaser.Geom.Intersects.CircleToCircle(this._player.circle, droppedItem.circle),
    // );
    // if (this._collidingDroppedItem && !this._startedCollidingWithDroppedItem) {
    //   this._startedCollidingWithDroppedItem = true;
    //   this._collidingDroppedItem.pickup();
    //   this.removeDroppedItem(this._collidingDroppedItem);
    // }
    // if (!this._collidingDroppedItem && this._startedCollidingWithDroppedItem) {
    //   this._startedCollidingWithDroppedItem = false;
    // }

    // TODO: enemy colliding with a player
  }

  public removeSensingResource(resource: Resource): void {
    if (resource) {
      // first remove from the array if exists
      const index = this._resources.indexOf(resource);
      if (index !== -1) {
        this._resources.splice(index, 1);
        // then destroy
        resource.destroy();
        this._manageSensingWithResources.resetIntersecting();
      }
    }
  }

  public removeEnemy(enemy: Enemy): void {
    if (enemy) {
      // first remove from the array if exists
      const index = this._enemies.indexOf(enemy);
      if (index !== -1) {
        this._resources.splice(index, 1);
        // then destroy
        enemy.destroy();
        // and reset collisions
        this._manageSensingWithEnemies.resetIntersecting();
      }
    }
  }

  public addDroppedItem(droppedItem: DropItem): void {
    this._droppedItems.push(droppedItem); // split into 3 different arrays (for rock, tree, bush?)
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
        this._manageCollisionsWithDrops.resetIntersecting();
      }
    }
  }
}
