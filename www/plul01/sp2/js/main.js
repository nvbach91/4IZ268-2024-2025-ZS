$(document).ready(function () {
    let currentPokemon = null;
    let score = 0;
    let leaderboard = new Map();
    let nickname = '';
    let isLoading = false;


    if (localStorage.getItem('pokemonLeaderboard')) {
        const storedLeaderboard = JSON.parse(localStorage.getItem('pokemonLeaderboard'));
        storedLeaderboard.forEach(entry => {
            leaderboard.set(entry.nickname, entry.score);
        });
        updateLeaderboardDisplay();
    }
    const initialState = { page: 'nickname' };
    history.replaceState(initialState, '', '#nickname');


    window.addEventListener('popstate', function (event) {
        if (event.state) {
            handleNavigationState(event.state);
        }
    });
    /** Navigation between stages */
    function handleNavigationState(state) {
        switch (state.page) {
            case 'nickname':
                showNicknameScreen();
                break;
            case 'game':
                if (nickname) {
                    showGameScreen();
                } else {
                    showNicknameScreen();
                }
                break;
        }
    }
    /** Gets you back to nickname screen and reset the score */
    function showNicknameScreen() {
        $('#game-section').hide();
        $('#nickname-section').show();

        score = 0;
        $('#score').text('0');
        $('#guess-input').val('');
        $('#message').empty()
            .hide();
    }
    /** Gets you on game screen */
    function showGameScreen() {
        $('#nickname-section').hide();
        $('#game-section').show();
    }

    /** Gets new pokemon (name and sprite, by random generater id) from pokeAPI */
    async function fetchNewPokemon() {
        if (isLoading) return;
        isLoading = true;

        $('#pokemon-image').addClass('loading');
        $('#submit-guess').prop('disabled', true);
        $('#guess-input').prop('disabled', true);

        try {
            const randomId = Math.floor(Math.random() * 649) + 1;

            const response = await $.ajax({
                url: `https://pokeapi.co/api/v2/pokemon/${randomId}`,
                method: 'GET'
            });

            currentPokemon = {
                name: response.name,
                image: response.sprites.front_default || response.sprites.other['official-artwork'].front_default
            };

            const img = new Image();
            img.onload = function () {
                $('#pokemon-image')
                    .attr('src', currentPokemon.image)
                    .removeClass('loading revealed');
                $('#submit-guess').prop('disabled', false);
                $('#guess-input').prop('disabled', false);
                isLoading = false;
            };
            img.src = currentPokemon.image;

        } catch (error) {
            showMessage('Error loading Pokémon. Please try again!', 'error');
            isLoading = false;
        }
    }

    /** Checks the score, show messages and update the leaderboard */
    function updateLeaderboard() {
        const currentHighScore = leaderboard.get(nickname) || 0;
        const isNewHighScore = score > currentHighScore;

        if (isNewHighScore) {
            leaderboard.set(nickname, score);


            const sortedLeaderboard = Array.from(leaderboard.entries())
                .map(([nickname, score]) => ({ nickname, score }))
                .sort((a, b) => b.score - a.score);


            localStorage.setItem('pokemonLeaderboard', JSON.stringify(sortedLeaderboard));

            updateLeaderboardDisplay(nickname);

            showMessage(`Game Over! The correct answer was ${currentPokemon.name}. New personal best score: ${score}!`, 'success');
        } else {
            showMessage(`Game Over! The correct answer was ${currentPokemon.name}. Your score: ${score}. Your best: ${currentHighScore}`, 'error');
        }
    }

    /** Sort and show updated leaderboard */
    function updateLeaderboardDisplay(newHighScoreNickname = null) {
        const $leaderboardList = $('#leaderboard-list');
        $leaderboardList.empty();

        const sortedLeaderboard = Array.from(leaderboard.entries())
            .map(([nickname, score]) => ({ nickname, score }))
            .sort((a, b) => b.score - a.score);

        sortedLeaderboard.forEach((entry, index) => {
            const $entry = $('<div>')
                .addClass('leaderboard-entry')
                .text(`${index + 1}. ${entry.nickname}: ${entry.score}`);

            // Highlight new high score
            if (entry.nickname === newHighScoreNickname) {
                $entry.addClass('new-high-score');
            }

            $leaderboardList.append($entry);
        });
    }

    /** If there is nickname, it will start the game, also used to get you back to nickname page */
    function startGame() {
        nickname = $('#nickname-input').val().trim();
        if (!nickname) {
            showMessage('Please enter a nickname first!', 'error');
            return;
        }

        $('#message').hide();
        history.pushState({ page: 'game' }, '', '#game');
        showGameScreen();
        fetchNewPokemon();
    }

    $('#back-to-nickname').click(function () {
        const confirmMessage = score > 0 ?
            'Going back will reset your current score. Continue?' :
            'Do you want to change your nickname?';

        if (confirm(confirmMessage)) {
            history.pushState({ page: 'nickname' }, '', '#nickname');
            showNicknameScreen();
        }
    });

    /** Check the guess and evaluate the score (or whole game) */
    function checkGuess() {
        if (isLoading) return;
        //take the guess and make it a value without white space
        const guess = $('#guess-input').val().trim().toLowerCase();

        if (!guess) {
            showMessage('Please enter a guess!', 'error');
            return;
        }

        if (guess === currentPokemon.name) {
            score++;
            $('#score').text(score);
            $('#guess-input').val('');
            showMessage('Correct! Here comes another one!', 'success');
            fetchNewPokemon();
        } else {
            gameOver();
        }
    }

    /** Ends the game and updates the leaderboard. Also prompts player to start again. */
    function gameOver() {
        $('#pokemon-image').addClass('revealed');
        updateLeaderboard();

        const playAgainButton = $('<button>')
            .text('Play Again')
            .click(resetGame);
        $('#message').append(playAgainButton);

        $('#submit-guess').prop('disabled', true);
        $('#guess-input').prop('disabled', true);
    }

    /** Restarts the game by setting the score to 0 */
    function resetGame() {
        score = 0;
        $('#score').text('0');
        $('#guess-input').val('').prop('disabled', false);
        $('#submit-guess').prop('disabled', false);
        $('#message').empty()
            .hide();
        fetchNewPokemon();
    }

    /** Displays the text in the error message block */
    function showMessage(text, type) {
        $('#message')
            .show()
            .text(text)
            .attr('class', `message ${type}`);
    }


    $('#start-button').click(startGame);

    $('#submit-guess').click(checkGuess);

    $('#guess-input').keypress(function (e) {
        if (e.which === 13) {
            checkGuess();
        }
    });


    if (window.location.hash === '#game' && nickname) {
        showGameScreen();
    } else {
        showNicknameScreen();
    }
});