const API_KEY = 'd3a4ad3d4c43dec3196f08df4ea46108';
const API_URL = 'https://api.themoviedb.org';

const testApiCall = async () => {
    try {
        const response = await fetch(`${API_URL}/3/movie/550?api_key=${API_KEY}`);
        if (response.ok) {
            const data = await response.json();
            console.log("API communication successful! Data are accesible:");
            console.log(data);
        } else {
            console.error("API call failed! Status code:", response.status);
        }
    } catch (error) {
        console.error("Error communicating with TMDB API:", error);
    }
};

testApiCall();