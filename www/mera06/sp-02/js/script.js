const apiKey = '1a194ae9';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const yearInput = document.getElementById('year-input');
const typeInput = document.getElementById('type-input');
const resultsSection = document.getElementById('results');
const favoritesList = document.getElementById('favorites-list');
const base_url = 'https://www.omdbapi.com/';

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let lastSearch = JSON.parse(localStorage.getItem('lastSearch')) || { query: '', year: '', type: '' };

// Render favorites
const renderFavorites = () => {
    favoritesList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    favorites.forEach((movie) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.innerHTML = `<span>${movie.Title} (${movie.Year})</span>`;

        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View';
        viewBtn.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
        viewBtn.addEventListener('click', async () => {
            const details = await fetchMovieDetails(movie.imdbID);
            displayDetails(details);
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        removeBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to remove this movie from favorites?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, remove it!',
                cancelButtonText: 'No, keep it',
            }).then((result) => {
                if (result.isConfirmed) {
                    favorites = favorites.filter(f => f.imdbID !== movie.imdbID);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    renderFavorites();
                    Swal.fire('Removed!', 'The movie has been removed from favorites.', 'success');
                }
            });
        });

        const buttonGroup = document.createElement('div');
        buttonGroup.appendChild(viewBtn);
        buttonGroup.appendChild(removeBtn);

        li.appendChild(buttonGroup);
        fragment.appendChild(li);
    });

    favoritesList.appendChild(fragment);
};

// Fetch movies
const fetchMovies = async (query, year, type) => {
    resultsSection.innerHTML = '<p class="text-center">Loading...</p>';
    const url = `${base_url}?apikey=${apiKey}&s=${query}${year ? `&y=${year}` : ''}${type ? `&type=${type}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.Search || [];
};

// Fetch movie details
const fetchMovieDetails = async (imdbID) => {
    const url = `${base_url}?apikey=${apiKey}&i=${imdbID}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

const displayResults = (movies) => {
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
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'}" alt="${movie.Title}" class="card-img-top">
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

        div.querySelector('.view-details').addEventListener('click', async () => {
            const details = await fetchMovieDetails(movie.imdbID);
            displayDetails(details);
        });

        div.querySelector('.toggle-favorite').addEventListener('click', (event) => {
            const isFavorite = favorites.some(f => f.imdbID === movie.imdbID);

            if (isFavorite) {
                favorites = favorites.filter(f => f.imdbID !== movie.imdbID);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                renderFavorites();

                event.target.textContent = 'Add to Favorites';
                event.target.classList.remove('btn-danger');
                event.target.classList.add('btn-success');
                Swal.fire('Removed!', 'The movie has been removed from favorites.', 'success');
            } else {
                const minimalData = {
                    Title: movie.Title,
                    Year: movie.Year,
                    Type: movie.Type,
                    imdbID: movie.imdbID,
                };
                favorites.push(minimalData);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                renderFavorites();

                event.target.textContent = 'Remove from Favorites';
                event.target.classList.remove('btn-success');
                event.target.classList.add('btn-danger');
                Swal.fire('Added!', 'The movie has been added to favorites.', 'success');
            }
        });

        fragment.appendChild(div);
    });

    resultsSection.appendChild(fragment);
};




const displayDetails = (details) => {
    const activePane = document.querySelector('.tab-pane.active');
    const detailsSection = activePane.querySelector('#details');
    const isFavorite = favorites.some(f => f.imdbID === details.imdbID);

    detailsSection.innerHTML = `
        <h2>${details.Title}</h2>
        <p><strong>Year:</strong> ${details.Year}</p>
        <p><strong>Genre:</strong> ${details.Genre}</p>
        <p><strong>Director:</strong> ${details.Director}</p>
        <p><strong>Plot:</strong> ${details.Plot}</p>
        <img src="${details.Poster}" alt="${details.Title}" class="img-fluid mb-3">
        <button id="favorite-action" class="btn mt-3 ${
            isFavorite ? 'btn-danger' : 'btn-success'
        }">
            ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
    `;

    const favoriteActionButton = document.getElementById('favorite-action');

    favoriteActionButton.addEventListener('click', () => {
        if (isFavorite) {
            // Remove from favorites
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to remove this movie from favorites?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, remove it!',
                cancelButtonText: 'No, keep it',
            }).then((result) => {
                if (result.isConfirmed) {
                    favorites = favorites.filter(f => f.imdbID !== details.imdbID);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    renderFavorites();

                    displayDetails(details);

                    Swal.fire('Removed!', 'The movie has been removed from favorites.', 'success');
                }
            });
        } else {
            // Add to favorites
            const minimalData = {
                Title: details.Title,
                Year: details.Year,
                Type: details.Type,
                imdbID: details.imdbID,
            };
            favorites.push(minimalData);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();

            displayDetails(details);

            Swal.fire('Added!', 'The movie has been added to favorites.', 'success');
        }
    });

    detailsSection.scrollIntoView({ behavior: 'smooth' });
};


// Handle form submission
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value;
    const year = yearInput.value;
    const type = typeInput.value;

    lastSearch = { query, year, type };
    localStorage.setItem('lastSearch', JSON.stringify(lastSearch));

    const movies = await fetchMovies(query, year, type);
    displayResults(movies);
});

// Initialize
(async () => {
    renderFavorites();

    if (lastSearch.query) {
        searchInput.value = lastSearch.query;
        yearInput.value = lastSearch.year;
        typeInput.value = lastSearch.type;
        const movies = await fetchMovies(lastSearch.query, lastSearch.year, lastSearch.type);
        displayResults(movies);
    }
})();
