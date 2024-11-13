const cities = ['Prague', 'London', 'Paris', 'Moscow', 'California', 'Vancouver', 'Sydney', 'Berlin', 'Tokyo', 'Dubai'];
let shuffledCities = cities.concat(cities); 
shuffledCities.sort(() => 0.5 - Math.random()); 

let firstCard = null;
let secondCard = null;
let revealedCards = 0;
let points = 0;
let freezeGame = false;

const pointsDisplay = document.getElementById("points");
const gameField = document.getElementById("game-field");


function updatePoints() {
    pointsDisplay.innerText = points;
}


function createCard(city) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.city = city;

    card.addEventListener("click", () => {
        if (freezeGame || card.classList.contains("revealed") || card === firstCard) return;

        card.classList.add("revealed");
        card.innerText = city;

        if (!firstCard) {
            firstCard = card;
        } else {
            secondCard = card;
            checkMatch();
        }
    });

    gameField.appendChild(card);
}


function checkMatch() {
    freezeGame = true;
    if (firstCard.dataset.city === secondCard.dataset.city) {
        points++;
        revealedCards += 2;
        resetTurn();
        if (revealedCards === shuffledCities.length) {
            setTimeout(() => alert(`Game Over! Your total points: ${points}`), 500);
        }
    } else {
        points = Math.max(0, points - 1);
        setTimeout(() => {
            firstCard.classList.remove("revealed");
            secondCard.classList.remove("revealed");
            firstCard.innerText = "";
            secondCard.innerText = "";
            resetTurn();
        }, 1000);
    }
    updatePoints();
}


function resetTurn() {
    [firstCard, secondCard] = [null, null];
    freezeGame = false;
}


function initGame() {
    gameField.innerHTML = "";
    shuffledCities.forEach(city => createCard(city));
    updatePoints();
}

initGame();
