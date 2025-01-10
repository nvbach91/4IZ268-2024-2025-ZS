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
const API_URL = "https://675468d036bcd1eec851143c.mockapi.io/data";

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
let highScoreLoaded = false;

// Initialize Game Objects
async function initializeGame() {
  const scaleRatio = 1;

  player = new Player(ctx, 50, 50, scaleRatio, PLAYER_JUMP_STRENGTH, PLAYER_GRAVITY);
  ground = new Ground(ctx, GAME_WIDTH, 50, 2, scaleRatio);

  initializeTrees();
  initializeCandies();

  score = new Score(ctx, scaleRatio, nickname);

  backgroundImage = new Image();
  backgroundImage.src = "images/sky.png";

  await score.loadHighScore(); // Load high score for the current player

  if (!highScoreLoaded) {
    loadHighScore();
    highScoreLoaded = true;
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

async function saveScoreToServer(score) {
  const timestamp = new Date().toISOString();
  console.log("Sending score to API:", { nickname, score, timestamp });

  try {
    await fetch(`${API_URL}/Scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
        score: Math.floor(score),
        timestamp,
      }),
    });
    console.log("Score saved successfully!");
  } catch (error) {
    console.error("Error saving score:", error);
  }
}


async function loadAndDisplayScores() {
  const API_URL = "https://675468d036bcd1eec851143c.mockapi.io/data/Scores";
  const scoresBody = document.getElementById("scores-body");
  scoresBody.innerHTML = ""; // Vymaže předchozí obsah tabulky

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      console.error("Failed to load scores:", response.statusText);
      scoresBody.innerHTML = "<tr><td colspan='4'>Failed to load scores.</td></tr>";
      return;
    }

    const scores = await response.json();
    let scoresData = []; // Prázdné pole pro řádky tabulky

    // Naplnění pole scoresData řádky tabulky
    scores.forEach((score, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${score.nickname}</td>
          <td>${score.score}</td>
          <td>${new Date(score.timestamp).toLocaleString()}</td>
        </tr>
      `;
      scoresData.push(row); // Přidání řádku do pole
    });

    // Přidání všech řádků do DOM najednou
    scoresBody.innerHTML = scoresData.join(""); // Převod pole na řetězec a vložení do tabulky
  } catch (error) {
    console.error("Error loading scores:", error);
    scoresBody.innerHTML = "<tr><td colspan='4'>Error loading scores.</td></tr>";
  }
}


// Zavolá funkci pro načtení a zobrazení skóre po načtení stránky
window.onload = loadAndDisplayScores;

// Load High Score
async function loadHighScore(page = 1, limit = 5) {
  try {
    const response = await fetch(`${API_URL}/HighScore?_sort=score&_order=desc&_page=${page}&_limit=${limit}`);

    if (response.ok) {
      const score = await response.json();
      displayHighScore(score);
    } else {
      console.error("Failed to load high score:", response.statusText);
    }
  } catch (error) {
    console.error("Error loading high score:", error);
  }
}
// Display High Score
function displayHighScore(score) {
  const highScoreContainer = document.getElementById("high-score-container");
  highScoreContainer.innerHTML = "";

  if (score.length === 0) {
    highScoreContainer.innerHTML = "<p>No high score available.</p>";
    return;
  }

  score.forEach((score, index) => {
    const scoreElement = document.createElement("div");
    scoreElement.textContent = `${index + 1}. ${score.nickname}: ${score.score}`;
    highScoreContainer.appendChild(scoreElement);
  });
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


function updatePagination(page) {
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");
  const currentPageElement = document.getElementById("current-page");

  currentPageElement.textContent = `Page ${page}`;
  prevButton.disabled = page === 1;

  prevButton.onclick = () => {
    if (page > 1) {
      loadScore(--page);
    }
  };

  nextButton.onclick = () => {
    loadScore(++page);
  };
}


// Načtení high score při spuštění hry
loadScore();