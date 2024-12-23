const API_KEY = '9202d14af4a6eb24073e146f205c50d6';
const BASE_URL_DATA = 'https://api.openweathermap.org/data/3.0/onecall?';
const BASE_URL_GEO = 'https://api.openweathermap.org/geo/1.0/direct?';

const constructUrl = (baseUrl, parameters) => {
    const url = `${baseUrl}${parameters}&appid=${API_KEY}`;
    return url;
}

const fetchWeatherData = async (lat, lon) => {
    const url = constructUrl(BASE_URL_DATA, `lat=${lat}&lon=${lon}&units=metric&exclude=minutely`);
    const reponse = await fetch(url);
    const data = await reponse.json();
    return data;
}

const fetchCoordinates = async (city) => {
    const url = constructUrl(BASE_URL_GEO, `q=${city}&limit=1`);
    const reponse = await fetch(url);
    const data = await reponse.json();
    const coordinates = {
        'lat': data[0].lat,
        'lon': data[0].lon
    };
    return coordinates;
}

const renderWeatherData = (data) => {
    const currentHtml = `
        <div class="current">
            <div class="main-wrapper">
                <div class="big-temp">
                    <p class="main"><span class="current-temp">${Math.round(data.current.temp)}</span><span class="current-unit">°</span></p>
                    <div>
                        <img width="90" height="90" src="./images/weather/sunny.png" alt="Sun">
                    </div>
                </div>
                <div class="info">
                    <p class="description">${data.current.weather[0].description.charAt(0).toUpperCase() + data.current.weather[0].description.slice(1)}</p>
                    <p>Feels like: ${Math.round(data.current.feels_like)}°</p>
                </div>
            </div>
            <p>High: ${Math.round(data.daily[0].temp.max)}° Low: ${Math.round(data.daily[0].temp.min)}°</p>
        </div>
    `;
    const hourlyHtml = `
        <h3>Hourly forecast</h3>
        <div class="hourly">${renderHourlyContent(data.hourly)}</div>
    `;
    const dailyHtml = `
        <h3>Daily forecast</h3>
        <div class="daily">${renderDailyContent(data.daily)}</div>
    `;

    $('.current-wrapper').empty().append(currentHtml);
    $('.hourly-wrapper').empty().append(hourlyHtml);
    $('.daily-wrapper').empty().append(dailyHtml);
}

const renderHourlyContent = (hourlyData) => {
    let html = ``;
    hourlyData.slice(0, 24).forEach((hour, index) => {
        const dateTime = getDateTime(hour.dt);
        const hourHtml = `
            <div class="hour-box">
                <p class="time">${index === 0 ? 'now' : dateTime.time}</p>
                <div class="img-wrapper">
                    <img width="60" src="./images/weather/sunny.png" alt="">
                </div>
                <p class="temp"><span class="temp-number">${Math.round(hour.temp)}</span> °C</p>
            </div>
        `;
        html += hourHtml;
    })
    return html;
}

const renderDailyContent = (dailyData) => {
    let html = ``;
    dailyData.slice(0, 10).forEach((day, index) => {
        const dateTime = getDateTime(day.dt);
        const dayHtml = `
            <div class="daily-box">
                <div class="date">${index === 0 ? 'Today' : dateTime.weekDay} ${dateTime.dayOfMonth} ${dateTime.month}</div>
                <div class="weather-info">
                    <div class="img-wrapper">
                        <img width="40" src="./images/weather/sunny.png" alt="">
                    </div>
                    <p>${Math.round(day.temp.day)}°<span class="night-temp">/</span><span class="night-temp">${Math.round(day.temp.night)}°</span></p>
                </div>
            </div>
        `;
        html += dayHtml;
    })
    return html;
}

const getDateTime = (unixDt) => {
    const dt = dayjs.unix(unixDt);
    const dateTime = {
        'time': dt.format('HH:mm'),
        'date': dt.format('DD/MM/YYYY'),
        'weekDay': dt.format('dddd'),
        'dayOfMonth': dt.format('D'),
        'month': dt.format('MMM')
    };
    return dateTime;
}

const form = $('form');
const searchWrapper = $('.search-wrapper');

$('form').on('submit', async (e) => {
    e.preventDefault();
    $('input').trigger('blur');
    searchWrapper.addClass('chosen');
    const location = $('input[name="location"]').val();
    const coordinates = await fetchCoordinates(location);
    const weatherData = await fetchWeatherData(coordinates.lat, coordinates.lon);
    renderWeatherData(weatherData);
});



// fetchWeatherData('51.5', '-0.12');
// fetchCoordinates('London');