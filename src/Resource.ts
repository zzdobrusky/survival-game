export default class Resource extends Phaser.Physics.Matter.Sprite {
  public static preload(scene): void {
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
  }

  constructor(data) {
    const { scene, resource } = data;
    super(scene.matter.world, resource.x, resource.y, 'resources', resource.type);
    scene.add.existing(this);

    const yOrigin = resource.properties.find((p) => p.name === 'yOrigin').value;
    this.x += this.width / 2;
    this.y += this.height * (yOrigin - 1);
    this.setCircle(12);
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);
  }
}
