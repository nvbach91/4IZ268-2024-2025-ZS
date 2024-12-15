const API_KEY = 'bec05bad951b487e98c48c26c26d584e';

const fetchNews = async (keyword) => {
    try {
        // format musi byt YYYY-MM-DD
        const today = new Date();
        const formattedDateToday = "2024-12-13"
        const  formattedDateLastMonth = "2024-11-13"

        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${keyword}&from=2024-12-14&to=2024-12-14&sortBy=popularity&apiKey=${API_KEY}`
        );

        const data = await response.json();
        console.log('data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

document.querySelector('#searchButton').addEventListener('click', () => {
    const keyword = document.getElementById('searchInput').value;
    if (keyword) {
        fetchNews(keyword);
    } else {
        alert('Zadejte klíčové slovo');
    }
});

// document.querySelector('#clearButton').addEventListener('click', () => {
//     document.getElementById('searchInput').value = '';
// });
