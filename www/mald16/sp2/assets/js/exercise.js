function arrayToSentence(arr) {
	if (arr.length === 0) return "";
	if (arr.length === 1) return arr[0];
	const lastItem = arr.pop();
	return `${arr.join(", ")} and ${lastItem}`;
}

function generateListFromArray(arr) {
	if (arr.length === 0) return "";

	let listHTML = '<ul class="list-group list-group-flush list-group-numbered">';

	listHTML += arr
		.map(
			(item) =>
				`<li class="list-group-item">${item.replace(/^Step:\d+\s*/, "")}</li>`
		)
		.join("");

	listHTML += "</ul>";

	return listHTML;
}

const exerciseId = getUrlParameter("e");
const settings = {
	async: true,
	url: `https://excercisedb.vercel.app/api/v1/exercises/${exerciseId}`,
	method: "GET",
};

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

$.ajax(settings).done(function (response) {
	console.log(response);

	const bodyParts = response.data.bodyParts;
	const exerciseId = response.data.exerciseId;
	const equipments = response.data.equipments;
	const src = response.data.gifUrl;
	const instructions = response.data.instructions;
	const name = response.data.name;
	const targetMuscles = response.data.targetMuscles;
	const secondaryMuscles = response.data.secondaryMuscles;

	$("#body-parts").html(bodyParts);
	$("#body-parts").attr("href", "bodypart.html?bp=" + bodyParts);
	$("#exercise-name").html(name);
	$("#page-title").html(name);
	$("#page-title").html(name);
	$("#exercise-img").attr("src", src);
	$("#exercise-img").attr("alt", name);
	$("#target-muscles").html(arrayToSentence(targetMuscles));
	$("#secondary-muscles").html(arrayToSentence(secondaryMuscles));
	$("#equipments").html(arrayToSentence(equipments));
	$("#steps").html(generateListFromArray(instructions));

	$("#exercise-img").on("load", function () {
		$("#spinner").remove();
		$("#exercise-img").fadeIn(300);
	});

	if (checkFavouriteExercise(exerciseId)) {
		$("#save-ex").addClass("disabled");
		$("#remove-ex").removeClass("disabled");
	} else {
		$("#save-ex").removeClass("disabled");
		$("#remove-ex").addClass("disabled");
	}

	$("#save-ex").click(function () {
		saveFavoriteExercise(exerciseId);
	});

	$("#remove-ex").click(function () {
		removeFavoriteExercise(exerciseId);
	});
});
