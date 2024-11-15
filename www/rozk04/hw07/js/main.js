/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let cities = ['Prague', 'London', 'Paris', 'Berlin', 'Tokyo', 'Nairobi', 'Helsinki', 'Jakarta', 'Ottawa', 'Riga'];
cities = cities.concat(cities);
cities.sort(() => {
  return 0.5 - Math.random();
});

let points = 0;
let flippedCards = [];
let matchedPairs = 0;

const gameField = document.getElementById('game-field');
const pointsDisplay = document.getElementById('points');

function createCard(city) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.city = city;
    card.addEventListener('click', flipCard);
    gameField.appendChild(card);
}

cities.forEach(city => createCard(city));

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('revealed')) {
        this.classList.add('revealed'); 
        this.textContent = this.dataset.city; 
        flippedCards.push(this);
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.city === card2.dataset.city) {
        points += 1; 
        matchedPairs += 1; 
        flippedCards = []; 
        if (matchedPairs === cities.length / 2) {
            setTimeout(() => {
                alert("Gratulace! Hra dokončena. Body:" + points);
            }, 500);
        }
    } else {
        points = Math.max(points - 1, 0); 
        setTimeout(() => {
            card1.classList.remove('revealed');
            card2.classList.remove('revealed');
            card1.textContent = ''; 
            card2.textContent = ''; 
            flippedCards = []; 
        }, 1000);
    }
    updatePoints();
}

function updatePoints() {
    pointsDisplay.textContent = points; 
}