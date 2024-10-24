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
console.log('Ahoj světe')
// Solution here
const pepaYearOfBirth = 2001;
const currentYear = new Date().getFullYear()
const pepaAge = currentYear - pepaYearOfBirth
output = `Pepa is ${pepaAge} years old.`
console.log(output)
/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const celsius = 36
const fahrenheit = 36
output = `${celsius} degrees celsius is ${36 * 9 / 5 + 32} fahrenheit, ${fahrenheit} degrees fahrenheit is ${(fahrenheit - 32) * 5 / 9}`
console.log(output)

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
const getPepaAge = (year) => {
    const currentYear = new Date().getFullYear()
    const pepaAge = currentYear - year
    const output = `Pepa is ${pepaAge} years old.`
    console.log(output)
}
const buttonPepa = document.createElement('button');
// nastavení textu tlačítka
buttonPepa.innerText = 'Pepa Button';
// nastavení atributu id tlačítka
buttonPepa.setAttribute('id', 'task-0');
// nabindování funkce na událost click tlačítka

buttonPepa.addEventListener('click', () => {
    getPepaAge(2021)
});
const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonPepa);

const getTemperatures = (fahrenheit, celsius) => {
    const fahrenheitToCelsius = (fahrenheit - 32) * 5 / 9;
    const celsiuToFahrenheit = celsius * 9 / 5 + 32;
    const output = `${celsius} degrees celsius is ${36 * 9 / 5 + 32} fahrenheit, ${fahrenheit} degrees fahrenheit is ${(fahrenheit - 32) * 5 / 9}`;
    return output
}

const buttonTemperature = document.createElement('button');
buttonTemperature.innerText = 'Temperature Button';
buttonTemperature.setAttribute('id', 'task-1');
buttonTemperature.addEventListener('click', () => {
    console.log(getTemperatures(30, 30))
});
tasks.appendChild(buttonTemperature);


/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla.
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2);
 * Pozor na dělení nulou!
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const results = document.querySelector('#results')
const outputElement = document.createElement('p');
results.appendChild(outputElement)

const getRatio = (numberOne, numberTwo) => {
    const ratio = ((numberOne / numberTwo) * 100).toFixed(1)
    const output = `The ratio of the numbers is ${ratio}%`
    outputElement.innerText = output
    console.log(output)
    return output
}
const buttonRatio = document.createElement('button');
buttonRatio.innerText = 'Ratio Button';
buttonRatio.setAttribute('id', 'task-2');
buttonRatio.addEventListener('click', () => {
    getRatio(60, 59)
});
tasks.appendChild(buttonRatio);



/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají.
 *
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.00
 */
// Solution here
const outputComparisonElement = document.createElement('p');
results.appendChild(outputComparisonElement)

const compareFunction = (a, b) => {

    if (a > b) {
        return `Number ${a} is greater than number ${b}`
    }
    if (a < b) {
        return `Number ${a} is lower than number ${b}`
    }
    if (a === b) {
        return `Input numbers are equal`
    }
}
const buttonCompare = document.createElement('button');
buttonCompare.innerText = 'Greater Than Button';
buttonCompare.setAttribute('id', 'task-3');
buttonCompare.addEventListener('click', () => {
    console.log(compareFunction(2, 2))
    outputComparisonElement.innerText = compareFunction(3, 2)
});

tasks.appendChild(buttonCompare);



/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší
 * nebo rovno 730, včetě nuly. Používejte for cyklus.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const outputSeries = document.createElement("p")
results.appendChild(outputSeries)


const functionMultiplier = () => {
    let string = ""
    for (let i = 0; i <= 730; i += 13) {
        string += i + " "
        console.log(i);
    }
    outputSeries.innerText = string
}

const buttonMulti = document.createElement('button');
buttonMulti.innerText = 'Multiply 13 Button';
buttonMulti.setAttribute('id', 'task-3');
buttonMulti.addEventListener('click', () => {
    functionMultiplier()
});
tasks.appendChild(buttonMulti);



/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
const outputCircleArea = document.createElement("p")
results.appendChild(outputCircleArea)


const circleArea = (radius) => {
    const area = 2 * Math.PI * radius
    const output = `Circle area is ${area}`
    console.log(output)
    outputCircleArea.innerText = output
}

const buttonArea = document.createElement('button');
buttonArea.innerText = 'Circle Area Button';
buttonArea.setAttribute('id', 'task-4');
buttonArea.addEventListener('click', () => {
    circleArea(5)
});
tasks.appendChild(buttonArea);


/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
const outputConeVolume = document.createElement("p")
results.appendChild(outputConeVolume)


const coneVolume = (radius, height) => {
    const baseArea = Math.PI * radius * radius
    const volume = (baseArea * height) / 3
    const output = `Cone volume is ${volume}`
    console.log(output)
    outputConeVolume.innerText = output
}

const buttoConeVolume = document.createElement('button');
buttoConeVolume.innerText = 'Cone Volume Button';
buttoConeVolume.setAttribute('id', 'task-5');
buttoConeVolume.addEventListener('click', () => {
    coneVolume(5, 10)
});
tasks.appendChild(buttoConeVolume);


/**
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
const outputIsTriangle = document.createElement("p")
results.appendChild(outputIsTriangle)

const isTriangle = (a, b, c) => {
    if (a + b > c && a + c > b && b + c > a) {
        const output = `We can make a triangle from sides of length ${a}, ${b} and ${c}`
        console.log(output);
        outputIsTriangle.innerText = output

        return true;
    }
    const output = `Triangle not possible`;
    console.log(output);
    outputIsTriangle.innerText = output
    return false
}
const triangleButton = document.createElement('button');
triangleButton.innerText = 'Check Triangle Button';
triangleButton.setAttribute('id', 'task-6');
triangleButton.addEventListener('click', () => {
    isTriangle(1, 6, 6)
});
tasks.appendChild(triangleButton);

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
const areaOutputElement = document.createElement('p');
areaOutputElement.setAttribute('id', 'areaOutput')
results.appendChild(areaOutputElement)

const triangleArea = (a, b, c) => {
    const selectedElement = document.querySelector('#areaOutput')
    
    if (isTriangle(a, b, c)) {
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        const outputMessage = `Triangle area is ${area}`;
        selectedElement.innerText = outputMessage
        console.log(outputMessage);
        return area
    };
    selectedElement.innerText = `Its not possible to make a triangle`;
    return
}

const triangleAreaButton = document.createElement('button');
triangleAreaButton.innerText = 'Triangle Area Button';
triangleAreaButton.setAttribute('id', 'task-6');
triangleAreaButton.addEventListener('click', () => {
    triangleArea(1, 6, 6)
});
tasks.appendChild(triangleAreaButton);

