const API_KEY = 'ae23b53a5c399fa011d094977a6e2c6a';
const API_URL = 'https://api.themoviedb.org/3';

document.getElementById('search-button').addEventListener('click', searchMovie);

function searchMovie() {
    const query = document.getElementById('movie-search').value.trim();
    const resultsDiv = document.getElementById('movie-results');

    if (query === '') {
        resultsDiv.innerHTML = '<p class="text-danger">Please enter a movie name.</p>';
        return;
    }

    axios.get(`${API_URL}/search/movie`, {  // Změněno z BASE_URL na API_URL
        params: {
            api_key: API_KEY,        // Použití konstanty API_KEY místo opakovaného zápisu klíče
            query: query,
            language: 'en-US',
        }
    })
    .then(response => {
        const movies = response.data.results;
        displayResults(movies);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        resultsDiv.innerHTML = '<p class="text-danger">An error occurred while fetching data. Please try again.</p>';
    });
}
