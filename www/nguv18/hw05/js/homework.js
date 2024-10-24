console.log('Ahoj světe');

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


/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here

let pepeBirthYear = 2000;
let currentYear = new Date().getFullYear();
let pepeAge = currentYear - pepeBirthYear;
console.log(` Happy Birthday Pepe! Pepe is ${pepeAge} years old.`);

/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
let tempCelsius = 20;
let tempFahrenheitFromCelsius = (tempCelsius * 9) / 5 + 32;

let tempFahrenheit = 68;
let tempCelsiusFromFahrenheit = (tempFahrenheit - 32) * 5 / 9;

console.log(`${tempCelsius}°C = ${tempFahrenheitFromCelsius}°F`);
console.log(`${tempFahrenheit}°F = ${tempCelsiusFromFahrenheit}°C`);

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

const calculatePepeAge = (pepeBirthYear) => {
  const currentYear = new Date().getFullYear();
  const pepeAge = currentYear - pepeBirthYear;
  console.log(`Happy Birthday Pepe! Pepe is ${pepeAge} years old.`);
};

const converttempCelsius = (tempToCelsius) => {
  const tempFahrenheitFromCelsius = (tempCelsius * 9) / 5 + 32;
  console.log(`${tempCelsius}°C = ${tempFahrenheitFromCelsius}°F`);
};

const converttempFahrenheit = (tempToFahrenheit) => {
  const tempCelsiusFromFahrenheit = (tempFahrenheit - 32) * 5 / 9;
  console.log(`${tempFahrenheit}°F = ${tempCelsiusFromFahrenheit}°C`);
};

const buttonPepeAge = document.createElement('button');
buttonPepeAge.innerText = 'Pepe Age';
buttonPepeAge.setAttribute('id', 'task-1');
buttonPepeAge.addEventListener('click', () => {
  calculatePepeAge(2000);
});

const buttontempCelsius = document.createElement('button');
buttontempCelsius.innerText = 'Convert degree from Celsius to Fahrenheit';
buttontempCelsius.setAttribute('id', 'task-2');
buttontempCelsius.addEventListener('click', () => {
  converttempCelsius(20);
});

const buttontempFahrenheit = document.createElement('button');
buttontempFahrenheit.innerText = 'Convert degree from Fahrenheit to Celsius';
buttontempFahrenheit.setAttribute('id', 'task-3');
buttontempFahrenheit.addEventListener('click', () => {
  converttempFahrenheit(68);
});

const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonPepeAge);
tasks.appendChild(buttontempCelsius);
tasks.appendChild(buttontempFahrenheit);



/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla.
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2);
 * Pozor na dělení nulou!
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const calculatePercentage = (numerator, denominator) => {
  if (denominator === 0) {
    document.querySelector('#results').innerText = "Cannot divide by zero!";
    return;
  }

  let percentage = (numerator / denominator) * 100;
  document.querySelector('#results').innerText = `${numerator} is ${percentage.toFixed(2)}% of ${denominator}`;
};

const buttonPercentage = document.createElement('button');
buttonPercentage.innerText = 'Calculate percentage';
buttonPercentage.setAttribute('id', 'task-4');
buttonPercentage.addEventListener('click', () => {
  calculatePercentage(21, 42)
});
const tasks1 = document.querySelector('#tasks');
tasks1.appendChild(buttonPercentage);



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
  let resultMessage;
  if (num1 > num2) {
    resultMessage = `${num1} is greater than ${num2}.`;
  } else if (num1 < num2) {
    resultMessage = `${num2} is greater than ${num1}.`;
  } else {
    resultMessage = `${num1} is equal to ${num2}.`;
  }
  document.querySelector('#results').innerText = resultMessage;
};

const buttonCompareIntegers = document.createElement('button');
buttonCompareIntegers.innerText = 'Compare Integers (3 and 14)';
buttonCompareIntegers.setAttribute('id', 'compare-integers');
buttonCompareIntegers.addEventListener('click', () => {
  compareNumbers(3, 14);
});

