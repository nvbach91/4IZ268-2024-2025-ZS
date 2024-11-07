const cities = ['Paris', 'Oslo', 'Brno', 'Praha', 'Rome', 'Peking', 'London', 'Barcelona', 'Tokyo', 'Bratislava',
    'Paris', 'Oslo', 'Brno', 'Praha', 'Rome', 'Peking', 'London', 'Barcelona', 'Tokyo', 'Bratislava'];
const selectedBoxesText = [];
const selectedBoxes = [];
const h3Points = document.querySelector('#points');
let points = 0;
const pointsHeader = document.querySelector("#points");
console.log(pointsHeader);


for (let i = 0; i < 20; i++) {
    const box = document.getElementById(`box-${i}`);
    const randInt = Math.floor(Math.random() * cities.length);
    box.innerHTML = cities[randInt];
    cities.splice(randInt, 1);

    box.addEventListener('click', () => {
        const clickedBox = box;
        if (!clickedBox.classList.contains('box-correct') && selectedBoxes.length < 2) {
            clickedBox.setAttribute('class', "box-selected");
            if (selectedBoxes.length == 0 || selectedBoxes[0] != clickedBox){
                selectedBoxesText.push(clickedBox.textContent);
                selectedBoxes.push(clickedBox);
            }
            if (selectedBoxesText.length == 2) {
                setTimeout(checkSelectedBoxes, 1000); // Use setTimeout instead of sleep
            }
        }
        console.log(selectedBoxes);
        
    });
}

function checkSelectedBoxes(){
    
    if (selectedBoxesText[0] == selectedBoxesText[1]){
        for (let i = 0; i <= 1; i++){
            selectedBoxes[i].setAttribute('class', 'box-correct');
        };
        selectedBoxes.length = 0
        selectedBoxesText.length = 0;
        points += 1;
        pointsHeader.innerHTML = "Your points: " + points;
    } else {
        for (let i = 0; i <= 1; i++){
            selectedBoxes[i].setAttribute('class', 'box');
        };
        selectedBoxes.length = 0
        selectedBoxesText.length = 0;
        points -= 1;
        pointsHeader.innerHTML = "Your points: " + points;
    }
};

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}



