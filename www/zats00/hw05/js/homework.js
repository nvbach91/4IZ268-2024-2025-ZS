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
console.log('Ahoj svete!');

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here
const pepesAge = 1998;
const thisYear = new Date().getFullYear();
console.log(`Pepovi je ${thisYear - pepesAge} let`);





/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here

const celsiusValue = 30;
const fahrenheihtValue = 70;

const convertedCelsiusToFahrenheiht = celsiusValue * 9 / 5 + 32;
const convertedFahrenheihtToCelsius = (fahrenheihtValue - 32) * 5 / 9;



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
const pepaAge = (birthYear) => {
    const resultsDiv = document.querySelector('#result');
    const thisYear = new Date().getFullYear();
    const age = thisYear - birthYear;
    const answear = `Ahoj, ja jsem Pepa a je mi ${age} let!`;
    resultsDiv.innerText = answear;
};
pepaAge(2014);

const celsiusToFahrenheit = (celsiusIs) => {
    const resultsDiv = document.querySelector('#result');
    const convertedToFahrenheit = celsiusIs * 9 / 5 + 32;
    resultsDiv.innerText = `${celsiusIs}°C = ${convertedToFahrenheit}°F`;
};
celsiusToFahrenheit(20);

const fahrenheitToCelsius = (fahrIs) => {
    const resultsDiv = document.querySelector('#result');
    const convertedToCelsius = (fahrIs - 32) * 5 / 9;
    resultsDiv.innerText = `${fahrIs}°F = ${convertedToCelsius}°C`;
};
celsiusToFahrenheit(20);
fahrenheitToCelsius(68);
celsiusToFahrenheit(10);
fahrenheitToCelsius(50);


const buttonPepaAge = document.createElement('button');
buttonPepaAge.innerText = 'Pepov vek';
buttonPepaAge.setAttribute('id', 'task-1');
buttonPepaAge.addEventListener('click', () => {
    pepaAge(2020);
});
const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonPepaAge);

const buttonToFahrenheit = document.createElement('button');
buttonToFahrenheit.innerText = '40 C do fahrenheit';
buttonToFahrenheit.setAttribute('id', 'task-2');
buttonToFahrenheit.addEventListener('click', () => {
    celsiusToFahrenheit(40);
});
tasks.appendChild(buttonToFahrenheit);

const buttonToCelsius = document.createElement('button');
buttonToCelsius.innerText = '104 F do celsius';
buttonToCelsius.setAttribute('id', 'task-3');
buttonToCelsius.addEventListener('click', () => {
    fahrenheitToCelsius(104);
});
tasks.appendChild(buttonToCelsius);
/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const dividing = (firstNumber, secondNumber) => {
    const resultsDiv = document.querySelector('#result');
    if (secondNumber === 0) {
        resultsDiv.innerText = 'Nemozes delit nulou!';
    } else {
        const proportion = (firstNumber / secondNumber) * 100;
        proportion.toFixed(2);
        resultsDiv.innerText = `${firstNumber} je ${proportion}% z ${secondNumber}`;
    }
};
const buttonDivision = document.createElement('button');
buttonDivision.innerText = 'division(18,12)';
buttonDivision.setAttribute('id', 'task-4');
buttonDivision.addEventListener('click', () => {
    dividing(18, 12);
});
tasks.appendChild(buttonDivision);

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
    const resultDiv = document.querySelector('#result');
    if (num1 > num2) {
        resultDiv.innerText = `${num1.toFixed(2)} je větší než ${num2.toFixed(2)}.`;
    } else if (num1 < num2) {
        resultDiv.innerText = `${num2.toFixed(2)} je větší než ${num1.toFixed(2)}.`;
    } else {
        resultDiv.innerText = `Čísla ${num1.toFixed(2)} a ${num2.toFixed(2)} se rovnají.`;
    }
};
const buttonComparison = document.createElement('button');
buttonComparison.innerText = 'comparison (18,12)';
buttonComparison.setAttribute('id', 'task-5');
buttonComparison.addEventListener('click', () => {
    compareNumbers(18, 12);
});
tasks.appendChild(buttonComparison);

