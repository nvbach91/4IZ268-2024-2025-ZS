/* HOMEWORK */
/**
 * 0) Pre-preparacion.
 * - Vytvořte HTML stránku s nadpisem h1 "JavaScript is awesome!" 
 * - Na stránce vytvořte místo pro umístění jednotlivých spouštěčů úkolů - tlačítek (tj. div, který má id s hodnotou "tasks" - <div id="tasks"></div>). 
 * - Na stránce vytvořte místo pro výpis výsledků úkolů (div, který má id s hodnotou "result" - <div id="results"></div>).
 * 
 * - Připojte tento homework.js soubor k vytvořené HTML stránce pomocí tagu <script> (viz LAB) a vyzkoušejte
 * console.log('Ahoj světe');
 */

console.log('Ahoj světe');

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here

const birthYear = 1999;
const currentYear = new Date().getFullYear();
const age = currentYear - birthYear;
console.log(`Pepe is ${age} years old.`);




/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const celsius = 20;
const fahrenheitFromCelsius = (celsius * 9) / 5 + 32;
console.log(`${celsius}°C = ${fahrenheitFromCelsius}°F`);

const fahrenheit = 68;
const celsiusFromFahrenheit = ((fahrenheit - 32) * 5) / 9;
console.log(`${fahrenheit}°F = ${celsiusFromFahrenheit}°C`);






/**
 * 3) Funkce function fonction funktio. Vemte předchozí úlohy a udělejte z nich funkce. Tj. vytvoříte funkce, 
 * které přijímají argumenty, a na základě argumentů po zavolání vypíše výsledek na konzoli. 
 * Párkrát zavolejte tyto funkce s různými argumenty. V konzoli také vyzkoušejte, zda fungují vaše funkce. 
 * 
 * Pro testování funkce:
 * - Pouze pomocí JavaScriptu (bez knihoven) vytvořte HTML tlačítko s názvem této úlohy, resp. co funkce dělá, a 
 * id s číslem úlohy <button id="task-1">Uloha 1 (Pepe's age)</button>, umístěte ho na stránku do předem vytvořeného 
 * místa <div id="tasks"></div> a pomocí posluchače události "click" nabindujte implementovanou funkci na toto tlačítko.
 * 
 * Výsledkem má být tlačítko, na které když kliknete, tak se provede to, co je implementováno ve funkci.
 *
 * Příklad vytvoření tlačítka s funkcí:
 * 
 * // deklarace a implementace funkce
 * const sayHello = () => {
 *   console.log('Hello');
 * };
 * 
 * // vytvoření tlačítka
 * const buttonSayHello = document.createElement('button');
 * // nastavení textu tlačítka
 * buttonSayHello.innerText = 'Say Hello';
 * // nastavení atributu id tlačítka
 * buttonSayHello.setAttribute('id', 'task-0');
 * // nabindování funkce na událost click tlačítka
 * buttonSayHello.addEventListener('click', () => {
 *   sayHello();
 * });
 * 
 * // výběr existujícího elementu na stránce s id="tasks"
 * const tasks = document.querySelector('#tasks');
 * // vložení vytvořeného tlačítka do vybraného elementu na stránce
 * tasks.appendChild(buttonSayHello);
 */
// Solution here
const calculatePepeAge = (birthYear) => {
const currentYear = new Date().getFullYear();
const age = currentYear - birthYear;
console.log(`Pepe is ${age} years old.`);
};

const celsiusToFahrenheit = (celsius) => {
    const fahrenheit = (celsius * 9) / 5 + 32;
    console.log(`${celsius}°C = ${fahrenheit}°F`);
};


const fahrenheitToCelsius = (fahrenheit) => {
    const celsius = ((fahrenheit - 32) * 5) / 9;
    console.log(`${fahrenheit}°F = ${celsius}°C`);
};

const buttonPepeAge = document.createElement('button');
buttonPepeAge.innerText = "Uloha 1 (Pepe's age)";
buttonPepeAge.setAttribute('id', 'task-1');
buttonPepeAge.addEventListener('click', () => {
    calculatePepeAge(1999);
});

