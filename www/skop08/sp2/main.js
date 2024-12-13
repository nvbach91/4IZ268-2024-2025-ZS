const apiKey = '2c8e5210377a47abb1273751242111';
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';
let temperatureChart; 

async function fetchWeatherData(query) {
    try {
        const response = await $.getJSON(`${baseUrl}?key=${apiKey}&q=${query}&days=4&aqi=no&alerts=no`);
        addOrUpdateWorkspace(response);

        const currentTime = response.location.localtime;
        updateSearchHistory(response.location.name); 
        const next24Hours = getNext24HoursData(response.forecast.forecastday, currentTime);
    } catch (error) {
        alert("Chyba při načítání dat z API.");
    }
}
function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const query = `${lat},${lon}`;
                fetchWeatherData(query);
            },
            error => {
                alert("Nepodařilo se získat aktuální polohu. Zkontrolujte oprávnění.");
            }
        );
    } else {
        alert("Geolokace není podporována ve vašem prohlížeči.");
    }
}
function displayWeatherData(data) {
    const astro = data.forecast.forecastday[0].astro;
     $('.city-name').text(`${data.location.name}, ${data.location.country}`);

    $('.current-temp-text').text(`${data.current.temp_c} °C`);
    $('.icon-weather').html(`<img src="https:${data.current.condition.icon}" alt="Ikona počasí">`);
    $('.wind-speed-text').text(`${data.current.wind_kph} km/h`);
    $('.humidity-text').text(`${data.current.humidity}%`);
    $('.feelslike-text').text(`${data.current.feelslike_c} °C`);
    $('.sunrise-text').text(`${astro.sunrise}`);
    $('.sunset-text').text(`${astro.sunset}`);
    $('.moonrise-text').text(`${astro.moonrise}`);
    $('.moonset-text').text(`${astro.moonset}`);
    $('.moonphase-text').text(`${astro.moon_phase}`);

    const forecastData = data.forecast.forecastday;
    const currentTime = data.location.localtime;
    const next24Hours = getNext24HoursData(forecastData, currentTime);

    $('.hourly-forecast').html(`
        <h4>24 hodinová předpověď</h4>
        <div class="hourly-container">
            ${next24Hours.map(hour => `
                <div class="hour-box">
                    <span class="hour-time">${hour.time.split(' ')[1]}</span>
                    <span class="hour-temp">${hour.temp_c} °C</span>
                </div>
            `).join('')}
        </div>
    `);
    const threeDay = data.forecast.forecastday;
    $('.three-day-forecast').html(`
        <h4>Následující dny</h4>
        <div class="three-day-container">
            ${threeDay.map(day => `
                <div class="day-box">
                    <div class="day-date">${day.date}</div>
                    <div class="day-temps">
                        <span class="day-max">Max: ${day.day.maxtemp_c} °C</span>
                        <span class="day-min">Min: ${day.day.mintemp_c} °C</span>
                    </div>
                    <div class="day-condition">
                        <img src="https:${day.day.condition.icon}" alt="Ikona počasí">
                        <span>${day.day.condition.text}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `);
}

function updateTemperatureChart(hourlyData) {
    const hours = hourlyData.map(hour => hour.time.split(' ')[1]); 
    const temperatures = hourlyData.map(hour => hour.temp_c);      

    const ctx = $('#temperatureChart')[0].getContext('2d');
    if (temperatureChart) temperatureChart.destroy();

    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Teplota (°C)',
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
                y: { beginAtZero: false } 
            }
        }
    });
}

function addOrUpdateWorkspace(data) {
    const cityName = data.location.name;

    const existingWorkspace = $(`.workspace[data-city="${cityName}"]`);

    if (existingWorkspace.length > 0) {
        updateWorkspace(existingWorkspace, data);
    } else {
        const workspaceHTML = `
            <div class="workspace" data-city="${cityName}">
                <div class="workspace-header">
                    <h2>${cityName}, ${data.location.country}</h2>
                    <button class="close-workspace">×</button>
                </div>
                <div class="icon-weather"></div>
                <div class="current-temp">Aktuální teplota: <div class="current-temp-text">${data.current.temp_c} °C</div></div>
                <div class="details">
                    <div class="detail-box">Rychlost větru <span>${data.current.wind_kph} km/h</span></div>
                    <div class="detail-box">Vlhkost <span>${data.current.humidity}%</span></div>
                    <div class="detail-box">Pocitová teplota <span>${data.current.feelslike_c} °C</span></div>
                </div>
                <div class="sun-moon">
                    <div class="detail-box">Východ slunce <span>${data.forecast.forecastday[0].astro.sunrise}</span></div>
                    <div class="detail-box">Západ slunce <span>${data.forecast.forecastday[0].astro.sunset}</span></div>
                </div>
                <div class="moon-phase">
                    <div class="detail-box">Východ měsíce <span>${data.forecast.forecastday[0].astro.moonrise}</span></div>
                    <div class="detail-box">Fáze měsíce <span>${data.forecast.forecastday[0].astro.moon_phase}</span></div>
                    <div class="detail-box">Západ měsíce <span>${data.forecast.forecastday[0].astro.moonset}</span></div>
                </div>
                <div class="hourly-forecast"></div>
                <div class="three-day-forecast"></div>
                <div class="temperature-graph-container">
                    <h4>Graf teploty na dalších 24 hodin</h4>
                    <canvas class="temperatureChart"></canvas>
                </div>
            </div>
        `;
        $('.workspace-container').prepend(workspaceHTML);

        const newWorkspace = $(`.workspace[data-city="${cityName}"]`);
        updateWorkspace(newWorkspace, data);

        updateWorkspaceStorage(cityName);
    }

    $('.close-workspace').on('click', function() {
        const cityToRemove = $(this).closest('.workspace').data('city');
        $(this).closest('.workspace').remove();
        removeCityFromStorage(cityToRemove);
    });
}

const charts = {};

function updateWorkspace(workspace, data) {
    const currentTime = data.location.localtime;
    const next24Hours = getNext24HoursData(data.forecast.forecastday, currentTime);

    workspace.find('.icon-weather').html(`<img src="https:${data.current.condition.icon}" alt="Ikona počasí">`);
    workspace.find('.current-temp-text').text(`${data.current.temp_c} °C`);

    workspace.find('.hourly-forecast').html(`
        <h4>24 hodinová předpověď</h4>
        <div class="hourly-container">
            ${next24Hours.map(hour => `
                <div class="hour-box">
                    <span class="hour-time">${hour.time.split(' ')[1]}</span>
                    <span class="hour-temp">${hour.temp_c} °C</span>
                </div>
            `).join('')}
        </div>
    `);

    const threeDay = data.forecast.forecastday;
    workspace.find('.three-day-forecast').html(`
        <h4>Následující dny</h4>
        <div class="three-day-container">
            ${threeDay.map(day => `
                <div class="day-box">
                    <div class="day-date">${day.date}</div>
                    <div class="day-temps">
                        <span class="day-max">Max: ${day.day.maxtemp_c} °C</span>
                        <span class="day-min">Min: ${day.day.mintemp_c} °C</span>
                    </div>
                    <div class="day-condition">
                        <img src="https:${day.day.condition.icon}" alt="Ikona počasí">
                        <span>${day.day.condition.text}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `);

    const ctx = workspace.find('.temperatureChart')[0].getContext('2d');
    const hours = next24Hours.map(hour => hour.time.split(' ')[1]);
    const temperatures = next24Hours.map(hour => hour.temp_c);

    if (charts[data.location.name]) {
        charts[data.location.name].destroy();
    }

    charts[data.location.name] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Teplota (°C)',
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: false } }
        }
    });
}

function updateSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    history = history.filter(item => item !== city);

    history.unshift(city);

    if (history.length > 10) history.pop();

    localStorage.setItem('searchHistory', JSON.stringify(history));
    
    displaySearchHistory();
}

function displaySearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    $('.left-panel').html(`
        <h3>Naposledy vyhledané</h3>
        <ul>${history.map(city => `<li class="history-item">${city}</li>`).join('')}</ul>
    `);
    $('.history-item').on('click', function () {
        fetchWeatherData($(this).text());
    });
}

function updateWorkspaceStorage(cityName) {
    let workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];
    if (!workspaces.includes(cityName)) {
        workspaces.push(cityName);
        localStorage.setItem('workspaces', JSON.stringify(workspaces));
    }
}

function removeCityFromStorage(cityName) {
    let workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];
    workspaces = workspaces.filter(city => city !== cityName);
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
}

function loadWorkspacesFromStorage() {
    const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];
    workspaces.forEach(city => {
        fetchWeatherData(city);
    });
}

$(document).ready(() => {
    $('#search-btn').on('click', () => {
        const city = $('#search').val().trim();
        if (city) {
            fetchWeatherData(city);
        } else {
            alert("Prosím, zadejte název města.");
        }
    });

    $('#location-btn').on('click', () => {
        fetchWeatherByLocation();
    });
    loadWorkspacesFromStorage();
    displaySearchHistory();
});

function getNext24HoursData(forecastData, currentTime) {
    const next24Hours = [];
    let foundCurrentHour = false;

    const currentDateHour = currentTime.split(':')[0] + ":00";

    for (const day of forecastData) {
        for (const hour of day.hour) {
            const hourTime = hour.time.split(' ')[1];

            if (!foundCurrentHour && hour.time.includes(currentDateHour)) {
                foundCurrentHour = true; 
            }

            if (foundCurrentHour && next24Hours.length < 24) {
                next24Hours.push(hour);
            }
        }
    }

    return next24Hours;
}
