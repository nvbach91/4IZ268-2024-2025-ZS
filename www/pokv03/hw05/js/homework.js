const sayHello = () => {
    result = "Ahoj světe";
    return result;
}

const ageFc = (age) => {
    const result = "Pepemu je " + age + " let.";
    return result;
}

const celsToFar = (c) => {
    const result = c * 9 / 5 + 32;
    return result;
}

const farToCels = (f) => {
    const result = (f - 32) * 5 / 9;
    return result;
}

const buttonAge = document.createElement("button");
buttonAge.innerText = "Pepe's age";
buttonAge.setAttribute("id", "task-1");

buttonAge.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = ageFc(41);
    resultDiv.appendChild(newDiv);
});

const buttonCels = document.createElement("button");
buttonCels.innerText = "Celsius";
buttonCels.setAttribute("id", "task-2");

buttonCels.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = farToCels(100);
    resultDiv.appendChild(newDiv);
});

const buttonFar = document.createElement("button");
buttonFar.innerText = "Fahrenheit";
buttonFar.setAttribute("id", "task-2");

buttonFar.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = celsToFar(100);
    resultDiv.appendChild(newDiv);
});

const buttonDivide = document.createElement("button");
buttonDivide.innerText = "Divide";
buttonDivide.setAttribute("id", "task-4");

buttonDivide.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = divideFc(7,11);
    resultDiv.appendChild(newDiv);
});

const buttonInt = document.createElement("button");
buttonInt.innerText = "int";
buttonInt.setAttribute("id", "task-5");

buttonInt.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = compareNumbers(7,7);
    resultDiv.appendChild(newDiv);
});

const buttonFloat = document.createElement("button");
buttonFloat.innerText = "float";
buttonFloat.setAttribute("id", "task-5");

buttonFloat.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = compareNumbers(400.65468,111.6546);
    resultDiv.appendChild(newDiv);
});

const buttonFrac = document.createElement("button");
buttonFrac.innerText = "frac";
buttonFrac.setAttribute("id", "task-5");

buttonFrac.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = compareNumbers(7/6, 14/13);
    resultDiv.appendChild(newDiv);
});

const buttonMultiples = document.createElement("button");
buttonMultiples.innerText = "multiples";
buttonMultiples.setAttribute("id", "task-6");

buttonMultiples.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = multiples();
    resultDiv.appendChild(newDiv);
});

const buttonCircle = document.createElement("button");
buttonCircle.innerText = "Obsah kruhu při poloměru 7";
buttonCircle.setAttribute("id", "task-7");

buttonCircle.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = circleArea(7);
    resultDiv.appendChild(newDiv);
});

const buttonCone = document.createElement("button");
buttonCone.innerText = "Objem kuželu při poloměru 8 a výšce 14";
buttonCone.setAttribute("id", "task-8");

buttonCone.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = coneVolume(8,14);
    resultDiv.appendChild(newDiv);
});

const buttonIsItTriangle = document.createElement("button");
buttonIsItTriangle.innerText = "Lze zformovat trojúhelník při stranách 7, 8, 9?";
buttonIsItTriangle.setAttribute("id", "task-9");

buttonIsItTriangle.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = itsTriangle(7, 8, 9);
    resultDiv.appendChild(newDiv);
});

const buttonTriangleArea = document.createElement("button");
buttonTriangleArea.innerText = "Obsah trojúhelníku při stranách 7, 8, 9";
buttonTriangleArea.setAttribute("id", "task-10");

buttonTriangleArea.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = triangleArea(7, 8, 9);
    resultDiv.appendChild(newDiv);
});

const buttonTriangleArea2 = document.createElement("button");
buttonTriangleArea2.innerText = "Obsah trojúhelníku při stranách 7, 8, 90";
buttonTriangleArea2.setAttribute("id", "task-10");

buttonTriangleArea2.addEventListener("click", () => {
    const resultDiv = document.querySelector("#result");
    const newDiv = document.createElement("div");
    newDiv.textContent = triangleArea(7, 8, 90);
    resultDiv.appendChild(newDiv);
});


const printResult = document.querySelector("#tasks");
printResult.appendChild(buttonAge);
printResult.appendChild(buttonCels);
printResult.appendChild(buttonFar);
printResult.appendChild(buttonDivide);
printResult.appendChild(buttonInt);
printResult.appendChild(buttonFloat);
printResult.appendChild(buttonFrac);
printResult.appendChild(buttonMultiples);
printResult.appendChild(buttonCircle);
printResult.appendChild(buttonCone);
printResult.appendChild(buttonIsItTriangle);
printResult.appendChild(buttonTriangleArea);
printResult.appendChild(buttonTriangleArea2);


//4
const divideFc = (a,b) =>{
    if (b === 0) {
        return "Dělení nulou!";
    }
    const divide = (a * 100 / b).toFixed(2);
    const result = a + " je " + divide + " % z " + b;
    return result;
}

//5
const compareNumbers = (a, b) =>{
    if (a > b) {
        result = a + " je větší než " + b;
    } else if (a < b) {
        result = a + " je menší než " + b;
    } else {
        result = a + " a " + b + " se rovnají";
    }

    return result;
}

//6
const multiples = () =>{
    let result = '';
    for (let i = 0; i <= 730; i += 13) {
        result += i + ', ';
    }
    return result
}

//7
const circleArea = (r) =>{
    result = "Obsah kruhu je " + (Math.PI * (r ** 2)).toFixed(2);
    return result;
}

//8
const coneVolume = (r, h) =>{
    const result = "Objem kuželu je " + ((1 / 3) * Math.PI * (r ** 2) * h).toFixed(2); 
    return result;
}

//9
const itsTriangle = (a, b, c) =>{
    const isTriangle = (a + b > c) && (a + c > b) && (b + c > a);
    if(isTriangle){
        return true;
    }else{
        return false;
    }
}

//10
const triangleArea = (a, b, c) =>{
    const itsPossible = itsTriangle(a, b, c);

    if(itsPossible){
        const s = (a + b + c) / 2;
        result = "Obsah je " + (Math.sqrt(s * (s - a) * (s - b) * (s - c))).toFixed(2);
    }else{
        result = "Nejde spočítat"
    }

    return result;
}
