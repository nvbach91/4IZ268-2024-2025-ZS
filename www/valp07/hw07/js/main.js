/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let cities = ['Barcelona', 'Dortmund', 'Madrid', 'Turin', 'Prague', 'Tokyo', 'Beijing', 'Seoul', 'Sydney', 'New York'];
cities = cities.concat(cities);
cities.sort(() => { return 0.5 - Math.random(); });

var points = 0;
var firstSelected = null;
var secondSelected = null;
var foundCities = 0;

var gameField = document.querySelector('#game-field');
var pointCounter = document.querySelector('#points');

const createCards = itemList => {
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');
  for (let i = 0; i < itemList.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');

    const paragraph = document.createElement('p');
    paragraph.textContent = itemList[i];

    card.appendChild(paragraph);
    cardContainer.appendChild(card);
  }
  return cardContainer;
};
document.body.appendChild(createCards(cities));

const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('click', () => {
    if (firstSelected === null && secondSelected === null && !card.classList.contains('found') && !card.classList.contains('front')) {
      card.classList.toggle('front');
      firstSelected = card;
    } else if (firstSelected.innerText === card.innerText && firstSelected != card && secondSelected === null && !card.classList.contains('found') && !card.classList.contains('front')) {
      secondSelected = card;
      card.classList.toggle('found');
      firstSelected.classList.toggle('found');
      points++;
      pointCounter.innerText = points;
      foundCities++;
      firstSelected = null;
      secondSelected = null;
    } else if (firstSelected != null && firstSelected != secondSelected && secondSelected === null && !card.classList.contains('found') && !card.classList.contains('front')) {
      card.classList.toggle('front');
      secondSelected = card;
      setTimeout(() => {
        card.classList.remove('front');
        firstSelected.classList.remove('front');
        firstSelected = null;
        secondSelected = null;
      }, 2000);
      if (points > 0) {
        points--;
      }
      pointCounter.innerText = points;
    }

    else {

    }
    if (foundCities === 10) {
      setTimeout(function () {
        alert('You have won the game with ' + points + ' points');
      }, 1000);
    }
  });
});