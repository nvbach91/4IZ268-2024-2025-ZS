//0)
const myH1 = document.querySelector("h1");
myH1.innerText = "JavaScript is awesome!";
const Hello = () => {
    console.log('Ahoj světe');
}
//1)
const PepaAge = (year) => {
    const age = (new Date().getFullYear() - year);
    console.log(`Věk Pepy je: ${age}`);
    return 0;
}
//2)
const TemperatureC = 0;
const TemperatureF = 0;
const CtoF = (temp) => {
    const TempInF = ((temp * 9) / 5) + 32;
    console.log(`Teplota: ${TempInF} °F`);
    return 0;
}
const FtoC = (temp) => {
    const TempInC = ((temp - 32) * 5) / 9;
    console.log(`Teplota: ${TempInC} °C`);
    return 0;
}
//3)
Hello();
PepaAge(1995);
CtoF(30);
FtoC(100);
// vytvoření tlačítka
const buttonPepa = document.createElement('button');
// nastavení textu tlačítka
buttonPepa.innerText = `Uloha 1 (Pepe's age)`;
// nastavení atributu id tlačítka
buttonPepa.setAttribute('id', 'task-1');
// nabindování funkce na událost click tlačítka
buttonPepa.addEventListener('click', () => {
 PepaAge(1999);
});
// výběr existujícího elementu na stránce s id="tasks"
const tasks = document.querySelector('#tasks');
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonPepa);
//4)
const Division = (a,b) => {
    if(b!=0){
        return `${a} je: ${((a/b) * 100).toFixed(2)}% z ${b}`;
    }
    else{
        console.log("Nelze dělit nulou")
        return -1;
    }
}
// vytvoření tlačítka
const buttonDivide = document.createElement('button');
// nastavení textu tlačítka
buttonDivide.innerText = `Uloha 4 (Podíl čísla)`;
// nastavení atributu id tlačítka
buttonDivide.setAttribute('id', 'task-4');
// nabindování funkce na událost click tlačítka
buttonDivide.addEventListener('click', () => {
    const results = document.getElementById("results");
    results.innerText = Division(5,10);
});
// výběr existujícího elementu na stránce s id="tasks"
const results = document.querySelector('#results');
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonDivide);
//5)
const Compare = (a,b) => {
    if((Math.abs(a-b)) < 0.0000001){
        return `${a.toFixed(2)} = ${b.toFixed(2)}`;
    }
    else if (a<b){
        return `${a.toFixed(2)} < ${b.toFixed(2)}`;
    }else{
        return `${a.toFixed(2)} > ${b.toFixed(2)}`;
    }
}
// vytvoření tlačítka
const buttonCompare = document.createElement('button');
// nastavení textu tlačítka
buttonCompare.innerText = `Uloha 5 (Porovnání celých čísel)`;
// nastavení atributu id tlačítka
buttonCompare.setAttribute('id', 'task-5');
// nabindování funkce na událost click tlačítka
buttonCompare.addEventListener('click', () => {
    const results = document.getElementById("results");
    results.innerText = Compare(150,3845);
});
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonCompare);

// vytvoření tlačítka
const buttonCompareLess = document.createElement('button');
// nastavení textu tlačítka
buttonCompareLess.innerText = `Uloha 5 (Porovnání čísel)`;
// nastavení atributu id tlačítka
buttonCompareLess.setAttribute('id', 'task-5b');
// nabindování funkce na událost click tlačítka
buttonCompareLess.addEventListener('click', () => {
    results.innerText = Compare(0.1+0.1+0.1,0.3);
});
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonCompareLess);

// vytvoření tlačítka
const buttonCompareGreater = document.createElement('button');
// nastavení textu tlačítka
buttonCompareGreater.innerText = `Uloha 5 (Porovnání des. čísel)`;
// nastavení atributu id tlačítka
buttonCompareGreater.setAttribute('id', 'task-5c');
// nabindování funkce na událost click tlačítka
buttonCompareGreater.addEventListener('click', () => {
    const results = document.getElementById("results");
    results.innerText = Compare(1/3,0.3);
});
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonCompareGreater);

