/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let cities = ['Prague', 'Barcelona', 'Paris', 'Ljublana', 'Rome', 'Berlin', 'London', 'Tokyo', 'Turin', 'Madrid'];
const shuffledCities = [...cities, ...cities].sort(() => 0.5 - Math.random());

let firstCard = null;
let secondCard = null;
let points = 0;
let matchesFound = 0;
let freezeBoard = false;

const gameField = document.getElementById('game-field');
const pointsDisplay = document.getElementById('points');

function createCard(city) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.city = city;
    card.innerText = city;

    card.addEventListener('click', () => handleCardClick(card));

    return card;
}


function handleCardClick(card) {
    // Pokud je deska zmrazená, nebo karta již byla otočena, nic neudělej
    if (freezeBoard || card === firstCard || card.classList.contains('revealed')) return;

    card.classList.add('revealed');

    
    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkForMatch();
    }
}


function checkForMatch() {
    freezeBoard = true; 

    
    if (firstCard.dataset.city === secondCard.dataset.city) {
        matchedCards();
    } else {
        unflipCards();
    }
}


function matchedCards() {
    firstCard.removeEventListener('click', handleCardClick);
    secondCard.removeEventListener('click', handleCardClick);

    points++;
    matchesFound++;

    resetTurn();

    if (matchesFound === cities.length) {
        setTimeout(() => alert(`Hra ukončena! Vaše skóre: ${points}`), 500);
    }

    updatePoints();
}



function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('revealed');
        secondCard.classList.remove('revealed');

        
        points = Math.max(0, points - 1);
        
        updatePoints();
        resetTurn();
    }, 1000);
}


function updatePoints() {
    pointsDisplay.innerText = points;
}


function resetTurn() {
    [firstCard, secondCard, freezeBoard] = [null, null, false];
}


function initGame() {
    shuffledCities.forEach(city => {
        const card = createCard(city);
        gameField.appendChild(card);
    });
    updatePoints();
}

initGame();