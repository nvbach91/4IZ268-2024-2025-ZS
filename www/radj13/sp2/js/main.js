// API configuration
const API_KEY = 'd3a4ad3d4c43dec3196f08df4ea46108';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Event listener for the search form submission
document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const searchValue = document.getElementById('search-input').value.trim();
    if (!searchValue && !filterLanguage.value && !filterYear.value && !filterGenre.value) {
        showPopupMessage('You must enter a search term or select at least one filter!', 'error'); // Show error if input is empty
        return;
    }
    const data = await fetchMovies(searchValue, filterLanguage.value, filterYear.value, filterGenre.value);
    if (data.length === 0) {
        localStorage.setItem('searchResults', JSON.stringify(data));
        showSearchResults();
        showPopupMessage('No movies found!', 'error'); // Show error if no movies are found
        return;
    }
    displayMovies(data, 'search-results-list');
    localStorage.setItem('searchResults', JSON.stringify(data));
    localStorage.setItem('currentView', 'searchResults');
    showSearchResults();
});

// Function to show the filters modal
const showFiltersModal = () => {
    const modal = document.getElementById('filters-modal');
    modal.style.display = 'block';
};

// Function to hide the filters modal
const hideFiltersModal = () => {
    const modal = document.getElementById('filters-modal');
    modal.style.display = 'none';
};

// Function to clear filter inputs
const clearFilters = () => {
    document.getElementById('language-filter').value = '';
    document.getElementById('year-filter').value = '';
    document.getElementById('genre-filter').value = '';
};

// Event listener for the clear filters button
document.getElementById('clearFiltersButton').addEventListener('click', clearFilters);

// Event listener for toggle filter button
document.getElementById('filtersButton').addEventListener('click', showFiltersModal);

// Event listener for the close button in the filters modal
document.querySelector('.closeFiltersButton').addEventListener('click', hideFiltersModal);

// Event listener to close the filters modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('filters-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Event listener for the Apply Filters button
document.getElementById('applyFiltersButton').addEventListener('click', hideFiltersModal);

// Event listener for the Home button
document.getElementById('homeButton').addEventListener('click', () => {
    displayHome();
    localStorage.setItem('currentView', 'home');
});

// Event listener for the Search Results button
document.getElementById('searchResultsButton').addEventListener('click', () => {
    showSearchResults();
    localStorage.setItem('currentView', 'searchResults');
});

// Event listener for the Library button
document.getElementById('libraryButton').addEventListener('click', () => {
    displayLibrary();
    localStorage.setItem('currentView', 'library');
});

// DOM elements
const searchResults = document.getElementById('search-results');
const libraryResults = document.getElementById('library-results');
const libraryResultsList = document.getElementById('library-results-list');
const homeSection = document.getElementById('home-section');
const movieModal = document.getElementById('movie-modal');
const movieDetailsContent = document.getElementById('movie-details-content');
const closeButton = document.querySelector('.closeButton');
const filterLanguage = document.getElementById('language-filter');
const filterYear = document.getElementById('year-filter');
const filterGenre = document.getElementById('genre-filter');

// Event listener for closing the movie modal
closeButton.addEventListener('click', () => {
    movieModal.style.display = 'none'; // Hide the movie modal
});

// Event listener for closing the movie modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target == movieModal) {
        movieModal.style.display = 'none'; // Hide the movie modal
    }
});

// Load event to restore the previous view state
window.addEventListener('load', () => {
    showLoadingSpinner(); // Show the loading spinner
    const storedResults = localStorage.getItem('searchResults');
    if (storedResults) {
        const data = JSON.parse(storedResults);
        displayMovies(data, 'search-results-list');
    }

    const currentView = localStorage.getItem('currentView');
    if (currentView === 'library') {
        displayLibrary(); // Display the library view
    } else if (currentView === 'searchResults') {
        showSearchResults(); // Display the search results view
    } else {
        displayHome(); // Default to displaying the home view
    }
    populateGenreFilter();
    populateLanguageFilter();
    hideLoadingSpinner(); // Hide the loading spinner
});

// Fetch movies based on search value
const fetchMovies = async (searchValue, language, year, genre) => {
    showLoadingSpinner(); // Show the loading spinner
    let url = '';
    if (searchValue) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchValue}`;
    }
    else {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}`;
    }
    if (genre) {
        url += `&with_genres=${genre}`;
    }
    if (year) {
        url += `&primary_release_year=${year}`;
    }
    if (language) {
        url += `&language=${language}`;
    }
    const result = await fetch(url); // Fetch searched movies from the API
    const data = await result.json();
    hideLoadingSpinner(); // Hide the loading spinner
    return data.results;
};

