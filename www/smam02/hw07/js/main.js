/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let cities = ['Stanislav Lobotka', 'Milan Škriniar', "Dávid Hancko", "Tomáš Suslov", "Ondrej Duda",
  "Martin Dúbravka", "Peter Pekarík", "Robert Boženík", "Denis Vavro", "Michal Vajlent"];
cities = cities.concat(cities);
cities.sort(() => {
  return 0.5 - Math.random();
});

const gameField = document.getElementById('game-field');

let activeCard = null;
let lock = false;

const pointsCounter = document.getElementById("points");

let pointCount = 0;

cities.forEach((city) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerText = city;
  card.addEventListener('click', () => {
    if (!card.classList.contains('final') && !lock) {
      card.classList.add('revealed');
      if (activeCard !== null && activeCard !== card) {
        if (activeCard.innerText !== card.innerText) {
          const currentCard = card;
          const currentActiveCard = activeCard;
          lock = true;
          setTimeout(() => {
            currentCard.classList.remove('revealed');
            currentActiveCard.classList.remove('revealed');
            lock = false;
            if (pointCount - 1 >= 0) {
              pointCount--;
              pointsCounter.innerText = pointCount;
            }
          }, 500);
        } else {
          pointCount++;
          pointsCounter.innerText = pointCount;
          activeCard.classList.add('final');
          card.classList.add('final');
        }
        activeCard = null;
      } else {
        activeCard = card;
      }
    }

  });
  gameField.appendChild(card);
});