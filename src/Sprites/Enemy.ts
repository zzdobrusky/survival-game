import { extractPropertyFromTile } from '../Tools/helpers';
import MatterEntity from '../Types/MatterEntity';
import MainScene from '../Scenes/MainScene';
import { TileResource } from '../Types/TileResource';
import Player from './Player';

const CIRCLE_RADIUS = 15;
const SENSING_CIRCLE_RADIUS = 40;

export default class Enemy extends MatterEntity {
  private _prey: Player;

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
  }

  public update(): void {
    // fix for keeping player rotation constant
    this.setAngle(0);
    if (this._prey) {
      // TODO:
      const directionToTrackPrey = this._prey.position.subtract(this.position).normalize();
      this.setVelocity(directionToTrackPrey.x, directionToTrackPrey.y);
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
}
