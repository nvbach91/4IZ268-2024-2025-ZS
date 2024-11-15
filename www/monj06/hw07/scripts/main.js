const heading = document.createElement("h1");
document.body.appendChild(heading);
heading.innerText = "Pexeso";

const table = document.createElement("div");
table.id = 'table';
document.body.appendChild(table);

const pointsDiv = document.createElement("div");
pointsDiv.id = 'pointsDiv';
document.body.appendChild(pointsDiv);
pointsDiv.innerText = "Body: ";

let points = 0;
let MatchedCards = [];
let LastTwo = [];
let canFlip = true;

let capitalCities = [
    "Prague", "London", "Paris", "Berlin", "Madrid", "Rome", "Vienna", "Lisbon", "Warsaw", "Budapest",
    "Athens", "Amsterdam", "Brussels", "Copenhagen", "Stockholm", "Oslo", "Helsinki", "Dublin", "Bern", "Luxembourg",
    "Bratislava", "Ljubljana", "Sofia", "Belgrade", "Zagreb", "Sarajevo", "Skopje", "Podgorica", "Tirana", "Tallinn",
    "Riga", "Vilnius", "Minsk", "Moscow", "Kyiv", "Chisinau", "Bucharest", "Ankara", "Nicosia", "Tbilisi",
    "Yerevan", "Baku", "Nur-Sultan", "Astana", "Tashkent", "Ashgabat", "Dushanbe", "Bishkek", "Beijing", "Tokyo",
    "Seoul", "Pyongyang", "Bangkok", "Hanoi", "Vientiane", "Phnom Penh", "Naypyidaw", "Jakarta", "Manila", "Kuala Lumpur",
    "Singapore", "Brunei", "Canberra", "Wellington", "Port Moresby", "Suva", "Apia", "Nuku'alofa", "Port Vila", "Honiara",
    "Tarawa", "Yaren", "Majuro", "Palikir", "Washington, D.C.", "Ottawa", "Mexico City", "Guatemala City", "Tegucigalpa", "San Salvador",
    "Managua", "San Jose", "Panama City", "Havana", "Kingston", "Nassau", "Port-au-Prince", "Santo Domingo", "Bogota", "Caracas",
    "Lima", "Quito", "Brasilia", "Buenos Aires", "Santiago", "Asuncion", "Montevideo", "Sucre", "La Paz", "Georgetown"
];

function createShuffledPairs(cities, numPairs) {
    let selectedCities = [];
    for (let i = 0; i < numPairs; i++) {
        const randomCity = cities[Math.floor(Math.random() * (cities.length))];
        selectedCities.push(randomCity, randomCity);
    }
    return selectedCities.sort(() => Math.random() - 0.5);
}

function PlaceCards(NubmerOfCards) {
    const cityPairs = createShuffledPairs(capitalCities, NubmerOfCards/2);
    cityPairs.forEach((city, i) => {
        const tile = document.createElement("button");
        const cityName = document.createElement("p");
        cityName.classList.add('hidden');
        tile.id = `card${i}`;
        tile.classList.add('card');
        table.appendChild(tile);
        document.getElementById(`card${i}`).appendChild(cityName);
        cityName.innerText = city;
    });
}

function TurnCards() {
    const buttons = document.querySelectorAll('.card');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (!canFlip || MatchedCards.includes(button) || LastTwo.includes(button)){
                return;
            } 

            const cityName = button.querySelector("p");
            cityName.classList.remove("hidden");
            cityName.classList.add("shown");

            LastTwo.push(button);
            
                if (LastTwo.length === 2) {
                    canFlip = false;
                    const firstCard = LastTwo[0];
                    const secondCard = LastTwo[1];

                    if (firstCard.querySelector("p").innerText === secondCard.querySelector("p").innerText) {
                        MatchedCards.push(firstCard);
                        MatchedCards.push(secondCard);
                        AddPoints();
                        LastTwo = [];
                        canFlip = true;
                    } else {
                        RemovePoints();
                        setTimeout(() => {
                            TurnCardsBack(LastTwo);
                            LastTwo = [];
                            canFlip = true;
                    }, 1000);
                    }
                    console.log(LastTwo);
                    console.log(MatchedCards);
                }
        });
    });
}

function AddPoints() {
    points += 1;
    const pointsDIV = document.getElementById("pointsdIV");
    pointsDiv.innerText = `Body: ${points}`;
}

function RemovePoints() {
    if(points > 0){
        points -= 1;
    }
    const pointsDIV = document.getElementById("pointsdIV");
    pointsDiv.innerText = `Body: ${points}`;
}


function TurnCardsBack(turnedCards) {
        turnedCards.forEach(card => {
            card.querySelector("p").classList.add("hidden");
            card.querySelector("p").classList.remove("shown");
        });
}

PlaceCards(20);
TurnCards();