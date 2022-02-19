import * as Phaser from 'phaser';
import MainScene from './Scenes/MainScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  width: 512,
  height: 512,
  backgroundColor: '#333333',
  type: Phaser.AUTO,
  parent: 'survival-game',
  scene: [MainScene],
  scale: {
    zoom: 2,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: { y: 0 },
    },
  },
};

new Phaser.Game(gameConfig);
