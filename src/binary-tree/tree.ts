/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Binary Tree: Tree
 * @license      Digitsensitive
 */

import { ITreeConfig } from "../binary-tree/interfaces/tree-config.interface";
import { ITreeDataConfig } from "../binary-tree/interfaces/tree-data-config.interface";
import { Node } from "./node";

export class Tree {
  private nodes: Node[];
  private root: Node;
  private data: ITreeDataConfig;

  constructor(treeConfig: ITreeConfig) {
    // set base tree data
    this.nodes = [];
    this.root = undefined;

    // check for range errors
    if (treeConfig.map.width % treeConfig.map.tileSize !== 0) {
      throw new RangeError("The width must be divisible by the tile size. ");
    }
    if (treeConfig.map.height % treeConfig.map.tileSize !== 0) {
      throw new RangeError("The height must be divisible by the tile size. ");
    }

    // set tree data
    this.data = {
      MAP_WIDTH: treeConfig.map.width,
      MAP_HEIGHT: treeConfig.map.height,
      TILE_SIZE: treeConfig.map.tileSize,
      NUM_TILES_WIDTH: treeConfig.map.width / treeConfig.map.tileSize,
      NUM_TILES_HEIGHT: treeConfig.map.height / treeConfig.map.tileSize,
      MIN_NODE_SIZE: treeConfig.nodes.size.min,
      MAX_NODE_SIZE: treeConfig.nodes.size.max,
      WIDTH_HEIGHT_RATIO: treeConfig.properties.widthHeightRatio,
      HEIGHT_WIDTH_RATIO: treeConfig.properties.heightWidthRatio,
      roomArray: [],
      iterations: treeConfig.properties.iterations || 1000
    };

    this.initEmptyRoomArray();
    this.generateNodes();
  }

  /**
   * Function to create empty room array.
   */
  private initEmptyRoomArray(): void {
    for (let y = 0; y < this.data.NUM_TILES_HEIGHT; y++) {
      this.data.roomArray[y] = [];
      for (let x = 0; x < this.data.NUM_TILES_WIDTH; x++) {
        this.data.roomArray[y][x] = 0;
      }
    }
  }

  public generateNodes(): void {
    // create root node of the tree and push into nodes array
    this.root = new Node({
      parentNode: null,
      type: "ROOT",
      x: 0,
      y: 0,
      numTiledWidth: this.data.MAP_WIDTH / this.data.TILE_SIZE,
      numTiledHeight: this.data.MAP_HEIGHT / this.data.TILE_SIZE
    });
    this.nodes.push(this.root);

    // start dividing process
    let hasDivided = true;
    while (hasDivided) {
      hasDivided = false;
      for (let node of this.nodes) {
        if (
          node.getLeftChild() === null &&
          node.getRightChild() === null &&
          this.data.iterations > 0
        ) {
          this.data.iterations--;
          // node has no children
          if (
            node.getData().NUM_TILES_WIDTH > this.data.MAX_NODE_SIZE ||
            node.getData().NUM_TILES_HEIGHT > this.data.MAX_NODE_SIZE
          ) {
            // start to divide the room
            if (this.doSplit(node)) {
              this.nodes.push(node.getLeftChild());
              this.nodes.push(node.getRightChild());
              hasDivided = true;
            }
          }
          // do not divide, because node too small
        }
        // node has children, continue
      }
    }

    for (let node of this.nodes) {
      if (node.getType() === "LEAF") {
        node.setRoom(this.createRoom(node));
      }
    }
  }

  /**
   * Function that splits into two sub-dungeons.
   * @param  node [the dungeon to split]
   * @return      [boolean if split was successfull]
   */
  private doSplit(node: Node): boolean {
    // get random split horizontal or vertical
    let splitHorizontal = this.getRandomSplit(node);

    // get max size depending on the split
    let max: number =
      (splitHorizontal
        ? node.getData().NUM_TILES_HEIGHT
        : node.getData().NUM_TILES_WIDTH) - this.data.MIN_NODE_SIZE;

    // you have reached the minimum size, so do not split
    if (max <= this.data.MIN_NODE_SIZE) {
      return false;
    }

    // get a random position for the split depending on min and max
    let split = Phaser.Math.RND.between(this.data.MIN_NODE_SIZE, max);

    if (splitHorizontal) {
      // split horizontal
      node.setLeftChild(
        new Node({
          parentNode: node,
          type: "LEAF",
          x: node.getData().position.x,
          y: node.getData().position.y,
          numTiledWidth: node.getData().NUM_TILES_WIDTH,
          numTiledHeight: split
        })
      );
      node.setRightChild(
        new Node({
          parentNode: node,
          type: "LEAF",
          x: node.getData().position.x,
          y: node.getData().position.y + split * this.data.TILE_SIZE,
          numTiledWidth: node.getData().NUM_TILES_WIDTH,
          numTiledHeight: node.getData().NUM_TILES_HEIGHT - split
        })
      );
    } else {
      // split vertical
      node.setLeftChild(
        new Node({
          parentNode: node,
          type: "LEAF",
          x: node.getData().position.x,
          y: node.getData().position.y,
          numTiledWidth: split,
          numTiledHeight: node.getData().NUM_TILES_HEIGHT
        })
      );
      node.setRightChild(
        new Node({
          parentNode: node,
          type: "LEAF",
          x: node.getData().position.x + split * this.data.TILE_SIZE,
          y: node.getData().position.y,
          numTiledWidth: node.getData().NUM_TILES_WIDTH - split,
          numTiledHeight: node.getData().NUM_TILES_HEIGHT
        })
      );
    }

    // parent node is now a sibling
    if (node.getType() !== "ROOT") {
      node.setType("SIBLING");
    }

    return true;
  }

