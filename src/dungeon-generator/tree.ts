/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Dungeon Generator: Tree
 * @license      Digitsensitive
 */

import { ITreeConfig } from "../dungeon-generator/interfaces/tree-config.interface";
import { Node } from "./node";

export class Tree {
  private readonly MAP_WIDTH: number;
  private readonly MAP_HEIGHT: number;
  private readonly TILE_SIZE: number;
  private readonly NUM_TILES_WIDTH: number;
  private readonly NUM_TILES_HEIGHT: number;
  private readonly MIN_NODE_SIZE: number;
  private readonly MAX_NODE_SIZE: number;
  private readonly WIDTH_HEIGHT_RATIO: number;
  private readonly HEIGHT_WIDTH_RATIO: number;

  private iterations: number;
  public root: Node;
  public nodes: Node[];
  public roomArray: number[][];

  constructor(treeConfig: ITreeConfig) {
    // assign tree config values
    if (treeConfig.map.width % treeConfig.map.tileSize !== 0) {
      throw new RangeError("The width must be divisible by the tile size. ");
    } else {
      this.MAP_WIDTH = treeConfig.map.width;
    }

    if (treeConfig.map.height % treeConfig.map.tileSize !== 0) {
      throw new RangeError("The height must be divisible by the tile size. ");
    } else {
      this.MAP_HEIGHT = treeConfig.map.height;
    }

    this.TILE_SIZE = treeConfig.map.tileSize;
    this.NUM_TILES_WIDTH = this.MAP_WIDTH / this.TILE_SIZE;
    this.NUM_TILES_HEIGHT = this.MAP_HEIGHT / this.TILE_SIZE;
    this.MIN_NODE_SIZE = treeConfig.nodes.size.min;
    this.MAX_NODE_SIZE = treeConfig.nodes.size.max;
    this.iterations = treeConfig.properties.iterations || 1000;
    this.WIDTH_HEIGHT_RATIO = treeConfig.properties.widthHeightRatio;
    this.HEIGHT_WIDTH_RATIO = treeConfig.properties.heightWidthRatio;

    this.root = undefined;
    this.nodes = [];
    this.roomArray = [];
    for (let y = 0; y < this.NUM_TILES_HEIGHT; y++) {
      this.roomArray[y] = [];
      for (let x = 0; x < this.NUM_TILES_WIDTH; x++) {
        this.roomArray[y][x] = 0;
      }
    }

    this.generateNodes();
  }

