import MainScene from './MainScene';

const CIRCLE_RADIUS = 12;

export default class Resource extends Phaser.Physics.Matter.Sprite {
  private _health: number;
  private _mainScene: MainScene;
  private _circle: Phaser.Geom.Circle;
  private _sound;

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
    // add specific sound by the resource type
    this._sound = this._mainScene.sound.add(this.type, { loop: false });
  }

  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
    scene.load.audio('tree', 'assets/audio/tree.mp3');
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
    // if (this.sound) this.sound.play(); // TODO:
    this._health--;
    this._sound.play();
    console.log(`Hitting: ${this.type} Health: ${this._health}`);
  }
}
