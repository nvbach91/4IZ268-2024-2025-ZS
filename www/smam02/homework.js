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



/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here

let age = 23;

if (age) {
    console.log(`Pepa ma ${age} rokov.`);
}






/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const celsius = 21;
const fahrenheiht = 69.8;


if (celsius !== undefined) {
    const result = (celsius * 9 / 5) + 32;
    console.log(`Z ${celsius} Celsius na ${result} Fahrenheiht.`);
}

if (fahrenheiht !== undefined) {
    const result = (fahrenheiht - 32) * 5 / 9;
    console.log(`Z ${fahrenheiht} Fahrenheiht na ${result} Celsius.`);
}



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


const printAge = (age) => {
    if (age) {
        console.log(`Pepa ma ${age} rokov.`);
    } else {
        console.log('Age was not set');
    }
}

printAge(15);
printAge(23);
printAge();

const calculateFahrenheiht = (celsius) => {
    if (celsius !== undefined) {
        const result = (celsius * 9 / 5) + 32;
        console.log(`Z ${celsius} Celsius na ${result} Fahrenheiht.`);
    } else {
        console.log(`Celsius wasn't set`);
    }
};

calculateFahrenheiht(21);
calculateFahrenheiht(-3);
calculateFahrenheiht(0);


const calculateCelsius = (fahrenheiht) => {
    if (fahrenheiht !== undefined) {
        const result = (fahrenheiht - 32) * 5 / 9;
        console.log(`Z ${fahrenheiht} Fahrenheiht na ${result} Celsius.`);
    } else {
        console.log(`Fahrenheit wasn't set`);
    }
};

calculateCelsius(69.8);
calculateCelsius(26.6);
calculateCelsius(32);
calculateCelsius(0);

const buttonPrintAge = document.createElement('button');
buttonPrintAge.innerHTML = 'Print age !';
buttonPrintAge.setAttribute('id', 'task-0');

buttonPrintAge.addEventListener('click', () => {
    printAge(23);
});

const tasks = document.getElementById('tasks');

tasks.prepend(buttonPrintAge);

const buttonCalculateFahrenheiht = document.createElement('button');
buttonCalculateFahrenheiht.innerText = 'Calculate Fahrenheiht!'
buttonCalculateFahrenheiht.setAttribute('id', 'task-1');

buttonCalculateFahrenheiht.addEventListener('click', () => {
    calculateFahrenheiht(0);
});

tasks.prepend(buttonCalculateFahrenheiht);

const buttonCalculateCelsius = document.createElement('button');
buttonCalculateCelsius.innerText = 'Calculate Celsius!'
buttonCalculateCelsius.setAttribute('id', 'task-2');

buttonCalculateCelsius.addEventListener('click', () => {
    calculateCelsius(32);
});

tasks.prepend(buttonCalculateCelsius);

/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const calculateDivision = (firstNum, secondNum) => {
    if (secondNum === 0) {
        console.log('Cannot divide by 0');
        return;
    }

    const firstNumMultiplied = firstNum * 100;
    const result = (firstNumMultiplied / secondNum).toFixed(2);

    console.log(`The number ${firstNum} is ${result}% of ${secondNum}.`);
}

calculateDivision(21, 0);
calculateDivision(21, 42);

const buttonCalculateDivision = document.createElement('button');
buttonCalculateDivision.innerText = 'Calculate Division !'
buttonCalculateDivision.setAttribute('id', 'task-3');

buttonCalculateDivision.addEventListener('click', () => {
    calculateDivision(21, 42);
});

tasks.prepend(buttonCalculateDivision);



/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here

const divResults = document.getElementById('results');
const findMaxDiv = document.getElementById('find-max-div');

const findMax = (num1, num2) => {
    const resultDiv = document.createElement('div');
    resultDiv.setAttribute('id', 'result-1');

    findMaxDiv.appendChild(resultDiv);

    if (num1 === num2) {
        resultDiv.innerHTML = 'Čísle se rovnají';
        return;
    }

    const maxNum = Math.max(num1, num2);

    resultDiv.innerHTML = `Maximum is: ${maxNum}`;

    // const maxNumber
}
findMax(2.21, 2.22);
findMax(0.33, 1 / 3);
findMax(1 / 2, 0.5);
findMax(-3, -1);

const buttonFindMax1 = document.createElement('button');
buttonFindMax1.innerText = 'Find max 2.21 and 2.22 !'
buttonFindMax1.setAttribute('id', 'task-4');

buttonFindMax1.addEventListener('click', () => {
    findMax(2.21, 2.22);
});

findMaxDiv.appendChild(buttonFindMax1);

const buttonFindMax2 = document.createElement('button');
buttonFindMax2.innerText = 'Find max 0.33 and 1/3 !'
buttonFindMax2.setAttribute('id', 'task-5');

