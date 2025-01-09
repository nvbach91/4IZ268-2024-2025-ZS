// Tree.js: Represents the tree obstacle in the Kitten Jump Game
export default class Tree {
    constructor(ctx, x, y, width, height, imageSrc) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  
      this.image = new Image();
      this.image.src = imageSrc; // Tree image source
    }
  
    update(speed, deltaTime) {
      // Move the tree to the left
      this.x -= speed * deltaTime;
  
      // Reset the tree's position when it moves off-screen
      if (this.x + this.width < 0) {
        this.x = this.ctx.canvas.width;
      }
    }
  
    draw() {
      // Draw the tree on the canvas
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
    collideWith(player) {
      // Precise collision detection: Player must be on the ground
      return (
        player.y >= player.yStandingPosition && // Ensure player is on the ground
        player.x < this.x + this.width &&
        player.x + player.width > this.x &&
        player.y < this.y + this.height &&
        player.y + player.height > this.y
      );
    }
  }
  