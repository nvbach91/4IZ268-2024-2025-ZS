const BASE_API_URL = 'https://api.rawg.io/api';
const API_KEY = '3bdf5f0ef7ee4c979b2dd1bfd8814378';
const searchResultsContainer = $('#search-results');

const fetchGameSearchResults = async () => {
    const url = `${BASE_API_URL}/games/29593?key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log(data);
        displaySearchResults(data);
        return data;
    } catch (error) {
        console.error('Error fetching game data:', error);
    }
};

const displaySearchResults = (data) => {
    if (typeof _ === 'undefined') {
        console.error('Lodash is not loaded.');
        return;
    }

    const gameName = _.get(data, 'name', 'Unknown Game');
    const description = _.get(data, 'description_raw', 'No description available.');

    const resultHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${gameName}</h5>
                <p class="card-text">${description}</p>
            </div>
        </div>
    `;
    searchResultsContainer.html(resultHTML);
};

fetchGameSearchResults();
