import MainScene from '../Scenes/MainScene';
import DropItem from '../Sprites/DropItem';

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
  private _health: number;
  private _mainScene: MainScene;
  private _sound: Phaser.Sound.BaseSound;
  private _drops: number[];
  private _CIRCLE_RADIUS: number;
  private _SENSING_CIRCLE_RADIUS: number;
  private _ATTACKING_DISTANCE: number;
  private _entityType: string;

  constructor(
    scene: MainScene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number,
    type: string,
    health: number,
    depth: number,
    drops: number[],
    friction: number,
    COLLISION_CIRCLE_RADIUS: number,
    SENSING_CIRCLE_RADIUS: number,
    ATTACKING_DISTANCE: number,
  ) {
    super(scene.matter.world, x, y, texture, frame);
    this._mainScene = scene;
    this.x += this.width / 2;
    this.y += this.height / 2;
    this._health = health;
    this._drops = drops;

    if (type) this._sound = scene.sound.add(type);

    this._entityType = type;
    this._CIRCLE_RADIUS = COLLISION_CIRCLE_RADIUS;
    this._SENSING_CIRCLE_RADIUS = SENSING_CIRCLE_RADIUS;
    this._ATTACKING_DISTANCE = ATTACKING_DISTANCE;
    this.setCircle(this._CIRCLE_RADIUS);
    if (depth && typeof depth === 'number') this.setDepth(depth);
    if (friction && friction < 1) this.setFriction(friction, 0.03);
    else this.setStatic(true);

    this.scene.add.existing(this);
  }

  public attackingVector(otherEntity: MatterEntity): Phaser.Math.Vector2 {
    return otherEntity.position.subtract(this.position);
  }

  public canAttack(otherEntity: MatterEntity): boolean {
    const directionToAttackingEntity = this.attackingVector(otherEntity);
    return directionToAttackingEntity.length() < this._ATTACKING_DISTANCE;
  }

  get entityType(): string {
    return this._entityType;
  }

  get sound(): Phaser.Sound.BaseSound {
    return this._sound;
  }

  get mainScene(): MainScene {
    return this._mainScene;
  }

  get position(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.x, this.y);
  }

  get velocity(): Phaser.Math.Vector2 | MatterJS.Vector {
    return this.body.velocity;
  }

  get sensingCircle(): Phaser.Geom.Circle {
    return new Phaser.Geom.Circle(this.x, this.y, this._SENSING_CIRCLE_RADIUS);
  }

  get dead(): boolean {
    return this._health <= 0;
  }

  public onDeath(): void {
    // Override
  }

  public hit(): void {
    this._health--;
    this._sound.play();
    if (this.dead) {
      this.onDeath();
      this._drops.forEach((drop) => {
        const newDropItem = new DropItem(this._mainScene, this.x, this.y, 'items', drop, 'pickup');
        this._mainScene.addDroppedItem(newDropItem);
      });
    }
  }
}
