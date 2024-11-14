/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */
window.addEventListener("DOMContentLoaded", () => {
    const cities = ['Prague', 'London', 'Paris', 'Moscow', 'Sydney', 'Tokyo', 'New York', 'Berlin', 'Rome', 'Madrid'];
    let cards = cities.concat(cities); 
    cards.sort(() => 0.5 - Math.random()); 

    let firstCard = null;
    let secondCard = null;
    let points = 0;
    let revealedCards = 0;
    const gameField = document.getElementById('game-field');
    const pointsDisplay = document.getElementById('points');
    const resetBtn = document.getElementById('reset');
    resetBtn.addEventListener("click", reset)
    function initGame() {
        cards.forEach(city => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.city = city;
            card.innerText = ''; 
            card.addEventListener('click', handleCardClick);
            gameField.appendChild(card);
        });
    }

    function reset() {
        cards.sort(() => 0.5 - Math.random()); 
        gameField.innerHTML = "";
        points = 0
        pointsDisplay.innerText = points;
        revealedCards = 0;
        firstCard = null;
        secondCard = null;
        initGame();
    }
    
    function handleCardClick(e) {
        const clickedCard = e.target;
    
        if (clickedCard === firstCard || clickedCard.classList.contains('revealed')) {
            return;
        }

        clickedCard.innerText = clickedCard.dataset.city;
        clickedCard.classList.add('revealed');
    
        if (!firstCard) {
            firstCard = clickedCard;
        } else {
            secondCard = clickedCard;
            gameField.style.pointerEvents = "none";
            checkMatch();
        }
    }
    
    function checkMatch() {
        if (firstCard.dataset.city === secondCard.dataset.city) {
            points++;
            revealedCards += 2;
            resetCards(true); 
        } else {
            points = Math.max(0, points - 1); 
            setTimeout(() => {
                resetCards(false)
            }, 2000);
        }
        pointsDisplay.innerText = points;
    
        if (revealedCards === cards.length) {
            alert(`Game over! Your total points: ${points}`);
        }
    }
    
    function resetCards(match) {
        if (!match) {
            firstCard.innerText = '';
            secondCard.innerText = '';
            firstCard.classList.remove('revealed');
            secondCard.classList.remove('revealed');
        }
        firstCard = null;
        secondCard = null;
        gameField.style.pointerEvents = "auto";
    }
    
    initGame();
})
