const NewsApp = (function () {
    const API_KEY = 'bec05bad951b487e98c48c26c26d584e';
    const FAVORITES_KEY = 'favoriteArticles';
    const SEARCH_STATS_KEY = 'searchStats';

    const getFavoriteArticles = () => {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    };

    const getSearchStats = () => {
        return JSON.parse(localStorage.getItem(SEARCH_STATS_KEY) || '{}');
    };

    const saveToLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    const buildApiUrl = (keyword, fromDate, toDate, language, domain) => {
        const baseUrl = 'https://newsapi.org/v2/everything';
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
        init() {
            this.displayFavorites();
            this.displaySearchStats();
            this.initEventListeners();
        },

        initEventListeners() {
            $('#searchButton').on('click', () => this.handleSearch());
            $('#clearButton').on('click', () => this.clearFilters());
            $('#search-tab').on('shown.bs.tab', () => this.handleSearchTab());
            $('#favorites-tab').on('shown.bs.tab', () => this.displayFavorites());
            $(window).on('popstate', () => this.loadFromURL());
        },

        async handleSearch() {
            const keyword = $('#searchInput').val().trim();
            const language = $('#languageSelect').val();
            const domain = $('#domainInput').val().trim();
            const dateFrom = $('#dateFrom').val();
            const dateTo = $('#dateTo').val();

            if (!keyword) {
                this.showError('Zadejte klíčové slovo');
                return;
            }

            this.updateURL(keyword, language, domain, dateFrom, dateTo);
            this.updateSearchStats(keyword);
            await this.fetchNews(keyword);
        },

        async fetchNews(keyword) {
            try {
                this.showLoader();
                const language = $('#languageSelect').val();
                const domain = $('#domainInput').val().trim();
                const dateFrom = $('#dateFrom').val();
                const dateTo = $('#dateTo').val();

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

        displayNews(articles) {
            const $container = $('#articlesContainer');
            $container.empty();

            articles.forEach(article => {
                const formattedDate = moment(article.publishedAt).format('DD.MM.YYYY');
                const isFavorite = getFavoriteArticles().some(fav => fav.url === article.url);

                const escapedArticle = JSON.stringify(article)
                    .replace(/'/g, "&#39;")
                    .replace(/"/g, "&quot;");

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
                                        <button class="btn btn-info" onclick="NewsApp.showArticleDetail(${escapedArticle})">
                                            Detail článku
                                        </button>
                                        <a href="${article.url}" class="btn btn-primary" target="_blank">Číst více</a>
                                    </div>
                                    <button class="btn btn-${isFavorite ? 'danger' : 'success'}" 
                                            onclick="${isFavorite ?
                        `NewsApp.removeFromFavorites('${article.url}')` :
                        `NewsApp.addToFavorites(${escapedArticle})`}">
                                        ${isFavorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $container.append(card);
            });
        },

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

        updateSearchStats(keyword) {
            const stats = getSearchStats();
            stats[keyword] = (stats[keyword] || 0) + 1;
            saveToLocalStorage(SEARCH_STATS_KEY, stats);
            this.displaySearchStats();
        },

        showError(message) {
            const errorDiv = $('<div>')
                .addClass('alert alert-danger alert-dismissible fade show')
                .html(`
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `);
            $('.search-panel').prepend(errorDiv);
        },

        showLoader() {
            $('#loader').removeClass('d-none');
            $('#articlesContainer').addClass('loading');
        },

        hideLoader() {
            $('#loader').addClass('d-none');
            $('#articlesContainer').removeClass('loading');
        },

        displayFavorites() {
            const favorites = getFavoriteArticles();
            const $favoritesContainer = $('#favoritesContainer');
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
                                        <button class="btn btn-info" onclick='NewsApp.showArticleDetail(${JSON.stringify(article).replace(/'/g, "&#39;")})'>
                                            Detail článku
                                        </button>
                                        <a href="${article.url}" class="btn btn-primary" target="_blank">Číst více</a>
                                    </div>
                                    <button class="btn btn-danger" onclick="NewsApp.removeFromFavorites('${article.url}')">
                                        Odebrat z oblíbených
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $favoritesContainer.append(card);
            });
        },

        displaySearchStats() {
            const stats = getSearchStats();
            const sortedKeywords = Object.entries(stats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            const $searchKeywords = $('#searchKeywords');
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

        updateURL(keyword, language, domain, dateFrom, dateTo) {
            const params = new URLSearchParams();
            if (keyword) params.set('q', keyword);
            if (language) params.set('lang', language);
            if (domain) params.set('domain', domain);
            if (dateFrom) params.set('from', dateFrom);
            if (dateTo) params.set('to', dateTo);

            const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
            window.history.pushState({}, '', newUrl);
        },

        clearFilters() {
            $('#searchInput').val('');
            $('#languageSelect').val('');
            $('#domainInput').val('');
            $('#dateFrom').val('');
            $('#dateTo').val('');
            this.updateURL('', '', '', '', '');
            $('#articlesContainer').empty();
        },

        handleSearchTab() {
            const urlParams = new URLSearchParams(window.location.search);
            const keyword = urlParams.get('q');
            if (keyword) {
                this.fetchNews(keyword);
            }
        },

        loadFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const keyword = urlParams.get('q');
            if (keyword) {
                this.fetchNews(keyword);
            }
        }
    };
})();

$(document).ready(() => {
    NewsApp.init();
});
