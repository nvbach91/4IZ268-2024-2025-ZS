const App = {
  init: async function () {
    try {
      // Nastavení dnešního data
      this.setTodayDate();

      // Najdeme kontejnery pro výsledky
      this.resultsContainer = document.getElementById("results-container");
      this.soccerContainer = document.getElementById("soccer-container");
      this.loader = this.createLoader();
      this.resultsContainer.appendChild(this.loader.cloneNode(true));
      this.soccerContainer.appendChild(this.loader.cloneNode(true));

      // Načteme data z proxy serveru pro dnešní datum
      const mlbData = await this.fetchData("mlb");
      const soccerData = await this.fetchData("soccer");

      this.displayResults(mlbData, this.resultsContainer);
      this.displayResults(soccerData, this.soccerContainer);

      // Odstraníme loadery
      this.resultsContainer.querySelector(".loader")?.remove();
      this.soccerContainer.querySelector(".loader")?.remove();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  },

  setTodayDate: function () {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    // Nastavení dnešního data do inputu ve formátu YYYY-MM-DD
    const todayFormattedForInput = `${year}-${month}-${day}`;
    document.getElementById("date-input").value = todayFormattedForInput;
  },

  fetchData: async function (sport) {
    const dateInput = document.getElementById("date-input").value;

    // Převod na správný formát podle sportu
    const selectedDate = new Date(dateInput);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    const formattedDate =
      sport === "mlb" ? `${year}/${month}/${day}` : `${year}-${month}-${day}`;

    console.log(`Fetching ${sport.toUpperCase()} results for date: ${formattedDate}`);
    const url = `http://localhost:3000/api/${sport}?date=${formattedDate}`;

    try {
      const response = await axios.get(url);
      console.log(`Data received for ${sport}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${sport} data:`, error.message);
      return [];
    }
  },

  createLoader: function () {
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.textContent = "Loading...";
    return loader;
  },

  toggleSection: function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section.style.display === "none" || !section.style.display) {
      section.style.display = "block"; // Zobrazíme sekci
    } else {
      section.style.display = "none"; // Skryjeme sekci
    }
  },

  displayResults: function (data, container) {
    container.innerHTML = ""; // Vymažeme předchozí obsah

    if (data && data.league && Array.isArray(data.league.games)) {
      const games = data.league.games;

      games.forEach(({ game }) => {
        const homeName = game.home?.name || "Unknown Home Team";
        const awayName = game.away?.name || "Unknown Away Team";
        const scheduled = game.scheduled || "Unknown Date";
        const venueName = game.venue?.name || "Unknown Venue";
        const homeScore = game.home.runs || "N/A";
        const awayScore = game.away.runs || "N/A";

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h2>${homeName} vs. ${awayName}</h2>
          <p>Date: ${new Date(scheduled).toLocaleString()}</p>
          <p>Venue: ${venueName}</p>
          <p>Score: ${homeScore} - ${awayScore}</p>
        `;
        container.appendChild(card);
      });
    } else if (data && data.schedules && Array.isArray(data.schedules)) {
      const matches = data.schedules;

      matches.forEach((match) => {
        const sport_event = match.sport_event;
        const sport_event_status = match.sport_event_status;

        if (!sport_event || !sport_event_status) return;

        const homeName = sport_event.competitors[0]?.name || "Unknown Home Team";
        const awayName = sport_event.competitors[1]?.name || "Unknown Away Team";
        const homeScore = sport_event_status.home_score ?? "N/A";
        const awayScore = sport_event_status.away_score ?? "N/A";
        const matchStatus = sport_event_status.match_status || "Unknown Status";
        const scheduled = sport_event.start_time || "Unknown Date";

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h2>${homeName} vs. ${awayName}</h2>
          <p>Score: ${homeScore} - ${awayScore}</p>
          <p>Date: ${new Date(scheduled).toLocaleString()}</p>
          <p>Status: ${matchStatus}</p>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = "<p>No data available.</p>";
    }
  },
};

// Připojení události na tlačítko
document.getElementById("submit-date").addEventListener("click", async () => {
  const mlbData = await App.fetchData("mlb");
  const soccerData = await App.fetchData("soccer");

  App.displayResults(mlbData, App.resultsContainer);
  App.displayResults(soccerData, App.soccerContainer);
});

// Spuštění aplikace při načtení stránky
document.addEventListener("DOMContentLoaded", () => App.init());
