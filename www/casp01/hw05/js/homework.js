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
const birthYear = 2000;
console.log(`Pepe is ${2024-birthYear} years old!`);




/**
 * 2) WTF (wow, that's fun). Vypište na konzoli teplotu v Fahrenheiht, pokud znáte teplotu v Celsius, a také naopak. 
 * Formát výpisu je: 20°C =  68°F resp. 68°F = 20°C. Opět používejte proměnné. Výpočet probíhá takto:
 *     z C na F: vynásobit 9, vydělit 5 a přičíst 32. 
 *     z F na C: odečíst 32, vynásobit 5 a vydělit 9. 
 */
// Solution here
const cel = 20;
const far = 68;
const celToFar = (x) =>{
    console.log((x*9/5)+32);
};
const farToCel = (x) =>{
    console.log((x-32)*5/9);
};
celToFar(cel);
farToCel(far);



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
const ageCounter = (birth) => {
    console.log(`Pepe is ${2024-birth} years old`);
};
const buttonPepeAge = document.querySelector("#task-1");
buttonPepeAge.addEventListener("click",() => {
    ageCounter(birthYear);
});
const buttonTemp = document.querySelector("#task-2");
buttonTemp.addEventListener("click", () =>{
    celToFar(cel);
    farToCel(far);
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
const ratio = (x,y) => {
    const outputFour = document.querySelector("#result-4");
    if (x===0){
        outputFour.textContent = "Cannot divide by zero!"
        return 0;
    }
    const res = (y/x*100).toFixed(2);
    outputFour.textContent = `${y} is ${res}% of ${x}`;
}
const buttonRatio = document.querySelector("#task-4");
buttonRatio.addEventListener("click", () => {
    ratio(2323,7);
})




/**
 * 5) Kdo s koho. Vytvořte funkci, která vezme 2 číselné argumenty a vypíše, který z nich je větší, do předem vytvořeného 
 * místa na strácne. Pokud se čísla rovnají, vypište, že se rovnají. 
 * 
 * Vyzkoušejte funkčnost pro celá čísla, desetinná čísla, zlomky, atd., tj. vytvoříte tlačítko s událostí pro každou
 * kombinaci argumentů a zkuste ji párkrát zavolat kliknutím na toto tlačítko. Tlačítka vytvářejte podle pokynu v 
 * úloze č. 3. Argumenty pro volání funkce zadávejte staticky.
 */
// Solution here
const outputFive = document.querySelector("#result-5");
const comparator = (x,y) => {
    if (x>y){
        outputFive.textContent =`${x} is bigger than ${y}`;
    }
    if(x===y){
        outputFive.textContent =`${x} and ${y} are equal`;
    }
    if(x<y){
        outputFive.textContent =`${x} is smaller than ${y}`;
    }
}
const buttonCompOne = document.querySelector("#task-5-greater");
buttonCompOne.addEventListener("click", () =>{
    comparator(5,3);
})
const buttonCompTwo = document.querySelector("#task-5-lesser");
buttonCompTwo.addEventListener("click", () =>{
    comparator(3,5);
})
const buttonCompThree = document.querySelector("#task-5-equal");
buttonCompThree.addEventListener("click", () =>{
    comparator(3,3);
})





/**
 * 6) I can cleary see the pattern. Vytvořte funkci, která vypíše popořadě všechny násobky 13, které jsou menší 
 * nebo rovno 730, včetě nuly. Používejte for cyklus. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3.
 */
// Solution here
const thirteenReasonsWhy = () =>{
    let mult = 0;
    while(mult <=730){
        console.log(mult);
        mult = mult + 13;
    }
}
const button13 = document.querySelector("#task-6");
button13.addEventListener("click",() =>{
    thirteenReasonsWhy();
});




/**
 * 7) Around and about. Vytvořte funkci, která vypočte obsah kružnice podle dodaného poloměru v argumentu. 
 *
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const circle = (r) =>{
    return Math.PI*r**2; 
}
const buttonCircle = document.querySelector("#task-7");
buttonCircle.addEventListener("click", () => {
    console.log(circle(3));
});




/**
 * 8) Another dimension. Vytvořte funkci, která vypočte objem kuželu, pokud dostanete na argumentech výšku a poloměr. 
 * 
 * Pro testování vytvořte tlačítko s touto funkcí podle pokynu v úloze č. 3. Argumenty pro volání funkce zadávejte 
 * staticky.
 */
// Solution here
const cone = (r,h) =>{
    return (h*Math.PI*r**2)/3;
}
const buttonCone = document.querySelector("#task-8");
buttonCone.addEventListener("click", () => {
    console.log(cone(1,3));
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
const triangleChecker = (a,b,c) =>{
    if (a + b <= c || a + c <= b || c+b <= a){
        console.log(`${a} ${b} ${c} false`);
        return false;
    }
    else{
        console.log(`${a} ${b} ${c} true`);
        return true;
    }

};
const triagleButton = document.querySelector("#task-9");
triagleButton.addEventListener("click", () => {
    triangleChecker(2,2,3);
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
const heronButton = document.querySelector("#task-10");
heronButton.addEventListener("click",() =>{
    iNeedAHeron(2,2,3);
})
const outputTen = document.querySelector("#result-10");
const iNeedAHeron = (a,b,c) =>{
    if (!triangleChecker(a,b,c)){
        outputTen.textContent="That's not a triangle!"
        return false;
    }
    const s = (a+b+c)/2;
    const res = Math.sqrt(s*(s-a)*(s-b)*(s-c));
    outputTen.textContent=`The result is ${res}`;
    return true;
}


