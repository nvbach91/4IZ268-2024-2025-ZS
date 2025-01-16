const API_KEY = '9202d14af4a6eb24073e146f205c50d6';
const BASE_URL_DATA = 'https://api.openweathermap.org/data/3.0/onecall?';
const BASE_URL_GEO_DIRECT = 'https://api.openweathermap.org/geo/1.0/direct?';
const BASE_URL_GEO_REVERSE = 'https://api.openweathermap.org/geo/1.0/reverse?';

// wrapper elements
const loaderWrapper = $('.loader-wrapper');
const dailyDetailWrapper = $('.daily-detail-wrapper');
const currentWrapper = $('.current-wrapper');
const hourlyWrapper = $('.hourly-wrapper');
const dailyWrapper = $('.daily-wrapper');
const currentConditionsWrapper = $('.current-conditions-wrapper');



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
 * @returns {Promise<Object|Error>} The weather data for the location or an error if the request fails.
 */
const fetchWeatherData = async (lat, lon) => {
    const url = constructUrl(BASE_URL_DATA, `lat=${lat}&lon=${lon}&units=metric&exclude=minutely`);
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error: Please check you internet connection.');
        } else {
            throw error;
        }
    }
}


/**
 * Fetches coordinates for the given location name.
 * @param {string} location - The name of the location.
 * @returns {Promise<Object|Error>} The coordinates of the location or an error if not found.
 */
const fetchCoordinates = async (location) => {
    const url = constructUrl(BASE_URL_GEO_DIRECT, `q=${location}&limit=3`);
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('Failed to fetch coordinates');
        }
        const data = await res.json();
        if (data.length === 0) {
            throw new Error('Location not found');
        }
        return data[0];
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error: Please check your internet connection.');
        } else {
            throw error;
        }
    }
}


/**
 * Fetches the location name based on latitude and longitude coordinates.
 *
 * @param {number} lat - The latitude coordinate.
 * @param {number} lon - The longitude coordinate.
 * @returns {Promise<string|Error>} A promise that resolves to a string containing the location name and country, or an error if the request fails.
 */
const fetchLocationName = async (lat, lon) => {
    const url = constructUrl(BASE_URL_GEO_REVERSE, `lat=${lat}&lon=${lon}&limit=1`);
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch location name');
    }
    const data = await res.json();
    if (data.length === 0) {
        throw new Error('Location not found');
    }
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
        <div class="daily">${renderDailyContent(data.daily, data.lat, data.lon)}</div>
    `;
    const currentConditionsHtml = `
        <h3>Current conditions</h3>
        <div class="current-conditions">
                    <div class="condition humidity">
                        <h4>Wind</h4>
                        <span class="icon">
                            <i class="fa-solid fa-location-arrow fa-rotate-by fa-4x"
                                style="color: #2563d6; --fa-rotate-angle: ${data.current.wind_deg - 45}deg;"></i>
                        </span>
                        <div class="condition-value">
                            <div class="start">
                                <div class="big">${data.current.wind_speed.toFixed(1)}</div>
                                <span>km/h</span>
                            </div>
                            <div class="end">
                                ${renderWindDirection(data.current.wind_deg)}
                            </div>
                        </div>
                    </div>
                    <div class="condition sun">
                        <div class="appart">
                            <h4>Sun</h4>
                            <div class="sun-movement">
                                <canvas id="canvas"></canvas>
                            </div>
                        </div>
                        <div class="condition-value">
                            <div class="start">
                                <div class="medium">${getDateTime(data.current.sunrise, data.timezone).time}</div>
                                <span>Sunrise</span>
                            </div>
                            <div class="end">
                                <div class="medium">${getDateTime(data.current.sunset, data.timezone).time}</div>
                                <span>Sunset</span>
                            </div>
                        </div>
                    </div>
                    <div class="condition humidity">
                        <h4>Humidity</h4>
                        <span class="icon">
                            <img src="images/weather/humidity.svg" alt="Humidity Icon">
                        </span>
                        <div class="condition-value">
                            <div class="humidity-value">
                                <span class="big">${data.current.humidity}</span>
                                <span class="unit">%</span>
                            </div>
                        </div>
                    </div>
                    <div class="condition humidity">
                        <h4>Pressure</h4>
                        <span class="icon">
                            <img src="images/weather/atmospheric-pressure.png" alt="Pressure Icon" width="70">
                        </span>
                        <div class="condition-value">
                            <div class="humidity-value">
                                <div class="big">${data.current.pressure}</div>
                                <span class="unit">hPa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;

    dailyDetailWrapper.empty();
    currentWrapper.empty().append(currentHtml);
    hourlyWrapper.empty().append(hourlyHtml);
    dailyWrapper.empty().append(dailyHtml);
    currentConditionsWrapper.empty().append(currentConditionsHtml);
    drawSunArc(getDateTime(data.current.sunrise, data.timezone).time, getDateTime(data.current.sunset, data.timezone).time, getDateTime(data.current.dt, data.timezone).time)
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
const renderDailyContent = (dailyData, lat, lon) => {
    let html = ``;
    dailyData.forEach((day, index) => {
        const dateTime = getDateTime(day.dt);
        const dayHtml = `
            <div class="daily-box" onclick="renderDayDetail(${index}, '${lat}', '${lon}')">
                <div class="date">${index === 0 ? 'Today' : dateTime.weekDay} ${dateTime.dayOfMonth} ${dateTime.month}</div>
                <div class="weather-info">
                    <div class="img-wrapper">
                        <img width="40" src="./images/weather/${getIconName(day.weather[0], day.dt, day.sunrise, day.sunset)}.png" alt="">
                    </div>
                    <p class="min-max-temp">${Math.round(day.temp.day)}°<span class="night-temp">/</span><span class="night-temp">${Math.round(day.temp.night)}°</span></p>
                </div>
            </div>
        `;
        html += dayHtml;
    })
    return html;
}

