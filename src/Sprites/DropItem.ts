import MainScene from '../Scenes/MainScene';
import MatterEntity from '../Types/MatterEntity';
import { DROP_ITEM_SIZES } from './constants';

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
    super(
      scene,
      x,
      y,
      texture,
      frame,
      type,
      0,
      0,
      [],
      0.6,
      DROP_ITEM_SIZES.CIRCLE_RADIUS,
      DROP_ITEM_SIZES.SENSING_CIRCLE_RADIUS,
      DROP_ITEM_SIZES.ATTACKING_DISTANCE,
    );
    this.x -= this.width / 2;
    this.y -= this.height / 2;
    this.setScale(0.5);
  }

  public pickup(): boolean {
    this.sound.play();
    return true;
  }
}
