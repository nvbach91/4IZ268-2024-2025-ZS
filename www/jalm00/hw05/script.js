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
console.log('Ahoj Svete')

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here
const pepaAge = 32;
console.log(`Pepa is ${pepaAge} old`)




/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const celsius = 25;
const fahrenheiht = 50;

const celsiusToFahrenheiht = celsius*9/5+32;
const frahrenheihtToCelsius = fahrenheiht-32*5/9;

console.log(`${celsius}°C = ${celsiusToFahrenheiht}°F`);
console.log(`${fahrenheiht}°F = ${frahrenheihtToCelsius}°C`);



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

const getAge = (birthYear) => {
    return new Date().getFullYear() - birthYear;
};
console.log(getAge(2000));
console.log(getAge(2009));

const getCelsiusToFahranheiht = (celsius) => {
    return celsius*9/5+32;
};
console.log(getCelsiusToFahranheiht(0));
console.log(getCelsiusToFahranheiht(-20));

const getFahrenheihtToCelsius = (fahrenheiht) => {
    return (fahrenheiht-32)*5/9;
}
console.log(getFahrenheihtToCelsius(70));
console.log(getFahrenheihtToCelsius(100));

// mezera 

const tasks = document.querySelector('#tasks');
const results = document.querySelector('#results');

const buttonGetAge = document.createElement('button');
buttonGetAge.innerText = "Úloha 1 (Pepe's age)";
buttonGetAge.setAttribute('id', 'task-1');
tasks.appendChild(buttonGetAge);

buttonGetAge.addEventListener('click', () => {
    results.innerText = `Řešení 1. úlohy: ${getAge(1950)}`;
});

const buttonGetCelsiusToFahranheiht = document.createElement('button');
buttonGetCelsiusToFahranheiht.innerText = 'Úloha 2 (Celcius to Fahrenheiht)';
buttonGetCelsiusToFahranheiht.setAttribute('id', 'task-2');
tasks.appendChild(buttonGetCelsiusToFahranheiht);

buttonGetCelsiusToFahranheiht.addEventListener('click', () => {
    results.innerText = `Řešení 2. úlohy: ${getCelsiusToFahranheiht(15)}`;
});

const buttonGetFahrenheihtToCelsius = document.createElement('button');
buttonGetFahrenheihtToCelsius.innerText = 'Úloha 3 (Fahrenheiht to Celcius)';
buttonGetFahrenheihtToCelsius.setAttribute('id', 'task-3');
tasks.appendChild(buttonGetFahrenheihtToCelsius);

buttonGetFahrenheihtToCelsius.addEventListener('click', () => {
    results.innerText = `Řešení 3. úlohy: ${getFahrenheihtToCelsius(80)}`
})
 

// mezera


/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const getPercentage = (number1, number2) => {
    if (number2 === 0) {
        return 'Timto cislem neni dělit!';
    }
    return `Řešení 4. úlohy: ${number2} je ${(number2/number1*100).toFixed(1)}% z ${number1}`;
}

const buttonGetQuotient = document.createElement('button');
buttonGetQuotient.innerText = 'Úloha 4 (Podíl čísla)';
buttonGetQuotient.setAttribute('id', 'task-4');
tasks.appendChild(buttonGetQuotient);

buttonGetQuotient.addEventListener('click', () => {
    results.innerText = getPercentage(27,16);
})



/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here

const compareNumbers = (a, b) => {
    let result;
    if (a > b) {
        result = `${a} is greater than ${b}`;
    } else if (a < b) {
        result = `${b} is greater than ${a}`;
    } else {
        result = `${a} and ${b} are equal`;
    }
    document.getElementById('results').innerText = result;
};

const buttonCompare = document.createElement('button');
buttonCompare.innerText = 'Compare Numbers';
buttonCompare.addEventListener('click', () => compareNumbers(10, 20));
document.getElementById('tasks').appendChild(buttonCompare);

/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const printMultiplesOf13 = () => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerText = '';
    for (let i = 0; i <= 730; i += 13) {
        resultsDiv.innerText += `${i}, `;
    }
};

const buttonMultiples = document.createElement('button');
buttonMultiples.innerText = 'Multiples of 13';
buttonMultiples.addEventListener('click', printMultiplesOf13);
document.getElementById('tasks').appendChild(buttonMultiples);



/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

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
// Solution here

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
// Solution here

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

