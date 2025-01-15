(() => {
    const API_KEY = 'AIzaSyAE_yy5vsTqGxSPDrt93egVCTlssWLpuoE';
    const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

    const searchInput = $('#searchInput');
    const bookResults = $('#bookResults');
    const library = $('#library');


    let personalLibrary = JSON.parse(localStorage.getItem('library')) || []; // pole knih

    const showLoader = () => {
        $('#loader').removeClass('hidden');
        $('#loader').addClass('d-flex');
    };

    const hideLoader = () => {
        $('#loader').addClass('hidden');
        $('#loader').removeClass('d-flex');
    };


    $('#searchForm').on('submit', (e) => {
        e.preventDefault(); // Zabrání reloadu stránky
        const query = searchInput.val();
        if (query) {
            localStorage.setItem('currentSearchQuery', query); // Uložení dotazu do localStorage
            fetchBooks(query);
        }
    });


    $(document).ready(() => {
        // Zobrazení knihovny
        displayLibrary();

        // Kontrola, jestli existuje uložený query
        const savedQuery = localStorage.getItem('currentSearchQuery');
        if (savedQuery && savedQuery.trim() !== '') { // Kontrola, zda savedQuery není prázdný string
            searchInput.val(savedQuery); // Nastavení search inputu na uloženou hodnotu
            fetchBooks(savedQuery); // Načtení výsledků pro uložený query
        } else {
            hideLoader(); // Schová loader, pokud není žádný dotaz
        }
    });


    // Funkce pro získání informací z API pro vyhledávání i detail knih
    const fetchBookData = (query, isDetail = false) => {
        const url = isDetail
            // Ternární operátor (? ->if  : ->else)
            ? `${API_BASE_URL}/${query}?key=${API_KEY}` // Detail knihy podle ID, vrací detailní informace o konkrétní knize
            : `${API_BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}`; // Vyhledávání z API pomocí parametru q (vyhledávací řetězec), vrací seznam knih
        // => API endpointy

        return $.getJSON(url)
            .fail((error) => console.error(`Chyba při načítání ${isDetail ? 'detailu' : 'dat'} knihy:`, error));
    };


    const fetchBooks = (query) => {
        showLoader(); // Zobrazení loaderu

        fetchBookData(query)
            .done((data) => {
                displayBooks(data.items || []);
                hideLoader(); // Skrytí loaderu po úspěšném načtení
            })
            .fail((error) => {
                console.error('Chyba při načítání knih:', error);
                hideLoader(); // Skrytí loaderu i v případě chyby
            });
    };


    const displayBooks = (books) => {
        bookResults.empty(); // Vyčištění předchozích výsledků
        books.forEach(book => {
            const { id, volumeInfo } = book;
            const isInLibrary = personalLibrary.some(b => b.id === id);
            const bookHTML = `
            <div class="col-md-3 d-flex flex-column mb-4">
                <div class="card h-100 d-flex flex-column book-card">
                    <img src="${volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" class="card-img-top book-cover" alt="${volumeInfo.title}">
                    <div class="card-body">
                        <h5 class="card-title">${volumeInfo.title}</h5>
                        <p class="card-text">Autor: ${volumeInfo.authors?.join(', ') || 'Neznámý'}</p>
                        <div class="d-flex justify-content-between mt-2">
                            ${isInLibrary
                    ? `<button class="btn btn-danger remove-book" data-id="${book.id}">Odebrat z knihovny</button>`
                    : `<button class="btn btn-primary add-book" 
                                        data-id="${id}" 
                                        data-title="${volumeInfo.title}" 
                                        data-authors="${volumeInfo.authors?.join(', ') || 'Neznámý'}" 
                                        data-thumbnail="${volumeInfo.imageLinks?.thumbnail || ''}"
                                        data-description="${volumeInfo.description || ''}" 
                                        data-publisher="${volumeInfo.publisher || ''}">
                                    Přidat do knihovny
                                </button>`
                }
                            <button class="btn btn-secondary book-detail" data-id="${id}">Detail</button>
                        </div>
                    </div>
                </div>
            </div>`;
            bookResults.append(bookHTML); // atribut data v HTML pro ukládání vlastních dat
        });
    };


    $(document).on('click', '.add-book', function () {
        const button = $(this); // Tlačítko, které bylo kliknuto
        const id = button.data('id');
        const title = button.data('title');
        const authors = button.data('authors');
        const thumbnail = button.data('thumbnail');
        const description = button.data('description');
        const publisher = button.data('publisher');

        addToLibrary(id, title, authors, thumbnail, description, publisher);

        // Aktualizace vyhledávání pro propsání změny přidání knihy do knihovny
        const currentSearchQuery = searchInput.val();
        if (currentSearchQuery) {
            fetchBooks(currentSearchQuery);
        }
    });


    const addToLibrary = (id, title, authors, thumbnail, description = '', publisher = '') => {
        const book = {
            id,
            title: title || 'Neznámý název',
            authors: authors || 'Neznámý autor',
            thumbnail: thumbnail || 'https://via.placeholder.com/150',
            description: description || 'Popis není k dispozici.',
            publisher: publisher || 'Neznámý vydavatel',
            notes: '', // Výchozí poznámka
            isRead: false, // Výchozí stav přečteno
        };

        if (!personalLibrary.find(b => b.id === id)) { // b = object b (běžná položka)
            personalLibrary.push(book); // pokud kniha ještě není v knihovně, tak ji tam přidá
            localStorage.setItem('library', JSON.stringify(personalLibrary)); // klíč "library", převedení pole knih personalLibrary na řetězec pro uložení
            alert(`Kniha "${title}" byla přidána do knihovny.`);
            displayLibrary();
        } else {
            alert(`Kniha ${title} už je ve vaší knihovně.`);
        }
    };


    const displayLibrary = () => {
        library.empty(); // vyčištění knihovny
        if (personalLibrary.length === 0) {
            library.html('<p>Vaše knihovna je prázdná.</p>');
            return;
        }

        personalLibrary.forEach(book => {
            const bookHTML = `
            <div class="col-md-3 d-flex flex-column mb-4">
                <div class="card h-100 d-flex flex-column book-card">
                    <img src="${book.thumbnail || 'https://via.placeholder.com/150'}" class="card-img-top book-cover" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">Autor: ${book.authors || 'Neznámý autor'}</p>
                        <div class="d-flex justify-content-between mt-2">
                            <button class="btn btn-danger remove-book" data-id="${book.id}">Odebrat z knihovny</button>
                            <button class="btn btn-secondary book-detail" data-id="${book.id}">Detail</button>
                        </div>
                    </div>
                </div>
            </div>`;
            library.append(bookHTML); // atribut data v HTML pro ukládání vlastních dat
        });
    };


    $(document).on('click', '.remove-book', function () {
        const button = $(this); // Tlačítko, které bylo kliknuto, proto potřeba použít function a ne (e)
        const id = button.data('id');

        removeFromLibrary(id);

        // Aktualizace vyhledávání pro propsání změny odebrání knihy do knihovny
        const currentSearchQuery = searchInput.val();
        if (currentSearchQuery) {
            fetchBooks(currentSearchQuery);
        }
    });


    const removeFromLibrary = (id) => {
        personalLibrary = personalLibrary.filter(book => book.id !== id); // vyfiltrování knih s daným id, ty odstraní z personalLibrary, zbytek zůstane v poli
        localStorage.setItem('library', JSON.stringify(personalLibrary));
        alert('Kniha byla odstraněna z vaší knihovny.');
        displayLibrary(); // Aktualizuje zobrazení knihovny
    };


    $(document).on('click', '.book-detail', function () {
        const button = $(this);
        const id = button.data('id');

        showLoader(); // Zobrazí loader

        // Pokud je kniha v knihovně, zobrazíme její detail s poznámkami a statusem
        const bookInLibrary = personalLibrary.find(b => b.id === id);
        if (bookInLibrary) {
            displayBookDetail(bookInLibrary); // Z knihovny
            hideLoader(); // Schová loader
        } else {
            // Načítání z API
            fetchBookData(id, true)
                .done((book) => {
                    fetchBookDetailFromAPI(book);
                    hideLoader(); // Schová loader
                })
                .fail((error) => {
                    console.error('Chyba pri načítání detailu knihy:', error);
                    hideLoader(); // Schová loader
                });
        }
    });


    const fetchBookDetailFromAPI = (book) => {
        const { volumeInfo } = book;
        const detailData = {
            id: book.id,
            title: volumeInfo.title,
            authors: volumeInfo.authors?.join(', ') || 'Neznámý autor',
            thumbnail: volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150',
            description: volumeInfo.description || 'Popis není k dispozici.',
            publisher: volumeInfo.publisher || 'Neznámý vydavatel',
        };
        displayBookDetail(detailData);
    };


    const displayBookDetail = (book) => {
        const isInLibrary = personalLibrary.some(b => b.id === book.id);

        const detailHTML = `
        <h3>${book.title}</h3>
        <p><strong>Autor:</strong> ${book.authors}</p>
        <p><strong>Popis:</strong> ${book.description || 'Popis není k dispozici.'}</p>
        <p><strong>Vydavatel:</strong> ${book.publisher || 'Neznámý vydavatel'}</p>
        <img class="book-detail-cover" src="${book.thumbnail}" alt="${book.title}">
        ${isInLibrary
                ? `
                    <div class="form-group mb-3">
                        <label for="notesInput">
                            <i class="fas fa-sticky-note"></i> <strong>Poznámky:</strong>
                        </label>
                        <textarea class="form-control" id="notesInput" rows="3">${book.notes || ''}</textarea>
                    </div>
                    <div class="form-check mb-3">
                        <input type="checkbox" class="form-check-input" id="isReadCheckbox" ${book.isRead ? 'checked' : ''}>
                        <label class="form-check-label" for="isReadCheckbox"><strong>Přečteno</strong></label>
                    </div>
                    <button class="btn btn-primary" id="saveBookDetail" data-id="${book.id}">Uložit</button>
                `
                : `<p class="text-muted">Přidejte si tuto knihu do knihovny, abyste k ní mohli psát poznámky či označit jako 'přečteno'.</p>`
            }
        
    `;

        $('#bookDetailContent').html(detailHTML); // Naplnění obsahu modálního okna
        $('#bookDetailModal').modal('show');
    };


    $(document).on('click', '#saveBookDetail', function () {
        const button = $(this);
        const id = button.data('id');
        const notes = $('#notesInput').val();
        const isRead = $('#isReadCheckbox').is(':checked');

        // Najde knihu v personalLibrary a aktualizuje data
        const bookIndex = personalLibrary.findIndex(b => b.id === id); // === striktní rovnost (včetně datového typu), == volná rovnost
        if (bookIndex !== -1) { // -1 znamená, že nevyhovuje podmínce, nenašel daný index
            personalLibrary[bookIndex].notes = notes;
            personalLibrary[bookIndex].isRead = isRead;
            localStorage.setItem('library', JSON.stringify(personalLibrary)); // Uložení změn
            alert('Změny uloženy!');
        }

        // Aktualizace filtru (pokud je aktivní)
        applyLibraryFilter();
    });


    $('#filterInput').on('input', function () {
        applyLibraryFilter(); // Filtr při změně textu
    });

    $('#filterStatus').on('change', function () {
        applyLibraryFilter(); // Filtr při změně stavu
    });


    const applyLibraryFilter = () => {
        const filterInput = $('#filterInput').val().toLowerCase(); // Zadaný text (lowercase pro lepší shodu)
        const filterStatus = $('#filterStatus').val(); // Stav filtru (all, read, unread)

        const filteredBooks = personalLibrary.filter(book => {

            const matchesSearch = book.title.toLowerCase().includes(filterInput) || book.authors.toLowerCase().includes(filterInput);

            const matchesStatus =
                filterStatus === 'all' ||
                (filterStatus === 'read' && book.isRead) ||
                (filterStatus === 'unread' && !book.isRead);

            return matchesSearch && matchesStatus; // Kniha musí splňovat obě podmínky filtru
        });

        // Zobrazení filtrovaných knih
        displayFilteredBooks(filteredBooks);
    };


    const displayFilteredBooks = (books) => {
        library.empty(); // Vyčištění aktuální knihovny

        if (books.length === 0) {
            library.html('<p>Žádné knihy neodpovídají zadanému filtru.</p>');
            return;
        }

        books.forEach(book => {
            const bookHTML = `
            <div class="col-md-3 d-flex flex-column mb-4">
                <div class="card h-100 d-flex flex-column book-card">
                    <img src="${book.thumbnail || 'https://via.placeholder.com/150'}" class="card-img-top book-cover" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">Autor: ${book.authors || 'Neznámý autor'}</p>
                        <div class="d-flex justify-content-between mt-2">
                            <button class="btn btn-danger remove-book" data-id="${book.id}">Odebrat z knihovny</button>
                            <button class="btn btn-secondary book-detail" data-id="${book.id}">Detail</button>
                        </div>
                    </div>
                </div>
            </div>`;
            library.append(bookHTML); // Zobrazení knihy
        });
    };
})();
