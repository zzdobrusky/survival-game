import MainScene from './MainScene';
import Resource from './Resource';
import MatterEntity from './MatterEntity';

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

const CIRCLE_RADIUS = 10;
const SENSING_DISTANCE = 4;

export default class Player extends MatterEntity {
  private readonly _KEYS: KeyboardKeys;
  private _spriteWeapon: Phaser.GameObjects.Sprite;
  private _weaponRotation: number;
  private _weaponRotationDirection: number;
  private _collidingResource: Resource;

  constructor(
    scene: MainScene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number,
  ) {
    super(scene, x, y, texture, frame, '', 0, 0, [], 0.35, CIRCLE_RADIUS, SENSING_DISTANCE);

    // added WSAD keys
    this._KEYS = {
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

    // Weapen
    this._spriteWeapon = new Phaser.GameObjects.Sprite(scene, 0, 0, 'items', 162);
    this._spriteWeapon.setScale(0.8);
    this._spriteWeapon.setOrigin(0.25, 0.75);
    this._weaponRotationDirection = 1;
    scene.add.existing(this._spriteWeapon);
  }

  public setCollidingResource(resource: Resource): void {
    this._collidingResource = resource;
  }

  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('female', 'assets/animations/female.png', 'assets/animations/female_atlas.json');
    scene.load.animation('female_anim', 'assets/animations/female_anim.json');
    scene.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
  }

  public update(): void {
    const speed = 2.5;
    const playerVelocity = new Phaser.Math.Vector2();

    // move player around
    if (this._KEYS.leftA.isDown || this._KEYS.leftArrow.isDown) {
      playerVelocity.x = -1;
    } else if (this._KEYS.rightD.isDown || this._KEYS.rightArrow.isDown) {
      playerVelocity.x = 1;
    }

    if (this._KEYS.upW.isDown || this._KEYS.upArrow.isDown) {
      playerVelocity.y = -1;
    } else if (this._KEYS.downS.isDown || this._KEYS.downArrow.isDown) {
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
        this._spriteWeapon.scaleX *= -1;
        this._weaponRotationDirection *= -1;
      }
    } else {
      this.anims.play('female_idle', true);
    }

    // weapon rotate
    this._spriteWeapon.setPosition(this.x, this.y);
    if (this._KEYS.pointer.isDown || this._KEYS.EKey.isDown) {
      this._weaponRotation += this._weaponRotationDirection * 6;
    } else {
      this._weaponRotation = 0;
    }

    if (this._weaponRotation > 100 || this._weaponRotation < -100) {
      this.whackStuff();
      this._weaponRotation = 0;
    }
    this._spriteWeapon.setAngle(this._weaponRotation);
  }

  private whackStuff(): void {
    if (this._collidingResource) {
      this._collidingResource.hit();
      if (this._collidingResource.dead) {
        this.mainScene.removeResource(this._collidingResource);
      }
    }
  }
}
