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
console.log('Ahoj světe');


/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here

const pepesBirth = 1999;
const currentYear = new Date().getFullYear();
const template = `Pepe is ${currentYear - pepesBirth} years old.`;
console.log(template);



/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here

const C = 20;
const F = 68;
const CtoF = (C*9/5)+32;
const FtoC = (F-32)*5/9;
console.log(`Pokud je ${C}°C, tak je ${CtoF}°F.`);
console.log(`Pokud je ${F}°F, tak je ${FtoC}°C.`);




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
    const currentYear = new Date().getFullYear();
    const template = `Pepe is ${currentYear - birthYear} years old.`;
    console.log(template);
};

pepesAge(1999);
pepesAge(1995);
pepesAge(1973);
pepesAge(2002);


const toFahrenheit = (Celsia) => {
    const CtoF = (Celsia*9/5)+32;
    console.log(`Pokud je ${Celsia}°C, tak je ${CtoF}°F.`);
};

toFahrenheit(20);
toFahrenheit(-20);
toFahrenheit(0);

const toCelsia = (Fahrenheit) => {
    const FtoC = (Fahrenheit-32)*5/9;
    console.log(`Pokud je ${Fahrenheit}°F, tak je ${FtoC}°C.`);
};

toCelsia(68);
toCelsia(-68);
toCelsia(0);


// vytvoření tlačítka
const buttonPepesAge = document.createElement('button');
// nastavení textu tlačítka
buttonPepesAge.innerText = 'Uloha 1 (Pepe\'s age)';
// nastavení atributu id tlačítka
buttonPepesAge.setAttribute('id', 'task-1');

// nabindování funkce na událost click tlačítka
buttonPepesAge.addEventListener('click', () => {
    pepesAge(1000);
});
const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonPepesAge);

const buttonToFahrenheit = document.createElement('button');
buttonToFahrenheit.innerText = 'Uloha 2a (From Celsia to Fahrenheit)';
buttonToFahrenheit.setAttribute('id', 'task-2');

// nabindování funkce na událost click tlačítka
buttonToFahrenheit.addEventListener('click', () => {
    toFahrenheit(13);
});
tasks.appendChild(buttonToFahrenheit);

const buttonToCelsia = document.createElement('button');
buttonToCelsia.innerText = 'Uloha 2b (From Fahrenheit to Celsia)';
buttonToCelsia.setAttribute('id', 'task-3');

// nabindování funkce na událost click tlačítka
buttonToCelsia.addEventListener('click', () => {
    toCelsia(132);
});
tasks.appendChild(buttonToCelsia);




/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const percentage = (a, b) => {
    if (b == 0) {
        return 'Nulou nelze dělit.';
    }
    return `${a} je ${(a/b*100).toFixed(2)}% z ${b}`;
}

const results = document.querySelector('#results');

const buttonPercentage = document.createElement('button');
buttonPercentage.innerText = 'Uloha 4 (Podíl dvou čísel)';
buttonPercentage.setAttribute('id', 'task-4');

// nabindování funkce na událost click tlačítka
buttonPercentage.addEventListener('click', () => {
    results.innerText = percentage(21,37);
});
tasks.appendChild(buttonPercentage);



/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here

const biggerDude = (numberOne, numberTwo) => {
    if (numberOne > numberTwo) {
        return `${numberOne} je větší než ${numberTwo}`;
    } else if (numberOne < numberTwo) {
        return `${numberTwo} je větší než ${numberOne}`;
    } else {
        return `${numberOne} a ${numberTwo} se rovnají`;
    }
    ;
}


const buttonBiggerInt = document.createElement('button');
buttonBiggerInt.innerText = 'Uloha 5 (Větší celé číslo)';
buttonBiggerInt.setAttribute('id', 'task-5');

buttonBiggerInt.addEventListener('click', () => {
    results.innerText = biggerDude(17,28);
});
tasks.appendChild(buttonBiggerInt);


const buttonBiggerDouble = document.createElement('button');
buttonBiggerDouble.innerText = 'Uloha 5 (Větší desetinné číslo)';
buttonBiggerDouble.setAttribute('id', 'task-6');

