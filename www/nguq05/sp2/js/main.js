const recipesForm = document.querySelector('#recipesForm');
const dishInput = document.querySelector('#dishInput');
const recipesContainer = document.querySelector('#recipesContainer');

recipesForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const input = dishInput.value.trim();

    if (input) {
        displayRecipes(input);
    } else {
        displayError('No name. Please enter the name of the dish.');
    }
});

function displayRecipes(dishName) {
    recipesContainer.innerHTML = `
           <div class="recipe-card d-flex align-items-center mb-4 p-3 border rounded shadow-sm">
            
            <img src="https://via.placeholder.com/150" alt="${dishName}" class="img-fluid rounded me-3" style="width: 150px; height: 150px; object-fit: cover;">
            
            <div class="recipe-content">
                <h5 class="fw-bold">${dishName}</h5>
                <p><strong>Cuisine:</strong> Italian</p>
                <p><strong>Diet:</strong> Vegetarian</p>
                <p><strong>Type:</strong> Main course</p>
                <p><strong>Short description:</strong> Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum dolore perspiciatis provident in adipisci sequi quibusdam optio blanditiis eaque qui.</p>
                <button class="btn btn-primary mt-2">Show Recipe</button>
                <button class="btn btn-outline-danger mt-2">Add to Favourites</button>
            </div>
        </div>
        `;
}

function displayError(message) {
    recipesContainer.innerHTML = `
           <div class="alert alert-danger w-100" role="alert">
            ${message}
        </div>
        `;
}