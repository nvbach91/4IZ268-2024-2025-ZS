const API_KEY = 'AIzaSyDjnMazPS7A55QUNauPZHzgAdiUyGN7P2M';
const BASE_API_URL = 'https://www.googleapis.com/books/v1';
const searchResultsContainer = document.querySelector('#search-results');
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
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Došlo k chybě při načítání knih. Zkuste to znova",
        });
        return { items: [] };
    } finally {
        hideLoader();
    }
};

const renderBookSearchResults = (data, year, language, genre) => {
    const { items } = data;
    if (!items || items.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Došlo k chybě při načítání knih. Pole nesmí zůstat prázdné.",
        });
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
                    <button class="btn btn-warning mt-2" data-id="${item.id}">
                        ${favorites.some(fav => fav.bookId === item.id) ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
                    </button>
                </div>
            </div>
        `;
        const bookContainer = document.createElement('div');
        bookContainer.innerHTML = html;

        
        const favoriteButton = bookContainer.querySelector('button.btn-warning');
        favoriteButton.addEventListener('click', () => {
            toggleFavorite(item.id);
        });

        
        const detailsButton = bookContainer.querySelector('button[data-bs-target="#book-details-modal"]');
        detailsButton.addEventListener('click', async () => {
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
        Swal.fire({
            icon: 'error',
            title: 'Chyba při načítání detailů knihy',
            text: 'Došlo k chybě při načítání detailů knihy. Zkuste to prosím znovu později.',
        });
        return {};
    } finally {
        hideLoader();
    }
};

const renderBookDetails = (data) => {
    if (!data || !data.volumeInfo) {
        console.error("Chyba: Detail knihy je neúplný.");
        Swal.fire({
            icon: 'error',
            title: 'Chyba při načítání detailů knihy',
            text: 'Došlo k chybě při načítání detailů knihy. Zkuste to prosím znovu později.',
        });
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
    const bookElement = document.querySelector(`[data-id="${bookId}"]`);
    const bookTitle = bookElement.querySelector('.card-title').textContent;
    const bookImage = bookElement.querySelector('img').src;
    const favoriteBook = { bookId, bookTitle, bookImage };

    if (favorites.some(book => book.bookId === bookId)) {
        favorites = favorites.filter(book => book.bookId !== bookId);
        bookElement.style.backgroundColor = '';
        const favoriteButton = bookElement.querySelector('button.btn-warning');
        favoriteButton.textContent = 'Přidat do oblíbených';

    } else {
        favorites.push(favoriteBook);
        bookElement.style.backgroundColor = '#ffeb3b';
        const favoriteButton = bookElement.querySelector('button.btn-warning');
        favoriteButton.textContent = 'Odebrat z oblíbených';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    renderFavorites();
};

const favoritesContainer = document.querySelector('#favorites-results');
const renderFavorites = () => {
    const fragment = document.createDocumentFragment();
    favoritesContainer.innerHTML = '';
    if (favorites.length === 0) {
        const noFavoritesMessage = document.createElement('p');
        noFavoritesMessage.textContent = 'Žádné oblíbené knihy.';
        fragment.appendChild(noFavoritesMessage);
    } else {
        favorites.forEach(favorite => {
            const html = `
                <div class="book card col-3 text-center" data-id="${favorite.bookId}">
                    <img src="${favorite.bookImage}" class="card-img-top" alt="${favorite.bookTitle}">
                    <div class="card-body">
                        <h5 class="card-title">${favorite.bookTitle}</h5>
                        <button class="btn btn-danger toggle-favorite">
                            Odebrat z oblíbených
                        </button>
                    </div>
                </div>
            `;
            const bookContainer = document.createElement('div');
            bookContainer.innerHTML = html;

            const removeButton = bookContainer.querySelector('button');

            removeButton.addEventListener('click', () => {
                removeFromFavorites(favorite.bookId);
            });

            fragment.appendChild(bookContainer.firstElementChild);
        });
    }
    favoritesContainer.appendChild(fragment);
};

const removeFromFavorites = (bookId) => {
    Swal.fire({
        title: "Jste si jisti?",
        text: "Opravdu chcete odstranit knihu z oblíbených",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ano, odstranit!"
    }).then((result) => {
        if (result.isConfirmed) {
            favorites = favorites.filter(book => book.bookId !== bookId);
            const bookElement = document.querySelector(`[data-id="${bookId}"]`);
            bookElement.style.backgroundColor = ''; 
            const favoriteButton = bookElement.querySelector('button.btn-warning');
            favoriteButton.textContent = 'Přidat do oblíbených';

            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();

            Swal.fire({
                title: "Odstraněno!",
                text: "Kniha byla odstraněna z oblíbených.",
                icon: "success"
            });
        }

    });
};


const fetchAndRenderSearchResults = async () => {
    const formData = new FormData(document.querySelector('#search-form'));
    const { searchValue, year, language, genre } = Object.fromEntries(formData);
    const bookSearchData = await fetchBookSearchResults(searchValue, year, language, genre);
    renderBookSearchResults(bookSearchData, year, language, genre);
};

const form = document.getElementById('search-form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchValue = document.getElementById('searchValue').value.trim();
    if (searchValue === '') {
        Swal.fire({
            icon: 'error',
            title: 'Chyba',
            text: 'Pole pro hledání nesmí být prázdné!',
        });
    } else {
        fetchAndRenderSearchResults(searchValue);
    }
});

const bookDetailsModal = document.getElementById('book-details-modal');
bookDetailsModal.addEventListener('hidden.bs.modal', () => {
    document.querySelector('#book-details-modal .modal-body').innerHTML = '';
});

renderFavorites();