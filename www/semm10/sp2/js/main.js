const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const playerNameInput = document.getElementById('player-name');
const landing = document.getElementById('landing');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score-display');
const playAgainButton = document.getElementById('play-again');
const endButton = document.getElementById('end');


const BIN_ID = '678447aae41b4d34e4765ea8 	'; 
const API_KEY = '$2a$10$/RkrMpWvBfTapiHB.c66M.BbOAVwWzykHUJzcF.RnEhni.mJhPqrO'; 
const MASTER_KEY = '$2a$10$mL9HV0ZyCTNR0AnAL/WELu4jcVD1oIKH7QVbcaPtl2sy7ovHUXrLy'; 

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerName = '';
let gameInterval;
let asteroids = [];
let bullets = [];
let score = 0;
let highScore = 0;
let highScorePlayer = ''; 


function loadHighScore() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
    xhr.setRequestHeader('X-Master-Key', MASTER_KEY);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            highScore = data.highScore || 0;  
            highScorePlayer = data.highScorePlayer || '';  
        } else {
            console.error('Failed to load high score:', xhr.status);
        }
    };
    xhr.onerror = function () {
        console.error('Request failed');
    };
    xhr.send();
}


function saveHighScore() {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Master-Key', MASTER_KEY);
    xhr.onload = function () {
        if (xhr.status !== 200) {
            console.error('Failed to save high score:', xhr.status);
        }
    };
    xhr.onerror = function () {
        console.error('Request failed');
    };
    xhr.send(JSON.stringify({
        highScore: highScore,
        highScorePlayer: highScorePlayer
    }));
}

function resetGame() {
    score = 0;
    asteroids = [];
    bullets = [];
    player.position = { x: canvas.width / 2, y: canvas.height / 2 };
    player.velocity = { x: 0, y: 0 };
    player.rotation = 0;
    keys.ArrowUp.pressed = false;
    keys.ArrowLeft.pressed = false;
    keys.ArrowRight.pressed = false;
    keys.ArrowDown.pressed = false;
}


function showGameOverScreen() {
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = `Name: ${playerName} | Score: ${Math.floor(score)}`;
    highScoreDisplay.textContent = `High Score: ${Math.floor(highScore)} by ${highScorePlayer || 'Unknown'}`;

    gameOverScreen.style.display = 'block';
    canvas.style.display = 'none';
}


playAgainButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
    resetGame(); 
    spawnAsteroids(); 
    gameInterval = setInterval(game_loop, 1000 / 60); 
});


endButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    landing.style.display = 'block';
    canvas.style.display = 'none';
});


function startGame() {
    playerName = playerNameInput.value.trim() || 'Player';
    landing.style.display = 'none';
    canvas.style.display = 'block';
    resetGame();
    spawnAsteroids();
    gameInterval = setInterval(game_loop, 1000 / 60);
}

function gameOver() {
    if (score > highScore) {
        highScore = score;
        highScorePlayer = playerName;
        saveHighScore(); 
    }
    showGameOverScreen(); 
}

// Class for the player
class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
    }
    draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x, -this.position.y);
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(this.position.x + 30, this.position.y);
        ctx.lineTo(this.position.x - 10, this.position.y - 10);
        ctx.lineTo(this.position.x - 10, this.position.y + 10);
        ctx.closePath();
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Boundaries
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.y < 0) this.position.y = 0;
        if (this.position.x > canvas.width) this.position.x = canvas.width;
        if (this.position.y > canvas.height) this.position.y = canvas.height;
    }
}

// Bullet class
class Bullet {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

// Asteroid class
class Asteroid {
    constructor({ position, velocity, radius }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.strokeStyle = 'gray';
        ctx.stroke();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 },
});

const keys = {
    ArrowUp: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowDown: { pressed: false },
};

function collision(asteroid, bullet) {
    const x_diff = asteroid.position.x - bullet.position.x;
    const y_diff = asteroid.position.y - bullet.position.y;
    const distance = Math.sqrt(x_diff * x_diff + y_diff * y_diff);
    return distance <= asteroid.radius + bullet.radius;
}

const spawnRate = 2000;

