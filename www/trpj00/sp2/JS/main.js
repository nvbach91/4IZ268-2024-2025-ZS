/***********************************
 * Konstanty a DOM elementy
 ***********************************/
const API_KEY = "81f2f5ffb46f14cb7d0f11cfe0bdb669";

const WEATHER_API_URL = "https://api.openweathermap.org/data/3.0/onecall";
const GEOCODE_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
const REVERSE_GEOCODE_API_URL =
  "https://api.openweathermap.org/geo/1.0/reverse";

// DOM Elements
const searchButtonEl = $("#search-button");
const saveButtonEl = $("#save-location");
const removeButtonEl = $("#remove-location");
const locationsSelectEl = $("#inputGroupSelect");

const $overlay = $("#spinner-overlay");
const $alertContainer = $("#alert-container");

const selectedLocation = $("#selected-location");
const weekForecast = $("#week-forecast");
const todayCard = $("#today-card");
const unitsSelectEl = $("#unitsSelect");

// Proměnná pro počet paralelních requestů
let activeRequests = 0;

const showLoader = () => {
  if (!$overlay.length) {
    console.warn("#spinner-overlay not found!");
    return;
  }

  activeRequests++;
  if (activeRequests === 1) {
    $overlay.css("display", "flex");
  }
};

const hideLoader = () => {
  if (!$overlay.length) {
    console.warn("#spinner-overlay not found!");
    return;
  }

  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    $overlay.css("display", "none");
  }
};

const showMessage = (message, type = "info") => {
  if (!$alertContainer.length) {
    console.warn("alert-container not found!");
    return;
  }

  const $alertEl = $(`
    <div class="alert alert-${type} alert-dismissible fade show my-2 text-left" role="alert">
      ${message}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `);

  // Přidání do DOM
  $alertContainer.append($alertEl);

  // Po 5 sekundách zmizí
  setTimeout(() => {
    $alertEl.alert("close");
  }, 5000);
};

/***********************************
 * Stav aplikace
 ***********************************/
let appState = {
  latitude: undefined,
  longitude: undefined,
  cityName: undefined,

  units: undefined,
};

/***********************************
 * API služby
 ***********************************/
const fetchCityNameFromCoords = async (lat, lon) => {
  showLoader();
  try {
    const response = await axios.get(REVERSE_GEOCODE_API_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        limit: 1,
      },
    });
    console.log("City Name:", response.data[0].name);
    return response.data[0].name;
  } catch (err) {
    throw new Error("City name not found!", err);
  } finally {
    hideLoader();
  }
};

const fetchPositionFromCityName = async (cityName) => {
  showLoader();
  try {
    const response = await axios.get(GEOCODE_API_URL, {
      params: {
        q: cityName,
        appid: API_KEY,
        limit: 1,
      },
    });
    if (response.data.length > 0) {
      console.log("Coordinates found:", response.data[0]);
      return response.data[0];
    } else {
      showMessage("We could not find the position.", "danger");
    }
  } catch (err) {
    throw new Error("Error fetching coordinates", err);
  } finally {
    hideLoader();
  }
};

const fetchBrowserPosition = async () => {
  // Geolocation API zavoláme bez loaderu,
  // ale cityNameFromCoords už loader obsahuje
  try {
    const { coords } = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    console.log("Browser position:", coords);

    const cityName = await fetchCityNameFromCoords(
      coords.latitude,
      coords.longitude
    );

    return {
      lat: coords.latitude,
      lon: coords.longitude,
      cityName,
    };
  } catch (err) {
    const permissionStatus = await navigator?.permissions?.query({
      name: "geolocation",
    });

    if (permissionStatus.state === "denied") {
      showMessage(
        "Without giving access to location appliction cannot function correctly ",
        "danger"
      );
    }
  }
};

const fetchWeatherData = async (lat, lon, units) => {
  showLoader();
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: units ? units : "metric",
      },
    });
    console.log("Weather Data:", response.data);
    return response.data;
  } catch (err) {
    throw new Error("Error fetching weather data", err);
  } finally {
    hideLoader();
  }
};

/***********************************
 * Display funkce
 ***********************************/
let weeklyChartInstance = null;

