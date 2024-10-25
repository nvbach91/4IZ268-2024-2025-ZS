/*
const headingElement = document.querySelector('h1');
console.log(headingElement);

const listElements = document.querySelectorAll('li');
console.log(listElements);

listElements.forEach((listElement, index) => {
    listElement.textContent = index;
    // if (index === 0) {
    //     listElement.classList.add('selected');
    // }
    listElement.addEventListener('click', () => {
        if (listElement.classList.contains('selected')) {
            listElement.classList.remove('selected');
        } else {
            listElement.classList.add('selected');
        }
    });
});
*/

const form = document.querySelector('#form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const label = formData.get('label');
    const title = formData.get('title');
    // console.log(label, title);
    // const data = Object.fromEntries(formData);
    // console.log(data);
    // console.log(data.label);
    // console.log(data.title);
    const listItem = document.createElement('li');
    listItem.textContent = `${label}, ${title}`;
    list.append(listItem);
});

// kde ho zobrazit
const list = document.querySelector('#list');
const addButton = document.querySelector('#add-button');
addButton.addEventListener('click', () => {
    // vytvorit
    const listItem = document.createElement('li');
    listItem.textContent = 'New element';
    // vlozit/insert/pridat na to urcene misto
    list.append(listItem);
});








/*
const value = 'Barrack Obama';
console.log(value.length);

if (value.length === 13) {
    console.log('The string length is 13');
}

console.log(value.indexOf('a'));
console.log(value.lastIndexOf('a'));

console.log(value.slice(3, 7));
console.log(value.slice(3));
console.log(value.slice(-3));

const newValue = value.replace('rack', 'rock');
console.log(newValue);
const newValue2 = value.replace(/a/g, 'X');
console.log(newValue2);

const lowerCaseValue = value.toLowerCase();
const upperCaseValue = value.toUpperCase();
console.log(lowerCaseValue, upperCaseValue);

const words = value.split(' ');
console.log(words);

const text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
console.log(text.split(' '));

const someValue = '  this is a value from the  user   ';
console.log(someValue.trim());

console.log(value);

const characterCode = 'a'.charCodeAt(0);
console.log(characterCode);
const character = String.fromCharCode(characterCode + 10);
console.log(character);


*/

const calculatorForm = document.querySelector('#calculator-form');
const resultContainer = document.querySelector('#calculation-result');
calculatorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(calculatorForm);
    const { operand1, operand2 } = Object.fromEntries(formData);
    const result = Number(operand1) + Number(operand2);
    resultContainer.textContent = `Result is: ${result}`;
});




const pokemonForm = document.querySelector('#pokemon-form');
const pokemonsContainer = document.querySelector('#pokemons');
pokemonForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(pokemonForm);
    // console.log(Object.fromEntries(formData));
    const pokemonName = Object.fromEntries(formData)['pokemonName'];
    // console.log(pokemonName);
    const imageUrl = `https://img.pokemondb.net/artwork/avif/${pokemonName}.avif`;
    const image = document.createElement('img');
    image.src = imageUrl;
    pokemonsContainer.append(image);
});

