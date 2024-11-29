const notesForm = document.querySelector('#notes-form');
const notesList = document.querySelector('#notes-list');
const existingNotes = localStorage.getItem('notes');
if (existingNotes === null) {
    localStorage.setItem('notes', '[]');
}
const notes = JSON.parse(localStorage.getItem('notes'));
const noteElements = notes.map(({ value }) => {
    const item = document.createElement('li');
    item.textContent = value;
    return item;
});
notesList.append(...noteElements);
notesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(notesForm);
    const { note } = Object.fromEntries(formData);
    const item = document.createElement('li');
    item.textContent = note;
    notesList.append(item);
    notes.push({ value: note });
    const notesString = JSON.stringify(notes);
    localStorage.setItem('notes', notesString);
});



navigator.geolocation.getCurrentPosition((position) => {
    const { coords: { longitude, latitude } } = position;
    const iframe = `<iframe src="https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&amp;output=embed"></iframe>`;
    document.body.innerHTML = iframe;
});













const data = [
    { year: 2010, value: 25 },
    { year: 2011, value: 20 },
    { year: 2012, value: 21 },
    { year: 2013, value: 23 },
    { year: 2014, value: 24 },
    { year: 2015, value: 30 },
    { year: 2016, value: 35 },
];
const chartCanvas = document.querySelector('#chart');
new Chart(
    chartCanvas,
    {
        type: 'bar', // pie, doughnut, line, bubble, ...
        data: {
            labels: data.map(({ year }) => year),
            datasets: [
                {
                    label: 'Pocet klientu',
                    data: data.map(({ value }) => value),
                },
                {
                    label: 'Pocet objednavek',
                    data: data.map(({ value }) => value * 2),
                },
                {
                    label: 'Trzba',
                    data: data.map(({ value }) => value * 3),
                }
            ],
        },
    },
);