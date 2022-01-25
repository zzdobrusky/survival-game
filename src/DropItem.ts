import MainScene from './MainScene';

const CIRCLE_RADIUS = 10;

export default class DropItem extends Phaser.Physics.Matter.Sprite {
  private _sound: Phaser.Sound.BaseSound;

  constructor({
    scene,
    x,
    y,
    texture,
    frame,
  }: {
    scene: MainScene;
    x: number;
    y: number;
    texture: string | Phaser.Textures.Texture;
    frame: string | number;
  }) {
    super(scene.matter.world, x, y, texture, frame);
    scene.add.existing(this);
    this.setFrictionAir(1);
    this.setCircle(CIRCLE_RADIUS);
    this.setScale(0.5);
    this._sound = scene.sound.add('pickup');
  }

  public static preload(scene: Phaser.Scene): void {
    scene.load.audio('pickup', 'assets/audio/pickup.wav');
  }

  public pickup(): boolean {
    this.destroy();
    this._sound.play();
    return true;
  }
}
