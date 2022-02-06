import Player from '../Sprites/Player';
import MatterEntity from '../Types/MatterEntity';

interface ICallback {
  (entity: MatterEntity): void;
}

// TODO: interface instead calling different methods and different circles
export default class ManageSensingIntersections {
  private _startedSensingIntersection: boolean;
  private _isSensing: boolean; // TODO: replacing intersectingEntity?
  private _sensingEntities: MatterEntity[];
  private _player: Player;
  private _onSensingStarted: ICallback;
  private _onSensingStopped: ICallback;

  constructor(
    player: Player,
    sensingEntities: MatterEntity[],
    onStartedIntersecting: ICallback = null,
    onEndedIntersecting: ICallback = null,
  ) {
    this._startedSensingIntersection = false;
    this._sensingEntities = sensingEntities;
    this._player = player;
    this._onSensingStarted = onStartedIntersecting;
    this._onSensingStopped = onEndedIntersecting;
  }

  public update(): void {
    const intersectingEntity = this._sensingEntities.find((entity) => {
      // needs to be done for each update since x and y are changing
      return Phaser.Geom.Intersects.CircleToCircle(this._player.sensingCircle, entity.sensingCircle);
    });

    if (intersectingEntity && !this._startedSensingIntersection) {
      console.log('entity started intersecting a player');
      this._startedSensingIntersection = true;
      this._onSensingStarted && this._onSensingStarted(intersectingEntity);
      this._player.setSensingEntity(intersectingEntity, this._sensingEntities);
      console.log('setEntity called: ', intersectingEntity);
    }

    if (!intersectingEntity && this._startedSensingIntersection) {
      console.log('entity stopped intersecting a player');
      this._startedSensingIntersection = false;
      this._onSensingStopped && this._onSensingStopped(intersectingEntity);
      this._player.setSensingEntity(null, null);
      console.log('setEntity called: ', null);
    }
  }

  public resetSensingIntersection(): void {
    // and reset collisions/sensings
    this._startedSensingIntersection = false;
    this._player.setSensingEntity(null, null);
  }
}
