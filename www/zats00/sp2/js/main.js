const eventButton = document.getElementById('addEventButton');
const eventForm = document.getElementById('eventForm');

eventButton.addEventListener('click', function () {
    eventForm.style.display = 'block';
});

eventDetailsForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const eventTitle = document.getElementById('eventTitle').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventDate = document.getElementById('eventDate').value;


    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event');
    eventDiv.innerHTML = `
        <h3>${eventTitle}</h3>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}</p>
    `;

    eventDisplaySection.appendChild(eventDiv);


    eventDetailsForm.reset();
    eventForm.style.display = 'none';
});


var initialDate = new Date();
var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var currentMonth = currentDate.getMonth();



var currentMonthInt = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);


var calendarYearMonth = document.body.querySelector(".calendar-month-year");
var calendarDays = document.body.querySelector(".calendar-days");



calendarYearMonth.innerHTML = `<strong>${currentMonthInt}</strong> ${currentYear}`



document.body.onload = fillCalendarCurrentMonth(currentYear, currentMonth);

function fillCalendarCurrentMonth(year, month) {
    let firstDayOfMonth = new Date(year, month, 1);
    let firstDayOfMonthWeekday = firstDayOfMonth.getDay();
    let lastDayOfMonth = new Date(year, month + 1, 0);



    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        var dateElement = document.createElement("p");
        var dateContent = document.createTextNode(i);
        dateElement.appendChild(dateContent);
        calendarDays.appendChild(dateElement);
    };


    let calendarFirstDay = document.body.querySelector(".calendar-days p:first-child")
    if (firstDayOfMonthWeekday == 0) {
        calendarFirstDay.style.gridColumn = "7";
    }
    else {
        calendarFirstDay.style.gridColumn = firstDayOfMonthWeekday;

    };
}


const nextMonthButton = document.getElementById('calendar-next-month');
const previousMonthButton = document.getElementById("calendar-previous-month");
nextMonthButton.addEventListener('click', function (event) {

    previousMonthButton.removeAttribute("disabled");


    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++
    };


    let alteredMonth = currentDate.setMonth(currentMonth);

    calendarDays.innerHTML = "";
    fillCalendarCurrentMonth(currentYear, currentMonth);


    var currentMonthInt = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(alteredMonth);
    calendarYearMonth.innerHTML = `<strong>${currentMonthInt}</strong> ${currentYear}`
});

previousMonthButton.addEventListener('click', function (event) {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--
    };

    let alteredMonth = currentDate.setMonth(currentMonth);
    calendarDays.innerHTML = "";
    fillCalendarCurrentMonth(currentYear, currentMonth);
    var currentMonthInt = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(alteredMonth);
    calendarYearMonth.innerHTML = `<strong>${currentMonthInt}</strong> ${currentYear}`

    if (initialDate.getMonth() == currentMonth && initialDate.getFullYear() == currentYear) {
        previousMonthButton.setAttribute("disabled", "");
    };
})

