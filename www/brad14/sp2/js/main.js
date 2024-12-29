const API_KEY = '9202d14af4a6eb24073e146f205c50d6';
const BASE_URL_DATA = 'https://api.openweathermap.org/data/3.0/onecall?';
const BASE_URL_GEO_DIRECT = 'https://api.openweathermap.org/geo/1.0/direct?';
const BASE_URL_GEO_REVERSE = 'https://api.openweathermap.org/geo/1.0/reverse?';

/**
 * Constructs a URL with the given base URL and parameters, appending the API key.
 * @param {string} baseUrl - The base URL for the API endpoint.
 * @param {string} parameters - The query parameters to append to the URL.
 * @returns {string} The constructed URL with the API key.
 */
const constructUrl = (baseUrl, parameters) => {
    const url = `${baseUrl}${parameters}&appid=${API_KEY}`;
    return url;
}

/**
 * Fetches weather data for the given latitude and longitude.
 * @param {number} lat - The latitude of the location.
 * @param {number} lon - The longitude of the location.
 * @returns {Promise<Object>} The weather data for the location.
 */
const fetchWeatherData = async (lat, lon) => {
    const url = constructUrl(BASE_URL_DATA, `lat=${lat}&lon=${lon}&units=metric&exclude=minutely`);
    const res = await fetch(url);
    const data = await res.json();
    return data;
}


/**
 * Fetches coordinates for the given location name.
 * @param {string} location - The name of the location.
 * @returns {Promise<Object|Error>} The coordinates of the location or an error if not found.
 */
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


/**
 * Fetches the location name based on latitude and longitude coordinates.
 *
 * @param {number} lat - The latitude coordinate.
 * @param {number} lon - The longitude coordinate.
 * @returns {Promise<string>} A promise that resolves to a string containing the location name and country.
 */
const fetchLocationName = async (lat, lon) => {
    const url = constructUrl(BASE_URL_GEO_REVERSE, `lat=${lat}&lon=${lon}&limit=1`);
    const res = await fetch(url);
    const data = await res.json();
    return `${data[0].name}, ${data[0].country}`;
}

/////////////////////////////////////////////////////
// RENDERING
/////////////////////////////////////////////////////

