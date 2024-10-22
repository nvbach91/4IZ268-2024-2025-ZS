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
console.log('Ahoj světe!');

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
const year = new Date().getFullYear();
const pepeBirthYear = 2001;
const pepeAge = year - pepeBirthYear;
console.log(`Pepe is ${pepeAge} years old!`);

/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
const celsius = 20;
const fahrenheit = 68;
const inFahrenheit = ((celsius * 9) / 5) + 32
const inCelsius = ((fahrenheit - 32) * 5) / 9
console.log(`${celsius}°C = ${inFahrenheit}°F`);
console.log(`${fahrenheit}°F = ${inCelsius}°C`);

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
const sayHello = () => {
    console.log('Hello');
};

const buttonSayHello = document.createElement('button');
buttonSayHello.innerText = 'Say Hello';
buttonSayHello.setAttribute('id', 'task-0');
buttonSayHello.addEventListener('click', () => {
    sayHello();
});

const calculatePepeAge = (a, b) => {
    console.log(`Pepe is ${a - b} years old!`);
};

const buttonUloha1 = document.createElement('button');
buttonUloha1.innerText = "Uloha 1 (Pepe's age)";
buttonUloha1.setAttribute('id', 'task-01');
buttonUloha1.addEventListener('click', () => {
    calculatePepeAge(year, pepeBirthYear);
});


const convertTemperature = (celsiusTemp, fahrenTemp) => {
    const inFahrenheit = ((celsiusTemp * 9) / 5) + 32
    const inCelsius = ((fahrenTemp - 32) * 5) / 9
    console.log(`${celsiusTemp}°C = ${inFahrenheit}°F`);
    console.log(`${fahrenTemp}°F = ${inCelsius}°C`);
};

const buttonUloha2 = document.createElement('button');
buttonUloha2.innerText = "Uloha 2 (WTF (wow, that's fun))";
buttonUloha2.setAttribute('id', 'task-02');
buttonUloha2.addEventListener('click', () => {
    convertTemperature(celsius, fahrenheit);
});


const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonSayHello);
tasks.appendChild(document.createElement("br"));
tasks.appendChild(buttonUloha1);
tasks.appendChild(document.createElement("br"));
tasks.appendChild(buttonUloha2);
tasks.appendChild(document.createElement("br"));

/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla.
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2);
 * Pozor na dělení nulou!
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
const calculatePrecentage = (number1, number2) => {
    if (number2 === 0) {
        return 'Dividing by 0 is not possible!';
    } else {
        const precentage = (number1 / number2) * 100
        return `${number1.toFixed(2)} is ${precentage.toFixed(2)}% of ${number2.toFixed(2)}`;
    }
};

const numberFirst = 3.6;
const numberSecond = 41.7;

const resultsElement = document.getElementById('results');
const buttonUloha4 = document.createElement('button');
buttonUloha4.innerText = 'Uloha 4 (%CENSORED%)';
buttonUloha4.setAttribute('id', 'task-04');
buttonUloha4.addEventListener('click', () => {
    resultsElement.textContent = (calculatePrecentage(numberFirst, numberSecond));
});

tasks.appendChild(buttonUloha4);
tasks.appendChild(document.createElement("br"));

/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají.
 *
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
const compareNumbers = (a, b) => {
    if (a > b) {
        return `${a} is greater than ${b}.`;
    } else if (a < b) {
        return `${b} is greater than ${a}.`;
    } else {
        return `${a} and ${b} are equal.`;
    }
};

const wholeNumber1 = 3;
const wholeNumber2 = 3;
const decimalNumber1 = 489.7876;
const decimalNumber2 = 7.35;
const fraction1 = 1 / 3;
const fraction2 = 1 / 4;

const buttonUloha5Whole = document.createElement('button');
buttonUloha5Whole.innerText = 'Uloha 5 (whole numbers, Kdo s koho)';
buttonUloha5Whole.setAttribute('id', 'task-05');
buttonUloha5Whole.addEventListener('click', () => {
    resultsElement.textContent = (compareNumbers(wholeNumber1, wholeNumber2));
});

const buttonUloha5Decimal = document.createElement('button');
buttonUloha5Decimal.innerText = 'Uloha 5 (decimal numbers, Kdo s koho)';
buttonUloha5Decimal.setAttribute('id', 'task-05');
buttonUloha5Decimal.addEventListener('click', () => {
    resultsElement.textContent = (compareNumbers(decimalNumber1, decimalNumber2));
});

