// Step 1: Define city names array
let races = ['Space Marines', 'Orks', 'Eldar', 'Tyranids', 'Necrons', 'Tau', 'Chaos', 'Imperial Guard', 'Sisters of Battle', 'Dark Eldar'];

// Step 2: Duplicate to create pairs and shuffle the array
races = races.concat(races);
races.sort(() => 0.5 - Math.random());

// Step 3: Track game state variables
let selectedCards = [];
let points = 0;
let lockBoard = false;

// Step 4: Select DOM elements
const gameField = document.getElementById('game-field');
const pointsDisplay = document.getElementById('points');

// Step 5: Create a function to generate cards
generateCards();

function generateCards() {
    races.forEach(city => {
        const card = document.createElement('div');
        card.classList.add('card', 'hidden'); // Initially hidden
        card.dataset.city = city;
        card.innerText = city;

        card.addEventListener('click', handleCardClick);

        gameField.appendChild(card);
    });
}

function handleCardClick() {
    if (lockBoard || selectedCards.includes(this) || this.classList.contains('revealed')) {
        return;
    }

    this.classList.remove('hidden');
    this.classList.add('revealed');
    selectedCards.push(this);

    if (selectedCards.length === 2) {
        lockBoard = true;
        checkForMatch();
    }
}

// Step 6: Check if two selected cards match
function checkForMatch() {
    const [firstCard, secondCard] = selectedCards;
    if (firstCard.dataset.city === secondCard.dataset.city) {
        points++;
        updatePoints();
        setMatchedCards();
    } else {
        points = Math.max(0, points - 1);
        updatePoints();
        setTimeout(() => {
            firstCard.classList.add('hidden');
            firstCard.classList.remove('revealed');
            secondCard.classList.add('hidden');
            secondCard.classList.remove('revealed');
            resetTurn();
        }, 1000);
    }
}

// Step 7: Set matched cards state
function setMatchedCards() {
    selectedCards.forEach(card => {
        card.classList.add('matched');
        card.style.backgroundColor = '#4db6ac'; // Change to a different blue after match
        card.removeEventListener('click', handleCardClick);
    });
    resetTurn();
}

// Step 8: Reset the cards after a turn
function resetTurn() {
    selectedCards = [];
    lockBoard = false;
}

// Step 9: Update points display
function updatePoints() {
    pointsDisplay.textContent = points;
}