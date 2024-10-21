/* HOMEWORK */
/**
 * 0) Pre-preparation.
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

const yearOfBirth = 2000;
const thisYear = new Date().getFullYear();

console.log(`Pepovi je ${thisYear-yearOfBirth} let`);


/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */

const celsius = 30;
const fahrenheiht = 60;

const celsiusToFahrenheiht = celsius*9/5+32;
const frahrenheihtToCelsius = fahrenheiht-32*5/9;

console.log(`${celsius}°C = ${celsiusToFahrenheiht}°F`);
console.log(`${fahrenheiht}°F = ${frahrenheihtToCelsius}°C`);


/**
 * 3) Funkce function fonction funktio. Vemte předchozí úlohy a udělejte z nich funkce. Tj. vytvoříte funkce, 
 * které přijímají argumenty, a na základě argumentů po zavolání vypíše výsledek na konzoli. 
 * Párkrát zavolejte tyto funkce s různými argumenty. V konzoli také vyzkoušejte, zda fungují vaše funkce. 
 */

const getAge = (birthYear) => {
    return new Date().getFullYear() - birthYear;
};
console.log(getAge(1999));
console.log(getAge(1965));

const getCelsiusToFahranheiht = (celsius) => {
    return celsius*9/5+32;
};
console.log(getCelsiusToFahranheiht(0));
console.log(getCelsiusToFahranheiht(-20));

const getFahrenheihtToCelsius = (fahrenheiht) => {
    return (fahrenheiht-32)*5/9;
}
console.log(getFahrenheihtToCelsius(70));
console.log(getFahrenheihtToCelsius(100));

/**
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

const tasks = document.querySelector('#tasks');
const results = document.querySelector('#results');

const buttonGetAge = document.createElement('button');
buttonGetAge.innerText = "Úloha 1 (Pepe's age)";
buttonGetAge.setAttribute('id', 'task-1');
tasks.appendChild(buttonGetAge);

buttonGetAge.addEventListener('click', () => {
    results.innerText = `Řešení 1. úlohy: ${getAge(1950)}`;
});

const buttonGetCelsiusToFahranheiht = document.createElement('button');
buttonGetCelsiusToFahranheiht.innerText = 'Úloha 2 (Celcius to Fahrenheiht)';
buttonGetCelsiusToFahranheiht.setAttribute('id', 'task-2');
tasks.appendChild(buttonGetCelsiusToFahranheiht);

buttonGetCelsiusToFahranheiht.addEventListener('click', () => {
    results.innerText = `Řešení 2. úlohy: ${getCelsiusToFahranheiht(15)}`;
});

const buttonGetFahrenheihtToCelsius = document.createElement('button');
buttonGetFahrenheihtToCelsius.innerText = 'Úloha 3 (Fahrenheiht to Celcius)';
buttonGetFahrenheihtToCelsius.setAttribute('id', 'task-3');
tasks.appendChild(buttonGetFahrenheihtToCelsius);

buttonGetFahrenheihtToCelsius.addEventListener('click', () => {
    results.innerText = `Řešení 3. úlohy: ${getFahrenheihtToCelsius(80)}`
})

/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */

const getQuotient = (number1, number2) => {
    if (number2 === 0) {
        return 'Nulou nelze dělit!';
    }
    return `Řešení 4. úlohy: ${number2} je ${(number2/number1*100).toFixed(1)}% z ${number1}`;
}

const buttonGetQuotient = document.createElement('button');
buttonGetQuotient.innerText = 'Úloha 4 (Podíl čísla)';
buttonGetQuotient.setAttribute('id', 'task-4');
tasks.appendChild(buttonGetQuotient);

buttonGetQuotient.addEventListener('click', () => {
    results.innerText = getQuotient(27,16);
})


/**
 * 5) Kdo z koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */

const compare = (number1, number2) => {
    if (number1 > number2) {
        return number1;
    }
    if (number2 > number1) {
        return number2;
    }
    return 'Čísla se rovnají.';
};

const buttonCompare1 = document.createElement('button');
buttonCompare1.innerText = 'Úloha 5 (Porovnání celých čísel)';
buttonCompare1.setAttribute('id', 'task-5');
tasks.appendChild(buttonCompare1);

