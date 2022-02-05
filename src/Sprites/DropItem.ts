import MainScene from '../Scenes/MainScene';
import MatterEntity from '../Types/MatterEntity';

const CIRCLE_RADIUS = 9;
const SENSING_CIRCLE_RADIUS = 0;

export default class DropItem extends MatterEntity {
  public static preload(scene: Phaser.Scene): void {
    scene.load.audio('pickup', 'assets/audio/pickup.wav');
  }

  constructor(
    scene: MainScene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number,
    type: string,
  ) {
    super(scene, x, y, texture, frame, type, 0, 0, [], 0.6, CIRCLE_RADIUS, SENSING_CIRCLE_RADIUS);
    this.x -= this.width / 2;
    this.y -= this.height / 2;
    this.setScale(0.5);
  }
}
