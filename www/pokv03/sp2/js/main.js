const nameForm = document.querySelector('#name-form');
const nameInput = document.querySelector('input[name="name-input"]');
const nameOutput = document.querySelector('#name-output');

const dateForm = document.querySelector('#date-form');
const dateInput = document.querySelector('input[name="date-input"]');
const dateOutput = document.querySelector('#date-output');

const namesListContainer = document.querySelector('#names-list ul');

/***** NAME FORM *****/
nameForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = capitalizeFirstLetter(nameInput.value.trim())

    if(name === ''){
        nameOutput.textContent = 'Zadejte jméno.';
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
            nameOutput.textContent = `Jméno ${dataName[0].name} má svátek dne ` + formatedDate;
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


/***** DATE FORM*****/
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
            dateOutput.textContent = `${formatDate(formatDateForAPI(dateInput.value))} má svátek: ${data.map(item => item.name).join(', ')}`;
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
    for(let month = 1; month <= 12; month++){
        for(let day = 1; day <= 31; day++){
            const formattedDateList = `${day < 10 ? '0' : ''}${day}${month < 10 ? '0' : ''}${month}`;
            
            try{
                const data = await getHolidayByDate(formattedDateList);
                if(data && data.length > 0){
                    data.forEach(holiday => {
                        const listItem = document.createElement('li');
                        listItem.textContent = holiday.name;
                        namesListContainer.appendChild(listItem);
                    });
                }
            }catch(error){
                continue;
            }
        }
    }
}

async function getHolidayByDate(date){
    const url = `https://svatky.adresa.info/json?date=${date}&lang=cs`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

getAllHolidays();

