function format(str) {
	return str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
		.join(" ");
}

function convertToSpace(text) {
	return text.replace(/-/g, " ");
}

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
