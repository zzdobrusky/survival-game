import MatterEntity from '../Types/MatterEntity';

export default class Enemy extends MatterEntity {
  static preload(scene: Phaser.Scene): void {
    scene.load.atlas('enemies', 'assets/animations/enemies.png', 'assets/animations/enemies_atlas.json');
    scene.load.animation('enemies_anim', 'assets/animations/enemies_anim.json');
  }

  // constructor({ scene, enemy })
}
