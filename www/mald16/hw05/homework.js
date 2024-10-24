/* HOMEWORK */

/*CONSTANTS*/
const tasks = document.querySelector("#tasks");
const results = document.querySelector("#results");

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
var pepesAge = 10;
console.log("Pepe is " + pepesAge + " years old.");

/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak.
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32.
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9.
 */
var celsius = 20;
console.log(celsius + "°C = " + ((celsius * 9) / 5 + 32) + "°F");

/**
 * 3) Funkce const fonction funktio. Vemte předchozí úlohy a udělejte z nich funkce. Tj. vytvoříte funkce,
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
const pepesAgeCalculator = (age) => {
	console.log("Pepe is " + age + " years old.");
};

const celsiusToFahrenheit = (celsius) => {
	console.log(celsius + "°C = " + ((celsius * 9) / 5 + 32) + "°F");
};

const pepesAgeBtn = document.createElement("button");
pepesAgeBtn.innerHTML = "Uloha 1 (Pepe's age)";
pepesAgeBtn.setAttribute("id", "task-1");
pepesAgeBtn.addEventListener("click", () => {
	pepesAgeCalculator(3);
});
tasks.appendChild(pepesAgeBtn);

const celsiusToFahrenheitBtn = document.createElement("button");
celsiusToFahrenheitBtn.innerHTML = "Uloha 2 (Celsius to Fahrenheit)";
celsiusToFahrenheitBtn.setAttribute("id", "task-2");
celsiusToFahrenheitBtn.addEventListener("click", () => {
	celsiusToFahrenheit(10);
});
tasks.appendChild(celsiusToFahrenheitBtn);

/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla.
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2);
 * Pozor na dělení nulou!
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
const division = (firstNum, secondNum) => {
	const result1 = document.createElement("div");
	result1.innerHTML =
		secondNum === 0
			? "You cannot divide using 0!"
			: ((firstNum / secondNum) * 100).toFixed(2) + " %";
	result1.setAttribute("id", "result-1");
	results.appendChild(result1);
};
const divisionBtn = document.createElement("button");
divisionBtn.innerHTML = "Uloha 3 (Division)";
divisionBtn.setAttribute("id", "task-3");
divisionBtn.addEventListener("click", () => {
	division(2, 9);
});
tasks.appendChild(divisionBtn);
/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají.
 *
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
const compareNumbers = (a, b) => {
	const result = document.createElement("div");
	if (a > b) {
		result.innerHTML = a + " is greater than " + b;
	} else if (a < b) {
		result.innerHTML = b + " is greater than " + a;
	} else {
		result.innerHTML = a + " and " + b + " are equal.";
	}
	results.appendChild(result);
};
const compareBtn = document.createElement("button");
compareBtn.innerHTML = "Uloha 4 (Compare Numbers)";
compareBtn.setAttribute("id", "task-4");
compareBtn.addEventListener("click", () => {
	compareNumbers(7, 3);
});
tasks.appendChild(compareBtn);

/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší
 * nebo rovno 730, včetě nuly. Používejte for cyklus.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
const multiplesOf13 = () => {
	let result = "";
	for (let i = 0; i <= 730; i += 13) {
		result += i + " ";
	}
	const div = document.createElement("div");
	div.innerHTML = result;
	results.appendChild(div);
};
const multiplesBtn = document.createElement("button");
multiplesBtn.innerHTML = "Uloha 5 (Multiples of 13)";
multiplesBtn.setAttribute("id", "task-5");
multiplesBtn.addEventListener("click", multiplesOf13);
tasks.appendChild(multiplesBtn);

/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
const circleArea = (radius) => {
	const area = (Math.PI * radius * radius).toFixed(2);
	const div = document.createElement("div");
	div.innerHTML = `Area of circle with radius ${radius} is ${area}`;
	results.appendChild(div);
};
const circleAreaBtn = document.createElement("button");
circleAreaBtn.innerHTML = "Uloha 6 (Circle Area)";
circleAreaBtn.setAttribute("id", "task-6	");
circleAreaBtn.addEventListener("click", () => {
	circleArea(5);
});
tasks.appendChild(circleAreaBtn);

/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr.
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
const coneVolume = (height, radius) => {
	const volume = ((1 / 3) * Math.PI * radius * radius * height).toFixed(2);
	const div = document.createElement("div");
	div.innerHTML = `Volume of cone with height ${height} and radius ${radius} is ${volume}`;
	results.appendChild(div);
};
const coneVolumeBtn = document.createElement("button");
coneVolumeBtn.innerHTML = "Uloha 7 (Cone Volume)";
coneVolumeBtn.setAttribute("id", "task-7");
coneVolumeBtn.addEventListener("click", () => {
	coneVolume(10, 3);
});
tasks.appendChild(coneVolumeBtn);

/**
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
const isTriangle = (a, b, c) => {
	const result = a + b > c && a + c > b && b + c > a;
	const div = document.createElement("div");
	if (result) {
		div.innerHTML =
			"Yes, " + a + ", " + b + ", and " + c + " can form a triangle.";
	} else {
		div.innerHTML =
			"No, " + a + ", " + b + ", and " + c + " cannot form a triangle.";
	}
	results.appendChild(div);
};
const triangleBtn = document.createElement("button");
triangleBtn.innerHTML = "Uloha 8 (Is it a Triangle?)";
triangleBtn.setAttribute("id", "task-8");
triangleBtn.addEventListener("click", () => {
	isTriangle(3, 4, 5);
});
tasks.appendChild(triangleBtn);

/**
 * 10) Heroic performance. Vytvořte funkci, která vypočte a vypíše obsah trojúhelníka podle Heronova vzorce,
 * tj. funkce dostane délky všech 3 stran. Použijte přitom předchozí validaci v úloze č. 9, tj. počítejte pouze,
 * když to má smysl. Hint: funkce pro odmocninu je Math.sqrt().
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte
 * staticky.
 */
// Solution here
const heronsFormula = (a, b, c) => {
	if (isTriangle(a, b, c)) {
		const s = (a + b + c) / 2;
		const area = Math.sqrt(s * (s - a) * (s - b) * (s - c)).toFixed(2);
		const div = document.createElement("div");
		div.innerHTML = `The area of the triangle is ${area}`;
		results.appendChild(div);
	} else {
		const div = document.createElement("div");
		div.innerHTML =
			"Cannot calculate the area because the sides do not form a triangle.";
		results.appendChild(div);
	}
};
const heronBtn = document.createElement("button");
heronBtn.innerHTML = "Uloha 9 (Heron's Formula)";
heronBtn.setAttribute("id", "task-9");
heronBtn.addEventListener("click", () => {
	heronsFormula(3, 4, 5);
});
tasks.appendChild(heronBtn);
