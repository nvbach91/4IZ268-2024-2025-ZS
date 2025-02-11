$(document).ready(() => {

    /** název knihovny v local Storage */
    const libraryName = "MyLexicon";

    /** DOM element */
    const searchedWord = $("#searchedWord");
    const wordInformation = $("#wordInformation");
    const searchForWord = $("#searchForWord");
    const searchHistory = $("#searchHistory");
    const clearHistory = $("#clearHistory");

    const confirmModal = $("#confirmModal");
    const confirmClearButton = $("#confirmClear");

    const modalElement = document.getElementById("confirmModal");
    const modalInstance = new bootstrap.Modal(modalElement);  //new bootstrap.Modal = konstruktor z knihovny Bootstrap 5, který slouží k vytvoření instance modálního dialogu a muzu pouzit pak show a hide



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
        const signal = controller.signal;   //objekt, který je připojen k požadavku a může spustit jeho přerušení

        const timer = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { ...options, signal });
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
    /** Načítání dat z localStorage - naparsovaný JSON*/
    const getFromHistory = (item) => {
        const data = localStorage.getItem(item);
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error(e);
            return null;
        }
    };


    /** Uložení slov a datum do localStorage */
    const saveToHistory = (word) => {
        let history = getFromHistory(libraryName) ?? {};
        const trimmedWord = word.trim().toLowerCase();

        if (!trimmedWord || trimmedWord === "")
            return false;

        const currentDate = new Date().toISOString();
        //console.log(currentDate); 

        history[trimmedWord] = currentDate;
        const date = history[trimmedWord];

        const formatedDate = new Date(date).toLocaleDateString();
        //console.log(formatedDate);

        localStorage.setItem(libraryName, JSON.stringify(history));

        appendToHistory(trimmedWord, formatedDate)
        updateAutocomplete();
    };




    /** Vyhledání konkrétního slova v historii */
    const findInHistory = async (word) => {
        const data = getFromHistory(libraryName);
        if (!data) {
            return null;
        };

        const trimmedWord = word.trim().toLowerCase();

        if (data.hasOwnProperty(trimmedWord)) {
            const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${trimmedWord}`;
            try {
                const resp = await fetchWithTimeout(url);

                if (!resp.ok) {
                    throw new Error("Word not found! Please try a different word.");
                }
                return await resp.json();

            } catch (error) {
                throw error;
            }
        }
        return null;
    };



    /**smazání i s alertem */
    clearHistory.on("click", () => {
        modalInstance.show();
    });

    confirmClearButton.on("click", () => {
        localStorage.removeItem(libraryName);

        wordInformation.empty();
        wordInformation.append(`<p class="text-center text-secondary p-5">Nothing here! Search for word.</p>`);

        searchHistory.empty();
        searchHistory.append(`<p class="text-center text-secondary">Search history is empty.</p>`);

        clearHistory.prop("disabled", true);
        searchedWord.val("");
        updateURL("");
        updateAutocomplete();

        modalInstance.hide();
    });


    confirmModal.on("hidden.bs.modal", () => {
        modalInstance.hide();
    });



    /** Přidání slova do historie */
    const appendToHistory = (word, date) => {
        const data = getFromHistory(libraryName);
        const historyListItem = $(`
                <div class="clickable-card d-flex justify-content-between align-items-center p-2 border rounded-3  mb-2">
                    <span class="word flex-grow-1 text-start">${word}</span>
                    <span class="date text-secondary ms-2">${date}</span>
                    <button type="button" class="btn btn-danger deleteBtn ms-3">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            `);


        historyListItem.find(".deleteBtn").on("click", (e) => {
            e.stopPropagation();

            const data = getFromHistory(libraryName);

            if (data && data[word]) {
                delete data[word];
                localStorage.setItem(libraryName, JSON.stringify(data));
                historyListItem.remove();

                if (Object.keys(data).length === 0) {
                    clearHistory.trigger("click");
                }
            }
        });


        historyListItem.on("click", () => {
            useFromHistory(word);
        });

        if (searchHistory.children().length === 1 && Object.keys(data).length === 1)
            searchHistory.empty();

        searchHistory.prepend(historyListItem);
        clearHistory.prop("disabled", false);
    };





    /** Zobrazení historie + sort */
    const displayWordHistory = (sort = false) => {
        const historyList = getFromHistory(libraryName);
        searchHistory.empty();

        if (historyList) {
            let words = Object.keys(historyList);

            //const names = ["Jan", "Adam", "Petr"];
            //names.sort((a, b) => a.localeCompare(b));
            //console.log(names);   ["Adam", "Jan", "Petr"]

            if (sort === "asc") {
                words.sort((a, b) => a.localeCompare(b)); // A-Z

            } else if (sort === "desc") {
                words.sort((a, b) => b.localeCompare(a)); // Z-A
            }

            const fragment = $(document.createDocumentFragment());

            words.forEach(word => {
                const date = historyList[word];
                const formatedDate = new Date(date).toLocaleDateString();

                const historyListItem = $(`
                        <div class="clickable-card d-flex justify-content-between align-items-center p-2 border rounded-3  mb-2">
                            <span class="word flex-grow-1 text-start">${word}</span>
                            <span class="date text-secondary ms-2">${formatedDate}</span>
                            <button type="button" class="btn btn-danger deleteBtn ms-3">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </div>
                `);


                historyListItem.find(".deleteBtn").on("click", (e) => {
                    e.stopPropagation();

                    const data = getFromHistory(libraryName);

                    if (data && data[word]) {
                        delete data[word];
                        localStorage.setItem(libraryName, JSON.stringify(data));
                        historyListItem.remove();

                        if (Object.keys(data).length === 0) {
                            clearHistory.trigger("click");
                        }
                    }
                });


                historyListItem.on("click", () => {
                    useFromHistory(word);
                });
                fragment.append(historyListItem);
            });
            searchHistory.append(fragment);

        } else {
            searchHistory.append(`<p class="text-center text-secondary">Search history is empty.</p>`);
        }
    };
    displayWordHistory();



    const sortHistory = $("#sortHistory");

    let currentSort = "none";
    sortHistory.on("click", function () {

        if (currentSort === "none") {  //1. klik - zmeni seznam na a-z
            currentSort = "asc";
            sortHistory.text("Sort Z-A");
            displayWordHistory("asc");

        } else if (currentSort === "asc") {
            currentSort = "desc";
            sortHistory.text("Sort A-Z");
            displayWordHistory("desc");

        } else if (currentSort === "desc") {
            currentSort = "asc";
            sortHistory.text("Sort Z-A");
            displayWordHistory("asc");
        }
    });




    const useFromHistory = async (word) => {
        searchedWord.val(word);
        try {
            const data = await findInHistory(word);
            displayData(data);
            updateURL(word);
        } catch (error) {
            showError(error.message);
        }
    };



    // Práce s DOM
    /** Zobrazení nalezených dat o slově */
    const displayData = (data) => {
        wordInformation.empty();
        const fragment = $(document.createDocumentFragment());

        if (data && data.length > 0) {
            data.forEach((wordData) => {
                const card = $("<div>", { class: "wordCard card mb-3 shadow-sm" });
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


                            if (definition.synonyms && definition.synonyms.length > 0) {
                                let synonymList = $("<ul>", { class: "list-group list-group-flush mb-2" });
                                definition.synonyms.forEach((synonym) => {
                                    const synButton = $(`<button type="button" class="synBtn btn btn-link">${synonym}</button>`);
                                    synButton.on("click", function () {
                                        searchedWord.val(synonym);
                                        performSearch(synonym);
                                    });
                                    synonymList.append($('<li class="list-group-item fs-6 text-body-secondary"></li>').append(synButton));
                                });

                                definitionList.append(`<li class="list-group-item fs-6 text-body-secondary ">Synonyms:</li>`);
                                definitionList.append(synonymList);
                            }

                            if (definition.synonyms && definition.synonyms.length > 0) {
                                let antonymList = $("<ul>", { class: "list-group list-group-flush mb-2" });
                                definition.antonyms.forEach((antonym) => {
                                    const anButton = $(`<button type="button" class="synBtn btn btn-link">${antonym}</button>`);
                                    anButton.on("click", function () {
                                        searchedWord.val(antonym);
                                        performSearch(antonym);
                                    });
                                    antonymList.append($('<li class="list-group-item fs-6 text-body-secondary"></li>').append(anButton));
                                });

                                definitionList.append(`<li class="list-group-item fs-6 text-body-secondary ">Antonyms:</li>`);
                                definitionList.append(antonymList);
                            }

                            cardBody.append(definitionList);
                        })
                    })

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

        try {

            let data = await findInHistory(validWord);

            if (!data) {
                const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${validWord}`;
                const searchResult = await fetchWithTimeout(url);

                if (!searchResult.ok) {
                    throw new Error("Word not found! Please try a different word.");
                }

                data = await searchResult.json();
                saveToHistory(validWord);
                //appendToHistory(validWord);
            }

            if (data) {
                displayData(data);
            };

        } catch (error) {
            showError(error.message || "An unexpected error occurred.");
            return;

        } finally {
            hideSpinner();
        }
    };



    // historie back and forward v prohlížeči
    /** Aktualizace URL */
    const updateURL = (word) => {
        const currentWord = new URLSearchParams(window.location.search).get("word"); //Získá hodnotu parametru word z URL - to co tsm je teď
        if (currentWord === word) {
            return;
        }

        if (word) {
            newURL = `${window.location.pathname}?word=${encodeURIComponent(word)}`;  ///např. search?word=test
        } else {
            newURL = window.location.pathname; //pokud word není zadané .. např. search/
        };

        history.pushState({ word }, "", newURL);  //pushne novou položku do historie prohlížeče
        window.scrollTo(0, 0);
    };

    const getWordFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("word");
    };

    window.addEventListener("popstate", (event) => {         //"popstate": událost, když uživatel použije tlačítko "Zpět" nebo "Vpřed" v prohlížeči
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