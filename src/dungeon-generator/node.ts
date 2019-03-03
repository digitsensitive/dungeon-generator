/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Dungeon Generator: Node
 * @license      Digitsensitive
 */

import { INodeConfig } from "../dungeon-generator/interfaces/node-config.interface";

export class Node {
  readonly POS_X: number;
  readonly POS_Y: number;
  readonly NUM_TILES_WIDTH: number;
  readonly NUM_TILES_HEIGHT: number;

  private type: string;
  public children: [Node, Node];
  public parent: Node;
  private room: Phaser.Geom.Rectangle;

  constructor(nodeConfig: INodeConfig) {
    this.POS_X = nodeConfig.x;
    this.POS_Y = nodeConfig.y;
    this.NUM_TILES_WIDTH = nodeConfig.numTiledWidth;
    this.NUM_TILES_HEIGHT = nodeConfig.numTiledHeight;

    this.type = nodeConfig.type;
    this.children = [null, null];
    this.parent = nodeConfig.parentNode;
    this.room = undefined;
  }

  public setType(type: string): void {
    this.type = type;
  }

  public getType(): string {
    return this.type;
  }

  public setRoom(room: Phaser.Geom.Rectangle): void {
    this.room = room;
  }

  public getRoom(): Phaser.Geom.Rectangle {
    return this.room;
  }
}
