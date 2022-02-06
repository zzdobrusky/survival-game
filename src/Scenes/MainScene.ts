import ManageSensingIntersections from '../Managers/ManageSensingIntersections';
import DropItem from '../Sprites/DropItem';
import Enemy from '../Sprites/Enemy';
import Player from '../Sprites/Player';
import Resource from '../Sprites/Resource';
import MatterEntity from '../Types/MatterEntity';

export default class MainScene extends Phaser.Scene {
  private _player: Player;
  private _map: Phaser.Tilemaps.Tilemap;
  private _resources: Resource[];
  private _enemies: Enemy[];
  private _droppedItems: DropItem[];
  private _manageSensingWithResources: ManageSensingIntersections;
  private _manageSensingWithEnemies: ManageSensingIntersections;
  private _manageSensingWithDrops: ManageSensingIntersections;

  constructor() {
    super('MainScene');
    this._droppedItems = [];
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
    this._manageSensingWithResources = new ManageSensingIntersections(this._player, this._resources);
    this._manageSensingWithEnemies = new ManageSensingIntersections(
      this._player,
      this._enemies,
      (enemy) => (enemy as Enemy).startHunting(this._player),
      // (enemy) => (enemy as Enemy).stopTracking(), // TODO: this calls method of the null object
    );
    this._manageSensingWithDrops = new ManageSensingIntersections(this._player, this._droppedItems, (drop) => {
      (drop as DropItem).pickup();
      this.removeSensingEntity(drop, this._droppedItems);
    });
  }

  public update(): void {
    this._player.update();
    this._enemies.forEach((enemy) => enemy.update());
    // source sensing a player
    this._manageSensingWithResources.update();
    // enemies sensing a player
    this._manageSensingWithEnemies.update();
    // dropped items colliding with a player
    this._manageSensingWithDrops.update();
  }

  public removeSensingEntity(sensingEntity: MatterEntity, sensingEntities: MatterEntity[]): void {
    if (sensingEntity) {
      // first remove from the array if exists
      const index = sensingEntities.indexOf(sensingEntity);
      if (index !== -1) {
        sensingEntities.splice(index, 1);
        // then destroy
        sensingEntity.destroy();
        this._manageSensingWithResources.resetSensingIntersection();
      }
    }
  }

  public addDroppedItem(droppedItem: DropItem): void {
    this._droppedItems.push(droppedItem); // split into 3 different arrays (for rock, tree, bush?)
  }
}
