import MainScene from './MainScene';

const CIRCLE_RADIUS = 10;

export default class DropItem extends Phaser.Physics.Matter.Sprite {
  private _sound: Phaser.Sound.BaseSound;
  private _circle: Phaser.Geom.Circle;

  constructor({
    scene,
    x,
    y,
    texture,
    frame,
    type,
  }: {
    scene: MainScene;
    x: number;
    y: number;
    texture: string | Phaser.Textures.Texture;
    frame: string | number;
    type: string;
  }) {
    super(scene.matter.world, x, y, texture, frame);
    scene.add.existing(this);
    this.setCircle(CIRCLE_RADIUS);
    this.setFrictionAir(0.6);
    this.setScale(0.5);
    this._sound = scene.sound.add('pickup');
    this.type = type;
    this._circle = new Phaser.Geom.Circle(this.x, this.y, CIRCLE_RADIUS);
  }

  public static preload(scene: Phaser.Scene): void {
    scene.load.audio('pickup', 'assets/audio/pickup.wav');
  }

  get circle(): Phaser.Geom.Circle {
    this._circle = new Phaser.Geom.Circle(this.x, this.y, CIRCLE_RADIUS);
    return this._circle;
  }

  public pickup(): boolean {
    this._sound.play();
    return true;
  }
}
