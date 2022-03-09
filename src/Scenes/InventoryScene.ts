export default class InventoryScene extends Phaser.Scene {
  constructor() {
    super('InventoryScene');
  }

  public preload(): void {
    // this.load.image('pic', 'assets/images/blue_jay_bird_nature.jpg');
    this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
  }

  public create(): void {
    const inventorySlot = this.add.sprite(300, 200, 'items', 11);
    // this.add.image(300, 200, 'pic');
  }
}
