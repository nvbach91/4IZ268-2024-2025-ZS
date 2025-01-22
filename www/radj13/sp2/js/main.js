// API configuration
const API_KEY = 'd3a4ad3d4c43dec3196f08df4ea46108';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Event listener for the search form submission
document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const searchValue = document.getElementById('search-input').value.trim();
    if (!searchValue) {
        showPopupMessage('You can\'t search with no input!', 'error'); // Show error if input is empty
        return;
    }
    const data = await fetchMovies(searchValue);
    if (data.length === 0) {
        displayMovies(data, 'search-results-list');
        showPopupMessage('No movies found!', 'error'); // Show error if no movies are found
        return;
    }
    displayMovies(data, 'search-results-list');
    localStorage.setItem('searchResults', JSON.stringify(data));
    localStorage.setItem('currentView', 'searchResults');
    showSearchResults();
});

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
const closeButton = document.querySelector('.close-button');

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
    hideLoadingSpinner(); // Hide the loading spinner
});

// Fetch movies based on search value
const fetchMovies = async (searchValue) => {
    showLoadingSpinner(); // Show the loading spinner
    const result = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchValue}`); // Fetch searched movies from the API
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
            ${posterPath ? `<img src="${posterPath}" alt="${movie.title}">` : `<div class="placeholder">No Image Available</div>`}
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average}</p>
            <div class="buttons">
                <button class="details-button">More Details</button>
                <button class="${isInLibrary ? 'remove-button' : 'add-button'}">${isInLibrary ? 'Remove from Library' : 'Add to Library'}</button>
            </div>
        `;
        movieElement.querySelector('.details-button').addEventListener('click', () => showMovieDetails(movie.id));
        const toggleButton = movieElement.querySelector(isInLibrary ? '.remove-button' : '.add-button'); // Get the toggle button
        toggleButton.addEventListener('click', () => toggleLibrary(movie, toggleButton));
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
                <p>Rating: ${data.vote_average}</p>
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
    showPopupMessage('Movie removed from library!', 'success');
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
        showPopupMessage('Movie removed from library!', 'success');
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
            ${posterPath ? `<img src="${posterPath}" alt="${movie.title}">` : `<div class="placeholder">No Image Available</div>`}
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average}</p>
            <div class="buttons">
                <button class="details-button">More Details</button>
                <button class="remove-button">Remove from Library</button>
            </div>
        `;
        movieElement.querySelector('.details-button').addEventListener('click', () => showMovieDetails(movie.id));
        movieElement.querySelector('.remove-button').addEventListener('click', () => removeFromLibrary(movie.id));
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