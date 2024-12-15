//const API_KEY = '';
//const BASE_API_URL = '';

const searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const { searchValue } = Object.fromEntries(formData);
    console.log(searchValue);
});