//6)
const fridayTheThirteenth = () =>{
    let multiples = "";
    for (let i = 13; i <= 730; i+=13){
        multiples += i + "<br>";
    }
    document.getElementById("results");
    results.innerHTML = multiples;
}
// vytvoření tlačítka
const buttonThirteen = document.createElement('button');
// nastavení textu tlačítka
buttonThirteen.innerText = `Uloha 6 (Násobky 13)`;
// nastavení atributu id tlačítka
buttonThirteen.setAttribute('id', 'task-6');
// nabindování funkce na událost click tlačítka
buttonThirteen.addEventListener('click', () => {
    fridayTheThirteenth();
});
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonThirteen);

//7)
const area = (r) => {
    return Math.PI * Math.pow(r, 2);
}
// vytvoření tlačítka
const buttonArea = document.createElement('button');
// nastavení textu tlačítka
buttonArea.innerText = `Uloha 7 (Obsah kruhu)`;
// nastavení atributu id tlačítka
buttonArea.setAttribute('id', 'task-7');
// nabindování funkce na událost click tlačítka
buttonArea.addEventListener('click', () => {
    results.innerText = area(10);
});
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonArea);

//8)
const ConeVolume = (height, radius) => {
    return (1/3 * Math.PI * Math.pow(radius, 2) * height);
}
// vytvoření tlačítka
const buttonCone = document.createElement('button');
// nastavení textu tlačítka
buttonCone.innerText = `Uloha 8 (Objem kužele)`;
// nastavení atributu id tlačítka
buttonCone.setAttribute('id', 'task-8');
// nabindování funkce na událost click tlačítka
buttonCone.addEventListener('click', () => {
    results.innerText = ConeVolume(8,4);
});
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonCone);
//9)
const IsTriangle = (a,b,c) => {
    if (a + b <= c || a + c <= b || b + c <= a) {
        results.innerText = "ne"
        return false;
    }else{
        results.innerText = "ano"
        return true;
    }
}
// vytvoření tlačítka
const buttonTriangle = document.createElement('button');
// nastavení textu tlačítka
buttonTriangle.innerText = `Uloha 9 (Trojúhelník?)`;
// nastavení atributu id tlačítka
buttonTriangle.setAttribute('id', 'task-9');
// nabindování funkce na událost click tlačítka
buttonTriangle.addEventListener('click', () => {
    IsTriangle(1,1,1);
});
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonTriangle);

// vytvoření tlačítka
const buttonTriangle2 = document.createElement('button');
// nastavení textu tlačítka
buttonTriangle2.innerText = `Uloha 9 (Trojúhelník?ne)`;
// nastavení atributu id tlačítka
buttonTriangle2.setAttribute('id', 'task-9b');
// nabindování funkce na událost click tlačítka
buttonTriangle2.addEventListener('click', () => {
    IsTriangle(1,1,8);
});
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonTriangle2);
//10)
const HeronFormula = (a,b,c) => {
    if(IsTriangle(a,b,c)){
        const s = (a+b+c)/2
        return Math.sqrt(s*(s-a)*(s-b)*(s-c));
    }else{
        results.innerText = "není trojúhelník"
        return -1;
    }
}
// vytvoření tlačítka
const buttonHeron = document.createElement('button');
// nastavení textu tlačítka
buttonHeron.innerText = `Uloha 10 (Obsah Heron)`;
// nastavení atributu id tlačítka
buttonHeron.setAttribute('id', 'task-10');
// nabindování funkce na událost click tlačítka
buttonHeron.addEventListener('click', () => {
    results.innerText = HeronFormula(10,10,10);
});
// vložení vytvořeného tlačítka do vybraného elementu na stránce
tasks.appendChild(buttonHeron);