/**
 * Renders the detailed weather information for a specific day.
 *
 * @param {number} index - The index of the day in the weather data.
 * @param {number} lat - The latitude of the location.
 * @param {number} lon - The longitude of the location.
 * @param {Object} [weatherData] - The weather data object. If not provided, it will be fetched using the latitude and longitude.
 */
const renderDayDetail = async (index, lat, lon, weatherData) => {
    let data;
    if (!weatherData) {
        addLoadingUi();
        try {
            data = await fetchWeatherData(lat, lon);
        } catch (error) {
            toastError(error.message);
        } finally {
            removeLoadingUi();
        }
    } else {
        data = weatherData;
    }
    const day = data.daily[index];
    const dateTime = getDateTime(day.dt, data.timezone);
    addDayDetailToSearchParams(index);
    const html = `
        <a class="back-wrapper">
            <i class="fa-solid fa-chevron-left fa-lg" style="color: black"></i>
            <span>Back to forecast</span>
        </a>
        <div class="days">
            ${renderDays(data, index)}
        </div>
        <div class="detail">
            <div class="date">${index === 0 ? 'Today' : dateTime.weekDay} ${dateTime.dayOfMonth} ${dateTime.month}</div>
            <div class="xl temperature">
                <span>${day.temp.day.toFixed()}<span class="current-unit">°</span><span class="night-temp"><span
                            class="slash standard">/ </span>${day.temp.min.toFixed()}<span class="current-unit">°</span></span></span>
                <img src="./images/weather/${getIconName(day.weather[0], day.dt, day.sunrise, day.sunset)}.png" alt="weather icon" width="100">
            </div>
            <div class="description">${day.summary}</div>
        </div>
        <h3>Daily conditions</h3>
        <div class="current-conditions">
            <div class="condition humidity">
                <h4>Wind</h4>
                <span class="icon">
                    <i class="fa-solid fa-location-arrow fa-rotate-by fa-4x"
                        style="color: #2563d6; --fa-rotate-angle: ${day.wind_deg - 45}deg;"></i>
                </span>
                <div class="condition-value">
                    <div class="start">
                        <div class="big">${day.wind_speed.toFixed(1)}</div>
                        <span>km/h</span>
                    </div>
                    <div class="end">
                        ${renderWindDirection(day.wind_deg)}
                    </div>
                </div>
            </div>
            <div class="condition sun">
                <div class="appart">
                    <h4>Sun</h4>
                </div>
                <div class="left">
                    <div class="sun-value">
                        <div class="start">
                            <div class="big">${getDateTime(day.sunrise, data.timezone).time}</div>
                            <span>Sunrise</span>
                        </div>
                        <img src="./images/weather/sunrise.png" alt="Sunrise icon" width="50">
                    </div>
                    <div class="sun-value">
                        <div class="start">
                            <div class="big">${getDateTime(day.sunset, data.timezone).time}</div>
                            <span>Sunset</span>
                        </div>
                        <img src="./images/weather/sunset.png" alt="Sunset icon" width="50">
                    </div>
                </div>
            </div>
            <div class="condition humidity">
                <h4>Humidity</h4>
                <span class="icon">
                    <img src="images/weather/humidity.svg" alt="Humidity Icon">
                </span>
                <div class="condition-value">
                    <div class="humidity-value">
                        <span class="big">${day.humidity}</span>
                        <span class="unit">%</span>
                    </div>
                </div>
            </div>
            <div class="condition humidity">
                <h4>Pressure</h4>
                <span class="icon">
                    <img src="images/weather/atmospheric-pressure.png" alt="Pressure Icon" width="70">
                </span>
                <div class="condition-value">
                    <div class="humidity-value">
                        <div class="big">${day.pressure}</div>
                        <span class="unit">hPa</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    currentWrapper.empty();
    hourlyWrapper.empty();
    dailyWrapper.empty();
    currentConditionsWrapper.empty();
    dailyDetailWrapper.empty().append(html);
    focusActiveDay();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('.back-wrapper').on('click', () => backToForecast());
}



/**
 * Renders the HTML for the days in day detail view
 *
 * @param {Object} data - The weather data object.
 * @param {number} indexActive - The index of the currently active day.
 * @returns {string} The HTML string representing the daily weather forecast.
 */
const renderDays = (data, indexActive) => {
    let html = ``;
    data.daily.forEach((day, index) => {
        const dateTime = getDateTime(day.dt);
        const dayHtml = `
            <div class="hour-box day ${indexActive === index ? 'active' : ''}" onclick="selectDay(${index}, ${data.lat}, ${data.lon})">
                <p class="time">${index === 0 ? 'Today' : dateTime.weekDay.slice(0, 3)}</p>
                <div class="img-wrapper">
                    <img width="50" src="./images/weather/${getIconName(day.weather[0], day.dt, day.sunrise, day.sunset)}.png" alt="">
                </div>
                <p class="min-max-temp">${Math.floor(day.temp.day)}°<span class="night-temp">/</span><span class="night-temp">${Math.floor(day.temp.min)}°</span>
                </p>
            </div>
        `;
        html += dayHtml;
    })
    return html;
}

/**
 * Renders the wind direction based on the given wind degrees.
 *
 * @param {number} windDegrees - The wind direction in degrees.
 * @returns {string} The HTML string representing the wind direction.
 */
const renderWindDirection = (windDegrees) => {
    const { directionAbbreviation, fullAbbreviationName } = getWindDirection(windDegrees);
    const html = `
        <div class="big capital">${directionAbbreviation}</div>
        <span class="full">${fullAbbreviationName}</span>
    `;
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
        <p class="title">Recent locations:</p>
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
                    <span id="trash-icon" onclick="removeLocationFromRecentSearches(event, '${location}')">
                        <i class="fa-solid fa-trash fa-xl"></i>
                    </span>
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
        'date': dt.format('YYYY-MM-DD'),
        'weekDay': dt.format('dddd'),
        'dayOfMonth': dt.format('D'),
        'month': dt.format('MMM')
    };
    return dateTime;
}

/**
 * Determines the wind direction based on the given wind degrees.
 *
 * @param {number} windDegrees - The wind direction in degrees (0 to 360).
 * @returns {{directionAbbreviation: string, fullAbbreviationName: string}} An object containing the wind direction abbreviation and its full name.
 */
const getWindDirection = (windDegrees) => {
    let directionAbbreviation;
    let fullAbbreviationName;
    switch (true) {
        case (windDegrees >= 0 && windDegrees < 22.5) || (windDegrees >= 337.5 && windDegrees <= 360):
            directionAbbreviation = 'N';
            fullAbbreviationName = 'North';
            break;
        case (windDegrees >= 22.5 && windDegrees < 67.5):
            directionAbbreviation = 'NE';
            fullAbbreviationName = 'Northeast';
            break;
        case (windDegrees >= 67.5 && windDegrees < 112.5):
            directionAbbreviation = 'E';
            fullAbbreviationName = 'East';
            break;
        case (windDegrees >= 112.5 && windDegrees < 157.5):
            directionAbbreviation = 'SE';
            fullAbbreviationName = 'Southeast';
            break;
        case (windDegrees >= 157.5 && windDegrees < 202.5):
            directionAbbreviation = 'S';
            fullAbbreviationName = 'South';
            break;
        case (windDegrees >= 202.5 && windDegrees < 247.5):
            directionAbbreviation = 'SW';
            fullAbbreviationName = 'Southwest';
            break;
        case (windDegrees >= 247.5 && windDegrees < 292.5):
            directionAbbreviation = 'W';
            fullAbbreviationName = 'West';
            break;
        case (windDegrees >= 292.5 && windDegrees < 337.5):
            directionAbbreviation = 'NW';
            fullAbbreviationName = 'Northwest';
            break;
        default:
            directionAbbreviation = 'N';
            fullAbbreviationName = 'North';
            break;
    }
    return { directionAbbreviation, fullAbbreviationName };
}


/**
 * Updates the URL search parameters to include the specified location.
 * 
 * This function takes a location string, adds it to the current URL's search parameters,
 * and updates the browser's history state with the new URL.
 * 
 * @param {string} location - The location to be added to the URL search parameters.
 */
const addLocationToSearchParams = (location) => {
    const params = new URLSearchParams(window.location.search);
    params.set('location', location);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
}

/**
 * Updates the URL search parameters to include the specified day index.
 * 
 * This function modifies the current URL by adding or updating the 'day' parameter
 * with the provided index value. It uses the History API to update the URL without
 * reloading the page.
 * 
 * @param {number} index - The index of the day to be added to the search parameters.
 */
const addDayDetailToSearchParams = (index) => {
    const params = new URLSearchParams(window.location.search);
    params.set('day', index);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl)
}

/**
 * Removes the 'day' parameter from the URL search parameters.
 * 
 * This function updates the browser's history state to remove the 'day' parameter
 * from the current URL, effectively resetting the day detail view.
 */
const removeDayFromSearchParams = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('day');
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
    const day = params.get('day');
    if (location) {
        addLoadingUi();
        try {
            $('.search-wrapper').addClass('chosen');
            const coordinates = await fetchCoordinates(location);
            // set the the location into the input
            input.val(`${coordinates.name}, ${coordinates.country}`);
            const weatherData = await fetchWeatherData(coordinates.lat, coordinates.lon);
            if (day) {
                renderDayDetail(Number.parseInt(day), coordinates.lat, coordinates.lon, weatherData);
            } else {
                renderWeatherData(weatherData);
            }
        }
        catch (error) {
            toastError(error.message);
        }
        finally {
            removeLoadingUi();
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
    removeDayFromSearchParams();
    getResults();
}


/**
 * Updates the locations by storing the given location in local storage, adding it to the search parameters,
 * and updating the recent searches.
 *
 * @param {string} location - The location to be updated.
 */
const updateLocations = (location) => {
    storeLocation(location);
    addLocationToSearchParams(location);
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
 * Selects a day and renders its details based on the provided day index, latitude, and longitude.
 *
 * @param {number} dayIndex - The index of the day to select.
 * @param {number} lat - The latitude coordinate.
 * @param {number} lon - The longitude coordinate.
 */
const selectDay = (dayIndex, lat, lon) => {
    renderDayDetail(dayIndex, lat, lon);
}

/**
 * Scrolls the active day element into view smoothly.
 * 
 * This function selects the element with the class 'days' and then finds the child element
 * with the class 'active'. If an active day element is found, it scrolls it into view
 * with smooth behavior, aligning it to the nearest block and centering it inline.
 */
const focusActiveDay = () => {
    const days = document.querySelector('.days');
    const activeDay = days.querySelector('.active');
    if (activeDay) {
        activeDay.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        });
    }
}

/**
 * Navigates back to the forecast view by removing the selected day from the search parameters
 * and fetching the updated results.
 */
const backToForecast = () => {
    removeDayFromSearchParams();
    getResults();
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

let loaderTimeout;
const addLoadingUi = () => {
    loaderTimeout = setTimeout(() => {
        const loader = '<div></div>';
        $('.loader-wrapper').slideDown();
        setTimeout(() => {
            $('.loader').addClass('visible');
        }, 300);
    }, 1000);
};

const removeLoadingUi = () => {
    clearTimeout(loaderTimeout);
    $('.loader').removeClass('visible');
    setTimeout(() => {
        $('.loader-wrapper').slideUp();
    }, 500);
};

/**
 * Displays an error toast notification with the specified message.
 *
 * @param {string} message - The message to display in the toast notification.
 * @param {number} duration - The duration for which the toast notification should be displayed, in milliseconds.
 */
const toastError = (message, duration = 2000) => {
    Toastify({
        text: message,
        className: 'error',
        offset: {
            y: 5,
        },
        duration: duration
    }).showToast();
}

const convertToHours = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
}

/**
 * Draws a sun arc on a canvas element representing the sun's position throughout the day.
 *
 * @param {number|string} sunrise - The time of sunrise, either as a number of hours or a string in "HH:MM" format.
 * @param {number|string} sunset - The time of sunset, either as a number of hours or a string in "HH:MM" format.
 * @param {number|string} currentTime - The current time, either as a number of hours or a string in "HH:MM" format.
 */
const drawSunArc = (sunrise, sunset, currentTime) => {
    const ctx = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 300;

    const centerX = canvas.width / 2;
    const centerY = canvas.height;
    const radiusX = 300;
    const radiusY = 230;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, Math.PI, 2 * Math.PI, 0);
    ctx.strokeStyle = '#2563d6';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Convert times to hours if necessary
    sunrise = convertToHours(sunrise);
    sunset = convertToHours(sunset);
    currentTime = convertToHours(currentTime);

    const totalTime = sunset - sunrise;

    const elapsedTime = Math.max(0, Math.min(currentTime - sunrise, totalTime));
    const angle = Math.PI + (elapsedTime / totalTime) * Math.PI;

    const sunX = centerX + radiusX * Math.cos(angle);
    const sunY = centerY + radiusY * Math.sin(angle);

    const sunImage = new Image();
    sunImage.src = './images/weather/clear-day.png';
    sunImage.onload = () => {
        const sunRadius = 120;
        ctx.drawImage(sunImage, sunX - sunRadius, sunY - sunRadius, sunRadius * 2, sunRadius * 2);
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
    const location = input.val();
    removeDayFromSearchParams();
    // try fetching coordinates for the location
    try {
        addLoadingUi();
        const coordinates = await fetchCoordinates(location);
        $('.search-wrapper').addClass('chosen');
        input.trigger('blur');
        const locationName = `${coordinates.name}, ${coordinates.country}`;
        input.val(locationName);
        updateLocations(locationName);
        const weatherData = await fetchWeatherData(coordinates.lat, coordinates.lon);
        renderWeatherData(weatherData);
        editing = false;
    } catch (error) {
        toastError(error.message);
        // set the value of the location back
        input.val(location);
        input.trigger('focus');
    } finally {
        removeLoadingUi();
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
    $('#clear-icon').css('display', 'flex');
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
        $('#location-icon').css('display', 'flex');
        $('#clear-icon').css('display', 'none');
        $('.location-history').scrollTop(0);
        $('.location-history').slideUp({
            duration: 200,
        });
        if (input.val() === '') {
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
    $('#spinner-icon').css('display', 'flex');
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            $('.search-wrapper').addClass('chosen');
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const name = await fetchLocationName(lat, lon);
            $('#spinner-icon').css('display', 'none');
            $('#location-icon').css('display', 'flex');
            updateLocations(name);
            addLoadingUi();
            const weatherData = await fetchWeatherData(lat, lon);
            renderWeatherData(weatherData);
            input.val(name);
        } catch (error) {
            toastError(error.message);
        } finally {
            removeLoadingUi();
        }
        removeDayFromSearchParams();
    }, () => {
        toastError('Unable to retrieve your position');
        $('#spinner-icon').css('display', 'none');
        $('#location-icon').css('display', 'flex');
    }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
});


/**
 * Displays a dialog based on the provided ID.
 *
 * @param {string} id - The ID of the dialog to show. 
 *                       If 'usage', shows the usage dialog. 
 *                       Otherwise, shows the about dialog.
 */
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
/**
 * Closes the usage and about dialogs.
 * This function selects the dialogs by their IDs ('usage-dialog' and 'about-dialog')
 * and calls the close method on each of them to hide the dialogs.
 */
const closeDialogs = () => {
    const dialogs = document.querySelectorAll('#usage-dialog, #about-dialog');
    dialogs.forEach(dialog => dialog.close());
}

// handles click on close icon in dialog, calls function to close dialogs
$('.icon-wrapper').on('click', () => {
    closeDialogs();
});

// close dialog if close icon is focused and the enter key is pressed
$(document).on('keypress', (e) => {
    if (e.key === 'Enter') {
        closeDialogs();
    }
});

// close dialog if the click is outside of it
window.addEventListener('click', (e) => {
    const usageDialog = document.getElementById('usage-dialog');
    const aboutDialog = document.getElementById('about-dialog');
    if ((usageDialog && usageDialog.open && e.target === usageDialog) ||
        (aboutDialog && aboutDialog.open && e.target === aboutDialog)) {
        closeDialogs();
    }
});

// show dialog depending on if the usage or about button is clicked
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