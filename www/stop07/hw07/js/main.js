/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let cities = ['Prague', 'London', 'Paris', 'Moscow', 'California', 'Vancouver', 'Sydney', 'Tokyo', 'Berlin', 'Rome'];
cities = cities.concat(cities); // Duplicitní seznam pro párování
cities.sort(() => 0.5 - Math.random()); // Zamíchání karet

const gameField = document.getElementById('game-field');
const pointsDisplay = document.getElementById('points');
let points = 0;
let revealedCards = [];
let matchedPairs = 0;

// Aktualizuje body hráče
function updatePoints() {
  pointsDisplay.textContent = points;
}

// Vytvoří jednu kartu s událostí kliknutí
function createCard(cityName) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.city = cityName;

  card.addEventListener('click', () => {
    // Zamezení otočení více než dvou karet najednou
    if (card.classList.contains('revealed') || revealedCards.length === 2) return;

    // Odhalení karty
    card.classList.add('revealed');
    card.innerText = cityName;
    revealedCards.push(card);

    // Pokud jsou odhaleny dvě karty, zkontroluje se shoda
    if (revealedCards.length === 2) {
      checkMatch();
    }
  });

  return card;
}

// Přidá karty do hracího pole
cities.forEach(city => {
  const card = createCard(city);
  gameField.appendChild(card);
});

// Kontroluje shodu karet
function checkMatch() {
  const [card1, card2] = revealedCards;

  if (card1.dataset.city === card2.dataset.city) {
    // Shoda - karty zůstanou odhalené
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs += 2;
    points++;
  } else {
    // Neshoda - po 1 sekunde se karty otočí zpět
    points = Math.max(points - 1, 0);
    setTimeout(() => {
      card1.classList.remove('revealed');
      card2.classList.remove('revealed');
      card1.innerText = '';
      card2.innerText = '';
    }, 1000);
  }

  revealedCards = [];
  updatePoints();

  // Kontrola konce hry
  if (matchedPairs === cities.length) {
    setTimeout(() => {
      alert(`Gratulujeme! Dosáhl jste ${points} bodů!`);
    }, 500);
  }
}
