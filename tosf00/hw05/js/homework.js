const tasks = document.querySelector('#tasks');
const results = document.querySelector('#results');

/* 0) HELLO */
console.log('Hello World!');

/* 1) PEPE */
var age = 23;
console.log(`Pepe is ${age} years old.`)

/* 2) CELSIUS and FAHRENHEIT */
var fahrenheit = 68;
console.log(`${fahrenheit}°F = ` + (((fahrenheit - 32) * 5) / 9) + '°C');

var celsius = 20;
console.log(`${celsius}°C = ` + (((celsius * 9) / 5) + 32) + '°F');

/* 3 FUNCTIONS */
const sayHello = () => {
    console.log('Hello World!');
}

const buttonHello = document.createElement('button');
buttonHello.innerText = 'Hello!';
buttonHello.setAttribute('id', 'task-0');
buttonHello.addEventListener('click', () => {
    sayHello();
});
tasks.appendChild(buttonHello);

const sayHiPepe = (age) => {
    var answer = `Pepe is ${age} years old.`;
    console.log(answer);
}

const buttonPepe = document.createElement('button');
buttonPepe.innerText = 'Pepe';
buttonPepe.setAttribute('id', 'task-1');
buttonPepe.addEventListener('click', () => {
    sayHiPepe(20);
});
tasks.appendChild(buttonPepe);

const getCelsius = (fahrenheit) => {
    var inCelsius = `${fahrenheit}°F = ` + (((fahrenheit - 32) * 5) / 9) + '°C';
    console.log(inCelsius);
}

const getFahrenheit = (celsius) => {
    var inFahrenheit = `${celsius}°C = ` + (((celsius * 9) / 5) + 32) + '°F';
    console.log(inFahrenheit);
}

const buttonCelsius = document.createElement('button');
buttonCelsius.innerText = 'To Celsius';
buttonCelsius.setAttribute('id', 'task-2');
buttonCelsius.addEventListener('click', () => {
    getCelsius(68);
});
tasks.appendChild(buttonCelsius);

const buttonFahrenheit = document.createElement('button');
buttonFahrenheit.innerText = 'To Fahrenheit';
buttonFahrenheit.setAttribute('id', 'task-3');
buttonFahrenheit.addEventListener('click', () => {
    getFahrenheit(20);
});
tasks.appendChild(buttonFahrenheit);

/* 4) %CENSORED% */
const percantageOfNum = (a, b) => {
    const div = document.createElement("div");
    if (b != 0) {
        var portion = (a / b) * 100;
        portion = portion.toFixed(2);
        div.innerHTML = `${a} je ${portion}% z ${b}`;
    } else {
        div.innerHTML = 'Nelze dělit nulou';
    }
    results.appendChild(div);
}
const buttonPercantageOfNum = document.createElement('button');
buttonPercantageOfNum.innerText = 'Divide numbers';
buttonPercantageOfNum.setAttribute('id', 'task-4');
buttonPercantageOfNum.addEventListener('click', () => {
    percantageOfNum(3, 12);
    //percantageOfNum(1, 0);
});
tasks.appendChild(buttonPercantageOfNum);

/* 5) COMPARISON*/

const compareNums = (a, b) => {
    const div = document.createElement("div");
    var result;
    if (a > b) {
        result = `${a} is greater than ${b}`;
    } else if (a < b) {
        result = `${a} is smaller than ${b}`;
    } else {
        result = `${a} equals ${b}`;
    }
    div.innerHTML = result;
    results.appendChild(div);
}

const buttonCompareNums = document.createElement('button');
buttonCompareNums.innerText = 'Compare Numbers (3,12)';
buttonCompareNums.setAttribute('id', 'task-5a');
buttonCompareNums.addEventListener('click', () => {
    compareNums(3, 12);
});
tasks.appendChild(buttonCompareNums);

const buttonCompareNums2 = document.createElement('button');
buttonCompareNums2.innerText = 'Compare Numbers (-12,3)';
buttonCompareNums2.setAttribute('id', 'task-5b');
buttonCompareNums2.addEventListener('click', () => {
    compareNums(-12, -3);
});
tasks.appendChild(buttonCompareNums2);

