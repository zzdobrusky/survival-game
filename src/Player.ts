import MainScene from './MainScene';
import Resource from './Resource';

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
  private readonly KEYS: KeyboardKeys;
  private spriteWeapon: Phaser.GameObjects.Sprite;
  private weaponRotation: number;
  private weaponRotationDirection: number;
  private collidingResource: Resource;
  private mainScene: MainScene;

  constructor(data) {
    const { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.mainScene = scene;
    this.mainScene.add.existing(this);

    // added WSAD keys
    this.KEYS = {
      upW: this.mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      downS: this.mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      leftA: this.mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      rightD: this.mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      rightArrow: this.mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      upArrow: this.mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      downArrow: this.mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      leftArrow: this.mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      EKey: this.mainScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      pointer: this.mainScene.input.activePointer,
    };

    this.setCircle(12);
    this.setFrictionAir(0.35);
    // this.setFixedRotation(); // doesn't work

    // Weapen
    this.spriteWeapon = new Phaser.GameObjects.Sprite(this.mainScene, 0, 0, 'items', 162);
    this.spriteWeapon.setScale(0.8);
    this.spriteWeapon.setOrigin(0.25, 0.75);
    this.weaponRotationDirection = 1;
    scene.add.existing(this.spriteWeapon);
  }

  public setCollidingResource(resource: Resource): void {
    this.collidingResource = resource;
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
    if (this.KEYS.leftA.isDown || this.KEYS.leftArrow.isDown) {
      playerVelocity.x = -1;
    } else if (this.KEYS.rightD.isDown || this.KEYS.rightArrow.isDown) {
      playerVelocity.x = 1;
    }

    if (this.KEYS.upW.isDown || this.KEYS.upArrow.isDown) {
      playerVelocity.y = -1;
    } else if (this.KEYS.downS.isDown || this.KEYS.downArrow.isDown) {
      playerVelocity.y = 1;
    }

    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);
    // fix for keeping player rotation constant
    this.setAngle(0);

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

    // weapon rotate
    this.spriteWeapon.setPosition(this.x, this.y);
    if (this.KEYS.pointer.isDown || this.KEYS.EKey.isDown) {
      this.weaponRotation += this.weaponRotationDirection * 6;
    } else {
      this.weaponRotation = 0;
    }

    if (this.weaponRotation > 100 || this.weaponRotation < -100) {
      this.whackStuff();
      this.weaponRotation = 0;
    }
    this.spriteWeapon.setAngle(this.weaponRotation);
  }

  private whackStuff(): void {
    if (this.collidingResource) {
      this.collidingResource.hit();
      if (this.collidingResource.dead) {
        this.mainScene.removeResource(this.collidingResource);
      }
    } else {
      console.log('nothing to whack!');
    }
  }
}
