/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

var cats = ['Persian',
    'Siamese',
    'Maine Coon',
    'Sphynx',
    'Bengal',
    'Ragdoll',
    'British Shorthair',
    'Abyssinian',
    'Scottish Fold',
    'Siberian'];
cats = cats.concat(cats);
cats.sort(function() {
    return 0.5 - Math.random();
});

var first = null;
var second = null;
var openCards = 0;
var points = 0;
var gameField = document.querySelector('#game-field');
var pointsContainer = document.querySelector('#points');


const playPexeso = (card)=>{
    card.addEventListener('click', function(){
        if (card.classList.contains('revealed')) {
            return false;
        }

        if (first && second) {
            return false;
        }

        card.classList.add('revealed');

        if (!first){
            first = card;
            return false;
        }

        second = card;

        if(first.innerText === second.innerText){
            points++;
            openCards += 2;

            setTimeout(function() {
                first = null;
                second = null;
            }, 1000);

            if (openCards === cats.length) {
                setTimeout(function() {
                    alert('You got: ' + points + ' points and you get to see the cat!');
                }, 1000);
            }

        }else {
            points--;
            if (points < 0) {
                points = 0;
            }
            setTimeout(function() {
                first.classList.remove('revealed');
                second.classList.remove('revealed');
                first = null;
                second = null;
            }, 1000);
        }

        pointsContainer.innerText = points;


    });


};

const addCard = (name) => {
    var card = document.createElement('div');
    card.classList.add('card');
    card.innerText = name;
    playPexeso(card);
    gameField.appendChild(card);
}

cats.forEach(function(cat) {
    addCard(cat);
});