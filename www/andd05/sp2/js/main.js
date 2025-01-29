const API_KEY = '3bdf5f0ef7ee4c979b2dd1bfd8814378';
const API_URL = 'https://api.rawg.io/api/games';

let currentPage = 1;
const maxVisiblePages = 5;
const pageSize = 15; // Number of games per page
let ratingsChartInstance = null;

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload

    const query = document.getElementById('searchBar').value;
    const genre = document.getElementById('genreFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    fetchGames(query, genre, 1, sortBy);
});

document.getElementById('backButton').addEventListener('click', () => {
    document.getElementById('detailsSection').style.display = 'none';
    document.getElementById('searchSection').style.display = 'block';
    document.getElementById('toggleSavedGames').textContent = 'My List';

    // Avoid pushing the same state again
    const currentState = history.state || {};
    if (currentState.section !== 'search') {
        history.pushState({ section: 'search' }, '', '');
    }
});

document.getElementById('toggleSavedGames').addEventListener('click', function() {
    const searchSection = document.getElementById('searchSection');
    const savedGamesSection = document.getElementById('savedGamesSection');
    
    if (searchSection.style.display !== 'none') {
        searchSection.style.display = 'none';
        savedGamesSection.style.display = 'block';
        this.textContent = 'Back to Search';

        history.pushState({ section: 'savedGames' }, '', '');
    } else {
        searchSection.style.display = 'block';
        savedGamesSection.style.display = 'none';
        this.textContent = 'View Saved Games';

        history.pushState({ section: 'search' }, '', '');
    }
});

document.getElementById('backToSearchButton').addEventListener('click', function() {
    document.getElementById('savedGamesSection').style.display = 'none';
    document.getElementById('searchSection').style.display = 'block';
    document.getElementById('toggleSavedGames').textContent = 'My List';
});

document.addEventListener("DOMContentLoaded", () => {
    loadSavedGames();
});

window.addEventListener('popstate', async (event) => {
    if (!event.state) return;

    if (event.state.section === 'details') {
        document.getElementById('searchSection').style.display = 'none';
        document.getElementById('savedGamesSection').style.display = 'none';
        document.getElementById('detailsSection').style.display = 'block';
        await viewDetails(event.state.gameId);
    } else if (event.state.section === 'search') {
        const { query, genre, page, sortBy } = event.state;
        document.getElementById('searchSection').style.display = 'block';
        document.getElementById('detailsSection').style.display = 'none';
        document.getElementById('savedGamesSection').style.display = 'none';

        document.getElementById('toggleSavedGames').textContent = 'My List';
        document.getElementById('searchBar').value = query || '';
        document.getElementById('genreFilter').value = genre || '';
        document.getElementById('sortFilter').value = sortBy || '';

        currentPage = page || 1;
        await fetchGames(query, genre, currentPage, sortBy);
    } else if (event.state.section === 'savedGames') {
        document.getElementById('searchSection').style.display = 'none';
        document.getElementById('detailsSection').style.display = 'none';
        document.getElementById('savedGamesSection').style.display = 'block';

        document.getElementById('toggleSavedGames').textContent = 'Back to Search';
    }
});

async function fetchGames(query = '', genre = '', page = 1, sortBy = '') {
    const noResultsMessage = document.getElementById('noResultsMessage');
    const resultsContainer = document.getElementById('results');
    const paginationContainer = document.getElementById('pagination');
    const loadingMessage = document.getElementById('loadingMessage');

    loadingMessage.style.display = 'block';
    resultsContainer.innerHTML = '';
    paginationContainer.innerHTML = '';
    noResultsMessage.style.display = 'none';

    try {
        let url = `${API_URL}?key=${API_KEY}&page=${page}&page_size=${pageSize}`;

        if (query) url += `&search=${query}`;
        if (genre) url += `&genres=${genre}`;
        const apiSortOptions = {
            'name-asc': 'name',
            'name-desc': '-name',
            'rating-desc': '-rating',
            'rating-asc': 'rating',
            'most-rated': '-ratings_count'
        };

        if (apiSortOptions[sortBy]) {
            url += `&ordering=${apiSortOptions[sortBy]}`;
        }

        const response = await axios.get(url);
        let games = response.data.results;
        if (sortBy === 'name-asc') {
            games.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'name-desc') {
            games.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === 'rating-asc') {
            games.sort((a, b) => a.rating - b.rating);
        }

        loadingMessage.style.display = 'none';

        if (games.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            displayResults(games);
            setupPagination(response.data.count, query, genre, sortBy);
            history.pushState({ section: 'search', query, genre, page, sortBy }, '', '');
        }
    } catch (error) {
        loadingMessage.style.display = 'none';
        console.error('Error fetching data:', error);
        alert('Failed to fetch games. Please try again later.');
    }
}

