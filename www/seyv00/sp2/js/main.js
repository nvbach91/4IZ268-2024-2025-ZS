const API_KEY = 'AIzaSyAE_yy5vsTqGxSPDrt93egVCTlssWLpuoE';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const bookResults = document.getElementById('bookResults');
const library = document.getElementById('library');

let personalLibrary = JSON.parse(localStorage.getItem('library')) || [];

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) fetchBooks(query);
});

const fetchBooks = (query) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayBooks(data.items || []))
        .catch(error => console.error('Chyba při načítání dat z API:', error));
};

const displayBooks = (books) => {
    bookResults.innerHTML = ''; // Vyčištění předchozích výsledků
    books.forEach(book => {
        const { id, volumeInfo } = book;
        const bookHTML = `
            <div class="col-md-3 mb-3">
                <div class="card book-card">
                    <img src="${volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" class="card-img-top book-cover" alt="${volumeInfo.title}">
                    <div class="card-body">
                        <h5 class="card-title">${volumeInfo.title}</h5>
                        <p class="card-text">Autor: ${volumeInfo.authors?.join(', ') || 'Neznámý'}</p>
                        <button class="btn btn-primary" onclick="addToLibrary('${id}', '${volumeInfo.title}', '${volumeInfo.authors?.join(', ')}', '${volumeInfo.imageLinks?.thumbnail}')">Přidat do knihovny</button>
                    </div>
                </div>
            </div>`;
        bookResults.insertAdjacentHTML('beforeend', bookHTML);
    });
};