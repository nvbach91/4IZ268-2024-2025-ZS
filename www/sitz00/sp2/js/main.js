document.ready - $(document).ready(() => {

    /** název knihovny v local Storage */
    const libraryName = "MyLexicon";

    /** DOM element */
    const searchedWord = $("#searchedWord");
    const wordInformation = $("#wordInformation");
    const searchForWord = $("#searchForWord");
    const searchHistory = $("#searchHistory");
    const clearHistory = $("#clearHistory");


    // funkce 

    /** Zobrazí spinner*/
    const showSpinner = () => {
        wordInformation.empty();
        wordInformation.append(`
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `);
    };

    /** Skryje spinner */
    const hideSpinner = () => {
        $(".spinner-border").remove();
    };




    /** Zobrazí chybovou zprávu */
    const showError = (message) => {
        hideSpinner();
        wordInformation.empty();
        wordInformation.append(`
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            `);
    };




    /** Validace hledaného slova */
    const wordValidation = (searchedWord) => {
        if (typeof searchedWord !== "string")
            return { error: "Invalid input. Word must be a string." };

        const word = searchedWord.trim();

        if (!word || word === "")
            return { error: "Invalid input. Please enter a valid word." };

        if (word.length > 50)
            return { error: "Invalid input. Word is way too long." };

        return { word };
    };




    /**  Fetch s timeoutem */
    const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
        const controller = new AbortController();
        const signal = controller.signal;

        const timer = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { options, signal });
            clearTimeout(timer);
            return response;
        } catch (error) {
            clearTimeout(timer);
            if (error.name === "AbortError") {
                throw new Error("Request timed out. Please try again later.");
            } else {
                throw error;
            };
        };
    };



    //Práce s historií a localStorage
    /** Načítání dat z localStorage (obecně - item) */
    const getFromHistory = (item) => {
        const data = localStorage.getItem(item);
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    /** Uložení dat do localStorage */
    const saveToHistory = (word, data) => {
        let history = getFromHistory(libraryName) ?? {};
        const trimmedWord = word.trim().toLowerCase();

        if (!trimmedWord || trimmedWord === "")
            return false;

        history[trimmedWord] = data;
        localStorage.setItem(libraryName, JSON.stringify(history));

        updateAutocomplete();
    };

    /** Vyhledání konkrétního slova v historii */
    const findInHistory = (word) => {
        const data = getFromHistory(libraryName);
        if (!data)
            return null;
        const trimmedWord = word.trim().toLowerCase();
        return data[trimmedWord];
    };

    /** Vymazání historie vyhledávání */
    clearHistory.on("click", () => {
        localStorage.removeItem(libraryName);

        wordInformation.empty();
        wordInformation.append(`<p class="text-center text-secondary p-5">Nothing here! Search for word.</p>`);

        searchHistory.empty();
        searchHistory.append(`<p class="text-center text-secondary">Search history is empty.</p>`);

        clearHistory.prop("disabled", true);
        searchedWord.val("");
        updateURL("");
        updateAutocomplete();
    });

    /** Přidání slova do historie */
    const appendToHistory = (word) => {
        const data = getFromHistory(libraryName);
        const historyListItem = $(`<button type="button" class="btn btn-light m-1 text-start">${word}</button>`);

        historyListItem.on("click", () => {
            useFromHistory(word);
        });

        if (searchHistory.children().length === 1 && Object.keys(data).length === 1)
            searchHistory.empty();

        searchHistory.prepend(historyListItem);
        clearHistory.prop("disabled", false);
    };

    /** Zobrazení historie */
    const displayWordHistory = () => {
        const historyList = getFromHistory(libraryName);
        searchHistory.empty();

        if (historyList) {
            Object.keys(historyList).forEach(word => {
                appendToHistory(word);
            });
        } else {
            searchHistory.append(`<p class="text-center text-secondary">Search history is empty.</p>`);
        }
    };

    displayWordHistory();

    /** Použití slova z historie */
    const useFromHistory = (word) => {
        searchedWord.val(word);
        const wordFromHistory = findInHistory(word);
        displayData(wordFromHistory);
        updateURL(word);
        return;
    };






    // Práce s DOM
    /** Zobrazení nalezených dat o slově */
    const displayData = (data) => {
        wordInformation.empty();
        const fragment = $(document.createDocumentFragment());

        if (data && data.length > 0) {
            data.forEach((wordData) => {
                const card = $("<div>", { class: "card mb-3 shadow-sm" });
                const cardBody = $("<div>", { class: "card-body" });

                cardBody.append(`<h2 class="card-title lh-lg">${wordData.word}</h2>`);


                if (wordData.phonetics && wordData.phonetics.length > 0) {
                    const phonetic = wordData.phonetics.find(phonetic => phonetic.text && phonetic.audio);

                    if (phonetic) {
                        if (phonetic.text) {
                            cardBody.append(`<h6 class="card-subtitle mb-2 text-body-secondary">${phonetic.text}</h6>`);
                        };

                        if (phonetic.audio) {
                            const audio = $("<audio>", {
                                controls: true,
                                src: phonetic.audio,
                            });

                            cardBody.append(audio);
                        }
                    }
                };


                if (wordData.meanings && wordData.meanings.length > 0) {
                    wordData.meanings.forEach((meaning) => {
                        cardBody.append(`<h5 class="card-subtitle mb-2  lh-lg">${meaning.partOfSpeech}</h5>`);
                        let definitionList = $("<ul>", { class: "list-group list-group-flush mb-2" });

                        meaning.definitions.forEach((definition) => {
                            definitionList.append(`<li class="list-group-item fs-6 text-body-secondary ">${definition.definition}</li>`);
                        });

                        cardBody.append(definitionList);
                    });
                } else {
                    cardBody.append(`<p class="card-text">No meanings found for ${wordData.word}.</p>`);
                }


                card.append(cardBody);
                fragment.append(card);
            });

            wordInformation.append(fragment);

        } else {
            throw showError("No data available for the searched word.");
        }
    };



    // Našeptávání
    //$(element).autocomplete("option", "setting", value);

    const getAvailableWords = () => {
        const history = getFromHistory(libraryName) || {};
        return Object.keys(history);
    };

    /** Aktualizace autocomplete */
    const updateAutocomplete = () => {
        searchedWord.autocomplete("option", "source", getAvailableWords());
    };

    /** Našeptávání */
    const startAutocomplete = () => {
        searchedWord.autocomplete({
            source: getAvailableWords(),
            delay: 300
        });
    };

    startAutocomplete();




    //vyhledávání

    /** Vyhledání slova ve formuláři na submit */
    searchForWord.on("submit", async (e) => {
        e.preventDefault();

        const word = searchedWord.val();
        await performSearch(word);
    });

    /** Vyhledání významu slov */
    const performSearch = async (word) => {
        showSpinner();

        const validationResult = wordValidation(word);

        if (validationResult.error) {
            showError(validationResult.error);
            hideSpinner();
            return;
        };

        const validWord = validationResult.word;
        updateURL(validWord);

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${validWord}`;

        const wordFromHistory = findInHistory(validWord);
        if (wordFromHistory) {
            displayData(wordFromHistory);
            hideSpinner();
            return;

        } else {
            try {
                const searchResult = await fetchWithTimeout(url);

                if (!searchResult.ok) {
                    throw new Error("Word not found! Please try a different word.");
                }

                const data = await searchResult.json();

                displayData(data);
                saveToHistory(validWord, data);
                appendToHistory(validWord);
                updateAutocomplete();

            } catch (error) {
                showError(error.message || "An unexpected error occurred.");
                return;
            } finally {
                hideSpinner();
            }
        };
    };




    // historie back and forward v prohlížeči
    /** Aktualizace URL */
    const updateURL = (word) => {
        const currentWord = new URLSearchParams(window.location.search).get("word");
        if (currentWord === word) {
            return;
        }

        if (word) {
            newURL = `${window.location.pathname}?word=${encodeURIComponent(word)}`;
        } else {
            newURL = window.location.pathname;
        };

        history.pushState({ word }, "", newURL);
        window.scrollTo(0, 0);
    };

    const getWordFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("word");
    };

    window.addEventListener("popstate", (event) => {
        const word = event.state?.word || getWordFromURL();
        if (word) {
            searchedWord.val(word);
            performSearch(word);
        } else {
            wordInformation.empty();
            searchedWord.val("");
        }
    });

    const initialWord = getWordFromURL();
    if (initialWord) {
        searchedWord.val(initialWord);
        performSearch(initialWord);
    };

});