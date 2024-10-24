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
console.log('Hello world!');

/**
 * 1) Pepe's age. Vypište na konzoli smysluplnou oznamovací větu s věkem Pepy, pokud znáte jeho rok narození, 
 * který je uložený v proměnné a pro výpis použijte zřetězení stringů nebo interpolaci. Pro názvy proměnných 
 * používejte smysluplnou angličtinu.
 */
// Solution here

let yearOfBirth = 2002;
let date = new Date();
let currentYear = date.getFullYear();

console.log(`Pepa je super, a je mu ${currentYear - yearOfBirth} let.`);



/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here

let celsius = 22;
let fahrenheit = 70;

console.log(`${celsius} je ${(celsius*9)/5+32}F a ${fahrenheit}F je ${Math.round( (fahrenheit-32)*5/9 )}C`);



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

// Pepa
const pepesAge = (yearOfBirth) => {
    let date = new Date();
    let currentYear = date.getFullYear();
    console.log(`Pepa je super, a je mu ${currentYear - yearOfBirth} let.`);
};

const buttonPepe = document.createElement('button');
buttonPepe.innerText = 'Představ Pepu';
buttonPepe.setAttribute('id', 'task-1');

buttonPepe.addEventListener('click', () => {
  pepesAge(2002);
});
 
const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonPepe);

// Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius) => {
    console.log(`${celsius} je ${(celsius*9)/5+32}F`);
};

const buttonCelsius = document.createElement('button');
buttonCelsius.innerText = 'Převeď C na F';
buttonCelsius.setAttribute('id', 'task-2');

buttonCelsius.addEventListener('click', () => {
    celsiusToFahrenheit(20);
});

tasks.appendChild(buttonCelsius);

// Fahrenheit to Celsius
const fahrenheitToCelsius = (fahrenheit) => {
    console.log(`${fahrenheit}F je ${Math.round( (fahrenheit-32)*5/9 )}C`);
};

const buttonFahrenheit = document.createElement('button');
buttonFahrenheit.innerText = 'Převeď F na C';
buttonFahrenheit.setAttribute('id', 'task-Š');

buttonFahrenheit.addEventListener('click', () => {
    fahrenheitToCelsius(77);
});

tasks.appendChild(buttonFahrenheit);


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
      console.log('Division by zero is not allowed!');
      return;
    }
    let percentage = ((num1 / num2) * 100).toFixed(2);
    const resultDiv = document.querySelector('#result');
    resultDiv.innerText = `${num1} is ${percentage}% of ${num2}`;
  };

  const buttonPercentage = document.createElement('button');
  buttonPercentage.innerText = 'Calculate Percentage';
  buttonPercentage.setAttribute('id', 'task-4');
  
  buttonPercentage.addEventListener('click', () => {
    calculatePercentage(21, 42);
  });
  
  tasks.appendChild(buttonPercentage);

const resultDiv = document.createElement('div');
resultDiv.setAttribute('id', 'result');
resultDiv.style.marginTop = '20px';
tasks.appendChild(resultDiv);


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
    const resultDiv = document.querySelector('#compare-result');
    if (num1 > num2) {
      resultDiv.innerText = `${num1} is greater than ${num2}`;
    } else if (num1 < num2) {
      resultDiv.innerText = `${num2} is greater than ${num1}`;
    } else {
      resultDiv.innerText = `${num1} and ${num2} are equal`;
    }
  };

// whole numbers
const buttonWholeNumbers = document.createElement('button');
buttonWholeNumbers.innerText = 'Compare 5 and 10';
buttonWholeNumbers.setAttribute('id', 'task-5-1');

buttonWholeNumbers.addEventListener('click', () => {
  compareNumbers(5, 10);
});

tasks.appendChild(buttonWholeNumbers);

// decimal numbers
const buttonDecimalNumbers = document.createElement('button');
buttonDecimalNumbers.innerText = 'Compare 3.5 and 3.8';
buttonDecimalNumbers.setAttribute('id', 'task-5-2');

buttonDecimalNumbers.addEventListener('click', () => {
  compareNumbers(3.5, 3.8);
});

tasks.appendChild(buttonDecimalNumbers);

// fractions
const buttonFractionNumbers = document.createElement('button');
buttonFractionNumbers.innerText = 'Compare 1/3 and 2/3';
buttonFractionNumbers.setAttribute('id', 'task-5-3');

buttonFractionNumbers.addEventListener('click', () => {
  compareNumbers(1/3, 2/3);
});

tasks.appendChild(buttonFractionNumbers);


const compareResultDiv = document.createElement('div');
compareResultDiv.setAttribute('id', 'compare-result');
compareResultDiv.style.marginTop = '20px';
tasks.appendChild(compareResultDiv);


/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here