const buttonCompareDecimals = document.createElement('button');
buttonCompareDecimals.innerText = 'Compare Decimals (2.6 and 2.5)';
buttonCompareDecimals.setAttribute('id', 'compare-decimals');
buttonCompareDecimals.addEventListener('click', () => {
  compareNumbers(2.6, 2.5);
});

const tasks2 = document.querySelector('#tasks');
tasks2.appendChild(buttonCompareIntegers);
tasks2.appendChild(buttonCompareDecimals);

/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší
 * nebo rovno 730, včetě nuly. Používejte for cyklus.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const multiplesOf13 = () => {
  const results = document.querySelector('#results');
  results.innerHTML = '';

  for (let i = 0; i <= 730; i += 13) {
    results.innerHTML += `${i}, `;
  }
};

const buttonMultiplesOf13 = document.createElement('button');
buttonMultiplesOf13.innerText = 'Multiples of 13';
buttonMultiplesOf13.setAttribute('id', 'task-6');
buttonMultiplesOf13.addEventListener('click', multiplesOf13);

const tasks3 = document.querySelector('#tasks');
tasks3.appendChild(buttonMultiplesOf13);


/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here

const CalculateAreaOfCircle = (radius) => {
  const area = Math.PI * Math.pow(radius, 2);
  const results = document.querySelector('#results');
  results.innerText = `The area of the circle with radius ${radius} is ${area.toFixed(2)}`;
};

const buttonCircleArea = document.createElement('button');
buttonCircleArea.innerText = 'Calculate the area of circle ';
buttonCircleArea.setAttribute('id', 'task-7');
buttonCircleArea.addEventListener('click', () => {
  CalculateAreaOfCircle(10);
});

const tasks4 = document.querySelector('#tasks');
tasks4.appendChild(buttonCircleArea);

/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here

const calculateConeVolume = (radius, height) => {
  const volume = (1 / 3) * Math.PI * Math.pow(radius, 2) * height;
  const results = document.querySelector('#results');
  results.innerText = `The volume of the cone with radius ${radius} and height ${height} is ${volume.toFixed(2)}`;
};

const buttonConeVolume = document.createElement('button');
buttonConeVolume.innerText = 'Calculate the volume of cone';
buttonConeVolume.setAttribute('id', 'task-8');
buttonConeVolume.addEventListener('click', () => {
  calculateConeVolume(6, 23);
});

const tasks5 = document.querySelector('#tasks');
tasks5.appendChild(buttonConeVolume);

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
  const isTriangle = (a + b > c) && (a + c > b) && (b + c > a);
  const results = document.querySelector('#results');
  results.innerText = `Lengths: ${a}, ${b}, ${c} - Can form triangle: ${isTriangle ? 'Yes' : 'No'}`;

  return isTriangle;
};

const buttonCheckTriangle = document.createElement('button');
buttonCheckTriangle.innerText = 'Check Triangle';
buttonCheckTriangle.setAttribute('id', 'task-9');
buttonCheckTriangle.addEventListener('click', () => {
  isTriangle(6, 2, 8);
});

const tasks6 = document.querySelector('#tasks');
tasks6.appendChild(buttonCheckTriangle);


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

const calculateAreaOfTriangle = (a, b, c) => {
  const resultsContainer = document.querySelector('#results');

  if (!isTriangle(a, b, c)) {
    resultsContainer.innerText = 'Invalid triangle sides!';
    return;
  }

  const s = (a + b + c) / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

  resultsContainer.innerText = `The area of the triangle with sides ${a}, ${b}, ${c} is ${area.toFixed(2)}`;
};

const buttonAreaCalculation = document.createElement('button');
buttonAreaCalculation.innerText = 'Calculate the area of triangle ';
buttonAreaCalculation.setAttribute('id', 'task-10');
buttonAreaCalculation.addEventListener('click', () => {
  calculateAreaOfTriangle(5, 7, 9);
});

const tasksContainer = document.querySelector('#tasks');
tasksContainer.appendChild(buttonAreaCalculation);