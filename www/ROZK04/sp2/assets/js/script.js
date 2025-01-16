// TMDB API
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZTIzYjUzYTVjMzk5ZmEwMTFkMDk0OTc3YTZlMmM2YSIsIm5iZiI6MTczNDI2MDM5Ny4zNzc5OTk4LCJzdWIiOiI2NzVlYjZhZDQ4OWRjYmFhMDZiNmYzNWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oggAABe4BgcGB7U7wk1dT1tjYrs-Bmx2eMhodohT57A';
const apiBaseUrl = 'https://api.themoviedb.org/3';
const apiURL = `${apiBaseUrl}/search/movie`;

//Variables 
const movieInput = document.getElementById('movieInput')
const favoritesButton = document.getElementById('favoritesButton')
const homeButton = document.getElementById('homeButton')
const addToFavoritesButton = document.getElementById('addToFavoritesButton')
const notStarted = document.getElementById('notStarted')
const emptyResults = document.getElementById('emptyResults')
const results = document.getElementById('results')
const movieList = document.getElementById('movieList')
const movieModal = document.getElementById('movieModal')
const movieModalTitle = document.getElementById('movieModalTitle')
const moviePoster = document.getElementById('moviePoster')
const movieDescription = document.getElementById('movieDescription')
const movieReleaseDate = document.getElementById('movieReleaseDate')
const movieRating = document.getElementById('movieRating')
const favorites = document.getElementById('favorites')
const favoritesList = document.getElementById('favoritesList')
const history = document.getElementById('history')
const historyList = document.getElementById('historyList')
const loadingIndicator = document.getElementById('loading');



// LOADING
function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

// NOTIFICATION
function showNotification(message) {
    notification.textContent = message;
    notification.classList.remove('hidden');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.classList.add('hidden');
        notification.style.display = 'none';
    }, 3000);
}

//SEARCHING MOVIES
async function searchMovies() {
    const query = movieInput.value.trim();
    loading.classList.remove('hidden');
    if (!query) {
        showNotification('Zadejte název filmu.');
        loading.classList.add('hidden');
        return;
    }
    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            },
            params: {
                query: query
            }
        });
        const data = response.data;
        displayMovies(data.results);
    } catch (error) {
        console.error('Chyba při načítání dat (API).', error);
        showNotification('Nastala chyba při načítání API dat. Zkuste to znovu.');
    } finally {
        loading.classList.add('hidden');
    }
}


// DISPLAYING MOVIES 
function displayMovies(movies) {
    notStarted.style.display = 'none';
    emptyResults.style.display = 'none';
    results.style.display = 'none';
    movieList.innerHTML = '';
    if (movies.length === 0) {
        emptyResults.style.display = 'block';
    } else {
        results.style.display = 'block';
        const fragment = document.createDocumentFragment();
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'col-md-2';
            movieCard.innerHTML = `
                <div class="card">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path || ''}" 
                         alt="${movie.title}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">${movie.overview || 'Popis není k dispozici.'}</p>
                        <button class="btn btn-warning">
                            Více informací
                        </button>
                    </div>
                </div>
            `;
            const movieCardButton = movieCard.querySelector('button');
            movieCardButton.addEventListener('click', () => showMovieDetails(movie.id));
            fragment.appendChild(movieCard);
        });
        movieList.appendChild(fragment);
    }
}
// BUTTON FOR SEARCHING MOVIES
document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    searchMovies();
});

// INFORMATION ABOUT MOVIES
async function showMovieDetails(movieId) {
    loading.classList.remove('hidden');
    try {
        const movieDetailsUrl = `${apiBaseUrl}/movie/${movieId}`;
        const response = await axios.get(movieDetailsUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });
        const movie = response.data;
        const movieToSave = {
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path || 'Obrázek není dostupný'
        };
        saveHistory(movieToSave);
        const favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
        const isAlreadyFavorite = favoritesMovies.some(fav => normalizeTitle(fav.title) === normalizeTitle(movie.title));
        if (isAlreadyFavorite) {
            addToFavoritesButton.textContent = 'Již v oblíbených';
            addToFavoritesButton.disabled = true;
        } else {
            addToFavoritesButton.textContent = 'Přidat do oblíbených';
            addToFavoritesButton.disabled = false;
            addToFavoritesButton.addEventListener('click', () => {
                addFavorite(movieToSave);
                showNotification('Film byl přidán do oblíbených.');
                const bootstrapModal = new bootstrap.Modal(movieModal);
                bootstrapModal.hide();
            });
        }
        movieModalTitle.textContent = movie.title || 'Název není dostupný';
        moviePoster.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : './assets/images/no-poster.jpg';
        moviePoster.alt = movie.title || 'Plakát není dostupný';
        movieDescription.textContent = movie.overview || 'Popis filmu není dostupný.';
        movieReleaseDate.textContent = movie.release_date || 'Neznámé';
        movieRating.textContent = movie.vote_average
            ? `${movie.vote_average}/10`
            : 'Neznámé';

        const genres = movie.genres.map(genre => genre.name).join(', ') || 'Neznámé';
        document.getElementById('movieGenre').textContent = genres;
        history.style.display = 'none';
        const bootstrapModal = new bootstrap.Modal(movieModal);
        bootstrapModal.show();
    } catch (error) {
        console.error('Chyba při načítání detailů filmu.', error);
        ('Nepodařilo se načíst detaily filmu. Zkuste to prosím znovu.');
    } finally {
        loading.classList.add('hidden');
    }
}

