$(document).ready(() => {
  // Selectors
  const joke = $("#jokeDisplay");
  const searchForm = $("#searchForm");
  const searchInput = $("#searchInput");
  const searchResultsList = $("#searchResultsList");
  const searchResultsCount = $("#searchResultsCount");
  const favoritesList = $("#favoriteJokesList ul");
  const sortSelect = $("#sortFavorites");

  // State management
  const state = {
    favorites: JSON.parse(localStorage.getItem("favoriteJokes") || "[]"),
    sortOrder: localStorage.getItem("sortOrder") || "none",
    currentPage: 1,
    itemsPerPage: 5,
    searchPage: 1,
    searchTerm: "",
    totalSearchResults: 0,
  };

  // Emoji ratings
  const RATING_EMOJIS = [
    "\uD83D\uDE22",
    "\uD83D\uDE10",
    "\uD83D\uDE42",
    "\uD83D\uDE0A",
    "\uD83E\uDD23",
  ];

  function initializeApp() {
    sortSelect.val(state.sortOrder);
    setupPaginationControls();
    displayFavoriteJokes();
    updateTotalJokesCount();
  }

  async function fetchJoke() {
    joke.html(showSpinner());
    $("#btnShowJoke").prop("disabled", true);

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
        joke: data.joke,
      };
    } catch (error) {
      console.error("Failed to fetch joke:", error);
      return { id: null, joke: "Sorry, no jokes available right now." };
    } finally {
      $("#btnShowJoke").prop("disabled", false);
    }
  }

  async function searchJokes(term, page = 1) {
    try {
      const response = await fetch(
        `https://icanhazdadjoke.com/search?term=${encodeURIComponent(
          term
        )}&page=${page}&limit=15`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "My Joke App (https://github.com/ondrulin)",
          },
        }
      );
      const data = await response.json();
      state.totalSearchResults = data.total_jokes;
      return data;
    } catch (error) {
      console.error("Failed to search jokes:", error);
      return { results: [], total_jokes: 0, current_page: 1, total_pages: 0 };
    }
  }

  async function displaySearchResults(searchTerm, page = 1) {
    if (!searchTerm) {
      clearSearchResults();
      return;
    }

    searchResultsCount.empty();
    searchResultsList.html(showSpinner());

    state.searchTerm = searchTerm;
    state.searchPage = page;

    const data = await searchJokes(searchTerm, page);
    const { results: jokes, total_jokes, current_page, total_pages } = data;

    searchResultsList.empty();

    if (jokes.length === 0) {
      searchResultsList.html("<li>No jokes found</li>");
      return;
    }

    searchResultsCount.html(`
      Showing ${jokes.length} out of ${total_jokes} jokes
      <div class="pagination">
        ${
          current_page > 1
            ? `<button class="secondary-btn prev-page">Previous</button>`
            : ""
        }
        ${
          total_pages !== 1
            ? `<span>Page ${current_page} of ${total_pages}</span>`
            : ""
        }
        ${
          current_page < total_pages
            ? `<button class="secondary-btn next-page">Next</button>`
            : ""
        }
      </div>
    `);

    const jokesHtml = jokes.map((joke) =>
      $("<li>").append(
        $("<span>").text(joke.joke),
        $("<button>")
          .addClass("btnAddToFavorites")
          .html("&#x2764;")
          .data({
            joke: joke.joke,
            id: joke.id,
          })
          .on("click", function () {
            addToFavorites($(this).data());
          })
      )
    );

    searchResultsList.append(jokesHtml);

    $(".prev-page").on("click", () =>
      displaySearchResults(searchTerm, current_page - 1)
    );
    $(".next-page").on("click", () =>
      displaySearchResults(searchTerm, current_page + 1)
    );
  }

  function clearSearchResults() {
    searchResultsList.empty();
    searchResultsCount.empty();
    searchInput.val("");
    state.searchTerm = "";
    state.searchPage = 1;
  }

  function clearFavorites() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover your favorite jokes!",
      icon: "warning",
      iconColor: "#ffd500",
      showCancelButton: true,
      confirmButtonColor: "#ffd500",
      cancelButtonColor: "#333",
      confirmButtonText: "Yes, delete them!",
    }).then((result) => {
      if (result.isConfirmed) {
        favoritesList.empty();
        state.favorites = [];
        sortSelect.val("none");
        localStorage.removeItem("favoriteJokes");
        localStorage.removeItem("sortOrder");
        $(".favorites-pagination").hide();
        updateTotalJokesCount();
        showNotification("Your favorites have been cleared!", "success");
      }
    });
  }

  function showSpinner() {
    return $("<div>").addClass("spinner");
  }

  function showNotification(message, type = "success") {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      iconColor: "#ffd500",
    });

    Toast.fire({
      icon: type,
      title: message,
    });
  }

  async function displayJoke() {
    const { id, joke: jokeText } = await fetchJoke();
    joke.text(jokeText).data("jokeId", id).data("jokeText", jokeText);
  }

  function createRatingButtons(jokeId, currentRating) {
    return RATING_EMOJIS.map((emoji, index) =>
      $("<button>")
        .addClass("rating-btn")
        .toggleClass("selected", currentRating === index + 1)
        .data({
          rating: index + 1,
          jokeId: jokeId,
        })
        .text(emoji)
        .on("click", function () {
          const btn = $(this);
          rateJoke(btn.data("jokeId"), btn.data("rating"));
        })
    );
  }

  function rateJoke(jokeId, rating) {
    const jokeIndex = state.favorites.findIndex((joke) => joke.id === jokeId);

    if (jokeIndex !== -1) {
      state.favorites[jokeIndex].rating = rating;
      localStorage.setItem("favoriteJokes", JSON.stringify(state.favorites));
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

  function updateTotalJokesCount() {
    $(".total-jokes-count").remove();

    const totalJokes = state.favorites.length;
    const countHtml = $("<div>")
      .addClass("total-jokes-count")
      .text(`Total Jokes Collected: ${totalJokes}`);

    $("#favoriteJokesList").prepend(countHtml);
  }

  function addToFavorites({ id: jokeId, joke: jokeText } = {}) {
    if (!jokeId) {
      const currentJoke = joke.text();
      if (
        !currentJoke ||
        currentJoke === "Generate a random joke with the button bellow!"
      ) {
        return;
      }
      jokeId = joke.data("jokeId");
      jokeText = currentJoke;
    }

    if (!jokeId) return;

    if (!state.favorites.some((joke) => joke.id === jokeId)) {
      state.favorites.push({
        id: jokeId,
        text: jokeText,
        rating: 0,
      });
      localStorage.setItem("favoriteJokes", JSON.stringify(state.favorites));
      displayFavoriteJokes();
      updateTotalJokesCount();
      showNotification("Joke added to favorites!");
    } else {
      showNotification("This joke is already in your favorites!", "warning");
    }
  }

  function displayFavoriteJokes() {
    const sortedJokes = sortJokes(state.favorites, state.sortOrder);
    const totalPages = Math.max(
      1,
      Math.ceil(sortedJokes.length / state.itemsPerPage)
    );

    state.currentPage = Math.min(Math.max(1, state.currentPage), totalPages);

    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const paginatedJokes = sortedJokes.slice(startIndex, endIndex);

    favoritesList.empty();

    const jokesHtml = paginatedJokes.map((joke) =>
      $("<li>").append(
        $("<div>").addClass("joke-text").text(joke.text),
        $("<div>")
          .addClass("joke-rating")
          .append(createRatingButtons(joke.id, joke.rating))
      )
    );

    favoritesList.append(jokesHtml);

    const showPagination = sortedJokes.length > state.itemsPerPage;
    const paginationContainer = $(".favorites-pagination");

    if (showPagination) {
      paginationContainer.show();
      $(".page-info").text(`Page ${state.currentPage} of ${totalPages}`);
      $(".prev-favorites").prop("disabled", state.currentPage === 1);
      $(".next-favorites").prop("disabled", state.currentPage === totalPages);
    } else {
      paginationContainer.hide();
    }
  }

  function setupPaginationControls() {
    $(".favorites-pagination").remove();

    const paginationHtml = `
        <div class="favorites-pagination">
            <button class="secondary-btn prev-favorites">Previous</button>
            <span class="page-info"></span>
            <button class="secondary-btn next-favorites">Next</button>
        </div>
    `;
    favoritesList.after(paginationHtml);

    $(".prev-favorites").on("click", () => {
      state.currentPage = Math.max(1, state.currentPage - 1);
      displayFavoriteJokes();
    });

    $(".next-favorites").on("click", () => {
      const maxPage = Math.ceil(state.favorites.length / state.itemsPerPage);
      state.currentPage = Math.min(maxPage, state.currentPage + 1);
      displayFavoriteJokes();
    });
  }

  // Event handlers
  searchForm.on("submit", async (e) => {
    e.preventDefault();
    await displaySearchResults(searchInput.val().trim());
  });

  $("#btnShowJoke").on("click", displayJoke);
  $("#btnAddFavorite").on("click", () => addToFavorites());
  $("#btnClearResults").on("click", clearSearchResults);
  $("#btnClearFavorites").on("click", clearFavorites);

  sortSelect.on("change", function () {
    state.sortOrder = $(this).val();
    localStorage.setItem("sortOrder", state.sortOrder);
    displayFavoriteJokes();
  });

  initializeApp();
});
