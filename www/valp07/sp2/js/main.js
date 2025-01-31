const App = () => {
    const $resetButton = $('#reset-button');
    const $compass = $('#compass');
    const $movieList = $('#movie-list');
    const $searchInput = $('#search-input');
    const apiKey = 'ef8f6bf5';
    const BASE_URL = 'https://www.omdbapi.com/';
    let storedMovies = JSON.parse(localStorage.getItem('compassMovies')) || [];
    const placeHolderPoster = 'https://critics.io/img/movies/poster-placeholder.png';

    const showLoader = () => $('<span class="loader"></span>').appendTo('body');
    const hideLoader = () => $('.loader').remove();

    const saveToLocalStorage = () => {
        localStorage.setItem('compassMovies', JSON.stringify(storedMovies));
    };

    const fetchMovieById = async (imdbID) => {
        try {
            if (storedMovies.some(movie => movie.imdbID === imdbID)) return null;
            const response = await axios.get(`${BASE_URL}?apikey=${apiKey}&i=${imdbID}`);
            if (response.data.Response === 'True') {
                const { Ratings, Poster, Title } = response.data;
                const imdbRating = Ratings.find(rating => rating.Source === 'Internet Movie Database')?.Value || null;
                const rottenTomatoesRating = Ratings.find(rating => rating.Source === 'Rotten Tomatoes')?.Value || null;
                if (imdbRating && rottenTomatoesRating) {
                    const x = 100 + parseFloat(imdbRating) * 60;
                    const y = 700 - (6 * parseFloat(rottenTomatoesRating));
                    return { Title, Poster: Poster !== 'N/A' ? Poster : placeHolderPoster, x, y, imdbID };
                } else {
                    Swal.fire({
                        title: 'Missing Ratings',
                        text: 'This movie is missing IMDB or Rotten Tomatoes Ratings or both',
                        icon: 'warning',
                        confirmButtonText: 'OK'
                    });
                }
            }
        } catch (error) {
            console.error(`Error fetching movie with IMDb ID ${imdbID}:`, error);
        }
        return null;
    };

    const loadFromUrl = async () => {
        showLoader();
        const url = new URL(window.location);
        const movieIds = url.searchParams.get('movies');
        if (movieIds) {
            const idsArray = movieIds.split(',');
            try {
                const moviePromises = idsArray.map(imdbID => fetchMovieById(imdbID));
                const movies = await Promise.all(moviePromises);
                const validMovies = movies.filter(movie => movie !== null);
                const fragment = document.createDocumentFragment();
                validMovies.forEach(movieData => {
                    const movieElement = createMovieOnCompass(movieData);
                    fragment.appendChild(movieElement);
                    storedMovies.push(movieData);
                });
                $compass.append(fragment);
                saveToLocalStorage();
                updateUrl(validMovies.map(movie => movie.imdbID).join(','));
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }
        hideLoader();
    };

    const loadFromLocalStorage = () => {
        const fragment = document.createDocumentFragment();
        storedMovies.forEach(({ Title, Poster, x, y, imdbID }) => {
            const movieElement = createMovieOnCompass({ Title, Poster, x, y, imdbID });
            fragment.appendChild(movieElement);
        });
        $compass.append(fragment);
        updateUrl(storedMovies.map(movie => movie.imdbID).join(','));
    };

    const deleteMovieFromCompass = (imdbID) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will delete this movie from the compass.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $(`.compass-movie .delete-button[data-imdbid="${imdbID}"]`).closest('.compass-movie').remove();
                storedMovies = storedMovies.filter(movie => movie.imdbID !== imdbID);
                saveToLocalStorage();
                updateUrl(storedMovies.map(movie => movie.imdbID).join(','));
            }
        });
    };

    const updateUrl = (ids) => {
        const url = new URL(window.location);
        if (ids) {
            url.searchParams.set('movies', ids);
        } else {
            url.searchParams.delete('movies');
        }
        window.history.replaceState(null, '', url);
    };

    const addMovieToCompass = async (imdbID) => {
        showLoader();
        try {
            const movieData = await fetchMovieById(imdbID);
            if (movieData) {
                const movieElement = createMovieOnCompass(movieData);
                $compass.append(movieElement);
                storedMovies.push(movieData);
                saveToLocalStorage();
                updateUrl(storedMovies.map(movie => movie.imdbID).join(','));
            }
            $movieList.empty();
            $searchInput.val('');
        } catch (error) {
            console.error('Error adding movie:', error);
        }
        hideLoader();
    };

    const createMovieOnCompass = ({ Title, Poster, x, y, imdbID }) => {
        const imdbRating = ((x - 100) / 60).toFixed(1);
        const rottenTomatoesRating = ((700 - y) / 6).toFixed(1);

        const $movieDiv = $('<div class="compass-movie"></div>')
            .html(`<p>${Title}</p><button class="delete-button" data-imdbid="${imdbID}">X</button>`)
            .css({ backgroundImage: `url("${Poster || placeHolderPoster}")`, left: `${x}px`, top: `${y}px` });
        $movieDiv.find('.delete-button').click((e) => {
            e.stopPropagation();
            deleteMovieFromCompass(imdbID);
        });
        $movieDiv.click(() => {
            showModal({ Title, Poster, imdbRating, rottenTomatoesRating });
        });
        return $movieDiv[0];
    };

    const showModal = ({ Title, Poster, imdbRating, rottenTomatoesRating }) => {
        Swal.fire({
            title: Title,
            html: `
            <img src="${Poster || placeHolderPoster}" alt="${Title}" style="width:100%;">
            <p>IMDb Rating: ${imdbRating || 'N/A'}</p>
            <p>Rotten Tomatoes Rating: ${parseInt(rottenTomatoesRating) || 'N/A'}%</p>
          `,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false
        });
    };

    const displaySearchResults = (movies) => {
        $movieList.empty();
        const movieElements = movies.map(movie => {
            const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : placeHolderPoster;
            return $(`
            <article class="movie-search-card">
              <img src="${posterUrl}" alt="${movie.Title}" class="movie-poster" />
              <div class="movie-title">${movie.Title}</div>
              <div class="movie-year">(${movie.Year})</div>
              <div class="IMDBid">${movie.imdbID}</div>
              <div class="type">${movie.Type}</div>
              <button class="add-button" data-imdbid="${movie.imdbID}">Add</button>
            </article>
          `).hide();
        });
        $movieList.append(movieElements);
        movieElements.forEach(el => $(el).fadeIn(200));
        $('.add-button').on('click', async (event) => {
            const imdbID = $(event.target).data('imdbid');
            $('.add-button').prop('disabled', true);
            await addMovieToCompass(imdbID);

        });
    };

    const resetCompass = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will remove all movies from the compass!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, reset it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $compass.empty();
                storedMovies = [];
                saveToLocalStorage();
                updateUrl('');
            }
        });
    };
    (async () => {
        showLoader();
        await loadFromUrl();
        loadFromLocalStorage();
        hideLoader();
    })();

    $(document).on('click', (e) => {
        if (!$(e.target).closest($movieList).length && !$(e.target).closest($searchInput).length) {
            $movieList.empty();
        }
    });

    const performSearch = () => {
        const symbols = /[<>;&%$#@!]/g;
        const searchQuery = $searchInput.val().replace(symbols, '').trim();
        if (searchQuery) {
            $searchInput.addClass('loading');
            axios.get(`${BASE_URL}?apikey=${apiKey}&s=${searchQuery}&type=movie`)
                .then(response => {
                    if (response.data.Response === 'True') {
                        displaySearchResults(response.data.Search);
                    } else {
                        console.log('No results found');
                    }
                    $searchInput.removeClass();
                })
                .catch(() => {
                    console.error('Error fetching data');
                    $searchInput.removeClass();
                });
        }

    };

    let timeout;
    $searchInput.on('keyup', () => {
        clearTimeout(timeout);
        timeout = setTimeout(performSearch, 500);
    });

    $searchInput.on('click', () => {
        if ($movieList.children().length === 0) {
            performSearch();

        }
    });
    $($resetButton).click(() => {
        resetCompass();
    });
};

$(document).ready(() => {
    App();
});