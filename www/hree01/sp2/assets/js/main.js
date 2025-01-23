const API_KEY = '74754122ffc5f46b002b77b51946771a';
const BASE_API_URL = 'https://pro.openweathermap.org';


const DEFAULT_CITY = "Prague";
let favoriteCities = new Set();
let isHourlyForecast = true;

function showSpinner() {
  document.getElementById("spinner-container").style.display = "block";
}
function hideSpinner() {
  document.getElementById("spinner-container").style.display = "none";
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
  const favoritesContainer = document.getElementById("favorites-container");
  favoritesContainer.innerHTML = ''; // Celar previous list

  for (const city of favoriteCities) {
    showSpinner();
    const weatherData = await getWeatherData(city);
    hideSpinner();
    const cityElement = document.createElement("div");  
    cityElement.classList.add("favorite-city");

    // Favorite city name
    const cityName = document.createElement("h3");
    cityName.textContent = city;
    cityElement.appendChild(cityName);

    // Weather Icon
    if (weatherData) {
      const iconCode = weatherData.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
      const weatherIcon = document.createElement("img");
      weatherIcon.src = iconUrl;
      weatherIcon.alt = weatherData.weather[0].description;
      cityElement.appendChild(weatherIcon);

      // Weather description
      const weatherDescription = document.createElement("p");
      weatherDescription.textContent = weatherData.weather[0].description;
      cityElement.appendChild(weatherDescription);

      // Temperature
      const temp = document.createElement("p");
      temp.textContent = `🌡️ ${weatherData.main.temp} °C`;
      cityElement.appendChild(temp);
    }

    // Heart icon to remove city from favorites
    const heartIcon = document.createElement("i");
    heartIcon.classList.add("fa-solid", "fa-heart");
    
    heartIcon.addEventListener("click", () => {
      // Change to an empty heart icon
      heartIcon.classList.remove("fa-solid");
      heartIcon.classList.add("fa-regular");

      setTimeout(() => {
        removeCityFromFavorites(city);
      }, 500); //(500 ms)
    });
    cityElement.appendChild(heartIcon);

    favoritesContainer.appendChild(cityElement);  
  }
}


function addCityToFavorites(city) {
  if (!favoriteCities.has(city)) {
    favoriteCities.add(city);
    saveFavoritesToStorage();
    displayFavorites();
  }
}

function removeCityFromFavorites(city) {
  favoriteCities.delete(city);
  saveFavoritesToStorage();
  displayFavorites();
}

function toggleFavorite(cityName, heartIcon) {
  if (favoriteCities.has(cityName)) {
    // Already in favorites -> remove it
    removeCityFromFavorites(cityName);
    heartIcon.classList.remove("fa-solid");
    heartIcon.classList.add("fa-regular");
  } else {
    // Not in favorites -> add
    addCityToFavorites(cityName);
    heartIcon.classList.remove("fa-regular");
    heartIcon.classList.add("fa-solid");
  }
}

// Initializing the heart icon

function setupFavoriteIcon(cityName) {
  const favoriteIconContainer = document.querySelector(".favorite-icon");
  favoriteIconContainer.innerHTML = ''; // Remove an existing icon

  const heartIcon = document.createElement("i");
  heartIcon.classList.add(
    favoriteCities.has(cityName) ? "fa-solid" : "fa-regular",
    "fa-heart"
  );
  heartIcon.style.cursor = "pointer";


  heartIcon.addEventListener("click", () => {
    toggleFavorite(cityName, heartIcon);
  });

  favoriteIconContainer.appendChild(heartIcon);
}


