// global variables
const App = {
    routes: JSON.parse(localStorage.getItem("routes")) || {},
    weatherDataCache:
        JSON.parse(localStorage.getItem("weatherDataCache")) || {},
    currentRouteId: null,
    routeListElement: document.querySelector(".route-list"),
    locationInputElement: document.getElementById("location"),
    arrivalDateElement: document.getElementById("arrival"),
    departureDateElement: document.getElementById("departure"),
    routeInfoElement: document.querySelector(".route-info"),
    map: L.map("map").setView([50.082, 14.42651], 13),
    resultsContainerElement: document.querySelector(".results-container"),
    browserLat: null,
    browserLon: null,
    reloadButton: document.querySelector(".reload-button"),
};

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        App.browserLat = position.coords.latitude;
        App.browserLon = position.coords.longitude;
        console.log(
            `Latitude: ${App.browserLat}, Longitude: ${App.browserLon}`
        );
    });
} else {
    console.log("Geolocation is not supported by this browser.");
}

function initializeRoutePlanner() {
    const addRouteButton = document.querySelector(".add-route-button");
    const addButton = document.querySelector(".add-route-segment-button");

    // clickable date inputs
    flatpickr(App.arrivalDateElement, {
        enableTime: false,
        dateFormat: "D, j M Y",
    });
    flatpickr(App.departureDateElement, {
        enableTime: false,
        dateFormat: "D, j M Y",
    });

    // add new route to route list using button
    addRouteButton.addEventListener("click", () => {
        const routeId = `route${Object.keys(App.routes).length + 1}`;
        const newRoute = document.createElement("div");
        newRoute.className = "route";

        const routeName = document.createElement("div");
        routeName.className = "route-name";

        routeName.textContent = `Route ${Object.keys(App.routes).length + 1}`;

        const removeButton = document.createElement("div");
        removeButton.className = "route-remove";
        removeButton.innerHTML = `
            <i class="fa fa-times"></i>
        `;
        newRoute.appendChild(routeName);
        newRoute.appendChild(removeButton);
        App.routeListElement.appendChild(newRoute);

        // save route to the variable
        App.routes[routeId] = {
            name: routeName.textContent,
            cities: [],
        };

        // add click functionality to the route, save to storage
        setupRouteHandlers(newRoute, routeId);
        saveRoutes();
    });

    // add city to current route
    addButton.addEventListener("click", () => {
        if (!App.currentRouteId) {
            alert("Please select a route first");
            return;
        }

        const location = App.locationInputElement.value;
        const arrival = App.arrivalDateElement.value;
        const departure = App.departureDateElement.value;
        const locationLat = App.locationInputElement.dataset.lat;
        const locationLon = App.locationInputElement.dataset.lon;

        if (!location | !arrival | !departure) {
            alert("Please fill in all fields");
            return;
        }
        const arrivalDate = new Date(arrival);
        const departureDate = new Date(departure);
        console.log(arrivalDate);
        console.log(departureDate);
        if (arrivalDate >= departureDate) {
            alert("The arrival date must be before the departure date");
            return;
        }

        addCityToRoute(App.currentRouteId, {
            location,
            arrival,
            departure,
            locationLat,
            locationLon,
        });

        // clear inputs after adding
        App.locationInputElement.value = "";
        App.arrivalDateElement.value = "";
        App.departureDateElement.value = "";
        App.locationInputElement.dataset.lat = null;
        App.locationInputElement.dataset.lon = null;
    });

    App.reloadButton.addEventListener("click", () => {
        console.log("test");
        App.map.setView([App.browserLat, App.browserLon], 13);
    });
}
// initialize the application
document.addEventListener("DOMContentLoaded", () => {
    initializeRoutePlanner();
    loadRoutes();
});

// function to save routes into local storage
function saveRoutes() {
    localStorage.setItem("routes", JSON.stringify(App.routes));
}

