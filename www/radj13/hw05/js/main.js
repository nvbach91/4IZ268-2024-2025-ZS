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
console.log('Ahoj světe')



/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here
const pepeBirthYear = 2003;
const actualYear = 2024;
console.log('Pepe is ' + (actualYear - pepeBirthYear) + ' years old');



/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const celsius = 20;
const fahrenheiht = 68;
console.log(celsius + ' °C = ' + ((celsius * 9) / 5 + 32) + ' °F');
console.log(fahrenheiht + ' °F = ' + ((fahrenheiht - 32) * 5 / 9) + ' °C');



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
const pepeAge = () => {
    const pepeBirthYear = 2003;
    const actualYear = 2024;
    console.log('Pepe is ' + (actualYear - pepeBirthYear) + ' years old');
};

const calculateFarenheit = (degrees) => {
    const result = (degrees * 9) / 5 + 32;
    console.log(degrees + ' °C = ' + result + ' °F');
};
const buttonCalculateFarenheit = document.createElement('button');
buttonCalculateFarenheit.innerText = 'calculate farenheit';
buttonCalculateFarenheit.setAttribute('id', 'task-2');
buttonCalculateFarenheit.addEventListener('click', () => {
    calculateFarenheit(20);
});
const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonCalculateFarenheit);

const calculateCelcius = (degrees) => {
    const result = (degrees - 32) * 5 / 9;
    console.log(degrees + ' °F = ' + result + ' °C');
};
const buttonCalculateCelcius = document.createElement('button');
buttonCalculateCelcius.innerText = 'calculate celcius';
buttonCalculateCelcius.setAttribute('id', 'task-3');
buttonCalculateCelcius.addEventListener('click', () => {
    calculateCelcius(68);
});
tasks.appendChild(buttonCalculateCelcius);



/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here
const calculatePercentage = (num1, num2) => {
    if(num2 == 0){
        return "Error: can\'t divide with zero."
    }
    const percentage = (num1 / num2) * 100;

    return `${num1}  je ${percentage.toFixed(2)}% z ${num2}.`;
};
const buttonCalculatePercentage = document.createElement('button');
buttonCalculatePercentage.innerText = 'calculate percentage';
buttonCalculatePercentage.setAttribute('id', 'task-4');
buttonCalculatePercentage.addEventListener('click', () => {
    const result = calculatePercentage(6, 12);
    document.getElementById("results").innerText = result;
});
tasks.appendChild(buttonCalculatePercentage);



/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here
const biggerNum = (num1, num2) => {
    if(num1 > num2){
        return `číslo ${num1} je větší`;
    }
    else if (num1 < num2){
        return `číslo ${num2} je větší`;
    }
    else{
        return `čísla se rovnají (${num1} = ${num2})`;
    }
};
const buttonBiggerNum = document.createElement('button');
buttonBiggerNum.innerText = 'bigger number (int, int)';
buttonBiggerNum.setAttribute('id', 'task-5');
buttonBiggerNum.addEventListener('click', () => {
    const result = biggerNum(10, 5);
    document.getElementById("results").innerText = result;
});
tasks.appendChild(buttonBiggerNum);

const buttonBiggerNum1 = document.createElement('button');
buttonBiggerNum1.innerText = 'bigger number (int, float)';
buttonBiggerNum1.setAttribute('id', 'task-6');
buttonBiggerNum1.addEventListener('click', () => {
    const result = biggerNum(10, 10.1);
    document.getElementById("results").innerText = result;
});
tasks.appendChild(buttonBiggerNum1);

const buttonBiggerNum2 = document.createElement('button');
buttonBiggerNum2.innerText = 'bigger number (float, float)';
buttonBiggerNum2.setAttribute('id', 'task-7');
buttonBiggerNum2.addEventListener('click', () => {
    const result = biggerNum(3.2323, 3.2343);
    document.getElementById("results").innerText = result;
});
tasks.appendChild(buttonBiggerNum2);



/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const pattern = () => {
    for(let i = 1; i * 13 <= 730; i++){
        console.log(' ' + i * 13 + ' ')
    }
};

const buttonPattern = document.createElement('button');
buttonPattern.innerText = 'print multiples of 13';
buttonPattern.setAttribute('id', 'task-8');
buttonPattern.addEventListener('click', () => {
    pattern();
});
tasks.appendChild(buttonPattern);



/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const circleArea = (radius) => {
    return Math.PI * (radius * radius);
};
const buttonCircleArea = document.createElement('button');
buttonCircleArea.innerText = 'calculate area of circle';
buttonCircleArea.setAttribute('id', 'task-9');
buttonCircleArea.addEventListener('click', () => {
    const result = circleArea(4);
    document.getElementById("results").innerText = `the area of this circle is: ${result}`;
});
tasks.appendChild(buttonCircleArea);



/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const volume = (height, radius) => {
    return (1/3) * Math.PI * (radius * radius) * height;
};
const buttonVolume = document.createElement('button');
buttonVolume.innerText = 'calculate volume of cone';
buttonVolume.setAttribute('id', 'task-10');
buttonVolume.addEventListener('click', () => {
    const result = volume(4, 2);
    document.getElementById("results").innerText = `the volume of this cone is: ${result}`;
});
tasks.appendChild(buttonVolume);



/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const checkForTriangle = (a, b, c) => {
    if (a + b > c && a + c > b && b + c > a) {
        console.log(`${a}, ${b}, ${c} -> Ano, lze sestavit trojúhelník.`);
        return true;
    } else {
        console.log(`${a}, ${b}, ${c} -> Ne, nelze sestavit trojúhelník.`);
        return false;
    }
};
const buttoncheckForTriangle = document.createElement('button');
buttoncheckForTriangle.innerText = 'check for triangle (2, 3, 4)';
buttoncheckForTriangle.setAttribute('id', 'task-11');
buttoncheckForTriangle.addEventListener('click', () => {
    const result = checkForTriangle(2, 3, 4);
    document.getElementById("results").innerText = result;
});
tasks.appendChild(buttoncheckForTriangle);

const buttoncheckForTriangle1 = document.createElement('button');
buttoncheckForTriangle1.innerText = 'check for triangle (2, 3, 8)';
buttoncheckForTriangle1.setAttribute('id', 'task-12');
buttoncheckForTriangle1.addEventListener('click', () => {
    const result = checkForTriangle(2, 3, 8);
    document.getElementById("results").innerText = result;
});
tasks.appendChild(buttoncheckForTriangle1);



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

const calculateTriangleArea = (a, b, c) => {
    if(checkForTriangle(a, b, c) == false){
        return 'It is not possible to calculate area for thsi triangle';
    }
    else{
        const s = (a + b + c) / 2
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return `Area of triangle ${a} ${b} ${c} is ${area}`;
    }
};
const buttonTriangleArea = document.createElement('button');
buttonTriangleArea.innerText = 'calculate area for triangle (2, 3, 4)';
buttonTriangleArea.setAttribute('id', 'task-13');
buttonTriangleArea.addEventListener('click', () => {
    const result = calculateTriangleArea(2, 3, 5);
    document.getElementById("results").innerText = result;
});
tasks.appendChild(buttonTriangleArea);