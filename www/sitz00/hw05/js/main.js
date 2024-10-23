
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

console.log('Ahoj světe')




/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here

const birthYear = 1999;
const year = new Date().getFullYear();
const age = year - birthYear;

console.log(`Pepovi je ${age} let.`)




/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here

const celsiusTemp = 20;
const ferenheitTemp = (celsiusTemp * 9 / 5) + 32;

console.log(ferenheitTemp)




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


//funkce agePepa
const birthPepa = 1999;
const actualYear = new Date().getFullYear();

const agePepa = (birthPepa, actualYear) => {
    return `Pepovi je ${actualYear - birthPepa} let.`;
};

console.log(agePepa(birthPepa, actualYear));

//button agePepa
const buttonAgePepa = document.createElement('button');
buttonAgePepa.innerText = '1) věk Pepa';
buttonAgePepa.setAttribute('id', 'task-1');
buttonAgePepa.addEventListener('click', () => {
    const old = agePepa(birthPepa, actualYear);
    console.log(old);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = agePepa(birthPepa, actualYear);
});

tasks.appendChild(buttonAgePepa);


//funkce cToF
const cToF = (celsius) => {
    return celsius * 9 / 5 + 32;
};

const celsius = 20;
const fahrenheit = cToF(celsius);

console.log(`${celsius} °C = ${fahrenheit} °F`);

//button cToF
const buttonCelsiusToFahrenheit = document.createElement('button');
buttonCelsiusToFahrenheit.innerText = '2) °C na °F';
buttonCelsiusToFahrenheit.setAttribute('id', 'task-2');
buttonCelsiusToFahrenheit.addEventListener('click', () => {
    const fahrenheit = cToF(celsius);
    console.log(fahrenheit);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`${celsius} °C = ${fahrenheit} °F`);
});

tasks.appendChild(buttonCelsiusToFahrenheit);

//funkce fToC
const fToC = (fahrenheitToC) => {
    return (fahrenheitToC - 32) * 5 / 9;
};

const fahrenheitToC = 68;
const celsiusToF = fToC(fahrenheitToC);

//button fToC
const buttonFahrenheitToCelsius = document.createElement('button');
buttonFahrenheitToCelsius.innerText = '2) °F na °C';
buttonFahrenheitToCelsius.setAttribute('id', 'task-2');
buttonFahrenheitToCelsius.addEventListener('click', () => {
    const celsiusToF = fToC(fahrenheitToC);
    console.log(celsiusToF);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`${fahrenheitToC} °F = ${celsiusToF} °C`);
});

tasks.appendChild(buttonFahrenheitToCelsius);



/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

//(pole kde se to vypíše???)

const percentage = (a, b) => {
    if (b === 0) { return `nelze dělit nulou!` };
    return a / b * 100;
}

const a = 21;
const b = 42;

console.log(`${a} je ${percentage(a, b).toFixed(0)} % z ${b}.`);

//button percentage
const buttonDevided = document.createElement('button');
buttonDevided.innerText = '4) podíl - procenta';
buttonDevided.setAttribute('id', 'tasks-3');
buttonDevided.addEventListener('click', () => {
    const devided = percentage(a, b);
    console.log(devided);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = ((`${a} je ${percentage(a, b).toFixed(2)} % z ${b}.`));
});

tasks.appendChild(buttonDevided);




/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here

const compare = (x, y) => {
    if (x < y) { return (`Číslo ${x} je menší něž číslo ${y}.`) };
    if (x > y) { return (`Číslo ${x} je větší něž číslo ${y}.`) };
    return (`Čísla ${x} a ${y} se rovnají.`)
};

const result1 = compare(3, 3);
const result2 = compare(1.9, 1.3);
const result3 = compare(1 / 4, 3 / 4);

//button cela cisla
const buttonIntegers = document.createElement('button');
buttonIntegers.innerText = '5) celá čísla';
buttonIntegers.setAttribute('id', 'tasks-4');
buttonIntegers.addEventListener('click', () => {
    const result1 = compare(3, 3);
    console.log(result1);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (compare(3, 3));
});

tasks.appendChild(buttonIntegers)

//button desetinna cisla
const buttonDecimals = document.createElement('button');
buttonDecimals.innerText = '5) desetinná čísla';
buttonDecimals.setAttribute('id', 'tasks-4');
buttonDecimals.addEventListener('click', () => {
    const result2 = compare(1.9, 1.3);
    console.log(result2);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = compare(1.9, 1.3);
});

