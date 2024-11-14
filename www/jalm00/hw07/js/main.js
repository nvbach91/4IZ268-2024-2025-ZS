/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let cities = ['Tokyo', 'Delhi', 'Shanghai', 'Sao Paulo', 'Mexico City', 'Cairo', 'Mumbai', 'Beijing', 'Dhaka', 'Osaka'];
cities = cities.concat(cities);
cities.sort(() => {
  return 0.5 - Math.random();
});

let selectedCards = [];
let guessedCards = [];
const pointsDisplay = document.querySelector('#points');
let playerPoints = 0;

const gameField = document.querySelector('#game-field');

const createCard = (city, id) => {
  let card = document.createElement('div');
  gameField.appendChild(card);
  card.classList.add('card');
  card.setAttribute('id', id);
  let cityNameP = document.createElement('p');
  cityNameP.innerHTML = city;
  card.appendChild(cityNameP);

  cityNameP.style.display = 'none';
};

const loadOnClick = (id) => {
  const element = document.getElementById(id);

  element.addEventListener('click', () => {
    revealCard(id);
  });
};

const compareSelectedCards = () => {
  let firstCard = cities[selectedCards[0]];
  let secondCard = cities[selectedCards[1]];

  if (firstCard === secondCard) {
    playerPoints++;
    pointsDisplay.innerHTML = playerPoints;
    guessedCards.push(firstCard, secondCard);
    selectedCards = [];
  } else {
    playerPoints--;
    if (playerPoints < 0) playerPoints = 0;
    pointsDisplay.innerHTML = playerPoints;
    setTimeout(() => {
      hideCards();
    }, 800);
  }
};

const revealCard = (id) => {
  if (selectedCards.length < 2 && !guessedCards.includes(cities[id])) {
    const element = document.getElementById(id);
    element.firstChild.style.display = 'block';
    selectedCards.push(id);

    if (selectedCards.length === 2) {
      compareSelectedCards();
    }
  }
};

const hideCards = () => {
  selectedCards.forEach((id) => {
    const element = document.getElementById(id);
    element.firstChild.style.display = 'none';
  });
  selectedCards = [];
};

cities.forEach((city, index) => createCard(city, index));
cities.forEach((_, index) => loadOnClick(index));
