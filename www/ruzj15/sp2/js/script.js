console.log("cus");

const apiKey = "67a94006026279465e11c65e95d8446f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=praha";

async function checkWeather(){
    const response = await fetch(apiUrl + `&appid=${apiKey}`);
    var data = await response.json();

    console.log(data);
}

checkWeather();