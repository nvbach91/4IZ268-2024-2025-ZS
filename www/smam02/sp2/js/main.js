const BASE_API_URL = '../proxy/index.php';
const API_KEY = '3db70ebd613645489875c0c8ce396156';

// Definition of common elements
const $searchH3 = $('#search-h3');
const $newsItemsContainer = $('#news-items');
const $searchInput = $('#search-input');
const $main = $('main');
const $noResultsh3 = $('#no-results-h3');
const $rotateIcon = $('#rotate-icon');
const $newsArticle = $('#news-article');
const $newsArticleIframe = $('#news-article-iframe');


const fetchData = async function(apiString) {
    try {
        const movieResponse = await fetch(apiString, {
            headers: { 'User-Agent': 'User-Agent: MyNewsProxy/1.0' }
        });
        const data = await movieResponse.json();
        console.log('Data from the server:', data);
        return data.articles;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const renderData = function (fetchedArticles) {
    $newsItemsContainer.removeClass('d-none');

    const newsItems = fetchedArticles.map(article => Util.constructCard(article, $newsArticleIframe));
    $newsItemsContainer.append(newsItems);
}

$('#search-form').on('submit', async (event) => {
    event.preventDefault();
    $searchH3.addClass('d-none');

    const searchQuery = $searchInput.val().trim();
    if (searchQuery) {
        history.replaceState({},'',`?searchValue=${encodeURIComponent(searchQuery)}`);
        init();
    }
});

window.addEventListener("popstate", (event) => {
    $searchInput.val('');
    init();
});

const init = async function () {
    const url = new URL(location.href);

    const searchValue = url.searchParams.get('searchValue');
    const selectedLanguage = url.searchParams.get('language');
    const domains = url.searchParams.get('domains');
    const excludeDomains = url.searchParams.get('excludeDomains');
    const sortBy = url.searchParams.get('sortBy');

    let apiString = '';

    if (searchValue) {
        $newsItemsContainer.empty();
        Util.showSpinner();
        if (!selectedLanguage && !domains && !excludeDomains && !sortBy) {
            apiString = Util.buildApiStringFromLocalstorage(BASE_API_URL, searchValue, API_KEY);
        } else {
            apiString = Util.buildApiStringFromUrl(BASE_API_URL, searchValue, API_KEY, selectedLanguage, domains, excludeDomains, sortBy);
        }

        const fetchedArticles = await fetchData(apiString);
        Util.hideSpinner();

        if (fetchedArticles.length > 0) {
            $noResultsh3.addClass('d-none');
            $searchH3.addClass('d-none');

            renderData(fetchedArticles);

            history.pushState(fetchedArticles, "", window.location.href);
        } else {
            $noResultsh3.removeClass('d-none');
            $searchH3.addClass('d-none');
        }
    }
};

(async() => {
    init();
})();

$('#customize-search').on('click',  () => {
    let customizeSearchDiv = $('.customize-search-div');

    $rotateIcon.toggleClass('rotate');

    if (customizeSearchDiv.length === 0) {
        customizeSearchDiv = Util.constructCutomizeSearchDiv();
            customizeSearchDiv.addClass('customize-search-div')
                .hide();
        $main.prepend(customizeSearchDiv);

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
history.replaceState({}, "", window.location.href);