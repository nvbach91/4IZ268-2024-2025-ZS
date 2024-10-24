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
const birthYear = 1999;

const ageMessage = (birthYear) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    const sentence = `Pepovi je ${age} let.`;
    console.log(sentence)
    document.getElementById('results').innerText = sentence;
};

/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak.
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32.
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9.
 */
// Solution here
const celsiusTemp = 20;
const fahrenheihtTemp = 68;
const celsiusToF = (celsius) => {
    const fahrenheiht = celsius * 9 / 5 + 32;
    const sentence = `${celsius}°C =  ${fahrenheiht}°F`;
    console.log(sentence)
    document.getElementById('results').innerText = sentence;
}
const fahrenheihtToC = (fahrenheiht) => {
    const celsius = (fahrenheiht - 32) * 5 / 9;
    const sentence = `${fahrenheiht}°F =  ${celsius}°C`;
    console.log(sentence)
    document.getElementById('results').innerText = sentence;
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

const tasks = document.querySelector('#tasks');

const buttonTask1 = document.createElement('button');

buttonTask1.innerText = "Uloha 1 (Pepe's age)";

buttonTask1.setAttribute('id', 'task-1');

buttonTask1.addEventListener('click', () => {
    ageMessage(birthYear);
});
tasks.appendChild(buttonTask1);
const buttonTask2a = document.createElement('button');

buttonTask2a.innerText = "Uloha 2 WTF (wow, that's fun) C to F";

buttonTask2a.setAttribute('id', 'task-2a');

buttonTask2a.addEventListener('click', () => {
    celsiusToF(celsiusTemp);
});

tasks.appendChild(buttonTask2a);

const buttonTask2b = document.createElement('button');

buttonTask2b.innerText = "Uloha 2 WTF (wow, that's fun) F to C";

buttonTask2b.setAttribute('id', 'task-2b');

buttonTask2b.addEventListener('click', () => {
    fahrenheihtToC(fahrenheihtTemp);
});

tasks.appendChild(buttonTask2b);



/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla.
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2);
 * Pozor na dělení nulou!
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here
const divide = (a, b) => {
    if (b === 0) {
        return 'nelze dělit 0'
    } else {
        const percantage = (a / b) * 100;
        const sentence = `${a} je ${percantage}% z ${b}`;
        console.log(sentence);
        document.getElementById('results').innerText = sentence;
    }
}

const buttonTask4 = document.createElement('button');

buttonTask4.innerText = "4) %CENSORED%";

buttonTask4.setAttribute('id', 'task-4');

buttonTask4.addEventListener('click', () => {
    divide(5, 10);

});
tasks.appendChild(buttonTask4);


/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají.
 *
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here
const compare = (a, b) => {
    if (a > b) {
        const sentence = 'a je větší než b'
        console.log(sentence)
        document.getElementById('results').innerText = sentence;
    } else if (a < b) {
        const sentence = 'b je větší než a'
        console.log(sentence)
        document.getElementById('results').innerText = sentence;
    } else {
        const sentence = 'a a b se rovnají'
        console.log(sentence)
        document.getElementById('results').innerText = sentence;
    }
}
const buttonTask5 = document.createElement('button');

buttonTask5.innerText = "5) Kdo s koho";

buttonTask5.setAttribute('id', 'task-5');

buttonTask5.addEventListener('click', () => {
    compare(5, 4)
});
tasks.appendChild(buttonTask5);



/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší
 * nebo rovno 730, včetě nuly. Používejte for cyklus.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const loop = () => {
    let sentence = '';
    for (let i = 0; i <= 730; i += 13) {
        console.log(i);
        sentence += i + ' ';
    }
    document.getElementById('results').innerText = sentence;
};
const buttonTask6 = document.createElement('button');

buttonTask6.innerText = "6) I can cleary see the pattern";

buttonTask6.setAttribute('id', 'task-6');

buttonTask6.addEventListener('click', () => {
    loop();
});
tasks.appendChild(buttonTask6);



/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
const radiusCircle = 7;
const calculateCircumference = (r) => {
    const calculation = 2 * Math.PI * r;
    console.log(calculation);
    document.getElementById('results').innerText = calculation;
    return calculation;

}
const buttonTask7 = document.createElement('button');

buttonTask7.innerText = "7) Around and about";

buttonTask7.setAttribute('id', 'task-7');

buttonTask7.addEventListener('click', () => {
    calculateCircumference(radiusCircle);
});
tasks.appendChild(buttonTask7);



/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
const heightCone = 7;
const radiusCone = 2;
const calculateCone = (r, h) => {
    const calculation = (Math.PI * (r ** 2) * h) / 3;
    console.log(calculation);
    document.getElementById('results').innerText = calculation;
    return calculation;


}
const buttonTask8 = document.createElement('button');

buttonTask8.innerText = "8) Another dimension";

buttonTask8.setAttribute('id', 'task-8');

buttonTask8.addEventListener('click', () => {
    calculateCone(radiusCone, heightCone);
});
tasks.appendChild(buttonTask8);




/**
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
triangleValue1 = 0;
triangleValue2 = 2;
triangleValue3 = 3;
const isTriangle = (a, b, c) => {
    const sides = [];
    let sentence = (`a=${a} b=${b} c=${c}`);
    sides.push(a)
    sides.push(b)
    sides.push(c)
    sides.sort(function (a, b) { return a - b })
    if (sides[2] >= sides[0] + sides[1] || sides[0] === 0) {
        sentence += ' This is not a triangle';
        console.log(sentence)
        document.getElementById('results').innerText = sentence;
        return false;
    } else {
        sentence += ' This is a triangle';
        console.log(sentence)
        document.getElementById('results').innerText = sentence;
        return true;
    }
}
const buttonTask9 = document.createElement('button');

buttonTask9.innerText = "9) Not sure if triangle, or just some random values";

buttonTask9.setAttribute('id', 'task-9');

buttonTask9.addEventListener('click', () => {
    isTriangle(triangleValue1, triangleValue2, triangleValue3)
});
tasks.appendChild(buttonTask9);



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
const calculateTriangle = (a, b, c) => {
    if (isTriangle(a, b, c)) {
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        document.getElementById('results').innerText = area;
        return area
    } else {
        return 'This is not a triangle';
    }
}
const buttonTask10 = document.createElement('button');

buttonTask10.innerText = "10) Heroic performance";

buttonTask10.setAttribute('id', 'task-10');

buttonTask10.addEventListener('click', () => {

    console.log(calculateTriangle(4, 5, 7));
});
tasks.appendChild(buttonTask10);