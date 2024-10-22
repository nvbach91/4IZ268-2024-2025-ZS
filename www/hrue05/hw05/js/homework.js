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

const year = 2003;

console.log(`This is Pepe. He is ${2024-year} years old`);




/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here

const celsius = 20;
const fahrenheit = 68;


console.log(`${celsius}°C = ${celsius*9/5+32}°F`);
console.log(`${fahrenheit}°F = ${(fahrenheit-32)*5/9}°C`);



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

const pepesAge = (birthyear) => {
    console.log(`This is Pepe. He is ${2024-birthyear} years old`);
};

const convertedValue = 68;
const cOrF = 'c';

const convert = (value, cf) => {
    if (cf==='c') {
        console.log(`${value}°C = ${value*9/5+32}°F`);
    }
    else if (cf==='f') {
        console.log(`${value}°F = ${(value-32)*5/9}°C`);
    }
    else {
        console.log('Error');
    };
}

const buttonPepe = document.createElement('button');
buttonPepe.innerText = 'Uloha 1 (Pepe\'s age)';
buttonPepe.setAttribute('id', 'task-1');
buttonPepe.addEventListener('click', () => {pepesAge(year);});
const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonPepe);

const buttonConvert = document.createElement('button');
buttonConvert.innerText = 'Uloha 2 (WTF (wow, that\'s fun))';
buttonConvert.setAttribute('id', 'task-2');
buttonConvert.addEventListener('click', () => {convert(convertedValue, cOrF);});
tasks.appendChild(buttonConvert);




/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here
const results = document.querySelector('#results');
const argumentA = 1;
const argumentB = 6;

const censoredResult = document.createElement("div");
censoredResult.setAttribute('id', 'result-1');
results.appendChild(censoredResult);

const censored = (a,b) => {
    if (b===0) {
        console.log('Error');
    }
    else {
        const result = a/b * 100;
        censoredResult.textContent = `${a} is ${result.toFixed(0)}% of ${b}`;
    };
};

const buttonCensored = document.createElement('button');
buttonCensored.innerText = '%CENSORED%';
buttonCensored.setAttribute('id', 'task-3');
buttonCensored.addEventListener('click', () => {censored(argumentA,argumentB);});
tasks.appendChild(buttonCensored);



/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here

// Zde změnit číslo, které se pak třemi tlačítky porovná s různými typy
const variable = 4.7;

const bigger = document.createElement("div");
bigger.setAttribute('id', 'result-2');
results.appendChild(bigger);

const compare = (a,b) => {
    if (a==b) {
        bigger.textContent = `${a} is equal to ${b}`;
    }
    else if (a>b){
        bigger.textContent = `${a} is bigger than ${b}`;
    }
    else {
        bigger.textContent = `${a} is smaller than ${b}`;
    };
};

const buttonBiggerOne = document.createElement('button');
buttonBiggerOne.innerText = 'Zlomek';
buttonBiggerOne.setAttribute('id', 'task-4');
buttonBiggerOne.addEventListener('click', () => {compare(variable, 9/5);});
tasks.appendChild(buttonBiggerOne);

const buttonBiggerTwo = document.createElement('button');
buttonBiggerTwo.innerText = 'Celé číslo';
buttonBiggerTwo.setAttribute('id', 'task-5');
buttonBiggerTwo.addEventListener('click', () => {compare(variable, 8);});
tasks.appendChild(buttonBiggerTwo);

const buttonBiggerThree = document.createElement('button');
buttonBiggerThree.innerText = 'Desetinné číslo';
buttonBiggerThree.setAttribute('id', 'task-6');
buttonBiggerThree.addEventListener('click', () => {compare(variable, 7.5);});
tasks.appendChild(buttonBiggerThree);


/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const thirteen = () => {
    const iterations = Math.floor(730/13);
    var sum = 0;
    for (let i = 0; i < iterations; i++ ){
        sum += 13;
        console.log(sum);
    };
};

const buttonPattern = document.createElement('button');
buttonPattern.innerText = 'Pattern';
buttonPattern.setAttribute('id', 'task-7');
buttonPattern.addEventListener('click', () => {thirteen();});
tasks.appendChild(buttonPattern);




/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const circleCalculate = (r) => {
    console.log((r**2)*Math.PI);
};

const buttonCircle = document.createElement('button');
buttonCircle.innerText = 'Circle';
buttonCircle.setAttribute('id', 'task-8');
buttonCircle.addEventListener('click', () => {circleCalculate(6);});
tasks.appendChild(buttonCircle);



/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const coneCalculate = (r, v) => {
    console.log((r**2)*Math.PI*v);
};

const buttonCone = document.createElement('button');
buttonCone.innerText = 'Cone';
buttonCone.setAttribute('id', 'task-9');
buttonCone.addEventListener('click', () => {coneCalculate(2,3);});
tasks.appendChild(buttonCone);




/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here


const triangleCalculate = (a,b,c) => {
    if (((a+b)>c)&((a+c)>b)&((b+c)>a)){
        console.log(true);
        return true;
    }
    else {
        console.log(false);
        return false;
    };
};

const buttonTriangle = document.createElement('button');
buttonTriangle.innerText = 'Triangle';
buttonTriangle.setAttribute('id', 'task-10');
buttonTriangle.addEventListener('click', () => {triangleCalculate(5,3,7);});
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

const heron = document.createElement("div");
heron.setAttribute('id', 'result-3');
results.appendChild(heron);

const heronCalculate = (a,b,c) => {
    if (triangleCalculate(a,b,c)===false) {
        heron.textContent = 'Error';
    }
    else {
        const s = (a+b+c)/2;
        const area = Math.sqrt(s*(s-a)*(s-b)*(s-c));
        heron.textContent = area;
    };
};

const buttonHeron = document.createElement('button');
buttonHeron.innerText = 'Heron';
buttonHeron.setAttribute('id', 'task-11');
buttonHeron.addEventListener('click', () => {heronCalculate(5,3,7)});
tasks.appendChild(buttonHeron);