function loadRoutes() {
    if (App.routes) {
        // Recreate route elements
        const addRouteButton = document.querySelector(".add-route-button");
        const fragment = document.createDocumentFragment();

        Object.entries(App.routes).forEach(([routeId, routeData]) => {
            const newRoute = document.createElement("div");
            newRoute.className = "route";

            const routeName = document.createElement("div");
            routeName.className = "route-name";
            routeName.textContent = routeData.name;

            const removeButton = document.createElement("div");
            removeButton.className = "route-remove";
            removeButton.innerHTML = `
                <i class="fa fa-times"></i>
            `;
            newRoute.appendChild(routeName);
            newRoute.appendChild(removeButton);

            fragment.appendChild(newRoute);
            setupRouteHandlers(newRoute, routeId);
        });
        App.routeListElement.appendChild(fragment);
    }
}

// setup route menu functionality
function setupRouteHandlers(routeElement, routeId) {
    const routeName = routeElement.querySelector(".route-name");
    const removeButton = routeElement.querySelector(".route-remove");

    // route name editable on double click
    routeName.addEventListener("dblclick", () => {
        routeName.setAttribute("contenteditable", "true");
        routeName.focus();
    });

    // after leaving the textbox, save
    routeName.addEventListener("blur", () => {
        routeName.setAttribute("contenteditable", "false");
        App.routes[routeId].name = routeName.textContent;
        saveRoutes();
    });

    // remove route button
    removeButton.addEventListener("click", () => {
        routeElement.remove();
        delete App.routes[routeId];
        if (App.currentRouteId === routeId) {
            App.currentRouteId = null;
            clearRouteDisplay();
        }
        saveRoutes();
    });

    // select route, deselect other route
    routeElement.addEventListener("click", (e) => {
        // check if the target is or its parents are remove button
        // fixes issue with target being the icon
        if (!e.target.closest(".route-remove")) {
            App.currentRouteId = routeId;

            displayRouteData(routeId);
            document
                .querySelectorAll(".route")
                .forEach((r) => r.classList.remove("active"));
            routeElement.classList.add("active");
        }
    });
}

// display route data section
async function displayRouteData(routeId) {
    App.routeInfoElement.innerHTML = "";
    clearRouteDisplay();

    for (const [index, locationData] of App.routes[routeId].cities.entries()) {
        const segment = await createRouteSegment(locationData, index);
        App.routeInfoElement.appendChild(segment);

        // second part, get weather data
        const weatherInfo = segment.querySelector(".weather-info");

        const spinner = document.createElement("div");
        spinner.className = "spinner";
        spinner.innerHTML = `
            <div class="spinner-ring">
                <div></div><div></div><div></div><div></div>
            </div>
        `;
        weatherInfo.appendChild(spinner);

        try {
            const weatherData = await getWeatherData(locationData);
            // remove spinner after data is available
            weatherInfo.removeChild(spinner);

            weatherData.forEach((day) => {
                const weatherDay = document.createElement("div");
                weatherDay.className = "weather-day";
                // select icon to display based on simple conditions
                let icon =
                    day.weatherData.cloud_cover.afternoon <= 30
                        ? "sun"
                        : (day.weatherData.cloud_cover.afternoon > 30) &
                          (day.weatherData.precipitation > 1) &
                          (day.weatherData.temperature.afternoon < 2)
                        ? "snowflake"
                        : (day.weatherData.cloud_cover.afternoon > 30) &
                          (day.weatherData.precipitation > 1) &
                          (day.weatherData.temperature.afternoon >= 2)
                        ? "cloud-showers-heavy"
                        : "cloud";

                weatherDay.innerHTML = `
                    <div class="icon ${icon}-color">
                        <i class="fas fa-${icon}"></i>
                    </div>
                    <div class="weather-date">${formatWeatherDate(
                        day.date
                    )}</div>
                    <div class="temperature">${Math.round(
                        day.weatherData.temperature.afternoon
                    )}°C</div>
                `;
                weatherInfo.appendChild(weatherDay);
            });
        } catch (error) {
            console.error(error);
        }

        L.marker([locationData.locationLat, locationData.locationLon])
            .addTo(App.map)
            .bindPopup(locationData.location);
    }
}

