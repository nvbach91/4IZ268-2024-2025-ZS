// Globální konstanty pro API a konfiguraci
const API_KEY = '893c2b20ff334bcff61db54c19370af0';
const MAX_RATING = 10;
const BASE_URL = 'https://api.themoviedb.org/3/';
let GENRE_NAMES = {};

// Cache DOM elementů pro lepší výkon
const $DOM = {
    searchForm: $('#searchForm'),
    searchInput: $('#searchInput'),
    searchResults: $('#searchResults'),
    searchResultsWrapper: $('#searchResultsWrapper'),
    favorites: $('#favorites'),
    favoritesWrapper: $('#favoritesWrapper'),
    topRated: $('#topRated'),
    topRatedWrapper: $('#topRatedWrapper'),
    recommendedMovies: $('#recommendedMovies'),
    recommendedWrapper: $('#recommendedMoviesWrapper'),
    ratedMovies: $('#ratedMovies'),
    ratedMoviesWrapper: $('#ratedMoviesWrapper'),
    menuCategories: $('.menu-categories'),
    sections: $('.section'),
    navLinks: $('.nav-link'),
    homeButton: $('#homeButton'),
    favoritesButton: $('#favoritesButton'),
    ratedButton: $('#ratedButton'),
    movieToast: $('#movieToast'),
    loader: $('#loader'),
    pageTitle: $('h1'),
    loaderElement: $('#loader'),
    menuCategoriesContainer: $('.menu-categories'),
    toast: $('#movieToast'),
    toastBody: $('#movieToast .toast-body'),
    burgerButton: $('#burgerButton'),
    closeMenuButton: $('.close-menu'),
    menuOverlay: $('.menu-overlay'),
    aside: $('aside')
};

// Funkce pro zobrazení/skrytí načítacího indikátoru
const showLoader = () => {
    $DOM.loaderElement.addClass('visible');
};

const hideLoader = () => {
    $DOM.loaderElement.removeClass('visible');
};

// Inicializace aplikace po načtení DOMu
(($ => {
    $(() => {
        fetchGenres().then(() => {
            handleHashChange();
            
            // Fix h1 click handler - prevent default and remove duplicate
            $DOM.pageTitle.on('click', (event) => {
                event.preventDefault();
                window.location.hash = '';  // Reset to home state
                handleHashChange();
            }).css('cursor', 'pointer');
            
            $DOM.searchForm.on('submit', (event) => {
                event.preventDefault();
                const rawQuery = $DOM.searchInput.val();
                const query = validateInput(rawQuery);
                
                if (query.length < 2) {
                    showToast('Vyhledávaný text musí mít alespoň 2 znaky');
                    return;
                }
                
                if (query) {
                    window.location.hash = `search-${encodeURIComponent(query)}`;
                    handleHashChange();
                } else {
                    showToast('Neplatný vstup pro vyhledávání');
                }
            });

            $DOM.homeButton.on('click', (event) => {
                event.preventDefault();
                window.location.hash = '';
                handleHashChange();
            });

            $DOM.favoritesButton.on('click', (event) => {
                event.preventDefault();
                window.location.hash = 'favorites';
                handleHashChange();
            });

            $DOM.menuCategories.find('.nav-link').on('click', function(event) {
                event.preventDefault();
                const genreId = $(this).data('genre');
                window.location.hash = `genre-${genreId}`;
                handleHashChange();
            });

            $DOM.ratedButton.on('click', (event) => {
                event.preventDefault();
                window.location.hash = 'rated';
                handleHashChange();
            });
        });

        bindDynamicEventListeners();
    });
}))(jQuery);

// Načtení žánrů z API a jejich uložení do paměti
const fetchGenres = async () => {
    const url = `${BASE_URL}genre/movie/list?api_key=${API_KEY}&language=cs-CZ`;
    showLoader();
    try {
        const response = await fetch(url);
        const data = await response.json();
        GENRE_NAMES = data.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
        }, {});
        updateGenreMenu(data.genres);
    } catch (err) {
        console.error('Chyba při načítání žánrů:', err);
    } finally {
        hideLoader();
    }
}

// Vytvoření menu s žánry
const updateGenreMenu = (genres) => {
    const $container = $DOM.menuCategories;
    $container.empty();
    
    genres.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
    
    genres.forEach((genre) => {
        $container.append(
            $('<a>')
                .addClass('nav-link text-white')
                .attr('href', '#')
                .attr('data-genre', genre.id)
                .text(genre.name)
        );
    });
};

