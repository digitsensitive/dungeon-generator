/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Dungeon Generator: Tree Config
 * @license      Digitsensitive
 */

export interface ITreeConfig {
  map: { width: number; height: number; tileSize: number };
  nodes: {
    size: { min: number; max: number };
  };
  properties: {
    iterations?: number;
    widthHeightRatio: number;
    heightWidthRatio: number;
  };
}
