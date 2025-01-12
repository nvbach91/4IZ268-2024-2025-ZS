$(document).ready(() => {
  // Selectors
  const joke = $("#jokeDisplay");
  const searchForm = $("#searchForm");
  const searchInput = $("#searchInput");
  const searchResultsList = $("#searchResultsList");
  const searchResultsCount = $("#searchResultsCount");
  const favoritesList = $("#favoriteJokesList ul");
  const sortSelect = $("#sortFavorites");

  // Emoji ratings
  const RATING_EMOJIS = [
    "\uD83D\uDE22",
    "\uD83D\uDE10",
    "\uD83D\uDE42",
    "\uD83D\uDE0A",
    "\uD83E\uDD23",
  ];

  async function fetchJoke() {
    try {
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
          "User-Agent": "My Joke App (https://github.com/ondrulin)",
        },
      });
      const data = await response.json();
      return {
        id: data.id,
        joke: data.joke
      };
    } catch (error) {
      console.error("Failed to fetch joke:", error);
      return { id: null, joke: "Sorry, no jokes available right now." };
    }
  }

  async function searchJokes(term) {
    try {
      const response = await fetch(
        `https://icanhazdadjoke.com/search?term=${encodeURIComponent(term)}&limit=15`,
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

  async function displaySearchResults(searchTerm) {
    clearSearchResults();

    if (!searchTerm) {
      return;
    }

    const { results: jokes, total } = await searchJokes(searchTerm);
    if (jokes.length === 0) {
      searchResultsList.html("<li>No jokes found</li>");
      return;
    }

    searchResultsCount.text(`Showing ${jokes.length} out of ${total} jokes`);

    const jokesHtml = jokes.map(joke => $("<li>")
      .append(
        $("<span>").text(joke.joke),
        $("<button>")
          .addClass("btnAddToFavorites")
          .html("&#x2764;")
          .data({
            joke: joke.joke,
            id: joke.id
          })
          .on("click", function () {
            addToFavorites($(this).data());
          })
      ));

    searchResultsList.append(jokesHtml);
  }

  function clearSearchResults() {
    searchResultsList.empty();
    searchResultsCount.empty();
    searchInput.val("");
  }

  async function displayJoke() {
    const { id, joke: jokeText } = await fetchJoke();
    joke
      .text(jokeText)
      .data("jokeId", id)
      .data("jokeText", jokeText);
  }

  function createRatingButtons(jokeId, currentRating) {
    return RATING_EMOJIS.map((emoji, index) =>
      $("<button>")
        .addClass("rating-btn")
        .toggleClass("selected", currentRating === index + 1)
        .data({
          rating: index + 1,
          jokeId: jokeId
        })
        .text(emoji)
        .on("click", function () {
          const btn = $(this);
          rateJoke(btn.data("jokeId"), btn.data("rating"));
        })
    );
  }

  function rateJoke(jokeId, rating) {
    const favoriteJokes = getFavoriteJokes();
    const jokeIndex = favoriteJokes.findIndex(joke => joke.id === jokeId);

    if (jokeIndex !== -1) {
      favoriteJokes[jokeIndex].rating = rating;
      localStorage.setItem("favoriteJokes", JSON.stringify(favoriteJokes));
      displayFavoriteJokes();
    }
  }

  function sortJokes(jokes, sortType) {
    if (sortType === "none") return jokes;

    return [...jokes].sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;

      return sortType === "highest" ? ratingB - ratingA : ratingA - ratingB;
    });
  }

  function getFavoriteJokes() {
    return JSON.parse(localStorage.getItem("favoriteJokes") || "[]");
  }

  function addToFavorites({ id: jokeId, joke: jokeText } = {}) {
    // If no parameters provided, use current joke display
    if (!jokeId) {
      const currentJoke = joke.text();
      if (!currentJoke || currentJoke === "Generate a random joke with the button bellow!") {
        return;
      }
      jokeId = joke.data("jokeId");
      jokeText = currentJoke;
    }

    if (!jokeId) return;

    const favoriteJokes = getFavoriteJokes();

    if (!favoriteJokes.some(joke => joke.id === jokeId)) {
      favoriteJokes.push({
        id: jokeId,
        text: jokeText,
        rating: 0
      });
      localStorage.setItem("favoriteJokes", JSON.stringify(favoriteJokes));
      displayFavoriteJokes();
    }
  }

  function displayFavoriteJokes() {
    const favoriteJokes = sortJokes(
      getFavoriteJokes(),
      sortSelect.val()
    );

    favoritesList.empty();

    const jokesHtml = favoriteJokes.map(joke =>
      $("<li>").append(
        $("<div>")
          .addClass("joke-text")
          .text(joke.text),
        $("<div>")
          .addClass("joke-rating")
          .append(createRatingButtons(joke.id, joke.rating))
      )
    );

    favoritesList.append(jokesHtml);
  }

  // Event handlers
  searchForm.on("submit", async (e) => {
    e.preventDefault();
    await displaySearchResults(searchInput.val().trim());
  });

  $("#btnShowJoke").on("click", displayJoke);
  $("#btnAddFavorite").on("click", () => addToFavorites());
  $("#btnClearResults").on("click", clearSearchResults);
  sortSelect.on("change", displayFavoriteJokes);

  displayFavoriteJokes();
});