//HOME BUTTON
function goHome() {
    localStorage.setItem('isHome', 'true');
    notStarted.style.display = 'none';
    emptyResults.style.display = 'none';
    results.style.display = 'none';
    favorites.style.display = 'none';
    history.style.display = 'block';
}

//HOME PAGE STATUS
function loadHomePageStatus() {
    const isHome = localStorage.getItem('isHome');
    if (isHome === 'true') {
        notStarted.style.display = 'none';
        emptyResults.style.display = 'none';
        results.style.display = 'none';
        favorites.style.display = 'none';
        history.style.display = 'block';
        movieModal.style.display = 'none';
    } else {
        notStarted.style.display = 'block';
        emptyResults.style.display = 'none';
        results.style.display = 'none';
        favorites.style.display = 'none';
        history.style.display = 'none';
    }
    displayHistory();
}

window.addEventListener('load', function () {
    loadHomePageStatus();
});

homeButton.addEventListener('click', goHome);

// SAVING TO HISTORY
function saveHistory(movie) {
    let historyMovies = JSON.parse(localStorage.getItem('historyMovies')) || [];
    historyMovies = [movie, ...historyMovies].slice(0, 5);
    localStorage.setItem('historyMovies', JSON.stringify(historyMovies));
    displayHistory();
}

// DISPLAYING HISTORY
function displayHistory() {
    const historyMovies = JSON.parse(localStorage.getItem('historyMovies')) || [];
    history.style.display = historyMovies.length === 0 ? 'none' : 'block';
    historyList.innerHTML = '';  // Clear the current list
    const fragment = document.createDocumentFragment();
    historyMovies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="${movie.title}" class="me-2" style="width: 50px; height: 75px;">
                ${movie.title}
            </div>
            <button class="btn btn-warning btn-sm">Zobrazit více</button> 
        `;
        const movieDetailsButton = listItem.querySelector('button');
        movieDetailsButton.addEventListener('click', () => showMovieDetails(movie.id));
        fragment.appendChild(listItem);
    });
    historyList.appendChild(fragment);
}



// FAVORITES BUTTON
favoritesButton.addEventListener('click', () => {
    favorites.style.display = 'block';
    history.style.display = 'none';
    results.style.display = 'none';
    notStarted.style.display = 'none';
    emptyResults.style.display = 'none';
    displayFavorites();
});

const normalizeTitle = (title) => title.trim().toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ');

// Adding to favorites
function addFavorite(movie) {
    let favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
    const normalizedTitle = normalizeTitle(movie.title);
    if (!favoritesMovies.some(fav => normalizeTitle(fav.title) === normalizedTitle)) {
        favoritesMovies.push(movie);
        localStorage.setItem('favoritesMovies', JSON.stringify(favoritesMovies));
        displayFavorites();
    } else {
        showNotification('Tento film je již v oblíbených.');
    }
}


// Display favorites
function displayFavorites() {
    const favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
    favoritesList.innerHTML = '';
    if (favoritesMovies.length === 0) {
        favoritesList.innerHTML = '<p>V seznamu oblíbených se momentálně nenachází žádný film.</p>';
    } else {
        const fragment = document.createDocumentFragment();
        favoritesMovies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="${movie.title}" class="me-2" style="width: 50px; height: 75px;">
                    ${movie.title}
                </div>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-warning btn-sm me-2">Zobrazit více</button>
                    <button class="btn btn-danger btn-sm">Odebrat</button>
                </div>
            `;

            const movieDetailsButton = listItem.querySelector('button.btn-warning');
            movieDetailsButton.addEventListener('click', () => showMovieDetails(movie.id));

            const removeButton = listItem.querySelector('button.btn-danger');
            removeButton.addEventListener('click', () => removeFavorite(movie.id));

            fragment.appendChild(listItem);
        });
        favoritesList.appendChild(fragment);
    }
}

// Removing from favorites
function removeFavorite(movieId) {
    let favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
    favoritesMovies = favoritesMovies.filter(movie => movie.id !== movieId);
    localStorage.setItem('favoritesMovies', JSON.stringify(favoritesMovies));
    displayFavorites();
}

