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

const birthday = 2003;
const datum = new Date().getFullYear()
const PepeAge = datum - birthday
console.log("Pepe is " + PepeAge + " years old.");



/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const Celsius = 32;
const Fahrenheit = 68;

const CtoF = Celsius*9/5+32
const FtoC = (Fahrenheit-32)*5/9

console.log("z C na F je to " + CtoF)
console.log("z F na C je to " + FtoC)




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

// Funkce pro výpočet Pepova věku
const pepesAge = (birthday) => {
    const date = new Date().getFullYear();
    const result = date - birthday;
    console.log("Pepe is " + result + " years old.");
};

// Volání funkce pro test (můžete použít libovolný rok)
const addResult = pepesAge(2003);

// Vytvoření tlačítka pro Pepův věk
const buttonPepesAge = document.createElement('button');
buttonPepesAge.innerText = "Uloha 1 (Pepe's age)";
buttonPepesAge.setAttribute('id', 'task-1');

// Správné jméno funkce (pepesAge místo pepasAge)
buttonPepesAge.addEventListener('click', () => {
    pepesAge(1990);  // zde můžete měnit rok narození pro testování
});

// Umístění tlačítek do <div id="tasks">
const tasks = document.querySelector('#tasks');
tasks.appendChild(buttonPepesAge);










const convertTemperature = (temp, scale) => {
    if (scale === "C") {
        const fahrenheit = (temp * 9) / 5 + 32;
        console.log(`${temp}°C = ${fahrenheit}°F`);
    } else if (scale === "F") {
        const celsius = (temp - 32) * 5 / 9;
        console.log(`${temp}°F = ${celsius.toFixed(1)}°C`);
    } else {
        console.log("Please provide a valid scale (C or F).");
    }
};



const buttonConvertTemperature = document.createElement('button');
buttonConvertTemperature.innerText = "Uloha 2 (Convert Temperature)";
buttonConvertTemperature.setAttribute('id', 'task-2');
buttonConvertTemperature.addEventListener('click', () => {
    convertTemperature(20, "C");    
});


tasks.appendChild(buttonConvertTemperature);




// deklarace a implementace funkce
const sayHello = () => {
console.log('Hello');
};
  
// vytvoření tlačítka
const buttonSayHello = document.createElement('button');
// nastavení textu tlačítka
buttonSayHello.innerText = 'Say Hello';
// nastavení atributu id tlačítka
buttonSayHello.setAttribute('id', 'task-0');
// nabindování funkce na událost click tlačítka
buttonSayHello.addEventListener('click', () => {
sayHello();
});

// výběr existujícího elementu na stránce s id="tasks"

// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonSayHello);



/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

const podilCisel = (x, y) => {
    if (y === 0) {
        console.log("Dělení nulou není povoleno.");
        return;
    }
    const podil = x/y*100;
    console.log(x + " je " + podil + "% z" + y)
} 

podilCisel(3, 4)


const buttonPodilCisel = document.createElement('button');
buttonPodilCisel.innerText = "Uloha 3 (Podíl)";
buttonPodilCisel.setAttribute('id', 'task-3');
buttonPodilCisel.addEventListener('click', () => {
    podilCisel(3, 4);    
});

tasks.appendChild(buttonPodilCisel);





/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here

const uloha5 = (x, y) => {
    const resultElement = document.querySelector('#results'); // Zkontroluj, zda existuje element s id="results"

    if (x > y) {
        resultElement.innerText = x + " je větší.";
    } else if (x < y) {
        resultElement.innerText = y + " je větší.";
    } else {
        resultElement.innerText = "Čísla jsou stejná.";
    }
}

// Test funkce
uloha5(4, 5);
uloha5(3.2, 4.22)

const buttonCompare1 = document.createElement('button');
buttonCompare1.innerText = "Porovnat 5 a 3";
buttonCompare1.setAttribute('id', 'compare-1');
buttonCompare1.addEventListener('click', () => {
    uloha5(5, 3);  
});

