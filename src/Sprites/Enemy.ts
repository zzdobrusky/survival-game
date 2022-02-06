import { extractPropertyFromTile } from '../Tools/helpers';
import MatterEntity from '../Types/MatterEntity';
import MainScene from '../Scenes/MainScene';
import { TileResource } from '../Types/TileResource';
import Player from './Player';

const CIRCLE_RADIUS = 15;
const SENSING_CIRCLE_RADIUS = 40;

export default class Enemy extends MatterEntity {
  private _prey: Player;
  private _attackTimer: NodeJS.Timer;

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
      CIRCLE_RADIUS,
      SENSING_CIRCLE_RADIUS,
    );
    this._prey = null;
    this._attackTimer = null;
  }

  public update(): void {
    // fix for keeping player rotation constant
    this.setAngle(0);
    // set up following a prey and attacking if too close
    if (this._prey) {
      const directionToTrackPrey = this._prey.position.subtract(this.position);
      if (directionToTrackPrey.length() > 28) {
        const velocityToPrey = directionToTrackPrey.normalize();
        this.setVelocity(velocityToPrey.x, velocityToPrey.y);
        if (this._attackTimer) {
          clearInterval(this._attackTimer);
          this._attackTimer = null;
        }
      } else if (this._attackTimer === null) {
        this._attackTimer = setInterval(() => this.attack(), 500);
      }
    }
  }

  public startHunting(player: Player): void {
    console.log('started tracking...');
    this.sound.play();
    this._prey = player;
  }

  public stopHunting(): void {
    console.log('stopped tracking...');
    this._prey = null;
  }

  public attack(): void {
    console.log('attacking a prey');
    console.log('this._prey.dead: ', this._prey.dead);
    console.log('this.dead: ', this.dead);
    if (this._prey.dead || this.dead) {
      clearInterval(this._attackTimer);
    } else {
      console.log('hitting a prey');
      this._prey.hit();
    }
  }
}
