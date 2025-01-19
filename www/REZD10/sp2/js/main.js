(function($) {
    $(function() {
        fetchGenres().then(() => {
            handleHashChange();
            
            // Přidáme handler pro kliknutí na nadpis
            $('h1').on('click', function() {
                location.reload();
            }).css('cursor', 'pointer'); // Přidáme cursor: pointer pro indikaci že je klikatelný
            
            // Načtení filmů při startu
            fetchTopRatedMovies();
            fetchRecommendedMovies();

            // Vyhledávání filmů
            $('#searchForm').on('submit', function(event) {
                event.preventDefault();
                const query = $('#searchInput').val().trim();
                if (query) {
                    window.location.hash = `search-${encodeURIComponent(query)}`;
                    handleHashChange();
                }
            });

            // Handler pro tlačítko Domů
            $('#homeButton').on('click', function(event) {
                event.preventDefault();
                window.location.hash = '';
                handleHashChange();
            });

            // Handler pro odkaz Oblíbené filmy
            $('#favoritesButton').on('click', function(event) {
                event.preventDefault();
                window.location.hash = 'favorites';
                handleHashChange();
            });

            // Handler pro kategorie filmů
            $('.categories-nav .nav-link').on('click', function(event) {
                event.preventDefault();
                const genreId = $(this).data('genre');
                window.location.hash = `genre-${genreId}`;
                handleHashChange();
            });

            // Handler pro hodnocené filmy
            $('#ratedButton').on('click', function(event) {
                event.preventDefault();
                window.location.hash = 'rated';
                handleHashChange();
            });
        });
    });
})(jQuery);

 
const API_KEY = '893c2b20ff334bcff61db54c19370af0';
const MAX_RATING = 10;
let GENRE_NAMES = {}; // Will be filled from API

function fetchGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=cs-CZ`;
    
    return $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            // Convert array to object for easier lookup
            GENRE_NAMES = data.genres.reduce((acc, genre) => {
                acc[genre.id] = genre.name;
                return acc;
            }, {});
            
            // Update menu with dynamic genres
            updateGenreMenu(data.genres);
        },
        error: function(err) {
            console.error('Chyba při načítání žánrů:', err);
        }
    });
}

function updateGenreMenu(genres) {
    const container = $('.categories-nav');
    container.empty();
    
    // Sort genres alphabetically by Czech name
    genres.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
    
    genres.forEach(genre => {
        container.append(`
            <a class="nav-link text-white" href="#" data-genre="${genre.id}">${genre.name}</a>
        `);
    });
}

// Příklad AJAX volání na TMDB - nejlépe hodnocené filmy
function fetchTopRatedMovies() {
  const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=cs-CZ&page=1`;

  $.ajax({
    url: url,
    method: 'GET',
    success: function(data) {
      generateMovieCards(data.results, '#topPlakatyWrapper');
    },
    error: function(err) {
      console.error('Chyba při načítání filmů:', err);
    }
  });
}

// Příklad AJAX volání na TMDB - doporučené filmy
function fetchRecommendedMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=cs-CZ&page=1`;

  $.ajax({
    url: url,
    method: 'GET',
    success: function(data) {
      generateMovieCards(data.results, '#recommendedMoviesWrapper');
    },
    error: function(err) {
      console.error('Chyba při načítání filmů:', err);
    }
  });
}

// Vytvořit jednotnou kartu filmu pro všechny sekce
function createMovieCard(movie) {
    const favorites = getFromStorage('favorites') || [];
    const ratings = getFromStorage('ratings') || {};
    
    const isFavorite = favorites.some(f => f.id === movie.id);
    const currentRating = ratings[movie.id] || 0;
    
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
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="movie-card">
                <img 
                    src="${posterUrl}" 
                    onerror="this.onerror=null; this.src='${posterUrl}';"
                    alt="${movie.title}" 
                    class="movie-poster mb-2"
                />
                <h3 class="h6">${movie.title}</h3>
                <p class="small">Hodnocení TMDB: ${movie.vote_average.toFixed(1)}</p>
                ${ratingHtml}
                ${buttonHtml}
            </div>
        </div>
    `;
}

