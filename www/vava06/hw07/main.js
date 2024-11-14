const cities = ['Prague', 'London', 'Paris', 'Moscow', 'California', 'Vancouver', 'Sydney','Berlin'];
let shuffledCities = cities.concat(cities).sort(() => 0.5 - Math.random());

const gameField = document.getElementById('game-field');
let points = 0;
let firstCard = null;
let secondCard = null;

document.getElementById('points').innerText = points;

function createCards() {
  shuffledCities.forEach(city => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.city = city;
    card.addEventListener('click', flipCard);
    gameField.appendChild(card);
  })}

function flipCard() {
  if (this === firstCard || this.classList.contains('revealed')) return;
  
  this.classList.add('revealed');
  this.innerText = this.dataset.city;
  
  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkMatch();
  }
}

function checkMatch() {
  if (firstCard.dataset.city === secondCard.dataset.city) {
    points++;
    document.getElementById('points').innerText = points;
    firstCard = null;
    secondCard = null;
  } else {
    document.getElementById('points').innerText = points;
    setTimeout(() => {
      firstCard.classList.remove('revealed');
      secondCard.classList.remove('revealed');
      firstCard.innerText = '';
      secondCard.innerText = '';
      firstCard = null;
      secondCard = null;
    }, 200);
  }
}

createCards();