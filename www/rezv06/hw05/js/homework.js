window.addEventListener("DOMContentLoaded", () => {

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
    
    const pepeBirthYear = 2000;
    const currentYear = new Date().getFullYear();
    const pepeAge = currentYear - pepeBirthYear;
    console.log(`Pepe je ${pepeAge} let starý.`);
    
    
   /**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
    
    const celsius = 20;
    const fahrenheitFromC = (celsius * 9) / 5 + 32;
    console.log(`${celsius}°C = ${fahrenheitFromC}°F`);
    
    const fahrenheit = 68;
    const celsiusFromF = ((fahrenheit - 32) * 5) / 9;
    console.log(`${fahrenheit}°F = ${celsiusFromF.toFixed(2)}°C`);
    
    
    
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
        const currentYear = new Date().getFullYear();
        console.log(`Pepe je ${currentYear - birthYear} let starý.`);
    };
    
    const convertTemperature = (temp, unit) => {
        if (unit === 'C') {
            const fahrenheit = (temp * 9) / 5 + 32;
            console.log(`${temp}°C = ${fahrenheit}°F`);
        } else if (unit === 'F') {
            const celsius = ((temp - 32) * 5) / 9;
            console.log(`${temp}°F = ${celsius.toFixed(2)}°C`);
        }
    };
    
    // Create button for Pepe's age
    const buttonPepeAge = document.createElement('button');
    buttonPepeAge.innerText = 'Pepeho věk';
    buttonPepeAge.addEventListener('click', () => calculatePepeAge(2000));
    document.getElementById('tasks').appendChild(buttonPepeAge);
    
    // Create button for Temperature Conversion
    const buttonTempConversion = document.createElement('button');
    buttonTempConversion.innerText = 'Převeď teplotu';
    buttonTempConversion.addEventListener('click', () => convertTemperature(20, 'C'));
    document.getElementById('tasks').appendChild(buttonTempConversion);
    
    
    
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
        if (num2 === 0) {
            console.log('Nemůže ělit nulou');
            return;
        }
        const percentage = (num1 / num2) * 100;
        document.getElementById('results').innerText = `${num1} is ${percentage.toFixed(2)}% of ${num2}`;
    };
    
    const buttonPercentage = document.createElement('button');
    buttonPercentage.innerText = 'Výpočet procent';
    buttonPercentage.addEventListener('click', () => calculatePercentage(2, 643));
    document.getElementById('tasks').appendChild(buttonPercentage);
    
  
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
        let result;
        if (a > b) {
            result = `${a} je větší než ${b}`;
        } else if (a < b) {
            result = `${b} je větší než ${a}`;
        } else {
            result = `${a} a ${b} jsou si rovny`;
        }
        document.getElementById('results').innerText = result;
    };
    
    const buttonCompare = document.createElement('button');
    buttonCompare.innerText = 'Porovnat čísla';
    buttonCompare.addEventListener('click', () => compareNumbers(160, 200));
    document.getElementById('tasks').appendChild(buttonCompare);
    
    
/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

    const printMultiplesOf13 = () => {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerText = '';
        for (let i = 0; i <= 730; i += 13) {
            resultsDiv.innerText += `${i}, `;
        }
    };
    
    const buttonMultiples = document.createElement('button');
    buttonMultiples.innerText = 'Násobky 13';
    buttonMultiples.addEventListener('click', printMultiplesOf13);
    document.getElementById('tasks').appendChild(buttonMultiples);
    
    
/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

    const calculateCircleArea = (radius) => {
        const area = Math.PI * Math.pow(radius, 2);
        document.getElementById('results').innerText = `Obsah kruhu s poloměrem ${radius} je ${area.toFixed(2)} čtverečních jednotek.`;
    };
    
    // Button for Circle Area
    const buttonCircleArea = document.createElement('button');
    buttonCircleArea.innerText = 'Vypočíst obsah kruhu';
    buttonCircleArea.addEventListener('click', () => calculateCircleArea(10));
    document.getElementById('tasks').appendChild(buttonCircleArea);   
    
    
    
/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

    const calculateConeVolume = (radius, height) => {
        const volume = (1 / 3) * Math.PI * Math.pow(radius, 2) * height;
        document.getElementById('results').innerText = `Objem kužele s poroměrem ${radius} a výškou ${height} je ${volume.toFixed(2)} kubických jednotek.`;
    };
    
    // Button for Cone Volume
    const buttonConeVolume = document.createElement('button');
    buttonConeVolume.innerText = 'Vypočíst objem kužele';
    buttonConeVolume.addEventListener('click', () => calculateConeVolume(643, 128));
    document.getElementById('tasks').appendChild(buttonConeVolume);
    
    
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
        const isValid = a + b > c && a + c > b && b + c > a;
        document.getElementById('results').innerText = `Strany ${a}, ${b}, ${c} ${isValid ? '' : 'ne'}tvoří trojúhelník.`;
        return isValid;
    };
    
    // Button for Triangle Validation
    const buttonTriangle = document.createElement('button');
    buttonTriangle.innerText = 'Je to trojúhelník?';
    buttonTriangle.addEventListener('click', () => isTriangle(14, 20, 10));
    document.getElementById('tasks').appendChild(buttonTriangle);
    
    
    
    
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
        // Step 1: Select container for results
        const resultsDiv = document.getElementById('results');
        
        // Step 2: Validate input (using isTriangle function from task 9)
        if (!isTriangle(a, b, c)) {
            resultsDiv.innerText = `Neplatné, ${a}, ${b}, ${c} nemohou tvořit trojúhelník.`;
            return;
        }
        
        // Step 3: Calculate the semi-perimeter (s) and the area
        const s = (a + b + c) / 2; // semi-perimeter
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        
        // Step 4: Output the result
        resultsDiv.innerText = `Obsah trojůhelníku ${a}, ${b}, ${c} je ${area.toFixed(2)} čtverečních jednotek.`;
    };
    
    // Button for Triangle Area Calculation
    const buttonTriangleArea = document.createElement('button');
    buttonTriangleArea.innerText = 'Vypočíst obsah trojůhelníku';
    buttonTriangleArea.addEventListener('click', () => calculateTriangleArea(14, 20, 10));
    document.getElementById('tasks').appendChild(buttonTriangleArea);

})    
