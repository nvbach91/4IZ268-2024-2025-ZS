// Globální konstanty pro API a konfiguraci
const API = {
    BASE_URL: 'https://api.themoviedb.org/3',
    KEY: '893c2b20ff334bcff61db54c19370af0'
};
const MAX_RATING = 10;
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
    movieToast: $('#movieToast'),  // Změna na jQuery selektor
    loader: $('#loader'),
    loaderContainer: $('.loader-container'),
    pageTitle: $('h1'),
    menuCategoriesLinks: $('.menu-categories .nav-link'),
    moviesList: $('#moviesList'),
    favoritesSection: $('#favorites'),
    ratedSection: $('#ratedMovies'),
    movieCards: $('.movie-card')
};

// Funkce pro zobrazení/skrytí načítacího indikátoru
const showLoader = () => {
    $DOM.loader.addClass('visible');
    $DOM.loaderContainer.addClass('visible');
};

// Oprava funkce hideLoader aby skutečně odstranila loader
const hideLoader = () => {
    $DOM.loader.removeClass('visible');
    $DOM.loaderContainer.removeClass('visible');
};

// Přidání ošetření chyb při načítání
window.addEventListener('load', () => {
    hideLoader();
});

/* Remove the global error event listener */
/*
window.addEventListener('error', () => {
    hideLoader();
    showToast('Došlo k chybě při načítání dat');
});
*/

// Single source of truth for app data
const appState = {
    favorites: [],
    ratings: {},
    
    init() {
        const storedFavorites = localStorage.getItem('favorites');
        const storedRatings = localStorage.getItem('ratings');
        
        if (storedFavorites) this.favorites = JSON.parse(storedFavorites);
        if (storedRatings) this.ratings = JSON.parse(storedRatings);
    },
    
    save() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        localStorage.setItem('ratings', JSON.stringify(this.ratings));
    }
};

const loadAppData = () => {
    appState.init();
};

// Sjednocená jQuery inicializace
(($ => {
    $(() => {
        // Definice funkcí pro mobilní menu
        const toggleMenu = () => {
            $('aside').toggleClass('show');
            $('.menu-overlay').toggleClass('show');
            $('body').toggleClass('menu-open');
        };

        const closeMenu = () => {
            $('aside').removeClass('show');
            $('.menu-overlay').removeClass('show');
            $('body').removeClass('menu-open');
        };

        // Inicializace aplikace
        loadAppData();
        fetchGenres().then(() => {
            handleHashChange();
            
            // Event handlers
            $('#burgerButton').on('click', toggleMenu);
            $('.close-menu').on('click', closeMenu);
            $('.menu-overlay').on('click', closeMenu);
            
            // Mobilní menu - zavření po kliknutí na odkaz
            $('aside .nav-link').on('click', () => {
                if (window.innerWidth < 768) closeMenu();
            });

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

            $('#burgerButton').on('click', () => {
                $('aside').toggleClass('collapsed');
            });

            // Přidání overlay pro mobilní menu
            $('body').append('<div class="menu-overlay"></div>');
            
            // Handler pro burger button
            $('#burgerButton').on('click', (e) => {
                e.stopPropagation();
                $('aside').addClass('show');
                $('.menu-overlay').addClass('show');
                $('body').addClass('menu-open');
            });

            // Handler pro close button
            $('.close-menu').on('click', (e) => {
                e.stopPropagation();
                closeMenu();
            });

            // Skrýt menu při kliknutí na overlay
            $('.menu-overlay').on('click', closeMenu);

            // Skrýt menu při kliknutí na odkaz v menu (na mobilu)
            $('aside .nav-link').on('click', () => {
                if (window.innerWidth < 768) {
                    closeMenu();
                }
            });
        });
    });
}))(jQuery);

// Načtení žánrů z API a jejich uložení do paměti
const fetchGenres = async () => {
    const url = `${API.BASE_URL}/genre/movie/list?api_key=${API.KEY}&language=cs-CZ`;
    showLoader();
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        GENRE_NAMES = data.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
        }, {});
        updateGenreMenu(data.genres);
    } catch (err) {
        console.error('Chyba při načítání žánrů:', err);
        showToast('Chyba při načítání dat');
    } finally {
        hideLoader();
    }
}

// Vytvoření menu s žánry
const updateGenreMenu = (genres) => {
    const container = $DOM.menuCategories;
    container.empty();
    
    genres.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
    
    genres.forEach((genre) => {
        container.append(`
            <a class="nav-link text-white" href="#" data-genre="${genre.id}">${genre.name}</a>
        `);
    });
};

// Univerzální funkce pro načtení a zobrazení filmů
const fetchAndRenderMovies = async (url, containerSelector, noResultsMessage = 'Nebyly nalezeny žádné filmy.', limitTo8 = true, afterRender = null) => {
    showLoader();
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
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
        showToast('Chyba při načítání dat');
    } finally {
        hideLoader();
    }
}

