// definice promenne a inicializace dosazenim hodnoty;
// statement, command, prikaz, ...
// = je assignment operator (dosazeni hodnoty do promenne)
const variableName = 'askjdhalsdhlkaw';


// datove typy
// string
const text = 'Blblabla'; // "blablabla"
// boolean
const isOpen = true;
const isClosed = false;
// numbers
const year = 2024;
const PI = 3.14;
const e = 2.18;
const share = 4.2;
const amount = 963_031_547;
// undefined
undefined;
// null
const nothing = null;
// objects
const person = {
    birth: 2000,
    name: 'Adam',
};
// arrays
const fruits = ['Banana', 'Melon', 'Orange', 'Apple'];
    // index    0         1        2         3

// camelCase
const myBestFriendEver = 'David';

// PascalCase
const TheOneAndOnly = null;




// operatory
const something = 123;
const a = 1;
const b = 2;
const c = a + b;
// + - / *
console.log('The result of adding is', c);

// operator porovavani
const comparison1 = a > b ;
const comparison2 = a < b ;
const comparison3 = a >= b;
const comparison4 = a <= b;
const comparison5 = a === b;
const comparison6 = a === a; // === also checks data type
console.log({
    comparison1,
    comparison2,
    comparison3,
    comparison4,
    comparison5,
    comparison6,
});

// a++;           // constant variable cannot be changed
// const 
let index = 0;
console.log(index); // 0
index++; // increment
console.log(index); // 1
index--; // decrement
console.log(index); // 0


const add = (a, b) => {
    const result = a + b;
    return result;
};
const addResult = add(5, 10);
console.log(addResult);
console.log(add(5, 10));
console.log(add(6, 10));
console.log(add(7, 10));

// funkce pro roznasobeni 3 cisel dohromady
// a vratit vysledek
// + jejim zavolanim otestovat funkci
const powerOf2 = (a) => {
    return a**2;
};
console.log(powerOf2(20));

// funkce ktera vypise smysluplnou oznamovaci vetu
// ahoj, jsem ... a je mi ... let!
const sayHello = (name, age) => {
    // zretezeni textu (lepime text do sebe)
    // const sentence = 'Ahoj, jsem ' + name + ' a je mi ' + age + ' let!';
    // interpolace (dosazovani hodnot do textove sablony)
    const template = `Ahoj, jsem ${name} a je mi ${age} let!`;
    console.log(template);
};

sayHello('David', 20);
sayHello('Anicka', 19);
sayHello('Ondrej', 28);


const book = {
    title: 'Harry Potter and the Order of the Phoenix',
    publishYear: 1999,
    price: 200,
    currency: 'CZK',
};

console.log(book.title);
console.log(book.price);
console.log(book.currency);
console.log(book.publishYear);

const countries = [
    /*0*/ 'Czech Republic',
    /*1*/ 'United Kingdoms',
    /*2*/ 'France',
    /*3*/ 'Italy',
    /*4*/ 'Korea',
];

console.log(countries[0]);
console.log(countries[1]);
console.log(countries[2]);
console.log(countries[3]);
console.log(countries[4]);

// for loop
for (let i = 0; i <= countries.length; i += 1) {
    console.log(countries[i]);
}

// forEach loop
countries.forEach((country) => {
    console.log(country);
});

const isMarried = false;

// conditionals
if (isMarried) {
    console.log('Congratulations!');
} else {
    console.log('Wait for another year!')
}