const renderWeeklyTemperatureChart = (weatherData) => {
  const daily = weatherData.daily.slice(0, 7);
  const labels = daily.map((day) => {
    const dayDate = new Date(day.dt * 1000);
    return dayDate.toLocaleString("en-US", { weekday: "short" });
  });
  const maxTemps = daily.map((day) => day.temp.max.toFixed(1));
  const minTemps = daily.map((day) => day.temp.min.toFixed(1));

  if (weeklyChartInstance) {
    weeklyChartInstance.data.labels = labels;
    weeklyChartInstance.data.datasets[0].data = maxTemps;
    weeklyChartInstance.data.datasets[1].data = minTemps;
    weeklyChartInstance.update();
  } else {
    const ctx = document
      .getElementById("weeklyTemperatureChart")
      .getContext("2d");

    weeklyChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Max Temperature (°C)",
            data: maxTemps,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: false,
            tension: 0.2,
          },
          {
            label: "Min Temperature (°C)",
            data: minTemps,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true,
            tension: 0.2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  }
};

const generateWeekCards = (weatherData) => {
  const $row = $(
    `<div class="row row-cols-4 row-cols-sm-2 row-cols-lg-4 row-cols-xl-7"></div>`
  );

  for (let i = 0; i < 7; i++) {
    const dayData = weatherData.daily[i];
    const dayDate = new Date(dayData.dt * 1000);
    const dayName = dayDate.toLocaleString("en-US", { weekday: "short" });
    const dateString = dayDate.toLocaleDateString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
    });
    const avgTemp = ((dayData.temp.min + dayData.temp.max) / 2).toFixed(1);

    const $col = $(`
      <div class="col">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">${dayName}</h5>
            <p class="card-text">${dateString}</p>
            <p class="card-text">Průměr: ${avgTemp} °C</p>
          </div>
        </div>
      </div>
    `);

    $row.append($col);
  }

  return $row;
};

const generateTodayDetailedCard = (weatherData) => {
  const current = weatherData.current;
  const temp = current.temp;
  const humidity = current.humidity;
  const pressure = current.pressure;
  const windSpeed = current.wind_speed;
  const description = current.weather?.[0]?.description || "Neuvedeno";

  const $card = $(`
    <div class="card text-center">
      <div class="card-body">
        <h5 class="card-title">Today's Weather</h5>
        <p class="card-text">Temperature: ${temp} °C</p>
        <p class="card-text">Humidity: ${humidity}%</p>
        <p class="card-text">Pressure: ${pressure} hPa</p>
        <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
        <p class="card-text">Description: ${description}</p>
      </div>
    </div>
  `);

  return $card;
};

const displayWeatherData = (weatherData, cityName) => {
  const weekCards = generateWeekCards(weatherData);
  const todayStatisticsCard = generateTodayDetailedCard(weatherData);

  selectedLocation.text(cityName);
  weekForecast.empty().append(weekCards);
  todayCard.empty().append(todayStatisticsCard);
  renderWeeklyTemperatureChart(weatherData);
};

/***********************************
 * Práce s localStorage
 ***********************************/
const getSavedLocations = () => {
  const saved = localStorage.getItem("savedLocations");
  return saved ? JSON.parse(saved) : [];
};

const saveLocation = (location) => {
  const savedLocations = getSavedLocations();

  // Check for duplicates
  const isDuplicate = savedLocations.some(
    (saved) =>
      saved.cityName === location.cityName &&
      saved.latitude === location.latitude &&
      saved.longitude === location.longitude
  );

  if (!isDuplicate) {
    savedLocations.push(location);
    localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
    addLocationToSelect(location);
    showMessage(`${location.cityName} has been saved.`, "success");
  } else {
    showMessage(`${location.cityName} is already saved.`, "warning");
  }
};

const removeLocation = (cityName) => {
  let savedLocations = getSavedLocations();
  const initialLength = savedLocations.length;

  // Filtrovat ven
  savedLocations = savedLocations.filter(
    (location) => location.cityName !== cityName
  );

  if (savedLocations.length < initialLength) {
    localStorage.setItem("savedLocations", JSON.stringify(savedLocations));

    // Odstranění z <select>
    locationsSelectEl.find(`option[value="${cityName}"]`).remove();
    locationsSelectEl.val("");

    showMessage(`${cityName} has been removed.`, "success");
  } else {
    showMessage(`${cityName} was not found.`, "danger");
  }
};

