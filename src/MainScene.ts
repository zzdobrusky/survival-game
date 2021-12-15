type WSADKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
};

export default class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Sprite;
  private wsadKeys: WSADKeys;

  constructor() {
    super('MainScene');
  }

  public preload(): void {
    console.log('preload');
  }

  public create(): void {
    console.log('create');
    this.player = new Phaser.Physics.Matter.Sprite(this.matter.world, 100, 100, null);
    // added WSAD keys
    this.wsadKeys = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  public update(): void {
    console.log('update');
    const speed = 2.5;
    const playerVelocity = new Phaser.Math.Vector2();
    if (this.wsadKeys.left.isDown) {
      playerVelocity.x = -1;
    } else if (this.wsadKeys.right.isDown) {
      playerVelocity.x = 1;
    }

    if (this.wsadKeys.up.isDown) {
      playerVelocity.y = -1;
    } else if (this.wsadKeys.down.isDown) {
      playerVelocity.y = 1;
    }

    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.player.setVelocity(playerVelocity.x, playerVelocity.y);
  }
}
