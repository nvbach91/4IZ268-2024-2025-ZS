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
const writeToResults = (content) => {
    const results = document.querySelector('#results');
    results.innerHTML = content;
};

console.log('Ahoj světe');


/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here

const pepesAge = (birthYear) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    writeToResults(`Pepe is ${age} years old.`);
};


/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here

const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;
};

const fahrenheitToCelsius = (fahrenheit) => {
    return ((fahrenheit - 32) * 5) / 9;
};

// Funkce pro konverzi teploty a výpis výsledků
const temperatureConversion = (celsius, fahrenheit) => {
    const celsiusToF = `${celsius}°C = ${celsiusToFahrenheit(celsius).toFixed(2)}°F`;
    const fahrenheitToC = `${fahrenheit}°F = ${fahrenheitToCelsius(fahrenheit).toFixed(2)}°C`;
    
    writeToResults(`<p>${celsiusToF}</p><p>${fahrenheitToC}</p>`);
};


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

const buttonTask3_1 = document.createElement('button');
buttonTask3_1.innerText = 'Call Pepe\'s age';
buttonTask3_1.setAttribute('id', 'task-3-1');
buttonTask3_1.addEventListener('click', () => {
    pepesAge(1985);
});
document.querySelector('#tasks').appendChild(buttonTask3_1);

// Tlačítko pro volání funkce na převod teploty (úloha 2)
const buttonTask3_2 = document.createElement('button');
buttonTask3_2.innerText = 'Call temperature conversion';
buttonTask3_2.setAttribute('id', 'task-3-2');
buttonTask3_2.addEventListener('click', () => {
    temperatureConversion(25, 77);
});
document.querySelector('#tasks').appendChild(buttonTask3_2);


/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const calculatePercentage = (a, b) => {
    if (b === 0) {
        writeToResults("Division by zero is not allowed.");
    } else {
        const percentage = ((a / b) * 100).toFixed(2);
        writeToResults(`${a} is ${percentage}% of ${b}`);
    }
};

const buttonTask4 = document.createElement('button');
buttonTask4.innerText = 'Percentage';
buttonTask4.setAttribute('id', 'task-4');
buttonTask4.addEventListener('click', () => {
    calculatePercentage(21, 42);
});
document.querySelector('#tasks').appendChild(buttonTask4);

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
    if (a > b) {
        writeToResults(`${a} is greater than ${b}`);
    } else if (a < b) {
        writeToResults(`${a} is less than ${b}`);
    } else {
        writeToResults(`${a} and ${b} are equal`);
    }
};

const buttonTask5 = document.createElement('button');
buttonTask5.innerText = 'Compare numbers';
buttonTask5.setAttribute('id', 'task-5');
buttonTask5.addEventListener('click', () => {
    compareNumbers(10, 20);
});
document.querySelector('#tasks').appendChild(buttonTask5);

/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const multiplesOf13 = () => {
    let multiples = [];
    for (let i = 0; i <= 730; i += 13) {
        multiples.push(i);
    }
    writeToResults(multiples.join(', '));
};

const buttonTask6 = document.createElement('button');
buttonTask6.innerText = 'Multiples of 13';
buttonTask6.setAttribute('id', 'task-6');
buttonTask6.addEventListener('click', multiplesOf13);
document.querySelector('#tasks').appendChild(buttonTask6);

/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateCircleArea = (radius) => {
    const area = Math.PI * Math.pow(radius, 2);
    writeToResults(`The area of the circle is ${area.toFixed(2)}`);
};

const buttonTask7 = document.createElement('button');
buttonTask7.innerText = 'Circle area';
buttonTask7.setAttribute('id', 'task-7');
buttonTask7.addEventListener('click', () => calculateCircleArea(10));  // testovací hodnota
document.querySelector('#tasks').appendChild(buttonTask7);

/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateConeVolume = (radius, height) => {
    const volume = (Math.PI * Math.pow(radius, 2) * height) / 3;
    writeToResults(`The volume of the cone is ${volume.toFixed(2)}`);
};

const buttonTask8 = document.createElement('button');
buttonTask8.innerText = 'Cone volume';
buttonTask8.setAttribute('id', 'task-8');
buttonTask8.addEventListener('click', () => calculateConeVolume(5, 10));
document.querySelector('#tasks').appendChild(buttonTask8);

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
    const canFormTriangle = a + b > c && a + c > b && b + c > a;
    const result = `Sides: a = ${a}, b = ${b}, c = ${c}. `;
    if (canFormTriangle) {
        writeToResults(result + "A triangle can be formed.");
        return true;
    } else {
        writeToResults(result + "A triangle can't be formed.");
        return false;
    }
};

const buttonTask9 = document.createElement('button');
buttonTask9.innerText = 'Triangle validation';
buttonTask9.setAttribute('id', 'task-9');
buttonTask9.addEventListener('click', () => {
    const result = isTriangle(3, 4, 5);
    console.log(`Can a triangle be formed? ${result}`);
});
document.querySelector('#tasks').appendChild(buttonTask9);

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

const heronFormula = (a, b, c) => {
    if (!isTriangle(a, b, c)) {
        writeToResults("Cannot form a triangle with these sides.");
        return;
    }

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    writeToResults(`The area of the triangle is ${area.toFixed(2)}`);
};

const buttonTask10 = document.createElement('button');
buttonTask10.innerText = 'Heron\'s formula';
buttonTask10.setAttribute('id', 'task-10');
buttonTask10.addEventListener('click', () => heronFormula(3, 4, 5));
document.querySelector('#tasks').appendChild(buttonTask10);
