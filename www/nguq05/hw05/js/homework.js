/* HOMEWORK */
/**
 * 0) Pre-preparation.
 * - Vytvořte HTML stránku s nadpisem h1 "JavaScript is awesome!" 
 * - Na stránce vytvořte místo pro umístění jednotlivých spouštěčů úkolů - tlačítek (tj. div, který má id s hodnotou "tasks" - <div id="tasks"></div>). 
 * - Na stránce vytvořte místo pro výpis výsledků úkolů (div, který má id s hodnotou "results" - <div id="results"></div>).
 * 
 * - Připojte tento homework.js soubor k vytvořené HTML stránce pomocí tagu <script> (viz LAB) a vyzkoušejte
 * console.log('Ahoj světe');
 */
console.log('Ahoj světe');

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here
const year = new Date().getFullYear();
const pepeBirth = 1999;

const pepeAge = year - pepeBirth;
console.log("Pepe is " + pepeAge + " years old.");

/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const fahrenheiht = 68;
const celsius = 20;

const ctoF = ((celsius * 9) / 5) + 32;
const ftoC = ((fahrenheiht - 32) * 5) / 9;

console.log(celsius + "°C = " + ctoF + "°F");
console.log(fahrenheiht + "°F = " + ftoC + "°C");

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
// deklarace a implementace funkce

// A) Pepe's Age:
const calcPepeAge = (currentYear, pepeYear) => {
    console.log("Pepe is " + (currentYear - pepeYear) + " years old.");
};

const buttonUloha1 = document.createElement('button');
buttonUloha1.innerText = 'Uloha 1: Pepes Age';
buttonUloha1.setAttribute('id', 'task-1');
buttonUloha1.addEventListener('click', () => {
    calcPepeAge(year, pepeBirth);
});

const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonUloha1);

// B) WTF:
const convertTemp = (c, f) => {
    const convertToF = ((c * 9) / 5) + 32;
    const convertToC = ((f - 32) * 5) / 9;
    console.log(c + "°C = " + convertToF + "°F");
    console.log(f + "°F = " + convertToC + "°C");
};

const buttonUloha2 = document.createElement('button');
buttonUloha2.innerText = 'Uloha 2: WTF';
buttonUloha2.setAttribute('id', 'task-2');
buttonUloha2.addEventListener('click', () => {
    convertTemp(celsius, fahrenheiht);
});

tasks.appendChild(buttonUloha2);

/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla.
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2);
 * Pozor na dělení nulou!
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here
const calcNumbers = (a, b) => {
    if (b === 0) {
        return 'Cannot be calculated :(';
    }
    else {
        const percentage = (a / b) * 100;
        return a.toFixed(2) + ' je ' + percentage.toFixed(2) + "% z " + b.toFixed(2);
    }
}

const firstNumber = 5;
const secondNumber = 10;

const results = document.querySelector('#results');
const buttonUloha4 = document.createElement('button');
tasks.appendChild(buttonUloha4);
buttonUloha4.innerText = 'Uloha 4: %CENSORED%';
buttonUloha4.setAttribute('id', 'task-4');
buttonUloha4.addEventListener('click', () => {
    results.textContent = calcNumbers(firstNumber, secondNumber);
});

/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného
 * místa na stránce. Pokud se čísla rovnají, vypište, že se rovnají.
 *
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here

// A) Celá čísla:
const compareIntNumbers = (a, b) => {
    if (a > b) {
        return a;
    } else if (a < b) {
        return b;
    } else {
        return 'Čísla se rovnají. První číslo je ' + a + ' a druhé číslo je také ' + b + '.';
    }
}

const intFirstNum = 6;
const intSecondNum = 68;

const buttonUloha5_A = document.createElement('button');
tasks.appendChild(buttonUloha5_A);
buttonUloha5_A.innerText = 'Uloha 5: Kdo s koho (Celá čísla)';
buttonUloha5_A.setAttribute('id', 'task-5');
buttonUloha5_A.addEventListener('click', () => {
    results.textContent = compareIntNumbers(intFirstNum, intSecondNum);
});

// B) Desetinná čísla:
const compareDecimalNumbers = (a, b) => {
    if (a > b) {
        return a;
    } else if (a < b) {
        return b;
    } else {
        return 'Čísla se rovnají. První číslo je ' + a + ' a druhé číslo je také ' + b + '.';
    }
}

