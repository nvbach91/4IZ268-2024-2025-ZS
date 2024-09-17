const pokemonForm = document.querySelector('#pokemon-form');
const addButton = document.querySelector('#add-button');
const pokemonInput = document.querySelector('#pokemon-name');
const pokemonList = document.querySelector('#pokemon-list');
const selectedPokemon = document.querySelector('#selected-pokemon');

const fetchPokemonStats = function (pokemonName, statsContainer, loader) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + pokemonName.toLowerCase() + '/');
  xhr.addEventListener('load', function () {
    const data = JSON.parse(xhr.responseText);
    //console.log(data);
    const id = document.createElement('p');
    id.innerHTML = 'ID: <strong>' + data.id + '</strong>';
    const height = document.createElement('p');
    height.innerHTML = 'Height: <strong>' + data.height + '</strong>';
    const weight = document.createElement('p');
    weight.innerHTML = 'Height: <strong>' + data.weight + '</strong>';
    const type = document.createElement('p');
    const pokemonTypes = data.types.map(function (type) {
      return type.type.name;
    }).join(', ')
    type.innerHTML = 'Type(s): <strong>' + pokemonTypes + '</strong>';
    
    statsContainer.appendChild(id);
    statsContainer.appendChild(type);
    statsContainer.appendChild(height);
    statsContainer.appendChild(weight);

    statsContainer.removeChild(loader);
  });
  xhr.addEventListener('error', function (e) {
    console.error('XHR error', e);
  });
  xhr.send();
};

const createNewPokemon = function(name) {
  const pokemon = document.createElement('li');
  pokemon.classList.add('pokemon');
  
  const pokemonImage = document.createElement('div');
  pokemonImage.classList.add('pokemon-image');
  pokemonImage.style.backgroundImage = 'url(https://img.pokemondb.net/artwork/' + name.toLowerCase() + '.jpg)'

  const loader = document.createElement('div');
  loader.classList.add('loader');

  const pokemonStats = document.createElement('div');
  pokemonStats.classList.add('pokemon-stats');
  pokemonStats.appendChild(loader);
  fetchPokemonStats(name, pokemonStats, loader);

  const pokemonRow1 = document.createElement('div');
  pokemonRow1.classList.add('pokemon-row');
  const pokemonRow2 = document.createElement('div');
  pokemonRow2.classList.add('pokemon-row');

  const pokemonName = document.createElement('div');
  pokemonName.classList.add('pokemon-name');
  pokemonName.innerText = name;
  pokemonName.addEventListener('click', function() {
    const existingPokemons = document.querySelectorAll('.pokemon-name');
    existingPokemons.forEach(function(existingPokemon) {
      existingPokemon.classList.remove('selected');
    });
    this.classList.toggle('selected');
    selectedPokemon.innerText = name + ', I choose you! :)';
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('pokemon-delete');
  deleteButton.innerText = 'Bye';
  deleteButton.addEventListener('click', function() {
    this.parentNode.parentNode.parentNode.removeChild(pokemon);
    selectedPokemon.innerText = 'Bye bye, ' + name + ' :\'(';
  });

  pokemonRow1.appendChild(pokemonStats);
  pokemonRow1.appendChild(pokemonImage);
  pokemonRow2.appendChild(pokemonName);
  pokemonRow2.appendChild(deleteButton);
  pokemon.appendChild(pokemonRow1);
  pokemon.appendChild(pokemonRow2);

  return pokemon;
};

const addPokemon = function(newPokemonName) {
  // checking if the input is empty
  if (!newPokemonName) {
    alert('Please enter a pokemon name');
    return false;
  }

  // checking if the pokemon is already in the list
  const existingPokemonNames = document.querySelectorAll('.pokemon-name');
  for (let i = 0; i < existingPokemonNames.length; i++) {
    const existingPokemonName = existingPokemonNames[i].innerText;
    if (newPokemonName.toLowerCase() === existingPokemonName.toLowerCase()) {
      alert('Pokemon ' + newPokemonName + ' already exists!');
      return false;
    }
  }

  // create the pokemon item
  const newPokemon = createNewPokemon(newPokemonName);

  // append it to the list
  pokemonList.appendChild(newPokemon);

  // reset the input
  pokemonInput.value = '';
};

pokemonForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const newPokemonName = pokemonInput.value;
  addPokemon(newPokemonName);
});

addPokemon('Pikachu');
addPokemon('Charmander');
addPokemon('Bulbasaur');
addPokemon('Squirtle');

navigator.geolocation.getCurrentPosition(function(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log(position, latitude, longitude);
});