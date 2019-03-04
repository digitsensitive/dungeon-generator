/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  BSP Trees
 * @license      Digitsensitive
 */

import { Player } from "../objects/player";
import { Tree } from "../binary-tree/tree";

export class GameScene extends Phaser.Scene {
  private tilemap: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.StaticTilemapLayer;
  private treeInstance: Tree;
  private player: Player;

  private gfx: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(): void {
    this.treeInstance = new Tree({
      map: {
        width: this.game.canvas.width,
        height: this.game.canvas.height,
        tileSize: 8
      },
      nodes: { size: { min: 10, max: 20 } },
      properties: {
        widthHeightRatio: 0.5,
        heightWidthRatio: 0.5
      }
    });
  }

  preload(): void {
    this.load.pack("bspTreesPack", "./src/assets/pack.json", "bspTreesPack");
  }

  create(): void {
    const TilemapConfig = {
      key: "randomMap",
      data: this.treeInstance.getRoomArray(),
      tileWidth: 8,
      tileHeight: 8,
      width: 3,
      height: 3,
      insertNull: false
    };

    this.tilemap = this.make.tilemap(TilemapConfig);
    this.tileset = this.tilemap.addTilesetImage("tiles");
    this.layer = this.tilemap.createStaticLayer(0, this.tileset, 0, 0);
    this.layer.setCollisionBetween(6, 29, true);

    this.player = new Player({
      scene: this,
      x: 24,
      y: 24,
      key: "player"
    });

    this.physics.add.collider(this.player, this.layer);

    // *****************************************************************
    // CAMERA
    // *****************************************************************
    this.cameras.main.startFollow(this.player);

    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );
    this.cameras.main.setZoom(4);

    /*this.gfx = this.add.graphics({
      lineStyle: { width: 1, color: 0x00ff00 },
      fillStyle: { color: 0xff0000, alpha: 0.2 }
    });
    for (let l of this.treeInstance.nodes) {
      this.gfx.strokeRectShape(
        new Phaser.Geom.Rectangle(
          l.POS_X,
          l.POS_Y,
          l.NUM_TILES_WIDTH * 8,
          l.NUM_TILES_HEIGHT * 8
        )
      );
      if (l.getRoom() !== undefined) {
        this.gfx.fillRectShape(
          new Phaser.Geom.Rectangle(
            l.getRoom().x,
            l.getRoom().y,
            l.getRoom().width,
            l.getRoom().height
          )
        );
      }
    }*/
  }

  update(): void {
    this.player.update();
  }
}
