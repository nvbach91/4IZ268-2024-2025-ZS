const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 27 },
];

const chartContainer = document.querySelector('#charts');

new Chart(
    chartContainer,
    {
        type: 'bar',
        data: {
            labels: data.map(({ year }) => year),
            datasets: [
                {
                    label: 'Akvizice 2010-2016',
                    data: data.map(({ count }) => count),
                },
            ],
        },
    },
);


const bucketListForm = document.querySelector('#bucketlist-form');
const bucketList = document.querySelector('#bucketlist');
bucketListForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(bucketListForm);
    const { name } = Object.fromEntries(formData);
    const item = document.createElement('li');
    item.textContent = name;
    bucketList.append(item);
    // key: bucketListItems
    // value: [ { name: 'pikachu' } ]
    const existingData = localStorage.getItem('bucketListItems');
    if (existingData === null) {
        localStorage.setItem('bucketListItems', '[]');
    }
    const records = JSON.parse(localStorage.getItem('bucketListItems'));
    records.push({ name: name });
    
    const dataString = JSON.stringify(records);
    localStorage.setItem('bucketListItems', dataString);
});

const bucketListItems = JSON.parse(localStorage.getItem('bucketListItems'));
bucketListItems.forEach((record) => {
    const item = document.createElement('li');
    item.textContent = record.name;
    bucketList.append(item);
});

// navigator.geolocation.getCurrentPosition((position) => {
//     console.log(position);
//     const { coords: { longitude, latitude } } = position;
//     console.log(position);
//     const url = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&amp;output=embed`;
//     console.log(url);
//     const iframe = `<iframe src="${url}">`;
//     document.body.innerHTML = iframe;
// });

document.body.innerHTML = '';

const renderPage = (pageNumber) => {
    document.querySelector('h1')?.remove();
    const heading = document.createElement('h1');
    heading.textContent = `Page ${pageNumber}`;
    document.title = `Page ${pageNumber}`;
    document.body.append(heading);
};
const numbers = [1, 2, 3, 4];
numbers.forEach((number) => {
    const button = document.createElement('button');
    button.textContent = number;
    document.body.append(button);
    button.addEventListener('click', (e) => {
        const currentPageNumber = location.pathname.split('/').slice(-1).join('');
        if (currentPageNumber !== number.toString()) {
            history.pushState({}, '', number.toString());
            renderPage(number);
        }
    });
});
window.onpopstate = (e) => {
    const pageNumber = location.pathname.split('/').slice(-1).join('');
    renderPage(pageNumber);
};

