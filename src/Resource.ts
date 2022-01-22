import MainScene from './MainScene';

export default class Resource extends Phaser.Physics.Matter.Sprite {
  public health: number;
  private mainScene: MainScene;

  constructor(data) {
    const { scene, resource } = data;
    super(scene.matter.world, resource.x, resource.y, 'resources', resource.type);
    this.mainScene = scene;
    this.mainScene.add.existing(this);
    const yOrigin = resource.properties.find((p) => p.name === 'yOrigin').value;
    this.x += this.width / 2;
    this.y += this.height * (yOrigin - 1);
    this.setCircle(12);
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);
    this.type = resource.type;
    this.health = 5;
  }

  public static preload(scene: Phaser.Scene): void {
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
  }

  get dead(): boolean {
    return this.health <= 0;
  }

  // public remove(resources): void {

  // }

  public hit(): void {
    // if (this.sound) this.sound.play();
    this.health--;
    console.log(`Hitting: ${this.type} Health: ${this.health}`);
  }
}