// Vytvoření tlačítka pro porovnání 7.5 a 7.5
const buttonCompare2 = document.createElement('button');
buttonCompare2.innerText = "Porovnat 7.5 a 7.5";
buttonCompare2.setAttribute('id', 'compare-2');
buttonCompare2.addEventListener('click', () => {
    uloha5(7.5, 7.5); 
});

// Vytvoření tlačítka pro porovnání 0.5 a 1/2 (zlomek)
const buttonCompare3 = document.createElement('button');
buttonCompare3.innerText = "Porovnat 0.5 a 1/2";
buttonCompare3.setAttribute('id', 'compare-3');
buttonCompare3.addEventListener('click', () => {
    uloha5(0.5, 1 / 2);  
});


tasks.appendChild(buttonCompare1);
tasks.appendChild(buttonCompare2);
tasks.appendChild(buttonCompare3);




/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const uloha6 = () => {
    const result6 = document.querySelector('#results');
    result6.innerText = "";

    for (let i = 0; i <= 730; i += 13) {
        result6.innerText += i + "\n"; 
    }
}

const buttonUloha6 = document.createElement('button');
buttonUloha6.innerText = "Vypiš násobky 13";
buttonUloha6.setAttribute('id', 'task-6');
buttonUloha6.addEventListener('click', uloha6); 

// Umístění tlačítka na stránku
tasks.appendChild(buttonUloha6);



/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const uloha7 = (r) => {
    const S = 3.14*(r**2);
    console.log("obsah kružnice je " + S + "m2")

}
// tlačítko
const buttonUloha7 = document.createElement('button');
buttonUloha7.innerText = "Vypočítej obsah kružnice";
buttonUloha7.setAttribute('id', 'task-7');

buttonUloha7.addEventListener('click', () => {
    uloha7(5); 
});

tasks.appendChild(buttonUloha7);

/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const uloha8 = (v, r) => {
    const V = 1/3*3.14*r**2*v;
    console.log("objem kuželu je: " + V + " m3");
}

const buttonUloha8 = document.createElement('button');
buttonUloha8.innerText = "Objem kuželu";
buttonUloha8.setAttribute('id', 'task-8');

buttonUloha8.addEventListener('click', () => {
    uloha8(3, 3); 
});

tasks.appendChild(buttonUloha8);





/** 
 * 9) Not sure if triangle, or just some random values. Vytvořte funkci, která rozhodne, zda se z 
 * dodaných 3 délek na argumentu funkce dá postavit trojúhelník, tj. vypíše tyto 3 délky stran a, b, a c
 * a výsledek buď ano/ne, true/yes nebo false/no. Z funkce vraťte hodnotu true/false
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const uloha9 = (a,b,c) => {
    if (a + b > c && a + c > b && b + c > a) {
        console.log("Trojúhelník lze sestrojit")
    }
    else {
        console.log("Trojúhelník nelze sestrojit")
    }
}

const buttonUloha9 = document.createElement('button');
buttonUloha9.innerText = "Existence trojúhelníku";
buttonUloha9.setAttribute('id', 'task-9');

buttonUloha9.addEventListener('click', () => {
    uloha9(20, 3, 3); 
});

tasks.appendChild(buttonUloha9);



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

const uloha10 = (a, b, c) => {
    const resultElement = document.querySelector('#results');

    if (a + b > c && a + c > b && b + c > a) {
        s = (a+b+c)/2
        S = Math.sqrt(s*(s-a)*(s-b)*(s-c))
        resultElement.innerText = `Obsah trojúhelníku je: ${S.toFixed(2)} m²`; 
    } else {
        resultElement.innerText = 'Trojúhelník nelze vytvořit z těchto délek stran.'; 
    }
}

const buttonUloha10 = document.createElement('button');
buttonUloha10.innerText = "Heronův vzorec trojúhelník";
buttonUloha10.setAttribute('id', 'task-10');

buttonUloha10.addEventListener('click', () => {
    uloha10(3, 3, 3); 
});

tasks.appendChild(buttonUloha10);