const buttonCelsiusToFahrenheit = document.createElement('button');
buttonCelsiusToFahrenheit.innerText = "Uloha 2 (Celsius to Fahrenheit)";
buttonCelsiusToFahrenheit.setAttribute('id', 'task-2');
buttonCelsiusToFahrenheit.addEventListener('click', () => {
    celsiusToFahrenheit(20);
});

const buttonFahrenheitToCelsius = document.createElement('button');
buttonFahrenheitToCelsius.innerText = "Uloha 2 (Fahrenheit to Celsius)";
buttonFahrenheitToCelsius.setAttribute('id', 'task-3');
buttonFahrenheitToCelsius.addEventListener('click', () => {
    fahrenheitToCelsius(68);
});

const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonPepeAge);
tasks.appendChild(buttonCelsiusToFahrenheit);
tasks.appendChild(buttonFahrenheitToCelsius);


/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const calculatePercentage = (num1, num2) => {
    if (num2 === 0) {
        console.log('Error: cannot divide by zero.');
        return 'Error: cannot divide by zero.';
    }

    const percentage = (num1 / num2) * 100;
    return `${num1} is ${percentage.toFixed(2)}% of ${num2}`;
};

const buttonCalculatePercentage = document.createElement('button');
buttonCalculatePercentage.innerText = "Uloha 4 (% Calculation)";
buttonCalculatePercentage.setAttribute('id', 'task-4');

buttonCalculatePercentage.addEventListener('click', () => {
    const resultDiv = document.querySelector('#results');
    const result = calculatePercentage(21, 42); 
    resultDiv.innerText = result;
});

tasks.appendChild(buttonCalculatePercentage);



/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here

const compareNumbers = (num1, num2) => {
    if (num1 > num2) {
        return `${num1} is greater than ${num2}`;
    } else if (num1 < num2) {
        return `${num2} is greater than ${num1}`;
    } else {
        return `${num1} and ${num2} are equal.`;
    }
};

const buttonCompareIntegers = document.createElement('button');
buttonCompareIntegers.innerText = "Compare 5 and 3 (Integers)";
buttonCompareIntegers.setAttribute('id', 'task-5');
buttonCompareIntegers.addEventListener('click', () => {
    const resultDiv = document.querySelector('#results');
    const result = compareNumbers(5, 3);
    resultDiv.innerText = result;
});

const buttonCompareDecimals = document.createElement('button');
buttonCompareDecimals.innerText = "Compare 2.5 and 2.5 (Decimals)";
buttonCompareDecimals.setAttribute('id', 'task-6');
buttonCompareDecimals.addEventListener('click', () => {
    const resultDiv = document.querySelector('#results');
    const result = compareNumbers(2.5, 2.5);
    resultDiv.innerText = result;
});

const buttonCompareFractions = document.createElement('button');
buttonCompareFractions.innerText = "Compare 1/2 and 2/3 (Fractions)";
buttonCompareFractions.setAttribute('id', 'task-7');
buttonCompareFractions.addEventListener('click', () => {
    const resultDiv = document.querySelector('#results');
    const result = compareNumbers(1/2, 2/3);
    resultDiv.innerText = result;
});

tasks.appendChild(buttonCompareIntegers);
tasks.appendChild(buttonCompareDecimals);
tasks.appendChild(buttonCompareFractions);


/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const printMultiplesOf13 = () => {
    let result = '';
    for (let i = 0; i <= 730; i += 13) {
        result += i + '\n';
    }
    console.log(result);
    return result;
};

const buttonPrintMultiplesOf13 = document.createElement('button');
buttonPrintMultiplesOf13.innerText = "Uloha 6 (Multiples of 13)";
buttonPrintMultiplesOf13.setAttribute('id', 'task-6');

buttonPrintMultiplesOf13.addEventListener('click', () => {
    const resultDiv = document.querySelector('#results');
    const result = printMultiplesOf13();
    resultDiv.innerText = result;
});

tasks.appendChild(buttonPrintMultiplesOf13);



/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateCircleArea = (radius) => {
    if (radius <= 0) {
        return 'Radius must be greater than zero.';
    }
    const area = Math.PI * Math.pow(radius, 2);
    return `The area of a circle with radius ${radius} is ${area.toFixed(2)}.`;
};

