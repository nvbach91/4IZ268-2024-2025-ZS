// DOM element references
const showJokeBtn = document.getElementById("btnShowJoke");
const searchForm = document.getElementById("searchForm");
const favoriteBtn = document.getElementById("btnAddFavorite");
const jokeElement = document.getElementById("jokeDisplay");
const favoriteJokesElement = document.getElementById("favoriteJokesList");
const searchInput = document.getElementById("searchInput");
const searchResultsList = document.getElementById("searchResultsList");
const searchResultsCount = document.getElementById("searchResultsCount");

// Fetch a joke from the API
async function fetchJoke() {
  try {
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
        "User-Agent": "My Joke App (https://github.com/ondrulin)",
      },
    });
    const { joke } = await response.json();
    return joke;
  } catch (error) {
    console.error("Failed to fetch joke:", error);
    return "Sorry, no jokes available right now.";
  }
}

// Search for jokes
async function searchJokes(term) {
  try {
    const response = await fetch(
      `https://icanhazdadjoke.com/search?term=${encodeURIComponent(
        term
      )}&limit=15`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "My Joke App (https://github.com/ondrulin)",
        },
      }
    );
    const data = await response.json();
    return {
      results: data.results,
      total: data.total_jokes,
    };
  } catch (error) {
    console.error("Failed to search jokes:", error);
    return { results: [], total: 0 };
  }
}

// Display search results
async function displaySearchResults(searchTerm) {
  if (!searchTerm) {
    searchResultsList.innerHTML = "<li>Please enter a search term</li>";
    searchResultsCount.textContent = "";
    return;
  }

  const { results: jokes, total } = await searchJokes(searchTerm);
  if (jokes.length === 0) {
    searchResultsCount.textContent = "No results found";
    return;
  }

  searchResultsCount.textContent = `Showing ${jokes.length} out of ${total} jokes found`;

  searchResultsList.innerHTML = jokes
    .map(
      (joke) => `
      <li>
          ${joke.joke}
          <button data-joke="${encodeURIComponent(
            joke.joke
          )}" onclick="addToFavorites(this)">
              Add to Favorites
          </button>
      </li>
    `
    )
    .join("");
}

// Display a random joke
async function displayJoke() {
  jokeElement.textContent = await fetchJoke();
}

// Add joke to favorites
function addToFavorites(jokeOrButton) {
  let joke;

  // If the argument is a button, extract the joke from its data attribute
  if (jokeOrButton && jokeOrButton.getAttribute) {
    joke = decodeURIComponent(jokeOrButton.getAttribute("data-joke"));
  } else {
    // Otherwise, treat the argument as a string (for the random joke case)
    joke = jokeOrButton;
  }

  const favoriteJokes = JSON.parse(localStorage.getItem("favoriteJokes")) || [];

  if (!favoriteJokes.includes(joke)) {
    favoriteJokes.push(joke);
    localStorage.setItem("favoriteJokes", JSON.stringify(favoriteJokes));
    displayFavoriteJokes();
  }
}

// Add current joke to favorites
function addFavoriteJoke() {
  const currentJoke = jokeElement.textContent;
  if (!currentJoke || currentJoke === "Click Show a Joke to see one!") return;
  addToFavorites(currentJoke);
}

// Display favorite jokes
function displayFavoriteJokes() {
  const favoriteJokes = JSON.parse(localStorage.getItem("favoriteJokes")) || [];
  const favoriteJokesList = document.querySelector("#favoriteJokesList ul");
  favoriteJokesList.innerHTML = favoriteJokes
    .map((joke) => `<li>${joke}</li>`)
    .join("");
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const searchTerm = formData.get("searchTerm").trim();
  await displaySearchResults(searchTerm);
});

showJokeBtn.addEventListener("click", displayJoke);
favoriteBtn.addEventListener("click", addFavoriteJoke);

// Initialize favorite jokes on page load
displayFavoriteJokes();
