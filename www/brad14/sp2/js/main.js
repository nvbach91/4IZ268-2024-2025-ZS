const API_KEY = '9202d14af4a6eb24073e146f205c50d6';
const BASE_URL_DATA = 'https://api.openweathermap.org/data/3.0/onecall?';
const BASE_URL_GEO_DIRECT = 'https://api.openweathermap.org/geo/1.0/direct?';
const BASE_URL_GEO_REVERSE = 'https://api.openweathermap.org/geo/1.0/reverse?';

const constructUrl = (baseUrl, parameters) => {
    const url = `${baseUrl}${parameters}&appid=${API_KEY}`;
    return url;
}

const fetchWeatherData = async (lat, lon) => {
    const url = constructUrl(BASE_URL_DATA, `lat=${lat}&lon=${lon}&units=metric&exclude=minutely`);
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

const fetchCoordinates = async (location) => {
    const url = constructUrl(BASE_URL_GEO_DIRECT, `q=${location}&limit=3`);
    const res = await fetch(url);
    const data = await res.json();
    if (data.length === 0) {
        return new Error('Location not found');
    } else {
        const coordinateData = data[0];
        return coordinateData;
    }
}

const fetchLocationName = async (lat, lon) => {
    const url = constructUrl(BASE_URL_GEO_REVERSE, `lat=${lat}&lon=${lon}&limit=1`);
    const res = await fetch(url);
    const data = await res.json();
    return `${data[0].name}, ${data[0].country}`;
}

/////////////////////////////////////////////////////
// RENDERING
/////////////////////////////////////////////////////

const renderWeatherData = (data) => {
    const currentHtml = `
        <div class="current">
            <div class="main-wrapper">
                <div class="big-temp">
                    <p class="main"><span class="current-temp">${Math.round(data.current.temp)}</span><span class="current-unit">°</span></p>
                    <div>
                        <img width="90" height="90" src="./images/weather/${getIconName(data.current.weather[0], data.current.dt, data.current.sunrise, data.current.sunset)}.png" alt="Sun">
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
        <div class="hourly">${renderHourlyContent(data.hourly, data.current.sunrise, data.current.sunset)}</div>
    `;
    const dailyHtml = `
        <h3>Daily forecast</h3>
        <div class="daily">${renderDailyContent(data.daily)}</div>
    `;

    $('.current-wrapper').empty().append(currentHtml);
    $('.hourly-wrapper').empty().append(hourlyHtml);
    $('.daily-wrapper').empty().append(dailyHtml);
}

const renderHourlyContent = (hourlyData, sunrise, sunset) => {
    let html = ``;
    hourlyData.slice(0, 24).forEach((hour, index) => {
        const dateTime = getDateTime(hour.dt);
        const hourHtml = `
            <div class="hour-box">
                <p class="time">${index === 0 ? 'now' : dateTime.time}</p>
                <div class="img-wrapper">
                    <img width="60" src="./images/weather/${getIconName(hour.weather[0], hour.dt, sunrise, sunset)}.png" alt="">
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
    dailyData.forEach((day, index) => {
        const dateTime = getDateTime(day.dt);
        const dayHtml = `
            <div class="daily-box">
                <div class="date">${index === 0 ? 'Today' : dateTime.weekDay} ${dateTime.dayOfMonth} ${dateTime.month}</div>
                <div class="weather-info">
                    <div class="img-wrapper">
                        <img width="40" src="./images/weather/${getIconName(day.weather[0], day.dt, day.sunrise, day.sunset)}.png" alt="">
                    </div>
                    <p>${Math.round(day.temp.day)}°<span class="night-temp">/</span><span class="night-temp">${Math.round(day.temp.night)}°</span></p>
                </div>
            </div>
        `;
        html += dayHtml;
    })
    return html;
}






/////////////////////////////////////////////////////
// UTILITIES
/////////////////////////////////////////////////////

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

const addLocationToSearchParam = (location) => {
    const params = new URLSearchParams(window.location.search);
    params.set('location', location);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
}

const getIconName = (weatherCondition, dt, sunrise, sunset) => {
    switch (weatherCondition.main) {
        case 'Clear':
            if (dt > sunset) {
                return 'clear-night';
            } else {
                return 'clear-day';
            }
        case 'Snow':
            return 'snow';
        case 'Thunderstorm':
            return 'thunderstorm';
        case 'Rain':
            return 'rain';
        case 'Drizzle':
            return 'drizzle';
        case 'Clouds':
            switch (weatherCondition.description) {
                case 'few clouds':
                case 'scattered clouds':
                case 'broken clouds':
                    if (dt > sunset) {
                        return 'scattered-clouds-night';
                    } else {
                        return 'scattered-clouds-day';
                    }
                default:
                    return 'overcast-clouds';
            }
        default:
            return 'mist';
    }
}




/////////////////////////////////////////////////////
// EVENT HANDLING
/////////////////////////////////////////////////////

const input = $('input');
const overlay = $('.overlay')
var editing = false

$('form').on('submit', async (e) => {
    e.preventDefault();
    // save text input
    const searchLocation = input.val();
    /// try fetching coordinates for the location
    try {
        const location = $('input[name="location"]').val();
        const coordinates = await fetchCoordinates(location);
        if (coordinates instanceof Error) {
            Toastify({
                text: coordinates.message,
                className: 'error',
                offset: {
                    y: 5,
                },
                duration: 2000
            }).showToast();
            input.val(searchLocation);
            input.trigger('focus');
            // delete old weather results and reset search wrapper location
            $('.current-wrapper').empty();
            $('.hourly-wrapper').empty();
            $('.daily-wrapper').empty();
            $('.search-wrapper').removeClass('chosen');
        } else {
            $('.search-wrapper').addClass('chosen');
            input.trigger('blur');
            input.val(`${coordinates.name}, ${coordinates.country}`);
            addLocationToSearchParam(`${coordinates.name}, ${coordinates.country}`);
            const weatherData = await fetchWeatherData(coordinates.lat, coordinates.lon);
            renderWeatherData(weatherData);
            editing = false;
        }
    } catch (e) {
        console.error(e);
    }
});


// handle focus event on input element
input.on('focus', (e) => {
    console.log('executing focus editing is ' + editing);
    editing = true;
    overlay.fadeIn('fast');
    overlay.addClass('visible');
    $('#location-icon').css('display', 'none');
    $('#clear-icon').css('display', 'block');
});

// handle blur event on input element
input.on('blur', (e) => {
    if (!editing) {
        console.log('executing blur with editing = false');
        overlay.fadeOut('300');
        setTimeout(() => {
            overlay.removeClass('visible')
        }, 300);
        $('#location-icon').css('display', 'block');
        $('#clear-icon').css('display', 'none');
    } else {
        console.log('executing blur with editing = true, setting editing = false');
        editing = false;
    }



});

// clear input value on clear icon click
$('#clear-icon').on('click', (e) => {
    input.trigger('focus');
    input.val('');
});

// trigger blur of input if click is outside of input element and the clear icon
$(document).on('click', (e) => {
    if (!$(e.target).closest('input[name="location"], #clear-icon, #location-icon').length) {
        console.log('calling blur when editing = ' + editing);
        input.trigger('blur'); //calling blur when editing = false
    }
});




//fetch 
$('#location-icon').on('click', (e) => {
    e.preventDefault();
    $('#location-icon').css('display', 'none');
    $('#spinner-icon').css('display', 'block');
    navigator.geolocation.getCurrentPosition(async (position) => {
        $('.search-wrapper').addClass('chosen');
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const name = await fetchLocationName(lat, lon);
        addLocationToSearchParam(name);
        const weatherData = await fetchWeatherData(lat, lon);
        renderWeatherData(weatherData);
        input.val(name);
        $('#spinner-icon').css('display', 'none');
        $('#location-icon').css('display', 'block');
    }, () => {
        Toastify({
            text: 'Unable to retrieve your location',
            className: 'error',
            offset: {
                y: 5,
            },
            duration: 2000
        }).showToast();
        $('#spinner-icon').css('display', 'none');
        $('#location-icon').css('display', 'block');
    }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
});


const getResults = async () => {
    const params = new URLSearchParams(document.location.search);
    const location = params.get('location');
    if (location) {
        $('.search-wrapper').addClass('chosen');
        const coordinates = await fetchCoordinates(location);
        if (coordinates instanceof Error) {
            Toastify({
                text: coordinates.message,
                className: 'error',
                offset: {
                    y: 5,
                },
                duration: 2000
            }).showToast();
        } else {
            input.val(`${coordinates.name}, ${coordinates.country}`);
            const weatherData = await fetchWeatherData(coordinates.lat, coordinates.lon);
            renderWeatherData(weatherData);
        }
    }
}

// IIFE to fetch data from the searchparameters
(() => {
    getResults();
})();

window.addEventListener('popstate', () => {
    getResults();
})