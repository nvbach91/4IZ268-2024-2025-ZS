var drugs = ['Kratom', 'Cocaine', 'Marijuana', 'Meth', 'Crack', 'Fentanyl', 'Shrooms', 'LSD', 'Ecstasy', 'Alcohol'];
drugs = drugs.concat(drugs);
drugs.sort(() => Math.random() - 0.5);

var firstCard = null;
var secondCard = null;
var cardsRevealed = 0;
var currentCardsRevealed = 0;
var points = 0;

const pointsCounter = document.getElementById("points");
const gameField = document.getElementById("game-field");

function initializeGame() {
  gameField.innerHTML = "";
  points = 0;
  cardsRevealed = 0;
  currentCardsRevealed = 0;
  firstCard = null;
  secondCard = null;
  refreshPointCounter();

  drugs.forEach((drug) => {
    var card = document.createElement("div");
    card.classList.add("card");
    card.drugName = drug;
    card.addEventListener("click", resolveCardClick);
    gameField.appendChild(card);
  });
}

function resolveCardClick(event) {
  const card = event.target;

  if (card.classList.contains('revealed') || currentCardsRevealed === 2) {
    return;
  }

  card.classList.add('revealed');
  card.innerText = card.drugName;
  currentCardsRevealed++;

  if (currentCardsRevealed === 1) {
    firstCard = card;
  } else {
    secondCard = card;
    checkMatch();
  }
}

function checkMatch() {
  setTimeout(() => {
    if (firstCard.drugName === secondCard.drugName) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      points++;
      cardsRevealed += 2;

      if (cardsRevealed === drugs.length) {
        setTimeout(() => {
          alert('You have won with ' + points + ' points');
          initializeGame();
        }, 500);
      }
    } else {
      if (points > 0) points--;
      firstCard.classList.remove('revealed');
      secondCard.classList.remove('revealed');
      firstCard.innerText = "";
      secondCard.innerText = "";
    }

    firstCard = null;
    secondCard = null;
    currentCardsRevealed = 0;
    refreshPointCounter();
  }, 750);
}

function refreshPointCounter() {
  pointsCounter.innerText = points;
}

initializeGame();
