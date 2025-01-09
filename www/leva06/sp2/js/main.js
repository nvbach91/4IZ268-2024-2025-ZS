import Player from "./player.js";
import Ground from "./ground.js";
import Tree from "./tree.js";
import Candy from "./candy.js";
import Score from "./score.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const nicknameForm = document.getElementById("nickname-form");
const nicknameInput = document.getElementById("nickname-input");

// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GAME_SPEED_START = 0.5;
const CANDY_COUNT = 3;
const TREE_COUNT = 3;
const CANDY_IMAGE_SRC = "images/candy.png";
const PLAYER_JUMP_STRENGTH = 12;
const PLAYER_GRAVITY = 0.5;
const API_URL = "https://675468d036bcd1eec851143c.mockapi.io/scores/Scores";

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Game Variables
let player = null;
let ground = null;
let trees = [];
let candies = [];
let score = null;
let backgroundImage = null;
let gameOver = false;
let waitingToStart = true;
let previousTime = null;
let nickname = "";
let gameSpeed = GAME_SPEED_START; 
let gameLoopHandle = null; 
let highScoresLoaded = false; 

// Initialize Game Objects
function initializeGame() {
  const scaleRatio = 1;

  player = new Player(ctx, 50, 50, scaleRatio, PLAYER_JUMP_STRENGTH, PLAYER_GRAVITY);
  ground = new Ground(ctx, GAME_WIDTH, 50, 2, scaleRatio);

  initializeTrees();
  initializeCandies();

  score = new Score(ctx, scaleRatio);

  backgroundImage = new Image();
  backgroundImage.src = "images/sky.png";

  if (!highScoresLoaded) {
    loadHighScores();
    highScoresLoaded = true;
  }
}

function initializeTrees() {
  trees = [];
  let previousX = GAME_WIDTH;

  for (let i = 0; i < TREE_COUNT; i++) {
    const minDistance = 500;
    const maxDistance = 1200;

    const randomDistance = Math.random() * (maxDistance - minDistance) + minDistance;
    const newTreeX = previousX + randomDistance;

    const newTree = new Tree(ctx, newTreeX, GAME_HEIGHT - 100, 50, 100, "images/tree.png");
    trees.push(newTree);

    previousX = newTreeX;
  }
}

function initializeCandies() {
  candies = [];
  for (let i = 0; i < CANDY_COUNT; i++) {
    const candy = new Candy(
      ctx,
      GAME_WIDTH + i * 200,
      GAME_HEIGHT - 130,
      30,
      30,
      CANDY_IMAGE_SRC
    );
    candies.push(candy);
  }
}

// Game Loop
function gameLoop(currentTime) {
  if (!previousTime) {
    previousTime = currentTime;
    gameLoopHandle = requestAnimationFrame(gameLoop);
    return;
  }

  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (waitingToStart) {
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

    trees.forEach((tree) => {
      tree.update(gameSpeed, deltaTime);
      tree.draw();

      if (tree.collideWith(player)) {
        gameOver = true;
        saveScoreToServer(score.score);
        score.setHighScore();
      }
    });

    candies.forEach((candy) => {
      candy.update(gameSpeed, deltaTime);
      candy.draw();

      if (candy.collideWith(player)) {
        score.incrementBy(10);
        candy.x = canvas.width;
      }
    });

    score.update(deltaTime);

    player.draw();
    ground.draw();
    score.draw();
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(`Game Over! Score: ${Math.floor(score.score)}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
    ctx.fillText("Press R to Restart", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
  }

  gameLoopHandle = requestAnimationFrame(gameLoop);
}

// Restart Game
function restartGame() {
  if (gameOver) {
    gameOver = false;
    waitingToStart = true;
    previousTime = null;
    gameSpeed = GAME_SPEED_START; 

    cancelAnimationFrame(gameLoopHandle); 
    initializeGame(); 
    gameLoopHandle = requestAnimationFrame(gameLoop); 
  }
}

// Save Score to Server
async function saveScoreToServer(score) {
  const timestamp = new Date().toISOString();
  console.log("Sending score to API:", { nickname, score, timestamp });
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
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
      console.log("High scores loaded:", scores);
    } else {
      console.error("Failed to load scores:", response.statusText);
    }
  } catch (error) {
    console.error("Error loading scores:", error);
  }
}

// Handle Nickname Submission
nicknameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  nickname = nicknameInput.value.trim();
  if (nickname) {
    nicknameForm.style.display = "none";
    waitingToStart = true;
    initializeGame();
    gameLoopHandle = requestAnimationFrame(gameLoop);
  }
});

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
