// config.js
const Config = {
    apiKeys: {
        openTripMap: '5ae2e3f221c38a28845f05b6bb142d31dc50a82823a0d9578bdd5f4f',
        google: 'AIzaSyCS8gebxgM-srFi2R1eXNCrsuSjxY_pu74',
        openWeather: '530f6ff5d55eae6146b1c4308af5b6a3'
    },
    apiEndpoints: {
        openTripMap: 'https://api.opentripmap.com/0.1/en/places',
        openWeather: 'https://api.openweathermap.org/data/2.5',
        google: 'https://maps.googleapis.com/maps/api'
    },
    baseUrl: 'https://eso.vse.cz/~your-username/sp2'
};

// API endpoints configuration
export const API_ENDPOINTS = {
    login: '/auth/login',
    register: '/auth/register',
    trips: '/trips',
    places: '/places',
    weather: '/weather',
    recommendations: '/recommendations'
};
export default Config;