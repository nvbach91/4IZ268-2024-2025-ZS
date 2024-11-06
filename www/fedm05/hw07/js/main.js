
let cities = ['Prague', 'Paris', 'Tokyo', 'New York', 'Sydney', 'Berlin', 'Rome', 'Toronto', 'Amsterdam', 'Barcelona'];

cities = cities.concat(cities);
cities.sort(() => {
  return 0.5 - Math.random();
});

// get elements
const gameField = document.querySelector("#game-field");
const pointsElement = document.querySelector("h2")

// useful global variables to make the game functional
let firstCard = null;
let secondCard = null;
let cardsMatch = null;
let gamePoints = 0;
let dataFirst = null;
let dataSecond = null;

const cardData = new Map();
const fragment = document.createDocumentFragment();


// function to call on click
const revealCard = (event) => {
  if (firstCard === null | secondCard === null){
    event.target.className = 'card revealed';
  };

  // if no card has been selected
  if (firstCard === null){
    firstCard = event.target;
    firstCard.innerText = cardData.get(firstCard).city;
    console.log(firstCard);
    return
  };  

  // first card selected but second not
  if ((firstCard !== null) & (secondCard === null) ){
    secondCard = event.target;
    dataFirst = cardData.get(firstCard).city;
    dataSecond = cardData.get(secondCard).city;
    secondCard.innerText = dataSecond;

    // check if card match
    cardsMatch = dataFirst === dataSecond;
    if (cardsMatch){
      gamePoints = gamePoints + 1;
      firstCard = null;
      secondCard = null;
      pointsElement.innerText = `Your points: ${gamePoints}`;
    }else{
      //otherwise lower points by 1, hide cards, add delay
      gamePoints = Math.max(0, gamePoints - 1);
      setTimeout(() => {
        pointsElement.innerText = `Your points: ${gamePoints}`;
        firstCard.className = 'card';
        secondCard.className = 'card';
        firstCard = null;
        secondCard = null;
      }, 2000);
    };
  };
};


// generate card boxes
cities.forEach(city => {
  const cityDiv = document.createElement('div');  
  cityDiv.className = 'card';
  cityDiv.addEventListener('click', revealCard);

  cardData.set(cityDiv, {city});

  fragment.appendChild(cityDiv);
});
// append the fragment at once
gameField.appendChild(fragment);
console.log(cardData);


