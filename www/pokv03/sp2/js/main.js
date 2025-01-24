const apiUrlName = 'https://svatky.adresa.info/json?name=';
const apiUrlDate = 'https://svatky.adresa.info/json?date=';
const apiUrlLang = '&lang=cs';

const nameForm = document.querySelector('#name-form');
const nameInput = document.querySelector('input[name="name-input"]');
const nameOutput = document.querySelector('#name-output');
const buttonName = document.querySelector('#button-name');
const searchHistory = document.querySelector('#search-history');

const dateForm = document.querySelector('#date-form');
const dateInput = document.querySelector('input[name="date-input"]');
const dateOutput = document.querySelector('#date-output');
const buttonDate = document.querySelector('#button-date');

const spinnerName = document.querySelector('.spinner-container-name');
const spinnerDate = document.querySelector('.spinner-container-date');
const spinnerList = document.querySelector('.spinner-container-list');
const namesListContainer = document.querySelector('#names-list ul');
const listOutput = document.querySelector('#list-output');

const localStorageHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

/***** NAME FORM *****/
nameForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = capitalizeFirstLetter(nameInput.value.trim());
    spinnerName.style.display = 'block';
    buttonName.disabled = true;
    if (name === '') {
        nameOutput.textContent = 'Zadejte jméno.';
        buttonName.disabled = false;
        return;
    }

    const cachedData = sessionStorage.getItem(name);
    if (cachedData) {
        const holidayData = JSON.parse(cachedData);
        nameOutput.textContent = `${holidayData.name} má svátek dne ${formatDate(`${holidayData.date}`)} ${getDayOfWeek(`${holidayData.date}`)}.`;
        spinnerName.style.display = 'none';
        buttonName.disabled = false;
        return;
    }

    try {
        const responseName = await fetch(`${apiUrlName}${name}${apiUrlLang}`);
        if (!responseName.ok) {
            throw new Error('Chyba při načítání dat.');
        }

        const dataName = await responseName.json();
        if (dataName.length > 0) {
            formatedDate = formatDate(`${dataName[0].date}`);
            nameOutput.textContent = `${dataName[0].name} má svátek dne ${formatedDate} ${getDayOfWeek(`${dataName[0].date}`)}.`;
            spinnerName.style.display = 'none';
            buttonName.disabled = false;
            saveLastSubmit(`${dataName[0].name}`, `${dataName[0].date}`);

            const id = Date.now();
            const time = getCurrentTime();
            addToHistory(id, name, formatedDate, time);
        } else {
            nameOutput.textContent = 'Svátek pro zadané jméno nebyl nalezen.';
            spinnerName.style.display = 'none';
            buttonName.disabled = false;
        }
    } catch (error) {
        nameOutput.textContent = 'Došlo k chybě. Zkuste to znovu.';
        console.error(error);
    }
});

const formatDate = (dateString) => {
    return dateString.slice(0, 2) + '.' + dateString.slice(2) + '.';
}

const capitalizeFirstLetter = (nameString) => {
    return nameString.charAt(0).toUpperCase() + nameString.slice(1).toLowerCase();
}

const getDayOfWeek = (dateString) => {
    const currentYear = new Date().getFullYear();
    const formattedFullDate = `${dateString.slice(2, 4)}-${dateString.slice(0, 2)}-${currentYear}`;

    const fullDate = new Date(formattedFullDate);

    const daysOfWeek = [' v neděli', ' v pondělí', ' v úterý', ' ve středu', ' ve čtvrtek', ' v pátek', ' v sobotu'];
    return daysOfWeek[fullDate.getDay()];
}


/***** HISTORY LIST *****/
const saveLastSubmit = (name, date) => {
    const holidayData = { name, date };
    sessionStorage.setItem(name, JSON.stringify(holidayData));
}

const addToHistory = (id, name, date, time) => {
    localStorageHistory.push({ id, name, date, time });
    if (localStorageHistory.length > 6) {
        localStorageHistory.shift();
    }
    localStorage.setItem('searchHistory', JSON.stringify(localStorageHistory));
    renderHistory();
}

const renderHistory = () => {
    searchHistory.innerHTML = '';
    //console.log(history);

    const listHistory = localStorageHistory.map(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Svátek: ${item.date}, Vyhledáno: ${item.time}`;
        li.classList.add('list-group-item');
        return li;
    })

    searchHistory.append(...listHistory);
}

const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
}


/***** DATE FORM *****/
dateForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    spinnerDate.style.display = 'block';
    buttonDate.disabled = true;

    if (!dateInput) {
        dateOutput.textContent = 'Zadejte platné datum.';
        spinnerDate.style.display = 'none';
        buttonDate.disabled = false;
        return;
    }

    try {
        const dateFormatted = formatDateForAPI(dateInput.value);
        const response = await fetch(`${apiUrlDate}${dateFormatted}`);
        if (!response.ok) {
            throw new Error('Chyba při načítání dat.');
        }

        const data = await response.json();

        if (data.length > 0) {
            dateOutput.textContent = `${formatDate(formatDateForAPI(dateInput.value))} ${getDayOfWeek(formatDateForAPI(dateInput.value))} má svátek ${data.map(item => item.name).join(', ')}`;
            spinnerDate.style.display = 'none';
            buttonDate.disabled = false;
        } else {
            dateOutput.textContent = 'V tento datum nemá nikdo svátek.';
            spinnerDate.style.display = 'none';
            buttonDate.disabled = false;
        }
    } catch (error) {
        console.error(error);
        dateOutput.textContent = 'Nastala chyba při načítání dat.';
    }
});

const formatDateForAPI = (date) => {
    if (!date || typeof date !== 'string' || date.length !== 10 || date[4] !== '-' || date[7] !== '-') {
        throw new Error('Neplatný formát datumu');
    }
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);

    return `${day}${month}`;
}


/***** ALL HOLIDAYS *****/
async function getAllHolidays() {

    const response = await fetch('./name-data.json');
    const holidays = await response.json();

    const allNames = [];

    holidays.forEach(holiday => {
        if (holiday.name.split(' ').length <= 1) {
            allNames.push(holiday.name);
        }
    });

    const listItems = allNames.map(name => {
        const listItem = document.createElement('li');
        listItem.textContent = name;
        listItem.classList.add('col-1');
        return listItem;
    })

    namesListContainer.append(...listItems);
}

async function getHolidayByDate(date) {
    const url = `${apiUrlDate}${date}${apiUrlLang}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

document.querySelector('#names-list .names-list').addEventListener('click', (event) => {
    if (event.target && event.target.nodeName === 'LI') {
        const name = event.target.textContent.trim();
        console.log(name);
        getHolidayDetails(name);
    }
});

async function getHolidayDetails(name) {
    try {
        const encodedName = encodeURIComponent(name);
        const responseName = await fetch(`${apiUrlName}${encodedName}${apiUrlLang}`);
        if (!responseName.ok) {
            throw new Error('Chyba při načítání dat.');
        }

        const dataName = await responseName.json();
        // console.log('API: ', dataName);

        if (dataName.length > 0) {
            console.log(dataName[0]);

            formatedDate = formatDate(`${dataName[0].date}`);
            listOutput.textContent = `${dataName[0].name} má svátek dne ${formatedDate} ${getDayOfWeek(`${dataName[0].date}`)}.`;

        } else {
            listOutput.textContent = 'Svátek pro zadané jméno nebyl nalezen.';
        }

    } catch (error) {
        console.error(error);
        listOutput.textContent = 'Došlo k chybě při získávání dat.';
    }
}

function init() {
    getAllHolidays();
    renderHistory();
}
init();

