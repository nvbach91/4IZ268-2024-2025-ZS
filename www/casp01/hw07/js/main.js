
//preparing values
let values = ["Saddam Hussein","Pol Pot","Mao Zedong","Kim Il-Sung","Klement Gottwald","Benito Mussolini","Bashar al-Assad","Robert Fico","Viktor Orban","Vladimir Putin"];
console.log(values);
values = values.concat(values);
values.sort(() => {
  return 0.5 - Math.random();
});
console.log(values);
const gameField=document.querySelector("#game-field");
const pointElement=document.querySelector("#points");
let cards=document.createDocumentFragment();
let points=0;
cardOne=null;
cardTwo=null;
revCards=0;
//setting up logic
const gameLogic = (card) =>{
  card.addEventListener("click",()=>{
    if(card.classList.contains("revealed")){
      return false;
    }
    if(cardOne&&cardTwo){
      return false;
    }
    card.classList.add("revealed");
    if (!cardOne){
      cardOne=card;
      //console.log(cardOne);
      return true;
    }
    cardTwo=card
    if(cardOne.textContent===cardTwo.textContent){
      points++;
      cardOne=null;
      cardTwo=null;
      revCards+=2;
      setTimeout(()=>{      
        if(revCards===values.length){
        alert(`Congratulations! You won with ${points} points!`)
      }},500);

    }
    else{
      points--;
      if(points<0){
        points=0;
      }
      setTimeout(()=>{      
        cardOne.classList.remove("revealed");
        //console.log(cardOne);
        cardOne=null;
        cardTwo.classList.remove("revealed");
        cardTwo=null;},500);

    }
    pointElement.textContent=points;
  });
}; 


for(let i=0;i<values.length;i++){
  //console.log(values[i]);
  const newCard = document.createElement("div");
  newCard.className="card"
  newCard.textContent=values[i];
  //console.log(newCard);
  gameLogic(newCard);
  cards.appendChild(newCard);  
};
gameField.append(cards);

