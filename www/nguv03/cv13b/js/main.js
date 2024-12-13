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
      <div class="movie card col-4 text-center">
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
    const movieContainer = document.createElement('div');
    movieContainer.innerHTML = html;
    movieContainer.querySelector('button').addEventListener('click', async () => {
      modalContainer.querySelector('.modal-body').innerHTML = `
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      `;
      const movieDetailsData = await fetchMovieDetails(result.id);
      renderMovieDetails(movieDetailsData);
    });
    return movieContainer.firstElementChild;
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
const modalContainer = document.querySelector('#movie-details-modal');
const renderMovieDetails = (data) => {
  // render elements
  const { title, poster_path, release_date, genres, budget, overview } = data;
  const dom = `
      <div class="movie">
        <h3 class="movie-title">${title}</h3>
        <div class="movie-poster">
          <img width="200" src="${BASE_POSTER_URL}${poster_path}" alt="POSTER: ${title}">
        </div>
        <div class="movie-overview">${overview}</div>
        <div class="movie-release">${release_date}</div>
        <div class="movie-genres">${genres.map(({ name }) => name).join(', ')}</div>
        <div class="movie-budget">$${budget}</div>
      </div>
    `;
  modalContainer.querySelector('.modal-body').innerHTML = dom;
};

const fetchAndRenderSearchResults = async (searchValue) => {
  const movieSearchData = await fetchMovieSearchResults(searchValue);
  renderMovieSearchResults(movieSearchData);
  localStorage.setItem('searchValue', searchValue);
};

const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(searchForm);
  const { searchValue } = Object.fromEntries(formData);
  fetchAndRenderSearchResults(searchValue);
});

// IIFE = immediately invoked function expression
(async () => {
  const url = new URL(location.href);
  const searchValue = url.searchParams.get('searchValue');
  if (searchValue) {
    fetchAndRenderSearchResults(searchValue);
  } else {
    const searchValue = localStorage.getItem('searchValue');
    if (searchValue) {
      searchForm.querySelector('input[name="searchValue"]').value = searchValue;
      fetchAndRenderSearchResults(searchValue);
    }
  }
})();