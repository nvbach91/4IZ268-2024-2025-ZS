
/* HOMEWORK */
/**
 * 0) Pre-preparacion.
 * - Vytvořte HTML stránku s nadpisem h1 "JavaScript is awesome!" 
 * - Na stránce vytvořte místo pro umístění jednotlivých spouštěčů úkolů - tlačítek (tj. div, který má id s hodnotou "tasks" - <div id="tasks"></div>). 
 * - Na stránce vytvořte místo pro výpis výsledků úkolů (div, který má id s hodnotou "result" - <div id="results"></div>).
 * 
 * - Připojte tento homework.js soubor k vytvořené HTML stránce pomocí tagu <script> (viz LAB) a vyzkoušejte
 */

console.log('Ahoj světe');

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here
const pepeBirthYear = 2001;
const currentYear = new Date().getFullYear();
const pepeAge = currentYear - pepeBirthYear;
console.log(`Pepe is ${pepeAge} years old.`);

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

const calculatePepeAge = (birthYear) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    resultDiv.textContent = `By the end of this year, Pepe will be ${age} years old.`;
};


const celsiusToFahrenheit = (celsius) => {
    const fahrenheit = (celsius * 9) / 5 + 32;
    resultDiv.textContent = `${celsius}°C is equal to ${fahrenheit}°F`;
};


const fahrenheitToCelsius = (fahrenheit) => {
    const celsius = ((fahrenheit - 32) * 5) / 9;
    resultDiv.textContent = `${fahrenheit}°F is equal to ${celsius}°C`;
};

const createNewButton = (label, buttonId, callback) => {
    const button = document.createElement("button");
    button.innerText = label;
    button.setAttribute("id", buttonId);
    button.addEventListener("click", callback);
    document.querySelector("#tasks").appendChild(button);
};


const resultDiv = document.createElement("div");
resultDiv.setAttribute("id", "results");
document.body.appendChild(resultDiv);


createNewButton("Calculate Pepe's Age", "age-task", () => {
    calculatePepeAge(2001); 
});

createNewButton("Convert Celsius to Fahrenheit", "celsius-task", () => {
    celsiusToFahrenheit(25); 
});

createNewButton("Convert Fahrenheit to Celsius", "fahrenheit-task", () => {
    fahrenheitToCelsius(77); 
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

const results = document.querySelector('#results');
const argumentA = 10;
const argumentB = 100;

const censoredResult = document.createElement("div");
censoredResult.setAttribute('id', 'result-1');
results.appendChild(censoredResult);

const censored = (a, b) => {
    if (b === 0) {
        censoredResult.textContent = 'Error: Cannot divide by zero';
    } else {
        const result = (a / b) * 100;
        censoredResult.textContent = `${a} is ${result.toFixed(0)}% of ${b}`;
    }
};

const buttonCensored = document.createElement('button');
buttonCensored.innerText = '%CENSORED%';
buttonCensored.setAttribute('id', 'task-3');
buttonCensored.addEventListener('click', () => {
    censored(argumentA, argumentB);
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

const variable = 2.3;

const bigger = document.createElement("div");
bigger.setAttribute('id', 'result-2');
results.appendChild(bigger);

const compare = (a, b) => {
    if (a === b) {
        bigger.textContent = `${a} is equal to ${b}`;
    } else if (a > b) {
        bigger.textContent = `${a} is bigger than ${b}`;
    } else {
        bigger.textContent = `${a} is smaller than ${b}`;
    }
};

const buttonBiggerOne = document.createElement('button');
buttonBiggerOne.innerText = 'Compare 1';
buttonBiggerOne.setAttribute('id', 'task-4');
buttonBiggerOne.addEventListener('click', () => { compare(variable, 8 / 4); }); 
tasks.appendChild(buttonBiggerOne);

const buttonBiggerTwo = document.createElement('button');
buttonBiggerTwo.innerText = 'Compare 2';
buttonBiggerTwo.setAttribute('id', 'task-5');
buttonBiggerTwo.addEventListener('click', () => { compare(variable, 10); });
tasks.appendChild(buttonBiggerTwo);

const buttonBiggerThree = document.createElement('button');
buttonBiggerThree.innerText = 'Compare 3';
buttonBiggerThree.setAttribute('id', 'task-6');
buttonBiggerThree.addEventListener('click', () => { compare(variable, 9.5); });
tasks.appendChild(buttonBiggerThree);


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
        result += `${i} `; 
    }

    document.querySelector('#results').innerText = result.trim();
};

const buttonPattern = document.createElement('button');
buttonPattern.innerText = 'Násobky 13';
buttonPattern.setAttribute('id', 'task-7');
buttonPattern.addEventListener('click', printMultiplesOf13);
tasks.appendChild(buttonPattern);



/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateCircleArea = (radius) => {
    if (radius < 0) return 'Poloměr nemůže být záporný'; 
    return (Math.PI * radius * radius).toFixed(2);
};

const buttonCircle = document.createElement('button');
buttonCircle.innerText = 'Circle';
buttonCircle.setAttribute('id', 'task-8');
buttonCircle.addEventListener('click', () => {
    const result = calculateCircleArea(6);
    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = `Obsah kruhu s poloměrem 6 je ${result}`;
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
    if (radius < 0 || height < 0) {
        return 'Poloměr a výška nemohou být záporné'; 
    }
    const volume = (Math.PI * radius * radius * height) / 3; 
    return volume.toFixed(2); 
};
const viewInResultsDiv = (result) => {
    const resultsDiv = document.querySelector('#results');
    resultsDiv.innerText = `Objem kuželu je ${result}`;
};
createNewButton("Cone volume", "task-6", () => {
    const volume = calculateConeVolume(15, 3); 
    viewInResultsDiv(volume);
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

const canFormTriangle = (a, b, c) => {
    const isTriangle = (a + b > c) && (a + c > b) && (b + c > a);
    console.log(`Délky stran: a = ${a}, b = ${b}, c = ${c}`);
    return isTriangle; 
};
const buttonIsTriangle = document.createElement('button');
buttonIsTriangle.textContent = 'Task 9 - control of triangle';
const resultIsTriangle = document.createElement('p');

buttonIsTriangle.addEventListener('click', () => {
    const a = 9; 
    const b = 12;
    const c = 15;
    const result = canFormTriangle(a, b, c);
    resultIsTriangle.textContent = `Délky ${a}, ${b}, a ${c} ${result ? 'mohou' : 'nemohou'} tvořit trojúhelník.`;
});

tasks.appendChild(buttonIsTriangle);
results.appendChild(resultIsTriangle);


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

const heron = document.createElement("div");
heron.setAttribute('id', 'result-3');
results.appendChild(heron);

const heronCalculate = (a,b,c) => {
    if (canFormTriangle(a,b,c)===false) {
        heron.textContent = 'Error';
    }
    else {
        const s = (a+b+c)/2;
        const area = Math.sqrt(s*(s-a)*(s-b)*(s-c));
        heron.textContent = area;
    };
};

const buttonHeron = document.createElement('button');
buttonHeron.innerText = 'výpočet obsahu - Heron';
buttonHeron.setAttribute('id', 'task-11');
buttonHeron.addEventListener('click', () => {heronCalculate(10,6,14)});
tasks.appendChild(buttonHeron);