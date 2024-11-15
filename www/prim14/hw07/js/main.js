/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

const cities = [
  "Prague",
  "Tokyo",
  "Paris",
  "London",
  "New York",
  "Berlin",
  "Moscow",
  "Madrid",
  "Rome",
  "Vienna",
];

var selectedCards = [];
var totalPoints = 0;
var citiesLeft = cities.length;

/**
 * Updated the points number displayed on page
 */
const updateTotalPoints = () => {
  const pointsElement = document.getElementById("points");
  pointsElement.innerText = totalPoints;
};

/**
 * Handles the card click event
 * @param {*} event
 */
const handleCardClick = (event) => {
  let [firstCard, secondCard] = selectedCards;

  // if two cards are already selected, do nothing
  if (firstCard && secondCard) {
    return;
  }

  //push the card to selected cards
  const card = event.target;
  setCardRevealed(card, true);
  selectedCards.push(card);

  [firstCard, secondCard] = selectedCards;

  //check if two cards are selected
  if (selectedCards.length === 2) {
    // validate if the cards match
    if (firstCard.dataset.city === secondCard.dataset.city) {
      totalPoints += 1;
      citiesLeft -= 1;
      updateTotalPoints();

      firstCard.removeEventListener("click", handleCardClick);
      secondCard.removeEventListener("click", handleCardClick);
      selectedCards = [];

      checkEndGame();
    } else {
      // if not, hide them and substract a point
      if (totalPoints > 0) {
        totalPoints -= 1;
        updateTotalPoints();
      }

      setTimeout(() => {
        setCardRevealed(firstCard, false);
        setCardRevealed(secondCard, false);
        selectedCards = [];
      }, 1000);
    }
  }
};

/**
 * Sets the revealed value of a card
 * @param {Element} card
 * @param {boolean} revealed
 */
const setCardRevealed = (card, revealed) => {
  if (revealed) {
    card.classList.add("revealed");
  } else {
    card.classList.remove("revealed");
  }
};

/**
 * Initializes the game by shuffling cards and setting up the game board
 */
const initializeGame = () => {
  const citiesDoubled = cities.concat(cities);
  citiesDoubled.sort(() => {
    return 0.5 - Math.random();
  });

  const gameBoard = document.getElementById("game-field");
  citiesDoubled.forEach((city) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.city = city;
    card.innerText = city;
    card.addEventListener("click", handleCardClick);
    gameBoard.appendChild(card);
  });
};

/**
 * Checks if the game has ended and alerts the user
 */
const checkEndGame = () => {
  if (citiesLeft === 0) {
    alert("You won!");
  }
};

initializeGame();
updateTotalPoints();
