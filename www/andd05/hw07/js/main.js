/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

var cities = [
  { name: 'Prague', img: 'images/prague.jpg' },
  { name: 'Tokyo', img: 'images/tokyo.jpg' },
  { name: 'Berlin', img: 'images/berlin.jpg' },
  { name: 'Washington D.C.', img: 'images/washington.jpg' },
  { name: 'Moscow', img: 'images/moscow.jpg' },
  { name: 'Brasilia', img: 'images/brasilia.jpg' },
  { name: 'Beijing', img: 'images/beijing.jpg' },
  { name: 'London', img: 'images/london.jpg' },
  { name: 'Helsinki', img: 'images/helsinki.jpg' },
  { name: 'Ottawa', img: 'images/ottawa.jpg' }
];
cities = cities.concat(cities);
cities.sort(() => {
  return 0.5 - Math.random();
});

var points = 0;
var firstFlippedCard = null;
var secondFlippedCard = null;
var nRevealedCards = 0;

var gameField = document.querySelector('#game-field');
var pointsElement = document.querySelector('#points');


cities.forEach(city => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerText = 'The Ultimate Pexeso';

  card.dataset.city = city.name;
  card.style.backgroundImage = `url(${city.img})`;
  card.style.backgroundImage = 'none';

  card.addEventListener('click', () => {
    if (card.classList.contains('flipped')) {
      return false;
    }
    if (firstFlippedCard && secondFlippedCard) {
      return false;
    }
    if (!card.classList.contains('flipped')) {
      card.innerText = city.name;
      card.classList.add('flipped');
      card.style.backgroundImage = `url(${city.img})`;

      if (!firstFlippedCard) {
        firstFlippedCard = card;
      } else if (!secondFlippedCard) {
        secondFlippedCard = card;

        // Check for a match
        if (firstFlippedCard.innerText === secondFlippedCard.innerText) {
          points ++;
          pointsElement.innerText = points;
          firstFlippedCard = null;
          secondFlippedCard = null;
          nRevealedCards += 2;

          // Check if the game is won
          if (nRevealedCards === cities.length) {
            setTimeout(() => {
              alert(`Congratulations! You finished the game with ${points} points!`);
            }, 1000);
            
          }
        } else {
          // Not a match; hide cards after a short delay
          if (points > 0) {
            points --;
          pointsElement.innerText = points;
          }
          setTimeout(() => {
            firstFlippedCard.innerText = 'The Ultimate Pexeso';
            secondFlippedCard.innerText = 'The Ultimate Pexeso';
            firstFlippedCard.classList.remove('flipped');
            secondFlippedCard.classList.remove('flipped');
            firstFlippedCard.style.backgroundImage = 'none';
            secondFlippedCard.style.backgroundImage = 'none';
            firstFlippedCard = null;
            secondFlippedCard = null;
          }, 2000);
        }
      }
    }
  });

  gameField.append(card);
});
