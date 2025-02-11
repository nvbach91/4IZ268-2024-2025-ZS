let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const calendar = document.getElementById('calendar');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const eventNoteInput = document.getElementById('eventNoteInput');
const eventNotePopUp = document.getElementById('eventNotePopUp');
const eventUpdateNoteInput = document.getElementById('eventUpdateNoteInput');
const eventUpdateTitleInput = document.getElementById('eventUpdateTitleInput');
const updateEventModal = document.getElementById('updateEventModal');
const signoutButton = document.getElementById('signout_button');
const authorizeButton = document.getElementById('authorize_button');
const optionsUpdate = document.getElementById('optionsUpdate');
const selectedPriority = document.getElementById('options');
const form = document.getElementById('my-form');
const myUpdatedForm = document.getElementById('my-updated-form');
const eventText = document.getElementById('eventText');

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '';
const API_KEY = '';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let tokenClient;
let gapiInited = false;
let gisInited = false;

authorizeButton.style.visibility = 'hidden';
signoutButton.style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        authorizeButton.style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        signoutButton.style.visibility = 'visible';
        authorizeButton.innerText = 'Refresh';
        //await listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        authorizeButton.innerText = 'Authorize';
        signoutButton.style.visibility = 'hidden';
    }
}


function openModal(date) {
    clicked = date;
    newEventModal.style.display = 'block';
    backDrop.style.display = 'block';
};

function openUpdateEventModal(event) {
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    updateEventModal.style.display = 'block';
    backDrop.style.display = 'block';
};
function securingInput(input) {
    let inputValue = input.value;
    inputValue = inputValue.replace(/&/g, '&amp;');
    inputValue = inputValue.replace(/</g, '&lt;');
    inputValue = inputValue.replace(/>/g, '&gt;');
    return inputValue
}
function saveUpdatedEvent(event) {
    if (eventUpdateTitleInput.value) {
        eventUpdateTitleInput.classList.remove('error');
        const selectedPriority = optionsUpdate.value;
        let priorityClass = '';

        switch (selectedPriority) {
            case 'low':
                priorityClass = 'priority-low';
                break;
            case 'middle':
                priorityClass = 'priority-middle';
                break;
            case 'high':
                priorityClass = 'priority-high';
                break;
        }
        deleteEvent(event);
        events.push({
            date: event.date,
            title: securingInput(eventUpdateTitleInput),
            priority: optionsUpdate.value,
            priorityClass: priorityClass,
            note: eventUpdateNoteInput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeUpdateModal();
    } else {
        eventUpdateTitleInput.classList.add('error');
    }

}
function closeUpdateModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    myUpdatedForm.reset();
    clicked = null;
    loadFunction();
    displayEvents();
    updateEventModal.style.display = 'none'
}

function editEvent(event) {
    if (event) {
        eventText.innerText = event.title;
        eventNotePopUp.innerText = event.note;
        deleteEventModal.style.display = 'block';
        displayEditButtons(event);
    } else {
        newEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
}

const loadFunction = function load() {
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText =
        `${dt.toLocaleDateString('en', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    let displayDays = [];
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        const addEventButton = document.createElement('button');
        addEventButton.classList.add('addButton');
        addEventButton.innerText = '+';
        daySquare.classList.add('day');


        const dayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i - paddingDays).padStart(2, '0')}`;


        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
            const eventsForDay = events.filter(e => e.date === dayString);

            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }

            if (eventsForDay) {
                for (const eventForDay of eventsForDay) {
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('event');
                    eventDiv.addEventListener('click', () => editEvent(eventForDay));
                    eventDiv.innerText = eventForDay.title;
                    eventDiv.classList.add(eventForDay.priorityClass);
                    daySquare.appendChild(eventDiv);
                }
            }

            addEventButton.addEventListener('click', () => openModal(dayString));
            daySquare.append(addEventButton);
            

        } else {
            daySquare.classList.add('padding');
        }
        displayDays.push(daySquare);

        //calendar.appendChild(daySquare);
    }
    calendar.append(...displayDays)
}

function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    form.reset();
    clicked = null;
    loadFunction();
    displayEvents();
}
function saveEvent(x) {
    x.preventDefault();
    if (eventTitleInput.value) {
        
        eventTitleInput.classList.remove('error');
        const selectedPriorityValue = selectedPriority.value;
        let priorityClass = '';

        switch (selectedPriorityValue) {
            case 'low':
                priorityClass = 'priority-low';
                break;
            case 'middle':
                priorityClass = 'priority-middle';
                break;
            case 'high':
                priorityClass = 'priority-high';
                break;
        }

        events.push({
            date: clicked,
            title: securingInput(eventTitleInput),
            priority: selectedPriorityValue,
            priorityClass: priorityClass,
            note: eventNoteInput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        
        createGoogleEvent(clicked, eventTitleInput.value, eventNoteInput.value);
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }
};

// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== 'granted')
        Notification.requestPermission();
});


