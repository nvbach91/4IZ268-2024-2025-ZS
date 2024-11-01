const pokemonForm = document.querySelector('#pokemon-form');
pokemonForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(pokemonForm);
    const { pokemonNames } = Object.fromEntries(formData);

    for (const pokemonName of pokemonNames.split(' ')) {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        const response = await fetch(url);
        // console.log(fetchPromise);
        const data = await response.json();
        console.log(data);
        const pokemon = createPokemon(data);
        console.log(pokemon);
        appContainer.append(pokemon);
    }
});

const createPokemon = (pokemonObject) => {
    const pokemonNameElement = document.createElement('div');
    pokemonNameElement.textContent = pokemonObject.name;
    const pokemonAbilitiesList = document.createElement('ul');
    pokemonObject.abilities.forEach((ability) => {
        const abilityElement = document.createElement('li');
        abilityElement.textContent = ability.ability.name;
        pokemonAbilitiesList.append(abilityElement);
    });
    const pokemonTypesElement = document.createElement('div');
    pokemonTypesElement.textContent = pokemonObject.types.map((type) => type.type.name).join(', ');
    const pokemonImage = document.createElement('img');
    pokemonImage.src = pokemonObject.sprites.other['official-artwork'].front_default
    pokemonImage.alt = pokemonObject.name;
    pokemonImage.width = 100;
    const pokemonElement = document.createElement('div');
    pokemonElement.append(
        pokemonNameElement,
        pokemonAbilitiesList,
        pokemonTypesElement,
        pokemonImage,
    );
    return pokemonElement;
};

const appContainer = document.querySelector('#app');

// const pokemonElements = [];
// pokemonObjects.forEach((pokemonObject) => {
//     const pokemon = createPokemon(pokemonObject);
//     pokemonElements.push(pokemon);
// });

// appContainer.append(...pokemonElements);
