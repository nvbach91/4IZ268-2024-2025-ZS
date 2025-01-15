const API_KEY = '67a94006026279465e11c65e95d8446f';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Počkejte, dokud se dokument plně nenačte
$(document).ready(function () {
    // Kliknutí na tlačítko hledání
    $('#searchBtn').click(fetchWeather);

    // Stisknutí klávesy Enter v poli pro zadání města
    $('#cityInput').keypress(function (e) {
        if (e.which === 13) { //Enter
            fetchWeather();
        }
    });

    // Kliknutí na tlačítko pro získání aktuální polohy
    $('#getLocationBtn').click(getLocation);

    // Event delegace pro změnu jednotek teploty
    $('#weatherCards').on('click', '.unit-btn', function () {
        const $card = $(this).closest('.weather-card');
        const tempCelsius = parseFloat($card.data('temp-celsius'));
        const targetUnit = $(this).data('unit');
        let convertedTemp;
        let unitSymbol = ''; // Inicializace proměnné pro symbol jednotky

        // Převede na správnou jednotku
        if (targetUnit === 'F') {
            // Celsius na Fahrenheit: 
            convertedTemp = (tempCelsius * 9 / 5) + 32;
            unitSymbol = '°F'; // Symbol pro Fahrenheit
        } else if (targetUnit === 'K') {
            // Celsius na Kelvin: 
            convertedTemp = tempCelsius + 273.15;
            unitSymbol = 'K'; 
        } else {
            // Pokud je jednotka Celsia, ponecháme původní hodnotu
            convertedTemp = tempCelsius;
            unitSymbol = '°C'; 
        }

        // Zaokrouhlení na 1 desetinné místo pro správnou prezentaci
        convertedTemp = convertedTemp.toFixed(1);

        // Aktualizace teploty na kartě
        $card.find('.temperature').text(`${convertedTemp}${unitSymbol}`);
    });
});


// Funkce pro získání aktuální polohy a následné získání počasí
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            reverseGeocode(lat, lon); // Zavolání reverzního geokódování s aktuálními souřadnicemi
        }, function (error) {
            $('#errorMsg').text('Chyba při získávání polohy: ' + error.message);
        });
    } else {
        $('#errorMsg').text('Geolokace není podporována tímto prohlížečem.');
    }
}

// Funkce pro reverzní geokódování (získání města z GPS souřadnic)
function reverseGeocode(lat, lon) {
    const reverseGeocodeURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    $.ajax({
        url: reverseGeocodeURL,
        method: 'GET',
        success: function (data) {
            $('#cityInput').val(data.name); // Vyplnění pole městem
            fetchWeather(); // Zavolání funkce pro získání počasí
        },
        error: function () {
            $('#errorMsg').text('Nepodařilo se zjistit město pro dané souřadnice.');
        }
    });
}

// Funkce pro získání dat o počasí
function fetchWeather() {
    const city = $('#cityInput').val().trim();

    // Vymazání předchozí chybové zprávy
    $('#errorMsg').text('');

    if (!city) {
        $('#errorMsg').text('Zadejte prosím název města');
        return;
    }

    // API požadavek
    $.ajax({
        url: API_URL,
        method: 'GET',
        data: {
            q: city,
            appid: API_KEY,
            units: 'metric'
        },
        success: function (data) {
            addWeatherCard(data);
            $('#cityInput').val(''); // Vymazání pole pro zadání
        },
        error: function () {
            $('#errorMsg').text('Město nebylo nalezeno. Zkontrolujte správnost a zkuste to znovu.');
        }
    });
}

// Funkce pro vytvoření a přidání karty s počasím
function addWeatherCard(data) {
    const cardHtml = `
        <div class="col-md-4 mb-4">
            <div class="card weather-card" data-temp-celsius="${data.main.temp}">
                <div class="card-body text-center">
                    <span class="delete-btn" title="Odstranit kartu">&times;</span>
                    <h5 class="card-title">${data.name}, ${data.sys.country}</h5>
                    <div class="temperature">${data.main.temp.toFixed(1)}°C</div>
                    <p class="weather-description">${data.weather[0].description}</p>
                    <div class="details">
                        <p>Vlhkost: ${data.main.humidity}%</p>
                        <p>Vítr: ${data.wind.speed} m/s</p>
                    </div>
                    <div class="unit-buttons mt-3">
                        <button class="btn btn-sm btn-outline-primary unit-btn" data-unit="C">Celsia</button>
                        <button class="btn btn-sm btn-outline-primary unit-btn" data-unit="F">Fahrenheit</button>
                        <button class="btn btn-sm btn-outline-primary unit-btn" data-unit="K">Kelvin</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Přidání nové karty do kontejneru
    $('#weatherCards').prepend(cardHtml);

    // Funkce pro odstranění karty
    $('.delete-btn').first().click(function () {
        $(this).closest('.col-md-4').remove();
    });
}
