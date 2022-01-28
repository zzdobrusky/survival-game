import MainScene from './MainScene';
import DropItem from './DropItem';

const CIRCLE_RADIUS = 18;

export default class Resource extends Phaser.Physics.Matter.Sprite {
  private _health: number;
  private _mainScene: MainScene;
  private _circle: Phaser.Geom.Circle;
  private _sound: Phaser.Sound.BaseSound;
  private _drops: number[];

  constructor({ scene, resource }: { scene: MainScene; resource: any }) {
    super(scene.matter.world, resource.x, resource.y, 'resources', resource.type);
    this._mainScene = scene;
    this._mainScene.add.existing(this);
    const yOrigin = resource.properties.find((p) => p.name === 'yOrigin').value;
    this.x += this.width / 2;
    this.y += this.height * (yOrigin - 1);
    this.setCircle(CIRCLE_RADIUS);
    this._circle = new Phaser.Geom.Circle(this.x, this.y, CIRCLE_RADIUS);
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);
    this.type = resource.type;
    this._health = 5;
    this._drops = JSON.parse(resource.properties.find((p) => p.name === 'drops').value);
    // add specific sound by the resource type
    this._sound = this._mainScene.sound.add(this.type, { loop: false });
  }

  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
    scene.load.audio('tree', 'assets/audio/tree.wav');
    scene.load.audio('rock', 'assets/audio/rock.wav');
    scene.load.audio('bush', 'assets/audio/bush.wav');
  }

  get dead(): boolean {
    return this._health <= 0;
  }

  get circle(): Phaser.Geom.Circle {
    return this._circle;
  }

  public hit(): void {
    this._health--;
    this._sound.play();
    if (this.dead) {
      this._drops.forEach((drop) => {
        const newDropItem = new DropItem({
          scene: this._mainScene,
          x: this.x,
          y: this.y,
          texture: 'items',
          frame: drop,
          type: this.type,
        });
        this._mainScene.addDroppedItem(newDropItem);
      });
    }
  }
}
