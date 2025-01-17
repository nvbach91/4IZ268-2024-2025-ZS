const app = $('#app');
let score = 0;
const apiKey = "e6ddb7a05694a1e542e615f585d6bd42"
const questions = [
    { id: "highTemp", text: "Which of these cities currently has the highest temperature ?", cardNum: 5 },
    { id: "lowTemp", text: "Which of these cities currently has the lowest temperature ?", cardNum: 5 },
    { id: "currTemp", text: "What is the current temperature in this city ? (tolerance of two degrees)", cardNum: 1 },
    { id: "highWind", text: "Which of these cities is currently the windiest?", cardNum: 5 },
    { id: "highHumid", text: "Which of these cities is currently the most humid?", cardNum: 5 }
]

const cityList = [
    { name: "Prague", continent: "Europe" },
    { name: "Budapest", continent: "Europe" },
    { name: "London", continent: "Europe" },
    { name: "Berlin", continent: "Europe" },
    { name: "Stockholm", continent: "Europe" },
    { name: "Madrid", continent: "Europe" },
    { name: "Rome", continent: "Europe" },
    { name: "Glasgow", continent: "Europe" },
    { name: "Sarajevo", continent: "Europe" },
    { name: "Paris", continent: "Europe" },
    { name: "Hamburg", continent: "Europe" },
    { name: "Dublin", continent: "Europe" },
    { name: "Yakutsk", continent: "Asia" },
    { name: "Mecca", continent: "Asia" },
    { name: "Tokyo", continent: "Asia" },
    { name: "Beijing", continent: "Asia" },
    { name: "Vladivostok", continent: "Asia" },
    { name: "New Delhi", continent: "Asia" },
    { name: "Kuala Lumpur", continent: "Asia" },
    { name: "Hong Kong", continent: "Asia" },
    { name: "New York", continent: "North_America" },
    { name: "Ottawa", continent: "North_America" },
    { name: "Austin", continent: "North_America" },
    { name: "Atlanta", continent: "North_America" },
    { name: "Los Angeles", continent: "North_America" },
    { name: "San Francisco", continent: "North_America" },
    { name: "Anchorage", continent: "North_America" },
    { name: "Boston", continent: "North_America" },
    { name: "Tampa", continent: "North_America" },
    { name: "Mexico City", continent: "North_America" },
    { name: "Medellin", continent: "South_America" },
    { name: "Buenos Aires", continent: "South_America" },
    { name: "Santiago de Chile", continent: "South_America" },
    { name: "Montevideo", continent: "South_America" },
    { name: "Brasília", continent: "South_America" },
    { name: "Rio de Janeiro", continent: "South_America" },
    { name: "Caracas", continent: "South_America" },
    { name: "Havana", continent: "South_America" },
    { name: "Cairo", continent: "Africa" },
    { name: "Cape Town", continent: "Africa" },
    { name: "Benghazi", continent: "Africa" },
    { name: "Algiers", continent: "Africa" },
    { name: "Addis Ababa", continent: "Africa" },
    { name: "Kinshasa", continent: "Africa" },
    { name: "Mogadishu", continent: "Africa" },
    { name: "Lagos", continent: "Africa" },
    { name: "Casablanca", continent: "Africa" },
    { name: "Perth", continent: "Australia" },
    { name: "Adelaide", continent: "Australia" },
    { name: "Melbourne", continent: "Australia" },
    { name: "Sydney", continent: "Australia" },
]

let playerName = "";


//Zadani jmena a nasledna inicializace herni plochy
const init = () => {
    $(`.removable`).remove();
    score = 0;
    const mainTitle = $(`
        <h1 class="removable">Weatherguessr</h1>
        `)
    app.append(mainTitle);
    const nameForm = $(`
            <form autocomplete="off" class="removable inputForm" id="nameForm">
                <input id="playerName" name="name" required>
                <button id="nameButton">Enter</button>
            </form>
    `);
    app.append($(`<h2 class="removable" id="question">Enter your name!</h2>`))
    app.append(nameForm);

    nameForm.submit((event) => {
        event.preventDefault();
        inputData = new FormData(nameForm.get(0));
        console.log(inputData);
        playerName = inputData.get("name");
        if (inputValidator(playerName)) {
            nextTurn();
        }
        console.log(playerName);
    });

    /*
    const form = $(`#nameForm`)
    form.find("#nameButton").on("click", () => {
        playerName = form.find("#playerName").val();
        console.log(playerName)
        if (inputValidator(playerName)) {
            nextTurn();
        }
    });
    */
};

