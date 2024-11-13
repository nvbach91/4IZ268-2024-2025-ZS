/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

console.log('cau');
let drivers = ['Verstappen', 'Norris', 'Perez', 'Piastri', 'Leclerc', 'Sainz', 'Hamilton', 'Russel', 'Gasly', 'Ocon'];
drivers = drivers.concat(drivers);
drivers.sort(function() {
  return 0.5 - Math.random();
});

var firstRCard = null;
var secondRCard = null;
var points = 0;
var numberOfRevealed = 0;

const gameField = document.querySelector('#game-field');
var pointsContainer = document.querySelector('#points');

var bindCard = function (card) {
  card.addEventListener('click', function () {
    if (card.classList.contains('revealed')) {
      return false;
    }
    if (firstRCard && secondRCard) {
      return false;
    }
    card.classList.add('revealed');
    if (!firstRCard) {
      firstRCard = card;
      return false;
    }
    secondRCard = card;

    if (firstRCard.innerText === secondRCard.innerText) {
      points += 1;
      numberOfRevealed += 2;
      firstRCard = null;
      secondRCard = null;

      if (numberOfRevealed === drivers.length) {
        alert('Super, zvládol si to a máš ' + points + ' bodov');
      }
    }
    else {
      points -=1;
      if (points < 0 ){
        points = 0;
      }
      setTimeout(function() {
        firstRCard.classList.remove('revealed');
        secondRCard.classList.remove('revealed');
        firstRCard = null;
        secondRCard = null;
      }, 1000);
    }
    pointsContainer.innerText = points;
  });
};

var newCard = function (name) {
  var card = document.createElement('div');
  card.classList.add('card');
  card.innerText = name;
  bindCard(card);
  gameField.appendChild(card);
};
drivers.forEach(function (driver) {
  newCard(driver);
});

