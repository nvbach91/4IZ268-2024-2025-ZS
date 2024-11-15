var cities = [
	"Prague",
	"Brno",
	"Denpasar",
	"Singapore",
	"Madrid",
	"Honolulu",
	"Tokyo",
	"Hanoi",
	"Torronto",
	"Oslo",
];
cities = cities.concat(cities);
cities.sort(() => 0.5 - Math.random());

const gameField = document.getElementById("game-field");
const pointsDisplay = document.getElementById("points");
let points = 0;
let revealedCards = [];
let matchedPairs = 0;

cities.forEach((city) => {
	const card = document.createElement("div");
	card.classList.add("card");
	card.innerText = city;
	card.cityName = city;
	card.addEventListener("click", handleCardClick);
	gameField.appendChild(card);
});

function handleCardClick(event) {
	const card = event.target;

	if (card.classList.contains("revealed") || revealedCards.length == 2) {
		return;
	}

	card.classList.add("revealed");
	revealedCards.push(card);

	if (revealedCards.length == 2) {
		checkForMatch();
	}
}

function checkForMatch() {
	const [card1, card2] = revealedCards;
	const isMatch = card1.cityName == card2.cityName;

	setTimeout(() => {
		if (isMatch) {
			matchedPairs++;
			points++;
			card1.removeEventListener("click", handleCardClick);
			card2.removeEventListener("click", handleCardClick);
		} else {
			points = Math.max(0, points - 1);
			card1.classList.remove("revealed");
			card2.classList.remove("revealed");
		}

		pointsDisplay.textContent = points;
		revealedCards = [];

		if (matchedPairs == cities.length / 2) {
			alert("Game over! You scored " + points + " points!");
		}
	}, 1000);
}
