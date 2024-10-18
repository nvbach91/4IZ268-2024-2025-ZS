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
document.addEventListener('DOMContentLoaded', () => {
    const calculatePepeAge = (birthYear) => {
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        console.log(`Pepe is ${age} years old.`);
    };
    const buttonTask1 = document.getElementById('task-1');
    if (buttonTask1) {
        buttonTask1.addEventListener('click', () => {
            const birthYearValue = 1453; 
            const result = calculatePepeAge(birthYearValue);
    
        });
    }

/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const celsiusToFahrenheit = (celsius) => {
    const fahrenheit = (celsius * 9) / 5 + 32;
    console.log(`${celsius}°C = ${fahrenheit}°F`);
};
const buttonTask2 = document.getElementById('task-2');
if (buttonTask2) {
    buttonTask2.addEventListener('click', () => {
        const celsiusValue = 20; 
        const result = celsiusToFahrenheit(celsiusValue);

    });
}

const fahrenheitToCelsius = (fahrenheit) => {
    const celsius = ((fahrenheit - 32) * 5) / 9;
    console.log(`${fahrenheit}°F = ${celsius.toFixed(1)}°C`);
    
};
const buttonTask3 = document.getElementById('task-3');
if (buttonTask3) {
    buttonTask3.addEventListener('click', () => {
        const fahrenheitValue = 68; 
        const result = fahrenheitToCelsius(fahrenheitValue);

    });
}
});
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





/**
 * 4) %CENSORED%. Vytvořte funkci, která vezme 2 číselné argumenty a vrátí podíl prvního čísla a druhého čísla. 
 * Výsledek vypište v procentech do předem vytvořeného místa na stránce pro výsledky, např. 21 je 50% z 42. Pro 
 * zkrácení / zaokrouhlení desetinných míst použijte funkci .toFixed(n). Např. var pi = 3.1415926535; pi.toFixed(2); 
 * Pozor na dělení nulou! 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3
 */
// Solution here

document.addEventListener('DOMContentLoaded', () => {
   
    const calculatePercentage = (num1, num2) => {
        if (num2 === 0) {
            return 'Dělení nulou není povoleno!';
        }
        const percentage = (num1 / num2) * 100;
        return `${num1} je ${percentage.toFixed(2)}% z ${num2}`;
    };

 
    const buttonTask4 = document.getElementById('task-4');
    
   
    if (buttonTask4) {
        buttonTask4.addEventListener('click', () => {
            const num1 = 21; 
            const num2 = 42; 
            const result = calculatePercentage(num1, num2);

            
            const resultDiv = document.getElementById('results');
            resultDiv.innerText = result;
        });
    } else {
        console.error('Tlačítko s id "task-4" nebylo nalezeno.');
    }




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
        return `${num1} je větší než ${num2}`;
    } else if (num1 < num2) {
        return `${num1} je menší než ${num2}`;
    } else {
        return `${num1} a ${num2} jsou si rovny`;
    }
};
const buttonTask5_cela = document.getElementById('task-5-cela');
if (buttonTask5_cela) {
    buttonTask5_cela.addEventListener('click', () => {
        const num1 = 5; 
        const num2 = 10; 
        const result = compareNumbers(num1, num2);

        const resultDiv = document.getElementById('results');
        resultDiv.innerText = result;
    });
    const buttonTask5_desetina = document.getElementById('task-5-desetina');
    if (buttonTask5_desetina) {
        buttonTask5_desetina.addEventListener('click', () => {
            const num1 = 5.5; 
            const num2 = 5.5; 
            const result = compareNumbers(num1, num2);
    
            const resultDiv = document.getElementById('results');
            resultDiv.innerText = result;
        });
        const buttonTask5_zlomky = document.getElementById('task-5-zlomky');
if (buttonTask5_zlomky) {
    buttonTask5_zlomky.addEventListener('click', () => {
        const num1 = 5/2; 
        const num2 = 10/9; 
        const result = compareNumbers(num1, num2);

        const resultDiv = document.getElementById('results');
        resultDiv.innerText = result;
    });
}
    }
}


/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const printMultiplesOf13 = () => {
    let result = ''; 
    for (let i = 0; i <= 730; i += 13) {
        result += i + ' '; 
    }
    return result.trim(); 
};
const buttonTask6 = document.getElementById('task-6');
    if (buttonTask6) {
        buttonTask6.addEventListener('click', () => {
            const result = printMultiplesOf13();

            const resultDiv = document.getElementById('results');
            resultDiv.innerText = result;
        });
    }



/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here

const calculateCircleArea = (radius) => {
    const area = Math.PI * Math.pow(radius, 2);
    return `Obsah kružnice s poloměrem ${radius} je ${area.toFixed(2)}`;
};

const buttonTask7 = document.getElementById('task-7');
if (buttonTask7) {
    buttonTask7.addEventListener('click', () => {
        const radius = 10; 
        const result = calculateCircleArea(radius);

        const resultDiv = document.getElementById('results');
        resultDiv.innerText = result;
    });
}



/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const calculateConeVolume = (radius, height) => {
    const volume = (1/3) * Math.PI * Math.pow(radius, 2) * height;
    return `Objem kuželu s poloměrem ${radius} a výškou ${height} je ${volume.toFixed(2)}`;
};


const buttonTask8 = document.getElementById('task-8');
if (buttonTask8) {
    buttonTask8.addEventListener('click', () => {
        const radius = 5; 
        const height = 12; 
        const result = calculateConeVolume(radius, height);

        const resultDiv = document.getElementById('results');
        resultDiv.innerText = result;
    });
}




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
    if (a + b > c && a + c > b && b + c > a) {
        return true;
    }
    return false;
};

const buttonTask9 = document.getElementById('task-9');
if (buttonTask9) {
    buttonTask9.addEventListener('click', () => {
        const a = 5;  
        const b = 7;  
        const c = 10; 
        const result = isTriangle(a, b, c);
        
        const resultDiv = document.getElementById('results');
        resultDiv.innerText = `Strany: a=${a}, b=${b}, c=${c} -> ${result ? 'Ano' : 'Ne'}`;
    });
}




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

const isTriangleHeronic = (a, b, c) => {
    return a + b > c && a + c > b && b + c > a;
};

const calculateTriangleArea = (a, b, c) => {
    if (!isTriangleHeronic(a, b, c)) {
        return 'Nelze vytvořit trojúhelník z těchto stran.';
    }

    const s = (a + b + c) / 2; 
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    return `Obsah trojúhelníku se stranami a=${a}, b=${b}, c=${c} je ${area.toFixed(2)}`;
};

const buttonTask10 = document.getElementById('task-10');
if (buttonTask10) {
    buttonTask10.addEventListener('click', () => {
        const a = 5;  
        const b = 7;  
        const c = 10; 
        const result = calculateTriangleArea(a, b, c);

        const resultDiv = document.getElementById('results');
        resultDiv.innerText = result;
    });
}


});