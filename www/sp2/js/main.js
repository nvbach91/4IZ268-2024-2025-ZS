
const apiKey = "5f255568f00ee5f473cb654758cb6f31";

// DOM prvky
const locationForm = document.getElementById("locationForm");
const locationInput = document.getElementById("locationInput");


// DOM prvky pro aktuální počasí
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const precipitationElement = document.getElementById("precipitation");
const pressureElement = document.getElementById("pressure");
const windElement = document.getElementById("wind");

// Kontejner pro pětidenku
const weatherIconsContainer = document.getElementById("weatherIconsContainer");


// 1) Po načtení stránky okamžitě zkusíme získat polohu
document.addEventListener("DOMContentLoaded", () => {
  fetchWeatherByBrowserLocation();
});


// 2) Funkce pro získání počasí podle geolokace
function fetchWeatherByBrowserLocation() {
  if (!navigator.geolocation) {
    console.warn("Geolocation is not supported by this browser.");
    return; // Nepodporuje geolokaci
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetchCurrentWeatherByLatLon(lat, lon);
      fetchFiveDayForecastByLatLon(lat, lon);
    },
    (error) => {
      console.warn("User denied geolocation. Switching to manual input.");
    }
  );
}

// 4) Event listener pro odeslání formuláře
locationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const enteredLocation = locationInput.value.trim();
  if (!enteredLocation) {
    showError("Please enter a city name.");
    return;
  }
  fetchCurrentWeather(enteredLocation);
  fetchFiveDayForecast(enteredLocation);
});


// 5) FETCH aktuálního počasí podle města
function fetchCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  fetchWeatherData(url);
}

function fetchCurrentWeatherByLatLon(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  fetchWeatherData(url);
}


// 6) Získání dat o počasí a jejich zobrazení
function fetchWeatherData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayCurrentWeather(data))
    .catch(() => showError("Error fetching weather data."));
}

function displayCurrentWeather(data) {
  locationElement.textContent = `Location: ${data.name}, ${data.sys.country}`;
  temperatureElement.textContent = `Temperature: ${Math.round(data.main.temp)} °C`;
  descriptionElement.textContent = `Description: ${data.weather[0].description}`;
  humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
  pressureElement.textContent = `Pressure: ${data.main.pressure} hPa`;
  windElement.textContent = `Wind: ${data.wind.speed} m/s`;

  let precipitation = 0;
  if (data.rain && data.rain["1h"]) precipitation = data.rain["1h"];
  else if (data.snow && data.snow["1h"]) precipitation = data.snow["1h"];
  precipitationElement.textContent = `Precipitation: ${precipitation} mm`;

  const weatherId = data.weather[0].id;

}


// 7) FETCH pětidenky podle města
function fetchFiveDayForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  fetchForecastData(url);
}

function fetchFiveDayForecastByLatLon(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  fetchForecastData(url);
}

function fetchForecastData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayFiveDayForecast(data))
    .catch(() => showError("Error fetching 5-day forecast."));
}

// 8) Zobrazení pětiden
function displayFiveDayForecast(data) {
    console.log(data);
  weatherIconsContainer.innerHTML = "";
  const dailyData = groupByDay(data.list);
  const days = Object.keys(dailyData).slice(0, 5);

  days.forEach((dayKey) => {
    const items = dailyData[dayKey];
    const maxTemp = Math.max(...items.map((i) => i.main.temp_max));
    const minTemp = Math.min(...items.map((i) => i.main.temp_min));
    const avgTemp = Math.round(items.reduce((acc, i) => acc + i.main.temp, 0) / items.length);
    
    const date = new Date(items[0].dt * 1000);
    const dayOfWeek = getDayOfWeek(date.getDay());
    const dateStr = date.toLocaleDateString();

    const firstWeatherId = items[0].weather[0].id;
    const iconClass = getWeatherIconClassFromId(firstWeatherId);

    const boxHTML = `
      <div class="forecast-box">
        <i class="weather-icon wi ${iconClass}"></i>
        <div>${dateStr}</div>
        <div>${dayOfWeek}</div>
        <div>${maxTemp}°C / ${minTemp}°C</div>
        <div>Avg: ${avgTemp}°C</div>
      </div>
    `;
    weatherIconsContainer.innerHTML += boxHTML;
  });
}


// 9) Pomocné funkce
function groupByDay(list) {
  return list.reduce((acc, item) => {
    const d = new Date(item.dt * 1000).toISOString().split("T")[0];
    if (!acc[d]) acc[d] = [];
    acc[d].push(item);
    return acc;
  }, {});
}

function getDayOfWeek(dayIndex) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
}

function showError(msg) {
  if (typeof Swal !== "undefined") Swal.fire({ icon: "error", title: msg });
  else alert(msg);
}

function getWeatherIconClassFromId(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "wi-thunderstorm";
  if (weatherId >= 300 && weatherId < 500) return "wi-showers";
  if (weatherId >= 500 && weatherId < 600) return "wi-rain";
  if (weatherId >= 600 && weatherId < 700) return "wi-snow";
  if (weatherId >= 700 && weatherId < 800) return "wi-fog";
  if (weatherId === 800) return "wi-day-sunny";
  if (weatherId > 800 && weatherId < 900) return "wi-cloudy";
  return "wi-na";
}
