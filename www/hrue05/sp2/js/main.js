const cardInput = $("#card-request");
const searchContainer = $("#search-container");
const searchButton = $("#search-button");
const decksButton = $("#decks-button");
const displayContainer = $("#display-container");
const searchedCard = $("#searched-card");
const workSpace = $(".work-space");
const deckMenu = $("#deck-menu");

var decks = JSON.parse(localStorage.getItem('decks')) || [];
var nextDeck = parseInt(localStorage.getItem('next')) || 1;
var cardData = JSON.parse(localStorage.getItem('cardData')) || {};
var searchStatus = null;
var currentCard = null;


const createSpinner = () => {
    const $spinner = $('<div></div>').addClass('spinner');
    $('body').append($spinner);
    return $spinner;
};

const removeSpinner = () => {
    $('.spinner').remove();
};

const update = () => {
    localStorage.setItem('decks', JSON.stringify(decks));
    localStorage.setItem('cardData', JSON.stringify(cardData));
    if (searchStatus !== null && searchStatus !== 's') {
        displayDeck(searchStatus);
    }
    displayDecks();
    if (currentCard !== null) {
        displayCard();
    }
};

searchContainer.on('submit', '#deck-rename-form', (e) => {
    e.preventDefault();
    const deckId = $('#deck-rename-form').find('#deck-rename-button').data('id');
    const deck = decks[deckId];
    newDeckName = $('#deck-rename-form').find('input').val();
    deck.name = newDeckName;
    localStorage.setItem('decks', JSON.stringify(decks));
    update();
});

searchContainer.on('click', '#rename-button', (e) => {
    e.preventDefault();
    const deckId = $(e.target).data('id');
    $('#rename-container').empty().append(`<form id="deck-rename-form">
            <input id="deck-name-input" name="newDeckName" type="text" required placeholder="Enter a new deck name">
            <button type="submit" id="deck-rename-button" data-id="${deckId}">Rename</button>
        </form> <button id="cancel-rename" data-id="${deckId}" type="button">Cancel</button>`);
});

searchContainer.on('click', '#yes-delete-deck', (e) => {
    e.preventDefault();
    const deckId = $(e.target).data('id');
    const deck = decks[deckId];
    deck.content.forEach((cardId) => {
        removeCard(cardId, deckId);
    });
    decks.splice(deckId, 1);
    localStorage.setItem('decks', JSON.stringify(decks));
    searchContainer.empty();
    searchStatus = null;
    update();
});


searchContainer.on('click', '#no-delete-deck, #cancel-rename', (e) => {
    e.preventDefault();
    const deckId = $(e.target).data('id');
    displayDeck(deckId);
});

searchContainer.on('click', '#delete-button', (e) => {
    e.preventDefault();
    const deckId = $(e.target).data('id');
    $('#delete-container').empty().append(`<p>Do you really want to delete deck?</p><div class="yes-no"><button id="yes-delete-deck" data-id="${deckId}">Yes</button><button id="no-delete-deck" data-id="${deckId}">No</button></div>`);
});

searchContainer.on('click', '.selected-card', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('id');
    currentCard = cardData[cardId];
    displayCard();
});

displayContainer.on('click', '#yes-remove', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('card-id');
    const deckId = $(e.target).data('deck-id');
    removeCard(cardId, deckId);
    $('#deck-status').text('Card removed from deck');
});

displayContainer.on('click', '#no-remove', (e) => {
    e.preventDefault();
    $('#deck-status').text('Card left in deck');
});

const removeCard = (cardId, deckId) => {
    const deck = decks[deckId];
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
    update();
};

displayContainer.on('click', '.deck-manipulation', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('id');
    const deckName = $(e.target).text();
    const deckId = decks.findIndex(deck => deck.name === deckName);
    const cardStatus = $(e.target).data('status');
    const deck = decks[deckId];
    if (cardStatus === 'remove') {
        $('#deck-status').text('Do you really want to remove card?');
        $('#deck-status').append(`<div class="yes-no">
        <button id="yes-remove" data-card-id="${cardId}" data-deck-id="${deckId}">Yes</button>
        <button id="no-remove">No</button></div>`);
    } else {
        deck.content.push(cardId);
        cardData[cardId] = currentCard;
        localStorage.setItem('decks', JSON.stringify(decks));
        localStorage.setItem('cardData', JSON.stringify(cardData));
        $('#deck-status').text('Card added to deck.');
        update();
    }
});


deckMenu.on('click', '.deck-display', (e) => {
    e.preventDefault();
    const deckId = $(e.target).data('id');
    displayDeck(deckId);
});