const notifyFunction = function notifyMe() {

    const myTime = new Date();

    const myYear = myTime.getFullYear();
    const myMonth = myTime.getMonth() + 1;
    const myDay = myTime.getDate();

    let myTodaysDay = `${myYear}-${String(myMonth).padStart(2, '0')}-${String(myDay).padStart(2, '0')}`;


    events.filter(event => event.date === new Date().toISOString().slice(0, 10)).forEach(event => {
        if (Notification.permission !== 'granted')
            Notification.requestPermission();
        else {
            var notification = new Notification('Notification title', {
                icon: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678116-calendar-512.png',
                body: 'U will miss your event ' + event.title,
            });
            notification.onclick = function () {
                window.open('https://eso.vse.cz/~zats00/sp2/');
            };
        }
    });

}


const displayEvents = () => {

   const  myTime = new Date();

    const myYear = myTime.getFullYear();
    const myMonth = myTime.getMonth() + 1;
    const myDay = myTime.getDate();

    let myTodaysDay = `${myYear}-${String(myMonth).padStart(2, '0')}-${String(myDay).padStart(2, '0')}`;


    const eventDisplaySection = document.getElementById('eventDisplaySection');

    // Clear existing events before updating
    eventDisplaySection.innerHTML = '<p>Upcoming Events:</p>';

    let tmpEvents = [];
    // Loop through events and add them to the display section
    events.filter(event => Date.parse(event.date) > new Date().setHours(0, 0, 0, 0))
        .filter(event => Date.parse(event.date) < (new Date().getTime() + (48 * 60 * 60 * 1000)))
        .forEach(event => {

            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.classList.add(event.priorityClass);
            eventElement.innerHTML = `
            <strong>${event.title}</strong>
            <p>${event.date}</p>
            <p>${event.note}</p>
        `;
            tmpEvents.push(eventElement)
        
        }

        );

        eventDisplaySection.append(...tmpEvents);
};

const changeEvent = (event) => {

    if (event) {
        clicked = event.date;
        // // // Populate the modal inputs with the event data   
        eventUpdateTitleInput.value = event.title;
        eventUpdateNoteInput.value = event.note;
        //selectedPriority.value = event.priority;

        // // Handle the current priority style
        let selectedPriority = event.priority;
        let priorityClass = '';
        switch (selectedPriority) {
            case 'low':
                priorityClass = 'priority-low';
                break;
            case 'middle':
                priorityClass = 'priority-middle';
                break;
            case 'high':
                priorityClass = 'priority-high';
                break;
        }

        // Reset any error classes
        eventTitleInput.classList.remove('error');

        openUpdateEventModal(event);
    }
};

// Call displayEvents when the page loads to show events from localStorage (if any)
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('events')) {
        events = JSON.parse(localStorage.getItem('events'));
        displayEvents();
    }
});

const deleteEvent = (event) => {
    events = events.filter(e => e.date !== event.date || e.title !== event.title);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

const initButtonsFunction = function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        loadFunction();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        loadFunction();
    });

    //document.getElementById('saveButton').addEventListener('submit', saveEvent);
    //document.getElementById('saveButton').addEventListener('submit', console.log('ahoj'));;
    form.addEventListener('submit', saveEvent);
    //document.getElementById('submitButton').addEventListener('submit', console.log('odpoved zo submit'));
    //form.addEventListener('submit', console.log('form submit'));
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('closeButton').addEventListener('click', closeModal);
    document.getElementById('cancelUpdateButton').addEventListener('click', closeUpdateModal);

}

const displayEditButtons = (event) => {
    document.getElementById('updateButton').addEventListener('click', () => saveUpdatedEvent(event));
    document.getElementById('changeButton').addEventListener('click', () => changeEvent(event));
    document.getElementById('deleteButton').addEventListener('click', () => deleteEvent(event));
}


function createGoogleEvent(eventDate, eventTitle, eventNote) {
    const formattedDate = new Date(eventDate).toISOString();

    const event = {
        summary: eventTitle,
        description: eventNote,
        start: {
            dateTime: formattedDate, // ISO 8601 format
            timeZone: 'America/Los_Angeles'
        },
        end: {
            dateTime: formattedDate,
            timeZone: 'America/Los_Angeles'
        },
    };

    const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
    });

    request.execute(event => {
        console.log('Event created: ', event.htmlLink);
    });


}

notifyFunction();
initButtonsFunction();
loadFunction();
