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
console.log ('Ahoj světe')
/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here
const birtYear = 2000;
const currentYear = 2024;
const age = currentYear - birtYear;
console.log ('Pepe is ' + age + ' years old!')
/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const celsius = 20;
const celToFar = ((celsius * 9)/5)+32;
const farhrenheiht = 68;
const farToCel = ((farhrenheiht - 32)*5)/9;
console.log (celsius + '°C = ' + celToFar + '°F, ' + farhrenheiht + '°F = ' + farToCel + '°C');
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
const calculatePepeAge = (birthYear) => {
    const currentYear = 2024;
    const age = currentYear - birthYear;
    console.log ('Pepe is ' + age + ' years old!');
};
const converstionCeltoFar = (celsius) => {
    const celToFar = ((celsius * 9)/5)+32;
    console.log (celsius + '°C = ' + celToFar + '°F')
}
const converstionFartoCel = (farhrenheiht) => {
    const farToCel = ((farhrenheiht - 32)*5)/9;
    console.log (farhrenheiht + '°F = ' + farToCel + '°C')
} 
const buttonPepeAge = document.createElement('button');
buttonPepeAge.innerText = "Uloha 1 (Pepe's age)";
buttonPepeAge.setAttribute('id', 'task-1');
buttonPepeAge.addEventListener('click', () => {
       calculatePepeAge(1990);
    });
document.querySelector('#tasks').appendChild(buttonPepeAge);
tasks.appendChild(buttonPepeAge);

const buttonconversion = document.createElement('button');
buttonconversion.innerText = "Uloha 2 (Conversion Celsius and Farenheit)";
buttonconversion.setAttribute('id', 'task-2');
buttonconversion.addEventListener('click', () => {
    const celsius = 20;
    const fahrenheit = 68;
    const celToFar = converstionCeltoFar(celsius);
    const farToCel = converstionFartoCel(fahrenheit);
});
document.querySelector('#tasks').appendChild(buttonconversion);
tasks.appendChild(buttonconversion);
/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here
const quotientof2numbers = (num1, num2) => {
    if (num2 === 0) {
        document.getElementById('results').innerText = "Chyba: dělení nulou není povoleno!";
        return;
    }
    var quoteint = (num1 / num2) * 100;
    document.getElementById('results').innerText = (num1 + ' je ' + quoteint.toFixed(2) + ' % z ' + num2);
}


const buttonquotient= document.createElement('button');
buttonquotient.innerText = "Uloha 4 (Quotient of 2 numbers)";
buttonquotient.setAttribute('id', 'task-4');

buttonquotient.addEventListener('click', () => {
    const num1 = 21
    const num2 = 42
    quotientof2numbers(num1, num2);
});
document.querySelector('#tasks').appendChild(buttonquotient);
tasks.appendChild(buttonquotient);
/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here
const compareNumbers = (num1, num2) => {
    if (num1 > num2) {
        document.getElementById('results').innerText =  (num1 + ' je větší než ' + num2)
    } else if (num1 < num2) {
        document.getElementById('results').innerText = (num1 + ' je menší než ' + num2)
    } else {
        document.getElementById('results').innerText = (num1 + ' a ' + num2 + ' se rovnají.')
    }
};

const createComparisonButton = (num1, num2, buttonText) => {
    const buttoncompare = document.createElement('button');
    buttoncompare.innerText = ('Uloha 5 (' + buttonText + ')');
    buttoncompare.setAttribute('id', 'task-5');
    buttoncompare.addEventListener('click', () => compareNumbers(num1, num2));
    document.querySelector('#tasks').appendChild(buttoncompare);
};

createComparisonButton(5, 10, "Porovnat 5 a 10 - celá čísla");
createComparisonButton(7.5, 2.3, "Porovnat 7.5 a 2.3 - desetinná čísla");
createComparisonButton(1/2, 1/4, "Porovnat 1/2 a 1/4 - zlomky");
createComparisonButton(3, 3, "Porovnat 3 a 3 - stejná čísla");
/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const multiplesOf13 = () => {
    let multiples = '';  
    for (let i = 0; i <= 730; i += 13) {
        multiples += i + ' ';  
    }
    document.getElementById('results').innerText = multiples.trim(); 
};

const createMultiplesButton = () => {
    const buttonMultiples = document.createElement('button');
    buttonMultiples.innerText = "Uloha 6: Násobky čísla 13";
    buttonMultiples.setAttribute('id', 'task-6');
    buttonMultiples.addEventListener('click', multiplesOf13);
    document.querySelector('#tasks').appendChild(buttonMultiples);
};
createMultiplesButton();

/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const calculateCircleArea = (radius) => {
    const area = Math.PI * Math.pow(radius, 2); 
    document.getElementById('results').innerText = 'Obsah kružnice s poloměrem ' + radius + ' je ' + area.toFixed(2);
};
const createCircleAreaButton = () => {
    const buttonCircle = document.createElement('button');
    buttonCircle.innerText = "Uloha 7: Výpočet obsahu kružnice";
    buttonCircle.setAttribute('id', 'task-7');
    buttonCircle.addEventListener('click', () => calculateCircleArea(10));  
    document.querySelector('#tasks').appendChild(buttonCircle);
};

createCircleAreaButton();
/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const calculateConeVolume = (radius, height) => {
    const volume = (1/3) * Math.PI * Math.pow(radius, 2) * height;  
    document.getElementById('results').innerText = 'Objem kuželu s poloměrem ' + radius + ' a výškou ' + height + ' je ' + volume.toFixed(2);
};
const createConeVolumeButton = () => {
    const buttonCone = document.createElement('button');
    buttonCone.innerText = "Uloha 8: Výpočet objemu kuželu";
    buttonCone.setAttribute('id', 'task-8');
    buttonCone.addEventListener('click', () => calculateConeVolume(5, 12));  
    document.querySelector('#tasks').appendChild(buttonCone);
};
createConeVolumeButton();

/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const isTriangle = (a, b, c) => {
    if (a + b > c && b + c > a && a + c > b) {
        document.getElementById('results').innerText = ('Strany ' + a + ', ' + b + ', ' + c + ' mohou vytvořit trojúhelník.');
        return true;  
    } else {
        document.getElementById('results').innerText = ('Strany ' + a + ', ' + b + ', ' + c + ' nemohou vytvořit trojúhelník.');
        return false;   
    }
};
const createTriangleButton = () => {
    const buttonTriangle = document.createElement('button');
    buttonTriangle.innerText = "Uloha 9: Kontrola trojúhelníku";
    buttonTriangle.setAttribute('id', 'task-9');
    buttonTriangle.addEventListener('click', () => isTriangle(3, 4, 5));  
    document.querySelector('#tasks').appendChild(buttonTriangle);
};
const createInvalidTriangleButton = () => {
    const buttonInvalidTriangle = document.createElement('button');
    buttonInvalidTriangle.innerText = "Uloha 9: Neplatný trojúhelník (1, 2, 3)";
    buttonInvalidTriangle.setAttribute('id', 'task-9');
    buttonInvalidTriangle.addEventListener('click', () => isTriangle(1, 2, 3)); 
    document.querySelector('#tasks').appendChild(buttonInvalidTriangle);
};
createTriangleButton();
createInvalidTriangleButton();



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

    // Tlačítko pro výpočet obsahu trojúhelníku
   // Funkce pro validaci, zda lze sestrojit trojúhelník
// Funkce pro kontrolu, zda lze sestrojit trojúhelník

   