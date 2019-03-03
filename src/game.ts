/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  BSP Trees
 * @license      Digitsensitive
 */

import "phaser";
import { GameScene } from "./scenes/game-scene";

const config: GameConfig = {
  title: "BSP Trees",
  url: "https://github.com/digitsensitive/phaser3-typescript",
  version: "1.0",
  scale: {
    width: 800,
    height: 600,
    zoom: 1,
    parent: "game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  type: Phaser.AUTO,
  parent: "game",
  scene: [GameScene],
  input: {
    keyboard: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  backgroundColor: "#d0c4ad",
  render: { pixelArt: true, antialias: false }
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  var game = new Game(config);
});
