function startLearning(category) {
    alert(`Starting or continuing learning for ${category}`);
}

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".category button");

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const categoryName = `Category ${index + 1}`;
            startLearning(categoryName);
        });
    });
});

function renderStatistics() {
    const chartPlaceholder = document.querySelector(".chart");
    chartPlaceholder.textContent = "Your progress will be shown here.";
}


document.addEventListener("DOMContentLoaded", () => {
    renderStatistics();
});
