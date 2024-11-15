
/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let cats = ['Bengal', 'Ragdoll', 'Maine Coon', 'British Shorthair', 'Sphynx', 'Siamese', 'Persian', 'Abyssinian', 'Scottish Fold', 'Birman'];
cats = cats.concat(cats);
cats.sort(() => {
  return 0.5 - Math.random();
});

let points = 0;
let firstTurnedCard = null;
let secondTurnedCard = null;
let correctlyTurnedCards = 0;
let clickEnabled = true; // povolení kliknout na kartičku

const gameField = document.querySelector('#game-field');
const pointsContainer = document.querySelector('#points');
const createCard = (cardName) => {
  const element = document.createElement('div');
  element.classList.add('card');

  const image = document.createElement('div');
  image.classList.add('card-image');
  image.style.backgroundImage = `url('images/${cardName}.jpg')`; // obrázek z přiložené složky, důležité zachovat stejná jména obrázků a koček

  const text = document.createElement('div');
  text.classList.add('card-text');
  text.innerText = cardName;

  element.appendChild(image);
  element.appendChild(text);

  element.addEventListener('click', () => {
    if (!clickEnabled || element.classList.contains('revealed')) { // kontrola, že je možné kliknout na kartičku
      return; // nic se nestane, pokud je 2 vteřinová pauza, nebo pokud je konkrétní kartička již otočená
    }
    if (!element.classList.contains('revealed')) {
      element.classList.add('revealed'); // otočí kartu
      if (firstTurnedCard === null) {
        firstTurnedCard = element; // uloží první otočenou kartu
      } else if (secondTurnedCard === null) {
        secondTurnedCard = element; // uloží druhou otočenou kartu

        if (firstTurnedCard.innerText === secondTurnedCard.innerText) { // porovnání dvou otočených karet
          // shoda – obě karty zůstanou otočené, plus bod
          firstTurnedCard = null;
          secondTurnedCard = null;
          points++;
          correctlyTurnedCards += 2;
          if (correctlyTurnedCards === cats.length) { // kontrola, zda jsou všechny kartičky už otočené
            setTimeout(() => { // časová rezerva, aby se stihla otočit poslední karta
              alert(`Hurray, you've earned ${points} points from cat pexes!`)
            }, 500);
          }
        } else {
          if (points > 0) {
            points--;
          }
          clickEnabled = false; // zablokuje další kliknutí
          setTimeout(() => {
            firstTurnedCard.classList.remove('revealed');
            secondTurnedCard.classList.remove('revealed');
            firstTurnedCard = null;
            secondTurnedCard = null;
            clickEnabled = true;
          }, 2000); // freeze 2 s
        }
      }
    }
    pointsContainer.textContent = points; // zapíše body
  }); 
  gameField.appendChild(element);
};
cats.forEach((cat) => createCard(cat));