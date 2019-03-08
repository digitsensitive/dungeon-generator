/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Binary Tree: Node
 * @license      Digitsensitive
 */

import { INodeDataConfig } from "../binary-tree/interfaces/node-data-config.interface";
import { INodeConfig } from "../binary-tree/interfaces/node-config.interface";

export class Node {
  private children: [Node, Node];
  private nodeType: string;
  private parent: Node;
  private data: INodeDataConfig;

  constructor(nodeConfig: INodeConfig) {
    // set base node data
    this.children = [null, null];
    this.nodeType = nodeConfig.type;
    this.parent = nodeConfig.parentNode;

    // set node data
    this.data = {
      position: { x: nodeConfig.x, y: nodeConfig.y },
      NUM_TILES_WIDTH: nodeConfig.numTiledWidth,
      NUM_TILES_HEIGHT: nodeConfig.numTiledHeight,
      room: undefined
    };
  }

  public getLeftChild(): Node {
    return this.children[0];
  }

  public setLeftChild(newLeftChild: Node): void {
    this.children[0] = newLeftChild;
  }

  public getRightChild(): Node {
    return this.children[1];
  }

  public setRightChild(newRightChild: Node): void {
    this.children[1] = newRightChild;
  }

  public setType(type: string): void {
    this.nodeType = type;
  }

  public getType(): string {
    return this.nodeType;
  }

  public setParent(newParent: Node): void {
    this.parent = newParent;
  }

  public getParent(): Node {
    return this.parent;
  }

  public setRoom(room: Phaser.Geom.Rectangle): void {
    this.data.room = room;
  }

  public getRoom(): Phaser.Geom.Rectangle {
    return this.data.room;
  }

  public getData(): INodeDataConfig {
    return this.data;
  }
}
