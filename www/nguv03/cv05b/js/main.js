// jendoradkovy komentar
/**
 * viceradkovy komentar
 * a
 * v
 * c
 * d
 */

// data types
// primitive
const text = 'Hello class';
// const notherText = "";
// numbers
const year = 2024;
const price = 5000;
const height = 185;
const PI = 3.14;
const phi = 1.61803399;
// boleans
const isOpen = true;
const isClosed = false;
// undefined;
const nothing = undefined;
// null
const nothingness = null;
// objects
const person = {
    name: 'David',
    birth: 2000,
};
// arrays
const fruits = [
    'Ananas', // index: 0
    'Banana', // index: 1
    'Orange', // index: 2
    'Apple',  // index: 3
];            // length = 4

console.log(fruits);
console.log(person);

// camelCase
const myBestFriendEver = {};
// PascalCase
// class Friend {};
// some_variable

const add = (a, b) => {
    const result = a + b;
    return result;
};
const addResult = add(1, 2);
console.log(addResult);
console.log(add(1, 2));
console.log(add(10, 20));

// operator nasobeni je *
// implementujte funkci ktera dokaze vynasobit
// 3 cisla do sebe a vratit vysledek
// implementovanou funkci otestujte zavolanim
// na nekolika prikladech
const multiply3 = (a, b, c) => {
    return a * b * c;
};
console.log(multiply3(4, 5, 6));
console.log(multiply3(7, 8, 9));

// object values
const book = {
    title: 'Harry Potter and the Goblet of Fire',
    publishYear: 1995,
    price: 200,
    currency: 'CZK',
    inStock: true,
};

console.log(typeof book.title, book.title);
console.log(typeof book.publishYear, book.publishYear);
console.log(typeof book.inStock, book.inStock);

const countries = [
    'Czech Republic',
    'United Kindoms',
    'Italy',
    'Hungary',
    'France',
    'Poland',
];

console.log(countries[0]);
console.log(countries[1]);
console.log(countries[2]);
console.log(countries[3]);
console.log(countries[4]);
console.log(countries.length);

// for loop
for (let i = 0; i < countries.length; i += 1) {
    console.log(countries[i]);
}

// forEach
countries.forEach((country) => {
    console.log(country);
});

for (const key in book) {
    console.log(key, book[key]);
}

// operators
// arithmetics +, -, *, /, **, %, ...
// comparison ===, >, <, >=, <=, !==,
// && AND
// || OR
// ! negation
// ++, --

const x = 12;
// x = 123; // cannot re-assign

let c = 200;
c = 210; // can re-assign
c = 220; // can re-assign

// conditionals
const isGraduated = true;
if (isGraduated) {
    console.log('Congratulations!');
} else {
    console.log('Keep working!');
}


// funkce ktera vypise zpravu s vasimi udaji
// jmeno a vek
// Ahoj, ja jsem ... a je mi ... let!
const sayHello = (name, age) => {
    // zretezeni textu/stringu pomoci operatoru +
    // const sentence = 'Ahoj, ja jsem ' + name + ' a je mi ' + age + ' let!';
    // interpolace, resp. dosazovani hodnot do sablony;
    const template = `Ahoj, ja jsem ${name} a je mi ${age} let!`;
    console.log(template);
    return template;
};
sayHello('Anicka', 20);
sayHello('David', 24);
sayHello('Filip', 26);

const headingElement = document.querySelector('h1');
headingElement.textContent = sayHello('Ondrej', 25);

