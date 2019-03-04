/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Binary Tree: Binary Tree Data Config
 * @license      Digitsensitive
 */

export interface IBinaryTreeDataConfig {
  position: { x: number; y: number };
  num_tiles_width: number;
  num_tiles_height: number;
  room: Phaser.Geom.Rectangle;
}
