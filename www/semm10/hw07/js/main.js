/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

var pokemons = ['Orwell', 'Kafka', 'McEvan', 'Dickens', 'Hemingway', 'Tolkien', 'Verne', 'Wilde', 'Murakami', 'Poe'];
pokemons = pokemons.concat(pokemons);
pokemons.sort(() => {
    return 0.5 - Math.random();
});

var firstCard = null;
var secondCard = null;
var points = 0;
var cardsRevealed = 0;
var currCardsRevealed = 0;

const pointsCounter = document.getElementById("points");
const gameField = document.getElementById("game-field");

//createCards();


    pokemons.forEach((pokemon) => {
        var card = document.createElement("div");
        card.classList.add("card");
        card.innerText = pokemon;
        card.pokemonName = pokemon;
        card.addEventListener("click", resolveCardClick)
        gameField.appendChild(card);
    });

function resolveCardClick(event) {
    const card = event.target;

    if (card.classList.contains('revealed') || currCardsRevealed == 2) {
        return;
    }

    card.classList.add('revealed');
    currCardsRevealed++;

    if (currCardsRevealed == 1) {
        firstCard = card;
    } else {
        secondCard = card;
        resolveMatch()
    }
}

function resolveMatch() {
    setTimeout(() => {
        if (firstCard.pokemonName == secondCard.pokemonName) {
            points++;
            cardsRevealed += 2;

            if (cardsRevealed === pokemons.length) {
                setTimeout(function () {
                    alert('Congratulations! You have completed the game with ' + points + ' points');
                }, 1000);
            }
        } else {
            if (points > 0) {
                points -= 1;
            }
            firstCard.classList.remove('revealed');
            secondCard.classList.remove('revealed');
            firstCard = null;
            secondCard = null;
        }
        currCardsRevealed = 0;
        refreshPointCounter();
    }, 1000);
}

function refreshPointCounter() {
    pointsCounter.innerText = points;
}
