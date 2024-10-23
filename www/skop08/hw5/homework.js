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
console.log("Ahoj světe!");

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here
const pepesYear = 2000
const currentYear = new Date().getFullYear();
console.log(`Pepa má ${currentYear - pepesYear} let.`);




/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const tempC = 20;
const tempF = 68;

const convertedF = (tempC * 9 / 5) + 32
const convertedC = (tempF - 32) * 5 / 9

console.log(`${tempC} °C = ${convertedF} °F`)
console.log(`${tempF} °F = ${convertedC} °C`)

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
const task0 = document.createElement('button');
task0.innerText = "Uloha 0 (Pre-preparacion)";
task0.setAttribute('id', 'task-0');
task0.addEventListener('click', () => {
    sayHello();
});

const task1 = document.createElement('button');
task1.innerText = "Uloha 1 (Pepe's age)";
task1.setAttribute('id', 'task-1');
task1.addEventListener('click', () => {
    pepesAge(2001);
});

const task2 = document.createElement('button');
task2.innerText = "Uloha 2 (WTF)";
task2.setAttribute('id', 'task-2');
task2.addEventListener('click', () => {
    convertTemp(30, 17);
});

var tasks = document.querySelector('#tasks');
tasks.appendChild(task0);
tasks.appendChild(task1);
tasks.appendChild(task2);

const pepesAge = (pepesYear) => {
    var currentYear = new Date().getFullYear();
    console.log(`Pepa má ${currentYear - pepesYear} let.`);
    };
const convertTemp = (tempC, tempF) =>{
    var convertedF = (tempC * 9 / 5) + 32
    var convertedC = (tempF - 32) * 5 / 9

    console.log(`${tempC} °C = ${convertedF} °F`)
    console.log(`${tempF} °F = ${convertedC} °C`)
}
const sayHello = () =>{
    console.log("Ahoj světe!");
}


/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const task4 = document.createElement('button');
task4.innerText = "Uloha 4 (%CENSORED%)";
task4.setAttribute('id', 'task-4');
task4.addEventListener('click', () => {
    division(13, 45);
});

tasks.appendChild(task4);
var results = document.querySelector('#results');

const division = (number1, number2) => {
    if (number2 === 0) {
        printToResults("Nelze dělit nulou");
        return; 
    }
    printToResults(`Podil cisla ${number1} z cisla ${number2} je ${(number1 / number2 * 100).toFixed(2)}%`)
};

const printToResults = (paragraphInput) => {
    const paragraph = document.createElement('p');

    paragraph.innerText = paragraphInput;
    
    const resultsDiv = document.getElementById('results');
    if (resultsDiv.firstChild) {
        resultsDiv.insertBefore(paragraph, resultsDiv.firstChild);
    } else {
        resultsDiv.appendChild(paragraph); 
    }
}

/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here
const task5 = document.createElement('button');
task5.innerText = "Uloha 5 (Kdo s koho)";
task5.setAttribute('id', 'task-5');
task5.addEventListener('click', () => {
    compareNumbers(13, 45);
});

tasks.appendChild(task5);

const compareNumbers = (number1, number2) => {
    if (number2 === number1) {
        printToResults("Čísla se rovnají");
        return; 
    }
    else if(number1 > number2)
    {
        printToResults("Číslo jedna je větší než číslo dva");
        return;
    }
    else
    {
        printToResults("Číslo dva je větší než číslo jedna");
        return;
    }
};



/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const task6 = document.createElement('button');
task6.innerText = "Uloha 6 (I can cleary see the pattern)";
task6.setAttribute('id', 'task-6');
task6.addEventListener('click', () => {
    printNumbersMulti();
});

tasks.appendChild(task6);

const printNumbersMulti = () => {
    for (let i = 0; i < 730; i += 13) {
        console.log(i);
    }
};


/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const task7 = document.createElement('button');
task7.innerText = "Uloha 7 (Around and about)";
task7.setAttribute('id', 'task-7');
task7.addEventListener('click', () => {
    console.log(circleArea(2));
});

tasks.appendChild(task7);

const circleArea = (radius) => {
    return Math.PI * radius ** 2;
};



/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const task8 = document.createElement('button');
task8.innerText = "Uloha 8 (Another dimension.)";
task8.setAttribute('id', 'task-8');
task8.addEventListener('click', () => {
    console.log(coneVolume(2, 3));
});

tasks.appendChild(task8);

const coneVolume = (height, radius) => {
    return Math.PI * radius ** 2 * height / 3;
};



/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const task9 = document.createElement('button');
task9.innerText = "Uloha 9 (Not sure if triangle)";
task9.setAttribute('id', 'task-9');
task9.addEventListener('click', () => {
    console.log(isTriangle(2, 3, 7));
});

tasks.appendChild(task9);

const isTriangle = (number1, number2, number3) => {
    console.log(`a = ${number1}, b = ${number2}, c = ${number3}`)
    return (number1 + number2 > number3 && number1 + number3 > number2 && number2 + number3 > number1);
};



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

const getHeronTriangleArea = (number1, number2, number3) => {
    if (!isTriangle(number1, number2, number3)) {
        const retMess = `Neni to validni trojuhelnik`;
        return retMess;
    }
    const s = (number1 + number2 + number3) / 2;
    const area = Math.sqrt(s * (s - number1) * (s - number2) * (s - number3));
    return area;
};

const task10 = document.createElement('button');
task10.innerText = "Uloha 10 (Heroic performance)";
task10.setAttribute('id', 'task-9');
task10.addEventListener('click', () => {
    printToResults(getHeronTriangleArea(2, 3, 7));
});

tasks.appendChild(task10);