// Upravit generateMovieCards aby používala jednotnou kartu
function generateMovieCards(movies, targetSelector, limitTo8 = true) {
    const container = $(targetSelector);
    container.empty();
    
    if (limitTo8) {
        movies = movies.slice(0, 8);
    }

    movies.forEach(movie => {
        if (!movie.poster_path && !movie.posterPath) return;
        container.append(createMovieCard(movie));
    });
}

// Zobrazení oblíbených filmů
function displayFavorites(page = 1) {
    const favorites = getFromStorage('favorites') || [];
    const container = $('#favoritesWrapper');
    container.empty();

    if (favorites.length === 0) {
        container.append('<p>Nemáte žádné oblíbené filmy.</p>');
        return;
    }

    const itemsPerPage = 20;
    const totalPages = Math.ceil(favorites.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    // Načíst detaily filmů pro správné zobrazení
    Promise.all(favorites.slice(start, end).map(movie => 
        $.ajax({
            url: `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=cs-CZ`,
            method: 'GET'
        })
    )).then(movies => {
        movies.forEach(movie => {
            // Přidat posterPath z uložených oblíbených
            const savedMovie = favorites.find(f => f.id === movie.id);
            if (savedMovie) {
                movie.poster_path = savedMovie.posterPath;
            }
        });
        generateMovieCards(movies, '#favoritesWrapper', false);
        
        if (totalPages > 1) {
            const paginationHtml = generatePagination('favorites', page, totalPages);
            $('#favoritesWrapper').after(paginationHtml);
        }
    });
}

// Vyhledávání filmů na TMDB
function searchMovies(query, page = 1) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=cs-CZ&query=${query}&page=${page}`;

  if (page === 1) {
    $('#searchResultsWrapper').html('<p>Načítání...</p>');
  }

  $.ajax({
    url: url,
    method: 'GET',
    success: function(data) {
      if (data.results.length > 0) {
        $('#searchResults').removeClass('d-none');
        $('#searchResults h2').text(`Výsledky vyhledávání: ${query}`);
        generateMovieCards(data.results, '#searchResultsWrapper', false);
        
        // Add pagination
        const totalPages = Math.min(data.total_pages, 10);
        if (totalPages > 1) {
          const paginationHtml = generatePagination('search-' + encodeURIComponent(query), page, totalPages);
          if (page === 1) {
            $('#searchResultsWrapper').after(paginationHtml);
          }
        }
      } else {
        $('#searchResults').removeClass('d-none');
        $('#searchResultsWrapper').html('<p>Nebyly nalezeny žádné filmy.</p>');
      }
    },
    error: function(err) {
      console.error('Chyba při vyhledávání filmů:', err);
      $('#searchResultsWrapper').html('<p>Došlo k chybě při vyhledávání.</p>');
    }
  });
}

// Přidáme funkce pro práci s oblíbenými
function addToFavorites(id, title, posterPath) {
    let favorites = getFromStorage('favorites') || [];
    if (!favorites.some(f => f.id === id)) {
        favorites.push({ id, title, posterPath });
        saveToStorage('favorites', favorites);
        showToast(`Film "${title}" byl přidán do oblíbených!`);
        
        // Aktualizovat aktuální view podle hash
        refreshCurrentView();
    } else {
        showToast(`Film "${title}" už je v oblíbených.`);
    }
}

function removeFromFavorites(id) {
    let favorites = getFromStorage('favorites') || [];
    const movieTitle = favorites.find(f => f.id === id)?.title;
    favorites = favorites.filter(f => f.id !== id);
    saveToStorage('favorites', favorites);
    showToast(movieTitle ? `Film "${movieTitle}" byl odebrán z oblíbených.` : 'Film byl odebrán z oblíbených.');
    
    // Aktualizovat aktuální view podle hash
    refreshCurrentView();
}

// Přidáme funkci pro zobrazování toast notifikací
function showToast(message) {
  const toastEl = document.getElementById('movieToast');
  const toast = new bootstrap.Toast(toastEl, {
    delay: 3000
  });
  
  toastEl.querySelector('.toast-body').textContent = message;
  toast.show();
}

// Add this new function at the bottom of the file
function fetchMoviesByGenre(genreId, page = 1) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=cs-CZ&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`;

    $('.section').addClass('d-none');
    $('#searchResults').removeClass('d-none');
    
    if (page === 1) {
        $('#searchResultsWrapper').html('<p>Načítání...</p>');
    }

    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            if (data.results.length > 0) {
                generateMovieCards(data.results, '#searchResultsWrapper', false);
                
                // Add pagination - oprava předávání genre-ID
                const totalPages = Math.min(data.total_pages, 10);
                if (totalPages > 1) {
                    const paginationHtml = generatePagination(`genre-${genreId}`, page, totalPages);
                    if (page === 1) {
                        $('#searchResultsWrapper').after(paginationHtml);
                    }
                }
            } else {
                $('#searchResultsWrapper').html('<p>Pro tento žánr nebyly nalezeny žádné filmy.</p>');
            }
        },
        error: function(err) {
            console.error('Chyba při načítání filmů:', err);
            $('#searchResultsWrapper').html('<p>Došlo k chybě při načítání filmů.</p>');
        }
    });
}

