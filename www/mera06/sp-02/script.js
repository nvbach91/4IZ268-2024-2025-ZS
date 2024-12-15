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
        li.textContent = movie.Title;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => {
            favorites = favorites.filter(f => f.imdbID !== movie.imdbID);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        };
        li.appendChild(removeBtn);
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
    resultsSection.innerHTML = '';
    movies.forEach((movie) => {
        const div = document.createElement('div');
        div.textContent = `${movie.Title} (${movie.Year})`;
        div.onclick = async () => {
            const details = await fetchMovieDetails(movie.imdbID);
            displayDetails(details);
        };
        resultsSection.appendChild(div);
    });
}

// Display movie details
function displayDetails(details) {
    detailsSection.innerHTML = `
        <h2>${details.Title}</h2>
        <p>${details.Year}</p>
        <p>${details.Genre}</p>
        <p>${details.Director}</p>
        <p>${details.Plot}</p>
        <button id="add-to-favorites">Add to Favorites</button>
    `;
    document.getElementById('add-to-favorites').onclick = () => {
        if (!favorites.some(f => f.imdbID === details.imdbID)) {
            favorites.push(details);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        }
    };
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