// Univerzální funkce pro volání API
const fetchFromAPI = async (endpoint, params = {}) => {
    showLoader();
    const url = `${API.BASE_URL}/${endpoint}?api_key=${API.KEY}&language=cs-CZ${Object.entries(params).map(([key, value]) => `&${key}=${value}`).join('')}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (err) {
        console.error('API Error:', err);
        showToast('Chyba při načítání dat');
        throw err;
    } finally {
        hideLoader();
    }
}

// Přepínání mezi sekcemi aplikace
const showSection = ($button, $section, action) => {
    // Nejdřív odebereme active třídu ze všech menu položek
    $('.nav-link').removeClass('active');
    
    // Pak skryjeme všechny sekce
    $DOM.sections.addClass('d-none');
    
    // Zvýrazníme aktivní položku menu
    $button.addClass('active');
    
    // Zobrazíme vybranou sekci
    $section.removeClass('d-none');

    // Spustíme callback
    if (typeof action === 'function') action();
}

// Načtení nejlépe hodnocených filmů
const fetchTopRatedMovies = async () => {
    const url = `${API.BASE_URL}/movie/top_rated?api_key=${API.KEY}&language=cs-CZ&page=1`;
    await fetchAndRenderMovies(url, '#topRatedWrapper');
}

// Načtení doporučených filmů
const fetchRecommendedMovies = () => {
    const url = `${API.BASE_URL}/movie/popular?api_key=${API.KEY}&language=cs-CZ&page=1`;
    fetchAndRenderMovies(url, '#recommendedMoviesWrapper');
}

// Načtení filmů podle žánru
const fetchMoviesByGenre = async (genreId) => {
    const url = `${API.BASE_URL}/discover/movie?api_key=${API.KEY}&language=cs-CZ&with_genres=${genreId}&sort_by=popularity.desc`;
    
    await fetchAndRenderMovies(url, '#searchResultsWrapper', 'Pro tento žánr nebyly nalezeny žádné filmy.', false);
}

// Vyhledávání filmů podle zadaného textu
const searchMovies = (query) => {
    const validatedQuery = validateInput(query);
    if (!validatedQuery) {
        showToast('Neplatný vstup pro vyhledávání');
        return;
    }
    const url = `${API.BASE_URL}/search/movie?api_key=${API.KEY}&language=cs-CZ&query=${encodeURIComponent(validatedQuery)}`;
    fetchAndRenderMovies(url, '#searchResultsWrapper', 'Nebyly nalezeny žádné filmy.', false, () => {
        $DOM.searchResults.removeClass('d-none')
            .find('h2')
            .text(`Výsledky vyhledávání: ${query}`);
    });
}

// Vytvoření HTML struktury karty filmu
const createMovieCard = (movie) => {
    const isFavorite = appState.favorites.some(f => f.id === movie.id);
    const currentRating = appState.ratings[movie.id] || 0;
    
    const buttonHtml = isFavorite ? 
        `<button 
            class="btn btn-sm btn-danger w-100"
            onclick="removeFromFavorites(${movie.id})"
        >
            Odebrat z oblíbených
        </button>` :
        `<button 
            class="btn btn-sm btn-primary w-100"
            onclick="addToFavorites(${movie.id}, '${movie.title.replace("'", "\\'")}', '${movie.poster_path}')"
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
                    class="btn btn-sm btn-outline-danger mt-1"
                    onclick="removeRating(${movie.id})"
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
                <h3 class="movie-title h6">${movie.title}</h3>
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

    let html = '';
    movies.forEach((movie) => {
        if (!movie.poster_path && !movie.posterPath) return;
        html += createMovieCard(movie);
    });
    container.html(html);
}

// Zobrazení oblíbených filmů
const displayFavorites = () => {
    const favorites = appState.favorites;
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
            url: `${API.BASE_URL}/movie/${movie.id}?api_key=${API.KEY}&language=cs-CZ`,
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

    let favorites = appState.favorites;
    if (!favorites.some(f => f.id === id)) {
        favorites.push({ id, title, posterPath });
        appState.save(); // Use appState's save method
        showToast(`Film "${title}" byl přidán do oblíbených!`);
    } else {
        showToast(`Film "${title}" už je v oblíbených.`);
    }
}

// Odebrání filmu z oblíbených
const removeFromFavorites = (id) => {
    let favorites = appState.favorites;
    const movieTitle = favorites.find(f => f.id === id)?.title;
    
    // Aktualizace dat
    appState.favorites = favorites.filter(f => f.id !== id);
    appState.save(); // Use appState's save method
    
    // Pouze odstranit kartu z DOM bez překreslování celé sekce
    if ($DOM.favorites.is(':visible')) {
        $(`#favoritesWrapper .movie-card-wrapper`).filter(function() {
            return $(this).find(`button[onclick="removeFromFavorites(${id})"]`).length > 0;
        }).fadeOut(300, function() {
            $(this).remove();
            // Pokud už nejsou žádné oblíbené filmy, zobrazit zprávu
            if ($('#favoritesWrapper .movie-card-wrapper').length === 0) {
                $('#favoritesWrapper').html('<p>Nemáte žádné oblíbené filmy.</p>');
            }
        });
    }

    showToast(movieTitle ? `Film "${movieTitle}" byl odebrán z oblíbených.` : 'Film byl odebrán z oblíbených.');
}

