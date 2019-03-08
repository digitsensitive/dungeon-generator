/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Binary Tree: Node Data Config
 * @license      Digitsensitive
 */

export interface INodeDataConfig {
  position: { x: number; y: number };
  readonly NUM_TILES_WIDTH: number;
  readonly NUM_TILES_HEIGHT: number;
  room: Phaser.Geom.Rectangle;
}
