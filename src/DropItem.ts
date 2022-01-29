import MainScene from './MainScene';
import MatterEntity from './MatterEntity';

const CIRCLE_RADIUS = 9;

export default class DropItem extends MatterEntity {
  constructor(
    scene: MainScene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number,
    type: string,
  ) {
    super(scene, x, y, texture, frame, type, 0, 0, [], 0.6, CIRCLE_RADIUS, 0);
    this.x -= this.width / 2;
    this.y -= this.height / 2;
    this.setScale(0.5);
  }

  public static preload(scene: Phaser.Scene): void {
    scene.load.audio('pickup', 'assets/audio/pickup.wav');
  }

  public pickup(): boolean {
    this.sound.play();
    return true;
  }
}
