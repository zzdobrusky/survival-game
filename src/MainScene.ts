import DropItem from './DropItem';
import Player from './Player';
import Resource from './Resource';

export default class MainScene extends Phaser.Scene {
  private _player: Player;
  private _map: Phaser.Tilemaps.Tilemap;
  private _resources: Resource[];
  private _collidingResource: Resource;
  private _collidingWithResource: boolean;
  private _droppedItems: DropItem[];
  private _collidingDroppedItem: DropItem;
  private _collidingWithDroppedItem: boolean;

  constructor() {
    super('MainScene');
    this._collidingResource = null;
    this._collidingWithResource = false;
    this._droppedItems = [];
    this._collidingDroppedItem = null;
    this._collidingWithDroppedItem = false;
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
    this._droppedItems.forEach((dropItem) => dropItem.update());

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
      // this._player.setCollidingResource(this._collidingResource);
      console.log('statred colliding with dropped item');
      this._collidingDroppedItem.pickup();
      this.removeDroppedItem(this._collidingDroppedItem);
    }

    // TODO: might not even need this
    if (!this._collidingDroppedItem && this._collidingWithDroppedItem) {
      this._collidingWithDroppedItem = false;
      // this._player.setCollidingResource(null);
      console.log('ended colliding with dropped item');
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
