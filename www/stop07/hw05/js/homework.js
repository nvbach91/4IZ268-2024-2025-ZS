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

    const birthYear = 1990;
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    console.log(`Pepe is ${age} years old.`);



/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */

const celsius = 20;
const fahrenheitFromCelsius = ((celsius*9)/5)+32
console.log(`${celsius}°C = ${fahrenheitFromCelsius}°F`);

const fahrenheit = 68;
const celsiusFromFahrenheit = ((fahrenheit-32)*5)/9;
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


const calculateAge = (birthYear) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    console.log(`Pepe is ${age} years old.`);
};


const convertTemperature = (value, scale) => {
    if (scale === 'C') {
        const fahrenheit = ((value * 9) / 5) + 32;
        console.log(`${value}°C = ${fahrenheit}°F`);
    } else if (scale === 'F') {
        const celsius = ((value - 32) * 5) / 9;
        console.log(`${value}°F = ${celsius}°C`);
    } else {
        console.error('Invalid scale! Use "C" for Celsius or "F" for Fahrenheit.');
    }
};


const buttonAge = document.createElement('button');
buttonAge.innerText = 'Uloha 1 (Pepe\'s age)';
buttonAge.setAttribute('id', 'task-1');
buttonAge.addEventListener('click', () => calculateAge(1990)); 

const buttonCtoF = document.createElement('button');
buttonCtoF.innerText = 'Uloha 2 (C° to F°)';
buttonCtoF.setAttribute('id', 'task-2');
buttonCtoF.addEventListener('click', () => {
    convertTemperature(20, 'C');  
});


const buttonFtoC = document.createElement('button');
buttonFtoC.innerText = 'Uloha 3 (F° to C°)';
buttonFtoC.setAttribute('id', 'task-3');
buttonFtoC.addEventListener('click', () => {
    convertTemperature(68, 'F');  
});


const tasksContainer = document.querySelector('#tasks');
tasksContainer.appendChild(buttonAge);
tasksContainer.appendChild(buttonCtoF);
tasksContainer.appendChild(buttonFtoC);



/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */

const calculatePercentage = (num1, num2) => {
    const resultContainer = document.querySelector('#results');

    if (num2 === 0) {
        resultContainer.innerText = 'Division by zero is not allowed!';
        return;
    }

    const percentage = ((num1 / num2) * 100).toFixed(2); 
    resultContainer.innerText = `${num1} je ${percentage}% z ${num2}.`;
};


const buttonPercentage = document.createElement('button');
buttonPercentage.innerText = 'Uloha 4 (%CENSORED%)';
buttonPercentage.setAttribute('id', 'task-4');
buttonPercentage.addEventListener('click', () => calculatePercentage(21, 42)); 


const taskContainer = document.querySelector('#tasks');
tasksContainer.appendChild(buttonPercentage);





/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */

const compareNumbers = (num1, num2) => {
    const resultContainer = document.querySelector('#results'); 

    if (num1 > num2) {
        resultContainer.innerText = `${num1} je větší než ${num2}.`;
    } else if (num1 < num2) {
        resultContainer.innerText = `${num1} je menší než ${num2}.`;
    } else {
        resultContainer.innerText = `${num1} a ${num2} se rovnají.`;
    }
};

const createComparisonButton = (num1, num2) => {
    const button = document.createElement('button');
    button.innerText = `Uloha 5 (Kdo s koho ${num1} a ${num2})`;
    button.addEventListener('click', () => compareNumbers(num1, num2)); 

    const tasksContainer = document.querySelector('#tasks'); 
    tasksContainer.appendChild(button);
};

createComparisonButton(5, 16);  
createComparisonButton(3.14, 3.14);  
createComparisonButton(1/3, 0.333); 
createComparisonButton(-10, -5);  
createComparisonButton(10, -5);  






/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */

const printMultiplesOf13 = () => {
    const resultContainer = document.querySelector('#results');
    resultContainer.innerText = ''; 

    let multiples = []; 

    for (let i = 0; i <= 730; i += 13) {
        multiples.push(i); 
    }

    resultContainer.innerText = multiples.join(', ');
};


const createMultiplesButton = () => {
    const button = document.createElement('button');
    button.innerText = 'Ukol 6 (I can cleary see the pattern.)';
    button.addEventListener('click', printMultiplesOf13);

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.appendChild(button);
};

createMultiplesButton();


/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */

const calculateCircleArea = (radius) => {
    const area = Math.PI * Math.pow(radius, 2);
    const resultContainer = document.querySelector('#results');
    resultContainer.innerText = `Obsah kružnice s poloměrem ${radius} je ${area.toFixed(2)}.`; 
};


const createAreaButton = () => {
    const button = document.createElement('button');
    button.innerText = 'Ukol 7 (Around and about)';
    button.addEventListener('click', () => calculateCircleArea(8)); 

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.appendChild(button);
};

createAreaButton();


/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */


const calculateConeVolume = (radius, height) => {
    const volume = (1 / 3) * Math.PI * Math.pow(radius, 2) * height; 
    const resultContainer = document.querySelector('#results');
    resultContainer.innerText = `Objem kuželu s poloměrem ${radius} a výškou ${height} je ${volume.toFixed(2)}.`;
};


const createVolumeButton = () => {
    const button = document.createElement('button');
    button.innerText = 'Ukol 8 (Another dimension)';
    button.addEventListener('click', () => calculateConeVolume(4, 8)); 

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.appendChild(button);
};

createVolumeButton();


/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */

const isTriangle = (a, b, c) => {
    const resultContainer = document.querySelector('#results');
    resultContainer.innerText = `Délky stran: a = ${a}, b = ${b}, c = ${c}. `;

    const canFormTriangle = (a + b > c) && (a + c > b) && (b + c > a);

    if (canFormTriangle) {
        resultContainer.innerText += " Tyto délky mohou tvořit trojúhelník.";
    } else {
        resultContainer.innerText += " Tyto délky nemohou tvořit trojúhelník.";
    }

    return canFormTriangle;
};

const createTriangleButton = () => {
    const button = document.createElement('button');
    button.innerText = 'Ukol 9 (Zda lze vytvořit trojúhelník)';
    button.addEventListener('click', () => isTriangle(8, 4, 2));

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.appendChild(button);
};

createTriangleButton();




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

// Funkce pro rozhodnutí, zda lze vytvořit trojúhelník (z úlohy č. 9)

const calculateTriangleArea = (a, b, c) => {
    const resultContainer = document.querySelector('#results');

    if (!isTriangle(a, b, c)) {
        resultContainer.innerText += " Tyto délky netvoří trojúhelník.";
        return;
    }

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    resultContainer.innerText += ` Obsah trojúhelníka s délkami stran a = ${a}, b = ${b}, c = ${c} je ${area.toFixed(2)}.`;
};

const createTriangleAreaButton = () => {
    const button = document.createElement('button');
    button.innerText = 'Ukol 10 (Heroic performance)';
    button.addEventListener('click', () => calculateTriangleArea(3, 4, 5));

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.appendChild(button);
};

createTriangleAreaButton();