const buttonUloha5Fraction = document.createElement('button');
buttonUloha5Fraction.innerText = 'Uloha 5 (fractions, Kdo s koho)';
buttonUloha5Fraction.setAttribute('id', 'task-05');
buttonUloha5Fraction.addEventListener('click', () => {
    resultsElement.textContent = (compareNumbers(fraction1, fraction2));
});

tasks.appendChild(buttonUloha5Whole);
tasks.appendChild(document.createElement("br"));
tasks.appendChild(buttonUloha5Decimal);
tasks.appendChild(document.createElement("br"));
tasks.appendChild(buttonUloha5Fraction);
tasks.appendChild(document.createElement("br"));

/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší
 * nebo rovno 730, včetě nuly. Používejte for cyklus.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
const printMultiplesOf13 = () => {
    for (let i = 0; i <= 730; i += 13) {
        console.log(i);
        resultsElement.innerHTML += i + ' ';
    }
};

const buttonUloha6 = document.createElement('button');
buttonUloha6.innerText = 'Uloha 6 (I can cleary see the pattern)';
buttonUloha6.setAttribute('id', 'task-06');
buttonUloha6.addEventListener('click', () => {
    resultsElement.innerHTML = '';
    printMultiplesOf13();
});

tasks.appendChild(buttonUloha6);
tasks.appendChild(document.createElement("br"));

/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
const calculateCircleArea = (radius) => {
    const pi = 3.14;
    const area = pi * radius ** 2;
    return area;
};

const radiusOfCircle = 5;
const buttonUloha7 = document.createElement('button');
buttonUloha7.innerText = 'Uloha 7 (Around and about)';
buttonUloha7.setAttribute('id', 'task-07');
buttonUloha7.addEventListener('click', () => {
    console.log(calculateCircleArea(radiusOfCircle));
    resultsElement.textContent = calculateCircleArea(radiusOfCircle);
});

tasks.appendChild(buttonUloha7);
tasks.appendChild(document.createElement("br"));

/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
const calculateConeVolume = (radius, height) => {
    const pi = Math.PI;
    return (1 / 3) * pi * radius ** 2 * height;
};

const radiusOfCone = 5;
const heightOfCone = 9;
const buttonUloha8 = document.createElement('button');
buttonUloha8.innerText = 'Uloha 8 (Another dimension)';
buttonUloha8.setAttribute('id', 'task-08');
buttonUloha8.addEventListener('click', () => {
    console.log(calculateConeVolume(radiusOfCone, heightOfCone));
    resultsElement.textContent = calculateConeVolume(radiusOfCone, heightOfCone);
});

tasks.appendChild(buttonUloha8);
tasks.appendChild(document.createElement("br"));

/**
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
const isTriangle = (a, b, c) => {
    if (a + b > c && a + c > b && b + c > a) {
        return true;
    } else {
        return false;
    }
};

const triangleSideOne = 5;
const triangleSideTwo = 8;
const triangleSideThree = 4;
const buttonUloha9 = document.createElement('button');
buttonUloha9.innerText = 'Uloha 9 (Another dimension)';
buttonUloha9.setAttribute('id', 'task-09');
buttonUloha9.addEventListener('click', () => {
    if (isTriangle(triangleSideOne, triangleSideTwo, triangleSideThree)) {
        console.log(`Sides: ${triangleSideOne}, ${triangleSideTwo}, ${triangleSideThree}`);
        console.log('Can form a triangle: Yes');
        resultsElement.textContent = `Sides: ${triangleSideOne}, ${triangleSideTwo}, ${triangleSideThree}. Can form a triangle: Yes`;
    } else {
        console.log(`Sides: ${triangleSideOne}, ${triangleSideTwo}, ${triangleSideThree}`);
        console.log("Can form a triangle: No");
        resultsElement.textContent = `Sides: ${triangleSideOne}, ${triangleSideTwo}, ${triangleSideThree}. Can form a triangle: No`;
    }
});

tasks.appendChild(buttonUloha9);
tasks.appendChild(document.createElement("br"));


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
    const resultElement = document.getElementById('results');
    if (!isTriangle(a, b, c)) {
        resultElement.textContent = 'Invalid input'
        return;
    } else {
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        resultElement.textContent = `Area of the triangle is: ${area}`;
    }
};

const buttonUloha10 = document.createElement('button');
buttonUloha10.innerText = 'Uloha 10 (Heroic performance)';
buttonUloha10.setAttribute('id', 'task-10');
buttonUloha10.addEventListener('click', () => {
    const sideA = 5;
    const sideB = 7;
    const sideC = 9;
    calculateTriangleArea(sideA, sideB, sideC);
});

tasks.appendChild(buttonUloha10);
tasks.appendChild(document.createElement("br"));