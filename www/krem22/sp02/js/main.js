const NewsApp = (function () {
    const API_KEY = 'bec05bad951b487e98c48c26c26d584e';
    const FAVORITES_KEY = 'favoriteArticles';
    const SEARCH_STATS_KEY = 'searchStats';
    // ukol 5
    const baseUrl = 'https://newsapi.org/v2/everything';
    const urlParams = new URLSearchParams(window.location.search);

    const $container = $('#articlesContainer');
    const $favoritesContainer = $('#favoritesContainer');
    const $searchInput = $('#searchInput');
    const $languageSelect = $('#languageSelect');
    const $domainInput = $('#domainInput');
    const $dateFrom = $('#dateFrom');
    const $dateTo = $('#dateTo');
    const $searchKeywords = $('#searchKeywords');
    const $loader = $('#loader');
    const $searchPanel = $('.search-panel');
    const $searchButton = $('#searchButton');
    const $clearButton = $('#clearButton');
    const $searchTab = $('#search-tab');
    const $favoritesTab = $('#favorites-tab');
    const $articleModal = $('#articleModal');

    // Funkce pro práci s uloženými daty v prohlížeči
    // Načte oblíbené články z paměti prohlížeče
    const getFavoriteArticles = () => {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    };

    // Načte statistiky vyhledávání z paměti prohlížeče
    const getSearchStats = () => {
        return JSON.parse(localStorage.getItem(SEARCH_STATS_KEY) || '{}');
    };

    // Ukládá jakákoliv data do paměti prohlížeče
    const saveToLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    // Vytvoří kompletní adresu pro získání zpráv z API podle zadaných filtrů
    const buildApiUrl = (keyword, fromDate, toDate, language, domain) => {
        const params = new URLSearchParams({
            q: keyword,
            apiKey: API_KEY,
            from: fromDate.format('YYYY-MM-DD'),
            to: toDate.format('YYYY-MM-DD'),
            language: language || '',
            domains: domain || '',
            sortBy: 'publishedAt'
        });
        return `${baseUrl}?${params.toString()}`;
    };

    return {
        // Spustí aplikaci - načte oblíbené články, statistiky a nastaví ovládací prvky
        init() {
            this.displayFavorites();
            this.displaySearchStats();
            this.initEventListeners();
            
            const keyword = urlParams.get('q');
            if (keyword) {
                $searchInput.val(keyword);
                this.fetchNews(keyword);
            }
        },

        // Nastaví, co se má stát při kliknutí na různá tlačítka a prvky
        initEventListeners() {
            $searchButton.on('click', () => this.handleSearch());
            $clearButton.on('click', () => this.clearFilters());
            $searchTab.on('shown.bs.tab', () => this.handleSearchTab());
            $favoritesTab.on('shown.bs.tab', () => this.displayFavorites());
            $(window).on('popstate', () => this.loadFromURL());
        },

        // Zpracuje vyhledávání - vezme zadané údaje a spustí hledání článků
        async handleSearch() {
            const searchData = {
                keyword: $searchInput.val().trim(),
                language: $languageSelect.val(),
                domain: $domainInput.val().trim(),
                dateFrom: $dateFrom.val(),
                dateTo: $dateTo.val()
            };

            if (!searchData.keyword) {
                this.showError('Zadejte klíčové slovo');
                return;
            }

            this.updateURL(searchData);
            this.updateSearchStats(searchData.keyword);
            await this.fetchNews(searchData.keyword);
        },

        // Získá články z API podle zadaného klíčového slova
        async fetchNews(keyword) {
            try {
                this.showLoader();
                const language = $languageSelect.val();
                const domain = $domainInput.val().trim();
                const dateFrom = $dateFrom.val();
                const dateTo = $dateTo.val();

                const fromDate = dateFrom ? moment(dateFrom) : moment().subtract(1, 'month');
                const toDate = dateTo ? moment(dateTo) : moment();

                const apiUrl = buildApiUrl(keyword, fromDate, toDate, language, domain);
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.status === 'ok') {
                    this.lastSearchResults = data.articles;
                    this.displayNews(data.articles);
                } else {
                    throw new Error(data.message || 'Chyba při načítání dat');
                }
            } catch (error) {
                this.showError(`Chyba při načítání zpráv: ${error.message}`);
                console.error('Error fetching news:', error);
            } finally {
                this.hideLoader();
            }
        },

        // Zobrazí načtené články na stránce úkol 7
        displayNews(articles) {
            const cards = [];
            $container.empty();

            articles.forEach(article => {
                const formattedDate = moment(article.publishedAt).format('DD.MM.YYYY');
                const isFavorite = getFavoriteArticles().some(fav => fav.url === article.url);

                const card = `
                    <div class="col-md-6 mb-4">
                        <div class="card h-100">
                            <div class="card-image-container">
                                ${article.urlToImage ?
                                    `<img src="${article.urlToImage}" class="card-img-top article-thumbnail" alt="Obrázek článku">` :
                                    '<div class="no-image-placeholder"></div>'
                                }
                                <div class="image-overlay"></div>
                                <h5 class="card-title">${article.title}</h5>
                            </div>
                            <div class="card-body d-flex flex-column">
                                <p class="card-text"><strong>Autor:</strong> ${article.author || 'Neznámý'}</p>
                                <p class="card-text"><strong>Datum vydání:</strong> ${formattedDate}</p>
                                <div class="mt-auto d-grid gap-2">
                                    <div class="btn-group">
                                        <button class="btn btn-info detail-btn">Detail článku</button>
                                        <a href="${article.url}" class="btn btn-primary" target="_blank">Číst více</a>
                                    </div>
                                    <button class="btn btn-${isFavorite ? 'danger' : 'success'} favorite-btn">
                                        ${isFavorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                const $card = $(card);
                
                $card.find('.detail-btn').on('click', () => this.showArticleDetail(article));
                $card.find('.favorite-btn').on('click', () => {
                    if (isFavorite) {
                        this.removeFromFavorites(article.url);
                    } else {
                        this.addToFavorites(article);
                    }
                });
                
                cards.push($card);
                
            });
            $container.append(cards);
        },

        // Přidá vybraný článek mezi oblíbené
        addToFavorites(article) {
            const favorites = getFavoriteArticles();
            if (!favorites.some(fav => fav.url === article.url)) {
                favorites.push(article);
                saveToLocalStorage(FAVORITES_KEY, favorites);
                this.displayFavorites();
                const currentArticles = $('#articlesContainer').children().length;
                if (currentArticles > 0) {
                    this.displayNews(this.lastSearchResults || []);
                }
            }
        },

        // Odebere článek z oblíbených
        removeFromFavorites(url) {
            const favorites = getFavoriteArticles();
            const updatedFavorites = favorites.filter(article => article.url !== url);
            saveToLocalStorage(FAVORITES_KEY, updatedFavorites);
            this.displayFavorites();
            const currentArticles = $('#articlesContainer').children().length;
            if (currentArticles > 0) {
                this.displayNews(this.lastSearchResults || []);
            }
        },

        // Aktualizuje počítadlo, kolikrát bylo co vyhledáváno
        updateSearchStats(keyword) {
            const stats = getSearchStats();
            stats[keyword] = (stats[keyword] || 0) + 1;
            saveToLocalStorage(SEARCH_STATS_KEY, stats);
            this.displaySearchStats();
        },

        // Zobrazí chybovou hlášku uživateli
        showError(message) {
            const errorDiv = $('<div>')
                .addClass('alert alert-danger alert-dismissible fade show')
                .html(`
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `);
            $searchPanel.prepend(errorDiv);
        },

        // Zobrazí animaci načítání
        showLoader() {
            $loader.removeClass('d-none');
            $container.addClass('loading');
        },

        // Skryje animaci načítání
        hideLoader() {
            $loader.addClass('d-none');
            $container.removeClass('loading');
        },

        // Zobrazí seznam oblíbených článků
        displayFavorites() {
            const favorites = getFavoriteArticles();
            const $favoritesContainer = $('#favoritesContainer');
            const cards = [];
            
            $favoritesContainer.empty();

            favorites.forEach(article => {
                const formattedDate = moment(article.publishedAt).format('DD.MM.YYYY');
                const card = `
                    <div class="col-md-6 mb-4">
                        <div class="card h-100">
                            <div class="card-image-container">
                                ${article.urlToImage ?
                                    `<img src="${article.urlToImage}" class="card-img-top article-thumbnail" alt="Obrázek článku">` :
                                    '<div class="no-image-placeholder"></div>'
                                }
                                <div class="image-overlay"></div>
                                <h5 class="card-title">${article.title}</h5>
                            </div>
                            <div class="card-body d-flex flex-column">
                                <p class="card-text"><strong>Autor:</strong> ${article.author || 'Neznámý'}</p>
                                <p class="card-text"><strong>Datum vydání:</strong> ${formattedDate}</p>
                                <div class="mt-auto d-grid gap-2">
                                    <div class="btn-group">
                                        <button class="btn btn-info detail-btn">Detail článku</button>
                                        <a href="${article.url}" class="btn btn-primary" target="_blank">Číst více</a>
                                    </div>
                                    <button class="btn btn-danger favorite-btn">Odebrat z oblíbených</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                const $card = $(card);
                
                $card.find('.detail-btn').on('click', () => this.showArticleDetail(article));
                $card.find('.favorite-btn').on('click', () => this.removeFromFavorites(article.url));
                
                cards.push($card);
            });
            
            $favoritesContainer.append(cards);
        },

        // Zobrazí statistiky - co se nejvíc vyhledávalo
        displaySearchStats() {
            const stats = getSearchStats();
            const sortedKeywords = Object.entries(stats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            $searchKeywords.empty();

            if (sortedKeywords.length === 0) {
                $searchKeywords.append('<p class="text-muted">Zatím nebylo nic vyhledáno</p>');
                return;
            }

            const list = $('<ul class="list-group">');
            sortedKeywords.forEach(([keyword, count]) => {
                list.append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${keyword}
                        <span class="badge bg-primary rounded-pill">${count}×</span>
                    </li>
                `);
            });
            $searchKeywords.append(list);
        },

        // Otevře okno s detailními informacemi o článku
        showArticleDetail(article) {
            const modal = $('#articleModal');
            modal.find('.modal-title').text(article.title);
            modal.find('.article-source').text(article.source.name);
            modal.find('.article-author').text(article.author || 'Neznámý');
            modal.find('.article-date').text(moment(article.publishedAt).format('DD.MM.YYYY HH:mm'));
            modal.find('.article-description').text(article.description);
            modal.find('.article-text').text(article.content);
            modal.find('.article-url').attr('href', article.url);

            const imageContainer = modal.find('.article-image');
            if (article.urlToImage) {
                imageContainer.html(`<img src="${article.urlToImage}" class="img-fluid" alt="Obrázek článku">`);
            } else {
                imageContainer.empty();
            }

            const bootstrap = window.bootstrap;
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        },

        // Aktualizuje adresu v prohlížeči podle aktuálního vyhledávání
        updateURL(searchData) {
            const params = new URLSearchParams();
            if (searchData.keyword) params.set('q', searchData.keyword);
            if (searchData.language) params.set('lang', searchData.language);
            if (searchData.domain) params.set('domain', searchData.domain);
            if (searchData.dateFrom) params.set('from', searchData.dateFrom);
            if (searchData.dateTo) params.set('to', searchData.dateTo);

            const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
            window.history.pushState({}, '', newUrl);
        },

        // Vymaže všechny filtry a vrátí vyhledávání do výchozího stavu
        clearFilters() {
            $searchInput.val('');
            $languageSelect.val('');
            $domainInput.val('');
            $dateFrom.val('');
            $dateTo.val('');
            this.updateURL({});
            $container.empty();
        },

        // Když uživatel přepne na záložku vyhledávání
        handleSearchTab() {
            const urlParams = new URLSearchParams(window.location.search);
            const keyword = urlParams.get('q');
            if (keyword) {
                this.fetchNews(keyword);
            }
        },

        // Načte parametry vyhledávání z adresy v prohlížeči
        loadFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const keyword = urlParams.get('q');
            if (keyword) {
                $searchInput.val(keyword);
                this.fetchNews(keyword);
            }
        },

        fillLanguageSelects() {
            $languageSelect = 
            languages =[{value: "en", name: "Angličtina"},
                              {value: "ar", name: "Arabština"},
                              {value: "zh", name: "Čínština"},
                              {value: "fr", name: "Francouzština"},
                              {value: "he", name: "Hebrejština"},
                              {value: "nl", name: "Holandština"},
                              {value: "it", name: "Italština"},
                              {value: "de", name: "Němčina"},
                              {value: "no", name: "Norština"},
                              {value: "pt", name: "Portugalština"},
                              {value: "ru", name: "Ruština"},
                              {value: "es", name: "Španělština"},
                              {value: "sv", name: "Švédština"}
                            ];
        }
    };
})();

// Když se stránka načte, spustí celou aplikaci
$(document).ready(() => {
    NewsApp.init();
});