const buttonCompareNums3 = document.createElement('button');
buttonCompareNums3.innerText = 'Compare Numbers (1/4,1/5)';
buttonCompareNums3.setAttribute('id', 'task-5c');
buttonCompareNums3.addEventListener('click', () => {
    compareNums(1 / 4, 1 / 5);
});
tasks.appendChild(buttonCompareNums3);

const buttonCompareNums4 = document.createElement('button');
buttonCompareNums4.innerText = 'Compare Numbers (0.1 ,0.11)';
buttonCompareNums4.setAttribute('id', 'task-5d');
buttonCompareNums4.addEventListener('click', () => {
    compareNums(0.1, 0.11);
});
tasks.appendChild(buttonCompareNums4);

/* 6) MULTIPLES OF 13 */
const multiples = () => {
    const div = document.createElement("div");
    let result = ' ';
    for (let i = 0; i <= 730; i += 13) {
        result += i + ' ';
    }
    div.innerHTML = result;
    results.appendChild(div);
}

const buttonMultiples = document.createElement('button');
buttonMultiples.innerText = 'Multiples of 13';
buttonMultiples.setAttribute('id', 'task-6');
buttonMultiples.addEventListener('click', () => {
    multiples();
});
tasks.appendChild(buttonMultiples);

/* 7) CIRCLE */
const circleCreation = (r) => {
    const div = document.createElement("div");
    div.innerHTML = 3.14 * r * r;
    results.appendChild(div);
}
const buttonCircleArea = document.createElement('button');
buttonCircleArea.innerText = 'Circle area';
buttonCircleArea.setAttribute('id', 'task-7');
buttonCircleArea.addEventListener('click', () => {
    circleCreation(5);
});
tasks.appendChild(buttonCircleArea);

/* 8) CONE */
const coneVolume = (r, h) => {
    const div = document.createElement("div");
    div.innerHTML = (1 / 3) * 3.14 * r * r * h;
    results.appendChild(div);
}
const buttonConeVolume = document.createElement('button');
buttonConeVolume.innerText = 'Volume of cone';
buttonConeVolume.setAttribute('id', 'task-8');
buttonConeVolume.addEventListener('click', () => {
    coneVolume(5, 6);
});
tasks.appendChild(buttonConeVolume);

/* 9) TRIANGLE */
const isTriangle = (a, b, c) => {
    const div = document.createElement("div");
    const result = (a + b > c) && (a + c > b) && (b + c > a);
    var answer;
    if (result) {
        answer = `Yes, ${a}, ${b} and ${c} can form a triangle.`;
    } else {
        answer = `No, ${a}, ${b} and ${c} can't form a triangle.`;
    }
    div.innerHTML = answer;
    results.appendChild(div);
    return result;
}

const buttonIsTriangle = document.createElement('button');
buttonIsTriangle.innerText = 'Is triangle?';
buttonIsTriangle.setAttribute('id', 'task-9');
buttonIsTriangle.addEventListener('click', () => {
    isTriangle(1, 2, 3);
});
tasks.appendChild(buttonIsTriangle);

/* 10) HERON */
const heronFormula = (a, b, c) => {
    const div = document.createElement("div");
    var answer;
    if (isTriangle(a, b, c)) {
        var s = (a + b + c) / 2;
        var area = Math.sqrt(s * (s - a) * (s - b) * (s - c)).toFixed(2);;
        answer = `The area of the triangle is ${area}`;
    } else {
        answer = "Not able to calculate the area, because the provided values do not meet requirements to construct a triangle."
    }
    div.innerHTML = answer;
    results.appendChild(div);
}

const buttonHeronFormula = document.createElement('button');
buttonHeronFormula.innerText = "Heron's formula";
buttonHeronFormula.setAttribute('id', 'task-10');
buttonHeronFormula.addEventListener('click', () => {
    heronFormula(2, 2, 3);
});
tasks.appendChild(buttonHeronFormula);