const displayDeck = (deckId) => {
    searchStatus = deckId;
    const deck = decks[deckId];
    var html = `<p>${deck.name}</p><p>This deck contains ${deck.content.length} cards</p><div id="delete-container"><button id="delete-button" data-id="${deckId}">Delete deck</button></div>
                <div id="rename-container"><button id="rename-button" class="default-button" data-id="${deckId}">Rename deck</button></div>`;
    deck.content.forEach((id) => {
        const card = cardData[id];
        const index = deck.content.indexOf(id);
        var moveUp = 'enabled';
        var moveDown = 'enabled';
        if (index === 0) {
            moveUp = 'disabled';
        }
        if (index === deck.content.length - 1) {
            moveDown = 'disabled';
        }
        html += `<div id="${card.id}">
                    <button class="selected-card default-button" data-id="${card.id}">${card.name} <img src="${card.imageUrl}"></button>
                    <div class="card-buttons" id="${card.id}-delete">
                        <button class="selected-card-delete" data-id="${card.id}">Remove from deck</button>
                        <button class="move-upwards ${moveUp}" data-id="${card.id}">upwards</button>
                        <button class="move-downwards ${moveDown}" data-id="${card.id}">downwards</button>
                    </div>
                </div>`;
    });
    searchContainer.empty().append(html);
};


searchContainer.on('click', '.move-upwards', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('id');
    const deckId = searchStatus;
    const deck = decks[deckId];
    const index = deck.content.indexOf(cardId);
    if (index !== 0) {
        [deck.content[index], deck.content[index - 1]] = [deck.content[index - 1], deck.content[index]];
        update();
    }
});

searchContainer.on('click', '.move-downwards', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('id');
    const deckId = searchStatus;
    const deck = decks[deckId];
    const index = deck.content.indexOf(cardId);
    if (index !== deck.content.length - 1) {
        [deck.content[index], deck.content[index + 1]] = [deck.content[index + 1], deck.content[index]];
        update();
    }
});

searchContainer.on('click', '.selected-card-delete', (e) => {
    e.preventDefault();
    const deckId = searchStatus;
    const cardId = $(e.target).data('id');
    $(`#${cardId}-delete`).empty().append(`<div class="yes-no remove-card-from-deck">
        <p>Do you really want to remove card?</p>
        <button id="yes-remove" data-card-id="${cardId}" data-deck-id="${deckId}">Yes</button>
        <button id="no-remove">No</button></div>`);
});

searchContainer.on('click', '#yes-remove', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('card-id');
    const deckId = $(e.target).data('deck-id');
    removeCard(cardId, deckId);
});

searchContainer.on('click', '#no-remove', (e) => {
    e.preventDefault();
    update();
});



deckMenu.on('click', '#new-deck', (e) => {
    e.preventDefault();
    decks.push({ name: `Deck ${nextDeck}`, content: [] });
    nextDeck += 1;
    localStorage.setItem('decks', JSON.stringify(decks));
    localStorage.setItem('next', nextDeck);
    update();
});

const displayDecks = () => {
    var html = ``;
    decks.forEach((deck, index) => {
        html += `<button class="deck-display default-button" data-id="${index}"> ${deck.name} / cards: ${deck.content.length} </button>`;
    });

    html += `<button id="new-deck" class="default-button">Create new deck</button>`;
    deckMenu.empty().append(html);
};

searchContainer.on('click', '.searched-card', (e) => {
    e.preventDefault();
    const cardId = $(e.target).data('id');
    currentCard = cardStorage[cardId];
    displayCard();
});


const displayCard = async () => {
    const card = currentCard;
    const cardId = currentCard.id;
    var notInDeck = ``;
    var inDeck = ``;
    decks.forEach(deck => {
        if (deck.content.includes(cardId)) {
            inDeck += `<button class="deck-manipulation default-button" data-status="remove" data-id="${card.id}">${deck.name}</button>`
        } else {
            notInDeck += `<button class="deck-manipulation default-button" data-status="add" data-id="${card.id}">${deck.name}</button>`
        }
    });
    await checkImage(card);
    displayContainer.empty().append(`<h2>${card.name}</h2>
        <img src="${card.imageUrl}" alt="${card.name}">
        <div class="card-info">
            <p>Quote: ${card.flavor}</p>
            <p>Description: ${card.text}</p>
    </div>
    <div id="deck-status">Add or remove from deck</div>
    <p>Add to deck</p><div>${notInDeck}</div>
    <p>Remove from deck</p><div>${inDeck}</div>`);
};

const checkImage = async (card) => {
    try {
        const img = new Image();
        img.src = card.imageUrl;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        
    } catch (err) {
        
        card.imageUrl = 'https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg';

    }
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
    const cards = data.cards;
    return cards;
};


const displaySearch = (cards) => {
    displayContainer.empty();
    searchStatus = 's';
    cardStorage = {};
    cards.forEach(card => {
        cardStorage[card.id] = card;
    });
    const cards_html = cards.map(card => `<div><button class="searched-card default-button" data-id="${card.id}">${card.name}</button></div>`).join('');

    const html = `<p class="search-info">Number of cards found: ${cards.length}</p><div>${cards_html}</div>`;
    searchContainer.empty().append(html);
};

const init = () => {
    displayDecks();
    Object.values(cardData).forEach(card => {
        checkImage(card);
    });
};

init();