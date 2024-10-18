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
const birthYear = 1990
const currentYear = new Date().getFullYear();
const age = currentYear - birthYear;

console.log(`Pepe je starý ${age} roků!`);


/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak.
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32.
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9.
 */
// Solution here
const temperatureCelsius = 14;
const temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
console.log(temperatureFahrenheit);




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

//define functions
const sayPepasAge = (birthYear) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    console.log(`Pepe je starý ${age} roků!`);
}

const convertCtoF = (temperatureCelsius) => {
    const temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
    console.log(temperatureFahrenheit);
}

// create button
const buttonSayPepasAge = document.createElement('button');
const buttonConvertTemperature = document.createElement('button');

buttonSayPepasAge.textContent = "Taks 1 Pepe's age button";
buttonConvertTemperature.textContent = 'Task 2 covert temperature button';
buttonSayPepasAge.setAttribute('id', 'task-1');
buttonConvertTemperature.setAttribute('id', 'task-2');

buttonSayPepasAge.addEventListener('click', () => {
    sayPepasAge(2000);
});
buttonConvertTemperature.addEventListener('click', () => {
    convertCtoF(20);
})

const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonSayPepasAge);
tasks.appendChild(buttonConvertTemperature);



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
    if (b === 0) {
        return 'It is not possible to divide a number by zero.'
    } else {
        const quotient = a / b;
        return `${a} je ${quotient.toFixed(2) * 100}% z ${b}`;
    }
}

const buttonDivision = document.createElement('button');
buttonDivision.textContent = 'Task 4 division get quotient'
buttonDivision.addEventListener('click', () => {

    divisionResult.textContent = getQuotient(43, 105);
})

const divisionResult = document.createElement('p');
divisionResult.setAttribute('id', 'division-result');

tasks.appendChild(buttonDivision);
const results = document.querySelector('#results')
results.appendChild(divisionResult);


/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají.
 *
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here
function getGraterNumber(a, b) {
    if (a === b) {
        return 'Numbers are the same size';
    } else if (a > b) {
        return `Number ${a} is greater than ${b}`;
    } else {
        return `Number ${b} is greater than ${a}`;
    }
};

//buttons
const buttonGetGrater1 = document.createElement('button');
const buttonGetGrater2 = document.createElement('button');
const buttonGetGrater3 = document.createElement('button');

buttonGetGrater1.textContent = 'Task 5 get grater number: whole numbers';
buttonGetGrater2.textContent = 'Task 5 get grater number: decimal numbers';
buttonGetGrater3.textContent = 'Task 5 get grater number: fraction numbers';

const resultGetGrater1 = document.createElement('p');
const resultGetGrater2 = document.createElement('p');
const resultGetGrater3 = document.createElement('p');

buttonGetGrater1.addEventListener('click', () => {
    const result = getGraterNumber(333, 898);
    resultGetGrater1.textContent = result;
});

buttonGetGrater2.addEventListener('click', () => {
    const result = getGraterNumber(333.8, 333.4);
    resultGetGrater1.textContent = result;
});

buttonGetGrater3.addEventListener('click', () => {
    const result = getGraterNumber(1 / 2, 3 / 2);
    resultGetGrater1.textContent = result;
});

tasks.appendChild(buttonGetGrater1);
tasks.appendChild(buttonGetGrater2);
tasks.appendChild(buttonGetGrater3);

results.appendChild(resultGetGrater1);
results.appendChild(resultGetGrater2);
results.appendChild(resultGetGrater3);




/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší
 * nebo rovno 730, včetě nuly. Používejte for cyklus.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
function getMultiples() {
    let multiples = [];
    for (i = 0; i <= 730; i++) {
        if (i % 13 === 0) {
            multiples.push(i);
        }
    }
    return multiples;
};



const buttonGetMultiples = document.createElement('button');
buttonGetMultiples.textContent = 'Task 6 get multiples of 13 that are smaller or equal to 730';
const resultGetMultiples = document.createElement('p');

buttonGetMultiples.addEventListener('click', () => {
    const result = getMultiples();
    resultGetMultiples.textContent = result.join(', ');
});

tasks.appendChild(buttonGetMultiples);
results.appendChild(resultGetMultiples);



/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
function getAreaOfCircle(radius) {
    return Math.PI * radius * radius;
};

const buttonGetAreaOfCircle = document.createElement('button');
buttonGetAreaOfCircle.textContent = 'Task 7 calculate area of circle with radius 5';
const resultGetAreaOfCircle = document.createElement('p');

buttonGetAreaOfCircle.addEventListener('click', () => {
    const radius = 4;
    const result = getAreaOfCircle(radius);
    resultGetAreaOfCircle.textContent = `Area of circle with radius ${radius} is ${result.toFixed(2)}`;
});

tasks.appendChild(buttonGetAreaOfCircle);
results.appendChild(resultGetAreaOfCircle);


/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
function getVolumeOfCone(height, radius) {
    return (1 / 3) * Math.PI * Math.pow(radius, 2) * height;
};

const buttonGetVolumeOfCone = document.createElement('button');
buttonGetVolumeOfCone.textContent = 'Task 8 calculate volume of cone with given height and radius';
const resultGetVolumeOfCone = document.createElement('p');

buttonGetVolumeOfCone.addEventListener('click', () => {
    const height = 10;
    const radius = 5;
    const result = getVolumeOfCone(height, radius);
    resultGetVolumeOfCone.textContent = `Volume of cone with height ${height} and radius ${radius} is ${result.toFixed(2)}`;
});

tasks.appendChild(buttonGetVolumeOfCone);
results.appendChild(resultGetVolumeOfCone);





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
    return (a + b > c) && (a + c > b) && (b + c > a);
}

const buttonIsTriangle = document.createElement('button');
buttonIsTriangle.textContent = 'Task 9 check if lengths three given lengths can form a triangle';
const resultIsTriangle = document.createElement('p');

buttonIsTriangle.addEventListener('click', () => {
    const a = 3;
    const b = 4;
    const c = 5;
    const result = isTriangle(a, b, c);
    resultIsTriangle.textContent = `Can lengths ${a}, ${b}, and ${c} form a triangle? ${result ? 'Yes' : 'No'}`;
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

function getTriangleAreaUsingHeron(a, b, c) {
    if (isTriangle(a, b, c)) {
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return `The triangle area is ${area}`
    } else {
        return 'Cannot compute area because the given sides cannot form a triangle.'
    }
}

const buttonGetTriangleArea = document.createElement('button');
buttonGetTriangleArea.textContent = 'Task 10 get triangle area';
const resultGetTriangleArea = document.createElement('p');

buttonGetTriangleArea.addEventListener('click', () => {
    const result = getTriangleAreaUsingHeron(3, 5, 7)
    resultGetTriangleArea.textContent = result;
})


tasks.appendChild(buttonGetTriangleArea);
results.appendChild(resultGetTriangleArea)



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