/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let cities = ['Prague', 'London', 'Brno', 'Dubai', 'Paris', 'Berlin', 'New York', 'Barcelona', 'Rome', 'Oslo'];
cities = cities.concat(cities);
cities.sort(() => {
  return 0.5 - Math.random();
});

const gameField = document.getElementById('game-field');
const points = document.getElementById('points');
let pointsScore = 0;

let card1 = null;
let card2 = null;
let isProcessing = false;

const fragment = document.createDocumentFragment();

cities.forEach((city) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.textContent = '';
  card.addEventListener('click', () => {
    if (!isProcessing && !card.classList.contains('revealed') && !card.classList.contains('matched')) {
      card.textContent = city;
      card.classList.add('revealed');
      updateGameState(card);
    }
  });
  fragment.appendChild(card);
});

const updateGameState = (card) => {
  if (card1 === null) {
    card1 = card;
    console.log('card1: ' + card1.textContent);
  } else if (card2 === null) {
    card2 = card;
    console.log('card2: ' + card2.textContent);
    isProcessing = true;

    if (card1.textContent === card2.textContent) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      card1 = null;
      card2 = null;
      pointsScore++;
      points.textContent = pointsScore;
      isProcessing = false;
    } else {
      // Cards do not match
      setTimeout(() => {
        card1.textContent = '';
        card2.textContent = '';
        card1.classList.remove('revealed');
        card2.classList.remove('revealed');
        card1 = null;
        card2 = null;
        if (pointsScore > 0) {
          pointsScore--;
        }
        points.textContent = pointsScore;
        isProcessing = false;
      }, 1000);
    }
  }
};

if (card1 != null && card2 != null) {
  setTimeout(() => {
    card1 = null;
    card2 = null;
  }, 2000);
}

gameField.appendChild(fragment);