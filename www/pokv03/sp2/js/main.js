const nameForm = document.querySelector('#name-form');
const nameInput = document.querySelector('input[name="name-input"]');
const nameOutput = document.querySelector('#name-output');
const searchHistory = document.querySelector('#search-history');

const dateForm = document.querySelector('#date-form');
const dateInput = document.querySelector('input[name="date-input"]');
const dateOutput = document.querySelector('#date-output');

const spinner = document.querySelector('.spinner-container');
const namesListContainer = document.querySelector('#names-list ul');
const listOutput = document.querySelector('#list-output');

/***** NAME FORM *****/
nameForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = capitalizeFirstLetter(nameInput.value.trim());

    if(name === ''){
        nameOutput.textContent = 'Zadejte jméno.';
        return;
    }

    const cachedData = sessionStorage.getItem(name);
    if (cachedData) {
        const holidayData = JSON.parse(cachedData);
        nameOutput.textContent = `${holidayData.name} má svátek dne ` + formatDate(`${holidayData.date}`) + getDayOfWeek(`${holidayData.date}`) + `.`;
        return;
    }

    try{
        const responseName = await fetch(`https://svatky.adresa.info/json?name=${name}&lang=cs`);
        if(!responseName.ok) {
            throw new Error('Chyba při načítání dat.');
        }

        const dataName = await responseName.json();
        if(dataName.length > 0){
            formatedDate = formatDate(`${dataName[0].date}`);
            nameOutput.textContent = `${dataName[0].name} má svátek dne ` + formatedDate + getDayOfWeek(`${dataName[0].date}`) + `.`;

            saveLastSubmit(`${dataName[0].name}`, `${dataName[0].date}`);

            const id = Date.now();
            const time = getCurrentTime();
            addToHistory(id, name, formatedDate, time);
        }else{
            nameOutput.textContent = 'Svátek pro zadané jméno nebyl nalezen.';
        }
    }catch(error){
        nameOutput.textContent = 'Došlo k chybě. Zkuste to znovu.';
        console.error(error);
    }
});

function formatDate(dateString){
    return dateString.slice(0, 2) + '.' + dateString.slice(2) + '.';
}

function capitalizeFirstLetter(nameString){
    return nameString.charAt(0).toUpperCase() + nameString.slice(1).toLowerCase();
}

function getDayOfWeek(dateString) {
    const currentYear = new Date().getFullYear();
    const formattedFullDate = `${dateString.slice(2, 4)}-${dateString.slice(0, 2)}-${currentYear}`;

    const fullDate = new Date(formattedFullDate);

    const daysOfWeek = [' v neděli', ' v pondělí', ' v úterý', ' ve středu', ' ve čtvrtek', ' v pátek', ' v sobotu'];
    return daysOfWeek[fullDate.getDay()];
}


/***** HISTORY LIST *****/
function saveLastSubmit(name, date) {
    const holidayData = { name, date };
    sessionStorage.setItem(name, JSON.stringify(holidayData));
}

function addToHistory(id, name, date, time) {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.push({ id, name, date, time });
    if (history.length > 6) {
        history.shift();
    }
    localStorage.setItem('searchHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Svátek: ${item.date}, Vyhledáno: ${item.time}`;
        li.classList.add('list-group-item');
        searchHistory.appendChild(li);
    });
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
}


/***** DATE FORM *****/
dateForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if(!dateInput){
        dateOutput.textContent = 'Zadejte platné datum.';
        return;
    }

    try{
        const dateFormatted = formatDateForAPI(dateInput.value);
        const response = await fetch(`https://svatky.adresa.info/json?date=${dateFormatted}`);
        if(!response.ok){
            throw new Error('Chyba při načítání dat.');
        }

        const data = await response.json();

        if(data.length > 0){
            dateOutput.textContent = `${formatDate(formatDateForAPI(dateInput.value))} ${getDayOfWeek(formatDateForAPI(dateInput.value))} má svátek ${data.map(item => item.name).join(', ')}`;
        }else{
            dateOutput.textContent = 'Na toto datum nemá nikdo svátek.';
        }
    }catch(error){
        console.error(error);
        dateOutput.textContent = 'Nastala chyba při načítání dat.';
    }
});

function formatDateForAPI(date){
    if(!date || typeof date !== 'string' || date.length !== 10 || date[4] !== '-' || date[7] !== '-') {
        throw new Error('Neplatný formát datumu');
    }
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);

    return `${day}${month}`;
}


/***** ALL HOLIDAYS *****/
async function getAllHolidays(){
    const allHolidays = [];

    spinner.style.display = 'block';

    for(let month = 1; month <= 12; month++){
        for(let day = 1; day <= 31; day++){
            const formattedDateList = `${day < 10 ? '0' : ''}${day}${month < 10 ? '0' : ''}${month}`;
            
            try{
                const data = await getHolidayByDate(formattedDateList);
                if(data && data.length > 0){
                    data.forEach(holiday => {
                        if (holiday.name.split(' ').length <= 1) {
                            allHolidays.push(holiday.name);
                        }
                    });
                }
            }catch(error){
                continue;
            }
        }
    }

    spinner.style.display = 'none';

    allHolidays.forEach((name, i) => {
        setTimeout(() => {
            const listItem = document.createElement('li');
            listItem.textContent = name;
            listItem.classList.add('col-1');
            namesListContainer.appendChild(listItem);
        }, i * 30);
    });
    
}

async function getHolidayByDate(date){
    const url = `https://svatky.adresa.info/json?date=${date}&lang=cs`;
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
        const responseName = await fetch(`https://svatky.adresa.info/json?name=${encodedName}&lang=cs`);
        if (!responseName.ok) {
            throw new Error('Chyba při načítání dat.');
        }

        const dataName = await responseName.json();
        // console.log('API: ', dataName);

        if (dataName.length > 0) {
            console.log(dataName[0]);

            formatedDate = formatDate(`${dataName[0].date}`);
            listOutput.textContent = `${dataName[0].name} má svátek dne ` + formatedDate + getDayOfWeek(`${dataName[0].date}`) + `.`;

        } else {
            listOutput.textContent = 'Svátek pro zadané jméno nebyl nalezen.';
        }

    } catch (error) {
        console.error(error);
        listOutput.textContent = 'Došlo k chybě při získávání dat.';
    }
}

function init(){
    getAllHolidays();
    renderHistory();
}
init();