// Univerzální funkce pro načtení a zobrazení filmů
const fetchAndRenderMovies = async (url, containerSelector, noResultsMessage = 'Nebyly nalezeny žádné filmy.', limitTo8 = true, afterRender = null) => {
    showLoader();
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        const container = $(containerSelector);
        container.empty();

        if (data.results && data.results.length > 0) {
            generateMovieCards(data.results, containerSelector, limitTo8);
            if (typeof afterRender === 'function') afterRender(data.results);
        } else {
            container.append(`<p>${noResultsMessage}</p>`);
        }
    } catch (err) {
        console.error('Chyba při načítání filmů:', err);
        $(containerSelector).html('<p>Došlo k chybě při načítání filmů.</p>');
    } finally {
        hideLoader();
    }
}

// Univerzální funkce pro volání API
const fetchFromAPI = async (endpoint, params = {}) => {
    showLoader();
    const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=cs-CZ${Object.entries(params).map(([key, value]) => `&${key}=${value}`).join('')}`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (err) {
        console.error('API Error:', err);
        throw err;
    } finally {
        hideLoader();
    }
}

// Přepínání mezi sekcemi aplikace
const showSection = ($button, $section, action) => {
    // Nejdřív připravíme novou sekci
    $section.css('opacity', '0');
    $section.removeClass('d-none');
    
    // Pak skryjeme ostatní sekce
    $DOM.sections.not($section).addClass('d-none');
    $DOM.navLinks.removeClass('active');
    $button.addClass('active');

    // Nakonec zobrazíme novou sekci s animací
    setTimeout(() => {
        $section.css('opacity', '1');
        if (typeof action === 'function') action();
    }, 50);
}

// Načtení nejlépe hodnocených filmů
const fetchTopRatedMovies = async () => {
    const url = `${BASE_URL}movie/top_rated?api_key=${API_KEY}&language=cs-CZ&page=1`;
    await fetchAndRenderMovies(url, '#topRatedWrapper');
}

// Načtení doporučených filmů
const fetchRecommendedMovies = () => {
    const url = `${BASE_URL}movie/popular?api_key=${API_KEY}&language=cs-CZ&page=1`;
    fetchAndRenderMovies(url, '#recommendedMoviesWrapper');
}

// Načtení filmů podle žánru
const fetchMoviesByGenre = async (genreId) => {
    const url = `${BASE_URL}discover/movie?api_key=${API_KEY}&language=cs-CZ&with_genres=${genreId}&sort_by=popularity.desc`;
    
    await fetchAndRenderMovies(url, '#searchResultsWrapper', 'Pro tento žánr nebyly nalezeny žádné filmy.', false);
}

// Vyhledávání filmů podle zadaného textu
const searchMovies = (query) => {
    const validatedQuery = validateInput(query);
    if (!validatedQuery) {
        showToast('Neplatný vstup pro vyhledávání');
        return;
    }
    const url = `${BASE_URL}search/movie?api_key=${API_KEY}&language=cs-CZ&query=${encodeURIComponent(validatedQuery)}`;
    fetchAndRenderMovies(url, '#searchResultsWrapper', 'Nebyly nalezeny žádné filmy.', false, () => {
        $DOM.searchResults.removeClass('d-none')
            .find('h2')
            .text(`Výsledky vyhledávání: ${query}`);
    });
}

// Vytvoření HTML struktury karty filmu
const createMovieCard = (movie) => {
    const favorites = getFromStorage('favorites') || [];
    const ratings = getFromStorage('ratings') || {};
    
    const isFavorite = favorites.some(f => f.id === movie.id);
    const currentRating = ratings[movie.id] || 0;
    
    const buttonHtml = isFavorite ? 
        `<button 
            class="btn btn-sm btn-danger w-100 remove-favorite-btn"
            data-id="${movie.id}"
            data-title="${movie.title.replace("'", "\\'")}"
        >
            Odebrat z oblíbených
        </button>` :
        `<button 
            class="btn btn-sm btn-primary w-100 add-favorite-btn"
            data-id="${movie.id}"
            data-title="${movie.title.replace("'", "\\'")}"
            data-poster="${movie.poster_path}"
        >
            Přidat do oblíbených
        </button>`;

    const ratingHtml = `
        <div class="rating-container mb-2">
            <div class="stars" data-movie-id="${movie.id}">
                ${generateStars(movie.id, currentRating)}
            </div>
            <small class="rating-text">${currentRating > 0 ? `Vaše hodnocení: ${currentRating}/10` : 'Nehodnoceno'}</small>
            ${currentRating > 0 ? 
                `<button 
                    class="btn btn-sm btn-outline-danger mt-1 remove-rating-btn"
                    data-id="${movie.id}"
                >Zrušit hodnocení</button>` 
                : ''}
        </div>
    `;

    const posterPath = movie.poster_path || movie.posterPath;
    const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

    return `
        <div class="movie-card-wrapper col-6 col-md-4 col-lg-3 mb-4">
            <div class="movie-card d-flex flex-column">
                <img class="movie-poster mb-2"
                    src="${posterUrl}" 
                    onerror="this.onerror=null; this.src='${posterUrl}';"
                    alt="${movie.title}" 
                />
                <h3 class="movie-title h6" data-movie-id="${movie.id}" style="cursor: pointer;">${movie.title}</h3>
                <p class="small">Hodnocení TMDB: ${movie.vote_average.toFixed(1)}</p>
                <div class="movie-card__bottom mt-auto">
                    ${ratingHtml}
                    ${buttonHtml}
                </div>
            </div>
        </div>
    `;
}

// Generování karet filmů do zadaného kontejneru
const generateMovieCards = (movies, targetSelector, limitTo8 = true) => {
    const container = $(targetSelector);
    container.empty();
    
    if (limitTo8) {
        movies = movies.slice(0, 8);
    }

    // Místo přidávání karet do DOM v cyklu je nejprve uložíme do pole
    const allCards = [];
    movies.forEach((movie) => {
        if (!movie.poster_path && !movie.posterPath) return;
        allCards.push(createMovieCard(movie));
    });

    // Vložíme všechny karty najednou
    container.html(allCards.join(''));
}

// Zobrazení oblíbených filmů
const displayFavorites = () => {
    const favorites = getFromStorage('favorites') || [];
    const container = $DOM.favoritesWrapper;
    container.empty();
    showLoader();
    
    if (favorites.length === 0) {
        container.append('<p>Nemáte žádné oblíbené filmy.</p>');
        hideLoader();
        return;
    }

    Promise.all(favorites.map((movie) => 
        $.ajax({
            url: `${BASE_URL}movie/${movie.id}?api_key=${API_KEY}&language=cs-CZ`,
            method: 'GET'
        })
    )).then((movies) => {
        movies.forEach((movie) => {
            const savedMovie = favorites.find(f => f.id === movie.id);
            if (savedMovie) {
                movie.poster_path = savedMovie.posterPath;
            }
        });
        generateMovieCards(movies, '#favoritesWrapper', false);
    }).finally(() => {
        hideLoader();
    });
}

// Přidání filmu do oblíbených
const addToFavorites = (id, title, posterPath) => {
    const validId = validateMovieId(id);
    if (validId === null) {
        showToast('Neplatné ID filmu');
        return;
    }

    const validTitle = validateInput(title);
    if (!validTitle) {
        showToast('Neplatný název filmu');
        return;
    }

    let favorites = getFromStorage('favorites') || [];
    if (!favorites.some(f => f.id === id)) {
        favorites.push({ id, title, posterPath });
        saveToStorage('favorites', favorites);
        showToast(`Film "${title}" byl přidán do oblíbených!`);
        
        // Lokální DOM úprava tlačítka
        const button = $(`.add-favorite-btn[data-id="${id}"]`);
        button
            .removeClass('btn-primary add-favorite-btn')
            .addClass('btn-danger remove-favorite-btn')
            .text('Odebrat z oblíbených');
    } else {
        showToast(`Film "${title}" už je v oblíbených.`);
    }
};

const removeFromFavorites = (id) => {
    let favorites = getFromStorage('favorites') || [];
    const movieTitle = favorites.find(f => f.id === id)?.title;
    favorites = favorites.filter(f => f.id !== id);
    saveToStorage('favorites', favorites);
    showToast(movieTitle ? `Film "${movieTitle}" byl odebrán z oblíbených.` : 'Film byl odebrán z oblíbených.');
    
    // Lokální DOM úprava: pokud jsme v sekci oblíbených, kartu odstraníme
    if (window.location.hash === '#favorites') {
        $(`.movie-card-wrapper .remove-favorite-btn[data-id="${id}"]`)
            .closest('.movie-card-wrapper')
            .remove();
    } else {
        // Jinak jen upravíme tlačítko
        const button = $(`.remove-favorite-btn[data-id="${id}"]`);
        button
            .removeClass('btn-danger remove-favorite-btn')
            .addClass('btn-primary add-favorite-btn')
            .text('Přidat do oblíbených');
    }
}

// Zobrazení informační zprávy uživateli
const showToast = (message) => {
    const toast = new bootstrap.Toast($DOM.toast[0], {
        delay: 3000
    });
    $DOM.toastBody.text(message);
    toast.show();
}

// Generování hvězdiček pro hodnocení
const generateStars = (movieId, currentRating) => {
    let starsHtml = '';
    for (let i = 1; i <= MAX_RATING; i++) {
        starsHtml += `
            <span class="rating-star ${i <= currentRating ? 'active' : ''}" 
                  data-rating="${i}" 
                  data-movie-id="${movieId}"
                  onclick="rateMovie(${movieId}, ${i})">★</span>
        `;
    }
    return starsHtml;
}

// Zpracování hodnocení filmu
const rateMovie = (movieId, rating) => {
    const validRating = validateRating(rating);
    if (validRating === null) {
        showToast('Neplatné hodnocení');
        return;
    }

    let ratings = getFromStorage('ratings') || {};
    ratings[movieId] = rating;
    saveToStorage('ratings', ratings);
    
    const starsContainer = $(`.stars[data-movie-id="${movieId}"]`);
    starsContainer.find('.rating-star').removeClass('active');
    starsContainer.find('.rating-star').each(function() {      
        if ($(this).data('rating') <= rating) {
            $(this).addClass('active');
        }
    });
    
    const container = starsContainer.closest('.rating-container');
    container.find('.rating-text').text(`Vaše hodnocení: ${rating}/10`);
    
    if (container.find('.btn-outline-danger').length === 0) {
        const cancelButton = $(`
            <button 
                class="btn btn-sm btn-outline-danger mt-1"
                onclick="removeRating(${movieId})"
            >Zrušit hodnocení</button>
        `);
        container.append(cancelButton);
    }
    
    showToast('Hodnocení bylo uloženo');
}

// Odstranění hodnocení filmu
const removeRating = (movieId) => {
    let ratings = getFromStorage('ratings') || {};
    delete ratings[movieId];
    saveToStorage('ratings', ratings);

    const starsContainer = $(`.stars[data-movie-id="${movieId}"]`);
    starsContainer.find('.rating-star').removeClass('active');
    const cancelButton = starsContainer.closest('.rating-container').find('.btn-outline-danger');
    cancelButton.remove();
    starsContainer.closest('.rating-container').find('.rating-text').text('Nehodnoceno');
    showToast('Hodnocení bylo zrušeno');
}

// Zobrazení ohodnocených filmů
const displayRatedMovies = () => {
    const ratings = getFromStorage('ratings') || {};
    const ratedMovieIds = Object.keys(ratings);
    showLoader();
    
    if (ratedMovieIds.length === 0) {
        $DOM.ratedMoviesWrapper.html('<p>Zatím jste nehodnotili žádné filmy.</p>');
        hideLoader();
        return;
    }

    Promise.all(ratedMovieIds.map((id) => 
        $.ajax({
            url: `${BASE_URL}movie/${id}?api_key=${API_KEY}&language=cs-CZ`,
            method: 'GET'
        })
    )).then((movies) => {
        movies.forEach((movie) => movie.vote_average = ratings[movie.id]);
        generateMovieCards(movies, '#ratedMoviesWrapper', false);
    }).finally(() => {
        hideLoader();
    });
}

// Obsluha změny URL adresy
const handleHashChange = () => {
    const hash = window.location.hash.slice(1);
    $('.menu-categories .nav-link').removeClass('active');
    
    if (!hash) {
        showSection($DOM.homeButton, $DOM.topRated.add($DOM.recommendedMovies), () => {
            fetchTopRatedMovies();
            fetchRecommendedMovies();
        });
    } else if (hash === 'favorites') {
        showSection($DOM.favoritesButton, $DOM.favorites, displayFavorites);
    } else if (hash.startsWith('genre-')) {
        const genreId = hash.split('-')[1];
        const validGenreId = validateMovieId(genreId);
        if (validGenreId === null) {
            showToast('Neplatné ID žánru');
            return;
        }
        $(`.menu-categories .nav-link[data-genre="${genreId}"]`).addClass('active');
        showSection($(`.menu-categories .nav-link[data-genre="${genreId}"]`), $DOM.searchResults, () => {
            $DOM.searchResults.find('h2').text(GENRE_NAMES[genreId] || 'Filmy podle žánru');
            fetchMoviesByGenre(genreId);
        });
    } else if (hash.startsWith('search-')) {
        const query = decodeURIComponent(hash.slice(7));
        $DOM.searchInput.val(query);
        showSection($DOM.searchForm, $DOM.searchResults, () => searchMovies(query));
    } else if (hash === 'rated') {
        showSection($DOM.ratedButton, $DOM.ratedMovies, displayRatedMovies);
    }
}

// Kontrola dostupnosti localStorage
const isLocalStorageAvailable = () => {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

// Ukládání dat do localStorage
const saveToStorage = (key, value) => {
    if (isLocalStorageAvailable()) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    }
    return false;
}

// Načítání dat z localStorage
const getFromStorage = (key) => {
    if (isLocalStorageAvailable()) {
        try {
            return JSON.parse(localStorage.getItem(key)) || null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    }
    return null;
}

// Aktualizace aktuálního zobrazení
const refreshCurrentView = () => {
    const hash = window.location.hash.slice(1);
    // Odstranit přímé překreslování DOM
    if (!hash || hash === '') {
        fetchTopRatedMovies();
        fetchRecommendedMovies();
    } 
    else if (hash.startsWith('favorites')) {
        displayFavorites();
    }
    else if (hash.startsWith('genre-')) {
        const genreId = hash.split('-')[1];
        fetchMoviesByGenre(genreId);
    }
    else if (hash.startsWith('search-')) {
        const query = decodeURIComponent(hash.slice(7));
        searchMovies(query);
    }
    else if (hash.startsWith('rated')) {
        displayRatedMovies();
    }
}

// Navigace na novou cestu v aplikaci
const navigateTo = (path) => {
    const url = new URL(window.location);
    url.hash = path;
    window.history.pushState('', '', url);
    handleHashChange();
}

// Validace vstupního textu
const validateInput = (input) => {
    if (!input) return '';
    const sanitized = input
        .trim()
        .replace(/[<>]/g, ''); // Ochrana proti XSS útokům
    return sanitized;
};

// Validace hodnocení filmu
const validateRating = (rating) => {
    const num = parseInt(rating);
    return !isNaN(num) && num >= 1 && num <= MAX_RATING ? num : null;
};

// Validace ID filmu
const validateMovieId = (id) => {
    const num = parseInt(id);
    return !isNaN(num) && num > 0 ? num : null;
};

// Obsluha historie prohlížeče
window.addEventListener('popstate', handleHashChange);

// Add event listeners for dynamically created buttons using event delegation
const bindDynamicEventListeners = () => {
    // Event listener for adding to favorites
    $(document).on('click', '.add-favorite-btn', function() {
        const id = $(this).data('id');
        const title = $(this).data('title');
        const posterPath = $(this).data('poster');
        addToFavorites(id, title, posterPath);
    });

    // Event listener for removing from favorites
    $(document).on('click', '.remove-favorite-btn', function() {
        const id = $(this).data('id');
        removeFromFavorites(id);
    });

    // Event listener for rating a movie
    $(document).on('click', '.rating-star', function() {
        const movieId = $(this).data('movie-id');
        const rating = $(this).data('rating');
        rateMovie(movieId, rating);
    });

    // Event listener for removing a rating
    $(document).on('click', '.remove-rating-btn', function() {
        const movieId = $(this).data('id');
        removeRating(movieId);
    });

    // Event listener for clicking on movie titles to open the modal
    $(document).on('click', '.movie-title', function() {
        const movieId = $(this).data('movie-id');
        openMovieDetailModal(movieId);
    });

};

// Function to fetch and display movie details in the modal
const openMovieDetailModal = async (movieId) => {
    const url = `${BASE_URL}movie/${movieId}?api_key=${API_KEY}&language=cs-CZ`;
    showLoader();
    try {
        const data = await fetchFromAPI(`movie/${movieId}`);
        
        // Populate modal with movie details
        $('#movieDetailModalLabel').text(data.title);
        $('#modalPoster').attr('src', data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'img/no-poster.jpg');
        $('#modalOverview').text(data.overview || 'N/A');
        const genreNames = data.genres.map(genre => genre.name).join(', ') || 'N/A';
        $('#modalGenres').text(genreNames);
        $('#modalRating').text(
          (data.vote_average && data.vote_count)
            ? `${data.vote_average.toFixed(2)} z ${data.vote_count} recenzí`
            : 'N/A'
        );
        $('#modalReleaseDate').text(data.release_date || 'N/A');
        
        // Show the modal
        const movieDetailModal = new bootstrap.Modal(document.getElementById('movieDetailModal'));
        movieDetailModal.show();
        
    } catch (err) {
        console.error('Chyba při načítání detailů filmu:', err);
        showToast('Došlo k chybě při načítání detailů filmu.');
    } finally {
        hideLoader();
    }
}