const buttonCircleArea = document.createElement('button');
buttonCircleArea.innerText = "Uloha 7 (Calculate Circle Area)";
buttonCircleArea.setAttribute('id', 'task-7');

buttonCircleArea.addEventListener('click', () => {
    const resultDiv = document.querySelector('#results');
    const result = calculateCircleArea(10);
    resultDiv.innerText = result;
});

tasks.appendChild(buttonCircleArea);



/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateConeVolume = (radius, height) => {
    if (radius <= 0 || height <= 0) {
        return 'Radius and height must be greater than zero.';
    }
    const volume = (1/3) * Math.PI * Math.pow(radius, 2) * height;
    return `The volume of a cone with radius ${radius} and height ${height} is ${volume.toFixed(2)}.`;
};

const buttonConeVolume = document.createElement('button');
buttonConeVolume.innerText = "Uloha 8 (Calculate Cone Volume)";
buttonConeVolume.setAttribute('id', 'task-8');

buttonConeVolume.addEventListener('click', () => {
    const resultDiv = document.querySelector('#results');
    const result = calculateConeVolume(5, 10);
    resultDiv.innerText = result;
});

tasks.appendChild(buttonConeVolume);



/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const isTriangle = (a, b, c) => {
    if (a + b > c && a + c > b && b + c > a) {
        console.log(`The sides ${a}, ${b}, and ${c} form a triangle.`);
        return true;
    } else {
        console.log(`The sides ${a}, ${b}, and ${c} do not form a triangle.`);
        return false;
    }
};

const buttonTriangleCheck = document.createElement('button');
buttonTriangleCheck.innerText = "Uloha 9 (Check Triangle)";
buttonTriangleCheck.setAttribute('id', 'task-9');

buttonTriangleCheck.addEventListener('click', () => {
    const resultDiv = document.querySelector('#results');
    const result = isTriangle(3, 4, 5);
    resultDiv.innerText = result;
});

tasks.appendChild(buttonTriangleCheck);


/**
 * 10) Heroic performance. Vytvořte funkci, která vypočte a vypíše obsah trojúhelníka podle Heronova vzorce, 
 * tj. funkce dostane délky všech 3 stran. Použijte přitom předchozí validaci v úloze č. 9, tj. počítejte pouze, 
 * když to má smysl. Hint: funkce pro odmocninu je Math.sqrt().
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
// - krok 1 - vytvořte funkci
//   - krok 1.1 - pomocí selektoru vyberte container pro výpis výsledků a uložte ho do proměnné
//   - krok 1.2 - zvalidujte vstupní argumenty pomocí funkce z úlohy č. 9
//     - v případě nevalidních hodnot vypište chybovou hlášku na místo pro výpis výsledků a funkci ukončete
//     - v případě validních hodnot pokračujte s výpočtem
//   - krok 1.3 - spočítejte obsah trojúhelníku podle Heronovy vzorce a výsledek uložte do proměnné
//   - krok 1.4 - vypište výsledek na místo pro výpis výsledků
// - krok 2 - vytvořte tlačítko
// - krok 3 - nabindujte na toto tlačítko callback, ve kterém zavoláte implementovanou funkci pro výpočet a výpis výsledků
// - krok 4 - tlačítko umístěte na stránku
// - krok 5 - otestujte řešení klikáním na tlačítko

const calculateTriangleArea = (a, b, c) => {
    const resultDiv = document.querySelector('#results');

    if (!isTriangle(a, b, c)) {
        resultDiv.innerText = `The sides ${a}, ${b}, and ${c} do not form a valid triangle.`;
        return;
    }

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    
    resultDiv.innerText = `The area of the triangle with sides ${a}, ${b}, and ${c} is ${area.toFixed(2)} square units.`;
};

const buttonTriangleArea = document.createElement('button');
buttonTriangleArea.innerText = "Uloha 10 (Calculate Triangle Area)";
buttonTriangleArea.setAttribute('id', 'task-10');

buttonTriangleArea.addEventListener('click', () => {
    calculateTriangleArea(7, 8, 9);
});

tasks.appendChild(buttonTriangleArea);