import * as Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import MainScene from './MainScene';

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
      debug: true,
      gravity: { y: 0 },
    },
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision',
      },
    ],
  },
};

const game = new Phaser.Game(gameConfig);