// Upravit generatePagination aby nezobrazovala duplicitní čísla
function generatePagination(section, currentPage, totalPages) {
    let html = '<nav aria-label="Movie navigation" class="my-4"><ul class="pagination justify-content-center">';
    
    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#${section}-${currentPage - 1}" ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>Předchozí</a>
        </li>
    `;

    // Page numbers - show only unique pages
    const pages = new Set();
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        if (!pages.has(i)) {
            pages.add(i);
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#${section}-${i}">${i}</a>
                </li>
            `;
        }
    }

    // Next button
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#${section}-${currentPage + 1}" ${currentPage === totalPages ? 'tabindex="-1" aria-disabled="true"' : ''}>Další</a>
        </li>
    `;

    html += '</ul></nav>';
    return html;
}

// Add new functions for ratings
function generateStars(movieId, currentRating) {
    let starsHtml = '';
    // Change order to start from 1 to MAX_RATING (left to right)
    for (let i = 1; i <= MAX_RATING; i++) {
        starsHtml += `
            <span class="star ${i <= currentRating ? 'active' : ''}" 
                  data-rating="${i}" 
                  data-movie-id="${movieId}"
                  onclick="rateMovie(${movieId}, ${i})">★</span>
        `;
    }
    return starsHtml;
}

function rateMovie(movieId, rating) {
    let ratings = getFromStorage('ratings') || {};
    ratings[movieId] = rating;
    saveToStorage('ratings', ratings);
    
    const starsContainer = $(`.stars[data-movie-id="${movieId}"]`);
    starsContainer.find('.star').removeClass('active');
    starsContainer.find('.star').each(function() {
        if ($(this).data('rating') <= rating) {
            $(this).addClass('active');
        }
    });
    
    const container = starsContainer.closest('.rating-container');
    container.find('.rating-text').text(`Vaše hodnocení: ${rating}/10`);
    
    // Add cancel button if it doesn't exist
    if (container.find('.btn-outline-danger').length === 0) {
        const cancelButton = $(`
            <button 
                class="btn btn-sm btn-outline-danger mt-1"
                onclick="removeRating(${movieId})"
                style="opacity: 0; transform: translateY(-10px);"
            >Zrušit hodnocení</button>
        `);
        container.append(cancelButton);
        // Trigger animation after a short delay
        setTimeout(() => {
            cancelButton.css({
                'transition': 'all 0.3s ease',
                'opacity': '1',
                'transform': 'translateY(0)'
            });
        }, 50);
    }
    
    showToast('Hodnocení bylo uloženo');
    
    // Aktualizovat aktuální view podle hash
    refreshCurrentView();
}

function removeRating(movieId) {
    let ratings = getFromStorage('ratings') || {};
    delete ratings[movieId];
    saveToStorage('ratings', ratings);
    
    // Update UI
    const starsContainer = $(`.stars[data-movie-id="${movieId}"]`);
    starsContainer.find('.star').removeClass('active');
    const container = starsContainer.closest('.rating-container');
    container.find('.rating-text').text('Nehodnoceno');
    container.find('button').remove();
    
    showToast('Hodnocení bylo zrušeno');
    
    // Aktualizovat aktuální view podle hash
    refreshCurrentView();
}

function displayRatedMovies(page = 1) {
    const ratings = getFromStorage('ratings') || {};
    const ratedMovieIds = Object.keys(ratings);
    
    if (ratedMovieIds.length === 0) {
        $('#ratedMoviesWrapper').html('<p>Zatím jste nehodnotili žádné filmy.</p>');
        return;
    }

    // Calculate pagination
    const itemsPerPage = 20;
    const totalPages = Math.ceil(ratedMovieIds.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentPageIds = ratedMovieIds.slice(start, end);

    // Fetch details for current page movies
    Promise.all(currentPageIds.map(id => 
        $.ajax({
            url: `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=cs-CZ`,
            method: 'GET'
        })
    )).then(movies => {
        movies.forEach(movie => movie.vote_average = ratings[movie.id]);
        generateMovieCards(movies, '#ratedMoviesWrapper', false);
        
        if (totalPages > 1) {
            const paginationHtml = generatePagination('rated', page, totalPages);
            $('#ratedMoviesWrapper').after(paginationHtml);
        }
    });
}

// Add these new functions after your existing functions
function handleHashChange() {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    
    // Reset all active states
    $('.nav-link').removeClass('active');
    
    // Hide all sections initially
    $('.section').addClass('d-none');
    $('.pagination').remove(); // Remove existing pagination
    
    if (!hash) {
        // Home page
        $('#homeButton').addClass('active');
        $('#topPlakaty, #recommendedMovies').removeClass('d-none');
        fetchTopRatedMovies();
        fetchRecommendedMovies();
    } 
    else if (hash.startsWith('favorites')) {
        const page = hash.includes('-') ? parseInt(hash.split('-')[1]) : 1;
        $('#favoritesButton').addClass('active');
        $('#favorites').removeClass('d-none');
        displayFavorites(page);
    }
    else if (hash.startsWith('genre-')) {
        const [, genreId, page = 1] = hash.split('-').map(p => parseInt(p) || p);
        $(`.categories-nav .nav-link[data-genre="${genreId}"]`).addClass('active');
        $('#searchResults').removeClass('d-none');
        $('#searchResults h2').text(GENRE_NAMES[genreId] || 'Filmy podle žánru');
        fetchMoviesByGenre(genreId, page);
    }
    else if (hash.startsWith('search-')) {
        const parts = hash.split('-');
        const page = !isNaN(parseInt(parts[parts.length - 1])) ? parseInt(parts.pop()) : 1;
        const query = decodeURIComponent(parts.slice(1).join('-'));
        $('#searchInput').val(query);
        $('#searchResults').removeClass('d-none');
        searchMovies(query, page);
    }
    else if (hash.startsWith('rated')) {
        const page = hash.includes('-') ? parseInt(hash.split('-')[1]) : 1;
        $('#ratedButton').addClass('active');
        $('#ratedMovies').removeClass('d-none');
        displayRatedMovies(page);
    }
}

// Přidat detekci podpory localStorage
function isLocalStorageAvailable() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

// Obalit localStorage operace
function saveToStorage(key, value) {
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

function getFromStorage(key) {
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

// Přidat novou helper funkci pro aktualizaci aktuálního view
function refreshCurrentView() {
    const hash = window.location.hash.slice(1);
    
    if (!hash || hash === '') {
        fetchTopRatedMovies();
        fetchRecommendedMovies();
    } 
    else if (hash.startsWith('favorites')) {
        const page = hash.includes('-') ? parseInt(hash.split('-')[1]) : 1;
        displayFavorites(page);
    }
    else if (hash.startsWith('genre-')) {
        const [, genreId, page = 1] = hash.split('-').map(p => parseInt(p) || p);
        fetchMoviesByGenre(genreId, parseInt(page));
    }
    else if (hash.startsWith('search-')) {
        const parts = hash.split('-');
        const page = !isNaN(parseInt(parts[parts.length - 1])) ? parseInt(parts.pop()) : 1;
        const query = decodeURIComponent(parts.slice(1).join('-'));
        searchMovies(query, page);
    }
    else if (hash.startsWith('rated')) {
        const page = hash.includes('-') ? parseInt(hash.split('-')[1]) : 1;
        displayRatedMovies(page);
    }
}

// Použít History API pro lepší navigaci
function navigateTo(path) {
    const url = new URL(window.location);
    url.hash = path;
    window.history.pushState('', '', url);
    handleHashChange();
}

// Přidat event listener pro navigaci zpět/vpřed
window.addEventListener('popstate', handleHashChange);
