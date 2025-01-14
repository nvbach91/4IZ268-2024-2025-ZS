function getFavoriteExercises() {
	return JSON.parse(localStorage.getItem("favoriteExercises")) || [];
}

async function displayFavoriteExercises() {
	const favorites = getFavoriteExercises();

	console.log("favorites", favorites);

	if (favorites.length === 0) {
		const listContainer = document.getElementById("exercises-list");
		listContainer.innerHTML =
			'<li class="list-group-item">No favorite exercises yet. 😢</li>';
		return;
	}

	const listContainer = document.getElementById("exercises-list");
	listContainer.innerHTML = "";

	for (const favorite of favorites) {
		console.log(favorite);

		try {
			const response = await fetch(
				`https://excercisedb.vercel.app/api/v1/exercises/${favorite}`
			);

			const exerciseDetails = await response.json();

			const listItem = document.createElement("li");
			listItem.className = "list-group-item";
			listItem.style = "text-transform: capitalize;";

			const link = document.createElement("a");
			link.href = `exercise.html?e=${exerciseDetails.data.exerciseId}`;
			link.textContent = exerciseDetails.data.name;
			link.className = "text-dark";

			listItem.appendChild(link);

			listContainer.appendChild(listItem);
		} catch (error) {
			console.error(
				`Error fetching exercise details for ID: ${favorite.id}`,
				error
			);
		}
	}
}

$(document).ready(function () {
	displayFavoriteExercises();
});
