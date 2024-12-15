//zkontroluje tvar hledaného slova
const wordValidation = (searchedWord) => {
    if (typeof searchedWord !== 'string' || !searchedWord.trim()) {
        return { error: "Invalid input.  Please enter a valid word." };
    } else {
        return { word: searchedWord.trim() };
    }
};

//vyberu form
const searchForWord = $('#searchForWord');


//na submit najdu hodnutu, tu zvaliduji a zjistim historii nebo zavolam na API
searchForWord.on("submit", async (e) => {
    e.preventDefault();

    const wordInformation = $('#wordInformation');
    wordInformation.empty();

    const searchedWord = $('input[name="searchedWord"]').val();

    const validationResult = wordValidation(searchedWord);
    if (validationResult.error) {
        alert(validationResult.error);
        return;
    }

    const word = validationResult.word;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    const wordFromHistory = JSON.parse(localStorage.getItem(`data_${word}`));
    if (wordFromHistory) {
        console.log('Word found in history:', wordFromHistory);
        return;

    } else {

        try {
            const searchResult = await fetch(url);

            if (!searchResult.ok) {
                throw new Error("Word not found! Please try a different word.");
            }

            const data = await searchResult.json();
            console.log(data);
            saveToHistory(word, data);

        } catch (error) {
            console.error("Error: Word not found.", error.message);
            alert(error.message);
        }
    };
});


//uložim do hostorie pokud tam už není
const saveToHistory = (word, data) => {

    const history = JSON.parse(localStorage.getItem('MyLexicon')) || [];

    if (!history.includes(word)) {
        history.push(word);
        localStorage.setItem('MyLexicon', JSON.stringify(history));
    }

    localStorage.setItem(`data_${word}`, JSON.stringify(data));
};

//TODO
//displayWordHistory - zobrazení seznamu hledaných slov v <ul id="searchHistory"></ul> 
//clearHistory - vyčístíme historii hledání (pokud prázdno - zmizne)
//displaydata - zobrazení nalezených dat v <div id="wordInformation">