/**
 * Renders the weather data into the HTML.
 *
 * @param {Object} data - The weather data object.
 */
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
        <div class="hourly">${renderHourlyContent(data.hourly, data.timezone, data.current.sunrise, data.current.sunset)}</div>
    `;
    const dailyHtml = `
        <h3>Daily forecast</h3>
        <div class="daily">${renderDailyContent(data.daily)}</div>
    `;

    $('.current-wrapper').empty().append(currentHtml);
    $('.hourly-wrapper').empty().append(hourlyHtml);
    $('.daily-wrapper').empty().append(dailyHtml);
}
/**
 * Renders the hourly weather content as HTML.
 *
 * @param {Array} hourlyData - Array of hourly weather data objects.
 * @param {string} timezone - The timezone of the location.
 * @param {number} sunrise - The timestamp of the sunrise.
 * @param {number} sunset - The timestamp of the sunset.
 * @returns {string} The HTML string representing the hourly weather content.
 */
const renderHourlyContent = (hourlyData, timezone, sunrise, sunset) => {
    let html = ``;
    hourlyData.slice(0, 24).forEach((hour, index) => {
        const dateTime = getDateTime(hour.dt, timezone);
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

/**
 * Renders the daily weather content as HTML.
 *
 * @param {Array} dailyData - An array of daily weather data objects.
 * @returns {string} The HTML string representing the daily weather content.
 */
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

/**
 * Updates the recent searches section in the UI.
 * 
 * This function generates the HTML content for the recent searches section,
 * including a title and a list of recent search locations, and then updates
 * the `.location-history` element with this content.
 */
const updateRecentSearches = () => {
    const html = `
        <p class="title">Recent searches:</p>
        <div class="locations">
            ${renderRecentSearchesContent()}
        </div>
    `;
    $('.location-history').empty().append(html);
}

/**
 * Generates HTML content for recent searches.
 *
 * This function retrieves a list of locations from the `getLocations` function,
 * iterates over each location, and constructs HTML elements for each location.
 * Each location is wrapped in an anchor tag with an onclick event to select the location.
 * Additionally, each location has a trash icon with an onclick event to remove the location from recent searches.
 *
 * @returns {string} The generated HTML content for recent searches.
 */
const renderRecentSearchesContent = () => {
    let html = ``;
    const locations = getLocations();
    locations.forEach((location) => {
        const locationHtml = `
            <a onclick="selectLocation('${location}')">
                <div class="location">
                    ${location}
                    <svg id="trash-icon" onclick="removeLocationFromRecentSearches(event, '${location}')" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 448 512">
                        <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path fill="" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                </div>
            </a>
        `;
        html += locationHtml;
    })
    return html;
}



/////////////////////////////////////////////////////
// UTILITIES
/////////////////////////////////////////////////////

/**
 * Converts a Unix timestamp to a formatted date and time object.
 *
 * @param {number} unixDt - The Unix timestamp to convert.
 */
const getDateTime = (unixDt, timezone) => {
    const localTime = dayjs.unix(unixDt);
    const dt = dayjs.tz(localTime, timezone);
    const dateTime = {
        'time': dt.format('HH:mm'),
        'date': dt.format('DD/MM/YYYY'),
        'weekDay': dt.format('dddd'),
        'dayOfMonth': dt.format('D'),
        'month': dt.format('MMM')
    };
    return dateTime;
}


/**
 * Updates the URL search parameters to include the specified location.
 * 
 * This function takes a location string, adds it to the current URL's search parameters,
 * and updates the browser's history state with the new URL.
 * 
 * @param {string} location - The location to be added to the URL search parameters.
 */
const addLocationToSearchParam = (location) => {
    const params = new URLSearchParams(window.location.search);
    params.set('location', location);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
}

/**
 * Fetches and displays weather data based on the location specified in the URL search parameters.
 * If a location is found, it fetches the coordinates and then the weather data for that location.
 * Renders the weather data UI.
 * Displays an error message if fetching coordinates fails.
 */
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


/**
 * Retrieves the locations from the local storage.
 *
 * @returns {Array|null} An array of locations if they exist in local storage, otherwise null.
 */
const getLocations = () => {
    const storage = window.localStorage;
    let locations = storage.getItem('locations');
    if (!locations) {
        return null;
    } else {
        return JSON.parse(locations);
    }
}


/**
 * Stores a given location in the browser's local storage if it is not already present.
 *
 * @param {string} location - The location to be stored.
 */
const storeLocation = (location) => {
    const storage = window.localStorage;
    let locations = storage.getItem('locations');
    locations = locations ? JSON.parse(locations) : [];
    const locationDuplicate = locations.reduce((acc, place) => acc || place === location, false);
    if (!locationDuplicate) {
        locations = [location, ...locations];
    } else {
        const index = locations.indexOf(location);
        locations.splice(index, 1);
        locations = [location, ...locations];
    }
    // update locations array in localstorage
    storage.setItem('locations', JSON.stringify(locations));
}


/**
 * Selects a location, adds it to the search parameters, and retrieves the results.
 *
 * @param {string} location - The location to be selected.
 */
const selectLocation = (location) => {
    updateLocations(location);
    getResults();
}


/**
 * Updates the locations by storing the given location, adding it to the search parameters,
 * and updating the recent searches.
 *
 * @param {string} location - The location to be updated.
 */
const updateLocations = (location) => {
    storeLocation(location);
    addLocationToSearchParam(location);
    updateRecentSearches();
}


/**
 * Removes a specified location from the recent searches.
 *
 * @param {Event} e - The event object.
 * @param {string} location - The location to be removed from recent searches.
 */
const removeLocationFromRecentSearches = (e, location) => {
    e.stopPropagation();
    const locations = getLocations();
    const index = locations.indexOf(location);
    if (index > -1) {
        locations.splice(index, 1);
        window.localStorage.setItem('locations', JSON.stringify(locations));
        updateRecentSearches();
    }
}



/**
 * Returns the appropriate icon name based on the weather condition and time of day.
 *
 * @param {Object} weatherCondition - The weather condition object.
 * @param {number} dt - The current timestamp in seconds.
 * @param {number} sunrise - The sunrise timestamp in seconds.
 * @param {number} sunset - The sunset timestamp in seconds.
 * @returns {string} The name of the icon representing the weather condition.
 */
const getIconName = (weatherCondition, dt, sunrise, sunset) => {
    const nextDaySunrise = dayjs.unix(sunrise).add(1, 'day');
    const dtDayjs = dayjs.unix(dt);
    const sunsetDayjs = dayjs.unix(sunset);
    const nextDaySunset = sunsetDayjs.add(1, 'day');
    switch (weatherCondition.main) {
        case 'Clear':
            if ((dtDayjs.isBefore(sunsetDayjs)) || (dtDayjs.isAfter(nextDaySunrise) && dtDayjs.isBefore(nextDaySunset))) {
                return 'clear-day';
            } else {
                return 'clear-night';
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
                    if ((dtDayjs.isBefore(sunsetDayjs)) || (dtDayjs.isAfter(nextDaySunrise) && dtDayjs.isBefore(nextDaySunset))) {
                        return 'scattered-clouds-day';
                    } else {
                        return 'scattered-clouds-night';
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
const overlay = $('.overlay');
var editing = false;
var value = '';

// handle the submit event on the form element
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
            const locationName = `${coordinates.name}, ${coordinates.country}`;
            input.val(locationName);
            updateLocations(locationName);
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
    value = input.val();
    console.log('executing focus editing is ' + editing);
    editing = true;
    overlay.fadeIn('fast');
    overlay.addClass('visible');
    $('#location-icon').css('display', 'none');
    $('#clear-icon').css('display', 'block');
    $('.location-history').slideDown({
        duration: 200,
    });
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
        $('.location-history').scrollTop(0);
        $('.location-history').slideUp({
            duration: 200,
        });
        if (input.val() === '') {
            console.log('setting name from blur');
            input.val(value);
        }
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


// fetch location according to user position and show results
$('#location-icon').on('click', (e) => {
    e.preventDefault();
    $('#location-icon').css('display', 'none');
    $('#spinner-icon').css('display', 'block');
    navigator.geolocation.getCurrentPosition(async (position) => {
        $('.search-wrapper').addClass('chosen');
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const name = await fetchLocationName(lat, lon);
        updateLocations(name);
        const weatherData = await fetchWeatherData(lat, lon);
        renderWeatherData(weatherData);
        console.log('setting name from location icon: ' + name);
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


const showDialog = (id) => {
    if (id === 'usage') {
        const usageDialog = document.getElementById('usage-dialog');
        if (usageDialog) {
            usageDialog.showModal();
        }
    } else {
        const aboutDialog = document.getElementById('about-dialog');
        if (aboutDialog) {
            aboutDialog.showModal();
        }
    }
}
const closeDialogs = () => {
    const usageDialog = document.getElementById('usage-dialog');
    const aboutDialog = document.getElementById('about-dialog');
    usageDialog.close();
    aboutDialog.close();
}
$('.icon-wrapper').on('click', () => {
    closeDialogs();
});

$(document).on('keypress', (e) => {
    if (e.key === 'Enter') {
        closeDialogs();
    }
});


window.addEventListener('click', (e) => {
    const usageDialog = document.getElementById('usage-dialog');
    const aboutDialog = document.getElementById('about-dialog');
    if ((usageDialog && usageDialog.open && e.target === usageDialog) ||
        (aboutDialog && aboutDialog.open && e.target === aboutDialog)) {
        closeDialogs();
    }
});


$('.action').on('click', (e) => {
    showDialog(e.target.id);
});


// IIFE to fetch data from the searchparameters
(() => {
    getResults();
    updateRecentSearches();
})();

// fetch results when user navigates in browser history
window.addEventListener('popstate', () => {
    getResults();
});