type KeyboardKeys = {
  upW: Phaser.Input.Keyboard.Key;
  downS: Phaser.Input.Keyboard.Key;
  leftA: Phaser.Input.Keyboard.Key;
  rightArrow: Phaser.Input.Keyboard.Key;
  upArrow: Phaser.Input.Keyboard.Key;
  downArrow: Phaser.Input.Keyboard.Key;
  leftArrow: Phaser.Input.Keyboard.Key;
  rightD: Phaser.Input.Keyboard.Key;
  EKey: Phaser.Input.Keyboard.Key;
  pointer: Phaser.Input.Pointer;
};

export default class Player extends Phaser.Physics.Matter.Sprite {
  private keys: KeyboardKeys;
  private spriteWeapon: Phaser.GameObjects.Sprite;
  private weaponRotation: number;
  private weaponRotationDirection: number;

  constructor(data) {
    const { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    scene.add.existing(this);
    // Weapen
    this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'items', 162);
    this.spriteWeapon.setScale(0.8);
    this.spriteWeapon.setOrigin(0.25, 0.75);
    this.weaponRotationDirection = 1;
    scene.add.existing(this.spriteWeapon);

    // added WSAD keys
    this.keys = {
      upW: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      downS: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      leftA: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      rightD: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      rightArrow: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      upArrow: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      downArrow: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      leftArrow: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      EKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      pointer: scene.input.activePointer,
    };

    this.setCircle(12);
    this.setFrictionAir(0.35);
    this.setFixedRotation();
  }

  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('female', 'assets/animations/female.png', 'assets/animations/female_atlas.json');
    scene.load.animation('female_anim', 'assets/animations/female_anim.json');
    scene.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
  }

  get velocity(): MatterJS.Vector {
    return this.body.velocity;
  }

  public update(): void {
    const speed = 2.5;
    const playerVelocity = new Phaser.Math.Vector2();

    // move player around
    if (this.keys.leftA.isDown || this.keys.leftArrow.isDown) {
      playerVelocity.x = -1;
    } else if (this.keys.rightD.isDown || this.keys.rightArrow.isDown) {
      playerVelocity.x = 1;
    }

    if (this.keys.upW.isDown || this.keys.upArrow.isDown) {
      playerVelocity.y = -1;
    } else if (this.keys.downS.isDown || this.keys.downArrow.isDown) {
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
        this.spriteWeapon.scaleX *= -1;
        this.weaponRotationDirection *= -1;
      }
    } else {
      this.anims.play('female_idle', true);
    }

    this.spriteWeapon.setPosition(this.x, this.y);
    // weapon rotate
    if (this.keys.pointer.isDown || this.keys.EKey.isDown) {
      console.log('weaponRotationDirection: ', this.weaponRotationDirection);
      this.weaponRotation += this.weaponRotationDirection * 6;
    } else {
      this.weaponRotation = 0;
    }
    console.log(this.weaponRotation);
    if (this.weaponRotation > 100 || this.weaponRotation < -100) {
      this.weaponRotation = 0;
    }
    this.spriteWeapon.setAngle(this.weaponRotation);
  }
}
