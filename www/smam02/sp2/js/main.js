const BASE_API_URL = 'https://eso.vse.cz/~smam02/proxy/index.php';
const API_KEY = '3db70ebd613645489875c0c8ce396156';

async function fetchData(apiString) {
    try {
        const movieResponse = await fetch(apiString, {
            headers: { "User-Agent": "User-Agent: MyNewsProxy/1.0" }
        });
        const data = await movieResponse.json();
        console.log('Data from the server:', data);
        return data.articles;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderData(fetchedArticles) {
    const newsItemsContainer = $('#news-items');

    const newsItems = fetchedArticles.map(article => Util.constructCard(article));
    newsItemsContainer.append(newsItems);
}

$('search-form').on('submit', async (event) => {
    event.preventDefault();
    $('search-h3').addClass('d-none');

    const searchQuery = $('#search-input').val().trim();
    if (searchQuery) {
        history.replaceState({},'','?searchValue=${encodeURIComponent(searchQuery)}');
        init();
    }
});

(async() => {
    init();
})();

async function init() {
    if (!navigator.onLine) {
        const offlineArticles = localStorage.getItem('offlineArticles');
        if (offlineArticles) {
            renderData(offlineArticles);
        }
    }

    const url = new URL(location.href);

    const searchValue = url.searchParams.get('searchValue');
    const selectedLanguage = url.searchParams.get('language');
    const domains = url.searchParams.get('domains');
    const excludeDomains = url.searchParams.get('excludeDomains');
    const sortBy = url.searchParams.get('sortBy');

    let apiString = '';

    if (searchValue) {
        $('#news-items').empty();
        Util.showSpinner();
        if (!selectedLanguage && !domains && !excludeDomains && !sortBy) {
            apiString = Util.buildApiStringFromLocalstorage(BASE_API_URL, searchValue, API_KEY);
        } else {
            apiString = Util.buildApiStringFromUrl(BASE_API_URL, searchValue, API_KEY, selectedLanguage, domains, excludeDomains, sortBy);
        }

        const fetchedArticles = await fetchData(apiString);
        Util.hideSpinner();


        const $noResultsh3 = $('#no-results-h3');
        const $search3 = $('#search-h3');

        if (fetchedArticles.length > 0) {
            $noResultsh3.addClass('d-none');
            $search3.addClass('d-none');

            localStorage.setItem('offlineArticles', fetchedArticles);
            renderData(fetchedArticles);
        } else {
            $noResultsh3.removeClass('d-none');
            $search3.addClass('d-none');
        }
    }
}

$('#customize-search').on('click',  () => {
    let customizeSearchDiv = $('.customize-search-div');

    $('#rotate-icon').toggleClass('rotate');

    if (customizeSearchDiv.length === 0) {
        customizeSearchDiv = Util.constructCutomizeSearchDiv();
            customizeSearchDiv.addClass('customize-search-div')
                .hide();
        $('main').prepend(customizeSearchDiv);

        Util.setupLanguageSelection();
        Util.setupBlacklistSources();
        Util.setupRestrictSources();
        Util.setupSortingButtons();
        Util.setupSaveConfigurationButton();

        customizeSearchDiv.slideDown(500);
    } else {
        customizeSearchDiv.slideUp(500, () => {
            customizeSearchDiv.remove();
        });
    }
});