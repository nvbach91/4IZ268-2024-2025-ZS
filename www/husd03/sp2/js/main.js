const apiKey = '056ff1984d25f1a99e505722ede9a1ef';
document.addEventListener('DOMContentLoaded', () => {
    changeBackground('Clear');
});


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

function displayWeather(data) {
    const cityWeather = `
        <div class="weather-card">
            <h3>${data.name}</h3>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Feels Like: ${data.main.feels_like}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed} m/s</p>
        </div>`;
    $('#weather-container').html(cityWeather); 
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
let forecastChartInstance = null; 

function displayForecastChart(data) {
    const labels = data.list.map(item => moment(item.dt_txt).format('HH:mm'));
    const temperatures = data.list.map(item => item.main.temp);

    const ctx = document.getElementById('forecastChart').getContext('2d');

    if (forecastChartInstance) {
        forecastChartInstance.destroy();
    }

    forecastChartInstance = new Chart(ctx, {
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

    document.getElementById('forecastChart').style.background = 'white';
}

function hideForecastChart() {
    document.getElementById('forecastChart').style.background = 'transparent'; // Nastavení průhledného pozadí
}


function changeBackground(weatherMain) {
    const weatherBackgrounds = {
        Clear: './image/clear.jpg', 
        Clouds: './image/clouds.jpg', 
        Rain: './image/rain.jpg', 
        Snow: './image/snow.jpg', 
        Thunderstorm: './image/thunderstorm.jpg', 
        Drizzle: './image/drizzle.jpg', 
        Mist: './image/mist.jpg', 
    };

    const background = weatherBackgrounds[weatherMain] || weatherBackgrounds.Clear;

    document.body.style.backgroundImage = `url(${background})`;
    document.body.style.backgroundSize = 'cover'; 
    document.body.style.backgroundRepeat = 'no-repeat'; 
    document.body.style.backgroundPosition = 'center'; 
    document.body.style.height = '100vh'; 
    document.body.style.margin = '0'; 
    document.body.style.overflow = 'hidden'; 
}

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