const comparison1 = compare(-5,-8);
buttonCompare1.addEventListener('click', () => {
    results.innerText = `Řešení 5. úlohy: ${comparison1}`;
})


const buttonCompare2 = document.createElement('button');
buttonCompare2.innerText = 'Úloha 5 (Porovnání desetinných čísel)';
buttonCompare2.setAttribute('id', 'task-5');
tasks.appendChild(buttonCompare2);

const comparison2 = compare(1.9, 1.9);
buttonCompare2.addEventListener('click', () => {
    results.innerText = `Řešení 5. úlohy: ${comparison2}`;
})


const buttonCompare3 = document.createElement('button');
buttonCompare3.innerText = 'Úloha 5 (Porovnání zlomků)';
buttonCompare3.setAttribute('id', 'task-5');
tasks.appendChild(buttonCompare3);

const comparison3 = compare(1/3, 2/3);
buttonCompare3.addEventListener('click', () => {
    results.innerText = `Řešení 5. úlohy: ${comparison3}`;
})

/**
 * 6) I can clearly see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */

const multiply13 = [];
for (let i = 0; i <= 730; i += 13) {
    multiply13.push(i);
};

const buttonMultiply13 = document.createElement('button');
buttonMultiply13.innerText = 'Úloha 6 (Násobky 13)';
buttonMultiply13.setAttribute('id', 'task-6');
tasks.appendChild(buttonMultiply13);

buttonMultiply13.addEventListener('click', () => {
    results.innerText = `Řešení 6. úlohy: ${multiply13.join(', ')}`;
})

/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */

const circle = (r) => {
    return (Math.PI * r ** 2).toFixed(2);
};

const resultCircle = circle(3);

const buttonCircle = document.createElement('button');
buttonCircle.innerText = 'Úloha 7 (Obsah kruhu)';
buttonCircle.setAttribute('id', 'task-7');
tasks.appendChild(buttonCircle);

buttonCircle.addEventListener('click', () => {
    results.innerText = `Řešení 7. úlohy: ${resultCircle}`;
})


/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const cone = (h, r) => {
    return (1/3 * Math.PI * r ** 2 * h).toFixed(2);
};

const resultCone = cone(5,3);

const buttonCone = document.createElement('button');
buttonCone.innerText = 'Úloha 8 (Objem kužele)';
buttonCone.setAttribute('id', 'task-8');
tasks.appendChild(buttonCone);

buttonCone.addEventListener('click', () => {
    results.innerText = `Řešení 8. úlohy: ${resultCone}`;
})

/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */

const isTriangle = (a, b, c) => {
    if (a + b > c && a + c > b && b + c > a) {
        return true;
    }
    return false;
};

const resultTriangle = isTriangle(5,4,2);

const buttonTriangle = document.createElement('button');
buttonTriangle.innerText = 'Úloha 9 (Trojúhelník)';
buttonTriangle.setAttribute('id', 'task-9');
tasks.appendChild(buttonTriangle);

buttonTriangle.addEventListener('click', () => {
    results.innerText = `Řešení 9. úlohy: ${resultTriangle}`;
})


/**
 * 10) Heroic performance. Vytvořte funkci, která vypočte a vypíše obsah trojúhelníka podle Heronova vzorce, 
 * tj. funkce dostane délky všech 3 stran. Použijte přitom předchozí validaci v úloze č. 9, tj. počítejte pouze, 
 * když to má smysl. Hint: funkce pro odmocninu je Math.sqrt().
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */

const HeronTriangle = (a, b, c) => {
    if (!isTriangle(a, b, c)) {
        return "Není trojúhelník";
    }
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    return area.toFixed(2);
};

const resultHeronTriangle = HeronTriangle(5,4,4);

const buttonHeronTriangle = document.createElement('button');
buttonHeronTriangle.innerText = 'Úloha 10 (Obsah trojúhelníku)';
buttonHeronTriangle.setAttribute('id', 'task-10');
tasks.appendChild(buttonHeronTriangle);

buttonHeronTriangle.addEventListener('click', () => {
    results.innerText = `Řešení 10. úlohy: ${resultHeronTriangle}`;
});

