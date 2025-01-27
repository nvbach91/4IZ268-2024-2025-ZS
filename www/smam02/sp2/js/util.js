class Util {
    static constructCard(article) {
        if (!article.urlToImage){
            article.urlToImage = './img/img_not_available.png'
        }
        return $(`<div class='card' style='width: 18rem;'>
                                    <div class='inner-card'>
                                        <img src='${article.urlToImage}' class='card-img-top' alt='Article image'>
                                        <div class='card-body'>
                                            <h5 class='card-title'>${article.title}</h5>
                                            <p class='card-text'>${article.description}</p>
                                            <div>
                                                <a href='${article.url}' class='btn btn-primary'>Full article</a>
                                                <a href='${this.extractBaseUrl(article.url)}' class='card-link'>${article.source.name}</a>
                                            </div>
                                        </div>
                                    </div>
                  </div>`);
    }

    static constructCutomizeSearchDiv() {
        const $customizeSearchDiv =  $('<div>' +
                        '<h3 class="mt-5">I would like to get articles in following languages:</h3>'+
                        '<div class="languages-container">'+
                            '<div id="all">All languages</div>' +
                            '<div id="ar">ar</div>'+
                            '<div id="de">de</div>'+
                            '<div id="en">en</div>'+
                            '<div id="es">es</div>'+
                            '<div id="fr">fr</div>'+
                            '<div id="he">he</div>'+
                            '<div id="it">it</div>'+
                            '<div id="nl">nl</div>'+
                            '<div id="no">no</div>'+
                            '<div id="pt">pt</div>'+
                            '<div id="ru">ru</div>'+
                            '<div id="sv">sv</div>'+
                            '<div id="ud">ud</div>'+
                            '<div id="zh">zh</div>'+
                        '</div>'+
                        '<h3 class="mt-5">Customize sources</h3>' +
                        '<div class="customize-sources-container">' +
                            '<div>' +
                            '<h5>Blacklisted sources: </h5>' +
                            '<ol id="blacklisted-sources"></ol>' +
                            '<form id="blacklist-sources-form">' +
                                '<input type="text" class="form-control" id="blacklist-sources-input">' +
                                '<button class="btn btn-primary">Add</button>' +
                            '</form>' +
                        '</div>' +
                        '<div>' +
                            '<h5>Restrict sources to: </h5>' +
                            '<ol id="restricted-sources"></ol>' +
                            '<form id="restrict-sources-form">' +
                                '<input type="text" class="form-control" id="restrict-sources-input">' +
                                '<button class="btn btn-primary">Add</button>' +
                            '</form>' +
                        '</div>' +
                        '<div>' +
                            '<h5>Sort by: </h5>' +
                            '<div>' +
                                '<button class="btn btn-outline-info sorting-button"' +
            ' id="relevancy-button">Relevancy</button>' +
                                '<button class="btn btn-outline-info sorting-button" id="popularity-button">Popularity</button>' +
                                '<button class="btn btn-outline-info sorting-button" id="date-published-button">Date' +
            ' published</button>' +
                            '</div>' +
                        '</div>' +
                        '</div>' +
                        '<button class="btn btn-success mt-5" id="save-customized-params">Save</button>' +
                 '</div>');

        const languagePreference = localStorage.getItem('selectedLanguage');
        if (languagePreference) {
            $customizeSearchDiv.find(`#${languagePreference}`).addClass('selected-language');
        }

        const sortingPreference = localStorage.getItem('activeSorting');
        if (sortingPreference) {
            $customizeSearchDiv.find(`#${sortingPreference}`).addClass('active').addClass('btn-info');
        }

        const blacklistedSources = localStorage.getItem('blackListedSources');

        if (blacklistedSources) {
            const $blacklistedSourcesOl = $customizeSearchDiv.find('#blacklisted-sources');
            const sourcesArray = blacklistedSources.split(',');

            const listItems = sourcesArray.map(source => this.createListElement(source));
            $blacklistedSourcesOl.append(...listItems);
        }

        const restrictedSources = localStorage.getItem('restrictedSources');

        if (restrictedSources) {
            const $restrictedSourcesOl = $customizeSearchDiv.find('#restricted-sources');
            const sourcesArray = restrictedSources.split(',');

            const listItems = sourcesArray.map(source => this.createListElement(source));
            $restrictedSourcesOl.append(...listItems);
        }

        return $customizeSearchDiv;
    }

    static setupLanguageSelection() {
        const languageDivs = $('.languages-container > div');

        languageDivs.each(function (){
            $(this).on('click', function(event) {
                languageDivs.removeClass('selected-language');
                $(this).addClass('selected-language');
                event.stopPropagation();
            });
        })
    }

    static setupBlacklistSources() {
        const blackListSourcesForm = $('#blacklist-sources-form');
        blackListSourcesForm.on('submit', (event) => {
            event.preventDefault();

            const blacklistSourcesInput = $('#blacklist-sources-input');
            const inputValue = blacklistSourcesInput.val();

            if (inputValue === ''){
                Swal.fire({
                    title: 'Error!',
                    text: 'The blacklisted sources input cannot stay empty',
                    icon: 'error',
                    confirmButtonText: 'I understand'
                });
                return;
            }

            const listItem = this.createListElement(inputValue);
            $('#blacklisted-sources').append(listItem);

            blacklistSourcesInput.val('');
        });
    }

    static setupRestrictSources() {
        const restrictedSourcesForm = $('#restrict-sources-form');
        restrictedSourcesForm.on('submit', (event) => {
            event.preventDefault();
            const restrictSourcesInput = $('#restrict-sources-input');
            const inputValue = restrictSourcesInput.val();

            if (inputValue === ''){
                Swal.fire({
                    title: 'Error!',
                    text: 'The restricted sources input cannot stay empty',
                    icon: 'error',
                    confirmButtonText: 'I understand'
                });
                return;
            }

            const listItem = this.createListElement(inputValue);
            $('#restricted-sources').append(listItem);

            restrictSourcesInput.val('');
        });
    }

    static setupSortingButtons() {
        const relevancySortingButton = $('#relevancy-button');
        const popularitySortingButton = $('#popularity-button');
        const datePublishedButton = $('#date-published-button');

        relevancySortingButton.on('click', () => {
            relevancySortingButton.toggleClass('btn-outline-info').toggleClass('active').toggleClass('btn-info');

            popularitySortingButton.removeClass('active').removeClass('btn-info').addClass('btn-outline-info');
            datePublishedButton.removeClass('active').removeClass('btn-info').addClass('btn-outline-info');
        });

        popularitySortingButton.on('click', () => {
            popularitySortingButton.toggleClass('btn-outline-info').toggleClass('active').toggleClass('btn-info');

            relevancySortingButton.removeClass('active').removeClass('btn-info').addClass('btn-outline-info');
            datePublishedButton.removeClass('active').removeClass('btn-info').addClass('btn-outline-info');
        })

        datePublishedButton.on('click', () => {
            datePublishedButton.toggleClass('btn-outline-info').toggleClass('active').toggleClass('btn-info');

            relevancySortingButton.removeClass('active').removeClass('btn-info').addClass('btn-outline-info');
            popularitySortingButton.removeClass('active').removeClass('btn-info').addClass('btn-outline-info');
        })
    }

    static setupSaveConfigurationButton() {
        const saveConfigurationButton = $('#save-customized-params');

        saveConfigurationButton.on('click', () => {
            const blackListedSources = $('#blacklisted-sources li').map(function() {
                const text = $(this).text();
                return text.slice(0, -1);
            }).get();

            const restrictedSources = $('#restricted-sources li').map(function() {
                const text = $(this).text();
                return text.slice(0, -1);
            }).get();

            if (restrictedSources.length > 0 && blackListedSources.length > 0) {
                Swal.fire({
                    title: 'Error!',
                    text: 'You cannot choose both, restricted and blacklisted sources. Please choose one.',
                    icon: 'error',
                    confirmButtonText: 'I understand'
                });
                return;
            }
            const activeSortingButtonText = $('.sorting-button').filter('.active').attr('id');

            const selectedLanguage = $('.languages-container > div.selected-language').attr('id');

            if (selectedLanguage) {
                localStorage.setItem('selectedLanguage', selectedLanguage);
            }

            if (activeSortingButtonText) {
                localStorage.setItem('activeSorting', activeSortingButtonText);
            }

            localStorage.setItem('blackListedSources', blackListedSources);
            localStorage.setItem('restrictedSources', restrictedSources);

            //cleanup
            $('#rotate-icon').toggleClass('rotate');

            const customizeSearchDiv = $('.customize-search-div');
            customizeSearchDiv.slideUp(500, () => {
                customizeSearchDiv.remove();
            })

        });
    }

    static extractBaseUrl(link) {
        const url = new URL(link);
        return `${url.protocol}//${url.hostname}/`;
    }

    static createListElement(inputValue) {
        const listItem = $('<li></li>').text(inputValue);
        const removeButton = $('<span class="remove-cross">x</span>').css({
            color: 'red',
            marginLeft: '10px',
            cursor: 'pointer'
        });

        removeButton.on('click', function() {
            listItem.remove();
        });

        listItem.append(removeButton);

        return listItem;
    }

    static buildApiStringFromLocalstorage(baseApiUrl, searchValue, apiKey) {
        const url = new URL(window.location.href);
        let finalString = baseApiUrl + '?';

        if (searchValue) {
            finalString += `q=${searchValue}&`;
            url.searchParams.set('q', searchValue);
        }

        const selectedLanguage = localStorage.getItem('selectedLanguage');
        if (selectedLanguage && selectedLanguage !== 'all') {
           finalString += `language=${selectedLanguage}&`;
           url.searchParams.set('language', selectedLanguage);
        }

        const restrictedSources = localStorage.getItem('restrictedSources');
        if (restrictedSources) {
            finalString += `domains=${restrictedSources}&`;
            url.searchParams.set('domains', restrictedSources);
        }

        const blackListedSources = localStorage.getItem('blackListedSources');
        if (blackListedSources) {
            finalString += `excludeDomains=${blackListedSources}&`;
            url.searchParams.set('excludeDomains', blackListedSources);
        }

        const activeSorting = localStorage.getItem('activeSorting');

        if (activeSorting) {
            let sortBy = '';
            switch (activeSorting) {
                case 'relevancy-button':
                    sortBy = 'relevancy'
                    break;
                case 'popularity-button':
                    sortBy = 'popularity'
                    break;
                case 'date-published-button':
                    sortBy = 'publishedAt'
                    break;
            }
            finalString += `sortBy=${sortBy}&`;
            url.searchParams.set('sortBy', sortBy);
        }
        finalString += `apiKey=${apiKey}&pageSize=10`;

        history.replaceState({},'',url);

        return finalString;
    }

    static buildApiStringFromUrl(baseApiUrl, searchValue, apiKey, selectedLanguage, domains, excludeDomains, sortBy) {
        let finalString = baseApiUrl + '?';

        if (searchValue) {
            finalString += `q=${searchValue}&`;
        }


        if (selectedLanguage && selectedLanguage !== 'all') {
            finalString += `language=${selectedLanguage}&`;
        }

        if (domains) {
            finalString += `domains=${domains}&`;
        }

        if (excludeDomains) {
            finalString += `excludeDomains=${excludeDomains}&`
        }

        const activeSorting = localStorage.getItem('activeSorting');

        if (activeSorting) {
            finalString += `sortBy=${sortBy}&`;
        }

        finalString += `apiKey=${apiKey}&pageSize=10`;

        return finalString;
    }

    static showSpinner() {
        $('#spinner').removeClass('d-none');
    }
    static hideSpinner() {
        $('#spinner').addClass('d-none');
    }


}