// Score.js: Manages the score and high score in the Kitten Jump Game
export default class Score {
    score = 0;
    HIGH_SCORE_KEY = "highScore";
  
    constructor(ctx, scaleRatio) {
      this.ctx = ctx;
      this.canvas = ctx.canvas;
      this.scaleRatio = scaleRatio;
    }
  
    update(deltaTime) {
      this.score += deltaTime * 0.01; // Increment score based on time
    }

    incrementBy(value) {
        this.score += value; // Add value (e.g., +10 for candy)
    }
  
    reset() {
      this.score = 0; // Reset the score to zero
    }
  
    setHighScore() {
      const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY)) || 0;
      if (this.score > highScore) {
        localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
      }
    }
  
    draw() {
      const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY)) || 0;
      const y = 30 * this.scaleRatio;
  
      const fontSize = 20 * this.scaleRatio;
      this.ctx.font = `${fontSize}px Arial`;
      this.ctx.fillStyle = "white";
  
      const scoreX = this.canvas.width - 100;
      const highScoreX = this.canvas.width - 200;
  
      const scoreText = `Score: ${Math.floor(this.score)}`;
      const highScoreText = `HI: ${highScore}`;
  
      this.ctx.fillText(scoreText, scoreX, y);
      this.ctx.fillText(highScoreText, highScoreX, y);
    }
  }  
