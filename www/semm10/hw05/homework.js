
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

const birthYear = 2002;
const year = new Date().getFullYear();
const age = year - birthYear;

console.log(`Pepa is ${age} years old.`)




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


//task1
const birthPepa = 2002;
const nowYear = new Date().getFullYear();

const agePepa = (birthPepa, nowYear) => {
    return `Pepa is ${nowYear - birthPepa} years old`;
};

const buttonPepaAge = document.createElement('button');
buttonPepaAge.innerText = '1. Pepa age';
buttonPepaAge.setAttribute('id', 'task-1');
buttonPepaAge.addEventListener('click', () => {
    const old = agePepa(birthPepa, nowYear);
    console.log(old);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = agePepa(birthPepa, nowYear);

});

tasks.appendChild(buttonPepaAge);


//task 2 - cel_to_far
const cel_far = (celsius) => {
    return celsius * 9 / 5 + 32;
};

const celsius = 20;
const fahrenheit = cel_far(celsius);

console.log(`${celsius} °C = ${fahrenheit} °F`);

//button cel_to_far
const buttonCelsiusToFahrenheit = document.createElement('button');
buttonCelsiusToFahrenheit.innerText = '2. Celsium to Fahrenheit';
buttonCelsiusToFahrenheit.setAttribute('id', 'task-2');
buttonCelsiusToFahrenheit.addEventListener('click', () => {
    const fahrenheit = cel_far(celsius);
    console.log(fahrenheit);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`${celsius} °C = ${fahrenheit} °F`);
});

tasks.appendChild(buttonCelsiusToFahrenheit);

//task 2 far_to_cel
const far_cel = (fahrenheitToC) => {
    return (fahrenheitToC - 32) * 5 / 9;
};

const fahrenheit_2 = 68;
const celsius_2 = far_cel(fahrenheit_2);

//button far_to_cel
const buttonFahrenheitToCelsius = document.createElement('button');
buttonFahrenheitToCelsius.innerText = '2. Fahrenheit to Celsium';
buttonFahrenheitToCelsius.setAttribute('id', 'task-2');
buttonFahrenheitToCelsius.addEventListener('click', () => {
    const celsius_2 = far_cel(fahrenheit_2);
    console.log(celsius_2);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`${fahrenheit_2} °F = ${celsius_2} °C`);
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

const getPercentage = (a, b) => {
    if (b === 0) {
        return 'Cannot divide by 0!';
    }
    return `${a} is ${(a / b * 100).toFixed(2)}% of ${b}`;
};

const a = 50;
const b = 250;


//button percentage
const buttonDivide = document.createElement('button');
buttonDivide.innerText = '4. Percentage';
buttonDivide.setAttribute('id', 'tasks-3');
buttonDivide.addEventListener('click', () => {
    const devided = getPercentage(a, b);
    console.log(devided);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = ((`${a} is ${(a / b * 100).toFixed(2)}% of ${b}`));
});

tasks.appendChild(buttonDivide);




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
    if (x < y) { return (`${x} is smaller than ${y}.`) };
    if (x > y) { return (`${x} is bigger than ${y}.`) };
    return (`${x} = ${y}`)
};



//button cela cisla
const buttonIntegers = document.createElement('button');
buttonIntegers.innerText = '5. Integer comparison';
buttonIntegers.setAttribute('id', 'tasks-4');
buttonIntegers.addEventListener('click', () => {
    const result1 = compare(7, 9);
    console.log(result1);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (compare(7, 9));
});

tasks.appendChild(buttonIntegers)

//button desetinna cisla
const buttonFloat = document.createElement('button');
buttonFloat.innerText = '5. Float comparison';
buttonFloat.setAttribute('id', 'tasks-4');
buttonFloat.addEventListener('click', () => {
    const result2 = compare(3.7, 3.7);
    console.log(result2);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = compare(3.7, 3.7);
});

tasks.appendChild(buttonFloat)

//button zlomky (napsat ve zlomku?)
const buttonFraction = document.createElement('button');
buttonFraction.innerText = '5. Fraction';
buttonFraction.setAttribute('id', 'tasks-4');
buttonFraction.addEventListener('click', () => {
    const result3 = compare(1 / 4, 3 / 4);
    console.log(result3);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = compare(3 / 4, 2 / 4);
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
const buttonPattern = document.createElement('button');
buttonPattern.innerText = '6. Pattern';
buttonPattern.setAttribute('id', 'tasks-5');
buttonPattern.addEventListener('click', () => {
    for (let i = 0; i < 730; i += 13) {
        console.log(i);
    }

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = multiply13;
});

tasks.appendChild(buttonPattern)




/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateCircleArea = (radius) => {
    if (radius < 0) {
        return 'Radius cannot be negative.';
    }
    return Math.PI * radius * radius;
};

//button circle
const buttonCircleArea = document.createElement('button');
buttonCircleArea.innerText = '7. Circle area';
buttonCircleArea.setAttribute('id', 'tasks-6');
buttonCircleArea.addEventListener('click', () => {
    const radius = 9;
    const area = calculateCircleArea(radius);
    console.log(`Area of circle with radius ${radius} is ${area}.`);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`Area of circle with radius ${radius} is ${area}`)
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
        return 'Radius and height cannot be negative';
    }
    return (1 / 3) * Math.PI * radius * radius * height;
};

// button objem kuzel
const buttonConeVolume = document.createElement('button');
buttonConeVolume.innerText = '8. Cone volume';
buttonConeVolume.setAttribute('id', 'tasks-7');
buttonConeVolume.addEventListener('click', () => {
    const radius = 9;
    const height = 10;
    const volume = coneVolume(radius, height);
    console.log(`Volume of cone with darius ${radius} and height ${height} is ${volume}`);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`Volume of cone with radius ${radius} and height ${height} is ${volume}`);
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

const triangle = (x, y, z) => {
    const isTriangle = x + y > z && x + z > y && y + z > x;
    console.log(`Lenght of side x = ${x}, f = ${y}, g = ${z}`);
    return isTriangle;
};

//button trojuhelnik
const buttonTriangle = document.createElement('button');
buttonTriangle.innerText = '9. Triangle check';
buttonTriangle.setAttribute('id', 'tasks-8');
buttonTriangle.addEventListener('click', () => {
    const x = 8;
    const y = 9;
    const z = 10;
    const result = triangle(x, y, z);
    console.log(`Triangle: ${result ? 'Yes' : 'No'}`);

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`Is it triangle: ${result ? 'Yes' : 'No'}`);
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

const isTriangle = (x, y, z) => {
    return x + y > z && x + z > y && y + z > x;
};

const triangleArea = (x, y, z) => {
    if (!isTriangle(x, y, z)) {
        return `Not valid values for triangle`;
    }

    const s = (x + y + z) / 2;
    const area = Math.sqrt(s * (s - x) * (s - y) * (s - z));
    return area;
};


const buttonTriangleArea = document.createElement('button');
buttonTriangleArea.innerText = '10. Area of triangle';
buttonTriangleArea.setAttribute('id', 'tasks-10');
buttonTriangleArea.addEventListener('click', () => {
    const x = 8;
    const y = 9;
    const z = 10;
    const area = triangleArea(x, y, z);
    if (typeof area === 'string') {
        console.log(area);
    } else {
        console.log(`Radius of triangle is ${area}`);
    }

    const resultDiv = document.querySelector('#results');
    resultDiv.innerText = (`Radius of triangle is ${area}`);
});
tasks.appendChild(buttonTriangleArea);