const API_KEY = '74754122ffc5f46b002b77b51946771a';
const BASE_API_URL = 'https://pro.openweathermap.org';


const DEFAULT_CITY = "Prague";
let favoriteCities = new Set();
let isHourlyForecast = true;

const searchForm = document.getElementById("search-form");
const searchCityInput = document.getElementById("search-city");
const errorMessage = document.getElementById("error-message");
const spinnerContainer = document.getElementById("spinner-container");
const favoritesContainer = document.getElementById("favorites-container");
const forecastContainer = document.getElementById("forecast-container");
const locationInfo = document.getElementById("location-info");
const cityNameContainer = document.getElementById("city-name");
const toggleBtn = document.getElementById("toggle-forecast-btn");
const currentWeatherIcon = document.getElementById("weather-icon");
const currentWeatherDescription = document.getElementById("weather-description")
const currentTempInfo = document.getElementById("temp");
const currentPrecipitation = document.getElementById("precipitation");
const currentHumidity = document.getElementById("humidity");
const currentWindSpeed = document.getElementById("wind-speed");

function showSpinner() {
  spinnerContainer.style.display = "block";
}
function hideSpinner() {
  spinnerContainer.style.display = "none";
}

// Loading favorite cities from localStorage
function loadFavoritesFromStorage() {
  const storedFavorites = localStorage.getItem("favorites");
  if (storedFavorites) {
    favoriteCities = new Set(JSON.parse(storedFavorites));
  }
}

function saveFavoritesToStorage() {
  localStorage.setItem("favorites", JSON.stringify(Array.from(favoriteCities)));
}

// Display favorite cities
async function displayFavorites() {
  favoritesContainer.innerHTML = ''; // Celar previous list

  //const fragment = document.createDocumentFragment();
  let favoritesHTML = '';

  for (const cityKey of favoriteCities) {
    const [city, countryCode] = cityKey.split(',');
    //showSpinner();
    const weatherData = await getWeatherData(city);
    //hideSpinner();
    // Favorite city name
    //cityName.textContent = `${city}, ${countryCode}`;
    // Weather Icon
    if (weatherData) {
      const iconCode = weatherData.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
      const weatherIcon = document.createElement("img");
      weatherIcon.src = iconUrl;
      const description = weatherData.weather[0].description;
      const temp = weatherData.main.temp;

      favoritesHTML += `
        <div class="favorite-city">
          <h3>${city}, ${countryCode}</h3>
          <img src="${iconUrl}" alt="${description}">
          <p>${description}</p>
          <p>🌡️ ${temp} °C</p>
          <i class="fa-solid fa-heart" style="cursor: pointer;"></i>
        </div>
      `;
    }
  }
  favoritesContainer.innerHTML = favoritesHTML;

  favoritesContainer.querySelectorAll('.favorite-city .fa-heart').forEach((heartIcon, index) => {
    heartIcon.addEventListener('click', () => {
      const cityKey = Array.from(favoriteCities)[index];
      const [city, countryCode] = cityKey.split(',');
      heartIcon.classList.remove("fa-solid");
      heartIcon.classList.add("fa-regular");
      setTimeout(() => {
        removeCityFromFavorites(city, countryCode);
      }, 500); //(500 ms)
      ;
    });
  });
}


function addCityToFavorites(city, countryCode) {
  const cityKey = `${city},${countryCode}`;
  if (!favoriteCities.has(cityKey)) {
    favoriteCities.add(cityKey);
    saveFavoritesToStorage();
    displayFavorites();
  }
}

function removeCityFromFavorites(city, countryCode) {
  const cityKey = `${city},${countryCode}`;
  favoriteCities.delete(cityKey);
  saveFavoritesToStorage();
  displayFavorites();
}

function toggleFavorite(cityName, countryCode, heartIcon) {
  const cityKey = `${cityName},${countryCode}`;
  if (favoriteCities.has(cityKey)) {
    // Already in favorites -> remove it
    removeCityFromFavorites(cityName, countryCode);
    heartIcon.classList.remove("fa-solid");
    heartIcon.classList.add("fa-regular");
  } else {
    // Not in favorites -> add
    addCityToFavorites(cityName, countryCode);
    heartIcon.classList.remove("fa-regular");
    heartIcon.classList.add("fa-solid");
  }
}

