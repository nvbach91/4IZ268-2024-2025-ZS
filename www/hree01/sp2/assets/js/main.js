const API_KEY = '74754122ffc5f46b002b77b51946771a';
const BASE_API_URL = 'https://api.openweathermap.org';

function getWeather(city) {
    const url = `${BASE_API_URL}/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=cs`;

    $.get(url, function(data) {
        displayWeather(data);
    }).fail(function() {
        alert('Chyba při získávání dat o počasí');
    });
}