const inputValidator = (name) => {
    console.log(name);
    const trimmedName = name.trim();
    if (trimmedName === "") {
        return false;
    }
    return true;
};

//Funkce vraci nahodne cele cislo v predem urcenem rozsahu
const questionPicker = () => {
    if (score < 3) {
        return questions[Math.floor(Math.random() * (questions.length - 3))];
    }
    else if (score < 6) {
        return questions[Math.floor(Math.random() * (questions.length - 2))];
    }
    else {
        return questions[Math.floor(Math.random() * (questions.length))];
    };
};

//Funkce vytvarejici karty
const cardMaker = (input, answer, question) => {
    //console.log("lol")
    if (Number(question.cardNum) === 1) {
        const card = $(`
                <div class=" removable card ${input.continent} single" id="card${input.name}">${input.name}</div>
                <form id="answerForm" autocomplete="off" class="inputForm">
                        <input id="answerInput" name="answerName">
                        <button id="answerButton">Enter</button>
                </form>
            `);
        card.find("#answerButton").on("click", () => {
            const ans = $("#answerInput").val();
            if (Number(ans) >= Number(answer) - 2 && Number(ans) <= Number(answer) + 2) {
                score += 2;
                nextTurn();
            }
            else {
                gameOver(answer, question);
            }
        });
        return card;
    } else {
        const card = $(`
        <div class="removable card ${input.continent} multiple" id="card${input.name}">${input.name}</div>
        `);
        card.on("click", () => {
            if (question.id === "highTemp" || question.id === "lowTemp") {
                console.log(input.temperature);
                if (input.temperature === answer.temperature) {
                    score++;
                    nextTurn();
                }
                else {
                    gameOver(answer, question);
                }
            } else if (question.id === "highWind") {
                if (input.wind === answer.wind) {
                    score++;
                    nextTurn();
                }
                else {
                    gameOver(answer, question);
                }
            } else {
                if (input.humidity === answer.humidity) {
                    score++;
                    nextTurn();
                }
                else {
                    gameOver(answer, question);
                }
            }
        }

        )
        return card;
    };
}
//Funkce na ziskani dat z weatherstack API
const dataFetcher = async (city, continent) => {
    const url = `https://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
    try {
        const resp = await fetch(url, { method: "GET" });
        const res = await resp.json();
        return jsonTransformer(res, continent);
    } catch (error) {
        console.error(error);
    }
}

//Funkce transformujicji json z weatherstack API do pouzitelnejsi formy
const jsonTransformer = (data, continent) => {
    console.log(data);
    const newData = { name: data.location.name, temperature: data.current.temperature, wind: data.current.wind_speed, humidity: data.current.humidity, continent: continent }
    console.log(newData);
    return newData;
}
/*
//Funkce na precteni lokalniho JSON souboru, nebude pouzito ve finalni verzi
const jsonReader = () =>{
   const inputElement = $(`
       <input type="file" id="fileInput" accept=".json"/>
       `);
   const readButton = $(`
       <button id="jsonButton">Read data</button>
       `);
   const outputElement = $(`
       <pre id="output"></pre>
       `);
   app.append(readButton);
   app.append(inputElement);
   app.append(outputElement);
   $("#fileInput").on("change", (event)=>{
       const file = event.target.files[0];
       //console.log(file);
       if(file){
           const reader = new FileReader();
           reader.onload = (e) =>{
               try{
                   const jsonLmao = JSON.parse(e.target.result);
                   //console.log(jsonLmao);
                   //Volani funkce na zpracovani JSON objektu z API do formatu pouzitelny pro hru
                   jsonTransformer(jsonLmao);
                   return jsonLmao;
               }catch(err){
                   console.error(err);
               }
           }
           reader.readAsText(file);
       }
   })
}
*/
//Funkce vraci objekt ktery je spravna odpoved
const answerPicker = (ans, type) => {
    switch (type) {
        case "highTemp":
            return ans.reduce((max, obj) => {
                return obj.temperature > max.temperature ? obj : max;
            }, ans[0]);
        case "lowTemp":
            return ans.reduce((min, obj) => {
                return obj.temperature < min.temperature ? obj : min;
            }, ans[0]);
        case "currTemp":
            return ans[0].temperature;
        case "highWind":
            return ans.reduce((max, obj) => {
                return obj.wind > max.wind ? obj : max;
            }, ans[0]);
        case "highHumid":
            return ans.reduce((max, obj) => {
                return obj.humidity > max.humidity ? obj : max;
            }, ans[0]);
    }
}

//Funkce vybira nahodna mesta ze seznamu
const cityPicker = (arr, size) => {
    const res = new Set();
    while (res.size < size) {
        const randomCity = arr[Math.floor(Math.random() * arr.length)];
        res.add(randomCity);
    }
    return Array.from(res);
}

const spinner = $(`
    <div class="spinner"></div>
`);

const showSpinner = () => {
    app.append(spinner);
};

const destroySpinner = () => {
    spinner.detach();
};

//Funkce pripravujici hru na dalsi tah
const nextTurn = async () => {
    $(".removable").remove();
    const mainTitle = $(`
            <h1 class="removable">Weatherguessr</h1>
        `);
    app.append(mainTitle);
    const scoreContainer = $(`
            <h3 class="removable">Score: ${score}</h3>
        `);
    app.append(scoreContainer);
    let question = questionPicker();
    const questionContainer = $(`
            <h2 id="question" class="removable">${question.text}</h2>
        `);
    app.append(questionContainer);
    const cardContainer = $(`
        <div class="cardContainer removable"></div>
        `);
    const cities = cityPicker(cityList, question.cardNum);
    let cityData = [];

    showSpinner(spinner);
    for (let i = 0; i < question.cardNum; i++) {
        cityData.push(await dataFetcher(cities[i].name, cities[i].continent))
    };
    destroySpinner();
    //console.log(cityData);
    //Funkce na vybrani spravne odpovedi
    const corrAns = answerPicker(cityData, question.id);
    console.log(corrAns);
    let cardArr = [];
    for (let i = 0; i < question.cardNum; i++) {
        const newCard = cardMaker(cityData[i], corrAns, question);
        cardArr.push(newCard);
    };
    cardContainer.append(...cardArr);

    //Funkce na precteni lokalniho JSON souboru, nebude pouzito ve finalni verzi
    //jsonData= jsonReader();
    app.append(cardContainer);
}

const gameOver = (ans, question) => {
    $(".removable").remove();
    //localStorage.clear();
    //console.log(localStorage[playerName])
    const gameOverText = $(`
        <h2 class="removable">Game Over!</h2>
        `);
    app.append(gameOverText);
    if (question.id === "currTemp") {
        const gameOverAnswer = $(`
            <h2 class="removable">The answer was ${ans}!</h2>
            `);
        app.append(gameOverAnswer);
    } else {
        const gameOverAnswer = $(`
            <h2 class="removable">The answer was ${ans.name}!</h2>
            `);
        app.append(gameOverAnswer);
    }

    if (!localStorage.getItem("scoreArr")) {
        localStorage.setItem("scoreArr", JSON.stringify([]))
    }

    const scoreObj = localStorage.getItem("scoreArr");
    console.log(scoreObj);
    let scoreArr = JSON.parse(scoreObj);
    if (score > scoreArr.find(obj => obj[name] === playerName) || !scoreArr.find(obj => obj[name] === playerName)) {
        scoreArr.push({ "name": [playerName], "score": score });
    };
    localStorage.setItem("scoreArr", JSON.stringify(scoreArr));
    //console.log(localStorage);
    console.log(localStorage.getItem("scoreArr"));

    scoreArr.sort((x, y) => y.score - x.score);
    console.log(scoreArr[0].name.toString());
    const $scoreList = $(`
        <ol id="scoreList" class="removable"></ol>
        `);
    let i = 0;
    let scoreListArr = [];
    while (i < 10 && i < scoreArr.length) {
        const scoreListElement = document.createElement("li");
        scoreListElement.textContent = `${scoreArr[i].name.toString()} : ${scoreArr[i].score}`
        scoreListArr.push(scoreListElement);
        i++;
    };
    $scoreList.append(...scoreListArr);


    /*
    while(i<10 && i < scoreArr.length){
        const scoreListElement = $(`
            <li id=listElement>${scoreArr[i][0]} : ${scoreArr[i][1]}</li>
            `)
        scoreList.append(scoreListElement);
        i++;
    };
  
*/

    app.append($scoreList);
    const replayButton = $(`
        <button class="removable" id="replayButton">Play Again!</button>
        `);
    app.append(replayButton);
    replayButton.on("click", () => {
        init();
    });

}




init();