const App = {
  corsProxyURL: "https://api.codetabs.com/v1/proxy?quest=",

  init: async function () {
    try {
      this.setTodayDate();
  
      this.resultsContainer = document.getElementById("results-container");
      this.soccerContainer = document.getElementById("soccer-container");
      this.loader = this.createLoader();
      this.resultsContainer.appendChild(this.loader.cloneNode(true));
      this.soccerContainer.appendChild(this.loader.cloneNode(true));
  
      const mlbData = await this.fetchData("mlb");
      const soccerData = await this.fetchData("soccer");
  
      this.displayResults(mlbData, this.resultsContainer);
      this.displayResults(soccerData, this.soccerContainer);
  
      this.addTeamLinksEvent();
  
      this.resultsContainer.querySelector(".loader")?.remove();
      this.soccerContainer.querySelector(".loader")?.remove();
  
      document.getElementById("date-input").addEventListener("change", async () => {
        const mlbData = await this.fetchData("mlb");
        const soccerData = await this.fetchData("soccer");
  
        this.displayResults(mlbData, this.resultsContainer);
        this.displayResults(soccerData, this.soccerContainer);
      });
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  },

  setTodayDate: function () {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    document.getElementById("date-input").value = `${year}-${month}-${day}`;
  },

  fetchData: async function (sport) {
    const dateInput = document.getElementById("date-input").value;
    const selectedDate = new Date(dateInput);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    const formattedDate =
      sport === "mlb" ? `${year}/${month}/${day}` : `${year}-${month}-${day}`;

    console.log(`Fetching ${sport.toUpperCase()} results for date: ${formattedDate}`);

    const apiKey = "tG40ttntc5R9FhKlPONiYvTBINTDUCMSNzCDLrnf";
    const baseURL =
      sport === "mlb"
        ? `https://api.sportradar.com/mlb/trial/v7/en/games/${formattedDate}/boxscore.json`
        : `https://api.sportradar.com/soccer/trial/v4/en/schedules/${formattedDate}/schedules.json`;

    const fullURL = `${this.corsProxyURL}${encodeURIComponent(baseURL + `?api_key=${apiKey}`)}`;

    try {
      console.log("Calling API with URL:", fullURL);
      const response = await $.getJSON(fullURL);
      console.log(`Data received for ${sport}:`, response);
      return response;
    } catch (error) {
      console.error(`Error fetching ${sport} data:`, error.responseText || error.message);
      return [];
    }
  },

  fetchTeamProfile: async function (teamId) {
    const apiKey = "tG40ttntc5R9FhKlPONiYvTBINTDUCMSNzCDLrnf";
    const baseURL = `https://api.sportradar.com/soccer/trial/v4/en/competitors/${encodeURIComponent(
      teamId
    )}/profile.json?api_key=${apiKey}`;
    const fullURL = `${this.corsProxyURL}${encodeURIComponent(baseURL)}`;

    try {
      console.log("Fetching team profile with URL:", fullURL);
      const response = await $.getJSON(fullURL);

      let profileContainer = document.getElementById("team-profile-container");
      if (!profileContainer) {
        profileContainer = document.createElement("div");
        profileContainer.id = "team-profile-container";
        profileContainer.className = "profile-container";
        document.body.appendChild(profileContainer);
      }

      profileContainer.innerHTML = `
        <h2>Profil týmu: ${response.competitor.name}</h2>
        <p>Zkratka týmu: ${response.competitor.abbreviation || "N/A"}</p>
        <p>Země: ${response.category?.name || "N/A"}</p>
        <p>Trenér: ${response.manager?.name || "N/A"}</p>
        <p>Kapacita stadionu: ${response.venue?.capacity || "N/A"}</p>
      `;

      profileContainer.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching team profile:", error.responseText || error.message);
      alert("Nepodařilo se načíst profil týmu.");
    }
  },

  addTeamLinksEvent: function () {
    document.body.addEventListener("click", (event) => {
      const link = event.target.closest(".team-link");
      if (link) {
        event.preventDefault();
        const teamId = link.getAttribute("data-team-id");
        if (teamId) {
          this.fetchTeamProfile(teamId);
        } else {
          alert("Neplatné ID týmu.");
        }
      }
    });
  },

  createLoader: function () {
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.textContent = "Loading...";
    return loader;
  },

  displayResults: function (data, container) {
    container.innerHTML = "";

    if (data && data.schedules && Array.isArray(data.schedules)) {
      const matches = data.schedules;

      matches.forEach((match) => {
        const home = match.sport_event.competitors[0];
        const away = match.sport_event.competitors[1];

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h2>
            <a href="#" class="team-link" data-team-id="${home.id}">${home.name}</a> vs.
            <a href="#" class="team-link" data-team-id="${away.id}">${away.name}</a>
          </h2>
          <p>Score: ${match.sport_event_status.home_score ?? "N/A"} - ${
          match.sport_event_status.away_score ?? "N/A"
        }</p>
          <p>Date: ${new Date(match.sport_event.start_time).toLocaleString()}</p>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = "<p>No data available.</p>";
    }
  },
};

// Event listener pro tlačítko
document.getElementById("date-input").addEventListener("change", async () => {
  const mlbData = await this.fetchData("mlb");
  const soccerData = await this.fetchData("soccer");

  this.displayResults(mlbData, this.resultsContainer);
  this.displayResults(soccerData, this.soccerContainer);
});

// Spuštění aplikace
document.addEventListener("DOMContentLoaded", () => App.init());
