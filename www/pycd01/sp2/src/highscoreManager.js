export class HighScoreManager {
  nicknameElem = document.querySelector("#nickname");

  getNicknameElem() {
    return this.nicknameElem;
  }
}
let highscoreData = [
  {
    nickname: "aaa",
    highscore: 150305,
    score: "5 - 3",
    time: "25. 12. 2022 - 15:30:20",
  },
];
localStorage.setItem("highscoreData", JSON.stringify(highscoreData));
