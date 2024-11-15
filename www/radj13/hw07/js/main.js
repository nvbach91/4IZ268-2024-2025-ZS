/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let drivers = ['Lando Norris', 'Lewis Hamilton', 'Charles Leclerc', 'Oscar Piastri', 'Fernando Alonso', 'Max Verstapen', 'George Russell', 'Carlos Sainz', 'Alexander Albon', 'Sergio Perez'];
drivers = drivers.concat(drivers);
drivers.sort(() => {
    return 0.5 - Math.random();
});

let score = 0;
let matchedCards = 0;
let firstCard = null;
let secondCard = null;
let isFlipping = false;

const cardField = document.querySelector('#game-field');
const scoreField = document.querySelector('#points');

const setupGame = (card) => {
    card.addEventListener('click', () => {
        if(isFlipping || card.classList.contains('revealed')){
            return;
        }
        if(firstCard !== null && secondCard !== null){
            return;
        }
        card.classList.add('revealed');
        
        if(firstCard === null){
            firstCard = card;
            return;
        }
        else{
            secondCard = card;
            isFlipping = true;
            if(firstCard.innerText !== secondCard.innerText){
                if(score !== 0){
                    score--;
                }
                setTimeout(() => {
                    firstCard.classList.remove('revealed');
                    secondCard.classList.remove('revealed');
                    firstCard = null;
                    secondCard = null;
                    isFlipping = false;
                }, 1000);
            }
            else{
                score++;
                matchedCards += 2;
                firstCard = null;
                secondCard = null;
                isFlipping = false;
            }
        }
        if(matchedCards === drivers.length){
            alert(`Congrats on finishing the game. Your final score is: ${score}`);
        }
        scoreField.innerText = score;
    });
};

const createCards = (content) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerText = content;
    setupGame(card);
    cardField.appendChild(card);
};

drivers.forEach((driver) => {
    createCards(driver);
  });