tasks.appendChild(buttonDecimals)

//button zlomky (napsat ve zlomku?)
const buttonFraction = document.createElement('button');
buttonFraction.innerText = '5) zlomek';
buttonFraction.setAttribute('id', 'tasks-4');
buttonFraction.addEventListener('click', () => {
    const result3 = compare(1 / 4, 3 / 4);
    console.log(result3);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = compare(1 / 4, 3 / 4);
});

tasks.appendChild(buttonFraction)



/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const multiply13 = [];
for (let i = 0; i <= 730; i += 13) {
    multiply13.push(i);
};

//button pattern
const buttonThirteen = document.createElement('button');
buttonThirteen.innerText = '6) násobky 13';
buttonThirteen.setAttribute('id', 'tasks-5');
buttonThirteen.addEventListener('click', () => {
    for (let i = 0; i < 730; i += 13) {
        console.log(i);
    }

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = multiply13;
});

tasks.appendChild(buttonThirteen)




/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateCircleArea = (radius) => {
    if (radius < 0) {
        return 'Poloměr nemůže být záporný.';
    }
    return Math.PI * radius * radius;
};

//button circle
const buttonCircleArea = document.createElement('button');
buttonCircleArea.innerText = '7) obsah kružnice';
buttonCircleArea.setAttribute('id', 'tasks-6');
buttonCircleArea.addEventListener('click', () => {
    const radius = 5;
    const area = calculateCircleArea(radius);
    console.log(`Obsah kružnice s poloměrem ${radius} je ${area}.`);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`Obsah kružnice s poloměrem ${radius} je ${area}.`)
});

tasks.appendChild(buttonCircleArea);





/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const coneVolume = (radius, height) => {
    if (radius < 0 || height < 0) {
        return 'Poloměr a výška nemohou být záporné.';
    }
    return (1 / 3) * Math.PI * radius * radius * height;
};

// button objem kuzel
const buttonConeVolume = document.createElement('button');
buttonConeVolume.innerText = '8) objem kuželu';
buttonConeVolume.setAttribute('id', 'tasks-7');
buttonConeVolume.addEventListener('click', () => {
    const radius = 3;
    const height = 5;
    const volume = coneVolume(radius, height);
    console.log(`Objem kuželu s poloměrem ${radius} a výškou ${height} je ${volume}.`);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`Objem kuželu s poloměrem ${radius} a výškou ${height} je ${volume}.`);
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

const triangle = (e, f, g) => {
    const isTriangle = e + f > g && e + g > f && f + g > e;
    console.log(`Délky stran e = ${e}, f = ${f}, g = ${g}`);
    return isTriangle;
};

//button trojuhelnik
const buttonTriangle = document.createElement('button');
buttonTriangle.innerText = '9) trojúhelník - kontrola';
buttonTriangle.setAttribute('id', 'tasks-8');
buttonTriangle.addEventListener('click', () => {
    const e = 5;
    const f = 7;
    const g = 10;
    const result = triangle(e, f, g);
    console.log(`Trojuhelnik: ${result ? 'Ano' : 'Ne'}`);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`Trojuhelnik: ${result ? 'Ano' : 'Ne'}`);
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

const isTriangle = (e, f, g) => {
    return e + f > g && e + g > f && f + g > e;
};

const triangleArea = (e, f, g) => {
    if (!isTriangle(e, f, g)) {
        return `Není to validní trojúhelník`;
    }

    const s = (e + f + g) / 2;
    const area = Math.sqrt(s * (s - e) * (s - f) * (s - g));
    return area;
};


const buttonTringleArea = document.createElement('button');
buttonTringleArea.innerText = '10) obsah trojúhelníka';
buttonTringleArea.setAttribute('id', 'tasks-10');
buttonTringleArea.addEventListener('click', () => {
    const e = 5;
    const f = 7;
    const g = 10;
    const area = triangleArea(e, f, g);
    if (typeof area === 'string') {
        console.log(area);
    } else {
        console.log(`Obsah trojúhelníka je ${area}.`);
    }

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`Obsah trojúhelníka je ${area}.`);
});
tasks.appendChild(buttonTringleArea);