const decimalFirstNum = 8.5;
const decimalSecondNum = 6.1;

const buttonUloha5_B = document.createElement('button');
tasks.appendChild(buttonUloha5_B);
buttonUloha5_B.innerText = 'Uloha 5: Kdo s koho (Desetinná čísla)';
buttonUloha5_B.setAttribute('id', 'task-5');
buttonUloha5_B.addEventListener('click', () => {
    results.textContent = compareDecimalNumbers(decimalFirstNum, decimalSecondNum);
});

// C) Zlomky:
const compareFractionNumbers = (a, b) => {
    if (a > b) {
        return a;
    } else if (a < b) {
        return b;
    } else {
        return 'Čísla se rovnají. První číslo je ' + a + ' a druhé číslo je také ' + b + '.';
    }
}

const fractionFirst = 10 / 9;
const fractionSecond = 10 / 9;

const buttonUloha5_C = document.createElement('button');
tasks.appendChild(buttonUloha5_C);
buttonUloha5_C.innerText = 'Uloha 5: Kdo s koho (Zlomky)';
buttonUloha5_C.setAttribute('id', 'task-5');
buttonUloha5_C.addEventListener('click', () => {
    results.textContent = compareFractionNumbers(fractionFirst, fractionSecond);
});


/**
 * 6) I can clearly see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší
 * nebo rovno 730, včetě nuly. Používejte for cyklus.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const calcMultiplier = () => {
    for (let i = 0; i <= 730; i += 13) {
        results.textContent += i + ' ';
    }
}

const buttonUloha6 = document.createElement('button');
tasks.appendChild(buttonUloha6);
buttonUloha6.innerText = 'Uloha 6: I can clearly see the pattern';
buttonUloha6.setAttribute('id', 'task-6');
buttonUloha6.addEventListener('click', () => {
    calcMultiplier();
});


/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
const calcAreaCircle = (r) => {
    results.textContent = Math.PI * r ** 2;
}

const radius = 3;

const buttonUloha7 = document.createElement('button');
tasks.appendChild(buttonUloha7);
buttonUloha7.innerText = 'Uloha 7: Around and about';
buttonUloha7.setAttribute('id', 'task-7');
buttonUloha7.addEventListener('click', () => {
    calcAreaCircle(radius);
});


/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
const calcVolumeCone = (r, h) => {
    results.textContent = (1 / 3) * Math.PI * r ** 2 * h;
}

const height = 8;

const buttonUloha8 = document.createElement('button');
tasks.appendChild(buttonUloha8);
buttonUloha8.innerText = 'Uloha 8: Another dimension';
buttonUloha8.setAttribute('id', 'task-8');
buttonUloha8.addEventListener('click', () => {
    calcVolumeCone(radius, height);
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
const isThisTriangle = (a, b, c) => {
    if (a + b > c && a + c > b && b + c > a) {
        return true;
    }
    else {
        return false;
    }
}

const sidea = 8;
const sideb = 2;
const sidec = 12;

const buttonUloha9 = document.createElement('button');
tasks.appendChild(buttonUloha9);
buttonUloha9.innerText = 'Uloha 9: Not sure if triangle, or just some random values';
buttonUloha9.setAttribute('id', 'task-9');
buttonUloha9.addEventListener('click', () => {
    if (isThisTriangle(sidea, sideb, sidec)) {
        results.textContent = sidea + ', ' + sideb + ', ' + sidec + ' ano';
    } else {
        results.textContent = sidea + ', ' + sideb + ', ' + sidec + ' ne';
    }
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

const calcAreaTriangle = (a, b, c) => {
    if (!isThisTriangle(a, b, c)) {
        results.textContent = 'Not valid';
    } else {
        const s = (a + b + c) / 2;
        results.textContent = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }
}

const heronSidea = 4;
const heronSideb = 2;
const heronSidec = 3;

const buttonUloha10 = document.createElement('button');
tasks.appendChild(buttonUloha10);
buttonUloha10.innerText = 'Uloha 10: Heroic performance';
buttonUloha10.setAttribute('id', 'task-10');
buttonUloha10.addEventListener('click', () => {
    calcAreaTriangle(heronSidea, heronSideb, heronSidec);
});
