import MainScene from './MainScene';
import DropItem from './DropItem';

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
  private _position: Phaser.Math.Vector2;
  private _health: number;
  private _mainScene: MainScene;
  private _circle: Phaser.Geom.Circle;
  private _sound: Phaser.Sound.BaseSound;
  private _drops: number[];
  private _depth: number;
  private _type: string;
  private _CIRCLE_RADIUS: number;
  private _SENSING_DISTANCE: number;

  constructor(
    scene: MainScene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number,
    type: string,
    health: number,
    depth: number,
    drops: number[],
    CIRCLE_RADIUS: number,
    SENSING_DISTANCE: number,
  ) {
    super(scene.matter.world, x, y, texture, frame);
    this._mainScene = scene;
    this.x += this.width / 2;
    this.y += this.height / 2;
    this._depth = depth || 1;
    this._type = type;
    this._health = health;
    this._drops = drops;
    this._depth = depth;
    this._CIRCLE_RADIUS = CIRCLE_RADIUS;
    this._SENSING_DISTANCE = SENSING_DISTANCE;

    this._position = new Phaser.Math.Vector2(this.x, this.y);
    if (this._type) this._sound = this.scene.sound.add(this._type);
    this.setCircle(this._CIRCLE_RADIUS);

    this.scene.add.existing(this);
  }

  get position(): Phaser.Math.Vector2 {
    this._position.set(this.x, this.y);
    return this._position;
  }

  get velocity(): Phaser.Math.Vector2 | MatterJS.Vector {
    return this.body.velocity;
  }

  get circle(): Phaser.Geom.Circle {
    this._circle = new Phaser.Geom.Circle(this.x, this.y, this._CIRCLE_RADIUS + this._SENSING_DISTANCE);
    return this._circle;
  }

  get dead(): boolean {
    return this._health <= 0;
  }

  onDeath(): void {
    // TODO:
  }

  public hit(): void {
    this._health--;
    this._sound.play();
    if (this.dead) {
      this._drops.forEach((drop) => {
        const newDropItem = new DropItem(this._mainScene, this.x, this.y, 'items', drop, this.type);
        this._mainScene.addDroppedItem(newDropItem);
      });
    }
  }
}
