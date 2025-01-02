const apiKey = '056ff1984d25f1a99e505722ede9a1ef';

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`City not found: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            changeBackground(data.weather[0].main);
            fetchForecast(city);
        })
        .catch(error => {
            alert(error.message);
        });
}

// Get weather by geolocation
function fetchWeatherByLocation(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Unable to fetch weather: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            changeBackground(data.weather[0].main);
            fetchForecastByLocation(lat, lon);
        })
        .catch(error => {
            alert(error.message);
        });
}

// Display weather data
function displayWeather(data) {
    const cityWeather = `
        <div class="weather-card">
            <h3>${data.name}</h3>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Feels Like: ${data.main.feels_like}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed} m/s</p>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        </div>`;
    $('#weather-container').html(cityWeather); // Replace content to show only one result
}
function fetchForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Unable to fetch forecast: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayForecastChart(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
        });
}

function fetchForecastByLocation(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Unable to fetch forecast: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayForecastChart(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
        });
}
function displayForecastChart(data) {
    const labels = data.list.map(item => moment(item.dt_txt).format('MMM D, hA'));
    const temperatures = data.list.map(item => item.main.temp);

    const ctx = document.getElementById('forecastChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}


// Change background based on weather
function changeBackground(weatherMain) {
    const weatherBackgrounds = {
        Clear: 'url(https://upload.wikimedia.org/wikipedia/commons/0/07/Clear_Sky.jpg)',
        Clouds: 'url(https://t3.ftcdn.net/jpg/03/02/03/70/360_F_302037028_WgdzBqp7MCTF0iITajUUVryCKJsyjOE6.jpg)',
        Rain: 'url(https://static.wikia.nocookie.net/dotw/images/1/14/Rain.jpg/revision/latest/scale-to-width-down/1000?cb=20140506044435)',
        Snow: 'url(https://wallpapers.com/images/hd/snowing-background-9niw1aqyiqkifd8u.jpg)',
        Thunderstorm: 'url(https://media.13newsnow.com/assets/WVEC/images/e23dc125-7f4c-4783-8b28-925ec0d61d6f/e23dc125-7f4c-4783-8b28-925ec0d61d6f_750x422.jpg)',
        Drizzle: 'url(https://www.fastweather.com/images/education/drizzle.jpg)',
        Mist: 'url(https://images.unsplash.com/photo-1542826522-beb53da5f648?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1pc3R8ZW58MHx8MHx8fDA%3D)',
    };

    const background = weatherBackgrounds[weatherMain] || 'url(default-weather.jpg)';
    document.body.style.backgroundImage = background;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
    document.body.style.height = '100vh';
document.body.style.margin = '0';
}

// Get geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            fetchWeatherByLocation(position.coords.latitude, position.coords.longitude);
        }, error => {
            alert('Error fetching geolocation: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by your browser!');
    }
}

// Event listeners
$(document).ready(function() {
    $('#search-btn').on('click', function() {
        const city = $('#city-input').val();
        if (city) fetchWeather(city);
    });
    $('#city-input').on('keypress', function(e) {
        if (e.key === 'Enter') {
            const city = $('#city-input').val();
            if (city) fetchWeather(city);
        }
    });
    $('#geo-btn').on('click', function() {
        getLocation();
    });
});