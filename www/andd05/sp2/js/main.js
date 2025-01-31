const API_KEY = '3bdf5f0ef7ee4c979b2dd1bfd8814378';
const API_URL = 'https://api.rawg.io/api/games';

let currentPage = 1;
const maxVisiblePages = 5;
const pageSize = 15; // Number of games per page
let ratingsChartInstance = null;
const savedGames = new Map();
const gameCache = new Map();

const gameTitle = document.getElementById('gameTitle');
const gameImage = document.getElementById('gameImage');
const gameGenres = document.getElementById('gameGenres');
const gameRating = document.getElementById('gameRating');
const gameReleased = document.getElementById('gameReleased');
const gameDescription = document.getElementById('gameDescription');
const detailsSection = document.getElementById('detailsSection');
const backButton = document.getElementById('backButton');
const searchSection = document.getElementById('searchSection');
const savedGamesSection = document.getElementById('savedGamesSection');
const loadingSpinner = document.getElementById('loadingSpinner');
const saveGameButton = document.getElementById('saveGameButton');
const searchForm = document.getElementById('searchForm');
const searchBar = document.getElementById('searchBar');
const genreFilter = document.getElementById('genreFilter');
const sortFilter = document.getElementById('sortFilter');
const resultsContainer = document.getElementById('results');
const paginationContainer = document.getElementById('pagination');
const noResultsMessage = document.getElementById('noResultsMessage');
const loadingMessage = document.getElementById('loadingMessage');
const toggleSavedGamesButton = document.getElementById('toggleSavedGames');
const backToSearchButton = document.getElementById('backToSearchButton');
const carouselContent = document.getElementById('carouselContent');
const ctx = document.getElementById('ratingsChart').getContext('2d');
const savedGamesList = document.getElementById("savedGamesList");


searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    fetchGames(searchBar.value, genreFilter.value, 1, sortFilter.value);
});

backButton.addEventListener('click', () => {
    detailsSection.style.display = 'none';
    searchSection.style.display = 'block';
    toggleSavedGamesButton.textContent = 'My List';

    // Ensure we don't push duplicate states
    if (!history.state || history.state.section !== 'search') {
        history.pushState({ section: 'search' }, '', '');
    }
});

toggleSavedGamesButton.addEventListener('click', () => {
    if (searchSection.style.display !== 'none') {
        searchSection.style.display = 'none';
        savedGamesSection.style.display = 'block';
        toggleSavedGamesButton.textContent = 'Back to Search';

        if (!history.state || history.state.section !== 'savedGames') {
            history.pushState({ section: 'savedGames' }, '', '');
        }
    } else {
        searchSection.style.display = 'block';
        savedGamesSection.style.display = 'none';
        toggleSavedGamesButton.textContent = 'My List';

        if (!history.state || history.state.section !== 'search') {
            history.pushState({ section: 'search' }, '', '');
        }
    }
});

