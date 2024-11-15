/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

const gameField = document.querySelector('#game-field');
const points = document.querySelector('#points')

let animals = [
  'Cat', 'Dog', 'Penguin', 'Turtle', 'Rabbit', 'Hamster', 'Lion', 'Duck', 'Snake', 'Octopus'
];

animals = animals.concat(animals);
animals.sort(() => {
  return 0.5 - Math.random();
});

let score = 0;
let firstCard = null;
let secondCard = null;
let gameTimeout = false;

const createCard = (animalName) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.textContent = animalName;

  card.addEventListener('click', () => {
    if (gameTimeout || card.classList.contains('revealed')) {
      return;
    }

    card.classList.add('revealed');

    if (firstCard === null) {
      firstCard = card;
    } else if (secondCard === null) {
      secondCard = card;
      gameTimeout = true;

      if (firstCard.textContent === secondCard.textContent) {
        animals = animals.filter(animalName => animalName != firstCard.textContent);
        firstCard = null;
        secondCard = null;
        gameTimeout = false;
        score += 1;
        points.textContent = score;

        if (animals.length === 0) {
          alert(`Congratulations! Your score is: ${score}`);
        }

      } else {
        setTimeout(() => {
          firstCard.classList.remove('revealed');
          secondCard.classList.remove('revealed');
          firstCard = null;
          secondCard = null;
          gameTimeout = false;
          if (score > 0) {
            score -= 1;
            points.textContent = score;
          }
        }, 1000);
      };
    };
  });

  gameField.appendChild(card);
};

const createGameField = () => {
  animals.forEach((animal) => {
    createCard(animal);
  })
  score = 0;
  points.textContent = score;
};

createGameField();
