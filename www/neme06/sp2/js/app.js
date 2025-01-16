let debounceTimer;
const config_file = 'config.env';

window.onload = () => {
    loadBooksFromLocalStorage()
    closeBookModal()

    document.getElementById('search-input').addEventListener('input', (event) => {
        const query = event.target.value.trim();
        
        const regex = /^[a-zA-Z0-9\-:._]+$/;
    
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
    
    function searchBooks(query) {
        fetch(config_file)
            .then((response) => response.text())
            .then((data) => {
                const apiKey = data.match(/API_KEY=(.*)/)?.[1]?.trim();
                if (!apiKey) {
                    throw new Error('API key not found in .env file');
                }
    
                fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`)
                .then(response => response.json())
                .then(data => displaySearchResults(data.items || []))
                .catch(error => console.error('Error fetching books:', error));
            })
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
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
    
            bookItem.innerHTML = `
                <h3>${bookInfo.title}</h3>
                <p>Autor: ${bookInfo.authors ? bookInfo.authors.join(', ') : 'Neznámý autor'}</p>
                <img src='${bookInfo.imageLinks.thumbnail}'></img>
                <button onclick='addBookModal(${JSON.stringify({
                title: bookInfo.title,
                authors: bookInfo.authors,
                description: bookInfo.description,
                thumbnail: bookInfo.imageLinks.thumbnail
            })})'>Přidat do seznamu</button>
            `;
            resultsContainer.appendChild(bookItem);
        });
    }
}

function loadBooksFromLocalStorage() {
    const books = JSON.parse(localStorage.getItem('readBooks')) || [];
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<p>Seznam je prázdný.</p>';
        return;
    }

    books.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';

        bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>Autor: ${book.author}</p>
            <img src='${book.thumbnail}'></img>
            <button onclick='editBook(${index})' class="edit">Upravit hodnocení</button>
            <button onclick='deleteBook(${index})'class="cancel">Smazat</button>
        `;
        bookList.appendChild(bookItem);
    });
}

function addBookModal(book) {
    const resultsContainer = document.getElementById('book-modal-wrapper');
    const modal = document.getElementById('book-modal');

    resultsContainer.style.display = 'block';
    modal.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';

    modal.innerHTML =
        `<button onclick='closeBookModal()'>Zrušit</button>          
        <h3>${book.title}</h3>
        <p>Autor: ${book.authors ? book.authors.join(', ') : 'Neznámý autor'}</p>
        <p>Popis: ${book.description}</p>
        <label for="rating"><p>Vaše hodnocení: </p></label>
        <input type="number" id="rating" name="rating" min="1" max="10"><br>
        <textarea id="review" name="review"></textarea><br>
        <button onclick='addBookToReadList(${JSON.stringify(
            {
                title: book.title,
                author: book.authors,
                thumbnail: book.thumbnail,
                description: book.description,
            }
        )
        })'>Přidat do seznamu</button>`
        ;
}

function closeBookModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('book-modal-wrapper').style.display = 'none';
    // document.getElementById('modal').remove();
}
    
function addBookToReadList(book) {
    const bookReview = document.getElementById('review').value
    const bookRating = document.getElementById('rating').value;

    const bookJson = {
        title: book.title,
        author: book.author,
        thumbnail: book.thumbnail,
        description: book.description,
        review: bookReview,
        rating: bookRating
    };

    const bookJsonString = JSON.stringify(bookJson);
    console.log(bookJsonString);

    document.getElementById('overlay').style.display = 'none';
    document.getElementById('book-modal-wrapper').style.display = 'none';

    let books = JSON.parse(localStorage.getItem('readBooks')) || [];
    books.push(bookJson);
    localStorage.setItem('readBooks', JSON.stringify(books));
    loadBooksFromLocalStorage();
}

    
function editBook(index) {
    const books = JSON.parse(localStorage.getItem('readBooks')) || [];
    const book = books[index];

    if (book) {
        const resultsContainer = document.getElementById('book-modal-wrapper');
        const modal = document.getElementById('book-modal');
    
        resultsContainer.style.display = 'block';
        modal.style.display = 'block';

        document.getElementById('overlay').style.display = 'block';

        modal.innerHTML = `
            <button onclick='closeBookModal()' class="cancel">Zrušit</button>          
            <h3>${book.title}</h3>
            <p>Autor: ${book.author}</p>
            <p>Popis: ${book.description}</p>
            <label for="rating"><p>Vaše hodnocení: </p></label>
            <input type="number" id="rating" name="rating" min="1" max="10" value="${book.rating || ''}"><br>
            <textarea id="review" name="review">${book.review || ''}</textarea><br>
            <button onclick='saveBookEdits(${index})'>Uložit</button>
        `;
    }
}
    
function saveBookEdits(index) {
    const books = JSON.parse(localStorage.getItem('readBooks')) || [];
    const book = books[index];

    if (book) {
        const newRating = document.getElementById('rating').value;
        const newReview = document.getElementById('review').value;

        book.rating = newRating;
        book.review = newReview;

        localStorage.setItem('readBooks', JSON.stringify(books));

        closeBookModal();
        loadBooksFromLocalStorage();
    }
}

function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem('readBooks')) || [];
    books.splice(index, 1);
    localStorage.setItem('readBooks', JSON.stringify(books));
    loadBooksFromLocalStorage();
}
