/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

var cities = ['Prague', 'Paris', 'Berlin', 'Bratislava', 'Rome',  'Moscow', 'California', 'Vancouver', 'Sydney', 'Turin'];
cities = cities.concat(cities); 
cities.sort(() => 0.5 - Math.random());

var gameField = document.querySelector('#game-field');
var pointsContainer = document.querySelector('#points');

var cardOne = null;
var cardTwo = null;
var countOfCards = 0;
var currentPoints = 0;
var correctCards = 0;

function createCards() {
    for (let index = 0; index < cities.length; index++) {
        var element = cities[index];
        var card = document.createElement('div');
        card.classList.add('card');
        card.innerText = element;
        SetUpCard(card);
        gameField.appendChild(card);
    }
}

function SetUpCard(card) {
    card.addEventListener('click', function() {
        if (!card.classList.contains('revealed') && countOfCards < 2) {
            card.classList.add('revealed');
            
            countOfCards++;
            
            if (countOfCards === 1) {
                cardOne = card; 
            } else if (countOfCards === 2) {
                cardTwo = card; 

                if (checkIfSameCards()) {
                    currentPoints++;
                    correctCards += 2;
                    pointsContainer.innerText = currentPoints;
                    resetSelection();
                    if (correctCards === cities.length) {
                        setTimeout(function() {
                          alert('Congratulations! You have won the game and have ' + currentPoints + ' points');
                        }, 1000);
                    }
                } else {
                    currentPoints--;
                    if(currentPoints < 0)
                    {
                        currentPoints = 0;
                    }
                    pointsContainer.innerText = currentPoints;
                    setTimeout(HideCards, 1000);
                }
            }
        }
    });
}

function checkIfSameCards() {
    return cardOne.innerText === cardTwo.innerText;
}

function HideCards() {
    cardOne.classList.remove('revealed');
    
    cardTwo.classList.remove('revealed');
    
    resetSelection();
}

function resetSelection() {
    cardOne = null;
    cardTwo = null;
    countOfCards = 0;
}

createCards();
