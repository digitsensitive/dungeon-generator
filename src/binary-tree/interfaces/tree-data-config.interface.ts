/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Binary Tree: Tree Data Config
 * @license      Digitsensitive
 */

export interface ITreeDataConfig {
  readonly MAP_WIDTH: number;
  readonly MAP_HEIGHT: number;
  readonly TILE_SIZE: number;
  readonly NUM_TILES_WIDTH: number;
  readonly NUM_TILES_HEIGHT: number;
  readonly MIN_NODE_SIZE: number;
  readonly MAX_NODE_SIZE: number;
  readonly WIDTH_HEIGHT_RATIO: number;
  readonly HEIGHT_WIDTH_RATIO: number;
  roomArray: number[][];
  iterations: number;
}
