const apiKey = '1a194ae9';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const yearInput = document.getElementById('year-input');
const resultsSection = document.getElementById('results');
const detailsSection = document.getElementById('details');
const favoritesList = document.getElementById('favorites-list');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Render favorites
function renderFavorites() {
    favoritesList.innerHTML = '';
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
            favorites = favorites.filter(f => f.imdbID !== movie.imdbID);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        };
        const buttonGroup = document.createElement('div');
        buttonGroup.appendChild(viewBtn);
        buttonGroup.appendChild(removeBtn);
        li.appendChild(buttonGroup);
        favoritesList.appendChild(li);
    });
}

// Fetch movie data
async function fetchMovies(query, year) {
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}${year ? `&y=${year}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.Search || [];
}

// Fetch movie details
async function fetchMovieDetails(imdbID) {
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Display search results
function displayResults(movies) {
    resultsSection.innerHTML = '<h2 class="mb-3">Search Results</h2>';
    movies.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card', 'col-md-3', 'p-2');
        div.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${movie.Title} (${movie.Year})</h5>
                <button class="btn btn-primary btn-sm" data-id="${movie.imdbID}">View Details</button>
            </div>
        `;
        resultsSection.appendChild(div);

        div.querySelector('button').onclick = async () => {
            const details = await fetchMovieDetails(movie.imdbID);
            displayDetails(details);
            detailsSection.scrollIntoView({ behavior: 'smooth' });
        };
    });
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
            favorites = favorites.filter(f => f.imdbID !== details.imdbID);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
            displayDetails(details); // Update button state
        };
    } else {
        favoriteActionButton.textContent = 'Add to Favorites';
        favoriteActionButton.classList.add('btn-success');
        favoriteActionButton.onclick = () => {
            favorites.push(details);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
            displayDetails(details); // Update button state
        };
    }
}

// Handle form submission
searchForm.onsubmit = async (e) => {
    e.preventDefault();
    const query = searchInput.value;
    const year = yearInput.value;
    const movies = await fetchMovies(query, year);
    displayResults(movies);
};

// Initialize
renderFavorites();