const buttonComparisonDecimal = document.createElement('button');
buttonComparisonDecimal.innerText = 'comparison (18.8,12.3)';
buttonComparisonDecimal.setAttribute('id', 'task-5');
buttonComparisonDecimal.addEventListener('click', () => {
    compareNumbers(18.8, 12.3);
});
tasks.appendChild(buttonComparisonDecimal);

const buttonComparisonFraction = document.createElement('button');
buttonComparisonFraction.innerText = 'comparison (18/17,1/3)';
buttonComparisonFraction.setAttribute('id', 'task-5');
buttonComparisonFraction.addEventListener('click', () => {
    compareNumbers(18 / 17, 1 / 3);
});
tasks.appendChild(buttonComparisonFraction);


/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const printMultiplesOf13 = () => {
    const resultDiv = document.querySelector('#result');
    resultDiv.innerText = '';
    let output = '';

    for (let i = 0; i <= 730; i += 13) {
        output += i + ' ';
    }

    resultDiv.innerText = output.trim();
};
const button13 = document.createElement('button');
button13.innerText = 'multiples 13';
button13.setAttribute('id', 'task-6');
button13.addEventListener('click', () => {
    printMultiplesOf13();
});
tasks.appendChild(button13);


/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const contentOfCircle = (radius) => {
    const resultDiv = document.querySelector('#result');
    const pi = Math.PI;
    const area = 2 * pi * radius;
    resultDiv.innerText = `Obsah kruznice je ${area.toFixed(2)}`;
};
const buttonCircle = document.createElement('button');
buttonCircle.innerText = 'Obsah kruznice s polomerom 5';
buttonCircle.setAttribute('id', 'task-7');
buttonCircle.addEventListener('click', () => {
    contentOfCircle(5);
});
tasks.appendChild(buttonCircle);



/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateConeVolume = (radius, height) => {
    const resultDiv = document.querySelector('#result');
    const pi = Math.PI;
    const volume = (1 / 3) * pi * Math.pow(radius, 2) * height;
    resultDiv.innerText = `Objem kuzele je ${volume.toFixed(2)}`;
};
const buttonCone = document.createElement('button');
buttonCone.innerText = 'Obsah kuzela s polomerom 5 a vyskou 4';
buttonCone.setAttribute('id', 'task-8');
buttonCone.addEventListener('click', () => {
    calculateConeVolume(5, 4);
});
tasks.appendChild(buttonCone);


/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const canFormTriangle = (a, b, c) => {
    const resultDiv = document.querySelector('#result');
    const isTriangle = (a + b > c) && (a + c > b) && (b + c > a);

    console.log(`Délky stran: a = ${a}, b = ${b}, c = ${c}`);
    console.log(isTriangle ? 'Ano, tyto délky mohou tvořit trojúhelník.' : 'Ne, tyto délky nemohou tvořit trojúhelník.');

    resultDiv.innerText = isTriangle;
    return isTriangle;
};
const buttonTriangle = document.createElement('button');
buttonTriangle.innerText = 'Je to trojuholnik? 3,4,5';
buttonTriangle.setAttribute('id', 'task-9');
buttonTriangle.addEventListener('click', () => {
    canFormTriangle(3, 4, 5);
});
tasks.appendChild(buttonTriangle);


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

const heron = (a, b, c) => {
    const resultDiv = document.querySelector('#result');

    if (!canFormTriangle(a, b, c)) {
        resultDiv.innerText = `Trojuholnik so stranami ${a}, ${b}, ${c} nie je mozne zostrojit`;
        return;
    }

    const s = (a + b + c) / 2;
    const triangleArea = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    resultDiv.innerText = `Trojuholnik so stranami ${a}, ${b}, ${c} ma obsah ${triangleArea.toFixed(2)}`;
};
const buttonHeron = document.createElement('button');
buttonHeron.innerText = 'Heronov vzorec 3,4,5';
buttonHeron.setAttribute('id', 'task-10');
buttonHeron.addEventListener('click', () => {
    heron(3, 4, 5);
});
tasks.appendChild(buttonHeron);