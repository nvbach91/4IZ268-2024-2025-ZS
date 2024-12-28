const cardInput = $("#card-request");
const searchContainer = $("#search-container");
const searchButton = $("#search-button");
const decksButton = $("#decks-button");
const displayContainer = $("#display-container");
const searchedCard = $("#searched-card");
const workSpace = $(".work-space");

var decks = JSON.parse(localStorage.getItem('decks')) || [];
var nextDeck = parseInt(localStorage.getItem('next')) || 1;
var cardData = JSON.parse(localStorage.getItem('cardData')) || {};
var searchStatus = null;

const createSpinner = () => {
    const $spinner = $('<div></div>').addClass('spinner');
    $('body').append($spinner);
    return $spinner;
};

const removeSpinner = () => {
    $('.spinner').remove();
};

const updateDeck = () => {
    if (searchStatus === 's') {
        return;
    } else {
        displayDeck(searchStatus);
    }
};


searchContainer.on('click', '#delete-button', (e) => {
    e.preventDefault();
    const deckId = $(e.target).data('id');
    const deck = decks[deckId];
    deck.content.forEach((cardId) => {
        removeCard(cardId, deck.name);
    });
    decks.splice(deckId, 1);
    localStorage.setItem('decks', JSON.stringify(decks));
    displayDecks();
});

searchContainer.on('click', '.selected-card', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('id');
    displayCard(cardId, cardData);
});

displayContainer.on('click', '#yes-remove', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('card-id');
    const deckId = $(e.target).data('deck-id');
    removeCard(cardId, deckId);
    $('#deck-status').text('Card removed from deck');
    $('#yes-no').empty();
});

displayContainer.on('click', '#no-remove', (e) => {
    e.preventDefault();
    $('#deck-status').text('Card left in deck');
    $('#yes-no').empty();
});

const removeCard = (cardId, deckId) => {
    var deck = decks.find(deck => deck.name === deckId);
    deck.content = deck.content.filter(card => card !== cardId);
    localStorage.setItem('decks', JSON.stringify(decks));
    var inOtherDecks = false;
    decks.forEach((deck) => {
        if (deck.content.includes(cardId)) {
            inOtherDecks = true;
            return;
        }
    });
    if (!inOtherDecks) {
        delete cardData[cardId];
        localStorage.setItem('cardData', JSON.stringify(cardData));
        displayContainer.empty();
    }
    updateDeck();
};

displayContainer.on('click', '.deck-adding', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('id');
    const deckId = $(e.target).text();
    const deck = decks.find(deck => deck.name === deckId);
    if (deck.content.includes(cardId)) {
        $('#deck-status').text('Card already in deck. Do you want to remove card?');
        $('#yes-no').empty().append(`
        <button id="yes-remove" data-card-id="${cardId}" data-deck-id="${deckId}">Yes</button>
        <button id="no-remove">No</button>`);
    } else {
        deck.content.push(cardId);
        cardData[cardId] = cardStorage[cardId];
        localStorage.setItem('decks', JSON.stringify(decks));
        localStorage.setItem('cardData', JSON.stringify(cardData));
        $('#deck-status').text('Card added to deck.');
        updateDeck();
    }
});

displayContainer.on('click', '#add-to-deck', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('id');
    var html = `<p id="deck-status">Select a deck to add the card.</p><div id="yes-no"></div>`;
    decks.forEach((deck) => {
        html += `<button class="deck-adding default-button" data-id="${cardId}">${deck.name}</button>`;
    });
    $('#deck-manipulation').empty().append(html);
});


searchContainer.on('click', '.deck-display', (e) => {
    e.preventDefault();
    const deckId = $(e.target).data('id');
    displayDeck(deckId);
});

const displayDeck = (deckId) => {
    searchStatus = deckId;
    var html = `<button id="delete-button" data-id="${deckId}">Delete deck</button>
                    <p>This deck contains ${decks[deckId].content.length} cards</p>`;
    decks[deckId].content.forEach((id) => {
        card = cardData[id];
        html += `<div><button class="selected-card default-button" data-id="${card.id}">${card.name}</button></div>`;

    });
    searchContainer.empty().append(html);

};


searchContainer.on('click', '#new-deck', (e) => {
    e.preventDefault();
    decks.push({ name: `Deck ${nextDeck}`, content: [] });
    nextDeck += 1;
    localStorage.setItem('decks', JSON.stringify(decks));
    localStorage.setItem('next', nextDeck);
    displayDecks();
});

decksButton.on('click', (e) => {
    e.preventDefault();
    displayDecks();
});

const displayDecks = () => {
    searchStatus = 's';
    var html = ``;
    decks.forEach((deck, index) => {
        html += `<button class="deck-display default-button" data-id="${index}"> ${deck.name}</button>`;
    });

    html += `<button id="new-deck" class="default-button">Create new deck</button>`;
    searchContainer.empty().append(html);
};

searchContainer.on('click', '.searched-card', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('id');
    displayCard(cardId, cardStorage);
});

const displayCard = (cardId, source) => {
    const card = source[cardId];
    displayContainer.empty().append(`<h2>${card.name}</h2>
        <img src="${card.imageUrl}" alt="${card.name}">
        <div class="card-info">
            <p>Quote: ${card.flavor}</p>
            <p>Description: ${card.text}</p>
    </div>
    <button id="add-to-deck" class="default-button" data-id="${card.id}">Add to deck</button>
    <div id="deck-manipulation"></div>`);
};


cardInput.on('submit', async (e) => {
    e.preventDefault();
    const cardName = cardInput.find('input').val();
    createSpinner();
    try {
        const data = await fetchCard(cardName);
        removeSpinner();
        displaySearch(data);

    } catch (err) {
        removeSpinner();
        searchContainer.empty().append('<p>Card not found</p>');
    }

});

const fetchCard = async (cardName) => {
    const url = `https://api.magicthegathering.io/v1/cards?name=${cardName}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data.cards;
};

const displaySearch = (cards) => {
    searchStatus = 's';
    cardStorage = {};
    cards.forEach(card => {
        cardStorage[card.id] = card;
    });
    const cards_html = cards.map(card => `<div><button class="searched-card default-button" data-id="${card.id}">${card.name}</button></div>`).join('');

    const html = `<p class="search-info">Number of cards found: ${cards.length}</p><div>${cards_html}</div>`;
    searchContainer.empty().append(html);
};