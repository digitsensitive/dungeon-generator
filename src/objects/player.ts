/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 digitsensitive
 * @description  BSP Trees: Player
 * @license      Digitsensitive
 */

export class Player extends Phaser.GameObjects.Sprite {
  private cursors: Phaser.Input.Keyboard.CursorKeys;
  private walkingSpeed: number;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.initVariables();
    this.initSprite();
    this.initInput();

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.walkingSpeed = 20;
  }

  private initSprite(): void {
    this.setOrigin(0, 0);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update(): void {
    this.handleInput();
  }

  private handleInput(): void {
    if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.walkingSpeed);
      this.setFlipX(false);
    } else if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.walkingSpeed);
      this.setFlipX(true);
    } else {
      this.body.setVelocityX(0);
    }
    if (this.cursors.up.isDown) {
      this.body.setVelocityY(-this.walkingSpeed);
    } else if (this.cursors.down.isDown) {
      this.body.setVelocityY(this.walkingSpeed);
    } else {
      this.body.setVelocityY(0);
    }
  }
}
