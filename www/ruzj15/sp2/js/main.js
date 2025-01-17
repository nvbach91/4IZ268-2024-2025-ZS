const API_KEY = '67a94006026279465e11c65e95d8446f';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Proměnné pro DOM prvky
const $weatherForm = $('#weatherForm');
const $cityInput = $('#cityInput');
const $weatherCards = $('#weatherCards');
const $errorMsg = $('#errorMsg');
const $getLocationBtn = $('#getLocationBtn');
const $weatherModal = $('#weatherModal');
const $modalBody = $('#modalBody');
const $modalTitle = $('#modalTitle');
const $submitButton = $('#submitButton');
const $spinner = $submitButton.find('#spinner-border');

// Inicializace seznamu přidaných měst
let addedCities = JSON.parse(localStorage.getItem('addedCities')) || [];

// Funkce pro uložení seznamu do localStorage
const saveToLocalStorage = () => {
    localStorage.setItem('addedCities', JSON.stringify(addedCities));
};

// Inicializace při načtení stránky
$(document).ready(function () {
    // Načtení uložených měst a aktualizace počasí
    loadSavedCities();

    // Událost submit na formuláři
    $weatherForm.submit(function (e) {
        e.preventDefault();
        fetchWeather();
    });

    // Událost click na tlačítku pro získání polohy
    $getLocationBtn.click(getLocation);

    // Delegace na změnu jednotek teploty
    $weatherCards.on('click', '.unit-btn', function () {
        const $card = $(this).closest('.weather-card');
        const tempCelsius = parseFloat($card.data('temp-celsius'));
        const targetUnit = $(this).data('unit');
        let convertedTemp;
        let unitSymbol = '';

        if (targetUnit === 'F') {
            convertedTemp = (tempCelsius * 9 / 5) + 32;
            unitSymbol = '°F';
        } else if (targetUnit === 'K') {
            convertedTemp = tempCelsius + 273.15;
            unitSymbol = 'K';
        } else {
            convertedTemp = tempCelsius;
            unitSymbol = '°C';
        }

        convertedTemp = convertedTemp.toFixed(1);
        $card.find('.temperature').text(`${convertedTemp}${unitSymbol}`);

        /// UPRAVA
        $(this).addClass('btn-primary').removeClass('btn-outline-primary') //  modré zvýraznění, odstraní obrys
            .siblings('.unit-btn') // najdu sourozence, další tlačítka
            .removeClass('btn-primary').addClass('btn-outline-primary'); // Odebrat zvýraznění
    });
    /// UPRAVA


    // kliknutí na tlačítko "Více detailů" pro zobrazení modálního okna
    $weatherCards.on('click', '.details-btn', function () {
        const cityName = $(this).closest('.weather-card').find('.card-title').text();
        const cityData = $(this).closest('.weather-card').data('weather');
        showWeatherModal(cityData);
    });

    // kliknutí na město pro zobrazení modálního okna
    $weatherCards.on('click', '.weather-card', function () {
        // Tato část již nebude potřeba, protože místo kliknutí na kartu použijeme tlačítko "Více detailů"
    });
});

// Načtení uložených měst z localStorage
const loadSavedCities = async () => {
    for (const city of addedCities) {
        try {
            const data = await fetchWeatherData(city);
            addWeatherCard(data);
        } catch (error) {
            console.error(`Nepodařilo se načíst data pro město ${city}:`, error);
        }
    }
};

const getLocation = async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            await reverseGeocode(lat, lon);
        }, (error) => {
            $errorMsg.text('Chyba při získávání polohy: ' + error.message);
        });
    } else {
        $errorMsg.text('Geolokace není podporována tímto prohlížečem.');
    }
};

const reverseGeocode = async (lat, lon) => {
    const reverseGeocodeURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await $.ajax({
            url: reverseGeocodeURL,
            method: 'GET',
        });
        $cityInput.val(response.name);
        await fetchWeather();
    } catch (error) {
        $errorMsg.text('Nepodařilo se zjistit město pro dané souřadnice.');
    }
};

const fetchWeather = async () => {
    const city = $cityInput.val().trim().toLowerCase();
    $errorMsg.text('');
    //Uprava spiner
    // Kontrola vstupu
    if (!city) {
        $errorMsg.text('Zadejte prosím název města');
        return;
    }

    if (addedCities.includes(city)) {
        $errorMsg.text('Toto město již bylo přidáno.');
        return;
    }

    try {
        // Aktivace spinneru a deaktivace tlačítka
        $submitButton.prop('disabled', true);
        $spinner.removeClass('d-none');

        // Načítání dat o počasí
        const data = await fetchWeatherData(city);
        addedCities.push(city); // Přidání města do seznamu
        saveToLocalStorage(); // Uložení do localStorage
        addWeatherCard(data); // Přidání karty do UI
        $cityInput.val('');
    } catch (error) {
        $errorMsg.text('Město nebylo nalezeno. Zkontrolujte správnost a zkuste to znovu.');
    } finally {
        // Deaktivace spinneru a obnovení tlačítka
        $submitButton.prop('disabled', false);
        $spinner.addClass('d-none');
    }
};

const fetchWeatherData = async (city) => {
    return await $.ajax({
        url: API_URL,
        method: 'GET',
        data: {
            q: city,
            appid: API_KEY,
            units: 'metric',
        },
    });
};

const addWeatherCard = (data) => {
    const cardHtml = $(`
        <div class="col-md-4 mb-4">
            <div class="card weather-card" data-temp-celsius="${data.main.temp}" data-weather='${JSON.stringify(data)}'>
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
                        <button class="btn btn-sm btn-primary unit-btn" data-unit="C">Celsia</button>
                        <button class="btn btn-sm btn-outline-primary unit-btn" data-unit="F">Fahrenheit</button>
                        <button class="btn btn-sm btn-outline-primary unit-btn" data-unit="K">Kelvin</button>
                    </div>
                    <button class="btn btn-primary details-btn mt-3">Více detailů</button>
                </div>
            </div>
        </div>
    `);
    
    $weatherCards.prepend(cardHtml);

    cardHtml.find(".delete-btn").click(function () {
        const cityName = $(this).closest('.weather-card').find('.card-title').text().split(',')[0].toLowerCase();
        addedCities = addedCities.filter(city => city !== cityName); // Odstranění města ze seznamu
        saveToLocalStorage(); // Uložení změněného seznamu
        $(this).closest('.col-md-4').remove();
    });
};

// Zobrazení modálního okna s podrobnostmi o počasí
const showWeatherModal = (data) => {
    $modalTitle.text(`${data.name}, ${data.sys.country}`);
    $modalBody.html(`
        <p><strong>Teplota:</strong> ${data.main.temp.toFixed(1)}°C</p>
        <p><strong>Vlhkost:</strong> ${data.main.humidity}%</p>
        <p><strong>Vítr:</strong> ${data.wind.speed} m/s</p>
        <p><strong>Popis:</strong> ${data.weather[0].description}</p>
        <p><strong>Min. teplota:</strong> ${data.main.temp_min.toFixed(1)}°C</p>
        <p><strong>Max. teplota:</strong> ${data.main.temp_max.toFixed(1)}°C</p>
    `);
    $weatherModal.modal('show');
};