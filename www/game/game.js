const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const playerNameInput = document.getElementById('player-name');
const landing = document.getElementById('landing');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerName = '';
let gameInterval;
let asteroids = [];
let bullets = [];
let score = 0;
let highScore = 0;
let player = { x: canvas.width / 2, y: canvas.height / 2, dx: 0, dy: 0, size: 20 };

const keys = {};

// Load high score
async function loadHighScore() {
  try {
    const response = await fetch('highscores.json');
    const data = await response.json();
    highScore = data.highScore || 0;
  } catch (err) {
    console.error('Failed to load high score:', err);
  }
}

// Save high score
async function saveHighScore() {
  try {
    await fetch('highscores.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ highScore }),
    });
  } catch (err) {
    console.error('Failed to save high score:', err);
  }
}

// Start game
function startGame() {
  playerName = playerNameInput.value.trim() || 'Player';
  landing.style.display = 'none';
  canvas.style.display = 'block';
  resetGame();
  gameInterval = setInterval(gameLoop, 1000 / 60);
  spawnAsteroids();
}

// Reset game
function resetGame() {
  score = 0;
  asteroids = [];
  bullets = [];
  player = { x: canvas.width / 2, y: canvas.height / 2, dx: 0, dy: 0, size: 20 };
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  drawPlayer();

  moveBullets();
  drawBullets();

  moveAsteroids();
  drawAsteroids();

  checkCollisions();
  drawScore();

  score += 1 / 60;
}

// Move player
function movePlayer() {
  if (keys['ArrowUp']) player.dy = -3;
  if (keys['ArrowDown']) player.dy = 3;
  if (keys['ArrowLeft']) player.dx = -3;
  if (keys['ArrowRight']) player.dx = 3;

  player.x += player.dx;
  player.y += player.dy;

  player.dx *= 0.9;
  player.dy *= 0.9;

  // Boundaries
  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x > canvas.width) player.x = canvas.width;
  if (player.y > canvas.height) player.y = canvas.height;
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

// Move bullets
function moveBullets() {
  bullets = bullets.filter((bullet) => bullet.x > 0 && bullet.x < canvas.width && bullet.y > 0 && bullet.y < canvas.height);

  for (const bullet of bullets) {
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
  }
}

// Draw bullets
function drawBullets() {
  ctx.fillStyle = 'red';
  for (const bullet of bullets) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Move asteroids
function moveAsteroids() {
  for (const asteroid of asteroids) {
    asteroid.x += asteroid.dx;
    asteroid.y += asteroid.dy;
  }
}

// Draw asteroids
function drawAsteroids() {
  ctx.fillStyle = 'gray';
  for (const asteroid of asteroids) {
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Check collisions
function checkCollisions() {
  for (const asteroid of asteroids) {
    const dist = Math.hypot(player.x - asteroid.x, player.y - asteroid.y);
    if (dist < player.size + asteroid.size) {
      gameOver();
      return;
    }

    bullets = bullets.filter((bullet) => {
      const dist = Math.hypot(bullet.x - asteroid.x, bullet.y - asteroid.y);
      if (dist < asteroid.size + 5) {
        score += 5;
        return false;
      }
      return true;
    });
  }
}

// Draw score
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${Math.floor(score)}`, 20, 40);
  ctx.fillText(`High Score: ${Math.floor(highScore)}`, 20, 70);
}

// Game over
function gameOver() {
  clearInterval(gameInterval);
  if (score > highScore) {
    highScore = score;
    saveHighScore();
  }
  alert(`Game Over! Final Score: ${Math.floor(score)}`);
  startGame();
}

// Spawn asteroids
function spawnAsteroids() {
  setInterval(() => {
    const size = Math.random() * 30 + 10;
    const x = Math.random() > 0.5 ? 0 : canvas.width;
    const y = Math.random() * canvas.height;
    const dx = Math.random() * 4 - 2;
    const dy = Math.random() * 4 - 2;
    asteroids.push({ x, y, dx, dy, size });
  }, 3000);
}

// Handle key events
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === ' ') {
    bullets.push({ x: player.x, y: player.y, dx: 10 * player.dx, dy: 10 * player.dy });
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

startButton.addEventListener('click', startGame);

loadHighScore();
