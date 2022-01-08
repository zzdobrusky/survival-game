import Player from './Player';

export default class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Sprite;
  private map: Phaser.Tilemaps.Tilemap;

  constructor() {
    super('MainScene');
  }

  public preload(): void {
    Player.preload(this);
    this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/images/map.json');
    this.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
  }

  public create(): void {
    // const map = this.make.tilemap({ key: 'map' });
    this.map = this.make.tilemap({ key: 'map' });
    // this.map = map;
    const tileset = this.map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0);
    const layer1 = this.map.createLayer('Tile Layer 1', tileset, 0, 0);
    const layer2 = this.map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);

    this.addResources();

    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: 'female',
      frame: 'townsfolk_f_idle_1',
    });

    // let tree = new Phaser.Physics.Matter.Sprite(this.matter.world, 50, 50, 'resources', 'tree');
    // let rock = new Phaser.Physics.Matter.Sprite(this.matter.world, 150, 150, 'resources', 'rock');
    // tree.setStatic(true);
    // rock.setStatic(true);
    // this.add.existing(tree);
    // this.add.existing(rock);
  }

  private addResources(): void {
    const resources = this.map.getObjectLayer('Resources');
    resources.objects.forEach((resource) => {
      const resItem = new Phaser.Physics.Matter.Sprite(
        this.matter.world,
        resource.x,
        resource.y,
        'resources',
        resource.type,
      );
      const yOrigin = resource.properties.find(p => p.name == 'yOrigin').value;
      resItem.x += resItem.width / 2;
      resItem.y += resItem.height * (yOrigin - 1);
      resItem.setCircle(12);
      resItem.setStatic(true);
      resItem.setOrigin(0.5, yOrigin);
      this.add.existing(resItem);
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
