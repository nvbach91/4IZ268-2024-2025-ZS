$(document).ready(function () {
    const colors = ["yellow", "red", "blue", "green"];
    const bestScoreApiUrl = "https://api.jsonbin.io/v3/b/6754296cad19ca34f8d71b1d";
    const bestScoreApiKey = "$2a$10$Yh9lWBvp/39veIfIDGsxWO5ZBbBlmqdeSSV3KAXUE5/pkYeFiFeeSy";

    let gameState = {
        gameSequence: [],
        playerSequence: [],
        currentScore: 0,
        bestScore: 0,
        bestTime: "00:00",
        gameStarted: false,
        gameStartTime: null,
        timerInterval: null,
        firstRound: true,
        isPlayerTurn: false,
        gameCompleted: false,
        pausedTime: 0
    };

    const $restartButton = $("#restart");
    const $gameOverModal = $("#game-over-modal");
    const $finalScore = $("#final-score");
    const $bestScoreModal = $("#best-score-modal");
    const $finalTime = $("#final-time");
    const $bestTimeModal = $("#best-time-modal");
    const $currentScore = $("#current-score");
    const $highestScore = $("#highest-score");
    const $yourTime = $("#your-time");
    const $bestTime = $("#best-time");
    const $colorButtons = $(".color-button");
    const $startButton = $("#start-button");
    const $closeModalButton = $("#close-modal");
    const $restartGameButton = $("#restart-game");

    $restartButton.hide();

    let currentSound = null;

    const playClickSound = () => {
        if (currentSound && !currentSound.paused) {
            currentSound.playbackRate = 2;
        }
        currentSound = new Audio("sounds/click.mp3");
        currentSound.play();
        currentSound.playbackRate = 1;
    };

    const playGameOverSound = () => {
        const gameOverSound = new Audio("sounds/gameover.mp3");
        gameOverSound.play();
        gameOverSound.playbackRate = 1;
    };

    const showSpinner = () => {
        $("#spinner").show();
    };

    const hideSpinner = () => {
        $("#spinner").hide();
    };

    const loadBestScore = async () => {
        showSpinner();
        try {
            const response = await fetch(bestScoreApiUrl, {
                method: "GET",
                headers: {
                    "X-Master-Key": bestScoreApiKey
                }
            });
            const data = await response.json();
            const record = data.record || {};
            gameState.bestScore = record.bestScore || 0;
            gameState.bestTime = record.bestTime || "00:00";
            $highestScore.text(gameState.bestScore);
            $bestTime.text(gameState.bestTime);
        } catch (error) {
            console.error("Error loading best score:", error);
        } finally {
            hideSpinner();
        }
    };

    const saveBestScore = async () => {
        try {
            const response = await fetch(bestScoreApiUrl, {
                method: "PUT",
                headers: {
                    "X-Master-Key": bestScoreApiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    bestScore: gameState.bestScore,
                    bestTime: gameState.bestTime
                })
            });
            if (response.ok) {
                console.log("Best score and time successfully saved!");
            } else {
                console.error("Failed to save best score");
            }
        } catch (error) {
            console.error("Error saving best score:", error);
        }
    };

    const saveGameState = () => {
        const state = {
            gameSequence: gameState.gameSequence,
            playerSequence: gameState.playerSequence,
            currentScore: gameState.currentScore,
            bestScore: gameState.bestScore,
            bestTime: gameState.bestTime,
            gameStarted: gameState.gameStarted,
            gameStartTime: gameState.gameStartTime ? gameState.gameStartTime.toISOString() : null,
            gameCompleted: gameState.gameCompleted,
            pausedTime: gameState.pausedTime
        };
        localStorage.setItem("simonGameState", JSON.stringify(state));
    };

    const loadGameState = () => {
        const savedState = localStorage.getItem("simonGameState");
        if (savedState) {
            const loadedState = JSON.parse(savedState);
            gameState.gameSequence = loadedState.gameSequence || [];
            gameState.playerSequence = loadedState.playerSequence || [];
            gameState.currentScore = loadedState.currentScore || 0;
            gameState.bestScore = loadedState.bestScore || 0;
            gameState.bestTime = loadedState.bestTime || "00:00";
            gameState.gameStarted = loadedState.gameStarted || false;
            gameState.gameStartTime = loadedState.gameStartTime ? moment(loadedState.gameStartTime) : null;
            gameState.gameCompleted = loadedState.gameCompleted || false;
            gameState.pausedTime = loadedState.pausedTime || 0;

            $currentScore.text(gameState.currentScore);
            $highestScore.text(gameState.bestScore);
            $bestTime.text(gameState.bestTime);

            if (gameState.gameStarted) {
                if (gameState.gameCompleted) {
                    gameState.currentScore = 0;
                    $currentScore.text(gameState.currentScore);
                    gameState.gameStarted = false;
                    gameState.gameSequence = [];
                    gameState.playerSequence = [];
                    alert("Game was completed. Starting a new one!");
                } else {
                    startTimer(true);
                    $colorButtons.prop("disabled", false);
                    $restartButton.show();
                    $startButton.hide();

                    if (gameState.gameSequence.length > 0 && gameState.playerSequence.length === 0) {
                        animateSequence();
                    }
                }
            }
        }
    };

    const startGame = () => {
        gameState.gameSequence = [];
        gameState.playerSequence = [];
        gameState.currentScore = 0;
        $currentScore.text(gameState.currentScore);
        gameState.gameStarted = true;
        gameState.firstRound = true;
        gameState.gameCompleted = false;
        gameState.pausedTime = 0;
        startTimer();
        nextSequence();

        $colorButtons.prop("disabled", false);
        $restartButton.show();
        $startButton.hide();

        saveGameState();
    };

    const resetGame = () => {
        clearInterval(gameState.timerInterval);
        gameState.gameSequence = [];
        gameState.playerSequence = [];
        gameState.currentScore = 0;
        gameState.gameStarted = false;

        $currentScore.text(gameState.currentScore);
        $yourTime.text("00:00");
        $startButton.show();
        $restartButton.hide();
        $colorButtons.prop("disabled", true);

        gameState.gameCompleted = true;
        saveGameState();
    };

    const startTimer = (isResume = false) => {
        if (!gameState.gameStarted || gameState.gameCompleted) return;
        
        if (!isResume) {
            gameState.gameStartTime = moment();
            gameState.pausedTime = 0;
        } else {
            gameState.gameStartTime = moment().subtract(gameState.pausedTime, "seconds");
        }

        clearInterval(gameState.timerInterval);

        gameState.timerInterval = setInterval(() => {
            if (!gameState.gameStarted || gameState.gameCompleted) {
                clearInterval(gameState.timerInterval);
                return;
            }

            const elapsed = moment().diff(gameState.gameStartTime, "seconds");
            const formattedTime = moment.utc(elapsed * 1000).format("mm:ss");
            $yourTime.text(formattedTime);
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(gameState.timerInterval);
        const elapsed = moment().diff(gameState.gameStartTime, "seconds");
        gameState.pausedTime = elapsed;
        const formattedTime = moment.utc(elapsed * 1000).format("mm:ss");

        if (gameState.currentScore > (gameState.bestScore || 0)) {
            gameState.bestScore = gameState.currentScore;
            gameState.bestTime = formattedTime;
            $highestScore.text(gameState.bestScore);
            $bestTime.text(gameState.bestTime);
            saveBestScore();
        }

        saveGameState();
    };

    const nextSequence = () => {
        $.ajax({
            url: "https://www.random.org/integers/?num=1&min=1&max=4&col=1&base=10&format=plain&rnd=new",
            method: "GET",
            success: (response) => {
                const randomNumber = parseInt(response.trim(), 10);
                const randomColor = colors[randomNumber - 1];
                gameState.gameSequence.push(randomColor);
                animateSequence();
                saveGameState();
            },
            error: () => {
                console.error("Error generating sequence.");
            }
        });
    };

    const animateSequence = () => {
        let index = 0;
        $colorButtons.prop("disabled", true);
        const intervalId = setInterval(() => {
            if (index < gameState.gameSequence.length) {
                flashColor(gameState.gameSequence[index]);
                index++;
            } else {
                clearInterval(intervalId);
                $colorButtons.prop("disabled", false);
                gameState.isPlayerTurn = true;
            }
        }, 700);
    };

    const flashColor = (color) => {
        $(`#${color}`).addClass("active");
        playClickSound();
        setTimeout(() => {
            $(`#${color}`).removeClass("active");
        }, 500);
    };

    const checkPlayerInput = (clickedColor) => {
        if (gameState.isPlayerTurn && gameState.playerSequence.length < gameState.gameSequence.length) {
            gameState.playerSequence.push(clickedColor);
            flashColor(clickedColor);

            if (clickedColor !== gameState.gameSequence[gameState.playerSequence.length - 1]) {
                endGame();
                return;
            }

            if (gameState.playerSequence.length === gameState.gameSequence.length) {
                gameState.currentScore++;
                $currentScore.text(gameState.currentScore);
                gameState.playerSequence = [];
                gameState.isPlayerTurn = false;
                nextSequence();
                saveGameState();
            }
        }
    };

    const endGame = () => {
        $finalScore.text(gameState.currentScore);  
        $bestScoreModal.text(gameState.bestScore);  
        $finalTime.text($yourTime.text());  
        $bestTimeModal.text(gameState.bestTime);  

        $gameOverModal.show();  

        playGameOverSound();
        stopTimer();
        resetGame();
    };

    $closeModalButton.click((event) => {
        event.preventDefault();  
        $gameOverModal.hide();
    });

    $restartGameButton.click((event) => {
        event.preventDefault();  
        $gameOverModal.hide();
        startGame();
    });

    $colorButtons.click(function (event) {
        event.preventDefault();  
        const clickedColor = $(this).attr("id");
        if (!gameState.gameStarted || !gameState.isPlayerTurn || $(this).prop("disabled")) return;
        checkPlayerInput(clickedColor);
    });

    $startButton.click((event) => {
        event.preventDefault(); 
        startGame();
    });

    $restartButton.click((event) => {
        event.preventDefault();  
        resetGame();
    });

    loadBestScore().then(() => {
        loadGameState();
    });

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            stopTimer(); 
        } else {
            if (gameState.gameStarted && !gameState.gameCompleted) {
                startTimer(true); 
            }
        }
    });
});