// Initializing the heart icon

function setupFavoriteIcon(cityName, countryCode) {
  const favoriteIconContainer = document.querySelector(".favorite-icon");
  favoriteIconContainer.innerHTML = ''; // Remove an existing icon
  const cityKey = `${cityName},${countryCode}`;

  const heartIcon = document.createElement("i");
  heartIcon.classList.add(
    favoriteCities.has(cityKey) ? "fa-solid" : "fa-regular",
    "fa-heart"
  );
  heartIcon.style.cursor = "pointer";


  heartIcon.addEventListener("click", () => {
    toggleFavorite(cityName, countryCode, heartIcon);
  });

  favoriteIconContainer.appendChild(heartIcon);
}


// Load the application
document.addEventListener("DOMContentLoaded", async () => {
  // Default for location
  locationInfo.textContent = "Your location: Not available";

  // Default for toggle-forecast-btn
  toggleBtn.textContent = isHourlyForecast ? "Daily Forecast" : "Hourly Forecast";

  // Display the weather for the default city (Prague)
  showSpinner();
  const defaultWeatherData = await getWeatherData(DEFAULT_CITY);
  if (defaultWeatherData) {
    updateWeatherUI(defaultWeatherData);
  } else {
    console.error("Failed to load data for default city.");
  }
  hideSpinner();

  // Attemp to find current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        showSpinner();
        const locationWeatherData = await getWeatherByCoordinates(latitude, longitude);
        hideSpinner();
        if (locationWeatherData) {
          updateWeatherUI(locationWeatherData, true);
        }
      },
      (error) => {
        console.warn("Geolocation was not enabled or an error occurred:", error.message);
        locationInfo.textContent = "Your location: Not available";
      }
    );
  } else {
    console.error("Geolocation API is not supported.");
    locationInfo.textContent = "Your location: Not available";
  }

  loadFavoritesFromStorage();
  displayFavorites();
});

// Get weather data by city name
async function getWeatherData(city) {
  try {
    const response = await fetch(
      `${BASE_API_URL}/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Error loading data for city ${city}: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("API call error:", error);
    return null;
  }
}

// Get weather data by coordinates
async function getWeatherByCoordinates(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Error loading data by coordinates: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("API call error:", error);
    return null;
  }
}


toggleBtn.addEventListener("click", async () => {
  isHourlyForecast = !isHourlyForecast; // Toggle forecast mode

  // Change the text on the button according to the current mode
  toggleBtn.textContent = isHourlyForecast
    ? "Daily Forecast"
    : "Hourly Forecast";

  // Reload forecast data in current mode
  const city = cityNameContainer.textContent.split(' ')[0];
  const forecastData = await getForecastData(city, isHourlyForecast);
  if (forecastData) {
    updateForecastUI(forecastData);
  }
});

// Load forecast data
async function getForecastData(city, isHourly = true) {
  const endpoint = isHourly ? '/data/2.5/forecast' : '/data/2.5/forecast/daily';
  const url = `${BASE_API_URL}${endpoint}?q=${city}&units=metric&cnt=16&
appid=${API_KEY}`; // 16 for daily forecast

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error loading forecast: ${response.status}`);
      return null;
    }
    const data = await response.json();
    //console.log('Loaded forecast:', data);
    return data;
  } catch (error) {
    console.error('Error in API call for forecast:', error);
    return null;
  }
};

