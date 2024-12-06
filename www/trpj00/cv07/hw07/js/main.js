let cities = [
  "Prague",
  "Berlin",
  "Paris",
  "Rome",
  "Madrid",
  "Vienna",
  "Brussels",
  "Warsaw",
  "Athens",
  "Lisbon",
];
cities = cities.concat(cities);
cities.sort(() => {
  return 0.5 - Math.random();
});

let revealedCards = [];
let points = 0;
let matchedPairs = 0;
let acceptingClicks = true;

const gameField = document.querySelector("#game-field");
const pointCounter = document.querySelector("#points");

const createCard = (city) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.city = city;

  card.addEventListener("click", () => {
    if (
      !acceptingClicks ||
      card.classList.contains("revealed") ||
      card.classList.contains("matched")
    )
      return;

    revealCard(card);
    revealedCards.push(card);

    if (revealedCards.length === 2) {
      acceptingClicks = false;
      const [firstCard, secondCard] = revealedCards;

      if (firstCard.dataset.city === secondCard.dataset.city) {
        evaluatePoint(true);
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        revealedCards = [];
        matchedPairs++;
        acceptingClicks = true;

        if (matchedPairs === cities.length / 2) {
          setTimeout(() => {
            alert(`Game Over! You scored ${points} points.`);
          }, 500);
        }
      } else {
        setTimeout(() => {
          hideCard(firstCard);
          hideCard(secondCard);
          evaluatePoint(false);
          revealedCards = [];
          acceptingClicks = true;
        }, 2000);
      }
    }
  });

  return card;
};

const revealCard = (card) => {
  card.classList.add("revealed");
  card.innerText = card.dataset.city;
};

const hideCard = (card) => {
  card.classList.remove("revealed");
  card.innerText = "";
};

const evaluatePoint = (isMatch) => {
  if (isMatch) {
    points++;
  } else if (points > 0) {
    points--;
  }
  pointCounter.textContent = points;
};

const createGameField = (cities) => {
  for (let city of cities) {
    const card = createCard(city);
    gameField.appendChild(card);
  }
};

createGameField(cities);
