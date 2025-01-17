function checkFavouriteExercise(exercise) {
	const favorites = JSON.parse(localStorage.getItem("favoriteExercises")) || [];
	return favorites.includes(exercise);
}

function saveFavoriteExercise(exerciseId) {
	const favorites = JSON.parse(localStorage.getItem("favoriteExercises")) || [];

	if (checkFavouriteExercise(exerciseId)) {
		return;
	}

	favorites.push(exerciseId);
	localStorage.setItem("favoriteExercises", JSON.stringify(favorites));

	$("#save-ex").addClass("disabled");
	$("#remove-ex").removeClass("disabled");
}

function removeFavoriteExercise(exerciseId) {
	const favorites = JSON.parse(localStorage.getItem("favoriteExercises")) || [];

	const updatedFavorites = favorites.filter((fav) => fav !== exerciseId);
	localStorage.setItem("favoriteExercises", JSON.stringify(updatedFavorites));

	$("#save-ex").removeClass("disabled");
	$("#remove-ex").addClass("disabled");
}

function getFavoriteExercises() {
	return JSON.parse(localStorage.getItem("favoriteExercises")) || [];
}
