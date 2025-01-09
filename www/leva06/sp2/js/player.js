// Player.js: Represents the kitten in the game
export default class Player {
    constructor(ctx, width, height, scaleRatio) {
      this.ctx = ctx;
      this.canvas = ctx.canvas;
      this.width = width;
      this.height = height;
      this.scaleRatio = scaleRatio;
  
      this.x = 50; // Initial X position
      this.y = this.canvas.height - this.height - 50; // Initial Y position
      this.yStandingPosition = this.y;
  
      this.jumpVelocity = 0;
      this.isJumping = false;
      this.gravity = 0.4;
      this.jumpStrength = 10;
  
      this.image = new Image();
      this.image.src = "images/kitten.png"; // Replace with your kitten image
    }
  
    jump() {
      if (!this.isJumping) {
        this.isJumping = true;
        this.jumpVelocity = -this.jumpStrength;
      }
    }
  
    update(deltaTime) {
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
  }
  