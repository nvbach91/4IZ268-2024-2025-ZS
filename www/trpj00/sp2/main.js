//API TEST

const lat = "37.7749";
const lon = "-122.4194";
const API_KEY = "81f2f5ffb46f14cb7d0f11cfe0bdb669";

const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

const getCurrentWeatherData = async () => {
  const response = await fetch(url);
  const data = await response.json();

  console.log(data);
};

getCurrentWeatherData();