  /**
   * Function to return kind of split.
   * @param  node [the node to split]
   * @return      [the kind of split to apply]
   */
  private getRandomSplit(node: Node): boolean {
    let splitHorizontal: boolean = Math.random() >= 0.5;

    if (
      node.getData().NUM_TILES_WIDTH > node.getData().NUM_TILES_HEIGHT &&
      node.getData().NUM_TILES_WIDTH / node.getData().NUM_TILES_HEIGHT >=
        this.data.WIDTH_HEIGHT_RATIO
    ) {
      splitHorizontal = false;
    } else if (
      node.getData().NUM_TILES_HEIGHT > node.getData().NUM_TILES_WIDTH &&
      node.getData().NUM_TILES_HEIGHT / node.getData().NUM_TILES_WIDTH >=
        this.data.HEIGHT_WIDTH_RATIO
    ) {
      splitHorizontal = true;
    }

    return splitHorizontal;
  }

  private createRoom(node: Node): Phaser.Geom.Rectangle {
    let roomSize = new Phaser.Geom.Point(
      Phaser.Math.RND.between(
        this.data.MIN_NODE_SIZE,
        node.getData().NUM_TILES_WIDTH - 4
      ),
      Phaser.Math.RND.between(
        this.data.MIN_NODE_SIZE,
        node.getData().NUM_TILES_HEIGHT - 4
      )
    );

    let roomPos = new Phaser.Geom.Point(
      Phaser.Math.RND.between(0, node.getData().NUM_TILES_WIDTH - roomSize.x),
      Phaser.Math.RND.between(0, node.getData().NUM_TILES_HEIGHT - roomSize.y)
    );

    return new Phaser.Geom.Rectangle(
      node.getData().position.x + roomPos.x * this.data.TILE_SIZE,
      node.getData().position.y + roomPos.y * this.data.TILE_SIZE,
      roomSize.x * this.data.TILE_SIZE,
      roomSize.y * this.data.TILE_SIZE
    );
  }

  public getRoomArray(): number[][] {
    for (let node of this.nodes) {
      if (node.getRoom() !== undefined) {
        let room = node.getRoom();

        for (let y = 0; y < room.height / this.data.TILE_SIZE; y++) {
          for (let x = 0; x < room.width / this.data.TILE_SIZE; x++) {
            if (y === 0) {
              this.data.roomArray[room.y / this.data.TILE_SIZE + y][
                room.x / this.data.TILE_SIZE + x
              ] = Phaser.Math.RND.between(6, 11);
            } else if (y === room.height / this.data.TILE_SIZE - 1) {
              this.data.roomArray[room.y / this.data.TILE_SIZE + y][
                room.x / this.data.TILE_SIZE + x
              ] = Phaser.Math.RND.between(12, 17);
            } else if (x === 0) {
              this.data.roomArray[room.y / this.data.TILE_SIZE + y][
                room.x / this.data.TILE_SIZE + x
              ] = Phaser.Math.RND.between(18, 23);
            } else if (x === room.width / this.data.TILE_SIZE - 1) {
              this.data.roomArray[room.y / this.data.TILE_SIZE + y][
                room.x / this.data.TILE_SIZE + x
              ] = Phaser.Math.RND.between(24, 29);
            } else {
              // ground
              this.data.roomArray[room.y / this.data.TILE_SIZE + y][
                room.x / this.data.TILE_SIZE + x
              ] = Phaser.Math.RND.between(30, 35);
            }
          }
        }
      }
    }

    return this.data.roomArray;
  }

  /**
   * This functions compares two nodes: Returns true if the two nodes are equal.
   * @param  node1 [The first node to compare]
   * @param  node2 [The second node to compare]
   * @return       [boolean]
   */
  private comparator(node1: Node, node2: Node): boolean {
    if (
      node1.getParent() === node2.getParent() &&
      node1.getType() === node2.getType() &&
      node1.getLeftChild() === node2.getLeftChild() &&
      node1.getRightChild() === node2.getRightChild()
    ) {
      return true;
    } else {
      return false;
    }
  }
}
