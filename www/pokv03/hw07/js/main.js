const cities = ["Prague", "Berlin", "Vienna", "Warsaw", "Amsterdam", "Brussels", "Zurich", "Munich", "Paris", "Oslo"];
let points = 0;
document.getElementById("points").textContent = points;

const shuffledCities = cities.concat(cities).sort(() => 0.5 - Math.random());
const gameField = document.getElementById("game-field");
let revealedCards = [];
let isProcessing = false;

shuffledCities.forEach(city => {
  const cityDiv = document.createElement("div");
  cityDiv.textContent = city;
  cityDiv.className = "card";
  
  cityDiv.addEventListener("click", () => {
    if (isProcessing || cityDiv.classList.contains("guessed") || cityDiv.classList.contains("revealed")) {
        return;
    }

    cityDiv.classList.add("revealed");
    revealedCards.push(cityDiv);

    if (revealedCards.length === 2) {
        isProcessing = true;
        const [card1, card2] = revealedCards;

        if (card1.textContent === card2.textContent) {
            setTimeout(() => {
                card1.classList.remove("revealed");
                card1.classList.add("guessed");
                card2.classList.remove("revealed");
                card2.classList.add("guessed");
                updatePoints(10);
                removeRevealedIfNotGuessed(revealedCards);
                isWinner();
                isProcessing = false;
            }, 1000);
        } else {
            setTimeout(() => {
                card1.classList.remove("revealed");
                card2.classList.remove("revealed");
                updatePoints(-1);
                removeRevealedIfNotGuessed(revealedCards);
                isProcessing = false;
            }, 1200);
        }
        revealedCards = [];
    }
  });

  gameField.appendChild(cityDiv);
});

function removeRevealedIfNotGuessed(revealedCards) {
    revealedCards.forEach(card => {
        if (!card.classList.contains("guessed")) {
        card.classList.remove("revealed");
        }
    });
}

function updatePoints(newPoints) {
    if(points + newPoints >= 0){
        points += newPoints;
        document.getElementById("points").textContent = points;
    }
}

function isWinner() {
    const allCards = document.querySelectorAll("#game-field .card");
    const allGuessed = Array.from(allCards).every(card => card.classList.contains("guessed"));
    
    if (allGuessed) {
        const winningText = document.querySelector("h2.winning-text");
        winningText.style.display = "block";
    }
}

