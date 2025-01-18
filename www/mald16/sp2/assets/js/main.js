const APP = $("#app");
const TITLE = $("#title");
const SUBTITLE = $("#subtitle");
const NAV_ITEMS = $("#nav-items");
const CARD = $(`<div class="card shadow-sm m-4 exercise">
                    <img
                        src="???"
                        class="card-img-top thumbnail object-fit-cover"
                        alt="???"
                    />
                    <div class="card-body">
                        <h5 class="card-title text-capitalize">???</h5>
                        <p class="card-text">???</p>
                        <div id="select" class="btn btn-primary mt-2"
                            ???</div
                        >
                    </div>
                </div>`);

const EXERCISE = $(`
            <div class="d-flex justify-content-center align-center mt-4 w-100 text-start">
					<img
						class="border rounded mx-2"
						id="exercise-img"
					/>
				<div class="exercise-descr-wrapper"> 
					<div>
						<strong>Target muscles:</strong>
						<span id="target-muscles"></span>
					</div>
					<div>
						<strong>Secondary muscles:</strong>
						<span id="secondary-muscles"></span>
					</div>
					<div>
						<strong>Equipment:</strong>
						<span id="equipments"></span>
					</div>
					<br />
					<div id="steps"></div>
				</div>
			</div>

			<div class="d-flex justify-content-center align-center mt-5">
				<div class="btn-group" role="group">
					<button type="button" class="btn btn-outline-primary" id="save-ex">
						Save exercise
					</button>
					<button
						type="button"
						class="btn btn-outline-danger disabled"
						id="remove-ex"
					>
						Remove exercise
					</button>
				</div>
			</div>
    `);

const SAVED_EXERCISES = $(`
    <ul class="list-group list-group-flush w-100 mt-5"></ul>
    `);

const BODYPARTS = [
	"lower-arms",
	"shoulders",
	"cardio",
	"upper-arms",
	"chest",
	"back",
	"upper-legs",
	"waist",
];

const NAV_ITEM = $(`
		<li class="breadcrumb-item"><a href="#"></a></li>
	`);

const CACHE = {};

function renderBodyParts() {
	APP.empty();

	TITLE.html("Body Parts");
	SUBTITLE.html("Which body part will you train today?");

	$("#nav-items").css("display", "flex");

	if ($("#part")) {
		$("#part").remove();
	}
	if ($("#exercise")) {
		$("#exercise").remove();
	}

	BODYPARTS.forEach((bodyPart) => {
		var newCard = CARD.clone();
		newCard.find("img").attr("src", "./assets/img/" + bodyPart + ".jpg");
		newCard.find("img").attr("alt", format(bodyPart));

		newCard.find("h5").html(format(bodyPart));
		newCard.find("h5").html(format(bodyPart));
		newCard.find("p").remove();

		newCard.find("div#select").html("Show Exercises");
		newCard.find("div#select").on("click", () => {
			renderPart(bodyPart);
		});

		APP.append(newCard);
	});
}

function renderPart(bodyPart) {
	APP.empty();
	TITLE.html(format(bodyPart));
	SUBTITLE.html("Which exercise are we doin' now?");

	if ($("#exercise")) {
		$("#exercise").remove();
	}
	if ($("#part")) {
		$("#part").remove();
	}

	var newNavItem = NAV_ITEM.clone();
	newNavItem.find("a").html(format(bodyPart));
	newNavItem.attr("id", "part");
	newNavItem.on("click", () => {
		renderPart(bodyPart);
	});
	NAV_ITEMS.append(newNavItem);

	if (CACHE[bodyPart]) {
		console.log("Loading from cache.");
		CACHE[bodyPart].forEach((item) => {
			var newCard = CARD.clone();

			newCard.find("img").attr("src", item.gifUrl);
			newCard.find("img").attr("alt", item.name);

			newCard.find("h5").html(item.name);
			newCard.find("p").html(item.equipments[0]);
			newCard.find("div#select").html("Show Details");
			newCard.find("div#select").on("click", () => {
				renderExercise(item.exerciseId);
			});
			APP.append(newCard);
		});
	} else {
		console.log("Loading from API.");
		$.ajax({
			async: true,
			url: `https://excercisedb.vercel.app/api/v1/bodyparts/${convertToSpace(
				bodyPart
			)}/exercises`,
			method: "GET",
		}).done(function (response) {
			response.data.exercises.forEach((item) => {
				var newCard = CARD.clone();

				newCard.find("img").attr("src", item.gifUrl);
				newCard.find("img").attr("alt", item.name);

				newCard.find("h5").html(item.name);
				newCard.find("p").html(item.equipments[0]);
				newCard.find("div#select").html("Show Details");
				newCard.find("div#select").on("click", () => {
					renderExercise(item.exerciseId);
				});
				APP.append(newCard);
			});
			CACHE[bodyPart] = response.data.exercises;
		});
	}
}

