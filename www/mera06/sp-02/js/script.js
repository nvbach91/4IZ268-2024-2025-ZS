const apiKey = '1a194ae9';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const yearInput = document.getElementById('year-input');
const resultsSection = document.getElementById('results');
const detailsSection = document.getElementById('details');
const favoritesList = document.getElementById('favorites-list');
const base_url = 'https://www.omdbapi.com/';

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let lastSearch = JSON.parse(localStorage.getItem('lastSearch')) || { query: '', year: '' };

// Render favorites
function renderFavorites() {
    favoritesList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    favorites.forEach((movie) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.innerHTML = `<span>${movie.Title} (${movie.Year})</span>`;

        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View';
        viewBtn.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
        viewBtn.onclick = async () => {
            const details = await fetchMovieDetails(movie.imdbID);
            displayDetails(details);
        };

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        removeBtn.onclick = () => {
            const confirmation = confirm('Are you sure you want to remove this movie from favorites?');
            if (confirmation) {
                favorites = favorites.filter(f => f.imdbID !== movie.imdbID);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                renderFavorites();
            }
        };

        const buttonGroup = document.createElement('div');
        buttonGroup.appendChild(viewBtn);
        buttonGroup.appendChild(removeBtn);

        li.appendChild(buttonGroup);
        fragment.appendChild(li);
    });

    favoritesList.appendChild(fragment);
}

// Fetch movie data
async function fetchMovies(query, year) {
    resultsSection.innerHTML = '<p class="text-center">Loading...</p>'; // Loading indicator
    const url = `${base_url}?apikey=${apiKey}&s=${query}${year ? `&y=${year}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.Search || [];
}

// Fetch movie details
async function fetchMovieDetails(imdbID) {
    detailsSection.innerHTML = '<p class="text-center">Loading details...</p>'; // Loading indicator
    const url = `${base_url}?apikey=${apiKey}&i=${imdbID}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Display search results
function displayResults(movies) {
    resultsSection.innerHTML = '<h2 class="mb-3">Search Results</h2>';

    if (movies.length === 0) {
        resultsSection.innerHTML += '<p class="text-center">No results were found.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();

    movies.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card', 'col-md-3', 'p-2');
        div.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'}" alt="${movie.Title}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${movie.Title} (${movie.Year})</h5>
                <button class="btn btn-primary btn-sm view-details" data-id="${movie.imdbID}">View Details</button>
                <button class="btn btn-sm toggle-favorite ${
                    favorites.some(f => f.imdbID === movie.imdbID) ? 'btn-danger' : 'btn-success'
                }" data-id="${movie.imdbID}">
                    ${
                        favorites.some(f => f.imdbID === movie.imdbID)
                            ? 'Remove from Favorites'
                            : 'Add to Favorites'
                    }
                </button>
            </div>
        `;

        div.querySelector('.view-details').onclick = async () => {
            const details = await fetchMovieDetails(movie.imdbID);
            displayDetails(details);
            detailsSection.scrollIntoView({ behavior: 'smooth' });
        };

        div.querySelector('.toggle-favorite').onclick = async (event) => {
            const details = await fetchMovieDetails(movie.imdbID);
            const isFavorite = favorites.some(f => f.imdbID === details.imdbID);

            if (isFavorite) {
                const confirmation = confirm('Are you sure you want to remove this movie from favorites?');
                if (confirmation) {
                    favorites = favorites.filter(f => f.imdbID !== details.imdbID);
                    event.target.textContent = 'Add to Favorites';
                    event.target.classList.remove('btn-danger');
                    event.target.classList.add('btn-success');
                }
            } else {
                favorites.push(details);
                event.target.textContent = 'Remove from Favorites';
                event.target.classList.remove('btn-success');
                event.target.classList.add('btn-danger');
            }

            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        };

        fragment.appendChild(div);
    });

    resultsSection.appendChild(fragment);
}

// Display movie details
function displayDetails(details) {
    const isFavorite = favorites.some(f => f.imdbID === details.imdbID);
    detailsSection.innerHTML = `
        <h2>${details.Title}</h2>
        <p><strong>Year:</strong> ${details.Year}</p>
        <p><strong>Genre:</strong> ${details.Genre}</p>
        <p><strong>Director:</strong> ${details.Director}</p>
        <p><strong>Plot:</strong> ${details.Plot}</p>
        <img src="${details.Poster}" alt="${details.Title}" class="img-fluid">
        <button id="favorite-action" class="btn mt-3"></button>
    `;

    const favoriteActionButton = document.getElementById('favorite-action');
    if (isFavorite) {
        favoriteActionButton.textContent = 'Remove from Favorites';
        favoriteActionButton.classList.add('btn-danger');
        favoriteActionButton.onclick = () => {
            const confirmation = confirm('Are you sure you want to remove this movie from favorites?');
            if (confirmation) {
                favorites = favorites.filter(f => f.imdbID !== details.imdbID);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                renderFavorites();
                displayDetails(details);
            }
        };
    } else {
        favoriteActionButton.textContent = 'Add to Favorites';
        favoriteActionButton.classList.add('btn-success');
        favoriteActionButton.onclick = () => {
            favorites.push(details);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
            displayDetails(details);
        };
    }
}

// Handle form submission
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value;
    const year = yearInput.value;

    lastSearch = { query, year };
    localStorage.setItem('lastSearch', JSON.stringify(lastSearch));

    const movies = await fetchMovies(query, year);
    displayResults(movies);
});

// Initialize
(async () => {
    renderFavorites();

    if (lastSearch.query) {
        searchInput.value = lastSearch.query;
        yearInput.value = lastSearch.year;
        const movies = await fetchMovies(lastSearch.query, lastSearch.year);
        displayResults(movies);
    }
})();
