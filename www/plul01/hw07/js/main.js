/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

const _bands = ['Blink-182', 'Sum41', 'Simple Plan', 'Bloodhound Gang', 'Billy Talent', 'Fall Out Boy', 'The Offspring', 'Bowling For Soup', 'All Time Low', 'Bring Me The Horizon'];
var bands = _bands.concat(_bands);
bands.sort(() => {
  return 0.5 - Math.random();
});

let cardOne = null
let cardTwo = null
let point = 0
let pairsFound = 0
let stopGame = false

const gameField = document.getElementById('game-field');
const displayPoints = document.getElementById('points');

function cardCreation(band) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.band = band;
    card.innerText = band;

    card.addEventListener('click', () => clickActiveCard(card));
    return card;
}

function clickActiveCard(card) {
    if (stopGame || card === cardOne || card.classList.contains('shown')) return;
    card.classList.add('shown');

    if(!cardOne) {
        cardOne = card;
    } else {
        cardTwo = card;
        isPair()
    }
}

function isPair() {
    stopGame = true;
    if (cardOne.dataset.band === cardTwo.dataset.band) {
        pairsDone();
    } else {
        backFlip();
    }
}

function pairsDone() {
    cardOne.removeEventListener('click', clickActiveCard);
    cardTwo.removeEventListener('click', clickActiveCard);

    point ++;
    pairsFound ++;
    newTurn();
    if(pairsFound === bands.length/2){
        setTimeout(() => alert(`Game Over, Score: ${point}`), 500);
    }
    pointCount();
}

function backFlip() {
    setTimeout(() => {
        cardOne.classList.remove('shown');
        cardTwo.classList.remove('shown');
        point = 0;
        pointCount();
        newTurn()
    }, 1000);
}

function newTurn() {
    [cardOne, cardTwo, stopGame] = [null, null, false];
}

function pointCount() {
    displayPoints.innerText = point;
}

function gamePlay () {
    bands.forEach(band => {
        const card = cardCreation(band);
        gameField.appendChild(card);
    });
    pointCount();
}

gamePlay();