function renderExercise(exerciseId) {
	APP.empty();

	if ($("#exercise")) {
		$("#exercise").remove();
	}

	if (CACHE[exerciseId]) {
		console.log("Loading from cache.");

		TITLE.html(format(CACHE[exerciseId].name));
		SUBTITLE.html("Make it count!");

		var newNavItem = NAV_ITEM.clone();
		newNavItem.find("a").html(format(CACHE[exerciseId].name));
		newNavItem.attr("id", "exercise");
		newNavItem.on("click", () => {
			renderExercise(exerciseId);
		});
		NAV_ITEMS.append(newNavItem);

		var newExercise = EXERCISE.clone();

		newExercise.find("img").attr("src", CACHE[exerciseId].gifUrl);
		newExercise.find("img").attr("alt", CACHE[exerciseId].name);

		newExercise
			.find("#target-muscles")
			.html(arrayToSentence(CACHE[exerciseId].targetMuscles));
		newExercise
			.find("#secondary-muscles")
			.html(arrayToSentence(CACHE[exerciseId].secondaryMuscles));

		newExercise
			.find("#equipments")
			.html(arrayToSentence(CACHE[exerciseId].equipments));
		newExercise
			.find("#steps")
			.html(generateListFromArray(CACHE[exerciseId].instructions));

		newExercise.find("#save-ex").on("click", () => {
			saveFavoriteExercise(CACHE[exerciseId].exerciseId);
			newExercise.find("#save-ex").addClass("disabled");
			newExercise.find("#remove-ex").removeClass("disabled");
		});
		newExercise.find("#remove-ex").on("click", () => {
			newExercise.find("#remove-ex").html("Are you sure?");
			newExercise.find("#remove-ex").on("click", () => {
				removeFavoriteExercise(CACHE[exerciseId].exerciseId);
				renderExercise(exerciseId);
			});
		});

		if (checkFavouriteExercise(CACHE[exerciseId].exerciseId)) {
			newExercise.find("#save-ex").addClass("disabled");
			newExercise.find("#remove-ex").removeClass("disabled");
		} else {
			newExercise.find("#save-ex").removeClass("disabled");
			newExercise.find("#remove-ex").addClass("disabled");
		}

		APP.append(newExercise);
	} else {
		console.log("Loading from API.");
		$.ajax({
			async: true,
			url: `https://excercisedb.vercel.app/api/v1/exercises/${exerciseId}`,
			method: "GET",
		}).done(function (response) {
			TITLE.html(format(response.data.name));
			SUBTITLE.html("Make it count!");

			var newNavItem = NAV_ITEM.clone();
			newNavItem.find("a").html(format(response.data.name));
			newNavItem.attr("id", "exercise");
			newNavItem.on("click", () => {
				renderExercise(exerciseId);
			});
			NAV_ITEMS.append(newNavItem);

			var newExercise = EXERCISE.clone();

			newExercise.find("img").attr("src", response.data.gifUrl);
			newExercise.find("img").attr("alt", response.data.name);

			newExercise
				.find("#target-muscles")
				.html(arrayToSentence(response.data.targetMuscles));
			newExercise
				.find("#secondary-muscles")
				.html(arrayToSentence(response.data.secondaryMuscles));

			newExercise
				.find("#equipments")
				.html(arrayToSentence(response.data.equipments));
			newExercise
				.find("#steps")
				.html(generateListFromArray(response.data.instructions));

			newExercise.find("#save-ex").on("click", () => {
				saveFavoriteExercise(response.data.exerciseId);
				newExercise.find("#save-ex").addClass("disabled");
				newExercise.find("#remove-ex").removeClass("disabled");
			});
			newExercise.find("#remove-ex").on("click", () => {
				newExercise.find("#remove-ex").html("Are you sure?");
				newExercise.find("#remove-ex").on("click", () => {
					removeFavoriteExercise(CACHE[exerciseId].exerciseId);
					renderExercise(exerciseId);
				});
			});

			if (checkFavouriteExercise(response.data.exerciseId)) {
				newExercise.find("#save-ex").addClass("disabled");
				newExercise.find("#remove-ex").removeClass("disabled");
			} else {
				newExercise.find("#save-ex").removeClass("disabled");
				newExercise.find("#remove-ex").addClass("disabled");
			}

			APP.append(newExercise);
			CACHE[exerciseId] = response.data;
		});
	}
}

function renderFavouriteExercises() {
	APP.empty();
	TITLE.html("Saved Exercises");
	SUBTITLE.html("Feel free to add more!");

	$("#nav-items").css("display", "none");

	var newSavedExercises = SAVED_EXERCISES.clone();

	var goBackBtn = $(`<div class="btn btn-primary">Back to body parts</div>`);
	goBackBtn.on("click", () => {
		renderBodyParts();
	});

	APP.append(goBackBtn);

	if (getFavoriteExercises().length === 0) {
		newSavedExercises.append(
			$(`<li class="list-group-item">No favorite exercises yet. 😢</li>`)
		);
		APP.append(newSavedExercises);
		return;
	}

	getFavoriteExercises().forEach((exerciseId) => {
		$.ajax({
			async: true,
			url: `https://excercisedb.vercel.app/api/v1/exercises/${exerciseId}`,
			method: "GET",
		}).done(function (response) {
			var exercise = $(
				`<li class="list-group-item text-capitalize text-decoration-underline saved-exercise">${response.data.name}</li>`
			);
			exercise.on("click", () => {
				renderExercise(exerciseId);
			});
			newSavedExercises.append(exercise);
		});
	});

	APP.append(newSavedExercises);
}

function init() {
	renderBodyParts();
	$(".saved-exs").on("click", () => {
		renderFavouriteExercises();
	});
	$("#body-parts").on("click", () => {
		renderBodyParts();
	});
}

$(document).ready(() => {
	init();
});
