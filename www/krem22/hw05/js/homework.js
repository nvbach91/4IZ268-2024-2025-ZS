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


// console.log("hello world!")

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here
const pepeBirthYear = 2002;
const todaysYear = new Date().getFullYear();
const pepeAge = todaysYear - pepeBirthYear;

console.log('Pepe is ' + pepeAge + ' years old!');
/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const celsius = 20;
const fahrenheiht = 68;

const calcFahrenheiht = celsius * 9 / 5 + 32;
const calcCelsius = (fahrenheiht - 32) * 5 / 9;
// console.log(calcFahrenheiht);
// console.log(calcCelsius);

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
const calcAge = (BirthYear) => {
    const todaysYear = new Date().getFullYear();
    const pepeAge = todaysYear - BirthYear;
    console.log('Pepe is ' + pepeAge + ' years old!');
}

const CtoF = (Celsius) => {
    const Fahrenheit = (Celsius * 9) / 5 + 32;
    console.log(Fahrenheit);
}

const buttonAge = document.createElement('button');
const buttonCtoF = document.createElement('button');

buttonAge.innerText = "Task 01 Pepe's age button";
buttonCtoF.innerText = "Task 02 convert temperature button";

buttonAge.setAttribute('id', 'task-01');
buttonCtoF.setAttribute('id', 'task-02');

buttonAge.addEventListener('click', () => {
    calcAge(2023);
});
buttonCtoF.addEventListener('click', () => {
    CtoF(30);
});

const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonAge);
tasks.appendChild(buttonCtoF);
/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here
function getQuotient(a, b) {
    if (b == 0) {
        return 'You cant divide by zero!!!'
    }
    else {
        const divide = a / b;
        const result = divide.toFixed(2) * 100;
        return `${a} je ${result}% z ${b}`;
    }
}

const buttonQuotient = document.createElement('button');
buttonQuotient.textContent = 'Task 04 get quotient'
buttonQuotient.addEventListener('click', () => {
    divResult.textContent = getQuotient(10, 8);
});

const divResult = document.createElement('p');
divResult.setAttribute('id', 'division-result');

tasks.appendChild(buttonQuotient);
const results = document.querySelector('#results')
results.appendChild(divResult);
/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here
function compare(x, y) {
    if (x == y) {
        return `${x} je rovno ${y}`;
    }
    else if (x > y) {
        return `${x} je vetsi nez ${y}`;
    }
    else if (y > x) {
        return `${x} je mensi nez ${y}`;
    } else {
        return 'chyba';
    }
}

const buttonCompare1 = document.createElement('button');
buttonCompare1.textContent = 'Task 05 greater than';
buttonCompare1.addEventListener('click', () => {
    compareResult.textContent = compare(5, 4);
});

const buttonCompare2 = document.createElement('button');
buttonCompare2.textContent = 'Task 05 equal';
buttonCompare2.addEventListener('click', () => {
    compareResult.textContent = compare(8, 8);
});

const buttonCompare3 = document.createElement('button');
buttonCompare3.textContent = 'Task 05 smaller than';
buttonCompare3.addEventListener('click', () => {
    compareResult.textContent = compare(2, 10);
});

const compareResult = document.createElement('p');
compareResult.setAttribute('id', 'compare-result');

tasks.appendChild(buttonCompare1);
tasks.appendChild(buttonCompare2);
tasks.appendChild(buttonCompare3);
results.appendChild(compareResult);
/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
function multiplyThirteen() {
    let multiples = [];
    for (let i = 13; i < 750; i += 13) {
        multiples.push(i);
    }
    return multiples;
}

const buttonMultiplyThirteen = document.createElement('button');
buttonMultiplyThirteen.textContent = 'Task 06 multiply 13 till 750';
buttonMultiplyThirteen.addEventListener('click', () => {
    thirteenResult.textContent = multiplyThirteen();
});

const thirteenResult = document.createElement('p');
thirteenResult.setAttribute('id', 'thirteen-result');

tasks.appendChild(buttonMultiplyThirteen);
results.appendChild(thirteenResult);
/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
function getCircleArea(radius) {
    return Math.PI * radius * radius;
};

const buttonGetCircleArea = document.createElement('button');
buttonGetCircleArea.textContent = 'Task 7 circle area with radius 2';
const resultGetAreaOfCircle = document.createElement('p');

buttonGetCircleArea.addEventListener('click', () => {
    const radius = 2;
    const result = getCircleArea(radius);
    resultGetAreaOfCircle.textContent = `Area of circle with radius ${radius} is ${result.toFixed(2)}`;
});

tasks.appendChild(buttonGetCircleArea);
results.appendChild(resultGetAreaOfCircle);
/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
function getConeVolume(radius, height) {
    return (1/3) * Math.PI * radius * radius * height;
}

const buttonGetConeVolume = document.createElement('button');
buttonGetConeVolume.textContent = 'Task 08 cone volume (radius 3, height 5)';
const coneVolumeResult = document.createElement('p');

buttonGetConeVolume.addEventListener('click', () => {
    const radius = 3;
    const height = 5;
    const volume = getConeVolume(radius, height);
    coneVolumeResult.textContent = `Volume of cone with radius ${radius} and height ${height} is ${volume.toFixed(2)}`;
});

tasks.appendChild(buttonGetConeVolume);
results.appendChild(coneVolumeResult);




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
    if (a + b > c && a + c > b && b + c > a) {
        return true;
    } else {
        return false;
    }
}

const buttonIsTriangle = document.createElement('button');
buttonIsTriangle.textContent = 'Task 9 check if triangle (3, 4, 5)';
const triangleResult = document.createElement('p');

buttonIsTriangle.addEventListener('click', () => {
    const a = 3;
    const b = 4;
    const c = 5;
    const result = isTriangle(a, b, c) ? 'Ano, je to trojúhelník' : 'Ne, není to trojúhelník.';
    triangleResult.textContent = `Pro strany ${a}, ${b} a ${c}: ${result}`;
});

tasks.appendChild(buttonIsTriangle);
results.appendChild(triangleResult);





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
function getTriangleArea(a, b, c) {
    if (!isTriangle(a, b, c)) {
        return 'Není trojúhelník.';
    }
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

const buttonGetTriangleArea = document.createElement('button');
buttonGetTriangleArea.textContent = 'Task 10 Heron formula (3, 4, 5)';
const triangleAreaResult = document.createElement('p');

buttonGetTriangleArea.addEventListener('click', () => {
    const a = 3;
    const b = 4;
    const c = 5;
    const area = getTriangleArea(a, b, c);
    triangleAreaResult.textContent = `Plocha trojúhelníku se stranami ${a}, ${b} a ${c} je ${area.toFixed(2)}`;
});

tasks.appendChild(buttonGetTriangleArea);
results.appendChild(triangleAreaResult);





