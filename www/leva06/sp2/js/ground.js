// Ground.js: Represents the snowy ground in the Kitten Jump Game
export default class Ground {
    constructor(ctx, width, height, speed, scaleRatio) {
      this.ctx = ctx;
      this.canvas = ctx.canvas;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.scaleRatio = scaleRatio;
  
      this.x = 0;
      this.y = this.canvas.height - this.height;
  
      this.groundImage = new Image();
      this.groundImage.src = "images/snow.png"; // Replace with your snowy ground image
    }
  
    update(gameSpeed, deltaTime) {
      this.x -= gameSpeed * deltaTime * this.speed * this.scaleRatio;
  
      // Reset the position for a seamless loop
      if (this.x < -this.width) {
        this.x = 0;
      }
    }
  
    draw() {
      // Draw the ground image twice for a seamless scrolling effect
      this.ctx.drawImage(
        this.groundImage,
        this.x,
        this.y,
        this.width,
        this.height
      );
  
      this.ctx.drawImage(
        this.groundImage,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      );
    }
  
    reset() {
      this.x = 0; // Reset ground position to the starting point
    }
  }
  