async function fetchScreenshots(gameId) {
    const response = await axios.get(`${API_URL}/${gameId}/screenshots?key=${API_KEY}`);
    const screenshots = response.data.results;
    const carouselContent = document.getElementById('carouselContent');
    carouselContent.innerHTML = screenshots.map((screenshot, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${screenshot.image}" class="d-block w-100" alt="Screenshot">
        </div>
    `).join('');
}

async function displayResults(games) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    let savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];

    for (const game of games) {
        try {
            const gameDetails = await axios.get(`${API_URL}/${game.id}?key=${API_KEY}`);
            const description = _.truncate(gameDetails.data.description_raw || 'No description available.', {
                'length': 150,
                'separator': ' '
            });
            const rating = gameDetails.data.rating || 0;
            const ratingsCount = gameDetails.data.ratings_count || 0;
            const genres = gameDetails.data.genres.map(genre => genre.name).join(' | ') || 'Unknown';

            const maxRating = 5;
            const stars = Array.from({ length: maxRating }, (_, i) => {
                return i < Math.round(rating) ? '★' : '☆';
            }).join('');

            const isSaved = savedGames.some(g => g.id === game.id);
            const buttonText = isSaved ? "Remove from List" : "Add to List";
            const buttonClass = isSaved ? "btn-danger" : "btn-success";

            const card = document.createElement('div');
            card.className = 'col-md-4';

            card.innerHTML = `
                <div class="card h-100">
                    <img src="${game.background_image}" class="card-img-top" alt="${game.name}">
                    <div class="card-body">
                        <h5 class="card-title">${game.name}</h5>
                        <p class="card-text">${genres}</p>
                        <p class="card-text">${description}</p>
                        <div class="card-bottom">
                            <p class="card-text rating-stars">${stars} <span class="rating-count">(${ratingsCount} ratings)</span></p>
                            <div class="d-flex justify-content-between mt-2">
                                <button class="btn btn-primary view-details-btn" onclick="viewDetails('${game.id}')">View Details</button>
                                <button class="btn ${buttonClass} save-game-btn" data-game-id="${game.id}">${buttonText}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            resultsContainer.appendChild(card);
        } catch (error) {
            console.error('Error fetching game details:', error);
        }
    }

    document.querySelectorAll('.save-game-btn').forEach(button => {
        button.addEventListener('click', function () {
            const gameId = parseInt(this.getAttribute('data-game-id'));
            const game = games.find(g => g.id === gameId);
            if (game) {
                toggleGame(game);
            }
        });
    });
}

async function viewDetails(gameId) {
    const searchSection = document.getElementById('searchSection');
    const savedGamesSection = document.getElementById('savedGamesSection');
    const detailsSection = document.getElementById('detailsSection');
    const loadingSpinner = document.getElementById('loadingSpinner');

    searchSection.style.display = 'none';
    savedGamesSection.style.display = 'none';
    detailsSection.style.display = 'none';
    loadingSpinner.style.display = 'block';

    try {
        const response = await axios.get(`${API_URL}/${gameId}?key=${API_KEY}`);
        const game = response.data;

        document.getElementById('gameTitle').innerText = game.name;
        document.getElementById('gameImage').src = game.background_image;
        document.getElementById('gameGenres').innerText = game.genres.map(genre => genre.name).join(', ') || 'Unknown';
        document.getElementById('gameRating').innerText = `${game.rating} (${game.ratings_count} ratings)`;
        document.getElementById('gameReleased').innerText = game.released ? moment(game.released).format('DD. MM. YYYY') : 'N/A';
        document.getElementById('gameDescription').innerText = game.description_raw || 'No detailed description available.';

        const savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
        const isSaved = savedGames.some(g => g.id === game.id);
        const saveButton = document.getElementById('saveGameButton');
        saveButton.textContent = isSaved ? "Remove from List" : "Add to List";
        saveButton.className = `btn ${isSaved ? "btn-danger" : "btn-success"}`;
        saveButton.onclick = () => toggleGame(game);

        await fetchScreenshots(gameId);
        generateRatingsChart(game.ratings);

        loadingSpinner.style.display = 'none';
        detailsSection.style.display = 'block';

        history.pushState({ section: 'details', gameId }, '', '');
    } catch (error) {
        console.error('Error fetching game details:', error);
        alert('Failed to load game details.');

        loadingSpinner.style.display = 'none';
        searchSection.style.display = 'block';
    }
}

