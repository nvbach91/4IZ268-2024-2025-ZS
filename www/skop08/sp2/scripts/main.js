const apiKey = '2c8e5210377a47abb1273751242111';
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';
let currentUnit = 1; // 1 -> C, 2 -> F
const charts = {};

const convertBtn = $('#convert-btn');
const workspaceContainer = $('.workspace-container');
const leftPanel = $('.left-panel');
const body = $('body');
const search = $('#search');
const locationBtn = $('#location-btn');
const form = $('form');

$(document).ready(() => {
    form.on('submit', (event) => {
        event.preventDefault();

        const city = search.val().trim();
        if (city) {
            fetchWeatherData(city);
            search.val('');
        } else {
            Swal.fire({
                title: 'Chyba',
                text: 'Zadejte prosím název města.',
                icon: 'info',
                confirmButtonText: 'OK'
              })
        };
    });

    locationBtn.on('click', () => {
        fetchWeatherByLocation();
    });

    loadWorkspacesFromStorage();
    displaySearchHistory();
    
    currentUnit = parseInt(localStorage.getItem('currentUnit')) || 1;

    updateAllTemperatures();

    convertBtnChangeText();

    convertBtn.on('click', () => {
        updateAllTemperatures();
        currentUnit = currentUnit === 1 ? 2 : 1;
        localStorage.setItem('currentUnit', currentUnit);
        convertBtnChangeText();
    });
});

function convertBtnChangeText() {
    if (currentUnit === 2) {
        convertBtn.text('Přepnout na °C');
    } else {
       convertBtn.text('Přepnout na °F');
    }
}

async function fetchWeatherData(query, insertToHistory = true) {
    insertSpinner();
    try {
        const response = await $.getJSON(`${baseUrl}?key=${apiKey}&q=${query}&days=4&aqi=no&alerts=no`);
        addOrUpdateWorkspace(response);
        if (insertToHistory)
        {
            updateSearchHistory(response.location.name);
        }
    } catch (error) {
        Swal.fire({
            title: 'Chyba',
            text: 'Chyba při načítání dat.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        removeCityFromStorage(query);
        removeCityFromSearch(query);
    }
    removeSpinner();
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
                Swal.fire({
                    title: 'Chyba',
                    text: 'Nepodařilo se získat aktuální polohu. Zkontrolujte oprávnění.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                  })
            }
        );
    } else {
        Swal.fire({
            title: 'Chyba',
            text: 'Váš prohlížeč nepodporuje geolokaci.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
    }
}

function addOrUpdateWorkspace(data) {
    const cityName = data.location.name;

    const existingWorkspace = $(`.workspace[data-city="${cityName}"]`);

    if (existingWorkspace.length > 0) {
        updateWorkspace(existingWorkspace, data);
    } else {
        const workspaceHTML = $(`
            <div class="workspace" data-city="${cityName}">
                <div class="workspace-header">
                    <h2>${cityName}, ${data.location.country}</h2>
                    <button class="close-workspace">×</button>
                </div>
                <div class="icon-weather"></div>
                <div class="current-temp">Aktuální teplota: <div class="current-temp-text temp"></div></div>
                <div class="details">
                    <div class="detail-box">Rychlost větru <span class="current-wind-text"></span></div>
                    <div class="detail-box">Vlhkost <span class="current-humidity-text"></span></div>
                    <div class="detail-box">Pocitová teplota <span class="current-feelslike-text temp"></span></div>
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
        `);
        workspaceContainer.prepend(workspaceHTML);
        workspaceHTML.find('.close-workspace').on('click', function() {
            const cityToRemove = $(this).closest('.workspace').data('city');
            $(this).closest('.workspace').remove();
            removeCityFromStorage(cityToRemove);
        });
        updateWorkspace(workspaceHTML, data);

        updateWorkspaceStorage(cityName);
    }
}

function updateWorkspace(workspace, data) {
    const currentTime = data.location.localtime;
    const next24Hours = getNext24HoursData(data.forecast.forecastday, currentTime);

    workspace.find('.icon-weather').html(`<img src="https:${data.current.condition.icon}" alt="Ikona počasí">`);
    workspace.find('.current-temp-text').text(`${currentUnit == 2 ? convertToF(data.current.temp_c) + " °F" : data.current.temp_c + " °C"}`);
    workspace.find('.current-wind-text').text(`${data.current.wind_kph} km/h`);
    workspace.find('.current-humidity-text').text(`${data.current.humidity} %`);
    workspace.find('.current-feelslike-text').text(`${currentUnit == 2 ? convertToF(data.current.feelslike_c) + " °F" : data.current.feelslike_c + " °C"}`);

    workspace.find('.hourly-forecast').html(`
        <h4>24 hodinová předpověď</h4>
        <div class="hourly-container">
            ${next24Hours.map(hour => `
                <div class="hour-box">
                    <span class="hour-time">${hour.time.split(' ')[1]}</span>
                    <span class="hour-temp temp">${currentUnit == 2 ? convertToF(hour.temp_c) + " °F" : hour.temp_c + " °C"} </span>
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
                        <span class="day-max">Max: <span class="temp">${currentUnit == 2 ? convertToF(day.day.maxtemp_c) + " °F" : day.day.maxtemp_c + " °C"} </span></span>
                        <span class="day-min">Min: <span class="temp">${currentUnit == 2 ? convertToF(day.day.mintemp_c) + " °F" : day.day.mintemp_c + " °C"} </span></span>
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

    history = history.filter(item => item.city !== city);

    history.unshift({ city: city, favorite: false });

    if (history.length > 10) history.pop();

    history.sort((a, b) => b.favorite - a.favorite);

    localStorage.setItem('searchHistory', JSON.stringify(history));
    
    displaySearchHistory();
}

function displaySearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    leftPanel.html(`
        <h3>Naposledy vyhledané</h3>
        <ul>${history.map(item => `
            <li class="history-item">
                <span class="favorite-star" data-city="${item.city}">${item.favorite ? '⭐' : '★'}</span> ${item.city}
            </li>`).join('')}
        </ul>
    `);
    leftPanel.find('.favorite-star').on('click', function (event) {
        event.stopPropagation();
        const city = $(this).data('city');
        toggleFavorite(city);
    });
    leftPanel.find('.history-item').on('click', function () {
        fetchWeatherData($(this).text().trim().replace('⭐', '').replace('★', ''), false);
    });
}

function toggleFavorite(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history = history.map(item => {
        if (item.city === city) {
            item.favorite = !item.favorite;
        }
        return item;
    });
    history.sort((a, b) => b.favorite - a.favorite);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    displaySearchHistory();
}

function removeCityFromSearch(cityName) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history = history.filter(item => item.city !== cityName);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    displaySearchHistory();
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
        fetchWeatherData(city, false);
    });
}

