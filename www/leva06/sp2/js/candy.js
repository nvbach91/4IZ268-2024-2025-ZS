export default class Candy {
    constructor(ctx, x, y, width, height, imageSrc) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  
      this.image = new Image();
      this.image.src = imageSrc; // Candy image source
    }
  
    update(speed, deltaTime) {
      // Move the candy to the left
      this.x -= speed * deltaTime;
  
      // Remove candy if it goes off the screen
      if (this.x + this.width < 0) {
        this.x = this.ctx.canvas.width;
        this.y = Math.random() * (this.ctx.canvas.height - 150); // Random Y position
      }
    }
  
    draw() {
      // Draw the candy on the canvas
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
    collideWith(player) {
      // Check if the player collects the candy
      return (
        player.x < this.x + this.width &&
        player.x + player.width > this.x &&
        player.y < this.y + this.height &&
        player.y + player.height > this.y
      );
    }
  }
  