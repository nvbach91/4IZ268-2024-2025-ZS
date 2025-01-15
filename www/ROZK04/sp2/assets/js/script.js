// TMDB API
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZTIzYjUzYTVjMzk5ZmEwMTFkMDk0OTc3YTZlMmM2YSIsIm5iZiI6MTczNDI2MDM5Ny4zNzc5OTk4LCJzdWIiOiI2NzVlYjZhZDQ4OWRjYmFhMDZiNmYzNWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oggAABe4BgcGB7U7wk1dT1tjYrs-Bmx2eMhodohT57A';
const apiURL = 'https://api.themoviedb.org/3/search/movie';


//Variables 
const movieInput = document.getElementById('movieInput')
const searchButton = document.getElementById('searchButton')
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


//SEARCHING MOVIES
async function searchMovies() {
    const query = movieInput.value.trim();
    // check if unput is empty
    if (!query) {
        alert('Zadejte název filmu.');
        return;
    }
    // finding the movies based on user input
    try {
        const response = await axios.get(apiURL, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            },
            params: {
                query: query
            }
        });
        // response is stored in response.data, data.results includes the list of movies
        const data = response.data;
        displayMovies(data.results);
    } catch (error) {
        console.error('Chyba při načítání dat (API).', error);
        alert('Nastala chyba při načítání API dat. Zkuste to znovu.');
    }
}
// DISPLAYING MOVIES 
function displayMovies(movies) {
    //hide the sections
    notStarted.style.display = 'none';
    emptyResults.style.display = 'none';
    results.style.display = 'none';
    // clears content of movie list
    movieList.innerHTML = '';
    // check if any movies are found, if not display message empty results
    if (movies.length === 0) {
        emptyResults.style.display = 'block';
    } else {
        // shows results section
        results.style.display = 'block';
        // creates cards for the movies 
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'col-md-4';
            movieCard.innerHTML = `
                <div class="card">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path || ''}" 
                         alt="${movie.title}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">${movie.overview || 'Popis není k dispozici.'}</p>
                        <button class="btn btn-warning" onclick="showMovieDetails(${movie.id})">
                            Více informací
                        </button>
                    </div>
                </div>
            `
            // adds the movieCard element (which represents a single movie) to the movieList container on the webpage.
            movieList.appendChild(movieCard);
        })
    }
}
// BUTTON FOR SEARCHING MOVIES
searchButton.addEventListener('click', searchMovies);

// INFORMATION ABOUT MOVIES
async function showMovieDetails(movieId) {
    try {
        // calling API
        const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
        const response = await axios.get(movieDetailsUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        // response
        const movie = response.data;

        //preparing moviToSave, saving title and poster
        const movieToSave = {
            title: movie.title,
            poster: movie.poster_path || 'Obrázek není dostupný'
        };

        //caling saveHistory 
        saveHistory(movieToSave);

        // adding to favorites button, saves the movie to favorites, shows alert, hides modal
        addToFavoritesButton.onclick = () => {
            addFavorite(movieToSave);
            alert('Film byl přidán do oblíbených.');
            const bootstrapModal = new bootstrap.Modal(movieModal);
            bootstrapModal.hide();
        };

        // Modal insides - actualize
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

        // Show modal
        const bootstrapModal = new bootstrap.Modal(movieModal);
        bootstrapModal.show();
    } catch (error) {
        console.error('Chyba při načítání detailů filmu.', error);
        alert('Nepodařilo se načíst detaily filmu. Zkuste to prosím znovu.');
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

window.onload = function () {
    loadHomePageStatus();
};

homeButton.addEventListener('click', goHome);

// SAVING TO HISTORY
function saveHistory(movie) {
    // loads value under key from historyMovies from localStorage, using JSON.parse converts JSON string to Javascript object, if theres no value in localStorage it uses []
    let historyMovies = JSON.parse(localStorage.getItem('historyMovies')) || [];
    // adds new movie to the beggining of historyMovies, keeping only the first 5
    historyMovies = [movie, ...historyMovies].slice(0, 5);
    // converts historyMovies to JSON string, than saves it to localStorage under key historyMovies
    localStorage.setItem('historyMovies', JSON.stringify(historyMovies));
    displayHistory();
}

// DISPLAYING HISTORY
function displayHistory() {
    // loads historyMovies from local storage, uses JSON.parse to convert to javascript, if theres no history saves []
    const historyMovies = JSON.parse(localStorage.getItem('historyMovies')) || [];
    // if there no history block it doesnt show any history

    if (historyMovies.length === 0) {
        history.style.display = 'none';
        return;
    }

    // shows history block
    history.style.display = 'block';

    // deletes previous so there no duplicity
    historyList.innerHTML = '';

    // creates new li for every movie, adds css class list-group-item, sets listitem - poster and title, adds to history list
    historyMovies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="${movie.title}" class="me-2" style="width: 50px; height: 75px;">
            ${movie.title}
        `;
        historyList.appendChild(listItem);
    });
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

// Normalize movie titles by removing special characters, spaces, and converting to lowercase
const normalizeTitle = (title) => title.trim().toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ');

// Adding to favorites
function addFavorite(movie) {
    let favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
    const normalizedTitle = normalizeTitle(movie.title);
    // Check if the movie already exists in favorites (using normalized title)
    if (!favoritesMovies.some(fav => normalizeTitle(fav.title) === normalizedTitle)) {
        favoritesMovies.push(movie);
        localStorage.setItem('favoritesMovies', JSON.stringify(favoritesMovies));
        displayFavorites();
    } else {
        alert('Tento film je již v oblíbených.');
    }
}


// Display favorites
function displayFavorites() {
    // loads favorites
    const favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
    // if no favorites shows message
    if (favoritesMovies.length === 0) {
        favoritesList.innerHTML = '<p>V seznamu oblíbených se momentálně nenachází žádný film.</p>';
    } else {
        // ensures theres no duplicity
        favoritesList.innerHTML = '';
        // for each movie creates new li, adds styling, creates div for image
        favoritesMovies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                <div class="d-flex align-items-center">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="${movie.title}" class="me-2" style="width: 50px; height: 75px;">
        ${movie.title}
    </div>
    <button class="btn btn-danger btn-sm" onclick="removeFavorite('${movie.title.replace(/'/g, "\\'")}')">Odebrat</button>
`;
            favoritesList.appendChild(listItem);
        });
    }
}


// Removing from favorites
function removeFavorite(movieTitle) {
    let favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
    const normalizedTitleToRemove = normalizeTitle(movieTitle);
    // Remove movie from favorites by comparing normalized titles
    favoritesMovies = favoritesMovies.filter(movie => normalizeTitle(movie.title) !== normalizedTitleToRemove);
    localStorage.setItem('favoritesMovies', JSON.stringify(favoritesMovies));
    displayFavorites();
}