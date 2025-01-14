const exerciseContainer = $("#exercise-container");

const bodyPart = getUrlParameter("bp");
const settings = {
	async: true,
	url: `https://excercisedb.vercel.app/api/v1/bodyparts/${convertToSpace(
		bodyPart
	)}/exercises`,
	method: "GET",
};

$(document).ready(function () {
	$("#page-title").html(convertToSpace(bodyPart));
	$("#quote").html(quotes[Math.floor(Math.random() * quotes.length)]);
});

$.ajax(settings).done(function (response) {
	response.data.exercises.forEach((item) => {
		// This exercise is broken
		if (item.exerciseId == "KCBKjma") {
			return;
		}
		const src = item.gifUrl;
		const title = item.name;
		const content = item.equipments[0];
		const exerciseId = item.exerciseId;

		$("#nav-page").html(convertToSpace(bodyPart));

		console.log(response.data);

		const card = $(`
            <div class="card shadow-sm m-4" style="width: 18rem">
                <div class="image-container" style="display: flex; justify-content: center; align-items: center; height: 300px; background-color: #f8f9fa;">
                    <div class="spinner-border text-primary" role="status"></div>
                    <img
                        src="${src}"
                        class="card-img-top thumbnail object-fit-cover"
                        alt="${title}"
                        style="display: none;"
                    />
                </div>
                <div class="card-body">
                    <h5 class="card-title" style="text-transform: capitalize;">${title}</h5>
                    <p class="card-text">${content}</p>
                    <a href="exercise.html?e=${exerciseId}" class="btn btn-primary">Show details</a>
                </div>
            </div>
        `);

		const img = card.find("img");
		const spinner = card.find(".spinner-border");

		img.on("load", function () {
			spinner.remove();
			img.fadeIn(300);
		});

		exerciseContainer.append(card);
	});
});
