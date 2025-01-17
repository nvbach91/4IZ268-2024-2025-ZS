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
    const $spinner = $("#spinner");
    const $replaySequenceButton = $("#replay-sequence-btn");
    const $playerName = $("#player-name");
    const $saveNameButton = $("#save-name-btn");
    const $playerNameLabel = $("#player-name-label");
    const $namePlayingNotification = $("#name-playing-notification");
    const $viewProgressButton = $("#view-progress-btn");
    const $enterNameNotification = $("#enter-name-notification");
    const $prograssModal = $("#progress-modal");
    const $closeProgressModalBtn = $("#close-progress-modal-btn");
    const $deleteProgressModalBtn = $("#delete-progress-modal-btn");
    const $deleteProgressNotification = $("#delete-progress-notification");
    const $progressTableBody = $("#progress-table tbody");
    const $modalButtonSelector = $("#progress-modal .modal-btn");
    const $playerForm = $("#player-form");

    const colorButtons = {
        yellow: $("#yellow"),
        red: $("#red"),
        blue: $("#blue"),
        green: $("#green")
    };

    $playerForm.submit(function (event) {
        event.preventDefault();  
        
        const playerNameInput = $playerName.val().trim();
        if (playerNameInput) {
            savePlayerName(playerNameInput);
        } else {
            $enterNameNotification.fadeIn();
            setTimeout(() => {
                $enterNameNotification.fadeOut();
            }, 3000);
        }
    });
    
    // Funkce pro uložení jména hráče do localStorage a pokračování ve hře
    const savePlayerName = (playerName) => {
        localStorage.setItem("playerName", playerName);
        console.log("Player name saved:", playerName);
        $playerNameInput.val(""); // Vymazání textového pole
    
        // Změna textu pro změnu jména
        $playerNameLabel.text("Change player:");
    
        // Zobrazení notifikace o hráči
        $namePlayingNotification.text(`${playerName} is playing`).fadeIn();
        setTimeout(() => {
            $namePlayingNotification.fadeOut();
        }, 3000);
    
        // Vynulování hry
        resetGame();
        $startButton.show();
        $restartButton.hide();
    
        // Zobrazení tlačítka "View Progress"
        $viewProgressButton.show();
    };
    
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

    const showSpinner = () => {
        $spinner.show();  // Ukáže spinner
    };

    const hideSpinner = () => {
        $spinner.hide();  // Skryje spinner
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

        // Když hra začne, deaktivuje tlačítko Save Name
        $saveNameButton.prop('disabled', true);

        saveGameState();
    };

    //ukazovani a schovavani replaye
    const showReplayButton = () => {
        $replaySequenceButton.show();
    };

    const hideReplayButton = () => {
        $replaySequenceButton.hide();
    };

    $replaySequenceButton.click(function (event) {
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

        // Když hra začne, deaktivuje tlačítko Save Name
        $saveNameButton.prop('disabled', false);
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

    // Povolení nebo zakázání tlačítka Start na základě vstupu
    $playerName.on('input', function () {
        const playerName = $(this).val().trim();

        if (playerName !== "") {
            $startButton.prop('disabled', false);
        } else {
            $startButton.prop('disabled', true);
        }
    });


    //kliknuti na savename
    $saveNameButton.click(function () {
        const playerNameInput = $playerName.val().trim();

        if (playerNameInput) {
            // jmeno se ulozi do localstorage
            playerName = playerNameInput;
            localStorage.setItem("playerName", playerName);

            console.log("Player name saved:", playerName);

            // vymazani vypsaneho jmeno
            $playerName.val("");

            // text se zmenina change playes
            $playerNameLabel.text("Change player:");

            //  notifikace s textem `--- is playing`
            $namePlayingNotification.text(`${playerName} is playing`).fadeIn();

            // Automatické skrytí notifikace po 3 sekundách
            setTimeout(() => {
                $namePlayingNotification.fadeOut();
            }, 3000);

            // Vynulování hry
            resetGame(); // Resetuje hru
            $startButton.show(); // Zobrazí tlačítko Start
            $restartButton.hide(); // Schová tlačítko Restart

            // Zobrazení tlačítka "View Progress"
            $viewProgressButton.show();
        } else {
            // Pokud není jméno zadáno, zobrazí se notifikace
            $enterNameNotification.fadeIn();

            // Automatické skrytí notifikace po 3 sekundách
            setTimeout(() => {
                $enterNameNotification.fadeOut();
            }, 3000);
        }
    });

    let playerName = localStorage.getItem("playerName") || "";

    if (playerName) {
        $playerNameLabel.text("Change player:");
        $viewProgressButton.show(); // Zobrazí tlačítko, pokud je jméno již uloženo
    } else {
        $playerNameLabel.text("Do you want to track your progress?");
    }
    

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
        const $button = colorButtons[color];
        if ($button) {
            $button.addClass("active");
            playClickSound();
            setTimeout(() => {
                $button.removeClass("active");
            }, 500);
        }
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
        $progressTableBody.empty();

        const playerGames = gameProgress.filter(record => record.playerName === playerName);
        playerGames.sort((a, b) => new Date(b.date) - new Date(a.date));

        console.log("Player's game progress:", playerGames);

        let rows = ''; //vsechny radky najednou

        playerGames.forEach((record, index) => {
            rows += `<tr>
                        <td>${playerGames.length - index}</td> <!-- Reverse the index -->
                        <td>${record.playerName}</td>
                        <td>${record.score}</td>
                        <td>${record.time}</td> <!-- Display the time -->
                        <td>${record.date}</td>
                     </tr>`;
        });

        // vsechny radky najednou
        $progressTableBody.append(rows);
    };

    const openProgressModal = () => {
        loadGameProgress();
        $prograssModal.show();
    };

    const closeProgressModal = () => {
        $prograssModal.hide();
    };
    $viewProgressButton.click(function () {
        console.log("View Progress button clicked");
        stopTimer();
        stopSequence();
        openProgressModal();
    });


    $modalButtonSelector.click(function () {
        closeProgressModal();
        if (gameState.gameStarted && !gameState.gameCompleted) {
            startTimer(true);
            if (gameState.gameSequence.length > 0 && gameState.playerSequence.length === 0) {
                animateSequence();
            }
        }
    });

    $closeProgressModalBtn.click(() => {
        closeProgressModal();
    });

    //umoznuje vymazat progres
    $deleteProgressModalBtn.click(function () {
        localStorage.removeItem('gameProgress');
        showNotification();
    });
    //po smazani progresu se ukaze notifikace
    function showNotification() {
        $deleteProgressNotification.fadeIn();
        setTimeout(function () {
            $deleteProgressNotification.fadeOut();
        }, 3000);
    }

});