buttonBiggerDouble.addEventListener('click', () => {
    results.innerText = biggerDude(12.7,12.3);
});
tasks.appendChild(buttonBiggerDouble);


const buttonBiggerFraction = document.createElement('button');
buttonBiggerFraction.innerText = 'Uloha 5 (Větší zlomek)';
buttonBiggerFraction.setAttribute('id', 'task-7');

buttonBiggerFraction.addEventListener('click', () => {
    results.innerText = biggerDude(1/8,2/6);
});
tasks.appendChild(buttonBiggerFraction);




/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const multiplesOf13 = () => {
    let res = [];
    for (let i = 0; i <= 730; i += 13) {
        res.push(i); // prida nasobek do pole res
    }
    return res.join(', '); // Vrátí jako řetězec s oddělovačem čárky;
 };
 const buttonMultiplesOf13 = document.createElement('button');
 buttonMultiplesOf13.innerText = 'Uloha 6 (Násobky 13)';
 buttonMultiplesOf13.setAttribute('id', 'task-8');
 
 buttonMultiplesOf13.addEventListener('click', () => {
     results.innerText = multiplesOf13();
 });
 tasks.appendChild(buttonMultiplesOf13);



/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateCircleArea = (radius) => {
    return (Math.PI*(radius**2)).toFixed(2);
};
const buttonCircleArea = document.createElement('button');
buttonCircleArea.innerText = 'Uloha 7 (Obsah kruhu)';
buttonCircleArea.setAttribute('id', 'task-9');
 
buttonCircleArea.addEventListener('click', () => {
    results.innerText = calculateCircleArea(4);
});
tasks.appendChild(buttonCircleArea);




/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateConeVolume = (h, r) => {
    return (1/3*Math.PI*(r**2)*h).toFixed(2);
};
const buttonConeVolume = document.createElement('button');
    buttonConeVolume.innerText = 'Uloha 8 (Objem kuželu)';
    buttonConeVolume.setAttribute('id', 'task-10');
     
    buttonConeVolume.addEventListener('click', () => {
        results.innerText = calculateConeVolume(4,2);
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

const isTriangle = (d1, d2, d3) => {
    const muzeByt = (d1 + d2 > d3) && (d1 + d3 > d2) && (d2 + d3 > d1);
    if (muzeByt) {
        return 'ano';
    }
    return 'ne';
};
const s1 = 4;
const s2 = 2;
const s3 = 1;
const buttonIsTriangle = document.createElement('button');
    buttonIsTriangle.innerText = 'Uloha 9 (Existence trojuhelniku)';
    buttonIsTriangle.setAttribute('id', 'task-11');
     
    buttonIsTriangle.addEventListener('click', () => {
        results.innerText = `strana 1 = ${s1}, strana 2 = ${s2} a strana 3 = ${s3} -> trojúhelník `+ isTriangle(s1,s2,s3);
    });
    tasks.appendChild(buttonIsTriangle);



/**
 * 10) Heroic performance. Vytvořte funkci, která vypočte a vypíše obsah trojúhelníka podle Heronova vzorce, 
 * tj. funkce dostane délky všech 3 stran. Použijte přitom předchozí validaci v úloze č. 9, tj. počítejte pouze, 
 * když to má smysl. Hint: funkce pro odmocninu je Math.sqrt().
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const heronsFormula = (a1, a2, a3) => {
    if (isTriangle(a1, a2, a3) == 'ne') {
        return 'Nejedná se o trojúhelník.'
    }
    const s = (a1 + a2 + a3)/2;
    return Math.sqrt(s*(s-a1)*(s-a2)*(s-a3)).toFixed(2);
};
const x = 4;
const y = 3;
const z = 2;
const buttonHeronsFormula = document.createElement('button');
    buttonHeronsFormula.innerText = 'Uloha 10 (Heronův vzorec)';
    buttonHeronsFormula.setAttribute('id', 'task-12');
     
    buttonHeronsFormula.addEventListener('click', () => {
        results.innerText = `strana 1 = ${x}, strana 2 = ${y} a strana 3 = ${z} -> obsah trojúhelníka `+ heronsFormula(x,y,z);
    });
    tasks.appendChild(buttonHeronsFormula);


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