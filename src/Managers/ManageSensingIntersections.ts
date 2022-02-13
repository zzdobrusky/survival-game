import Player from '../Sprites/Player';
import MatterEntity from '../Types/MatterEntity';

interface ICallback {
  (entity: MatterEntity): void;
}

// TODO: interface instead calling different methods and different circles
export default class ManageSensingIntersections {
  private _startedSensingIntersection: boolean;
  private _sensingEntity: MatterEntity;
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
    this._sensingEntity = null;
    this._sensingEntities = sensingEntities;
    this._player = player;
    this._onSensingStarted = onStartedIntersecting;
    this._onSensingStopped = onEndedIntersecting;
  }

  public update(): void {
    const beforeStoppedSensingEntity = this._sensingEntity;
    const sensingEntity = this._sensingEntities.find((entity) => {
      // needs to be done for each update since x and y are changing
      return Phaser.Geom.Intersects.CircleToCircle(this._player.sensingCircle, entity.sensingCircle);
    });

    if (sensingEntity && !this._startedSensingIntersection) {
      console.log('onSensingStarted() sensingEntity: ', sensingEntity);
      this._sensingEntity = sensingEntity;
      this._startedSensingIntersection = true;
      this._onSensingStarted && this._onSensingStarted(sensingEntity);
      this._player.setSensingEntity(sensingEntity, this._sensingEntities);
    } else if (!sensingEntity && this._startedSensingIntersection) {
      console.log('onSensingStopped() beforeStoppedSensingEntity: ', beforeStoppedSensingEntity);

      this._sensingEntity = null;
      this._startedSensingIntersection = false;
      this._onSensingStopped && this._onSensingStopped(beforeStoppedSensingEntity);
      this._player.setSensingEntity(null, null);
    }
  }

  public resetSensingIntersection(): void {
    // and reset collisions/sensings
    this._startedSensingIntersection = false;
    this._player.setSensingEntity(null, null);
  }
}
