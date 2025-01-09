export default class Player {
  constructor(ctx, width, height, scaleRatio, jumpStrength, gravity) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.scaleRatio = scaleRatio;

    this.x = 50;
    this.y = this.canvas.height - this.height - 50;
    this.yStandingPosition = this.canvas.height - this.height - 50; // Sets the default position
    this.jumpVelocity = 0;
    this.isJumping = false;
    this.gravity = gravity;
    this.jumpStrength = jumpStrength;

    this.image = new Image();
    this.image.src = "images/kitten.png";
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = -this.jumpStrength; // Uses a fixed jump value
    }
  }

  update() {
    if (this.isJumping) {
      this.y += this.jumpVelocity;
      this.jumpVelocity += this.gravity;

      if (this.y >= this.yStandingPosition) {
        this.y = this.yStandingPosition;
        this.isJumping = false;
      }
    }
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  reset() {
    this.y = this.yStandingPosition; // Resets the player to the ground
    this.jumpVelocity = 0;           // Resets jump velocity
    this.isJumping = false;          // Cancels jump state
  }
}