// add city to route and update display
async function addCityToRoute(routeId, locationData) {
    let data; // Declare data outside the try block
    if (!locationData.locationLat || !locationData.locationLon) {
        q = locationData.location;
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&accept-language=en&q=${encodeURIComponent(
                    q
                )}&limit=5`
            );
            data = await response.json();
        } catch (error) {
            console.error(error);
        }
        const closestResult = await data[0];
        locationData.locationLat = closestResult.lat;
        locationData.locationLon = closestResult.lon;
    }

    // add marker to map
    L.marker([locationData.locationLat, locationData.locationLon])
        .addTo(App.map)
        .bindPopup(locationData.location);

    App.routes[routeId].cities.push(locationData);
    saveRoutes();
    displayRouteData(routeId);
}

// create a route segment - has dates and weather data
async function createRouteSegment(locationData, index) {
    const segment = document.createElement("div");
    segment.className = "route-segment";

    // first part of segment - name and dates
    segment.innerHTML = `
        <div class="remove-segment">
                    <i class="fa fa-times"></i>
        </div>
        <div class="location-data">
            <div class="segment-header">
                <div class="location-name">${locationData.location}</div>
                
            </div>
            <div class="segment-date-container">
                <span class="arrival-date">
                ${formatDate(locationData.arrival)}
                </span>
                <span class="departure-date">
                ${formatDate(locationData.departure)}
                </span>
            </div>
        </div>
        <div class="weather-info"></div>
    `;

    // add click listener to remove the segment
    const removeButton = segment.querySelector(".remove-segment");
    removeButton.addEventListener("click", () => {
        // remove the city from route
        App.routes[App.currentRouteId].cities.splice(index, 1);

        // save updated routes
        saveRoutes();

        // refresh the display of current route
        displayRouteData(App.currentRouteId);

        // remove marker
        App.map.eachLayer((layer) => {
            if (
                layer instanceof L.Marker &&
                layer.getLatLng().lat ===
                    parseFloat(locationData.locationLat) &&
                layer.getLatLng().lng === parseFloat(locationData.locationLon)
            ) {
                App.map.removeLayer(layer);
            }
        });
    });

    return segment;
}

// clear the route display
function clearRouteDisplay() {
    App.routeInfoElement.innerHTML = "";

    // clear all map markers
    App.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            App.map.removeLayer(layer);
        }
    });
}

// format date for route segment display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
// functionality for geolocation and search suggestions
let timeoutId;

async function searchLocation(query) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&accept-language=en&q=${encodeURIComponent(
                query
            )}&limit=5`
        );
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error(error);
    }
}

// search suggestions on change of input
App.locationInputElement.addEventListener("input", function () {
    clearTimeout(timeoutId);
    const query = this.value;

    // at least 3 letters needed to display value
    if (query.length < 3) {
        App.resultsContainerElement.style.display = "none";
        return;
    }
    // run after 200ms delay
    timeoutId = setTimeout(() => {
        searchLocation(query);
    }, 200);
});

// display location search suggestions
function displayResults(results) {
    App.resultsContainerElement.innerHTML = "";

    if (results.length > 0) {
        results.forEach((result) => {
            const div = document.createElement("div");
            div.className = "location-result";
            div.textContent = result.display_name;

            div.addEventListener("click", () => {
                App.locationInputElement.value = formatLocation(result);
                App.locationInputElement.dataset.lat = result.lat;
                App.locationInputElement.dataset.lon = result.lon;
                console.log(result.lat);
                console.log(result.lon);
                App.resultsContainerElement.style.display = "none";
            });

            App.resultsContainerElement.appendChild(div);
        });
        App.resultsContainerElement.style.display = "block";
    } else {
        App.resultsContainerElement.style.display = "none";
    }
}

function formatLocation(result) {
    const parts = result.display_name.split(", ");

    // return only city and country to avoid long name
    if (parts.length >= 2) {
        return `${parts[0]}, ${parts[parts.length - 1]}`;
    }
    return result.display_name;
}

