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
const pepesAge = 1974;
const currentYear = new Date().getFullYear();
console.log(`Pepa má ${currentYear - pepesAge} let`);




/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheit, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const valueCelsius = 20;
const valueFahrenheit = 68;
const celsiusToFahrenheit = (((valueCelsius * 9) / 5) + 32);
const fahrenheitToCelsius = (((valueFahrenheit - 32) * 5) / 9);
console.log(`${valueCelsius}°C = ${celsiusToFahrenheit}°F`);
console.log(`${valueFahrenheit}°F = ${fahrenheitToCelsius}°C`);




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
    const currentYear = new Date().getFullYear();
    return console.log(`Pepa má ${currentYear - birthYear} let`);
};
getAge(2007);
getAge(2001);
getAge(1997);

const convertCelsiusToFahrenheit = (valueCelsius) => {
    const celsiusToFahrenheit = (((valueCelsius * 9) / 5) + 32);
    return console.log(`${valueCelsius}°C = ${celsiusToFahrenheit}°F`);
};
convertCelsiusToFahrenheit(30);
convertCelsiusToFahrenheit(45);
convertCelsiusToFahrenheit(60);

const convertFahrenheitToCelsius = (valueFahrenheit) => {
    const fahrenheitToCelsius = (((valueFahrenheit - 32) * 5) / 9);
    return console.log(`${valueFahrenheit}°F = ${fahrenheitToCelsius}°C`);
};
convertFahrenheitToCelsius(86);
convertFahrenheitToCelsius(113);
convertFahrenheitToCelsius(140);

const tasks = document.querySelector('#tasks');


const buttonPepesAge = document.createElement('button');
buttonPepesAge.innerText = "Uloha 1 (Pepe's age)";
buttonPepesAge.setAttribute('id', 'task-1');
buttonPepesAge.addEventListener('click', () => {
    getAge(2000);
});

tasks.appendChild(buttonPepesAge);

const buttonWtf = document.createElement('button');
buttonWtf.innerText = "Uloha 2 (WTF (wow, that's fun))";
buttonWtf.setAttribute('id', 'task-2');
buttonWtf.addEventListener('click', () => {
    convertCelsiusToFahrenheit(20); 
    convertFahrenheitToCelsius(68);
});

tasks.appendChild(buttonWtf);




/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here
const resultsElement = document.querySelector('#results');
const percentageRatio = (a, b) => {
    if (b === 0) {
        return 'Nelze dělit nulou.';
    }
    return `${a} je ${((a / b) * 100).toFixed(2)}% z ${b}`;
};
const buttonCensored = document.createElement('button');
buttonCensored.innerText = 'Uloha 4 (%CENSORED%)'
buttonCensored.setAttribute('id', 'task-4');
buttonCensored.addEventListener('click', () => {
    resultsElement.textContent = percentageRatio(21, 66);
});

tasks.appendChild(buttonCensored);




/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here
const whoIsGreater = (a, b) => {
    if (a > b) {
        return `${a} je větší než ${b}`;
    } else if (a < b) {
        return `${b} je větší než ${a}`;
    } else {
        return `${a} a ${b} se rovnají`;
    }
};

const wholeNumber1 = 8;
const wholeNumber2 = 8;
const decimalNumber1 = 43.44;
const decimalNumber2 = -2.232;
const fraction1 = 2/5;
const fraction2 = 5/2;

const buttonWhoIsGreaterWhole = document.createElement('button');
buttonWhoIsGreaterWhole.innerText = 'Uloha 5 (Kdo s koho, celá čísla)'
buttonWhoIsGreaterWhole.setAttribute('id', 'task-5');
buttonWhoIsGreaterWhole.addEventListener('click', () => {
    resultsElement.textContent = whoIsGreater(wholeNumber1, wholeNumber2);
});
tasks.appendChild(buttonWhoIsGreaterWhole);

