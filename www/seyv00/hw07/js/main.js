/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

let creatures = ['Mermaid', 'Dragon', 'Fairy', 'Vampire', 'Werewolf', 'Basilisk', 'Minotaur', 'Zombie', 'Pegasus', 'Phoenix'];

let board = [];
creatures.forEach(creature => {
    board.push({type: 'text', name: creature});
    board.push({type: 'image', name: creature});
});

board.sort(() => {
  return 0.5 - Math.random();
});

const gameField = document.querySelector('#game-field');
const pointsContainer = document.querySelector('#points');
let points = 0;
let revealedCards = [];
let matchedCards = 0;

board.forEach(creature => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.creature = creature.name; // přidá datový atribut s aktuální hodnotou proměnné creature

    // sudá karta bude s textem, lichá s obrázkem
    if (creature.type === 'text') {
        card.innerText = creature.name;
    } else {
        const img = document.createElement('img');
        img.src = `https://eso.vse.cz/~seyv00/cv07/img/${creature.name}.png`;
        img.alt = creature.name;
        card.appendChild(img);
    }


    gameField.appendChild(card);

    card.addEventListener('click', () => {
        // pokud ještě nejsou otočené 2 karty, a karta není již otočená ani spárovaná
        if (revealedCards.length < 2 && !card.classList.contains('revealed') && !card.classList.contains('matched')) {
            card.classList.add('revealed'); 
            revealedCards.push(card);

            // pokud jsou otočené právě 2 karty
            if (revealedCards.length === 2) {
                const [card1, card2] = revealedCards; // přiřazení reference na otočené karty

                // pokud se otočené 2 karty rovnají
                if (card1.dataset.creature === card2.dataset.creature) {
                    points += 1;
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedCards += 2;
                    setTimeout(() => {
                        revealedCards = [];
                    }, 500);

                    if (matchedCards === board.length) {
                        setTimeout(() => {
                            alert(`Hra skončila, získali jste ${points} body/ů z mytologie!`)    
                        }, 500);
                    }
                    
                } else {
                    points -= 1;
                    if (points === -1) {
                        points = 0;
                    };

                    setTimeout(() => {
                        card1.classList.remove('revealed');
                        card2.classList.remove('revealed');
                        revealedCards = [];
                    }, 1000);
                }
            
                pointsContainer.textContent = points;
            }
        };
    });
    
});