/***********************************
 * Select
 ***********************************/

const addLocationToSelect = (location) => {
  const option = new Option(location.cityName, location.cityName);
  locationsSelectEl.append(option);
};

const initLocationsToSelect = (locations) => {
  const fragment = document.createDocumentFragment();

  locations.forEach((location) => {
    const option = new Option(location.cityName, location.cityName);
    fragment.appendChild(option);
  });

  locationsSelectEl.append(fragment);
};

/***********************************
 * Inicializace aplikace
 ***********************************/
const initApp = async () => {
  try {
    // Při inicializaci se volá fetchBrowserPosition() a fetchWeatherData()
    // Loader se ukáže uvnitř těchto funkcí.
    const position = await fetchBrowserPosition();
    const locations = getSavedLocations();
    initLocationsToSelect(locations);

    const { lat, lon, cityName } = position;

    appState.cityName = cityName;
    appState.latitude = lat;
    appState.longitude = lon;

    const weatherData = await fetchWeatherData(lat, lon, appState.units);
    await displayWeatherData(weatherData, cityName);
  } catch (err) {
    console.error("Error during initApp:", err);
    showMessage("Unable to initialize application.", "danger");
  }
};

/***********************************
 * Event Listeners
 ***********************************/
searchButtonEl.click(async (event) => {
  event.preventDefault();
  const searchForm = document.querySelector("#search-form");

  const formData = new FormData(searchForm);
  const data = Object.fromEntries(formData);
  console.log("Search Input:", data.searchInput);

  if (data.searchInput) {
    try {
      // fetchPositionFromCityName a fetchWeatherData volají showLoader/hideLoader
      const position = await fetchPositionFromCityName(data.searchInput);
      if (!position) return; // Pokud se nenašlo, nebudeme pokračovat

      const weatherData = await fetchWeatherData(
        position.lat,
        position.lon,
        appState.units
      );

      appState.cityName = position.name;
      appState.latitude = position.lat;
      appState.longitude = position.lon;

      console.log(appState);
      displayWeatherData(weatherData, position.name);
    } catch (err) {
      console.error("Error fetching weather for search input:", err);
      showMessage("Could not fetch weather for the given location.", "danger");
    }
  } else {
    showMessage("Please type preferred location.", "warning");
  }
});

saveButtonEl.click((event) => {
  event.preventDefault();

  if (
    appState.cityName &&
    appState.latitude !== undefined &&
    appState.longitude !== undefined
  ) {
    saveLocation(appState);
  } else {
    showMessage("No valid location to save.", "warning");
  }
});

removeButtonEl.click((event) => {
  event.preventDefault();
  if (appState.cityName) {
    removeLocation(appState.cityName);
  } else {
    showMessage("No valid location to remove.", "warning");
  }
});

locationsSelectEl.change(async (event) => {
  const selectedCityName = event.target.value;
  console.log(`Vybrané město: ${selectedCityName}`);

  const savedLocations = getSavedLocations();
  const selectedLocation = savedLocations.find(
    (location) => location.cityName === selectedCityName
  );

  if (selectedLocation) {
    appState.cityName = selectedLocation.cityName;
    appState.latitude = selectedLocation.latitude;
    appState.longitude = selectedLocation.longitude;

    try {
      // fetchWeatherData ukáže a schová loader
      const weatherData = await fetchWeatherData(
        selectedLocation.latitude,
        selectedLocation.longitude,
        appState.units
      );
      displayWeatherData(weatherData, selectedCityName);
    } catch (err) {
      console.error("Error fetching weather for selected location:", err);
      showMessage(
        "Could not fetch weather for the selected location.",
        "danger"
      );
    }
  }
});

unitsSelectEl.change(async (event) => {
  const units = event.target.value;
  appState.units = units;
  console.log("Units", units);

  try {
    const weatherData = await fetchWeatherData(
      appState.latitude,
      appState.longitude,
      units
    );
    displayWeatherData(weatherData, appState.cityName);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    showMessage("Could not update weather data.", "danger");
  }
});

/***********************************
 * Spuštění aplikace
 ***********************************/
initApp();