buttonFindMax2.addEventListener('click', () => {
    findMax(0.33, 1 / 3);
});

findMaxDiv.appendChild(buttonFindMax2);

const buttonFindMax3 = document.createElement('button');
buttonFindMax3.innerText = 'Find max 0.5 and 1/2 !'
buttonFindMax3.setAttribute('id', 'task-6');

buttonFindMax3.addEventListener('click', () => {
    findMax(1 / 2, 0.5);
});

findMaxDiv.appendChild(buttonFindMax3);

const buttonFindMax4 = document.createElement('button');
buttonFindMax4.innerText = 'Find max -3 and -1 !'
buttonFindMax4.setAttribute('id', 'task-7');

buttonFindMax4.addEventListener('click', () => {
    findMax(-3, -1);
});

findMaxDiv.appendChild(buttonFindMax4);



/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const generate13Div = document.getElementById('generate-13-div');
const multiple13Header = document.createElement('h3');
multiple13Header.innerText = 'Multiples of 13';
generate13Div.appendChild(multiple13Header);

const generateMultiples13 = () => {
    for (let i = 13; i <= 730; i += 13) {
        const multiple13 = document.createElement('p');
        multiple13.innerText = `[${i}]`;
        console.log(i);
        generate13Div.appendChild(multiple13);
    }
}

generateMultiples13();

const buttonGenerateMultiples13 = document.createElement('button');
buttonGenerateMultiples13.innerText = 'Generate multiples of 13 !'
buttonGenerateMultiples13.setAttribute('id', 'task-8');

buttonGenerateMultiples13.addEventListener('click', () => {
    generateMultiples13();
});

generate13Div.appendChild(buttonGenerateMultiples13);




/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const generateAreaDiv = document.getElementById('calculate-area-div');
const radiusHeader = document.createElement('h3');
radiusHeader.innerText = 'Calculating Area';
generateAreaDiv.appendChild(radiusHeader);

const calculateArea = (radius) => {
    const spanRadius = document.createElement('p');
    generateAreaDiv.appendChild(spanRadius);

    if (radius < 0) {
        console.log('Radius cannot be negative');
        spanRadius.innerText = 'Radius cannot be negative';

        return;
    }

    const result = radius ** 2 * Math.PI;
    console.log(`Area is: ${result}`);

    spanRadius.innerText = `[${result}]`;
};

calculateArea(3);
calculateArea(0);
calculateArea(-1);


const buttonCalculateArea1 = document.createElement('button');
buttonCalculateArea1.innerText = 'Calculate area with radius 3 !'
buttonCalculateArea1.setAttribute('id', 'task-9');

buttonCalculateArea1.addEventListener('click', () => {
    calculateArea(3);
});

generateAreaDiv.appendChild(buttonCalculateArea1);


const buttonCalculateArea2 = document.createElement('button');
buttonCalculateArea2.innerText = 'Calculate area with radius 0 !'
buttonCalculateArea2.setAttribute('id', 'task-10');

buttonCalculateArea2.addEventListener('click', () => {
    calculateArea(0);
});

generateAreaDiv.appendChild(buttonCalculateArea2);


const buttonCalculateArea3 = document.createElement('button');
buttonCalculateArea3.innerText = 'Calculate area with radius -1 !'
buttonCalculateArea3.setAttribute('id', 'task-11');

buttonCalculateArea3.addEventListener('click', () => {
    calculateArea(-1);
});

generateAreaDiv.appendChild(buttonCalculateArea3);





/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateVolumeDiv = document.getElementById('calculate-volume-div');
const volumeHeader = document.createElement('h3');
volumeHeader.innerText = 'Calculating volume of cone';
calculateVolumeDiv.appendChild(volumeHeader);

// Function to calculate the volume of a cone
const calculateVolume = (radius, height) => {
    const spanVolume = document.createElement('p');
    calculateVolumeDiv.appendChild(spanVolume);

    if (radius < 0 || height < 0) {
        console.log('Radius and height cannot be negative');
        spanVolume.innerText = '[Radius and height cannot be negative]';
        return;
    }

    const volume = (1 / 3) * Math.PI * radius ** 2 * height;
    console.log(`Volume is: ${volume}`);

    spanVolume.innerText = `[Volume with radius [${radius}] and height [${height}] is: ${volume.toFixed(2)}] `;
};

calculateVolume(3, 5);
calculateVolume(0, 5);
calculateVolume(-1, 5);

const buttonCalculateVolume1 = document.createElement('button');
buttonCalculateVolume1.innerText = 'Calculate volume with radius 3 and height 5';
buttonCalculateVolume1.setAttribute('id', 'task-12');

buttonCalculateVolume1.addEventListener('click', () => {
    calculateVolume(3, 5);
});

calculateVolumeDiv.appendChild(buttonCalculateVolume1);