function pattern(){
    const resultDiv = document.querySelector('#pattern-result');
    let res = [];

    for (let i = 13; i < 731; i++) {
        if (i % 13 == 0) {
            res.push(i);
        }
    }
    resultDiv.innerHTML = res;
}

const buttonPattern = document.createElement('button');
buttonPattern.innerText = 'generate pattern for multiples of 13';
buttonPattern.setAttribute('id', 'task-6');

buttonPattern.addEventListener('click', () => {
    pattern();
});

tasks.appendChild(buttonPattern);

const patternDiv = document.createElement('div');
compareResultDiv.setAttribute('id', 'pattern-result');
compareResultDiv.style.marginTop = '20px';
tasks.appendChild(compareResultDiv);


/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateCircleArea = (radius) => {
    const area = Math.PI * Math.pow(radius, 2);
    const resultDiv = document.querySelector('#circle-area-result');
    resultDiv.innerText = `The area of a circle with radius ${radius} is ${area.toFixed(2)} square units.`;
  };

  const buttonCircleArea = document.createElement('button');
  buttonCircleArea.innerText = 'Calculate Circle Area (r=5)';
  buttonCircleArea.setAttribute('id', 'task-7');
  
  buttonCircleArea.addEventListener('click', () => {
    calculateCircleArea(5); // Static radius value (e.g., 5)
  });
  
  tasks.appendChild(buttonCircleArea);

  const circleAreaResultDiv = document.createElement('div');
  circleAreaResultDiv.setAttribute('id', 'circle-area-result');
  circleAreaResultDiv.style.marginTop = '20px';
  tasks.appendChild(circleAreaResultDiv);

/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateConeVolume = (radius, height) => {
    const volume = (1/3) * Math.PI * Math.pow(radius, 2) * height;
    const resultDiv = document.querySelector('#cone-volume-result');
    resultDiv.innerText = `The volume of a cone with radius ${radius} and height ${height} is ${volume.toFixed(2)} cubic units.`;
  };

  const buttonConeVolume = document.createElement('button');
  buttonConeVolume.innerText = 'Calculate Cone Volume (r=3, h=7)';
  buttonConeVolume.setAttribute('id', 'task-8');
  
  buttonConeVolume.addEventListener('click', () => {
    calculateConeVolume(3, 7); // Static values for radius (3) and height (7)
  });
  
  tasks.appendChild(buttonConeVolume);

  const coneVolumeResultDiv = document.createElement('div');
  coneVolumeResultDiv.setAttribute('id', 'cone-volume-result');
  coneVolumeResultDiv.style.marginTop = '20px';
  tasks.appendChild(coneVolumeResultDiv);

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
    const resultDiv = document.querySelector('#triangle-result');
    
    // Check the triangle inequality theorem: sum of any two sides must be greater than the third
    if (a + b > c && a + c > b && b + c > a) {
      resultDiv.innerText = `The lengths ${a}, ${b}, and ${c} can form a triangle: Yes.`;
      return true;
    } else {
      resultDiv.innerText = `The lengths ${a}, ${b}, and ${c} cannot form a triangle: No.`;
      return false;
    }
  };

  const buttonIsTriangle = document.createElement('button');
  buttonIsTriangle.innerText = 'Check Triangle (3, 4, 5)';
  buttonIsTriangle.setAttribute('id', 'task-9');
  
  buttonIsTriangle.addEventListener('click', () => {
    isTriangle(3, 4, 5); // Static values for sides a=3, b=4, c=5
  });
  
  tasks.appendChild(buttonIsTriangle);

  const triangleResultDiv = document.createElement('div');
  triangleResultDiv.setAttribute('id', 'triangle-result');
  triangleResultDiv.style.marginTop = '20px';
  tasks.appendChild(triangleResultDiv);


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
    const resultDiv = document.querySelector('#heron-result');
    
    // Step 1
    if (!isTriangle(a, b, c)) {
      resultDiv.innerText = `The lengths ${a}, ${b}, and ${c} cannot form a triangle.`;
      return;
    }
  
    // Step 2
    const s = (a + b + c) / 2;
  
    // Step 3
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  
    // Step 4
    resultDiv.innerText = `The area of the triangle with sides ${a}, ${b}, and ${c} is ${area.toFixed(2)} square units.`;
  };
  
 
  const buttonHeron = document.createElement('button');
  buttonHeron.innerText = 'Calculate Triangle Area (3, 4, 5)';
  buttonHeron.setAttribute('id', 'task-10');
  
  
  buttonHeron.addEventListener('click', () => {
    calculateTriangleArea(3, 4, 5); // Static values for sides a=3, b=4, c=5
  });
  

  tasks.appendChild(buttonHeron);
  
  const heronResultDiv = document.createElement('div');
  heronResultDiv.setAttribute('id', 'heron-result');
  heronResultDiv.style.marginTop = '20px';
  tasks.appendChild(heronResultDiv);