  public generateNodes(): void {
    // create root node of the tree and push into nodes array
    this.root = new Node({
      parentNode: null,
      type: "ROOT",
      x: 0,
      y: 0,
      numTiledWidth: this.MAP_WIDTH / this.TILE_SIZE,
      numTiledHeight: this.MAP_HEIGHT / this.TILE_SIZE
    });
    this.nodes.push(this.root);

    // start dividing process
    let hasDivided = true;
    while (hasDivided) {
      hasDivided = false;
      for (let node of this.nodes) {
        if (
          node.children[0] === null &&
          node.children[1] === null &&
          this.iterations > 0
        ) {
          this.iterations--;
          // node has no children
          if (
            node.NUM_TILES_WIDTH > this.MAX_NODE_SIZE ||
            node.NUM_TILES_HEIGHT > this.MAX_NODE_SIZE
          ) {
            // start to divide the room
            if (this.doSplit(node)) {
              this.nodes.push(node.children[0]);
              this.nodes.push(node.children[1]);
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
      (splitHorizontal ? node.NUM_TILES_HEIGHT : node.NUM_TILES_WIDTH) -
      this.MIN_NODE_SIZE;

    // you have reached the minimum size, so do not split
    if (max <= this.MIN_NODE_SIZE) {
      return false;
    }

    // get a random position for the split depending on min and max
    let split = Phaser.Math.RND.between(this.MIN_NODE_SIZE, max);

    if (splitHorizontal) {
      // split horizontal
      node.children[0] = new Node({
        parentNode: node,
        type: "LEAF",
        x: node.POS_X,
        y: node.POS_Y,
        numTiledWidth: node.NUM_TILES_WIDTH,
        numTiledHeight: split
      });
      node.children[1] = new Node({
        parentNode: node,
        type: "LEAF",
        x: node.POS_X,
        y: node.POS_Y + split * this.TILE_SIZE,
        numTiledWidth: node.NUM_TILES_WIDTH,
        numTiledHeight: node.NUM_TILES_HEIGHT - split
      });
    } else {
      // split vertical
      node.children[0] = new Node({
        parentNode: node,
        type: "LEAF",
        x: node.POS_X,
        y: node.POS_Y,
        numTiledWidth: split,
        numTiledHeight: node.NUM_TILES_HEIGHT
      });
      node.children[1] = new Node({
        parentNode: node,
        type: "LEAF",
        x: node.POS_X + split * this.TILE_SIZE,
        y: node.POS_Y,
        numTiledWidth: node.NUM_TILES_WIDTH - split,
        numTiledHeight: node.NUM_TILES_HEIGHT
      });
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
      node.NUM_TILES_WIDTH > node.NUM_TILES_HEIGHT &&
      node.NUM_TILES_WIDTH / node.NUM_TILES_HEIGHT >= this.WIDTH_HEIGHT_RATIO
    ) {
      splitHorizontal = false;
    } else if (
      node.NUM_TILES_HEIGHT > node.NUM_TILES_WIDTH &&
      node.NUM_TILES_HEIGHT / node.NUM_TILES_WIDTH >= this.HEIGHT_WIDTH_RATIO
    ) {
      splitHorizontal = true;
    }

    return splitHorizontal;
  }

  private createRoom(node: Node): Phaser.Geom.Rectangle {
    let roomSize = new Phaser.Geom.Point(
      Phaser.Math.RND.between(this.MIN_NODE_SIZE, node.NUM_TILES_WIDTH - 4),
      Phaser.Math.RND.between(this.MIN_NODE_SIZE, node.NUM_TILES_HEIGHT - 4)
    );

    let roomPos = new Phaser.Geom.Point(
      Phaser.Math.RND.between(0, node.NUM_TILES_WIDTH - roomSize.x),
      Phaser.Math.RND.between(0, node.NUM_TILES_HEIGHT - roomSize.y)
    );

    return new Phaser.Geom.Rectangle(
      node.POS_X + roomPos.x * this.TILE_SIZE,
      node.POS_Y + roomPos.y * this.TILE_SIZE,
      roomSize.x * this.TILE_SIZE,
      roomSize.y * this.TILE_SIZE
    );
  }

  public getRoomArray(): number[][] {
    for (let node of this.nodes) {
      if (node.getRoom() !== undefined) {
        let room = node.getRoom();

        for (let y = 0; y < room.height / this.TILE_SIZE; y++) {
          for (let x = 0; x < room.width / this.TILE_SIZE; x++) {
            if (y === 0) {
              this.roomArray[room.y / this.TILE_SIZE + y][
                room.x / this.TILE_SIZE + x
              ] = Phaser.Math.RND.between(6, 11);
            } else if (y === room.height / this.TILE_SIZE - 1) {
              this.roomArray[room.y / this.TILE_SIZE + y][
                room.x / this.TILE_SIZE + x
              ] = Phaser.Math.RND.between(12, 17);
            } else if (x === 0) {
              this.roomArray[room.y / this.TILE_SIZE + y][
                room.x / this.TILE_SIZE + x
              ] = Phaser.Math.RND.between(18, 23);
            } else if (x === room.width / this.TILE_SIZE - 1) {
              this.roomArray[room.y / this.TILE_SIZE + y][
                room.x / this.TILE_SIZE + x
              ] = Phaser.Math.RND.between(24, 29);
            } else {
              // ground
              this.roomArray[room.y / this.TILE_SIZE + y][
                room.x / this.TILE_SIZE + x
              ] = Phaser.Math.RND.between(30, 35);
            }
          }
        }
      }
    }

    return this.roomArray;
  }
}
