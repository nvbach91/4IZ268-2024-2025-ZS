const App = () => {
    const $compass = $('#compass');
    const $movieList = $('#movie-list');
    const $searchInput = $('#search-input');
    const apiKey = 'ef8f6bf5';

    const showLoader = () => $('<span class="loader"></span>').appendTo('body');
    const hideLoader = () => $('.loader').remove();

    const getStoredMovies = () => JSON.parse(localStorage.getItem('compassMovies')) || [];

    const saveToLocalStorage = (movie) => {
        const storedMovies = getStoredMovies();
        storedMovies.push(movie);
        localStorage.setItem('compassMovies', JSON.stringify(storedMovies));
    };

    const fetchMovieById = async (imdbID) => {
        try {
            const storedMovies = getStoredMovies();
            if (storedMovies.some(movie => movie.imdbID === imdbID)) return null;
            const response = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
            if (response.data.Response === 'True') {
                const { Ratings, Poster, Title } = response.data;
                const imdbRating = Ratings.find(rating => rating.Source === 'Internet Movie Database')?.Value || null;
                const rottenTomatoesRating = Ratings.find(rating => rating.Source === 'Rotten Tomatoes')?.Value || null;
                if (imdbRating && rottenTomatoesRating) {
                    const x = 100 + parseFloat(imdbRating) * 60;
                    const y = 700 - (6 * parseFloat(rottenTomatoesRating));
                    return { Title, Poster, x, y, imdbID };
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
                    saveToLocalStorage(movieData);
                });
                $compass.append(fragment);

                const ids = validMovies.map(movie => movie.imdbID).join(',');
                updateUrl(ids);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }
        hideLoader();
    };

    const loadFromLocalStorage = () => {
        const storedMovies = getStoredMovies();
        const ids = storedMovies.map(movie => movie.imdbID).join(',');
        const fragment = document.createDocumentFragment();

        storedMovies.forEach(({ Title, Poster, x, y, imdbID }) => {
            const movieElement = createMovieOnCompass({ Title, Poster, x, y, imdbID });
            fragment.appendChild(movieElement);
        });

        $compass.append(fragment);
        updateUrl(ids);
    };

    const deleteMovieFromCompass = (imdbID) => {
        $(`.compass-movie .delete-button[data-imdbid="${imdbID}"]`).closest('.compass-movie').remove();
        let storedMovies = getStoredMovies();
        storedMovies = storedMovies.filter(movie => movie.imdbID !== imdbID);
        localStorage.setItem('compassMovies', JSON.stringify(storedMovies));
        const ids = storedMovies.map(movie => movie.imdbID).join(',');
        updateUrl(ids);
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
                saveToLocalStorage(movieData);
                const storedMovies = getStoredMovies();
                const ids = storedMovies.map(movie => movie.imdbID).join(',');
                updateUrl(ids);
            }
            $movieList.empty();
            $searchInput.val('');
        } catch (error) {
            console.error('Error adding movie:', error);
        }
        hideLoader();
    };

    const createMovieOnCompass = ({ Title, Poster, x, y, imdbID }) => {
        const $movieDiv = $('<div class="compass-movie"></div>')
            .html(`<p>${Title}</p><button class="delete-button" data-imdbid="${imdbID}">X</button>`)
            .css({ backgroundImage: `url("${Poster}")`, left: `${x}px`, top: `${y}px` });

        $movieDiv.find('.delete-button').click(() => {
            deleteMovieFromCompass(imdbID);
        });

        return $movieDiv[0];
    };

    const displaySearchResults = (movies) => {
        $movieList.empty();
        const movieElements = movies.map(movie => $(`
            <article class="movie-search-card">
                <img src="${movie.Poster}" alt="${movie.Title}" 
                onerror="this.onerror=null;this.src='https://critics.io/img/movies/poster-placeholder.png';" />
                <div class="movie-title">${movie.Title}</div>
                <div class="movie-year">(${movie.Year})</div>
                <button class="add-button" data-imdbid="${movie.imdbID}">Add</button>
            </article>
        `).hide());
        $movieList.append(movieElements);
        movieElements.forEach(el => $(el).fadeIn(200));
        $('.add-button').on('click', async (event) => {
            const imdbID = $(event.target).data('imdbid');
            await addMovieToCompass(imdbID);
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
            axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}&type=movie`)
                .then(response => {
                    if (response.data.Response === 'True') {
                        displaySearchResults(response.data.Search);
                    } else {
                        console.log('No results found');
                    }
                })
                .catch(() => {
                    console.error('Error fetching data');
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
};

$(document).ready(() => {
    App();
});