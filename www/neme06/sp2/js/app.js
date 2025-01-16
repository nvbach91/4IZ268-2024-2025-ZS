let debounceTimer;
const config_file = 'config.env';

let bookList, overlay, modalWrapper, modal, searchInput, sortSelect;

window.onload = () => {
    bookList = document.getElementById('book-list');
    overlay = document.getElementById('overlay');
    modalWrapper = document.getElementById('book-modal-wrapper');
    modal = document.getElementById('book-modal');
    searchInput = document.getElementById('search-input');
    sortSelect = document.getElementById('sort-books');

    loadBooksFromLocalStorage();
    setupEventListeners();
    closeBookModal();
};

function setupEventListeners() {
    sortSelect.addEventListener('change', loadBooksFromLocalStorage);

    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();

        const regex = /^[a-zA-Z0-9\-:._\s]+$/;
        if (!regex.test(query)) {
            document.getElementById('search-results').innerHTML = '';
            return;
        }

        if (query.length >= 3) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchBooks(query);
            }, 150);
        } else {
            document.getElementById('search-results').innerHTML = '';
        }
    });
}

function searchBooks(query) {
    fetch(config_file)
        .then((response) => response.text())
        .then((data) => {
            const apiKey = data.match(/API_KEY=(.*)/)?.[1]?.trim();
            if (!apiKey) throw new Error('API key not found in .env file');

            fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`)
                .then(response => response.json())
                .then(data => displaySearchResults(data.items || []))
                .catch(error => console.error('Error fetching books:', error));
        });
}

function displaySearchResults(books) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (books.length === 0) {
        resultsContainer.innerHTML = '<p>Nebyly nalezeny žádné knihy.</p>';
        return;
    }

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookId = book.id;

        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';

        bookItem.innerHTML = `
            <h3>${bookInfo.title}</h3>
            <p>Autor: ${bookInfo.authors ? bookInfo.authors.join(', ') : 'Neznámý autor'}</p>
            <p>Jazyk: ${bookInfo.language}</p>
            <img src='${bookInfo.imageLinks?.thumbnail || ''}' alt='Thumbnail of ${bookInfo.title}' />
        `;

        const addButton = document.createElement('button');
        addButton.textContent = 'Přidat do seznamu';
        addButton.addEventListener('click', () => {
            addBookModal({
                id: bookId,
                title: bookInfo.title,
                author: bookInfo.authors,
                description: bookInfo.description,
                thumbnail: bookInfo.imageLinks?.thumbnail || ''
            });
        });

        bookItem.appendChild(addButton);
        resultsContainer.appendChild(bookItem);
    });
}

function addBookToReadList(book) {
    const bookReview = document.getElementById('review').value;
    const bookRating = document.getElementById('rating').value;

    const savedBooks = JSON.parse(localStorage.getItem('readBooks')) || [];

    const isBookAlreadySaved = savedBooks.some((savedBook) => savedBook.id === book.id);

    if (isBookAlreadySaved) {
        Swal.fire("Kniha se již nachází v seznamu!");
        return;
    }

    const bookJson = {
        id: book.id,
        title: book.title,
        author: book.author,
        thumbnail: book.thumbnail,
        description: book.description,
        review: bookReview,
        rating: bookRating
    };

    const books = [...savedBooks, bookJson];
    localStorage.setItem('readBooks', JSON.stringify(books));

    closeBookModal();
    loadBooksFromLocalStorage();
}

function loadBooksFromLocalStorage() {
    const books = JSON.parse(localStorage.getItem('readBooks')) || [];
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<p>Seznam je prázdný.</p>';
        return;
    }

    const sortOption = sortSelect.value;
    if (sortOption === 'by-rating') {
        books.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const fragment = document.createDocumentFragment();
    books.forEach((book) => {
        const bookItem = createBookListItem(book);
        fragment.appendChild(bookItem);
    });

    bookList.appendChild(fragment);
}

function createBookListItem(book) {
    const bookItem = document.createElement('div');
    bookItem.className = 'book-item';

    bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Autor: ${book.author}</p>
        <img src='${book.thumbnail}' alt='Thumbnail of ${book.title}' />
        <p>Hodnocení: ${book.rating || 'N/A'}</p>
    `;

    const editButton = document.createElement('button');
    editButton.textContent = 'Upravit hodnocení';
    editButton.className = 'edit';
    editButton.addEventListener('click', () => editBook(book.id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Smazat';
    deleteButton.className = 'cancel';
    deleteButton.addEventListener('click', () => deleteBook(book.id));

    bookItem.appendChild(editButton);
    bookItem.appendChild(deleteButton);

    return bookItem;
}

function addBookModal(book, isEditing = false, bookId = null) {
    modalWrapper.style.display = 'block';
    overlay.style.display = 'block';

    modal.innerHTML = `
        <button id="close-modal">Zrušit</button>
        <h3>${book.title}</h3>
        <p>Autor: ${book.authors ? book.authors.join(', ') : 'Neznámý autor'}</p>
        <p>Popis: ${book.description}</p>
        <label for="rating"><p>Vaše hodnocení:</p></label>
        <input type="number" id="rating" name="rating" min="1" max="10"><br>
        <textarea id="review" name="review"></textarea><br>
        <button id="add-book">Přidat do seznamu</button>
    `;

    document.getElementById('close-modal').addEventListener('click', closeBookModal);
    document.getElementById('add-book').addEventListener('click', () => {
        const bookReview = document.getElementById('review').value;
        const bookRating = document.getElementById('rating').value;

        if (isEditing) {
            saveBookEdits(bookId, bookReview, bookRating);
        } else {
            book.review = bookReview;
            book.rating = bookRating;
            window.addBookToReadList(book);
        }
        closeBookModal();
    });
}

function closeBookModal() {
    overlay.style.display = 'none';
    modalWrapper.style.display = 'none';
}

function deleteBook(bookId) {
    Swal.fire({
        title: 'Chcete odebrat knihu ze seznamu?',
        showCancelButton: true,
        confirmButtonText: 'Odebrat',
        cancelButtonText: 'Zrušit'
    }).then((result) => {
        if (result.isConfirmed) {
            const books = JSON.parse(localStorage.getItem('readBooks')) || [];
            const updatedBooks = books.filter(book => book.id !== bookId);
            localStorage.setItem('readBooks', JSON.stringify(updatedBooks));
            loadBooksFromLocalStorage();
            Swal.fire('Kniha byla odebrána!', '', 'success');
        }
    });
}

function editBook(bookId) {
    const books = JSON.parse(localStorage.getItem('readBooks')) || [];
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    addBookModal(book, true, bookId);
    document.getElementById('rating').value = book.rating || '';
    document.getElementById('review').value = book.review || '';
}

function saveBookEdits(bookId, newReview, newRating) {
    const books = JSON.parse(localStorage.getItem('readBooks')) || [];
    const book = books.find(b => b.id === bookId);

    if (book) {
        book.review = newReview;
        book.rating = newRating;

        localStorage.setItem('readBooks', JSON.stringify(books));
        loadBooksFromLocalStorage();
    }
}
