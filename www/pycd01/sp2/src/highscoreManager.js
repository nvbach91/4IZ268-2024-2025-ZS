export class HighScoreManager {
  nicknameElem = document.querySelector("#nickname");
  highscoreData = JSON.parse(localStorage.getItem("highscoreData"));
  scoreboardElem = document.querySelector("#scoreboard");
  resetButton = document.querySelector("#resetScoreboard");

  getNicknameElem() {
    return this.nicknameElem;
  }

  start() {
    this.resetButton.onclick = function () {
      this.highscoreData = [];
      this.scoreboardElem = document.querySelector("#scoreboard");
      this.scoreboardElem.innerHTML = "";
      localStorage.setItem("highscoreData", JSON.stringify(this.highscoreData));
    };
  }

  showHighscore() {
    if (this.highscoreData === null) {
      this.highscoreData = [];
    }
    this.scoreboardElem.innerHTML =
      "<thead><th>Points</th><th>Nickname</th><th>Score</th><th>Datetime</th></thead>";
    console.log(this.scoreboardElem);
    const rows = [];
    this.highscoreData = this.highscoreData.sort(
      (a, b) => parseInt(b.points) - parseInt(a.points),
    );
    this.highscoreData.forEach((playerRow) => {
      let rowElement = document.createElement("tr");
      rowElement.innerHTML =
        "<td>" +
        playerRow.points +
        "</td>" +
        "<td>" +
        playerRow.nickname +
        "</td>" +
        "<td>" +
        playerRow.score +
        "</td>" +
        "<td>" +
        new Date(playerRow.time).toLocaleString("en") +
        "</td>";
      rows.push(rowElement);
    });
    this.scoreboardElem.append(...rows);
  }

  setPlayerHighscore(nickname, points, score) {
    if (this.highscoreData === null) {
      this.highscoreData = [];
    }
    let entry = {
      nickname,
      points,
      score,
      time: new Date().toISOString(),
    };
    this.highscoreData.push(entry);
    this.showHighscore();

    localStorage.setItem("highscoreData", JSON.stringify(this.highscoreData));
  }
}
