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

const birthYear = 2000;
const currentYear = new Date().getFullYear();
console.log(`This is Pepe's age: ${currentYear-birthYear} `);




/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here


function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
}

let celsius = 20; 
let fahrenheit = 68;

console.log(`${celsius}°C = ${celsiusToFahrenheit(celsius)}°F`);
console.log(`${fahrenheit}°F = ${fahrenheitToCelsius(fahrenheit).toFixed(1)}°C`);



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

const displayPepesAge = () => {
    const birthYear = 2012;
    const currentYear = new Date().getFullYear();
    const pepeAge = currentYear - birthYear;
    console.log(`Pepe is ${pepeAge} years old.`);
    document.getElementById('results').innerText = `Pepe is ${pepeAge} years old.`;
};


const celsiusToFahrenheit2 = (celsius) => {
    return (celsius * 9) / 5 + 32;
};

const fahrenheitToCelsius2 = (fahrenheit) => {
    return ((fahrenheit - 32) * 5) / 9;
};

const convertTemperature = () => {
    const celsius = 20;
    const fahrenheit = 68;
    const cToF = celsiusToFahrenheit2(celsius);
    const fToC = fahrenheitToCelsius2(fahrenheit).toFixed(1);

    console.log(`${celsius}°C = ${cToF}°F`);
    console.log(`${fahrenheit}°F = ${fToC}°C`);
    document.getElementById('results').innerText = `${celsius}°C = ${cToF}°F\n${fahrenheit}°F = ${fToC}°C`;
};

const createTaskButton = (id, text, fn) => {
    const button = document.createElement('button');
    button.innerText = text;
    button.setAttribute('id', id);
    button.addEventListener('click', fn);
    button.style.display = 'block';
    button.style.margin = '10px 0';
    document.querySelector('#tasks').appendChild(button);
};

// Task 1: Create button for Pepe's age
createTaskButton('task-1', "Uloha 3a: Pepe Silvia", displayPepesAge);

// Task 2: Create button for Temperature Conversion
createTaskButton('task-2', "Uloha 3b: Převod temploty", convertTemperature);






/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here
const division = () => {
    const a =10;
    const b = 20;
    result = (a/b)*100;
    console.log(`The divison is equal to ${result.toFixed(0)} %.`);
    document.getElementById('results').innerText = `The divison is equal to ${result.toFixed(0)} %.`;
};

createTaskButton('task-4', "Uloha 4: Procenta", division);





/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here

const comparison = (a,b) => {
    const resultsDiv = document.getElementById('results');

    if (a > b) {
        resultsDiv.textContent = `Číslo ${a} je větší než ${b}.`;
    } else if (a < b) {
        resultsDiv.textContent = `Číslo ${b} je větší než ${a}.`;
    } else {
        resultsDiv.textContent = `Čísla ${a} a ${b} jsou stejná.`;
    }

}


const createComparisonButtons = () => {
    createTaskButton('task-5a', 'Porovnat 10 a 20', () => comparison(10, 20));
    createTaskButton('task-5b', 'Porovnat 3.14 a 3.14', () => comparison(3.14, 3.14));
    createTaskButton('task-5c', 'Porovnat 1/2 a 0.5', () => comparison(1/2, 0.5));
    createTaskButton('task-5d', 'Porovnat -5 a -10', () => comparison(-5, -10));
    createTaskButton('task-5e', 'Porovnat 7 a 7', () => comparison(7, 7));
}


createComparisonButtons();





/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const pattern = () => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = '';
    for (let i=13; i<=730;i+=13){
        resultsDiv.textContent += i + '\n';
    }
}

createTaskButton('task-6', "Uloha 6: třináctka", pattern);





/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const around = (r) => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = '';
    const area=(r*r)*Math.PI;
    resultsDiv.textContent = `Obsah kruhu s poloměrem ${r} je ${area.toFixed(2)} m².`;
    
}

createTaskButton('task-7', "Úloha 7: Výpočet obsahu kruhu", () => around(10));





/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const volume = (r,h) => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = '';
    const volume = (1/3) * Math.PI * r * r * h;
    resultsDiv.textContent = `Objem kuželu s poloměrem ${r} a výškou ${h} je ${volume.toFixed(2)} m³.`;
    
}

createTaskButton('task-8', "Úloha 8: Výpočet objemu kuželu", () => volume(5, 12));





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
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = '';

    const canFormTriangle = (a + b > c) && (a + c > b) && (b + c > a);

    if (canFormTriangle) {
        resultsDiv.textContent = `Délky stran ${a}, ${b}, ${c} mohou vytvořit trojúhelník.`;
    } else {
        resultsDiv.textContent = `Délky stran ${a}, ${b}, ${c} nemohou vytvořit trojúhelník.`;
    }

    return canFormTriangle;
}

createTaskButton('task-9', "Úloha 9: Trojúhelník nebo ne?", () => isTriangle(3, 4, 9));




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

const isHTriangle = (a, b, c) => {
    return (a + b > c) && (a + c > b) && (b + c > a);
}


const heronsFormula = (a, b, c) => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = ''; 

    if (!isTriangle(a, b, c)) {
        resultsDiv.textContent = `Délky stran ${a}, ${b}, ${c} nemohou vytvořit trojúhelník.`;
        return;
    }

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    resultsDiv.textContent = `Obsah trojúhelníka s délkami stran ${a}, ${b}, ${c} je ${area.toFixed(2)} m².`;
}
createTaskButton('task-10', "Úloha 10: Heronův vzorec", () => heronsFormula(3, 4, 5));