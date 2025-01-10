export default class Score {
  constructor(ctx, scaleRatio, nickname) {
    this.ctx = ctx;
    this.scaleRatio = scaleRatio;
    this.nickname = nickname;
    this.score = 0;
    this.highScore = 0; // Initial high score set to zero
  }

  update(deltaTime) {
    this.score += deltaTime * 0.01;
  }

  incrementBy(value) {
    this.score += value;
  }

  reset() {
    this.score = 0;
  }

  async loadHighScore() {
    try {
      const response = await fetch(`https://675468d036bcd1eec851143c.mockapi.io/data/HighScore`);
      if (response.ok) {
        const data = await response.json();
        this.highScore = data.length > 0 ? data[0].score : 0;
      } else {
        console.warn("Failed to load high score:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to load high score:", error);
    }
  }

  async setHighScore() {
    if (this.score <= this.highScore) return; // Only update if current score is higher

    try {
      const response = await fetch(`https://675468d036bcd1eec851143c.mockapi.io/data/HighScore`);
      const data = await response.json();

      if (data.length > 0) {
        // Update existing high score
        await fetch(`https://675468d036bcd1eec851143c.mockapi.io/data/HighScore/${data[0].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score: Math.floor(this.score) }),
        });
      } else {
        // Create new high score record
        await fetch(`https://675468d036bcd1eec851143c.mockapi.io/data/HighScore`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score: Math.floor(this.score) }),
        });
      }

      this.highScore = this.score; // Update local high score
    } catch (error) {
      console.error("Failed to set high score:", error);
    }
  }

  draw() {
    const y = 30 * this.scaleRatio;
    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.fillStyle = "white";

    const scoreX = this.ctx.canvas.width - 100;
    const highScoreX = this.ctx.canvas.width - 200;

    const scoreText = `Score: ${Math.floor(this.score)}`;
    const highScoreText = `HI: ${this.highScore}`;

    this.ctx.fillText(scoreText, scoreX, y);
    this.ctx.fillText(highScoreText, highScoreX, y);
  }
}
