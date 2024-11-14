document.addEventListener('DOMContentLoaded', function() {
  const gameField = document.getElementById('game-field');
  const pointsDisplay = document.getElementById('points');
  const cities = [
    'Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 
    'Olomouc', 'České Budějovice', 'Hradec Králové', 'Ústí nad Labem', 'Pardubice', 
    'Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 
    'Olomouc', 'České Budějovice', 'Hradec Králové', 'Ústí nad Labem', 'Pardubice'
  ];

  let points = 0;
  let firstCard = null;
  let secondCard = null;
  let canFlip = true;
  let matchedPairs = 0;

  // Zamíchání měst
  function shuffleCities() {
    cities.sort(() => Math.random() - 0.5);
  }
  
  // Vytvoření jednotlivých karet
  function createCard(cityName) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = cityName;

    const front = document.createElement('div');
    front.classList.add('front');
    front.innerText = cityName;

    const back = document.createElement('div');
    back.classList.add('back');

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', function() {
      flipCard(card);
    });

    gameField.appendChild(card);
  }

  // Funkce pro otočení karty
  function flipCard(card) {
    if (!canFlip || card.classList.contains('revealed')) return;

    card.classList.add('revealed');

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      canFlip = false;

      setTimeout(function() {
        checkMatch();
      }, 1000);
    }
  }

  // Funkce pro kontrolu shody karet
  function checkMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
      points++;
      matchedPairs++;
      updatePoints();
      resetTurn();
    } else {
      points = Math.max(0, points - 1);
      updatePoints();

      setTimeout(function() {
        firstCard.classList.remove('revealed');
        secondCard.classList.remove('revealed');
        resetTurn();
      }, 1000);
    }

    if (matchedPairs === cities.length / 2) {
      setTimeout(function() {
        alert('Gratulace! Vyhrál/a jste hru! Vaše konečné skóre: ' + points);
        resetGame();
      }, 500);
    }
  }

  // Funkce pro reset tahu
  function resetTurn() {
    firstCard = null;
    secondCard = null;
    canFlip = true;
  }

  // Funkce pro aktualizaci bodů
  function updatePoints() {
    pointsDisplay.innerText = 'Skóre: ' + points;
  }

  // Funkce pro restart hry
  function resetGame() {
    points = 0;
    matchedPairs = 0;
    updatePoints();
    gameField.innerHTML = '';
    shuffleCities();
    cities.forEach(function(city) {
      createCard(city);
    });
  }

  // Spuštění hry poprvé
  shuffleCities();
  cities.forEach(function(city) {
    createCard(city);
  });
});
