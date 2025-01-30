import API from './api.js';
import Utils from './utils.js';
import Notifications from './notifications.js';

const Weather = {
    async getWeather(location) {
        try {
            Utils.showLoading();

            const coords = await API.geocode(location);
            if (!coords) {
                throw new Error('Location not found.');
            }

            const weatherData = await API.getWeather(coords.lat, coords.lon);
            if (!weatherData || !weatherData.weather) {
                throw new Error('Weather data not available.');
            }

            return this.formatWeatherData(weatherData);
        } catch (error) {
            console.error('Weather error:', error);
            Notifications.showAlert(error.message || 'Failed to fetch weather data.', 'error');
            return null;
        } finally {
            Utils.hideLoading();
        }
    },

    formatWeatherData(data) {
        return {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed),
            sunrise: this.formatTime(data.sys.sunrise * 1000),
            sunset: this.formatTime(data.sys.sunset * 1000),
            feelsLike: Math.round(data.main.feels_like),
            location: `${data.name}, ${data.sys.country}`
        };
    },

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    createWeatherWidget(weatherData) {
        return `
            <div class="weather-widget card p-3 shadow-sm">
                <div class="weather-header d-flex align-items-center">
                    <img src="${weatherData.icon}" alt="${weatherData.description}" class="weather-icon me-3">
                    <div>
                        <h5>${weatherData.location}</h5>
                        <p class="temperature">${weatherData.temperature}°C</p>
                        <p class="condition">${weatherData.description}</p>
                    </div>
                </div>
                <hr>
                <div class="weather-details">
                    <p><strong>Feels Like:</strong> ${weatherData.feelsLike}°C</p>
                    <p><strong>Humidity:</strong> ${weatherData.humidity}%</p>
                    <p><strong>Wind:</strong> ${weatherData.windSpeed} m/s</p>
                    <p><strong>Sunrise:</strong> ${weatherData.sunrise}</p>
                    <p><strong>Sunset:</strong> ${weatherData.sunset}</p>
                </div>
            </div>
        `;
    },

    async render() {
        const container = document.createElement("div");
        container.className = "container";
        container.innerHTML = `
            <h2>Weather Forecast</h2>
            <p>Check the current weather at your destination.</p>
            <div class="weather-widget">
                <input type="text" id="weatherLocation" placeholder="Enter location" class="form-control mb-2">
                <button id="checkWeather" class="btn btn-primary">Check Weather</button>
                <div id="weatherResult" class="mt-3"></div>
            </div>
        `;

        // Bind events after rendering
        setTimeout(() => this.bindEvents(), 0);

        return container; 
    },

    bindEvents() {
        document.addEventListener("click", async (e) => {
            if (e.target.matches("#checkWeather")) {
                this.fetchWeather();
            }
        });
    },

    async fetchWeather() {
        const locationInput = document.getElementById("weatherLocation");
        const weatherResult = document.getElementById("weatherResult");

        if (!locationInput || !weatherResult) {
            console.error("Weather elements not found.");
            return;
        }

        const location = locationInput.value.trim();
        if (!location) {
            Notifications.showAlert("Please enter a location.", "warning");
            return;
        }

        try {
            Utils.showLoading();
            const weatherData = await this.getWeather(location);
            if (weatherData) {
                weatherResult.innerHTML = this.createWeatherWidget(weatherData);
            } else {
                weatherResult.innerHTML = `<p class="text-danger">Weather data not found.</p>`;
            }
        } catch (error) {
            console.error("Weather fetch error:", error);
            Notifications.showAlert("Failed to fetch weather data", "error");
        } finally {
            Utils.hideLoading();
        }
    }
};

export default Weather;
