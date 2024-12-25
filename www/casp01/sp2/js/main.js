const app = $('#app');
const questions = {
    "1":"Prvni otazka",
    "2":"Druha otazka",
    "3":"Treti otazka",
    "4":"Ctvrta otazka",
    "5":"Pata otazka",
}

const answers = [
    {id:1, name:"Prague", value:10},
    {id:2, name:"Budapest", value:12},
    {id:3, name:"London", value:5},
    {id:4, name:"Yakutsk", value:-20},
    {id:5, name:"Mecca", value:20},
]




//Zadani jmena a nasledna inicializace herni plochy
const nameForm = $(`
    <form id="nameForm">
        <input id="playerName" name="name">
    </form>
`);
app.append(nameForm);
const nameButton = $(`
    <button id="nameButton">Enter</button>
    `);
app.append(nameButton)
nameButton.click(()=>{
    const playerName=$("#playerName").val();
    //console.log($("#playerName").val());
    $("#nameForm").remove();
    $("#nameButton").remove();
    app.addClass("game-start");
    nextTurn();
});


const questionPicker = () =>{
    return 1 + Math.floor(Math.random() * 5);
}

//Funkce vytvarejici karty
const cardMaker = (input) =>{
    const card = $(`
        <div class="card" id="card${input.id}">${input.name}</div>
        `);
    card.on("click",()=>{
        console.log(input.value);
    })
    return card;
}

//Funkce pripravujici hru na dalsi tah
const nextTurn = () =>{
    $(".card").remove();
    const questionContainer= $(`
        <h1 id="question"></h1>
        `)
    app.append(questionContainer);
    let questionNum = questionPicker();
    $("#question").text(questions[questionNum]); 
    let $cards = [];
    for (let i =0;i<=4;i++){
            $cards.push(cardMaker(answers[i]));
    }
    app.append($cards);
    //$("#card4").remove();
}





