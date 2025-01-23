const API_KEY = 'AIzaSyDjnMazPS7A55QUNauPZHzgAdiUyGN7P2M';
const BASE_API_URL = 'https://www.googleapis.com/books/v1';
const searchResultsContainer = document.querySelector('#search-results');
const favoritesContainer = document.querySelector('#favorites-results');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const showLoader = () => {
    document.querySelector('#loader').style.display = 'block';
};

const hideLoader = () => {
    document.querySelector('#loader').style.display = 'none';
};

const fetchBookSearchResults = async (searchValue, year, language, genre) => {
    let url = `${BASE_API_URL}/volumes?q=${searchValue}&key=${API_KEY}&maxResults=20`;
    showLoader();
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Chyba při načítání dat: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Došlo k chybě při načítání výsledků hledání:", error);
        alert("Došlo k chybě při načítání knih. Zkuste to prosím znovu později.");
        return { items: [] };
    } finally {
        hideLoader();
    }
};

const renderBookSearchResults = (data, year, language, genre) => {
    const { items } = data;
    if (!items || items.length === 0) {
        alert("Žádné knihy nebyly nalezeny nebo došlo k chybě při načítání dat.");
        return;
    }

    const books = items.filter((item) => {
        const { volumeInfo } = item;
        const publishedDate = volumeInfo.publishedDate || '';
        const itemLanguage = volumeInfo.language || '';
        const itemGenres = volumeInfo.categories || [];
        let isValid = true;

        if (year && publishedDate) {
            isValid = isValid && publishedDate.startsWith(year);
        }

        if (language && itemLanguage) {
            isValid = isValid && itemLanguage.toLowerCase() === language.toLowerCase();
        }

        if (genre && itemGenres.length > 0) {
            isValid = isValid && itemGenres.some((genreItem) => genreItem.toLowerCase().includes(genre.toLowerCase()));
        }
        return isValid;
    }).map((item) => {
        const { volumeInfo } = item;
        const { title, imageLinks, publishedDate, language, categories } = volumeInfo;
        const imgSrc = imageLinks && imageLinks.thumbnail ? imageLinks.thumbnail : 'default-image.jpg';
        const bookLanguage = language || 'N/A';
        const bookGenres = categories ? categories.join(', ') : 'N/A';
        const html = `
            <div class="book card col-3 text-center" data-id="${item.id}">
                <img src="${imgSrc}" class="card-img-top" alt="${title}">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p>${bookGenres}</p>
                    <p><strong>Jazyk:</strong> ${bookLanguage}</p>
                    <p><strong>Rok vydání:</strong> ${publishedDate}</p>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#book-details-modal">
                        Zobrazit detaily
                    </button>
                    <button class="btn btn-warning mt-2" onclick="toggleFavorite('${item.id}')">
                        ${favorites.some(fav => fav.bookId === item.id) ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
                    </button>
                </div>
            </div>
        `;
        const bookContainer = document.createElement('div');
        bookContainer.innerHTML = html;
        bookContainer.querySelector('button[data-bs-target="#book-details-modal"]').addEventListener('click', async () => {
            const bookDetailsData = await fetchBookDetails(item.id);
            renderBookDetails(bookDetailsData);
        });
        return bookContainer.firstElementChild;
    });
    searchResultsContainer.innerHTML = '';
    searchResultsContainer.append(...books);
};

const fetchBookDetails = async (bookId) => {
    const url = `${BASE_API_URL}/volumes/${bookId}?key=${API_KEY}`;

    try {
        showLoader();
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Chyba při načítání detailů knihy: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Došlo k chybě při načítání detailů knihy:", error);
        alert("Došlo k chybě při načítání detailů knihy. Zkuste to prosím znovu později.");
        return {};
    } finally {
        hideLoader();
    }
};

const renderBookDetails = (data) => {
    if (!data || !data.volumeInfo) {
        console.error("Chyba: Detail knihy je neúplný.");
        alert("Došlo k chybě při načítání detailů knihy.");
        return;
    }
    const { title, imageLinks, language, description, publishedDate, categories } = data.volumeInfo;
    const imgSrc = imageLinks && imageLinks.thumbnail ? imageLinks.thumbnail : 'default-image.jpg';
    const dom = `
        <div class="book">
            <h3 class="book-title">${title}</h3>
            <img src="${imgSrc}" class="card-img-top" alt="${title}">
            <div class="book-description">${description || 'Popis není k dispozici'}</div>
            <div class="book-language"><strong>Jazyk:</strong> ${language || 'N/A'}</div>
            <div class="book-published-date"><strong>Rok vydání:</strong> ${publishedDate || 'N/A'}</div>
            <div class="book-genres"><strong>Žánry:</strong> ${categories ? categories.join(', ') : 'N/A'}</div>
        </div>
    `;

    document.querySelector('#book-details-modal .modal-body').innerHTML = dom;
};

const toggleFavorite = (bookId) => {
    const bookElement = searchResultsContainer.querySelector(`[data-id="${bookId}"]`);
    const bookTitle = bookElement.querySelector('.card-title').textContent;
    const bookImage = bookElement.querySelector('img').src;
    const favoriteBook = { bookId, bookTitle, bookImage };


    if (favorites.some(book => book.bookId === bookId)) {
        favorites = favorites.filter(book => book.bookId !== bookId);
    } else {
        favorites.push(favoriteBook);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();

};

const renderFavorites = () => {
    favoritesContainer.innerHTML = '';
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>Žádné oblíbené knihy.</p>';
    } else {
        favorites.forEach(favorite => {
            const html = `
                <div class="book card col-3 text-center">
                    <img src="${favorite.bookImage}" class="card-img-top" alt="${favorite.bookTitle}">
                    <div class="card-body">
                        <h5 class="card-title">${favorite.bookTitle}</h5>
                        <button class="btn btn-danger" onclick="toggleFavorite('${favorite.bookId}')">Odebrat z oblíbených</button>
                    </div>
                </div>
            `;
            const bookContainer = document.createElement('div');
            bookContainer.innerHTML = html;
            favoritesContainer.append(bookContainer.firstElementChild);
        });
    }
};

const removeFromFavorites = (bookId) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(book => book.bookId !== bookId);
    renderFavorites();
};

const fetchAndRenderSearchResults = async () => {
    const formData = new FormData(document.querySelector('#search-form'));
    const { searchValue, year, language, genre } = Object.fromEntries(formData);
    const bookSearchData = await fetchBookSearchResults(searchValue, year, language, genre);
    renderBookSearchResults(bookSearchData, year, language, genre);
};

const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchAndRenderSearchResults();
});

renderFavorites();