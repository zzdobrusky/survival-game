type WSADKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
};

export default class Player extends Phaser.Physics.Matter.Sprite {
  private wsadKeys: WSADKeys;

  constructor(data) {
    const { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);

    // added WSAD keys
    this.wsadKeys = {
      up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.scaleX *= 2;
    this.scaleY *= 2;

    scene.add.existing(this);
  }

  static preload(scene: Phaser.Scene): void {
    scene.load.atlas('female', 'assets/animations/female.png', 'assets/animations/female_atlas.json');
    scene.load.animation('female_anim', 'assets/animations/female_anim.json');
  }

  get velocity(): MatterJS.Vector {
    return this.body.velocity;
  }

  public update(): void {
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
    this.setVelocity(playerVelocity.x, playerVelocity.y);

    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play('female_walk', true);
      // flip player direction when flipping walking direction
      const playerDirection = this.scaleX / Math.abs(this.scaleX);
      if (
        (Math.sign(this.velocity.x) === -1 && playerDirection === 1) ||
        (Math.sign(this.velocity.x) === 1 && playerDirection === -1)
      ) {
        this.scaleX *= -1;
      }
    } else {
      this.anims.play('female_idle', true);
    }
  }
}
