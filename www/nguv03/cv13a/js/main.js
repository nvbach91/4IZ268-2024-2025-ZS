// // location + history API

// const pageHeading = document.querySelector('h1');
// const renderPage = (pageNumber) => {
//     pageHeading.textContent = `Page ${pageNumber}`;
// };
// const pageNumbers = [1, 2, 3, 4];
// const navigationButtons = pageNumbers.map((pageNumber) => {
//     const button = document.createElement('button');
//     button.textContent = `Go to page ${pageNumber}`;
//     button.addEventListener('click', () => {
//         renderPage(pageNumber);
//         history.pushState({}, '', `#${pageNumber}`);
//     });
//     return button;
// });
// window.onpopstate = (e) => {
//     const pageNumber = location.pathname.split('/').slice(-1).join('');
//     renderPage(pageNumber);
// };
// document.body.append(...navigationButtons);
// const hashLocationPageNumber = location.hash.replace('#', '');
// renderPage(hashLocationPageNumber);









const API_KEY = '538899bc3bce717127413a7d2b5aaf31';
const BASE_API_URL = 'https://api.themoviedb.org';
const BASE_POSTER_URL = 'https://image.tmdb.org/t/p/original';

const searchResultsContainer = document.querySelector('#search-results');
const fetchMovieSearchResults = async (searchValue) => {
    const url = `${BASE_API_URL}/3/search/movie?api_key=${API_KEY}&query=${searchValue}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
};

const renderMovieSearchResults = (data) => {
    const { results } = data;
    const movies = results.map((result) => {
        const html = `
            <div class="card col-4">
                <img src="${BASE_POSTER_URL}${result.poster_path}" class="card-img-top" alt="${result.title}">
                <div class="card-body">
                    <h5 class="card-title">${result.title}</h5>
                    <button
                        class="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#movie-details-modal"
                    >
                        Details
                    </button>
                </div>
            </div>
        `;
        const movie = document.createElement('div');
        movie.innerHTML = html;
        movie.querySelector('button').addEventListener('click', async () => {
            movieDetailsModal.querySelector('.modal-body').innerHTML = `
                <div class="spinner-border text-primary">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `;
            const movieDetailsData = await fetchMovieDetails(result.id);
            renderMovieDetails(movieDetailsData);
        });
        return movie.querySelector('.card');
    });
    searchResultsContainer.innerHTML = '';
    searchResultsContainer.append(...movies);
};
const movieDetailsContainer = document.querySelector('#movie-details');

const fetchMovieDetails = async (movieId) => {
    const url = `${BASE_API_URL}/3/movie/${movieId}?api_key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
};

const movieDetailsModal = document.querySelector('#movie-details-modal');

const renderMovieDetails = (data) => {
    // render elements
    const { title, poster_path, release_date, genres, budget } = data;
    const dom = `
        <div class="movie text-center">
            <h3 class="movie-title">${title}</h3>
            <div class="movie-poster"><img src="${BASE_POSTER_URL}${poster_path}" alt="POSTER: ${title}"></div>
            <div class="movie-release">${release_date}</div>
            <div class="movie-genres">${genres.map(({ name }) => name).join(', ')}</div>
            <div class="movie-budget">$${budget}</div>
        </div>
    `;
    movieDetailsModal.querySelector('.modal-body').innerHTML = dom;
};

const searchForm = document.querySelector('#search-form');
const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const { searchValue } = Object.fromEntries(formData);
    const movieSearchData = await fetchMovieSearchResults(searchValue);
    renderMovieSearchResults(movieSearchData);
    localStorage.setItem('searchValue', searchValue);
};
searchForm.addEventListener('submit', submitForm);

(async () => {
    if (localStorage.getItem('searchValue')) {
        const searchValue = localStorage.getItem('searchValue');
        searchForm.querySelector('input[name="searchValue"]').value = searchValue;
        const movieSearchData = await fetchMovieSearchResults(searchValue);
        renderMovieSearchResults(movieSearchData);
    }
})();

(async () => {
    const url = location.href;
    const urlObject = new URL(url);
    const searchValue = urlObject.searchParams.get('searchValue');
    searchForm.querySelector('input[name="searchValue"]').value = searchValue;
    const movieSearchData = await fetchMovieSearchResults(searchValue);
    renderMovieSearchResults(movieSearchData);
})();