function insertSpinner() {
    spinnerElement = `
        <div class="spinner-container">
            <div class="spinner"></div>
        </div>
    `;
    body.prepend(spinnerElement);
}

function removeSpinner(){
    const spinnerElements = $(".spinner-container");

    if (spinnerElements.length) 
    {
        spinnerElements.remove();
    }
}

function updateAllTemperatures() {
    $('.temp').each(function () {
        const element = $(this);
        
        const tempText = element.text().trim();

        const tempValue = parseFloat(tempText.split(' ')[0]);

        let newTempValue;

        if(currentUnit == 1){
            newTempValue = convertToF(tempValue)
        }
        else{
            newTempValue = convertToC(tempValue)
        }

        const newUnit = currentUnit === 1 ? '°F' : '°C';

        element.text(`${newTempValue.toFixed(1)} ${newUnit}`);
    });

}

function convertToC(value) {
    return Math.round((value - 32) * 5 / 9 * 10) / 10;
}

function convertToF(value) {
    return Math.round((value * 9 / 5 + 32) * 10) / 10;
}

function getNext24HoursData(forecastData, currentTime) {
    const next24Hours = [];
    let foundCurrentHour = false;

    const currentDateHour = currentTime.split(':')[0] + ":00";

    for (const day of forecastData) {
        for (const hour of day.hour) {
            if(next24Hours.length >= 24){
                break;
            }
            
            if (!foundCurrentHour && hour.time.includes(currentDateHour)) {
                foundCurrentHour = true; 
            }

            if (foundCurrentHour) {
                next24Hours.push(hour);
            }
        }
    }

    return next24Hours;
}
