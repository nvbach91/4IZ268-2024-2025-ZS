/* HOMEWORK */
/**
 * 0) Pre-preparation.
 * - Vytvořte HTML stránku s nadpisem h1 "JavaScript is awesome!" 
 * - Na stránce vytvořte místo pro umístění jednotlivých spouštěčů úkolů - tlačítek (tj. div, který má id s hodnotou "tasks" - <div id="tasks"></div>). 
 * - Na stránce vytvořte místo pro výpis výsledků úkolů (div, který má id s hodnotou "result" - <div id="results"></div>).
 * 
 * - Připojte tento homework.js soubor k vytvořené HTML stránce pomocí tagu <script> (viz LAB) a vyzkoušejte
 * console.log('Ahoj světe');
 */

console.log('Ahoj světe'); // Test for connection


/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
const birthYear = 1990;
const currentYear = new Date().getFullYear();
const pepesAge = currentYear - birthYear;
console.log(`Pepe is ${pepesAge} years old.`);


/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheit, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. 
 */
const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;
const fahrenheitToCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;

const celsius = 20;
const fahrenheit = 68;
console.log(`${celsius}°C = ${celsiusToFahrenheit(celsius)}°F`);
console.log(`${fahrenheit}°F = ${fahrenheitToCelsius(fahrenheit).toFixed(1)}°C`);


/**
 * 3) Funkce function fonction funktio. Vemte předchozí úlohy a udělejte z nich funkce.
 */
const displayPepesAge = () => {
    console.log(`Pepe is ${pepesAge} years old.`);
};

const displayTemperatureConversion = () => {
    console.log(`${celsius}°C = ${celsiusToFahrenheit(celsius)}°F`);
    console.log(`${fahrenheit}°F = ${fahrenheitToCelsius(fahrenheit).toFixed(1)}°C`);
};

// Create buttons for tasks
const buttonPepesAge = document.createElement('button');
buttonPepesAge.innerText = "Uloha 1 (Pepe's age)";
buttonPepesAge.id = 'task-1';
buttonPepesAge.addEventListener('click', displayPepesAge);

const buttonTemperature = document.createElement('button');
buttonTemperature.innerText = "Uloha 2 (Temperature conversion)";
buttonTemperature.id = 'task-2';
buttonTemperature.addEventListener('click', displayTemperatureConversion);

const tasksDiv = document.querySelector('#tasks');
tasksDiv.appendChild(buttonPepesAge);
tasksDiv.appendChild(buttonTemperature);


/**
 * 4) %CENSORED%.
 */
const calculatePercentage = (num1, num2) => {
    if (num2 === 0) {
        return 'Cannot divide by zero';
    }
    const result = ((num1 / num2) * 100).toFixed(2);
    document.querySelector('#results').innerText = `${num1} is ${result}% of ${num2}`;
};

const buttonPercentage = document.createElement('button');
buttonPercentage.innerText = 'Uloha 4 (Calculate percentage)';
buttonPercentage.id = 'task-4';
buttonPercentage.addEventListener('click', () => calculatePercentage(21, 42));

tasksDiv.appendChild(buttonPercentage);


/**
 * 5) Kdo s koho.
 */
const compareNumbers = (num1, num2) => {
    let result;
    if (num1 > num2) {
        result = `${num1} is greater than ${num2}`;
    } else if (num1 < num2) {
        result = `${num1} is less than ${num2}`;
    } else {
        result = `${num1} and ${num2} are equal`;
    }
    document.querySelector('#results').innerText = result;
};

const buttonCompare = document.createElement('button');
buttonCompare.innerText = 'Uloha 5 (Compare numbers)';
buttonCompare.id = 'task-5';
buttonCompare.addEventListener('click', () => compareNumbers(5, 10));

tasksDiv.appendChild(buttonCompare);


/**
 * 6) I can cleary see the pattern.
 */
const printMultiplesOf13 = () => {
    let multiples = [];
    for (let i = 0; i <= 730; i += 13) {
        multiples.push(i);
    }
    document.querySelector('#results').innerText = multiples.join(', ');
};

const buttonMultiples = document.createElement('button');
buttonMultiples.innerText = 'Uloha 6 (Multiples of 13)';
buttonMultiples.id = 'task-6';
buttonMultiples.addEventListener('click', printMultiplesOf13);

tasksDiv.appendChild(buttonMultiples);


/**
 * 7) Around and about.
 */
const calculateCircleArea = (radius) => {
    const area = Math.PI * radius * radius;
    document.querySelector('#results').innerText = `The area of the circle is ${area.toFixed(2)}`;
};

const buttonCircleArea = document.createElement('button');
buttonCircleArea.innerText = 'Uloha 7 (Circle Area)';
buttonCircleArea.id = 'task-7';
buttonCircleArea.addEventListener('click', () => calculateCircleArea(10));

tasksDiv.appendChild(buttonCircleArea);


/**
 * 8) Another dimension.
 */
const calculateConeVolume = (radius, height) => {
    const volume = (1 / 3) * Math.PI * radius * radius * height;
    document.querySelector('#results').innerText = `The volume of the cone is ${volume.toFixed(2)}`;
};

const buttonConeVolume = document.createElement('button');
buttonConeVolume.innerText = 'Uloha 8 (Cone Volume)';
buttonConeVolume.id = 'task-8';
buttonConeVolume.addEventListener('click', () => calculateConeVolume(5, 12));

tasksDiv.appendChild(buttonConeVolume);


/**
 * 9) Not sure if triangle, or just some random values.
 */
const isTriangle = (a, b, c) => {
    if (a + b > c && a + c > b && b + c > a) {
        return true;
    }
    return false;
};

const buttonTriangle = document.createElement('button');
buttonTriangle.innerText = 'Uloha 9 (Triangle check)';
buttonTriangle.id = 'task-9';
buttonTriangle.addEventListener('click', () => {
    const result = isTriangle(3, 4, 5) ? 'Yes, it forms a triangle.' : 'No, it does not form a triangle.';
    document.querySelector('#results').innerText = result;
});

tasksDiv.appendChild(buttonTriangle);


/**
 * 10) Heroic performance.
 */
const calculateTriangleArea = (a, b, c) => {
    if (!isTriangle(a, b, c)) {
        document.querySelector('#results').innerText = 'Invalid triangle dimensions.';
        return;
    }
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    document.querySelector('#results').innerText = `The area of the triangle is ${area.toFixed(2)}`;
};

const buttonTriangleArea = document.createElement('button');
buttonTriangleArea.innerText = 'Uloha 10 (Triangle Area)';
buttonTriangleArea.id = 'task-10';
buttonTriangleArea.addEventListener('click', () => calculateTriangleArea(3, 4, 5));

tasksDiv.appendChild(buttonTriangleArea);