const buttonCalculateVolume2 = document.createElement('button');
buttonCalculateVolume2.innerText = 'Calculate volume with radius 0 and height 5';
buttonCalculateVolume2.setAttribute('id', 'task-13');

buttonCalculateVolume2.addEventListener('click', () => {
    calculateVolume(0, 5);
});

calculateVolumeDiv.appendChild(buttonCalculateVolume2);

const buttonCalculateVolume3 = document.createElement('button');
buttonCalculateVolume3.innerText = 'Calculate volume with radius -1 and height 5';
buttonCalculateVolume3.setAttribute('id', 'task-14');

buttonCalculateVolume3.addEventListener('click', () => {
    calculateVolume(-1, 5);
});

calculateVolumeDiv.appendChild(buttonCalculateVolume3);




/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const validateTriangleDiv = document.getElementById('validate-triangle-div');

const triangleHeader = document.createElement('h3');
triangleHeader.innerText = 'Triangle Validity Check';
validateTriangleDiv.appendChild(triangleHeader);

const isTriangle = (a, b, c) => {
    const spanTriangle = document.createElement('p');
    validateTriangleDiv.appendChild(spanTriangle);

    if (a <= 0 || b <= 0 || c <= 0) {
        console.log('Sides must be positive values');
        spanTriangle.innerText = '[Sides must be positive values]';
        return false;
    }

    const valid = (a + b > c) && (a + c > b) && (b + c > a);

    if (valid) {
        console.log(`The sides [${a}, ${b}, ${c}] can form a triangle`);
        spanTriangle.innerText = `[The sides [${a}, ${b}, ${c}] can form a triangle: Yes]`;
        return true;
    } else {
        console.log(`The sides [${a}, ${b}, ${c}] cannot form a triangle`);
        spanTriangle.innerText = `[The sides [${a}, ${b}, ${c}] cannot form a triangle: No]`;
        return false;
    }
};

isTriangle(3, 4, 5);
isTriangle(1, 1, 2);
isTriangle(0, 5, 7);

const buttonTriangle1 = document.createElement('button');
buttonTriangle1.innerText = 'Check if 3, 4, 5 form a triangle';
buttonTriangle1.setAttribute('id', 'task-15');

buttonTriangle1.addEventListener('click', () => {
    isTriangle(3, 4, 5);
});

validateTriangleDiv.appendChild(buttonTriangle1);

const buttonTriangle2 = document.createElement('button');
buttonTriangle2.innerText = 'Check if 1, 1, 2 form a triangle';
buttonTriangle2.setAttribute('id', 'task-16');

buttonTriangle2.addEventListener('click', () => {
    isTriangle(1, 1, 2);
});

validateTriangleDiv.appendChild(buttonTriangle2);

const buttonTriangle3 = document.createElement('button');
buttonTriangle3.innerText = 'Check if sides 0, 5, 7 form a triangle';
buttonTriangle3.setAttribute('id', 'task-17');

buttonTriangle3.addEventListener('click', () => {
    isTriangle(0, 5, 7);
});

validateTriangleDiv.appendChild(buttonTriangle3);




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

const heronDiv = document.getElementById('heron-div');
const heronHeader = document.createElement('h3');
heronHeader.innerText = 'Calculating Area of Triangle using Heron Formula';
heronDiv.appendChild(heronHeader);

const calculateTriangleArea = (a, b, c) => {
    const spanArea = document.createElement('p');
    heronDiv.appendChild(spanArea);

    if (!isTriangle(a, b, c)) {
        spanArea.innerText = 'Cannot calculate area, sides do not create triangle.';
        return;
    }

    const s = (a + b + c) / 2;

    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    console.log(`Area of the triangle with sides [${a}, ${b}, ${c}] is: ${area.toFixed(2)}`);
    spanArea.innerText = `Area of the triangle with sides [${a}, ${b}, ${c}] is: ${area.toFixed(2)}`;
};


const buttonHeron1 = document.createElement('button');
buttonHeron1.innerText = 'Calculate area with sides 3, 4, 5';
buttonHeron1.setAttribute('id', 'task-18');

buttonHeron1.addEventListener('click', () => {
    calculateTriangleArea(3, 4, 5);
});

heronDiv.appendChild(buttonHeron1);

const buttonHeron2 = document.createElement('button');
buttonHeron2.innerText = 'Calculate area with sides 5, 12, 13';
buttonHeron2.setAttribute('id', 'task-19');

buttonHeron2.addEventListener('click', () => {
    calculateTriangleArea(5, 12, 13);
});

heronDiv.appendChild(buttonHeron2);

const buttonHeron3 = document.createElement('button');
buttonHeron3.innerText = 'Calculate area with sides 1, 1, 2';
buttonHeron3.setAttribute('id', 'task-20');

buttonHeron3.addEventListener('click', () => {
    calculateTriangleArea(1, 1, 2);
});

heronDiv.appendChild(buttonHeron3);
