$(document).ready(function() {
  let currentPokemon = null;
  let score = 0;
  let leaderboard = new Map();
  let nickname = '';
  let isLoading = false;
  let guessedPokemons = [];

  const generations = [
    { start: 1, end: 151, active: true },
    { start: 152, end: 251, active: true },
    { start: 252, end: 386, active: true },
    { start: 387, end: 493, active: true },
    { start: 494, end: 649, active: true },
    { start: 650, end: 721, active: true },
    { start: 722, end: 809, active: true },
    { start: 810, end: 905, active: true },
    { start: 906, end: 1025, active: true }
  ];

  function toggleGeneration(index) {
    generations[index].active = !generations[index].active;

    if (!generations[index].active) {
      $(`#gen-butt-${index}`).addClass('inactive-generation');
    } else {
      $(`#gen-butt-${index}`).removeClass('inactive-generation');
    }
  }

  const $generationSection = $('#generation-section');
  for (let i = 0; i < generations.length; i++) {
    let gen = i + 1;
    const range = generations[i];

    const $newButton = $('<button>')
      .attr('id', `gen-butt-${i}`)
      .text(`${gen}`)
      .click(function() { toggleGeneration(i); });
    $generationSection.append($newButton);
  }

  if (localStorage.getItem('pokemonLeaderboard')) {
    const storedLeaderboard = JSON.parse(localStorage.getItem('pokemonLeaderboard')); 
    storedLeaderboard.forEach(entry => {
      leaderboard.set(entry.nickname, entry.result);
    });
    updateLeaderboardDisplay();
  }

  if (localStorage.getItem('lastPlayer')) {
    nickname = localStorage.getItem('lastPlayer');
  }

  const initialState = { page: 'nickname' };
  history.replaceState(initialState, '', '#nickname');

  if (nickname) startGame();
  
  window.addEventListener('popstate', function(event) {
    if (event.state) {
      handleNavigationState(event.state);
    }
  });

  function handleNavigationState(state) {
    switch(state.page) {
      case 'nickname': showNicknameScreen(); break;
      case 'game': if (nickname) { showGameScreen(); } else { showNicknameScreen(); } break;
    }
  }

  function showNicknameScreen() {
    $('#game-section').hide();
    $('#back-button').hide();
    $('#nickname-section').show();
    score = 0;
    $('#score').text('0');
    $('#guess-input').val('');
    $('#message').empty();
    $('#message').hide();
  }

  function showGameScreen() {
    $('#nickname-section').hide();
    $('#game-section').show();
    $('#back-button').show();
  }

  async function fetchNewPokemon() {
    if (isLoading) return;
    isLoading = true;
    $('#pokemon-image-front').addClass('loading');
    $('#pokemon-image-back').addClass('loading');
    $('#submit-guess').prop('disabled', true);
    $('#skip-guess').prop('disabled', true);
    $('#guess-input').prop('disabled', true);
    
    try {
      const filtered = generations.filter(gen => gen.active);
      const filteredCount = filtered.length;
      const randomGenerationIndex = Math.floor(Math.random() * filteredCount);
      const range = filtered[randomGenerationIndex];

      const randomId = Math.floor(Math.random() * (range.end - range.start) + range.start);
      const response = await $.ajax({ url: `https://pokeapi.co/api/v2/pokemon/${randomId}`, method: 'GET' });
      currentPokemon = { 
        name: response.name.split('-')[0],
        image_front: response.sprites.front_default || response.sprites.other['official-artwork'].front_default,
        image_back: response.sprites.back_default || response.sprites.other['official-artwork'].back_default
      };

      const img_front = new Image();
      img_front.onload = function() {
        $('#pokemon-image-front')
          .attr('src', currentPokemon.image_front)
          .removeClass('loading revealed');
        $('#submit-guess').prop('disabled', false);
        $('#skip-guess').prop('disabled', false);
        $('#guess-input').prop('disabled', false);
        isLoading = false;
      };
      img_front.src = currentPokemon.image_front;

      const img_back = new Image();
      img_back.onload = function() {
        $('#pokemon-image-back')
          .attr('src', currentPokemon.image_back)
          .removeClass('loading revealed');
        $('#submit-guess').prop('disabled', false);
        $('#skip-guess').prop('disabled', false);
        $('#guess-input').prop('disabled', false);
        isLoading = false;

        $('#pokemon-with-anotation-back').show();
      };
      if (currentPokemon.image_back == undefined) $('#pokemon-with-anotation-back').hide();
      else img_back.src = currentPokemon.image_back;
    } catch (error) {
      showMessage('Error loading Pokémon. Please try again!', 'error');
      isLoading = false;
    }
  }

  function updateLeaderboard() {
    var currentHighScore = 0;
    if (leaderboard.get(nickname)) currentHighScore = leaderboard.get(nickname).score;
    const isNewHighScore = score > currentHighScore;
    if (isNewHighScore) {
      leaderboard.set(nickname, { score: score, pokemons: guessedPokemons});
      const sortedLeaderboard = Array.from(leaderboard.entries())
        .map(([nickname, result]) => ({ nickname, result }))
        .sort((a, b) => b.result.score - a.result.score);
      localStorage.setItem('pokemonLeaderboard', JSON.stringify(sortedLeaderboard));
      updateLeaderboardDisplay(nickname);
      showMessage(`Game Over! The correct answer was ${currentPokemon.name}. New personal best score: ${score}!`, 'success');
    } else {
      showMessage(`Game Over! The correct answer was ${currentPokemon.name}. Your score: ${score}. Your best: ${currentHighScore}`, 'error');
    }
  }

  function updateLeaderboardDisplay(newHighScoreNickname = null) {
    const $leaderboardList = $('#leaderboard-list');
    $leaderboardList.empty();
    const sortedLeaderboard = Array.from(leaderboard.entries())
      .map(([nickname, result]) => ({ nickname, result }))
      .sort((a, b) => b.result.score - a.result.score);
    sortedLeaderboard.forEach((entry, index) => {
      let pokeString = "";
      for (let i = 0; i < entry.result.pokemons.length; i++) {
        const pokemonName = entry.result.pokemons[i];
        pokeString += pokemonName;
        if (i != entry.result.pokemons.length - 1) {
          pokeString += ", ";
        }
      }

      const $entry = $('<div>')
        .addClass('leaderboard-entry');

      const $name = $('<p>').text(`${index + 1}. ${entry.nickname}: ${entry.result.score}`);
      const $pokemonListOut = $('<p>').text(pokeString).addClass('pokemon-listout');

      $entry.append($name);
      $entry.append($pokemonListOut);

      if (entry.nickname === newHighScoreNickname) {
        $entry.addClass('new-high-score');
      }
      $leaderboardList.append($entry);
    });
  }

  function startGameValidate() {
    nickname = $('#nickname-input').val().trim();
    if (!nickname) {
      showMessage('Please enter a nickname first!', 'error');
      return;
    }
    if (generations.filter(gen => gen.active).length === 0) {
      showMessage('Please choose at least one generation!', 'error');
      return;
    }
    startGame();
  }

  function startGame() {
    $('#message').hide();
    localStorage.setItem('lastPlayer', nickname);
    $('#current-player').text(`${nickname} is playing`);
    history.pushState({ page: 'game' }, '', '#game');
    showGameScreen();
    fetchNewPokemon();
  }

  $('#back-to-nickname').click(function() {
    const confirmMessage = score > 0 ? 'Going back will reset your current score. Continue?' : 'Do you want to change your nickname?';
    if (confirm(confirmMessage)) {
      history.pushState({ page: 'nickname' }, '', '#nickname');
      showNicknameScreen();
    }
  });

  function reduceDuplicity(acc, char) {
    if (acc.length == 0) return acc + char;
    else if (char != acc[acc.length - 1]) return acc + char;
    else return acc;
  }

  function wordsLetterDiff(a, b) {
    const aTrimmed = a.trim().split('').reduce(reduceDuplicity, '');
    const bTrimmed = b.trim().split('').reduce(reduceDuplicity, '');
    const min = Math.min(aTrimmed.length, bTrimmed.length);

    var diffCounter = Math.abs(aTrimmed.length - bTrimmed.length);
    for (let i = 0; i < min; i++) {
      if (aTrimmed[i] != bTrimmed[i]) diffCounter += 1;
    }
    
    return diffCounter;
  }

  function checkGuess() {
    if (isLoading) return;
    const guess = $('#guess-input').val().trim().toLowerCase();
    if (!guess) {
      showMessage('Please enter a guess!', 'error');
      return;
    }

    let guessDifference = wordsLetterDiff(guess, currentPokemon.name);
    let ratio = guessDifference / currentPokemon.name.length;
    if (ratio <= 0.2) {
      score++;
      $('#score').text(score);
      $('#guess-input').val('');
      showMessage(`Correct, it was ${currentPokemon.name}! Here comes another one!`, 'success');
      guessedPokemons.push(currentPokemon.name);
      fetchNewPokemon();
    } else {
      gameOver();
    }
  }

  function skipGuess() {
    if (isLoading) return;
    fetchNewPokemon();
  }

  function gameOver() {
    $('#pokemon-image-front').addClass('revealed');
    $('#pokemon-image-back').addClass('revealed');
    updateLeaderboard();
    const playAgainButton = $('<button>')
      .text('Play Again')
      .click(resetGame);
    $('#message').append(playAgainButton);
    $('#submit-guess').prop('disabled', true);
    $('#skip-guess').prop('disabled', true);
    $('#guess-input').prop('disabled', true);
  }

  function resetGame() {
    score = 0;
    $('#score').text('0');
    $('#guess-input').val('').prop('disabled', false);
    $('#submit-guess').prop('disabled', false);
    $('#message').empty()
      .hide();
    guessedPokemons = [];
    fetchNewPokemon();
  }

  function showMessage(text, type) {
    $('#message')
      .show()
      .text(text)
      .attr('class', `message ${type}`);
  }

  $('#nickname-form').submit(function (event) {
    event.preventDefault();
    startGameValidate();
  });
  $('#submit-guess').click(checkGuess);
  $('#skip-guess').click(skipGuess)
  $('#guess-input').keypress(function(e) {
    if (e.which === 13) {
      checkGuess();
    }
  });
  $('#back-button').click(function() {
    history.back();
  });

  if (window.location.hash === '#game' && nickname) {
    showGameScreen();
  } else {
    showNicknameScreen();
  }
});