// Fetch top-rated movies
const fetchTopRatedMovies = async () => {
    showLoadingSpinner(); // Show the loading spinner
    const result = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`); // Fetch top-rated movies from the API
    const data = await result.json();
    hideLoadingSpinner(); // Hide the loading spinner
    return data.results;
};

// Fetch newest movies
const fetchNewestMovies = async () => {
    showLoadingSpinner(); // Show the loading spinner
    const result = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`); // Fetch newest movies from the API
    const data = await result.json();
    hideLoadingSpinner(); // Hide the loading spinner
    return data.results;
};

// Fetch available genres from the API
const fetchGenres = async () => {
    const result = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await result.json();
    return data.genres;
};

// Fetch available languages from the API
const fetchLanguages = async () => {
    const result = await fetch(`${BASE_URL}/configuration/languages?api_key=${API_KEY}`);
    const data = await result.json();
    return data;
};

// Populate genre filter options
const populateGenreFilter = async () => {
    const genres = await fetchGenres();
    const genreFilter = document.getElementById('genre-filter');
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreFilter.appendChild(option);
    });
};

// Populate language filter options
const populateLanguageFilter = async () => {
    const languages = await fetchLanguages();
    const languageFilter = document.getElementById('language-filter');
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.iso_639_1;
        option.textContent = language.english_name;
        languageFilter.appendChild(option);
    });
};

// Display movies in the specified container
const displayMovies = (data, containerId) => {
    const container = document.getElementById(containerId); // Get the container element by ID
    if (!container) {
        console.error(`Container with ID '${containerId}' not found.`); // Log an error if the container is not found
        return;
    }
    const library = JSON.parse(localStorage.getItem('library')) || []; // Get the library from local storage
    container.innerHTML = ''; // Clear the container
    data.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';
        const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null; // Get the poster path
        const isInLibrary = library.some(item => item.id === movie.id); // Check if the movie is in the library
        movieElement.innerHTML = `
            <div class="movie-poster">
                ${posterPath ? `<img src="${posterPath}" alt="${movie.title}">` : `<div class="placeholder">No Image Available</div>`}
                <h3>${movie.title}</h3>
                <p>Rating: ${movie.vote_average.toFixed(1)}/10</p>
                <div class="buttons">
                    <button class="details-button">More Details</button>
                    <button class="${isInLibrary ? 'remove-button' : 'add-button'}">${isInLibrary ? 'Remove from Library' : 'Add to Library'}</button>
                </div>
            </div>
        `;
        movieElement.querySelector('.movie-poster').addEventListener('click', () => showMovieDetails(movie.id));
        movieElement.querySelector('.details-button').addEventListener('click', (event) => {
            event.stopPropagation(); // Stop event propagation to prevent the movie details modal from opening
            showMovieDetails(movie.id)
        });
        const toggleButton = movieElement.querySelector(isInLibrary ? '.remove-button' : '.add-button'); // Get the toggle button
        toggleButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Stop event propagation to prevent the movie details modal from opening
            toggleLibrary(movie, toggleButton)
        }
        );
        container.appendChild(movieElement);
    });
};

// Show movie details in a modal
const showMovieDetails = (movieId) => {
    fetchMovieDetails(movieId)
        .then(data => {
            const posterPath = data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : null; // Get the poster path
            movieDetailsContent.innerHTML = `
                <h2>${data.title}</h2>
                ${posterPath ? `<img src="${posterPath}" alt="${data.title}">` : `<div class="placeholder">No Image Available</div>`}
                <p>${data.overview}</p>
                <p>Release Date: ${data.release_date}</p>
                <p>Rating: ${data.vote_average.toFixed(1)}/10</p>
                <p>Runtime: ${data.runtime} minutes</p>
                <p>Genres: ${data.genres.map(genre => genre.name).join(', ')}</p>
            `;
            movieModal.style.display = 'block';
        });
};

