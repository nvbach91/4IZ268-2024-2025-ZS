
const pokemonForm = document.querySelector('#pokemon-form');
pokemonForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(pokemonForm);
    const { pokemonName } = Object.fromEntries(formData);
    // pokemons url https://pokeapi.co/api/v2/pokemon/__POKEMON_NAME__
    // hodnota z inputu ve formulari
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const fetchResponse = fetch(pokemonUrl);
    fetchResponse.then((resp) => {
        return resp.json();
    }).then((data) => {
        console.log(data);
        const pokemonElement = createPokemonElement(data);
        appContainer.append(pokemonElement);
    });

});

const appContainer = document.querySelector('#app');

const createPokemonElement = (pokemonData) => {
    const pokemonElement = document.createElement('div');
    const nameElement = document.createElement('div');
    nameElement.textContent = pokemonData.name;
    const typeElement = document.createElement('div');
    typeElement.textContent = pokemonData.types.map((type) => type.type.name).join(', ');
    const abilitesElement = document.createElement('ul');
    pokemonData.abilities.forEach((ability) => {
        const abilityElement = document.createElement('li');
        abilityElement.textContent = `${ability.ability.name}: ${ability.slot}`;
        abilitesElement.append(abilityElement);
    });
    const pokemonImage = document.createElement('img');
    pokemonImage.src = pokemonData.sprites.other['official-artwork'].front_default;
    pokemonImage.alt = pokemonData.name;
    pokemonImage.width = 100;

    pokemonElement.append(
        nameElement,
        typeElement,
        abilitesElement,
        pokemonImage,
    );
    return pokemonElement;
};
