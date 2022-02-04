import Player from '../Sprites/Player';
import MatterEntity from '../Types/MatterEntity';

interface ICallback {
  (): void;
}

// TODO: interface instead calling different methods and different circles
export default class ManageIntersections {
  private _startedIntersecting: boolean;
  private _intersectingEntities: MatterEntity[];
  private _player: Player;
  private _isSensing: boolean;
  private _onStartedIntersecting: ICallback;
  private _onEndedIntersecting: ICallback;

  constructor(
    player: Player,
    intersectingEntities: MatterEntity[],
    isSensing: boolean,
    onStartedIntersecting: ICallback = null,
    onEndedIntersecting: ICallback = null,
  ) {
    this._startedIntersecting = false;
    this._intersectingEntities = intersectingEntities;
    this._player = player;
    this._isSensing = isSensing;
    this._onStartedIntersecting = onStartedIntersecting;
    this._onEndedIntersecting = onEndedIntersecting;
  }

  public update(): void {
    const intersectingEntity = this._intersectingEntities.find((entity) => {
      const entityCirle = this._isSensing ? entity.sensingCircle : entity.circle;
      return Phaser.Geom.Intersects.CircleToCircle(this._player.circle, entityCirle);
    });

    if (intersectingEntity && !this._startedIntersecting) {
      console.log('entity started intersecting a player');
      this._startedIntersecting = true;
      this._player.setSensingEntity(intersectingEntity);
      this._onStartedIntersecting && this._onStartedIntersecting();
    }

    if (!intersectingEntity && this._startedIntersecting) {
      console.log('entity stopped intersecting a player');
      this._startedIntersecting = false;
      this._player.setSensingEntity(null);
      this._onEndedIntersecting && this._onEndedIntersecting();
    }
  }

  public resetIntersecting(): void {
    // and reset collisions/sensings
    this._startedIntersecting = false;
    if (this._isSensing) {
      this._player.setSensingEntity(null);
    } else {
      this._player.setCollidingEntity(null);
    }
  }
}