// Zobrazení informační zprávy uživateli
const showToast = (message) => {
    const toast = new bootstrap.Toast($DOM.movieToast[0], {
        delay: 3000
    });
    
    $DOM.movieToast.find('.toast-body').text(message);
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

    let ratings = appState.ratings;
    ratings[movieId] = rating;
    appState.save(); // Use appState's save method
    
    const $starsContainer = $(`.stars[data-movie-id="${movieId}"]`);
    const $stars = $starsContainer.find('.rating-star');
    $stars.removeClass('active');
    $stars.each(function() {      
        if ($(this).data('rating') <= rating) {
            $(this).addClass('active');
        }
    });
    
    const container = $starsContainer.closest('.rating-container');
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
    let ratings = appState.ratings;
    delete ratings[movieId];
    appState.save(); // Use appState's save method

    const $starsContainer = $(`.stars[data-movie-id="${movieId}"]`);
    const $cancelButton = $starsContainer.closest('.rating-container').find('.btn-outline-danger');
    $starsContainer.find('.rating-star').removeClass('active');
    $cancelButton.remove();
    $starsContainer.closest('.rating-container').find('.rating-text').text('Nehodnoceno');
    showToast('Hodnocení bylo zrušeno');
}

// Zobrazení ohodnocených filmů
const displayRatedMovies = () => {
    const ratedMovieIds = Object.keys(appState.ratings);
    showLoader();
    
    if (ratedMovieIds.length === 0) {
        $DOM.ratedMoviesWrapper.html('<p>Zatím jste nehodnotili žádné filmy.</p>');
        hideLoader();
        return;
    }

    Promise.all(ratedMovieIds.map((id) => 
        $.ajax({
            url: `${API.BASE_URL}/movie/${id}?api_key=${API.KEY}&language=cs-CZ`,
            method: 'GET'
        })
    )).then((movies) => {
        movies.forEach((movie) => movie.vote_average = appState.ratings[movie.id]);
        generateMovieCards(movies, '#ratedMoviesWrapper', false);
    }).finally(() => {
        hideLoader();
    });
}

// Obsluha změny URL adresy
const handleHashChange = () => {
    $DOM.navLinks.removeClass('active'); // Změněno z menuCategoriesLinks na navLinks
    const hash = window.location.hash.slice(1);

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
        const $genreLink = $(`.menu-categories .nav-link[data-genre="${genreId}"]`);
        showSection($genreLink, $DOM.searchResults, () => {
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

(($ => {
    $(() => {
        const $burgerButton = $('#burgerButton');
        const $closeMenuButton = $('.close-menu');
        const $menuOverlay = $('.menu-overlay');
        const $aside = $('aside');

        // Otevření menu
        $burgerButton.on('click', () => {
            $aside.addClass('show');
            $menuOverlay.addClass('show');
            $('body').addClass('menu-open');
        });

        // Zavření menu
        const closeMenu = () => {
            $aside.removeClass('show');
            $menuOverlay.removeClass('show');
            $('body').removeClass('menu-open');
        };

        $closeMenuButton.on('click', closeMenu);
        $menuOverlay.on('click', closeMenu);

        // Zavření menu při výběru stránky
        $('.nav-link').on('click', () => {
            closeMenu();
        });
    });
})(jQuery));

const updateMovieCards = (movies) => {
    // Create document fragment
    const fragment = document.createDocumentFragment();
    
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        fragment.appendChild(card);
    });
    
    // Single DOM update
    $DOM.moviesList.empty().append(fragment);
};

// Add event listeners in JS
$DOM.moviesList.on('click', '.favorite-btn', function() {
    const movieId = $(this).closest('.movie-card').data('id');
    toggleFavorite(movieId);
});

const toggleFavorite = (movieId) => {
    const $card = $(`.movie-card[data-id="${movieId}"]`);
    const $btn = $card.find('.favorite-btn');
    
    if (appState.favorites.includes(movieId)) {
        appState.favorites = appState.favorites.filter(id => id !== movieId);
        $btn.removeClass('active');
    } else {
        appState.favorites.push(movieId);
        $btn.addClass('active');
    }
    
    appState.save();
};

$(document).ready(() => {
    appState.init();
    bindEventHandlers();
    loadInitialContent();
});

const bindEventHandlers = () => {
    $DOM.searchForm.on('submit', handleSearch);
    $DOM.moviesList.on('click', '.favorite-btn', handleFavoriteClick);
    $DOM.moviesList.on('click', '.rating-star', handleRating);
};
