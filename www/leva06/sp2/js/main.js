import Player from "./player.js";
import Ground from "./ground.js";
import Tree from "./tree.js";
import Candy from "./candy.js";
import Score from "./score.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GAME_SPEED_START = 1;
const CANDY_COUNT = 3; // Number of candies on screen
const CANDY_IMAGE_SRC = "images/candy.png";
const PLAYER_JUMP_STRENGTH = -12; // Fixed jump strength
const PLAYER_GRAVITY = 0.5; // Fixed gravity
const API_URL = "https://675468d036bcd1eec851143c.mockapi.io/scores/Scores";

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Game Variables
let gameSpeed = GAME_SPEED_START;
let player = null;
let ground = null;
let tree = null;
let candies = [];
let score = null;
let backgroundImage = null;
let gameOver = false;
let waitingToStart = true;
let previousTime = null;


// Initialize Game Objects
async function initializeGame() {
  const scaleRatio = 1;

  player = new Player(ctx, 50, 50, scaleRatio, PLAYER_JUMP_STRENGTH, PLAYER_GRAVITY); // Kitten
  ground = new Ground(ctx, GAME_WIDTH, 50, 2, scaleRatio); // Snowy ground
  tree = new Tree(ctx, GAME_WIDTH, GAME_HEIGHT - 100, 50, 100, "images/tree.png"); // Tree obstacle
  score = new Score(ctx, scaleRatio); // Score tracker

  backgroundImage = new Image();
  backgroundImage.src = "images/sky.png"; // Background image

  initializeCandies();

  // Load high scores at start
  const highScores = await loadHighScores();
  console.log("Loaded high scores:", highScores);
}

function initializeCandies() {
  for (let i = 0; i < CANDY_COUNT; i++) {
    const candy = new Candy(
      ctx,
      GAME_WIDTH + i * 200, // Spaced out along X
      GAME_HEIGHT - 130, // Place candies near the ground, above the trees
      30, // Candy width
      30, // Candy height
      CANDY_IMAGE_SRC
    );
    candies.push(candy);
  }
}

// Game Loop
function gameLoop(currentTime) {
  if (!previousTime) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (waitingToStart) {
    // Display black screen with Merry Christmas message
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("MERRY CHRISTMAS", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
    ctx.fillText("PRESS SPACE TO START", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);
  } else if (!gameOver) {
    ctx.drawImage(backgroundImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);

    player.update(deltaTime);
    ground.update(gameSpeed, deltaTime);
    tree.update(gameSpeed, deltaTime);

    // Update and draw candies
    candies.forEach((candy) => {
      candy.update(gameSpeed, deltaTime);
      candy.draw();

      // Check for candy collection
      if (candy.collideWith(player)) {
        score.incrementBy(10); // Add 10 to score
        candy.x = canvas.width; // Reset candy position
        candy.y = GAME_HEIGHT - 130; // Keep candies near the ground
      }
    });

    score.update(deltaTime);

    if (tree.collideWith(player)) {
      gameOver = true;
      saveScoreToServer(score.currentScore); // Save score to server
      score.setHighScore();
    }

    player.draw();
    ground.draw();
    tree.draw();
    score.draw();
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Game Over! Press R to Restart", GAME_WIDTH / 2, GAME_HEIGHT / 2);
  }

  requestAnimationFrame(gameLoop);
}

// Restart Game
function restartGame() {
  if (gameOver) {
    gameOver = false;
    gameSpeed = GAME_SPEED_START;
    candies = [];
    initializeGame();
    previousTime = null;
    requestAnimationFrame(gameLoop);
  }
}

async function saveScoreToServer(score) {
  const timestamp = new Date().toISOString();
  console.log("Sending score to API:", { score, timestamp });
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score,
        timestamp,
        gameInfo: { level: 1, player: "Kitten" },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Score saved successfully!", data);
    } else {
      console.error("Failed to save score:", response.statusText);
    }
  } catch (error) {
    console.error("Error saving score:", error);
  }
}

// Load High Scores
async function loadHighScores() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const scores = await response.json();
      return scores;
    } else {
      console.error("Failed to load scores:", response.statusText);
    }
  } catch (error) {
    console.error("Error loading scores:", error);
  }
}

// Display Loader
function displayLoader(show) {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = show ? "block" : "none";
}

// Event Listeners
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (waitingToStart) {
      waitingToStart = false;
    } else if (!gameOver) {
      player.jump();
    }
  }
  if (e.code === "KeyR" && gameOver) {
    restartGame();
  }
});

// Initialize and Start the Game
initializeGame();
requestAnimationFrame(gameLoop);
