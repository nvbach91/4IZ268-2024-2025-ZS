$(document).ready(function () {
    const colors = ["yellow", "red", "blue", "green"];

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
    const $confirmRestartModal = $("#confirm-restart-modal");
    const $confirmRestartYes = $("#confirm-restart-yes");
    const $confirmRestartNo = $("#confirm-restart-no");

    $restartButton.hide();

    let currentSound = null;
    let hasInteracted = false;

    $(document).one('click', function () {
        hasInteracted = true;
    });

    //prehrani zvuku klik
    const playClickSound = () => {
        if (!hasInteracted) {
            return;
        }
        if (currentSound && !currentSound.paused) {
            currentSound.playbackRate = 2;
        }
        currentSound = new Audio("sounds/click.mp3");
        currentSound.play();
        currentSound.playbackRate = 1;
    };

    //prehrani zvuku po konci hry
    const playGameOverSound = () => {
        const gameOverSound = new Audio("sounds/gameover.mp3");
        gameOverSound.play();
        gameOverSound.playbackRate = 1;
    };
    //spinner
    const showSpinner = () => {
        $("#spinner").show();
    };

    const hideSpinner = () => {
        $("#spinner").hide();
    };
    //nacitani nejlepsiho skore z localstorage
    const loadBestScore = () => {
        return new Promise((resolve, reject) => {
            showSpinner();
            try {
                const savedData = JSON.parse(localStorage.getItem("bestScoreData")) || {};
                gameState.bestScore = savedData.bestScore || 0;
                gameState.bestTime = savedData.bestTime || "00:00";

                $highestScore.text(gameState.bestScore);
                $bestTime.text(gameState.bestTime);
                resolve();
            } catch (error) {
                console.error("Error loading best score from localStorage:", error);
                reject(error);
            } finally {
                hideSpinner();
            }
        });
    };

    //ulozeni nejlepsiho skore do localstorage
    const saveBestScore = () => {
        try {
            const bestScoreData = {
                bestScore: gameState.bestScore,
                bestTime: gameState.bestTime
            };
            localStorage.setItem("bestScoreData", JSON.stringify(bestScoreData));

            console.log("Best score and time successfully saved to localStorage!");
        } catch (error) {
            console.error("Error saving best score to localStorage:", error);
        }
    };

    //ukladani aktualniho stavu do localstorage
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

    //nacitani stavu hry z localstorage
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

    //spousteni hry
    const startGame = () => {
        gameState.gameSequence = [];
        gameState.playerSequence = [];
        gameState.currentScore = 0;
        $currentScore.text(gameState.currentScore);
        gameState.gameStarted = true;
        gameState.firstRound = true;
        gameState.gameCompleted = false;
        gameState.pausedTime = 0;

        gameState.gameStartTime = moment();

        startTimer();
        nextSequence();

        $colorButtons.prop("disabled", false);
        $restartButton.show();
        $startButton.hide();

        saveGameState();
    };

    //ukazovani a schovavani replaye
    const showReplayButton = () => {
        $("#replay-sequence-btn").show();
    };

    const hideReplayButton = () => {
        $("#replay-sequence-btn").hide();
    };

    $("#replay-sequence-btn").click(function (event) {
        event.preventDefault();

        if (gameState.currentScore > 0) {
            gameState.currentScore--;
            $currentScore.text(gameState.currentScore);
        }

        gameState.playerSequence = [];
        animateSequence();

        hideReplayButton();

        startTimer(true);
    });

    // modal po kliknuti na restart
    $restartButton.click(function (event) {
        stopTimer();
        stopSequence();
        event.preventDefault();
        $confirmRestartModal.show();
        hideReplayButton();
    });

    $confirmRestartYes.click(function (event) {
        event.preventDefault();
        $confirmRestartModal.hide();
        resetGame();
    });

    $confirmRestartNo.click(function (event) {
        event.preventDefault();
        $confirmRestartModal.hide();

        if (!gameState.gameCompleted) {
            gameState.isPlayerTurn = false;
            animateSequence();
            startTimer(true);
        }
    });

    const stopSequence = () => {
        clearInterval(gameState.sequenceInterval);
        $colorButtons.prop("disabled", false);
    };

    const resetGame = () => {
        $colorButtons.prop("disabled", true);
        gameState.gameSequence = [];
        gameState.playerSequence = [];
        gameState.currentScore = 0;
        gameState.gameStarted = false;

        $currentScore.text(gameState.currentScore);
        $yourTime.text("00:00");

        $startButton.show();
        $restartButton.hide();

        gameState.gameCompleted = true;
        hideReplayButton();
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
        gameState.lastGameTime = formattedTime;

        if (gameState.currentScore > (gameState.bestScore || 0) ||
            (gameState.currentScore === gameState.bestScore && formattedTime < gameState.bestTime)) {
            gameState.bestScore = gameState.currentScore;
            gameState.bestTime = formattedTime;
            $highestScore.text(gameState.bestScore);
            $bestTime.text(gameState.bestTime);
            saveBestScore();
        }

        saveGameState();
    };
    // vola api pro nahodne cislo
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
    /*MOHLO BÝT POUŽITO TOHLE
    const nextSequence = () => {
    const randomNumber = Math.floor(Math.random() * 4);  
    const randomColor = colors[randomNumber];  
    gameState.gameSequence.push(randomColor);
    animateSequence();
    saveGameState();
};*/
    //postupne rozsvecovani tlacitek
    const animateSequence = () => {
        let index = 0;
        $colorButtons.prop("disabled", true);
        hideReplayButton();

        gameState.sequenceInterval = setInterval(() => {
            if (index < gameState.gameSequence.length) {
                flashColor(gameState.gameSequence[index]);
                index++;
            } else {
                clearInterval(gameState.sequenceInterval);
                $colorButtons.prop("disabled", false);
                gameState.isPlayerTurn = true;
                showReplayButton();
            }
        }, 700);
    };
    let playerName = localStorage.getItem("playerName") || "";

    if (playerName) {
        // Pouze změní text labelu
        $("#player-name-label").text("Change player:");
    } else {
        $("#player-name-label").text("Enter your name:");
    }

    // Povolení nebo zakázání tlačítka Start na základě vstupu
    $('#player-name').on('input', function () {
        const playerName = $(this).val().trim();

        if (playerName !== "") {
            $('#start-button').prop('disabled', false);
        } else {
            $('#start-button').prop('disabled', true);
        }
    });


    $("#save-name-btn").click(function () {
        const playerNameInput = $("#player-name").val().trim();
        if (playerNameInput) {
            playerName = playerNameInput;
            localStorage.setItem("playerName", playerName);

            console.log("Player name saved:", playerName);

            $("#player-name").val(""); // Vymaže vstupní pole pro jméno

            // Zobrazí notifikaci s textem `--- is playing`
            $("#name-playing-notification").text(`${playerName} is playing`).fadeIn();

            // Automatické skrytí notifikace po 3 sekundách
            setTimeout(() => {
                $("#name-playing-notification").fadeOut();
            }, 3000);

            // Vynulování hry
            resetGame(); // Resetuje hru
            $startButton.show(); // Zobrazí tlačítko Start
            $restartButton.hide(); // Schová tlačítko Restart
        } else {
            // Zobraz notifikaci o chybě
            $("#enter-name-notification").fadeIn();

            // Automatické skrytí notifikace po 3 sekundách
            setTimeout(() => {
                $("#enter-name-notification").fadeOut();
            }, 3000);
        }
    });



    //ukladani progresu do localstorage
    const saveGameProgress = () => {
        const gameProgress = JSON.parse(localStorage.getItem("gameProgress")) || [];
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

        const newGameRecord = {
            playerName: playerName || "Unknown Player",
            score: gameState.currentScore,
            time: gameState.lastGameTime || "00:00",
            date: currentDate,
        };

        gameProgress.push(newGameRecord);
        localStorage.setItem("gameProgress", JSON.stringify(gameProgress));
    };

    const flashColor = (color) => {
        $(`#${color}`).addClass("active");
        playClickSound();
        setTimeout(() => {
            $(`#${color}`).removeClass("active");
        }, 500);
    };
    // kontroluje spravnost kliknuti
    const checkPlayerInput = (clickedColor) => {
        console.log("Clicked color:", clickedColor);
        console.log("Expected color:", gameState.gameSequence[gameState.playerSequence.length]);

        if (gameState.isPlayerTurn && gameState.playerSequence.length < gameState.gameSequence.length) {
            gameState.playerSequence.push(clickedColor);
            flashColor(clickedColor);

            if (clickedColor !== gameState.gameSequence[gameState.playerSequence.length - 1]) {
                console.error("Wrong color! Ending game.");
                endGame();
                return;
            }

            if (gameState.playerSequence.length === gameState.gameSequence.length) {
                console.log("Correct sequence! Moving to next round.");
                gameState.currentScore++;
                $currentScore.text(gameState.currentScore);
                gameState.playerSequence = [];
                gameState.isPlayerTurn = false;
                nextSequence();
                saveGameState();
            }
        }
    };

    //konec hry - zastavi casovac, zobrazuje modal, uklada 
    const endGame = () => {
        console.log("Ending game...");
        stopTimer();

        $finalScore.text(gameState.currentScore);
        $bestScoreModal.text(gameState.bestScore);
        $finalTime.text($yourTime.text());
        $bestTimeModal.text(gameState.bestTime);

        saveGameProgress();
        $gameOverModal.show();

        playGameOverSound();
        resetGame();
        console.log("Game ended. Game state reset.");
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
        console.log("Button clicked:", clickedColor);
        if (!gameState.gameStarted || !gameState.isPlayerTurn || $(this).prop("disabled")) {
            console.log("Ignoring click.");
            return;
        }
        checkPlayerInput(clickedColor);
    });

    $startButton.click((event) => {
        event.preventDefault();
        startGame();
    });

    loadBestScore().then(() => {
        loadGameState();
    }).catch((error) => {
        console.error("Error during initialization:", error);
    });
    // pri prepnuti okna se casovac zastavi
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            stopTimer();
        } else {
            if (gameState.gameStarted && !gameState.gameCompleted) {
                startTimer(true);
            }
        }
    });

    const loadGameProgress = () => {
        const gameProgress = JSON.parse(localStorage.getItem("gameProgress")) || [];
        const $progressTableBody = $("#progress-table tbody");
        $progressTableBody.empty();

        const playerGames = gameProgress.filter(record => record.playerName === playerName);
        playerGames.sort((a, b) => new Date(b.date) - new Date(a.date));

        console.log("Player's game progress:", playerGames);


        playerGames.forEach((record, index) => {
            const row = `<tr>
                            <td>${playerGames.length - index}</td> <!-- Reverse the index -->
                            <td>${record.playerName}</td>
                            <td>${record.score}</td>
                            <td>${record.time}</td> <!-- Display the time -->
                            <td>${record.date}</td>
                        </tr>`;
            $progressTableBody.append(row);
        });
    };



    const openProgressModal = () => {
        loadGameProgress();
        $("#progress-modal").show();
    };

    const closeProgressModal = () => {
        $("#progress-modal").hide();
    };

    $("#view-progress-btn").click(function () {
        stopTimer();
        stopSequence();
        openProgressModal();
    });

    $("#progress-modal .modal-btn").click(function () {
        closeProgressModal();
        if (gameState.gameStarted && !gameState.gameCompleted) {
            startTimer(true);
            if (gameState.gameSequence.length > 0 && gameState.playerSequence.length === 0) {
                animateSequence();
            }
        }
    });

    $("#close-progress-modal-btn").click(() => {
        closeProgressModal();
    });

    //umoznuje vymazat progres
    $('#delete-progress-modal-btn').click(function () {
        localStorage.removeItem('gameProgress');
        showNotification();
    });
    //po smazani progresu se ukaze notifikace
    function showNotification() {
        $('#delete-progress-notification').fadeIn();
        setTimeout(function () {
            $('#delete-progress-notification').fadeOut();
        }, 3000);
    }
});
