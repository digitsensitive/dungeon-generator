/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Dungeon Generator: Node Config
 * @license      Digitsensitive
 */

import { Node } from "../node";

export interface INodeConfig {
  parentNode: Node;
  type: string;
  x: number;
  y: number;
  numTiledWidth: number;
  numTiledHeight: number;
}
