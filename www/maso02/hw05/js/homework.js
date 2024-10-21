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

console.log("Hello world!");

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here

const birthYear = 2002;

console.log(`Pepe will be ${new Date().getFullYear() - birthYear} years old by the end of this year!`)

/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here

console.log(`20°C = ${20 * 9 / 5 + 32}°F`)
console.log(`68°F = ${(68 - 32) * 5 / 9}°C`)

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

const pepesAge = (birthYear) => {
    const currentYear = new Date().getFullYear()
    console.log(`Pepe will be ${currentYear - birthYear} years old by the end of this year!`)
};

pepesAge(2000)
pepesAge(1999)
pepesAge(1998)

const celsToFahr = (celsTemp) => {
    const fahrTemp = celsTemp * 9 / 5 + 32;
    console.log(`${celsTemp}°C = ${fahrTemp}°F`)
};

celsToFahr(20)
celsToFahr(25)
celsToFahr(30)

const fahrToCels = (fahrTemp) => {
    const celsTemp = (fahrTemp - 32) * 5 / 9;
    console.log(`${fahrTemp}°F = ${celsTemp}°C`)
};

fahrToCels(68)
fahrToCels(77)
fahrToCels(86)

const createButton = (buttonText, buttonID, buttonCallback) => {
    const newButton = document.createElement("button");
    newButton.innerText = buttonText;
    newButton.setAttribute("id", buttonID);
    newButton.addEventListener("click", buttonCallback);
    const tasks = document.querySelector("#tasks");
    tasks.appendChild(newButton);
};

createButton("Task 1 (Pepe's age)", "task-0", () => {
    pepesAge(2002);
});

createButton("Task 2 (Celsius to Fahrenheit)", "task-1a", () => {
    celsToFahr(20);
});

createButton("Task 2 (Fahrenheit to Celsius)", "task-1b", () => {
    fahrToCels(68);
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

const divisionPerc = (a, b) => {
    if (b === 0) {
        return "Pls don't divide by zero :("
    } else {
        const result = a / b;
        return `${a} is ${(result*100).toFixed(2)} % of ${b}`
    };
};

const viewInResultsDiv = (resultText) => {
    const resultsDiv = document.getElementById("results");
    const newDiv = document.createElement("div");
    newDiv.style.marginTop = "20px";
    newDiv.style.maxWidth = "100vw";
    newDiv.style.overflowWrap = "break-word";
    const textNode = document.createTextNode(resultText);
    newDiv.appendChild(textNode);
    resultsDiv.appendChild(newDiv);
}

createButton("Task 4 (Divide and return percentage)", "task-2", () => {
    viewInResultsDiv(divisionPerc(17, 68));
});

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
    if (a === b) {
        return `${a} and ${b} are equal!!! So happy.`
    } else if (a > b) {
        return `${a} is greater (than ${b})`
    } else {
        return `${b} is greater (than ${a})`
    };
};

createButton("Task 5 (Compare numbers - integers)", "task-3a", () => {
    viewInResultsDiv(compareNumbers(1, 1));
});

createButton("Task 5 (Compare numbers - floats)", "task-3b", () => {
    viewInResultsDiv(compareNumbers(1.0, 3.0));
});

createButton("Task 5 (Compare numbers - fractions)", "task-3c", () => {
    viewInResultsDiv(compareNumbers((1/2), (1/3)));
});

createButton("Task 5 (Compare numbers - int and float)", "task-3d", () => {
    viewInResultsDiv(compareNumbers(1, 1.0));
});

createButton("Task 5 (Compare numbers - int and fraction)", "task-3e", () => {
    viewInResultsDiv(compareNumbers(3, (3/2)));
});

createButton("Task 5 (Compare numbers - float and fraction)", "task-3f", () => {
    viewInResultsDiv(compareNumbers(1.2, (2/3)));
});

/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const multiplesOf13 = () => {
    let result13Multiples = [];
    for (let i = 0; i <= 730; i += 13) {
        result13Multiples.push(i);
    };
    return result13Multiples;
};

createButton("Task 6 (Write out multiples of 13 from 0 to 730)", "task-4", () => {
    viewInResultsDiv(multiplesOf13());
});

/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const circleArea = (radius) => {
    return `Circle with radius ${radius} has area of ${(3.1415926*radius**2).toFixed(4)}`;
};

createButton("Task 7 (Circle area)", "task-5", () => {
    viewInResultsDiv(circleArea(5));
});

/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const coneVolume = (height, radius) => {
    return `Cone with height ${height} and radius ${radius} has volume of ${(3.1415926*radius**2*(height/3)).toFixed(4)}`;
};

createButton("Task 8 (Cone volume)", "task-6", () => {
    viewInResultsDiv(coneVolume(10, 3));
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

const triangleCheck = (a, b, c) => {
    return (a + b > c && a + c > b && b + c > a);
};

createButton("Task 9 (Is it a triangle? - y)", "task-7a", () => {
    viewInResultsDiv(`Can you form a traingle with side lengths 3, 4, 5?`);
    if (triangleCheck(3, 4, 5)) {
        viewInResultsDiv("yes");
    } else {
        viewInResultsDiv("no");
    };
});

createButton("Task 9 (Is it a triangle? - n)", "task-7b", () => {
    viewInResultsDiv(`Can you form a traingle with side lengths 3, 4, 100?`);
    if (triangleCheck(3, 4, 100)) {
        viewInResultsDiv("yes");
    } else {
        viewInResultsDiv("no");
    };
});

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
    if (triangleCheck(a, b, c)) {
        const s = (a + b + c) / 2;
        const res = `Triangle with side lenghts ${a}, ${b}, ${c} has area of ${Math.sqrt(s * (s - a) * (s - b) * (s - c))}`;
        viewInResultsDiv(res);
    } else {
        viewInResultsDiv("I won't compute area for non-euclidean triangles, thanks.");
    };
};

createButton("Task 10 (Triangle area - y)", "task-8", () => {
    triangleArea(3,4,5);
});

createButton("Task 10 (Triangle area - n)", "task-8", () => {
    triangleArea(3,4,100);
});
