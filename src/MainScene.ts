import Player from './Player';

export default class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Sprite;
  private playerBouncer: Phaser.Physics.Matter.Sprite;
  private map: Phaser.Tilemaps.Tilemap;

  constructor() {
    super('MainScene');
  }

  public preload(): void {
    Player.preload(this);
    this.load.tilemapTiledJSON('map', 'assets/images/map.json');
    this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
    this.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
  }

  public create(): void {
    const map = this.make.tilemap({ key: 'map' });
    this.map = map;
    const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0);
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);
    const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);

    const tree = new Phaser.Physics.Matter.Sprite(this.matter.world, 50, 50, 'resources', 'tree');
    const rock = new Phaser.Physics.Matter.Sprite(this.matter.world, 150, 150, 'resources', 'rock');
    const bush = new Phaser.Physics.Matter.Sprite(this.matter.world, 250, 250, 'resources', 'bush');
    tree.setStatic(true);
    rock.setStatic(true);
    bush.setStatic(true);
    this.add.existing(tree);
    this.add.existing(rock);
    this.add.existing(bush);

    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: 'female',
      frame: 'townsfolk_f_idle_1',
    });
  }

  update(): void {
    this.player.update();

    // collisions
    // if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.playerBouncer.getBounds())) {
    //   // alert('collision started');
    // } else {
    //   // alert('collision ended');
    // }
  }
}
