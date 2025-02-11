/**
Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs.
Vytvořte zjednodušenou hru Pexeso pro jednoho hráče čistě pomocí JavaScriptu a CSS pro stylování (tj. nebudete šahat do výchozího HTML souboru).

Hra bude spočívat v postupném otáčení karet. V každém tahu hráč otočí postupně dvě karty a pokud se shodují, přičte si jeden bod a karty zůstanou odhalené. Pokud se neshodují, tak se karty vrátí do původního neodhaleného stavu a hráči se odečte jeden bod. Počet bodů nesmí být jít do minusu.

Karty budou obsahovat anglické názvy měst po celém světě: třeba Prague, London, Paris, Moscow, California, Vancouver, Sydney... a podle nich také budete porovnávat shody. Alternativně můžete tam dát třeba názvy států, názvy rostlin, názvy vlaků, názvy ulic, názvy zvířat, názvy firem, jména fotbalistů, jména pokémonů, ... prostě cokoliv, ale musí to tématicky dávat smysl.

Na herní plochu umístěte alespoň 20 karet (tj. do 5 sloupců a 4 řádky, a to vždy sudý počet) v náhodném pořadí.

Po kliknutí se karta otočí (tj. stačí aby byl vidět obsah karty, tj. název města, nemusíte dělat animace). Hra skončí ve chvíli, kdy jsou všechny karty odhaleny a uživateli se zobrazí celkový počet bodů.

Používejte pouze Vanilla JavaScript, případně ES6, tj. bez knihovny

Nezávazný návod (pokud nevíte jak začít):
Vytvořte potřebné CSS třídy pro hrací plochu, karty ve výchozím stavu, karty v otočeném stavu apod. Vítána je příprava obrázků podle názvů měst. V tom případě budete pomocí JavaScriptu měnit CSS, aby se zobrazily ne názvy měst ale jejich obrázky.
Vyberte DOM element pro hrací plochu a element pro výpis počtu bodů.
Nadefinujte seznam měst do pole.
Naduplikujte tento seznam, aby každé město tam bylo dvakrát, pomocí metody array.concat(array).
Aby hra byla zajímavější, zamíchejte pořadí měst pomocí array metody array.sort(), a to následovně:

let cities = ['Barcelona', 'Dortmund', 'Madrid', 'Turin', '...'];
cities = cities.concat(cities);
cities.sort(() => { return 0.5 - Math.random(); });

Vytvořte pomocné proměnné, abyste mohli sledovat stav hry, tj. počet bodů, první otočená karta, druhá otočená karta, počet správně otočených karet...
Vytvořte funkci, která bude mít na starost vytvořit jednu kartu pomocí DOM metod.
    document.createElement(...);
    element.classList.add(...);
    element.innerText = '...';
    element.addEventListener(...);
    parent.appendChild(...);
    Přitom nabindujte událost kliknutí na kartu. Při této události by se mělo odhalit vybraná karta a aktualizovat stav hry.
    Viditelnost obsahu karty naimplemenujte dle libosti, třeba to bude
    pomocí barvy písmena a pozadí, pak jenom změníte barvu jednoho z nich
    pomocí vnořeného elementu, který by měl display none, atd.
    Pro porovnání obsahu karet můžete použít dvě globální proměnné, které se budou měnit dle stavu hry v závislosti na právě otevřených kartách. Např. když kliknete na první kartu tak se přiřadí do první proměnné. Když kliknete na druhou kartu, tak se přiřadí do druhé proměnné a pak budete porovnávat jejich obsahy. Po skončení tahu se obě proměnné resetují po cca dvou sekundách a začne nový tah.
    Uživatel může při jednom tahu otočit maximálně dvě karty, tj. během těch 2 sekund nesmí uživatel otáčet další karty. Používejte funkci setTimeout() pro povolení nového tahu. Stav zamrznutí hry lze poznat tak, že v obou proměnných jsou uložené dvě karty. Po skončení těch 2 sekund do nich dosadíte třeba null a tehdy může hráč provést další tah.
Pomocí této funkce budete vytvářet 20+ karet v cyklu podle seznamu měst a pak je budete vkládat do hrací plochy všechny najednou - aby se stránka zbytečně nepřekreslovala v cyklu
Vhodným způsobem se pokuste o prevenci podvádění hráčů.
*/

// Array with names of cities
let cities = ['Prague', 'London', 'Paris', 'Moscow', 'Sydney', 'New York', 'Tokyo', 'Barcelona', 'Berlin', 'Vancouver'];

// duplicates array and sorts in a random order
cities = cities.concat(cities);
cities.sort(() => {
    return 0.5 - Math.random();
});

// Other important variables
let score = 0;
let firstCard = null;
let secondCard = null;
let isGameFrozen = false;
const gameFieldElement = document.querySelector('#game-field');
const pointsElement = document.querySelector('#points');

// Function that runs when webpage is loaded
const initialize = (() => {
    pointsElement.textContent = score;
    cities.forEach((element) => createCard(element));
});

// Function that creates a card and adds a click event listener
const createCard = ((cityName) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = cityName;

    card.addEventListener('click', () => {
        if (isGameFrozen || card.classList.contains('revealed')) {
            return;
        }

        card.classList.add('revealed');

        if (firstCard === null) {
            firstCard = card;
        } else if (secondCard === null) {
            secondCard = card;
            isGameFrozen = true;

            if (firstCard.textContent === secondCard.textContent) {
                cities = cities.filter(cityName => cityName != firstCard.textContent);
                firstCard = null;
                secondCard = null;
                isGameFrozen = false;
                updatePoints(1);
                if (cities.length === 0) {
                    alert('You win!');
                }
            } else {
                setTimeout(() => {
                    firstCard.classList.remove('revealed');
                    secondCard.classList.remove('revealed');
                    firstCard = null;
                    secondCard = null;
                    isGameFrozen = false;
                    if (score != 0) {
                        updatePoints(-1);
                    }
                }, 1000);
            };
        };
    });

    gameFieldElement.append(card);
});

// Function for adding or subtracting points
const updatePoints = ((change) => {
    score = score + change;
    pointsElement.textContent = score;
});



initialize();