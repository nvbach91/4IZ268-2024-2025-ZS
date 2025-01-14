let debounceTimer;

document.getElementById('search-input').addEventListener('input', (event) => {
    const query = event.target.value.trim();

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
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data.items || []))
        .catch(error => console.error('Error fetching books:', error));
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
            <p>Popis: ${bookInfo.description}</p>
            <img src='${bookInfo.imageLinks.thumbnail}'></img>
            <button onclick='addBookModal(${JSON.stringify({
            title: bookInfo.title,
            author: bookInfo.authors ? bookInfo.authors[0] : 'Neznámý autor'
        })})'>Přidat do seznamu</button>
        `;
        resultsContainer.appendChild(bookItem);
    });
}

function addBookModal() {
}

function addBookToReadList() {
}

function loadBooksFromLocalStorage() {
}

function deleteBook() {
}
