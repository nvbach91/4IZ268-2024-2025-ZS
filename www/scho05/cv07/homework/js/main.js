/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let cities = ['Prague', 'Bratislava', 'Viena', 'Munich', 'Paris', 'Tel Aviv', 'Madrid', 'Stockholm', 'Budapest', 'Tokyo'];
cities = cities.concat(cities);
cities.sort(() => {
    return 0.5 - Math.random();
});

const gameField = document.getElementById('game-field');
const pointsDisplay = document.getElementById('points');
let points = 0;

const newCard = (city) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerText = '';
    card.addEventListener('click', () => {
        openCard(card, city);
    });
    return card;
};

if (gameField)
    cities.forEach(city => {
        const card = newCard(city);
        gameField.appendChild(card);
    });

let firstCard = null;
let secondCard = null;
let lockBoard = false;

const openCard = (card, city) => {
    if (lockBoard) return;
    if (card === firstCard || card.classList.contains('revealed')) return;

    card.classList.add('revealed');
    card.innerText = city;

    if (firstCard === null) {
        firstCard = card;
    } else {
        secondCard = card;
        lockBoard = true;
        compareCards();
    }
};

const compareCards = () => {
    if (firstCard.innerText === secondCard.innerText) {
        points++;
        pointsDisplay.innerText = points;
        resetCards();
        checkForMatch();
    } else {
        points--;
        if (points < 0) points = 0;
        pointsDisplay.innerText = points;
        setTimeout(() => {
            resetCards();
        }, 1200);
    }
};

const resetCards = () => {
    if (firstCard && secondCard) {
        if (firstCard.innerText !== secondCard.innerText) {
            firstCard.classList.remove('revealed');
            firstCard.innerText = '';
            secondCard.classList.remove('revealed');
            secondCard.innerText = '';
        }
    }

    firstCard = null;
    secondCard = null;
    lockBoard = false;
};

const checkForMatch = () => {
    const allCards = document.querySelectorAll('.card');
    const allRevealed = Array.from(allCards).every(card => card.classList.contains('revealed'));

    if (allRevealed) {
        alert("Congrats! You have achieved " + points + " points.");
    };
};