// Fetch movie details by ID
const fetchMovieDetails = async (movieId) => {
    showLoadingSpinner(); // Show the loading spinner
    const result = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`); // Fetch movie details from the API
    const data = await result.json();
    hideLoadingSpinner(); // Hide the loading spinner
    return data;
};

// Show a popup message
const showPopupMessage = (message, type) => {
    const popupContainer = document.getElementById('popup-container');
    const popupMessage = document.createElement('div');
    popupMessage.className = `popup-message ${type}`;
    popupMessage.textContent = message;
    popupContainer.appendChild(popupMessage);

    // Fade in the message
    setTimeout(() => {
        popupMessage.style.opacity = 1;
    }, 10);

    // Remove the message after 3 seconds
    setTimeout(() => {
        popupMessage.style.opacity = 0;
        setTimeout(() => {
            popupMessage.remove();
        }, 500); // Wait for the fade-out transition to complete
    }, 3000);
};

// Remove a movie from the library
const removeFromLibrary = (movieId) => {
    let library = JSON.parse(localStorage.getItem('library')) || []; // Get the library from local storage
    library = library.filter(movie => movie.id !== movieId);
    localStorage.setItem('library', JSON.stringify(library)); // Update the library in local storage
    displayLibrary(); // Refresh the library view
    showPopupMessage('Movie removed from library!', 'lib-remove');
};

// Toggle a movie in the library (add/remove)
const toggleLibrary = (movie, button) => {
    let library = JSON.parse(localStorage.getItem('library')) || []; // Get the library from local storage
    if (library.some(item => item.id === movie.id)) {
        library = library.filter(item => item.id !== movie.id); // Remove the movie from the library
        localStorage.setItem('library', JSON.stringify(library)); // Update the library in local storage
        button.textContent = 'Add to Library';
        button.classList.remove('remove-button');
        button.classList.add('add-button');
        showPopupMessage('Movie removed from library!', 'lib-remove');
    } else {
        library.push(movie);
        localStorage.setItem('library', JSON.stringify(library)); // Update the library in local storage
        button.textContent = 'Remove from Library';
        button.classList.remove('add-button');
        button.classList.add('remove-button');
        showPopupMessage('Movie added to library!', 'success');
    }
};

// Display the library view
const displayLibrary = () => {
    const library = JSON.parse(localStorage.getItem('library')) || []; // Get the library from local storage
    searchResults.style.display = 'none'; // Hide the search results view
    homeSection.style.display = 'none'; // Hide the home view
    libraryResults.style.display = 'block'; // Show the library view
    libraryResultsList.innerHTML = '';
    library.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';
        const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null; // Get the poster path
        movieElement.innerHTML = `
            <div class="movie-poster">
                ${posterPath ? `<img src="${posterPath}" alt="${movie.title}">` : `<div class="placeholder">No Image Available</div>`}
                <h3>${movie.title}</h3>
                <p>Rating: ${movie.vote_average.toFixed(1)}/10</p>
                <div class="buttons">
                    <button class="details-button">More Details</button>
                    <button class="remove-button">Remove from Library</button>
                </div>
            </div>
        `;
        movieElement.querySelector('.movie-poster').addEventListener('click', () => showMovieDetails(movie.id));
        movieElement.querySelector('.details-button').addEventListener('click', () => showMovieDetails(movie.id));
        movieElement.querySelector('.remove-button').addEventListener('click', (event) => {
            event.stopPropagation(); // Stop event propagation to prevent the movie details modal from opening
            removeFromLibrary(movie.id)
        });
        libraryResultsList.appendChild(movieElement);
    });
};

// Show the search results view
const showSearchResults = () => {
    const storedResults = localStorage.getItem('searchResults'); // Get stored search results from local storage
    if (storedResults) {
        const data = JSON.parse(storedResults);
        displayMovies(data, 'search-results-list');
    }
    homeSection.style.display = 'none'; // Hide the home view
    libraryResults.style.display = 'none'; // Hide the library view
    searchResults.style.display = 'block'; // Show the search results view
};

// Display the home view with top-rated and newest movies
const displayHome = async () => {
    searchResults.style.display = 'none'; // Hide the search results view
    libraryResults.style.display = 'none'; // Hide the library view
    homeSection.style.display = 'block'; // Show the home view

    const topRatedMovies = await fetchTopRatedMovies();
    displayMovies(topRatedMovies, 'top-rated-list');

    const newestMovies = await fetchNewestMovies();
    displayMovies(newestMovies, 'newest-list');
};

// Event listener for tab buttons
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');

        // Remove active class from all tab buttons and contents
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to the clicked tab button and corresponding content
        button.classList.add('active');
        document.getElementById(tab).classList.add('active');
    });
});

// Function to show the loading spinner
const showLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
};

// Function to hide the loading spinner
const hideLoadingSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
};