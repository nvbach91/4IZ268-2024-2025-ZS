export default class Tree {
  constructor(ctx, x, y, width, height, image) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.image = new Image();
    this.image.src = image; // Tree image
  }

  update(speed, deltaTime) {
    this.x -= speed * deltaTime;

    // If the tree goes off the screen, reset it with a larger gap
    if (this.x + this.width < 0) {
      this.x = this.ctx.canvas.width + Math.random() * 300 + 200; // Increased gap between trees
    }
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collideWith(player) {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }

  reset() {
    this.x = this.startingX; // Resets the tree position
  }
}