// Load the application
document.addEventListener("DOMContentLoaded", async () => {
  // Default for location
  const locationInfo = document.getElementById("location-info");
  locationInfo.textContent = "Your location: Not available";

  // Default for toggle-forecast-btn
  const toggleBtn = document.getElementById("toggle-forecast-btn");
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


document.getElementById("toggle-forecast-btn").addEventListener("click", async () => {
  isHourlyForecast = !isHourlyForecast; // Toggle forecast mode

  // Change the text on the button according to the current mode
  const toggleBtn = document.getElementById("toggle-forecast-btn");
  toggleBtn.textContent = isHourlyForecast
    ? "Daily Forecast"
    : "Hourly Forecast";

  // Reload forecast data in current mode
  const city = document.getElementById("city-name").textContent.split(' ')[0];
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
    console.log('Loaded forecast:', data);
    return data;
  } catch (error) {
    console.error('Error in API call for forecast:', error);
    return null;
  }
};

// Update detailed forecast
function updateForecastUI(forecastData) {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = ""; // Clear previous answer

  if (isHourlyForecast) {
    // Hourly forecast settings
    forecastData.list.slice(0, 12).forEach((item) => {
      const timestamp = item.dt * 1000;
      const time = new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const temp = item.main.temp;
      const description = item.weather[0].description;
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-item");
      forecastItem.innerHTML = `
        <p>${time}</p>
        <img src="${iconUrl}" alt="${description}">
        <p>${description}</p>
        <p>🌡️ ${temp} °C</p>
      `;

      forecastContainer.appendChild(forecastItem);
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

      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-item");
      forecastItem.innerHTML = `
        <p>${dayName}</p>
        <img src="${iconUrl}" alt="${description}">
        <p>${description}</p>
        <p>🌡️ ${tempMin} °C / ${tempMax} °C</p>
      `;

      forecastContainer.appendChild(forecastItem);
    });
  }
}



// Update the user interface
async function updateWeatherUI(data, isCurrentLocation = false) {
  if (!data) {
      console.error('No data passed to updateWeatherUI.');
      return;
  }

  // Update location info
  const locationInfo = document.getElementById("location-info");
  if (isCurrentLocation) {
    locationInfo.textContent = `Your location: ${data.name} (${data.sys.country})`;
  }

  // City name + country
  const cityName = data.name; 
  document.getElementById("city-name").textContent = `${cityName} (${data.sys.country})`;

  // Create the heart icon for favorites
  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa", "fa-heart", "heart-icon");
  

  // Inicializace srdíčka pomocí setupFavoriteIcon
  setupFavoriteIcon(cityName);


  // Current weather icon
  const iconCode = data.weather[0].icon; // f.e. "50n"
  const iconUrl = `https://www.openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById("weather-icon").src = iconUrl;

  // Weather description (mist, cloudy)
  document.getElementById("weather-description").textContent =
      data.weather[0].description;

  // Additional weather information
  document.getElementById("temp").textContent = `🌡️ Temperature: ${data.main.temp} °C`;
  document.getElementById("precipitation").textContent = `🌧️ Precipitation: ${
      data.rain ? data.rain["1h"] || 0 : 0 // Precipitation is only available when it rains
  } mm`;
  document.getElementById("humidity").textContent = `💧 Humidity: ${data.main.humidity} %`;
  document.getElementById("wind-speed").textContent = `🌀 Wind speed: ${data.wind.speed} m/s`;


  // Load forecast
  const forecastData = await getForecastData(data.name, isHourlyForecast);
  if (forecastData) {
    updateForecastUI(forecastData);
  }

  // Load favorites
  displayFavorites(); // Zobrazí seznam oblíbených měst
  
};

  // Search settings
  document.getElementById("search-btn").addEventListener("click", async () => {
    const city = document.getElementById("search-city").value.trim(); // Trim removes gaps
    const errorMessage = document.getElementById("error-message");

    // Hide the previous error message
    errorMessage.classList.add("hidden");

    if (!city) {
        errorMessage.textContent = "Enter the name of the city!";
        errorMessage.classList.remove("hidden");
        return;
    }

    try {
        const weatherData = await getWeatherData(city); // API call, get data
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
      const weatherData = await getWeatherData(city);
      if (weatherData) {
          updateWeatherUI(weatherData);
      } else {
          document.getElementById("error-message").classList.remove("hidden");
      }
  });
});