backToSearchButton.addEventListener('click', () => {
    savedGamesSection.style.display = 'none';
    searchSection.style.display = 'block';
    toggleSavedGamesButton.textContent = 'My List';

    if (!history.state || history.state.section !== 'search') {
        history.pushState({ section: 'search' }, '', '');
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    loadSavedGamesFromStorage();
    await loadGenres();
});

window.addEventListener('popstate', async (event) => {
    if (!event.state) return;

    searchSection.style.display = 'none';
    detailsSection.style.display = 'none';
    savedGamesSection.style.display = 'none';

    if (event.state.section === 'details') {
        await viewDetails(event.state.gameId);
        detailsSection.style.display = 'block';
    } else if (event.state.section === 'search') {
        const { query, genre, page, sortBy } = event.state;
        searchSection.style.display = 'block';
        toggleSavedGamesButton.textContent = 'My List';

        searchBar.value = query || '';
        genreFilter.value = genre || '';
        sortFilter.value = sortBy || '';

        currentPage = page || 1;
        await fetchGames(query, genre, currentPage, sortBy);
    } else if (event.state.section === 'savedGames') {
        savedGamesSection.style.display = 'block';
        toggleSavedGamesButton.textContent = 'Back to Search';
    }
});

const fetchGames = async (query = '', genre = '', page = 1, sortBy = '') => {
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
        } else if (sortBy === 'most-rated') {
            games.sort((a, b) => b.ratings_count - a.ratings_count);
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

const fetchScreenshots = async (gameId) => {
    const response = await axios.get(`${API_URL}/${gameId}/screenshots?key=${API_KEY}`);
    const screenshots = response.data.results;
    carouselContent.innerHTML = screenshots.map((screenshot, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${screenshot.image}" class="d-block w-100" alt="Screenshot">
        </div>
    `).join('');
}

const displayResults = async (games) => {
    resultsContainer.innerHTML = '';

    let savedGamesSet = new Set(savedGames.keys());
    const fragment = document.createDocumentFragment();

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'col-md-4';

        const isSaved = savedGamesSet.has(game.id);
        card.innerHTML = `
            <div class="card h-100">
                <img src="${game.background_image}" class="card-img-top" alt="${game.name}">
                <div class="card-body">
                    <h5 class="card-title">${game.name}</h5>
                    <p class="card-text">${game.genres.map(genre => genre.name).join(' | ') || 'Unknown'}</p>
                    <p class="card-rating">⭐ ${game.rating.toFixed(1)} / 5 <span>(${game.ratings_count} ratings)</span></p>
                    <div class="card-bottom">
                        <button class="btn btn-primary view-details-btn" data-game-id="${game.id}">View Details</button>
                        <button class="btn ${isSaved ? 'btn-danger' : 'btn-success'} save-game-btn" data-game-id="${game.id}">
                            ${isSaved ? "Remove from List" : "Add to List"}
                        </button>
                    </div>
                </div>
            </div>
        `;

        fragment.appendChild(card);
    });

    resultsContainer.appendChild(fragment);

    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function () {
            const gameId = parseInt(this.getAttribute('data-game-id'));
            viewDetails(gameId);
        });
    });

    document.querySelectorAll('.save-game-btn').forEach(button => {
        button.addEventListener('click', function () {
            const gameId = parseInt(this.getAttribute('data-game-id'));
            toggleGame({ id: gameId, name: games.find(g => g.id === gameId).name });
        });
    });
};

const viewDetails = async (gameId) => {
    searchSection.style.display = 'none';
    savedGamesSection.style.display = 'none';
    detailsSection.style.display = 'none';
    loadingSpinner.style.display = 'block';

    try {
        let game;
        if (gameCache.has(gameId)) {
            game = gameCache.get(gameId);
        } else {
            const response = await axios.get(`${API_URL}/${gameId}?key=${API_KEY}`);
            game = response.data;
            gameCache.set(gameId, game);
        }

        gameTitle.innerText = game.name;
        gameImage.src = game.background_image || 'default-image.jpg';
        gameGenres.innerText = game.genres.map(genre => genre.name).join(', ') || 'Unknown';
        gameRating.innerText = `${game.rating} (${game.ratings_count} ratings)`;
        gameReleased.innerText = game.released ? moment(game.released).format('DD. MM. YYYY') : 'N/A';
        gameDescription.innerText = game.description_raw || 'No detailed description available.';

        const isSaved = savedGames.has(game.id);
        saveGameButton.textContent = isSaved ? "Remove from List" : "Add to List";
        saveGameButton.className = `btn ${isSaved ? "btn-danger" : "btn-success"}`;
        saveGameButton.onclick = () => toggleGame(game);

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

const generateRatingsChart = (ratings) => {
    if (!ratings || ratings.length === 0) {
        console.warn('No ratings data available.');
        return;
    }

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

const setupPagination = (totalResults, query, genre, sortBy) => {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalResults / pageSize);
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    const fragment = document.createDocumentFragment();

    if (currentPage > 1) {
        fragment.appendChild(createPaginationButton('First', 1, query, genre, sortBy));
        fragment.appendChild(createPaginationButton('Prev', currentPage - 1, query, genre, sortBy));
    }

    for (let i = startPage; i <= endPage; i++) {
        fragment.appendChild(createPaginationButton(i, i, query, genre, sortBy, i === currentPage));
    }

    if (currentPage < totalPages) {
        fragment.appendChild(createPaginationButton('Next', currentPage + 1, query, genre, sortBy));
        fragment.appendChild(createPaginationButton('Last', totalPages, query, genre, sortBy));
    }

    paginationContainer.appendChild(fragment);
}

const createPaginationButton = (text, page, query, genre, sortBy, isActive = false) => {
    const button = document.createElement('button');
    button.className = `btn btn-outline-primary mx-1 ${isActive ? 'active' : ''}`;
    button.innerText = text;
    button.addEventListener('click', async () => {
        if (currentPage !== page) {
            currentPage = page;
            await fetchGames(query, genre, currentPage, sortBy);
            history.pushState({ section: 'search', query, genre, sortBy, page: currentPage }, '', '');
        }
    });
    return button;
}

const loadSavedGamesFromStorage = () => {
    const storedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
    savedGames.clear();
    storedGames.forEach(game => savedGames.set(game.id, game.name));
    updateSavedGamesUI();
}

const saveGamesToStorage = () => {
    const gamesArray = Array.from(savedGames.entries()).map(([id, name]) => ({ id, name }));
    localStorage.setItem("savedGames", JSON.stringify(gamesArray));
}

const toggleGame = (game) => {
    const button = document.querySelector(`.save-game-btn[data-game-id="${game.id}"]`);

    if (savedGames.has(game.id)) {
        savedGames.delete(game.id);
        if (button) {
            button.textContent = "Add to List";
            button.classList.remove("btn-danger");
            button.classList.add("btn-success");
        }
        if (saveGameButton) {
            saveGameButton.textContent = "Add to List";
            saveGameButton.classList.remove("btn-danger");
            saveGameButton.classList.add("btn-success");
        }
    } else {
        savedGames.set(game.id, game.name);
        if (button) {
            button.textContent = "Remove from List";
            button.classList.remove("btn-success");
            button.classList.add("btn-danger");
        }
        if (saveGameButton) {
            saveGameButton.textContent = "Remove from List";
            saveGameButton.classList.remove("btn-success");
            saveGameButton.classList.add("btn-danger");
        }
    }

    saveGamesToStorage();
    updateSavedGamesUI();
}

const updateSavedGamesUI = () => {
    savedGamesList.innerHTML = "";
    const fragment = document.createDocumentFragment();

    savedGames.forEach((name, id) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        listItem.innerHTML = `
            <span>${name}</span>
            <div>
                <button class="btn btn-primary btn-sm view-details-btn" data-game-id="${id}">View Details</button>
                <button class="btn btn-danger btn-sm remove-game-btn" data-game-id="${id}">Remove</button>
            </div>
        `;
        fragment.appendChild(listItem);
    });

    savedGamesList.appendChild(fragment);

    document.querySelectorAll(".view-details-btn").forEach(button => {
        button.addEventListener("click", function () {
            const gameId = parseInt(this.getAttribute("data-game-id"));
            viewDetails(gameId);
        });
    });

    document.querySelectorAll(".remove-game-btn").forEach(button => {
        button.addEventListener("click", function () {
            const gameId = parseInt(this.getAttribute("data-game-id"));
            toggleGame({ id: gameId });
        });
    });
}

const loadGenres = async () => {
    try {
        const response = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
        const genres = response.data.results;

        genreFilter.innerHTML = '<option value="">All Genres</option>';

        const fragment = document.createDocumentFragment();
        genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.slug;
            option.textContent = genre.name;
            fragment.appendChild(option);
        });

        genreFilter.appendChild(fragment);
    } catch (error) {
        console.error("Error loading genres:", error);
    }
};
