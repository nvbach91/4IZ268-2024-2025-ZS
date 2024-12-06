const BASE_API_URL = 'https://api.themoviedb.org';
const API_KEY = '01c9735d1a75d945f97294a56c73df52';

const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const { search } = Object.fromEntries(formData);
    searchResultsContainer.innerHTML = '';
    getSearchResults(search);
});

const getSearchResults = async (searchValue) => {
    const url = `${BASE_API_URL}/3/search/movie?query=${searchValue}&page=1&api_key=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderSearchResults(data);
    } catch (err) {
        console.error(err);
    }
};

const getMovieDetail = async (movieId) => {
    const url = `${BASE_API_URL}/3/movie/${movieId}?api_key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    renderMovieDetails(data);
};

const searchResultsContainer = document.querySelector('ul#search-results');

const renderSearchResults = (data) => {
    const searchResultElements = [];
    data.results.forEach(({ id, name }) => {
        const searchResultElement = document.createElement('li');
        searchResultElement.textContent = `${id} - ${name}`;
        searchResultElement.addEventListener('click', () => {
            getMovieDetail(id);
        });
        searchResultElements.push(searchResultElement);
    });
    searchResultsContainer.append(...searchResultElements);
};

const movieDetailsContainer = document.querySelector('#movie-details');

const renderMovieDetails = (data) => {
    // render elements
    console.log(data);
};