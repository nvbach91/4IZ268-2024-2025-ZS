const apiUrl = 'https://api.magicthegathering.io/v1/cards';
cardInput = document.querySelector("#card-request");
cardImg = document.querySelector('#card-img')


cardInput.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(cardInput);
    const { cardName } = Object.fromEntries(formData);
    const url = `https://api.magicthegathering.io/v1/cards?name=${cardName}`
    const fetchPromise = fetch(url);

    fetchPromise.then((response) => {
        return response.json();
    }).then((data) => {
        const cardsToShow = data.cards.slice(0, 5); 
        cardsToShow.forEach((card) => {
            if (card.imageUrl) { 
                const imgElement = document.createElement('img');
                imgElement.src = card.imageUrl;
                imgElement.alt = card.name;
                imgElement.style.width = '200px';
                imgElement.style.margin = '10px';
                cardImg.appendChild(imgElement);
            }
        });
    })
})