function viewSavedGameDetails(gameId) {
    document.getElementById('savedGamesSection').style.display = 'none';
    document.getElementById('detailsSection').style.display = 'block';
    document.getElementById('toggleSavedGames').textContent = 'My List';
    viewDetails(gameId);
}

function generateRatingsChart(ratings) {
    if (!ratings || ratings.length === 0) {
        console.warn('No ratings data available.');
        return;
    }

    const ctx = document.getElementById('ratingsChart').getContext('2d');

    // Destroy existing chart instance if it exists
    if (ratingsChartInstance) {
        ratingsChartInstance.destroy();
    }

    const labels = ratings.map(rating => `${rating.title} (${rating.count} votes)`);
    const data = ratings.map(rating => rating.percent);

    ratingsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Rating Distribution',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage of Ratings (%)'
                    }
                }
            }
        }
    });
}

function setupPagination(totalResults, query, genre, minRating) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalResults / pageSize);
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (currentPage > 1) {
        const firstButton = createPaginationButton('First', 1, query, genre, minRating);
        const prevButton = createPaginationButton('Prev', currentPage - 1, query, genre, minRating);
        paginationContainer.appendChild(firstButton);
        paginationContainer.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = createPaginationButton(i, i, query, genre, minRating, i === currentPage);
        paginationContainer.appendChild(button);
    }

    if (currentPage < totalPages) {
        const nextButton = createPaginationButton('Next', currentPage + 1, query, genre, minRating);
        const lastButton = createPaginationButton('Last', totalPages, query, genre, minRating);
        paginationContainer.appendChild(nextButton);
        paginationContainer.appendChild(lastButton);
    }
}

function createPaginationButton(text, page, query, genre, minRating, isActive = false) {
    const button = document.createElement('button');
    button.className = `btn btn-outline-primary mx-1 ${isActive ? 'active' : ''}`;
    button.innerText = text;
    button.addEventListener('click', async () => {
        currentPage = page;
        await fetchGames(query, genre, minRating, currentPage);
        history.pushState({ section: 'search', query, genre, minRating, page: currentPage }, '', '');
    });
    return button;
}

function loadSavedGames() {
    let savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
    const savedGamesList = document.getElementById("savedGamesList");
    savedGamesList.innerHTML = "";

    savedGames.forEach(game => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        listItem.innerHTML = `
            <span>${game.name}</span>
            <div>
                <button class="btn btn-primary btn-sm" onclick="viewSavedGameDetails(${game.id})">View Details</button>
                <button class="btn btn-danger btn-sm remove-game-btn" data-game-id="${game.id}">Remove</button>
            </div>
        `;
        savedGamesList.appendChild(listItem);
    });

    document.querySelectorAll(".remove-game-btn").forEach(button => {
        button.addEventListener("click", function () {
            const gameId = parseInt(this.getAttribute("data-game-id"));
            const game = savedGames.find(g => g.id === gameId);
            if (game) {
                toggleGame(game);
            }
        });
    });

    document.querySelectorAll('.save-game-btn').forEach(button => {
        const gameId = parseInt(button.getAttribute('data-game-id'));
        const isSaved = savedGames.some(g => g.id === gameId);
        button.textContent = isSaved ? "Remove from List" : "Add to List";
        button.classList.remove("btn-success", "btn-danger");
        button.classList.add(isSaved ? "btn-danger" : "btn-success");
    });
}

function toggleGame(game) {
    let savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
    const index = savedGames.findIndex(g => g.id === game.id);

    if (index === -1) {
        savedGames.push(game);
    } else {
        savedGames.splice(index, 1);
    }

    localStorage.setItem("savedGames", JSON.stringify(savedGames));
    loadSavedGames();

    const isSaved = savedGames.some(g => g.id === game.id);

    document.querySelectorAll(`.save-game-btn[data-game-id='${game.id}']`).forEach(button => {
        button.textContent = isSaved ? "Remove from List" : "Add to List";
        button.classList.remove("btn-success", "btn-danger");
        button.classList.add(isSaved ? "btn-danger" : "btn-success");
    });

    const saveButton = document.getElementById('saveGameButton');
    if (saveButton) {
        saveButton.textContent = isSaved ? "Remove from List" : "Add to List";
        saveButton.classList.remove("btn-success", "btn-danger");
        saveButton.classList.add(isSaved ? "btn-danger" : "btn-success");
    }
}