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

    const displayResult = (message) => {
        const resultsDiv = document.querySelector('#results');
        resultsDiv.innerText = message;
    };
/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here

const birthYear = 2001;
const currentYear = new Date().getFullYear();
const age = currentYear - birthYear;

console.log('Pepe is ' + age + ' years old.');




/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here

const cels = 20;
const fahr = 68;

const celsToFahr = (cels * 9 / 5 + 32);
const fahrToCels = ((fahr -32) * 5 /9);

console.log(cels + '°C = ' + celsToFahr + '°F');
console.log(fahr + '°F = ' + fahrToCels + '°C');


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

const tasks = document.querySelector('#tasks');
const results = document.querySelector('#results');


function calculateAge (birthYear) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return(`Pepe is ${age} years old.`);
}


const button1 = document.createElement('button');
button1.id = 'task-1';
button1.textContent = 'Uloha 1 (Pepe\'s age)';
tasks.appendChild(button1);
button1.addEventListener('click', () => {
    const result1 =  calculateAge(2004); 
    results.innerHTML = `<p>${result1}</p>`;
});


function celsiusToFahrenheit(celsius) {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return(`${celsius}°C = ${fahrenheit.toFixed(1)}°F`);
}

const button2 = document.createElement('button');
button2.id = 'task-2';
button2.textContent = 'Uloha 2 (Celsius to Fahrenheit)';
tasks.appendChild(button2);
button2.addEventListener('click', () => {
    const result1 =  celsiusToFahrenheit(20); 
    results.innerHTML = `<p>${result1}</p>`;
});


function fahrenheitToCelsius(fahrenheit) {
    const celsius = ((fahrenheit - 32) * 5) / 9;
    return(`${fahrenheit}°F = ${celsius.toFixed(1)}°C`);
}

const button3 = document.createElement('button');
button3.id = 'task-3';
button3.textContent = 'Uloha 3 (Fahrenheit to Celsius)';
tasks.appendChild(button3);
button3.addEventListener('click', () => {
    const result1 =  fahrenheitToCelsius(68); 
    results.innerHTML = `<p>${result1}</p>`;
});


/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here
function calculatePercentage(num1, num2) {
    const percentage = (num1 / num2) * 100;
    return `${num1} je ${percentage.toFixed(2)}% z ${num2}.`;
}

const button4 = document.createElement('button');
button4.id = 'task-4';
button4.textContent = 'Uloha 4 (%CENSORED%)';
tasks.appendChild(button4);
button4.addEventListener('click', () => {
    const result1 =  calculatePercentage(21, 42); 
    results.innerHTML = `<p>${result1}</p>`;
});


/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here

function findGreaterNumber(a, b) {
    if (a > b) {
        return `${a} is greater than ${b}`;
    } else if (a < b) {
        return `${b} is greater than ${a}`;
    } else {
        return `${a} and ${b} are equal`;
    }
};


const button5 = document.createElement('button');
button5.id = 'task-5';
button5.textContent = 'Uloha 5 (Kdo s koho)';
tasks.appendChild(button5);
button5.addEventListener('click', () => {
    const result1 = findGreaterNumber(5, 3);   
    const result2 = findGreaterNumber(2.5, 2.5); 
    const result3 = findGreaterNumber(1/3, 1/2); 
    results.innerHTML = `
    <p>${result1}</p>
    <p>${result2}</p>
    <p>${result3}</p>
`;
});




/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

function multiplesOf13() {
    let result = '';
    for (let i = 0; i <= 730; i += 13) {
        result += `${i}, `;
    }    
    results.innerHTML = `<p>${result}</p>`;
}
const button6 = document.createElement('button');
button6.id = 'task-6';
button6.textContent = 'Uloha 6 (Multiples of 13)';
tasks.appendChild(button6);
button6.addEventListener('click', () => {
    multiplesOf13();
});


/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

function calculateCircleArea(radius) {
    const area = (Math.PI * Math.pow(radius, 2)).toFixed(2);
    results.innerHTML = `<p>The area of the circle with radius ${radius} is ${area}</p>`;
}

const button7 = document.createElement('button');
button7.id = 'task-7';
button7.textContent = 'Uloha 7 (Circle Area)';
tasks.appendChild(button7);
button7.addEventListener('click', () => {
    calculateCircleArea(10);
});


/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

function calculateConeVolume(radius, height) {
    const volume = ((1/3) * Math.PI * Math.pow(radius, 2) * height).toFixed(2);
    results.innerHTML = `<p>The volume of the cone with radius ${radius} and height ${height} is ${volume}</p>`;
}

const button8 = document.createElement('button');
button8.id = 'task-8';
button8.textContent = 'Uloha 8 (Cone Volume)';
tasks.appendChild(button8);
button8.addEventListener('click', () => {
    calculateConeVolume(7, 14); 
});


/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

function isTriangle(a, b, c) {
    const canFormTriangle = (a + b > c) && (a + c > b) && (b + c > a);
    results.innerHTML = `<p>a = ${a}, b = ${b}, c = ${c} - Can form a triangle: ${canFormTriangle ? 'Yes' : 'No'} </p>`;
    return canFormTriangle;
}

const button9 = document.createElement('button');
button9.id = 'task-9';
button9.textContent = 'Uloha 9 (Triangle Check)';
tasks.appendChild(button9);
button9.addEventListener('click', () => {
    isTriangle(3, 5, 7); 
});


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

function calculateTriangleArea(a, b, c) {
    if (isTriangle(a, b, c)) {
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c)).toFixed(2);
        results.innerHTML = `<p>The area of the triangle is: ${area}</p>`;
    } else {
        results.innerHTML = `<p>Cannot form a triangle</p>`;
    }
}

const button10 = document.createElement('button');
button10.id = 'task-10';
button10.textContent = 'Uloha 10 (Heron\'s Formula)';
tasks.appendChild(button10);
button10.addEventListener('click', () => {
    calculateTriangleArea(2, 5, 6);
});







