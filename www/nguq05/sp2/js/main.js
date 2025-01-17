// namespace
const App = {
    apiKey: 'ddc5cf8c1af047b3bfee7185ff0496f8',
    apiUrl: 'https://api.spoonacular.com/recipes/complexSearch',
    favoritesKey: 'favoriteRecipes',
};

let localStorageContainer = [];

// DOM elementy
const recipesForm = document.querySelector('#recipesForm');
const dishInput = document.querySelector('#dishInput');
const recipesContainer = document.querySelector('#recipesContainer');
const savedRecipes = document.querySelector('#savedRecipes');
const recipeIframe = document.querySelector('#recipeIframe');

// event listener načtení z localstorage
document.addEventListener('DOMContentLoaded', () => {
    localStorageContainer = JSON.parse(localStorage.getItem(App.favoritesKey)) || [];
});

// funkce zobrazí spinner
function displayLoading() {
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    recipesContainer.append(spinner);
    return spinner;
}

// funkce schová spinner
function hideLoading(spinner) {
    spinner.remove();
};

// event listener pro formulář
recipesForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = dishInput.value.trim();

    if (!input) {
        displayError("No name. Please enter the name of the dish.");
        return;
    }

    const spinner = displayLoading();
    try {
        const recipeData = await fetchRecipes(input);
        hideLoading(spinner);
        displayRecipes(recipeData.results);
    } catch (error) {
        console.error(error);
        displayError("Failed to fetch recipes. Please try again.");
    }
});

// event listener pro tlačítko na uložení receptů
savedRecipes.addEventListener('click', () => {
    const favorites = getFavorites();

    if (favorites.length === 0) {
        displayError('No saved recipes found.');
    } else {
        displayRecipes(favorites);
    }
});

// funkce na fetch receptů
async function fetchRecipes(dish) {
    const url = `${App.apiUrl}?query=${encodeURIComponent(dish)}&addRecipeInformation=true&apiKey=${App.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch recipes.");
    }
    return response.json();
}

// funkce na zobrazení receptů
function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';

    if (!recipes || recipes.length === 0) {
        displayError('No recipes found for this dish.');
        return;
    }

    const tmpElements = [];

    recipes.forEach((recipe) => {
        const card = createRecipeCard(recipe);
        tmpElements.push(card);
    });
    recipesContainer.append(...tmpElements);
}

// funkce na vytvoření karty receptu
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'col-12';

    const isFavorite = checkIfFavorite(recipe.id);

    card.innerHTML = `
        <div class="d-flex align-items-center border rounded p-3 shadow-sm mb-3">
            <div class="flex-shrink-0">
                <img src="${recipe.image}" alt="${recipe.title}" class="img-fluid rounded" style="max-width: 150px; height: auto;">
            </div>
            <div class="flex-grow-1 ms-3">
                <h5 class="fw-bold">${recipe.title}</h5>
                <p class="mb-1"><strong>Cuisine:</strong>
                        ${recipe.cuisines.map((cuisine) => {
        return `<button class="cuisine-btn btn-info">${cuisine}
                            </button>`;
    }) || 'N/A'}
                </p>
                <p class="mb-1"><strong>Diet:</strong> ${recipe.diets || 'N/A'}</p>
                <p class="mb-1"><strong>Type:</strong> ${recipe.dishTypes || 'N/A'}</p>
                <p class="mb-3"><strong>Summary:</strong> ${recipe.summary ? recipe.summary.slice(0, 300) + '...' : 'No description available.'}</p>
                <div>
                    <button class="btn btn-primary me-2 show-recipe-btn" data-url="${recipe.sourceUrl ? recipe.sourceUrl : '#'}">
                        Show recipe
                    </button>
                    
                   <button class="btn btn-${isFavorite ? 'warning' : 'outline-warning'} favorite-btn" data-id="${recipe.id}" data-title="${recipe.title}" data-image="${recipe.image}" 
                    data-diets="${recipe.diets}" data-cuisines="${recipe.cuisines}">
                        ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                </div>
            </div>
        </div>
    `;

    card.querySelector('.show-recipe-btn').addEventListener('click', (e) => {
        const recipeUrl = e.currentTarget.getAttribute('data-url');

        if (recipeUrl) {
            Swal.fire({
                width: 800,
                html: `
                <iframe src="${recipeUrl}" class="vw-100 vh-100">
                </iframe>
                `,
                imageAlt: "Recipe URL",
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Recipe URL is not available",
            });
        }
    });

    // event listener na tlačítko add to favorite v kartě
    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
        const button = e.currentTarget;
        const recipeId = button.getAttribute('data-id');
        const recipeTitle = button.getAttribute('data-title');
        const recipeImage = button.getAttribute('data-image');
        const recipeCuisines = button.getAttribute('data-cuisines');
        const recipeDiets = button.getAttribute('data-diets');
        const recipeDishTypes = button.getAttribute('data-dishTypes');
        const recipeSummary = button.getAttribute('data-summary');

        if (checkIfFavorite(recipeId)) {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your recipe has been deleted.",
                        icon: "success"
                    });
                    removeFavorite(recipeId);
                    button.classList.replace('btn-danger', 'btn-outline-danger');
                    button.textContent = 'Add to Favorites';
                }
            });
        } else {
            addFavorite({
                id: recipeId, title: recipeTitle, image: recipeImage,
                cuisines: recipeCuisines, diets: recipeDiets,
                dishTypes: recipeDishTypes, summary: recipeSummary
            });
            button.classList.replace('btn-outline-danger', 'btn-danger');
            button.textContent = 'Remove from Favorites';
        }
    });

    return card;
}

// funkce přidá recept do oblíbených
function addFavorite(recipe) {
    localStorageContainer.push(recipe);
    localStorage.setItem(App.favoritesKey, JSON.stringify(localStorageContainer));
}

// funkce odstraní recept z oblíbených
function removeFavorite(recipeId) {
    localStorageContainer = localStorageContainer.filter((recipe) => recipe.id !== recipeId);
    localStorage.setItem(App.favoritesKey, JSON.stringify(localStorageContainer));
}

// funkce zkontroluje, jestli je recept v oblíbených
function checkIfFavorite(recipeId) {
    return localStorageContainer.some((recipe) => recipe.id === recipeId);
}

// funkce vrátí všechny oblíbené recepty z localstorage
function getFavorites() {
    return JSON.parse(localStorage.getItem(App.favoritesKey)) || [];
}

// funkce načte všechny oblíbené a zobrazí je, když je stránka načtená
function loadFavorites(showSavedRecipes) {
    if (showSavedRecipes) {
        const favorites = getFavorites();
        if (favorites.length > 0) {
            displayRecipes(favorites);
        } else {
            recipesContainer.innerHTML = '<p class="text-center text-muted">No saved recipes found.</p>';
        }
    } else {
        // Reset na úvodní stránku
        recipesContainer.innerHTML = '';
    }
}

// funkce zobrazení erroru
function displayError(message) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
    });
}