// weather.js
import Utils from './utils.js';
import API from './api.js';
import Notifications from './notifications.js';

const Weather = {
    elements: {
        locationInput: null,
        weatherResult: null,
        weatherForm: null,
        weatherHeader: null,
        weatherDetails: null,
        weatherIcon: null,
        weatherContainer: null
    },

    createWeatherWidget(weatherData) {
        const widget = document.createElement('div');
        widget.className = 'weather-widget';

        // Header section
        const header = document.createElement('div');
        header.className = 'weather-header';

        const icon = document.createElement('img');
        icon.src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
        icon.alt = weatherData.weather[0].description;
        icon.className = 'weather-icon';

        const headerInfo = document.createElement('div');
        
        const location = document.createElement('h5');
        location.textContent = weatherData.name;

        const temperature = document.createElement('p');
        temperature.className = 'temperature';
        temperature.textContent = `${Math.round(weatherData.main.temp)}°C`;

        const condition = document.createElement('p');
        condition.className = 'condition';
        condition.textContent = weatherData.weather[0].description;

        headerInfo.appendChild(location);
        headerInfo.appendChild(temperature);
        headerInfo.appendChild(condition);
        header.appendChild(icon);
        header.appendChild(headerInfo);

        // Divider
        const divider = document.createElement('hr');

        // Details section
        const details = document.createElement('div');
        details.className = 'weather-details';

        const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();

        const detailItems = [
            { label: 'Feels Like', value: `${Math.round(weatherData.main.feels_like)}°C` },
            { label: 'Humidity', value: `${weatherData.main.humidity}%` },
            { label: 'Wind', value: `${weatherData.wind.speed} m/s` },
            { label: 'Sunrise', value: sunrise },
            { label: 'Sunset', value: sunset }
        ];

        detailItems.forEach(item => {
            const detail = document.createElement('p');
            
            const label = document.createElement('span');
            label.className = 'weather-label';
            label.textContent = `${item.label}:`;
            
            const value = document.createTextNode(` ${item.value}`);
            
            detail.appendChild(label);
            detail.appendChild(value);
            details.appendChild(detail);
        });

        widget.appendChild(header);
        widget.appendChild(divider);
        widget.appendChild(details);

        return widget;
    },

    createWeatherForm() {
        const form = document.createElement('form');
        form.className = 'weather-controls';

        const locationInput = document.createElement('input');
        locationInput.type = 'text';
        locationInput.id = 'weatherLocation';
        locationInput.className = 'form-control mb-2';
        locationInput.placeholder = 'Enter location';
        locationInput.required = true;

        const checkWeatherBtn = document.createElement('button');
        checkWeatherBtn.type = 'submit';
        checkWeatherBtn.className = 'btn btn-primary';
        checkWeatherBtn.textContent = '🌤️ Check Weather';

        form.appendChild(locationInput);
        form.appendChild(checkWeatherBtn);

        return form;
    },

    async render() {
        const container = document.createElement('div');
        container.className = 'container py-4';

        const header = document.createElement('h2');
        header.textContent = 'Weather Forecast';
        header.className = 'mb-4';

        const content = document.createElement('div');
        content.className = 'weather-content';
        
        const form = this.createWeatherForm();
        
        const weatherResult = document.createElement('div');
        weatherResult.id = 'weatherResult';
        weatherResult.className = 'weather-result mt-4';

        content.appendChild(form);
        content.appendChild(weatherResult);

        container.appendChild(header);
        container.appendChild(content);

        this.elements = {
            locationInput: form.querySelector('#weatherLocation'),
            weatherResult: weatherResult,
            weatherForm: form,
            weatherContainer: container
        };

        return container;
    },

    handleFormSubmit(event) {
        event.preventDefault();
        this.fetchWeather();
    },

    async init() {
        if (!this.elements.weatherForm) {
            console.error('Weather form not initialized');
            return;
        }

        this.elements.weatherForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    },

    async fetchWeather() {
        if (!this.elements.locationInput || !this.elements.weatherResult) {
            console.error('Required elements not found');
            return;
        }

        const location = this.elements.locationInput.value.trim();
        if (!location) {
            Notifications.showAlert('Please enter a location', 'warning');
            return;
        }

        try {
            Utils.showLoading();
            
            // Get coordinates for the location
            const coords = await API.geocode(location);
            if (!coords) {
                throw new Error('Location not found');
            }

            // Get weather data
            const weatherData = await API.getWeather(coords.lat, coords.lon);
            if (!weatherData) {
                throw new Error('Weather data not available');
            }

            // Update the UI
            this.elements.weatherResult.innerHTML = '';
            const weatherWidget = this.createWeatherWidget(weatherData);
            this.elements.weatherResult.appendChild(weatherWidget);

        } catch (error) {
            console.error('Weather fetch error:', error);
            Notifications.showAlert(error.message || 'Failed to fetch weather data', 'error');
            this.elements.weatherResult.innerHTML = '';
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger';
            errorMessage.textContent = 'Unable to fetch weather data. Please try again.';
            this.elements.weatherResult.appendChild(errorMessage);
        } finally {
            Utils.hideLoading();
        }
    }
};

export default Weather;