const App = {
    apiKey: '9f8d585583154ba98c550be5b60f55d2',
    apiUrl: 'https://api.spoonacular.com/recipes/complexSearch',
};

const recipesForm = document.querySelector('#recipesForm');
const dishInput = document.querySelector('#dishInput');
const recipesContainer = document.querySelector('#recipesContainer');

recipesForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = dishInput.value.trim();

    if (!input) {
        displayError("No name. Please enter the name of the dish.");
        return;
    }

    try {
        const recipeData = await fetchRecipes(input);
        displayRecipes(recipeData.results);
    } catch (error) {
        console.error(error);
        displayError("Failed to fetch recipes. Please try again.");
    }
});

async function fetchRecipes(dish) {
    const url = `${App.apiUrl}?query=${encodeURIComponent(dish)}&addRecipeInformation=true&apiKey=${App.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch recipes.");
    }

    return response.json();
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';

    if (!recipes || recipes.length === 0) {
        displayError('No recipes found for this dish.');
        return;
    }

    recipes.forEach((recipe) => {
        const card = createRecipeCard(recipe);
        recipesContainer.appendChild(card);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'col-12';

    card.innerHTML = `
        <div class="d-flex align-items-center border rounded p-3 shadow-sm mb-3">
            <div class="flex-shrink-0">
                <img src="${recipe.image}" alt="${recipe.title}" class="img-fluid rounded" style="max-width: 150px; height: auto;">
            </div>
            <div class="flex-grow-1 ms-3">
                <h5 class="fw-bold">${recipe.title}</h5>
                <p class="mb-1"><strong>Cuisine:</strong> ${recipe.cuisines?.join(', ') || 'N/A'}</p>
                <p class="mb-1"><strong>Diet:</strong> ${recipe.diets?.join(', ') || 'N/A'}</p>
                <p class="mb-1"><strong>Type:</strong> ${recipe.dishTypes?.join(', ') || 'N/A'}</p>
                <p class="mb-3"><strong>Summary:</strong> ${recipe.summary ? recipe.summary.slice(0, 200) + '...' : 'No description available.'}</p>
                <div>
                    <a href="${recipe.sourceUrl}" target="_blank" class="btn btn-primary me-2">Show Recipe</a>                 
                </div>
            </div>
        </div>
    `;

    return card;
}

function displayError(message) {
    recipesContainer.innerHTML = `
           <div class="alert alert-danger w-100" role="alert">
            ${message}
        </div>
        `;
}