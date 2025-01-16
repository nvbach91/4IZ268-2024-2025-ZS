// namespace
const App = {
    apiKey: '9f8d585583154ba98c550be5b60f55d2',
    apiUrl: 'https://api.spoonacular.com/recipes/complexSearch',
    favoritesKey: 'favoriteRecipes',
};

// DOM elementy
const recipesForm = document.querySelector('#recipesForm');
const dishInput = document.querySelector('#dishInput');
const recipesContainer = document.querySelector('#recipesContainer');
const savedRecipes = document.querySelector('#savedRecipes');

// event listener načtení z localstorage
document.addEventListener('DOMContentLoaded', () => loadFavorites());

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

    recipes.forEach((recipe) => {
        const card = createRecipeCard(recipe);
        recipesContainer.appendChild(card);
    });
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
                <p class="mb-1"><strong>Cuisine:</strong> ${recipe.cuisines?.join(', ') || 'N/A'}</p>
                <p class="mb-1"><strong>Diet:</strong> ${recipe.diets?.join(', ') || 'N/A'}</p>
                <p class="mb-1"><strong>Type:</strong> ${recipe.dishTypes?.join(', ') || 'N/A'}</p>
                <p class="mb-3"><strong>Summary:</strong> ${recipe.summary ? recipe.summary.slice(0, 300) + '...' : 'No description available.'}</p>
                <div>
                    <a href="${recipe.sourceUrl}" target="_blank" class="btn btn-primary me-2">Show Recipe</a>
                    <button class="btn btn-${isFavorite ? 'danger' : 'outline-danger'} favorite-btn" data-id="${recipe.id}" data-title="${recipe.title}" data-image="${recipe.image}">
                        ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                </div>
            </div>
        </div>
    `;

    // event listener na tlačítko add to favorite v kartě
    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
        const button = e.currentTarget;
        const recipeId = button.getAttribute('data-id');
        const recipeTitle = button.getAttribute('data-title');
        const recipeImage = button.getAttribute('data-image');

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
                }
            });
            removeFavorite(recipeId);
            button.classList.replace('btn-danger', 'btn-outline-danger');
            button.textContent = 'Add to Favorites';
        } else {
            addFavorite({ id: recipeId, title: recipeTitle, image: recipeImage });
            button.classList.replace('btn-outline-danger', 'btn-danger');
            button.textContent = 'Remove from Favorites';
        }
    });

    return card;
}

// funkce přidá recept do oblíbených
function addFavorite(recipe) {
    const favorites = getFavorites();
    favorites.push(recipe);
    localStorage.setItem(App.favoritesKey, JSON.stringify(favorites));
}

// funkce odstraní recept z oblíbených
function removeFavorite(recipeId) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter((recipe) => recipe.id !== recipeId);
    localStorage.setItem(App.favoritesKey, JSON.stringify(updatedFavorites));
}

// funkce zkontroluje, jestli je recept v oblíbených
function checkIfFavorite(recipeId) {
    const favorites = getFavorites();
    return favorites.some((recipe) => recipe.id === recipeId);
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