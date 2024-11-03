let cities = ['Prague', 'London', 'Paris', 'Moscow', 'California', 'Vancouver', 'Sydney', 'Berlin', 'Tokyo', 'Dublin'];
cities = cities.concat(cities); 
cities.sort(() => 0.5 - Math.random()); 

let firstCard = null;
let secondCard = null;
let score = 0;
let revealedPairs = 0;
const maxPairs = cities.length / 2; 
const gameBoard = document.getElementById('game-board');
const scoreBoard = document.getElementById('score-board');

function updateScore(points) {
    score = Math.max(0, score + points);
    scoreBoard.textContent = `Score: ${score}`;
}

function createCard(city) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.city = city;

    card.addEventListener('click', () => {
        if (card.classList.contains('revealed') || secondCard) return; // Zabránění dalšímu otáčení při probíhajícím tahu
        card.textContent = city; 
        card.classList.add('revealed');

        if (!firstCard) {
            firstCard = card;
        } else {
            secondCard = card;
            checkMatch();
        }
    });
    return card;
}

function checkMatch() {
    if (firstCard.dataset.city === secondCard.dataset.city) {
        updateScore(1);
        revealedPairs++;
        firstCard = null;
        secondCard = null;
        if (revealedPairs === maxPairs) {
            setTimeout(() => alert(`Gratulace! Hra dokončena s výsledkem: ${score} bodů.`), 500);
        }
    } else {
        updateScore(-1);
        setTimeout(() => {
            firstCard.textContent = '';
            secondCard.textContent = '';
            firstCard.classList.remove('revealed');
            secondCard.classList.remove('revealed');
            firstCard = null;
            secondCard = null;
        }, 1000);
    }
}

function initializeGame() {
    cities.forEach(city => {
        const card = createCard(city);
        gameBoard.appendChild(card);
    });
}

initializeGame();
