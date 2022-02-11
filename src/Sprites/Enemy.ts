import { extractPropertyFromTile } from '../Tools/helpers';
import MatterEntity from '../Types/MatterEntity';
import MainScene from '../Scenes/MainScene';
import { TileResource } from '../Types/TileResource';
import Player from './Player';

import { ENEMY_SIZES, ENEMY_BITE_FREQUENCY_MS } from './constants';

export default class Enemy extends MatterEntity {
  private _prey: Player;
  private _attackTimer: NodeJS.Timer;
  private _isAttacking: boolean;

  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('enemies', 'assets/animations/enemies.png', 'assets/animations/enemies_atlas.json');
    scene.load.animation('enemies_anim', 'assets/animations/enemies_anim.json');
    scene.load.audio('bear', 'assets/audio/bear.wav');
    scene.load.audio('ent', 'assets/audio/ent.wav');
    scene.load.audio('wolf', 'assets/audio/wolf.wav');
  }

  constructor(scene: MainScene, tileResource: TileResource) {
    const drops = extractPropertyFromTile<[]>(tileResource, 'drops', 'string', []);
    const health = extractPropertyFromTile<number>(tileResource, 'health', 'number', 0);
    super(
      scene,
      tileResource.x,
      tileResource.y,
      'enemies',
      `${tileResource.type}_idle_1`,
      tileResource.type,
      health,
      0,
      drops,
      0.36,
      ENEMY_SIZES.CIRCLE_RADIUS,
      ENEMY_SIZES.SENSING_CIRCLE_RADIUS,
      ENEMY_SIZES.ATTACKING_DISTANCE,
    );
    this._prey = null;
    this._attackTimer = null;
    this._isAttacking = false;
  }

  public update(): void {
    // set up following a prey and attacking if too close
    if (this._prey) {
      if (this._attackTimer === null && this.canAttack(this._prey)) {
        console.log('Enemy update canAttack');
        this._isAttacking = true;
        // stop running
        this.setVelocity(0, 0);
        this._attackTimer = setInterval(() => this.attack(), ENEMY_BITE_FREQUENCY_MS);
      } else if (this._attackTimer !== null && !this.canAttack(this._prey)) {
        console.log('Enemy update cannot Attack');
        this._isAttacking = false;
        clearInterval(this._attackTimer);
        this._attackTimer = null;
      }

      if (!this._isAttacking) {
        // start running
        const velocityToPrey = this.attackingVector(this._prey).normalize();
        this.setVelocity(velocityToPrey.x, velocityToPrey.y);
      }
    }

    // fix for keeping player rotation constant
    this.setAngle(0);
    // keep enemy looking in the direction of moving
    this.setFlipX(this.velocity.x < 0);
  }

  public startHunting(prey: Player): void {
    console.log('Enemy starHunting() prey: ', prey);
    this.sound.play();
    this._prey = prey;
  }

  public stopHunting(): void {
    console.log('Enemy starHunting() prey: ', null);
    this._prey = null;
    // stop running
    this.setVelocity(0, 0);
  }

  public attack(): void {
    // TODO: use attacking distance
    console.log('Enemy attack() this._prey: ', this._prey);
    if (this._prey && this.canAttack(this._prey)) {
      console.log('attacking a prey');
      console.log('this._prey.dead: ', this._prey.dead);
      console.log('this.dead: ', this.dead);
      if (this._prey.dead || this.dead) {
        clearInterval(this._attackTimer);
        this._attackTimer = null;
      } else {
        console.log('hitting a prey');
        this._prey.hit();
      }
    }
  }
}
