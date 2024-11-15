/*
* Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
*/

var cities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
cities = cities.concat(cities);
cities.sort(() => { return 0.5 - Math.random(); });

const gameFieldDiv = document.querySelector("#game-field");
let cardOne = null;
let cardTwo = null;
let cardOneText = "";
let cardTwoText = "";
let isFlippingAllowed = true;

let score = 0;
const pointsElement = document.querySelector("#points");
pointsElement.textContent = score;

cities.forEach((city) => {
  const card = document.createElement("div");
  const cardInner = document.createElement("div");
  const front = document.createElement("div");
  const back = document.createElement("div");

  card.classList.add("card", "hidden");
  cardInner.classList.add("card-inner");
  front.classList.add("front");
  back.classList.add("back");
  front.textContent = city;

  cardInner.appendChild(front);
  cardInner.appendChild(back);
  card.appendChild(cardInner);
  gameFieldDiv.appendChild(card);

  card.addEventListener("click", function() {
    if (!isFlippingAllowed || !card.classList.contains("hidden")) return;

    card.classList.remove("hidden");

    if (!cardOne) {
      cardOne = card;
      cardOneText = city;
    } else if (!cardTwo) {
      cardTwo = card;
      cardTwoText = city;

      isFlippingAllowed = false;

      if (cardOneText === cardTwoText) {
        score++;
        pointsElement.textContent = score;
        setTimeout(() => {
          cardOne.classList.add("matched");
          cardTwo.classList.add("matched");
          resetCards();
        }, 300);
      } else {
        if (score > 0) {
          score--;
          pointsElement.textContent = score;
        };

        setTimeout(() => {
          cardOne.classList.add("hidden");
          cardTwo.classList.add("hidden");
          resetCards();
        }, 2000);
      }
    }
  });
});

function resetCards() {
  cardOne = null;
  cardTwo = null;
  cardOneText = "";
  cardTwoText = "";
  isFlippingAllowed = true;
}