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

console.log("Ahoj světe");

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození,
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných
 * používejte smysluplnou angličtinu.
 */
// Solution here

const pepeYearOfBirth = 2000;
const pepesAge = new Date().getFullYear() - pepeYearOfBirth;
const message = `Pepes age is ${pepesAge}`;
console.log(message);

/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak.
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32.
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9.
 */
// Solution here
const celsiusTemperature = 20;
const fahrenheitTemperature = 76;

const fahrenheitFromCelsius = (celsiusTemperature * 9) / 5 + 32;
const celsiusFromFahrenheit = ((fahrenheitTemperature - 32) * 5) / 9;

console.log(`${celsiusTemperature}°C = ${fahrenheitFromCelsius}°F`);
console.log(`${fahrenheitTemperature}°F = ${celsiusFromFahrenheit}°C`);

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

const calculatePepesAge = (yearOfBirth) => {
  const age = new Date().getFullYear() - yearOfBirth;
  console.log(`Pepeho vek je ${age}`);
};

const convertCelsiusToFahrenheit = (celsiusTemperature) => {
  const fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  console.log(`${celsiusTemperature}°C = ${fahrenheitTemperature}°F`);
};

const convertFahrenheitToCelsius = (fahrenheitTemperature) => {
  const celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  console.log(`${fahrenheitTemperature}°F = ${celsiusTemperature}°C`);
};

calculatePepesAge(2000);
calculatePepesAge(1990);

convertCelsiusToFahrenheit(20);
convertCelsiusToFahrenheit(30);

convertFahrenheitToCelsius(68);
convertFahrenheitToCelsius(86);

const appendButton = (description, id, callback) => {
  const button = document.createElement("button");
  button.innerText = description;
  button.setAttribute("id", id);
  button.addEventListener("click", callback);

  const tasksDiv = document.querySelector("#tasks");
  tasksDiv.appendChild(button);
};

const appendResultMessage = (message) => {
  const resultDiv = document.querySelector("#results");
  resultDiv.innerText = message;
};

appendButton("Uloha 1 (Pepe's age)", "task-1", () => {
  calculatePepesAge(2000);
});

appendButton("Uloha 2 (Celsius to Fahrenheit)", "task-2-1", () => {
  convertCelsiusToFahrenheit(20);
});

appendButton("Uloha 2 (Fahrenheit to Celsius)", "task-2-2", () => {
  convertFahrenheitToCelsius(68);
});

/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla.
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2);
 * Pozor na dělení nulou!
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const getPercentage = (a, b) => {
  if (b === 0) {
    return "Nelze dělit nulou";
  }

  const percentage = (a / b) * 100;
  return `${a} je ${percentage.toFixed(2)}% z ${b}`;
};

appendButton("Uloha 4 (Percentage)", "task-4", () => {
  const res = getPercentage(21, 42);
  appendResultMessage(res);
});

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
  if (a === b) {
    return "Čísla se rovnají";
  }

  return a > b ? `${a} je větší než ${b}` : `${b} je větší než ${a}`;
};

appendButton("Uloha 5 (Compare numbers - cela cisla)", "task-5-1", () => {
  const res = compareNumbers(1, 2);
  appendResultMessage(res);
});
appendButton("Uloha 5 (Compare numbers - desetinna cisla)", "task-5-2", () => {
  const res = compareNumbers(2.2, 2.4);
  appendResultMessage(res);
});

/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší
 * nebo rovno 730, včetě nuly. Používejte for cyklus.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

const printMultiplesOf13 = () => {
  for (let i = 0; i <= 730; i += 13) {
    console.log(i);
  }
};

appendButton("Uloha 6 (Multiples of 13)", "task-6", () => {
  printMultiplesOf13();
});

/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here

const calculateCircleArea = (radius) => {
  const area = Math.PI * radius ** 2;
  return area;
};

appendButton("Uloha 7 (Circle area)", "task-7", () => {
  const res = calculateCircleArea(10);
  appendResultMessage(`Obsah kruhu je ${res}`);
});

/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here

const calculateConeVolume = (height, radius) => {
  const volume = (Math.PI * radius ** 2 * height) / 3;
  return volume;
};

appendButton("Uloha 8 (Cone volume)", "task-8", () => {
  const res = calculateConeVolume(10, 5);
  appendResultMessage(`Objem kuželu je ${res}`);
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

const isTriangle = (a, b, c) => {
  const isTriangle = a + b > c && a + c > b && b + c > a;
  return isTriangle;
};

appendButton("Uloha 9 (Is triangle?)", "task-9", () => {
  const res = isTriangle(3, 4, 5);
  appendResultMessage(`Trojuhelnik lze postavit: ${res}`);
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

const calculateTriangleArea = (a, b, c) => {
  if (!isTriangle(a, b, c)) {
    appendResultMessage("Trojuhelnik nelze sestrojit");
    return;
  }

  const s = (a + b + c) / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  appendResultMessage(`Obsah trojuhelniku je ${area}`);
};

appendButton("Uloha 10 (Triangle area)", "task-10", () => {
  calculateTriangleArea(3, 4, 5);
});
