let cities = ['Mumbai', 'Tokyo', 'Hanoi', 'Beijing', 'Singapore', 'Shanghai', 'Kathmandu', 'Taipei', 'Seoul', 'Bangkok'];
cities = cities.concat(cities);
cities.sort(() => 0.5 - Math.random());

const gameField = document.getElementById('game-field');
const pointsElement = document.getElementById('points');
let flippedCards = [];
let matchedPairs = 0;
let points = 0;

function createCards() {
    cities.forEach(city => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.city = city;
        card.addEventListener('click', flipCard);
        gameField.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
        this.classList.add('flipped');
        this.classList.add('revealed');
        this.textContent = this.dataset.city;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.city === card2.dataset.city) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        points += 1;
        updatePoints();
        if (matchedPairs === cities.length / 2) {
            setTimeout(() => alert('Congratulations, you matched all cities!'), 500);
        }
        resetFlip();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.classList.remove('revealed');
            card2.classList.remove('revealed');
            card1.textContent = "";
            card2.textContent = "";
            resetFlip();
        }, 500);
    }
}

function updatePoints() {
    pointsElement.textContent = points;
}

function resetFlip() {
    flippedCards = [];
}

createCards();
