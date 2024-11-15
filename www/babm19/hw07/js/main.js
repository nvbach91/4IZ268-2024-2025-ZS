// Seznam měst
const cities = ['Prague', 'Vienna', 'Budapest', 'Warsaw', 'Bratislava', 'Ljubljana', 'Zagreb', 'Berlin', 'Bern', 'Vilnius'];

let cards = cities.concat(cities);
cards.sort(() => 0.5 - Math.random());

let firstCard = null;
let secondCard = null;
let score = 0;
let flippedCards = 0;

// Vytvoření hrací plochy
const board = document.querySelector('.board');
const scoreDisplay = document.querySelector('.score');

cards.forEach(city => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.city = city;
  card.addEventListener('click', flipCard);
  board.appendChild(card);
});

function flipCard() {
  if (this.classList.contains('flipped') || secondCard) return;

  this.classList.add('flipped');
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
    score++;
    flippedCards += 2;
    resetCards();
  } else {
    score = Math.max(0, score - 1);
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.innerText = '';
      secondCard.innerText = '';
      resetCards();
    }, 1000);
  }
  scoreDisplay.innerText = `Score: ${score}`;

  if (flippedCards === cards.length) {
    setTimeout(() => alert(`Game over! Your score is ${score}`), 500);
  }
}

function resetCards() {
  firstCard = null;
  secondCard = null;
}
