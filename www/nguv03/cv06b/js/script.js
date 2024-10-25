const headingElement = document.querySelector('h1');
console.log(headingElement);

const listElements = document.querySelectorAll('li');
// console.log(listElements);
listElements.forEach((listElement) => {
    listElement.textContent = 'New list item';
    listElement.addEventListener('click', () => {
        if (listElement.classList.contains('selected')) {
            listElement.classList.remove('selected');
        } else {
            listElement.classList.add('selected');
        }
    });
});


const addItemButton = document.querySelector('#add-item');
const itemList = document.querySelector('#items');
addItemButton.addEventListener('click', () => {
    const newItem = document.createElement('li');
    newItem.textContent = 'New item';
    itemList.append(newItem);
});


const loginForm = document.querySelector('#login-form');
const usersContainer = document.querySelector('#users');
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);
    // console.log(data);
    const userElement = document.createElement('div');
    userElement.textContent = `${data.email}, ${data.password}`;
    usersContainer.append(userElement);
});



const calculatorForm = document.querySelector('#calculator-form');
const calculatorResultContainer = document.querySelector('#calculator-result');
calculatorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(calculatorForm);
    const { operand1, operand2 } = Object.fromEntries(formData);
    const result = Number(operand1) + Number(operand2);
    calculatorResultContainer.textContent = `Result is ${result}`;
});


const pokemonForm = document.querySelector('#pokemon-form');
const pokemonsContainer = document.querySelector('#pokemons');
pokemonForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(pokemonForm);
    const { pokemonName } = Object.fromEntries(formData);
    // console.log(pokemonName);
    const imageUrl = `https://img.pokemondb.net/artwork/large/${pokemonName}.jpg`;
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = pokemonName;
    image.width = 100;
    pokemonsContainer.append(image);
    image.addEventListener('click', () => {
        image.remove();
    });
});

// vytvorte strukturu elementu pouze pomoci JS
// <main>
//   <section>
//     <article>
//       <h3></h3>
//       <p></p>
//     </article>
//   </section>
// </main>
const mainElement = document.createElement('main');
const sectionElement = document.createElement('section');
const articleElement = document.createElement('article');
const heading3Element = document.createElement('h3');
const paragraphElement = document.createElement('p');
articleElement.append(heading3Element);
articleElement.append(paragraphElement);
sectionElement.append(articleElement);
mainElement.append(sectionElement);
console.log(mainElement);





/*
// index   0123456789012
const value = 'Barrack Obama';
console.log(value.length);

console.log(value.indexOf('r'));
console.log(value.lastIndexOf('r'));

// slice
const part = value.slice(3, 7);
console.log(part);
console.log(value.slice(3));
console.log(value.slice(-3));

// string tranformation
const replacedValue = value.replace('rack', 'rock');
console.log(replacedValue);
const regularExpressionReplacedValue = value.replace(/a/g, 'X');
console.log(regularExpressionReplacedValue);

console.log(value.toUpperCase());
console.log(value.toLowerCase());

const words = value.split(' ');
console.log(words);

const sentence = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry';
console.log(sentence.split(' ').reverse().join(' '));

const whiteSpaceValue = ' this is some wierd value   ';
console.log(whiteSpaceValue.trim());

const charCode = 'a'.charCodeAt(0);
console.log(charCode);
const char = String.fromCharCode(charCode + 1);
console.log(char);

const mySentence = 'pikachu bulbasaur charmander';
const pokemons = mySentence.split(' ');
console.log(pokemons);
console.log(pokemons.reverse());
console.log(pokemons.join(' '));

// non destructive methods = original value stays the same
console.log(value);

*/