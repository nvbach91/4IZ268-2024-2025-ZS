const API_KEY = '9202d14af4a6eb24073e146f205c50d6';
const BASE_URL_DATA = 'https://api.openweathermap.org/data/3.0/onecall?';
const BASE_URL_GEO = 'https://api.openweathermap.org/geo/1.0/direct?';

const constructUrl = (baseUrl, parameters) => {
    const url = `${baseUrl}${parameters}&appid=${API_KEY}`;
    return url;
}

const fetchWeatherData = async (lat, lon) => {
    const url = constructUrl(BASE_URL_DATA, `lat=${lat}&lon=${lon}&units=metric`);
    const reponse = await fetch(url);
    const data = await reponse.json();
    console.log(data);
    return data;
}

const fetchCoordinates = async (city) => {
    const url = constructUrl(BASE_URL_GEO, `q=${city}&limit=1`);
    const reponse = await fetch(url);
    const data = await reponse.json();
    console.log(data);
    return data;
}

const form = document.querySelector('form');
const searchWrapper = document.querySelector('.search-wrapper');
const input = form.querySelector('input');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    input.blur();
    searchWrapper.classList.add('chosen');
})

// fetchWeatherData('33.44', '-94.04');
// fetchCoordinates('London');