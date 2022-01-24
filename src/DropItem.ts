import MainScene from './MainScene';

export default class DropItem extends Phaser.Physics.Matter.Sprite {
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
  }
}