// Update detailed forecast
function updateForecastUI(forecastData) {
  forecastContainer.innerHTML = ""; // Clear previous answer
  let forecastHTML = '';

  if (isHourlyForecast) {
    // Hourly forecast settings
    forecastData.list.slice(0, 12).forEach((item) => {
      const timestamp = item.dt * 1000;
      const time = new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const temp = item.main.temp;
      const description = item.weather[0].description;
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
      forecastHTML += `
        <div class="forecast-item">
          <p>${time}</p>
          <img src="${iconUrl}" alt="${description}">
          <p>${description}</p>
          <p>🌡️ ${temp} °C</p>
        </div>
      `;
    });
  } else {
    // Daily forecast settings
    forecastData.list.forEach((item) => {
      const timestamp = item.dt * 1000;
      const dayName = new Date(timestamp).toLocaleDateString('en-US', { weekday: 'long' });
      const tempMin = item.temp.min;
      const tempMax = item.temp.max;
      const description = item.weather[0].description;
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      forecastHTML += `
        <div class="forecast-item">
          <p>${dayName}</p>
          <img src="${iconUrl}" alt="${description}">
          <p>${description}</p>
          <p>🌡️ ${tempMin} °C / ${tempMax} °C</p>
        </div>
      `;
    });
  }
  forecastContainer.innerHTML = forecastHTML;
}



// Update the user interface
async function updateWeatherUI(data, isCurrentLocation = false) {
  if (!data) {
    console.error('No data passed to updateWeatherUI.');
    return;
  }

  // Update location info
  if (isCurrentLocation) {
    locationInfo.textContent = `Your location: ${data.name} (${data.sys.country})`;
  }

  // City name + country
  const cityName = data.name;
  const countryCode = data.sys.country;
  cityNameContainer.textContent = `${cityName} (${countryCode})`;

  // Create the heart icon for favorites
  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa", "fa-heart", "heart-icon");


  // Inicializace srdíčka pomocí setupFavoriteIcon
  setupFavoriteIcon(cityName, countryCode);


  // Current weather icon
  const iconCode = data.weather[0].icon; // f.e. "50n"
  const iconUrl = `https://www.openweathermap.org/img/wn/${iconCode}@2x.png`;
  currentWeatherIcon.src = iconUrl;

  // Weather description (mist, cloudy)
  currentWeatherDescription.textContent =
    data.weather[0].description;

  // Additional weather information
  currentTempInfo.textContent = `🌡️ Temperature: ${data.main.temp} °C`;
  currentPrecipitation.textContent = `🌧️ Precipitation: ${data.rain ? data.rain["1h"] || 0 : 0 // Precipitation is only available when it rains
    } mm`;
  currentHumidity.textContent = `💧 Humidity: ${data.main.humidity} %`;
  currentWindSpeed.textContent = `🌀 Wind speed: ${data.wind.speed} m/s`;


  // Load forecast
  const forecastData = await getForecastData(data.name, isHourlyForecast);
  if (forecastData) {
    updateForecastUI(forecastData);
  }

  // Load favorites
  //displayFavorites(); // Způsobovalo duplikace na seznamu oblíbených měst

};

// Search settings
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = searchCityInput.value.trim(); // Trim removes gaps

  // Hide the previous error message
  errorMessage.classList.add("hidden");

  if (!city) {
    errorMessage.textContent = "Enter the name of the city!";
    errorMessage.classList.remove("hidden");
    return;
  }

  try {
    showSpinner();
    const weatherData = await getWeatherData(city); // API call, get data
    console.log(weatherData);
    hideSpinner();
    if (weatherData) {
      updateWeatherUI(weatherData); // Design update
    } else {
      errorMessage.textContent = "Failed to load weather data. Please try again.";
      errorMessage.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error getting weather:", error);
    errorMessage.textContent = "An unexpected error occurred. Please try again later.";
    errorMessage.classList.remove("hidden");
  }
});

// Sidebar settings
document.querySelectorAll('.capital-cities li').forEach(item => {
  item.addEventListener('click', async () => {
    const city = item.getAttribute('data-city');
    showSpinner(); //  indikace nacitani dat pri vyberu hlavnich mest v levem panelu
    const weatherData = await getWeatherData(city);
    hideSpinner();
    if (weatherData) {
      updateWeatherUI(weatherData);
    } else {
      errorMessage.classList.remove("hidden");
    }
  });
});