function spawnAsteroids() {
    const index = Math.floor(Math.random() * 8); 
    let x, y, angle, vx, vy;
    const radius = Math.random() * 50 + 10; 

    switch (index) {
        case 0: // Left side 
            x = 0 - radius;
            y = Math.random() * canvas.height; 
            vx = 1;
            vy = 1;
            break;
        case 1: // Down side 
            x = Math.random() * canvas.width; 
            y = canvas.height + radius;
            vx = -1; // move left
            vy = -1; // Move up
            break;
        case 2: // Right side
            x = canvas.width + radius;
            y = Math.random() * canvas.height; 
            vx = -1; 
            vy = -1;
            break;
        case 3: // Up side
            x = Math.random() * canvas.width; 
            y = 0 - radius;
            vx = 1;
            vy = 1; 
            break;
        case 4:
            x = 0 - radius;
            y = Math.random() * canvas.height;
            vx = 1;
            vy = 0;
            break;
        case 5:
            x = Math.random() * canvas.width;
            y = canvas.height + radius;
            vx = 0;
            vy = -1;
            break;
        case 6:
            x = canvas.width + radius;
            y = Math.random() * canvas.height;
            vx = -1;
            vy = 0;
            break;
        case 7:
            x = Math.random() * canvas.width;
            y = 0 - radius;
            vx = 0;
            vy = 1;
            break;
    }

    
    asteroids.push(new Asteroid({
        position: { x, y },
        velocity: { x: vx * 0.8, y: vy * 0.8 }, 
        radius,
    }));


    setTimeout(spawnAsteroids, spawnRate);
}

spawnAsteroids();

function game_loop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    score += 1 / 60;

    // Bullets logic
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.update();
        if (
            bullet.position.x + bullet.radius < 0 ||
            bullet.position.x - bullet.radius > canvas.width ||
            bullet.position.y - bullet.radius > canvas.height ||
            bullet.position.y + bullet.radius < 0
        ) {
            bullets.splice(i, 1);
        }
    }

    // Asteroids logic
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        asteroid.update();

        // Remove asteroids
        if (
            asteroid.position.x + asteroid.radius < 0 ||
            asteroid.position.x - asteroid.radius > canvas.width ||
            asteroid.position.y - asteroid.radius > canvas.height ||
            asteroid.position.y + asteroid.radius < 0
        ) {
            asteroids.splice(i, 1);
        }
        // Collision with asteroid - player
        const playerDistance = Math.hypot(
            player.position.x - asteroid.position.x,
            player.position.y - asteroid.position.y
        );
        if (playerDistance < asteroid.radius + 20) { 
            gameOver();
            return;
        }

        // Collision - bullet
        for (let j = bullets.length - 1; j >= 0; j--) {
            const bullet = bullets[j];
            if (collision(asteroid, bullet)) {
                asteroids.splice(i, 1);
                bullets.splice(j, 1);
                score += 5;
                break;
            }
        }
    }

    drawScore();

    // Player movement
    if (keys.ArrowUp.pressed) {
        player.velocity.x = Math.cos(player.rotation) * 3;
        player.velocity.y = Math.sin(player.rotation) * 3;
    } else if (!keys.ArrowUp.pressed) {
        player.velocity.x *= 0.9;
        player.velocity.y *= 0.9;
    }
    if (keys.ArrowRight.pressed) player.rotation += 0.04;
    if (keys.ArrowLeft.pressed) player.rotation -= 0.04;
    if (keys.ArrowDown.pressed) {
        player.velocity.x = -Math.cos(player.rotation) * 3;
        player.velocity.y = -Math.sin(player.rotation) * 3;
    }
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 40);
    ctx.fillText(`High Score: ${Math.floor(highScore)}`, 20, 70);
}

window.addEventListener('keydown', (move) => {
    switch (move.code) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = true;
            break;
        case 'Space':
            bullets.push(
                new Bullet({
                    position: {
                        x: player.position.x + Math.cos(player.rotation) * 30,
                        y: player.position.y + Math.sin(player.rotation) * 30,
                    },
                    velocity: {
                        x: Math.cos(player.rotation) * 5,
                        y: Math.sin(player.rotation) * 5,
                    },
                })
            );
            break;
    }
});

window.addEventListener('keyup', (move) => {
    switch (move.code) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = false;
            break;
    }
});

startButton.addEventListener('click', startGame);

loadHighScore();