const buttonWhoIsGreaterDecimal = document.createElement('button');
buttonWhoIsGreaterDecimal.innerText = 'Uloha 5 (Kdo s koho, desetinná čísla)'
buttonWhoIsGreaterDecimal.setAttribute('id', 'task-5');
buttonWhoIsGreaterDecimal.addEventListener('click', () => {
    resultsElement.textContent = whoIsGreater(decimalNumber1, decimalNumber2);
});
tasks.appendChild(buttonWhoIsGreaterDecimal);

const buttonWhoIsGreaterFraction = document.createElement('button');
buttonWhoIsGreaterFraction.innerText = 'Uloha 5 (Kdo s koho, zlomky)'
buttonWhoIsGreaterFraction.setAttribute('id', 'task-5');
buttonWhoIsGreaterFraction.addEventListener('click', () => {
    resultsElement.textContent = whoIsGreater(fraction1, fraction2);
});
tasks.appendChild(buttonWhoIsGreaterFraction);




/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const thirteens = () => {
    const listOfNumbers = [];
    for (let i = 0; i <= 730; i += 13) {
        listOfNumbers.push(i);
    }
    return listOfNumbers;
};

const buttonThirteens = document.createElement('button');
buttonThirteens.innerText = 'Uloha 6 (I can clearly see the pattern)'
buttonThirteens.setAttribute('id', 'task-6');
buttonThirteens.addEventListener('click', () => {
    resultsElement.textContent = thirteens();
});
tasks.appendChild(buttonThirteens);




/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const circleArea = (r) => {
    if (r < 0) {
        return 'Poloměr nemůže být záporný';
    }
    return `Obsah kruhu je ${(Math.PI*r*r).toFixed(2)}`;
};
const radius = 6;

const buttonCircleArea = document.createElement('button');
buttonCircleArea.innerText = 'Uloha 7 (Around and about)'
buttonCircleArea.setAttribute('id', 'task-7');
buttonCircleArea.addEventListener('click', () => {
    resultsElement.textContent = circleArea(radius);
});
tasks.appendChild(buttonCircleArea);




/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const coneVolume = (r, v) => {
    if (r < 0) {
        return 'Poloměr nemůže být záporný';
    } else if (v < 0) {
        return 'Výska nemůže být záporná'
    }
    return `Objem kuželu je ${((1/3)*Math.PI*r*r*v).toFixed(2)}`;
};
const coneRadius = 6;
const coneHeight = 20;

const buttonConeVolume = document.createElement('button');
buttonConeVolume.innerText = 'Uloha 8 (Another dimension)'
buttonConeVolume.setAttribute('id', 'task-8');
buttonConeVolume.addEventListener('click', () => {
    resultsElement.textContent = coneVolume(coneRadius, coneHeight);
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
const isItTriangle = (a, b, c) => {
    if (a + b > c && a + c > b && b + c > a) {
        return true;
    } else {
        return false;
    }
};

const a = 7;
const b = 8;
const c = 9;

const buttonIsItTriangle = document.createElement('button');
buttonIsItTriangle.innerText = 'Uloha 9 (Not sure if triangle)'
buttonIsItTriangle.setAttribute('id', 'task-9');
buttonIsItTriangle.addEventListener('click', () => {
    if (isItTriangle(a, b, c)) {
        resultsElement.textContent = `Ano, strany ${a}, ${b} a ${c} tvoří trojúhelník`;
    } else {
        resultsElement.textContent = `Ze stran ${a}, ${b} a ${c} nelze sestrojit trojúhelník`;
    }
    
});
tasks.appendChild(buttonIsItTriangle);




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
const triangleArea = (a, b, c) => {
    if(isItTriangle(a, b, c)) {
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return resultsElement.textContent = `Obsah trojúhelníku je ${(area).toFixed(2)}`;
    } else if (!isItTriangle(a, b, c)) {
        return resultsElement.textContent = `Ze stran ${a}, ${b} a ${c} nelze sestrojit trojúhelník`;
    }
}

const buttonTriangleArea = document.createElement('button');
buttonTriangleArea.innerText = 'Uloha 10 (Heroic performance)'
buttonTriangleArea.setAttribute('id', 'task-10');
buttonTriangleArea.addEventListener('click', () => {
    triangleArea(a, b, c);    
});
tasks.appendChild(buttonTriangleArea);

