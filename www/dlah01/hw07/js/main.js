/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */
document.addEventListener('DOMContentLoaded', () => {
  const gameField = document.getElementById('game-field');
  const flowers = ['Daisy', 'Orchid', 'Tulip', 'Peony', 'Sunflower', 'Buttercup', 'Daffodil', 'Lavender', 'Iris', 'Marigold', 'Daisy', 'Orchid', 'Tulip', 'Peony', 'Sunflower', 'Buttercup', 'Daffodil', 'Lavender', 'Iris', 'Marigold']
  ;
  
  let points = 0;
  let firstCard = null;
  let secondCard = null;
  let canFlip = true;
  let matchedPairs = 0;


  flowers.sort(() => 0.5 - Math.random());

  function createCard(flowerName, index) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.name = flowerName;
      
      const front = document.createElement('div');
      front.classList.add('front');
      front.innerText = flowerName;
      
      const back = document.createElement('div');
      back.classList.add('back');

      card.appendChild(front);
      card.appendChild(back);

      card.addEventListener('click', () => flipCard(card));

      gameField.appendChild(card);
  }

  function flipCard(card) {
      if (!canFlip || card.classList.contains('revealed')) return;

      card.classList.add('revealed');

      if (!firstCard) {
          firstCard = card;
      } else {
          secondCard = card;

          canFlip = false;

          setTimeout(() => {
              checkMatch();
          }, 1000);
      }
  }

  function checkMatch() {
      if (firstCard.dataset.name === secondCard.dataset.name) {
          points++;
          matchedPairs++;  
          updatePoints();  
          resetTurn();
      } else {
          points = Math.max(0, points - 1);
          updatePoints();
          setTimeout(() => {
              firstCard.classList.remove('revealed');
              secondCard.classList.remove('revealed');
              resetTurn();
          }, 1000);
      }

      if (matchedPairs === flowers.length / 2) {
          setTimeout(() => {
              alert(`Congratulations! You won the game! Your final points: ${points}`);
          }, 500);
      }
  }

  function resetTurn() {
      firstCard = null;
      secondCard = null;
      canFlip = true;
  }

  function updatePoints() {
      document.getElementById('points').innerText = `Points: ${points}`;
  }

  flowers.forEach((flower, index) => createCard(flower, index));
});
