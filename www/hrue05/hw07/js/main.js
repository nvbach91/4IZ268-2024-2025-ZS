/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

const gameBoard = document.querySelector('#game-field');
const pointsContainer = document.querySelector('#points');

var elements = ['Python', 'R', 'HTML', 'CSS', 'Javascript', 'C#', 'C++', 'Java', 'SQL', 'Julia'];
elements = elements.concat(elements);
elements.sort(() => {
  return 0.5 - Math.random();
});

var x1 = null;
var x2 = null;
var foundCards = 0;
var points = 0;

const addCard = (content) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.textContent = content;
  gameBoard.appendChild(card);
  card.addEventListener('click', (event) => {
    event.preventDefault();
    if (card.classList.contains('revealed')) {
      return null
    }
    else {
      if (x1 === null) {
        x1 = card;
        card.classList.add('revealed');
      }
      else if (x2 == null) {
        x2 = card;
        card.classList.add('revealed');
        if (x1.textContent == x2.textContent) {
          foundCards += 2;
          points += 1;
          setTimeout(() => {
            if (foundCards === elements.length) {
              window.alert(`Congratulations, you won with ${points} points!`);
            }
            x1 = null;
            x2 = null;
          },
            2000);
        }
        else {
          if (points > 0) {
            points -= 1;
          }
          setTimeout(() => {
            x1.classList.remove('revealed');
            x2.classList.remove('revealed');
            x1 = null;
            x2 = null;
          }, 2000);
        }
        pointsContainer.textContent = points;
      }
      else {
        return null;
      };
    }

  })
}

elements.forEach((element) => {
  addCard(element);
});




