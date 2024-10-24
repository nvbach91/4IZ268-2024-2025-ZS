console.log('Ahoj světe');

// Helper function to display results on the page
const displayResult = (message) => {
    const resultsDiv = document.querySelector('#results');
    resultsDiv.innerText = message;
};

/**
 * 1) Pepe's age.
 */
const displayPepeAge = () => {
    const pepeBirthYear = 1990;
    const currentYear = new Date().getFullYear();
    const pepeAge = currentYear - pepeBirthYear;
    displayResult(`Pepe is ${pepeAge} years old.`);
};

/**
 * 2) WTF (wow, that's fun).
 */
const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;
const fahrenheitToCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;

const displayTemperatureConversion = (temperature, scale) => {
    if (scale === 'C') {
        const fahrenheit = celsiusToFahrenheit(temperature);
        displayResult(`${temperature}°C = ${fahrenheit.toFixed(2)}°F`);
    } else if (scale === 'F') {
        const celsius = fahrenheitToCelsius(temperature);
        displayResult(`${temperature}°F = ${celsius.toFixed(2)}°C`);
    }
};

/**
 * 3) Functions for previous tasks.
 */
// Buttons are created dynamically for tasks.
const tasksDiv = document.querySelector('#tasks');

const createButton = (id, text, callback) => {
    const button = document.createElement('button');
    button.innerText = text;
    button.setAttribute('id', id);
    button.addEventListener('click', callback);
    tasksDiv.appendChild(button);
};

// Button for task 1 (Pepe's age)
createButton('task-1', "Uloha 1 (Pepe's age)", displayPepeAge);

// Button for task 2 (Celsius to Fahrenheit)
createButton('task-2', "Uloha 2 (Celsius to Fahrenheit)", () => displayTemperatureConversion(20, 'C'));

// Button for task 2 (Fahrenheit to Celsius)
createButton('task-3', "Uloha 2 (Fahrenheit to Celsius)", () => displayTemperatureConversion(68, 'F'));

/**
 * 4) %CENSORED% - Percentage calculation.
 */
const calculatePercentage = (a, b) => {
    if (b === 0) {
        displayResult("Division by zero is not allowed.");
        return;
    }
    const percentage = (a / b) * 100;
    displayResult(`${a} is ${percentage.toFixed(2)}% of ${b}`);
};

createButton('task-4', "Uloha 4 (%CENSORED%)", () => calculatePercentage(21, 42));

/**
 * 5) Kdo s koho - Greater number.
 */
const findGreaterNumber = (a, b) => {
    if (a > b) {
        displayResult(`${a} is greater than ${b}`);
    } else if (a < b) {
        displayResult(`${b} is greater than ${a}`);
    } else {
        displayResult(`${a} and ${b} are equal`);
    }
};

createButton('task-5', "Uloha 5 (Kdo s koho)", () => findGreaterNumber(10, 20));

/**
 * 6) I can clearly see the pattern - Multiples of 13.
 */
const printMultiplesOf13 = () => {
    let result = "";
    for (let i = 0; i <= 730; i += 13) {
        result += i + " ";
    }
    displayResult(result);
};

createButton('task-6', "Uloha 6 (Multiples of 13)", printMultiplesOf13);

/**
 * 7) Circle area.
 */
const calculateCircleArea = (radius) => {
    const area = Math.PI * Math.pow(radius, 2);
    displayResult(`The area of a circle with radius ${radius} is ${area.toFixed(2)}`);
};

createButton('task-7', "Uloha 7 (Circle Area)", () => calculateCircleArea(10));

/**
 * 8) Cone volume.
 */
const calculateConeVolume = (radius, height) => {
    const volume = (1 / 3) * Math.PI * Math.pow(radius, 2) * height;
    displayResult(`The volume of a cone with radius ${radius} and height ${height} is ${volume.toFixed(2)}`);
};

createButton('task-8', "Uloha 8 (Cone Volume)", () => calculateConeVolume(5, 10));

/**
 * 9) Triangle validity.
 */
const isTriangleValid = (a, b, c) => {
    const isValid = a + b > c && a + c > b && b + c > a;
    displayResult(isValid ? "Valid triangle" : "Invalid triangle");
    return isValid;
};

createButton('task-9', "Uloha 9 (Triangle Validity)", () => isTriangleValid(3, 4, 5));

/**
 * 10) Heron's formula for triangle area.
 */
const calculateTriangleArea = (a, b, c) => {
    if (!isTriangleValid(a, b, c)) {
        displayResult("Invalid triangle dimensions.");
        return;
    }
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    displayResult(`The area of the triangle is ${area.toFixed(2)}`);
};

createButton('task-10', "Uloha 10 (Triangle Area)", () => calculateTriangleArea(3, 4, 5));
