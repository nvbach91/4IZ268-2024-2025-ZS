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