// close the search results when clicking outside
document.addEventListener("click", function (e) {
    if (
        !App.resultsContainerElement.contains(e.target) &&
        e.target !== App.locationInputElement
    ) {
        App.resultsContainerElement.style.display = "none";
    }
});
// get weather data, either from localStorage cache or
// send the request
async function getWeatherData(locationData) {
    const daysData = [];
    let startDate = new Date(locationData.arrival);
    const endDate = new Date(locationData.departure);
    const targetLat = locationData.locationLat;
    const targetLon = locationData.locationLon;
    const locationName = locationData.location;
    // to fix timezone issue when converting to ISO format
    startDate.setHours(12, 0, 0, 0);
    endDate.setHours(12, 0, 0, 0);

    const differenceInMilliseconds = endDate - startDate;
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    if (differenceInDays <= 10) {
        while (startDate <= endDate) {
            try {
                const dateStr = startDate.toISOString().split("T")[0];

                // get data from cache, return null if it doesnt exist
                let dayWeatherData =
                    App.weatherDataCache[locationName]?.[dateStr] ?? null;

                if (dayWeatherData === null) {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${targetLat}&lon=${targetLon}&date=${dateStr}&appid=e5b10427ec6e0b999e954d28cdd49862&units=metric`
                    );
                    dayWeatherData = await response.json();

                    if (!App.weatherDataCache[locationName]) {
                        App.weatherDataCache[locationName] = {};
                    }
                    App.weatherDataCache[locationName][dateStr] =
                        dayWeatherData;
                    // save data to cache
                    localStorage.setItem(
                        "weatherDataCache",
                        JSON.stringify(App.weatherDataCache)
                    );
                }

                daysData.push({
                    date: new Date(startDate),
                    weatherData: dayWeatherData,
                });
            } catch (error) {
                console.log(error);
            }
            // increment date by 1
            startDate.setDate(startDate.getDate() + 1);
        }
    } else {
        const arr = [startDate, endDate];
        for (const date of arr) {
            try {
                const dateStr = date.toISOString().split("T")[0];

                // get data from cache, return null if it doesnt exist
                let dayWeatherData =
                    App.weatherDataCache[locationName]?.[dateStr] ?? null;

                if (dayWeatherData === null) {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${targetLat}&lon=${targetLon}&date=${dateStr}&appid=e5b10427ec6e0b999e954d28cdd49862&units=metric`
                    );
                    dayWeatherData = await response.json();

                    if (!App.weatherDataCache[locationName]) {
                        App.weatherDataCache[locationName] = {};
                    }
                    App.weatherDataCache[locationName][dateStr] =
                        dayWeatherData;
                    // save data to cache
                    localStorage.setItem(
                        "weatherDataCache",
                        JSON.stringify(App.weatherDataCache)
                    );
                }

                daysData.push({
                    date: new Date(date),
                    weatherData: dayWeatherData,
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    return daysData;
}
// function to format date for weather
function formatWeatherDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
}

// ### Map functionality
//initialize the map and map tiles

L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
        maxZoom: 20,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }
).addTo(App.map);
// implement clickable functionality on map

App.map.on("click", async function (e) {
    if (!App.currentRouteId) {
        alert("Please select a route first");
        return;
    }

    try {
        // set cursor to loading icon
        document.body.style.cursor = "wait";
        App.map.getContainer().style.cursor = "wait";

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&accept-language=en&addressdetails=1&zoom=10`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.address) {
            const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.municipality ||
                data.address.suburb;
            const country = data.address.country;

            if (city && country) {
                const locationName = `${city}, ${country}`;
                App.locationInputElement.value = locationName;
                App.locationInputElement.dataset.lat = e.latlng.lat;
                App.locationInputElement.dataset.lon = e.latlng.lng;

                if (window.currentMarker) {
                    App.map.removeLayer(window.currentMarker);
                }
                window.currentMarker = L.marker(e.latlng)
                    .addTo(App.map)
                    .bindPopup(locationName)
                    .openPopup();

                App.arrivalDateElement.focus();
            } else {
                alert("No city found, try clicking closer to a city.");
            }
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        // remove loading cursor
        document.body.style.cursor = "default";
        App.map.getContainer().style.cursor = "pointer";
    }
});
