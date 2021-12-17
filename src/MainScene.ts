import Player from './Player';

export default class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Sprite;

  constructor() {
    super('MainScene');
  }

  public preload(): void {
    Player.preload(this);
  }

  public create(): void {
    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: 'female',
      frame: 'townsfolk_f_idle_1',
    });
  }

  update(): void {
    this.player.update();
  }
}
