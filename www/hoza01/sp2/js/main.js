const fetchQuestions = async (difficulty) => {
  try {
    const questionsURL = `https://opentdb.com/api.php?amount=5&category=25&difficulty=${difficulty}`;
    const resp = await fetch(questionsURL);
    const data = await resp.json();

    console.log("API Response:", data);

    if (data.results && data.results.length > 0) {
      return data.results;
    } else {
      throw new Error("No questions found.");

    }
  } catch (error) {
    console.error("Error while loading data.", error);
    Swal.fire({
      title: "Error",
      text: "Too many requests.",
      icon: "error"
    });
    elementsVisibility([loadingSpinner], [startButton, welcomeSpeech]);
    return [];
  }
};

let questions = [];
let activeQuestionIndex = 0;
let score = 0;

const totalQuestions = 5;
const startButton = document.getElementById("start-button");
const scoreElement = document.getElementById("score");
const progressContainer = document.getElementById("progressContainer");
const loadingSpinner = document.getElementById("spinner");
const welcomeSpeech = document.getElementById("welcome-speech");
const difficultyButtons = document.getElementById("difficulty-buttons");

const elementsVisibility = (toHide, toShow) => {
  toHide.forEach(el => el.classList.add("d-none"));
  toShow.forEach(el => el.classList.remove("d-none"));
};

const startGame = async (difficulty) => {
  const savedState = loadState();

  if (savedState) {
    Swal.fire({
      title: "Keep playing?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        elementsVisibility([], [loadingSpinner]);

        questions = await fetchQuestions(difficulty);
        if (!questions || questions.length === 0) {
          return;
        }
        activeQuestionIndex = savedState.activeQuestionIndex + 1;
        score = savedState.score;

        elementsVisibility([loadingSpinner], [scoreElement, progressContainer]);

        scoreElement.textContent = `Score: ${score}/${totalQuestions}`;

        displayQuestion();

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        localStorage.removeItem("gameState");
        newGame(difficulty);
      }
    });
  } else {
    newGame(difficulty);
  }
};

const newGame = async (difficulty) => {
  elementsVisibility([], [loadingSpinner]);

  questions = await fetchQuestions(difficulty);
  if (!questions || questions.length === 0) {
    return;
  }

  elementsVisibility([loadingSpinner], [scoreElement, progressContainer]);
  scoreElement.textContent = `Score: 0/${totalQuestions}`;

  activeQuestionIndex = 0;
  score = 0;

  displayQuestion();
};

startButton.addEventListener("click", () => {
  elementsVisibility([welcomeSpeech, startButton], [difficultyButtons]);
});

const chooseDifficulty = (difficulty) => {
  elementsVisibility([difficultyButtons], []);
  startGame(difficulty);
}

const easyDifficulty = document.getElementById("easy-button");
const mediumDifficulty = document.getElementById("medium-button");
const hardDifficulty = document.getElementById("hard-button");

easyDifficulty.addEventListener("click", () => {
  chooseDifficulty("easy");
  maxTime = 150;
});
mediumDifficulty.addEventListener("click", () => {
  chooseDifficulty("medium");
  maxTime = 100;
});
hardDifficulty.addEventListener("click", () => {
  chooseDifficulty("hard");
  maxTime = 50;
});

const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");

const displayQuestion = () => {
  startTimer(maxTime);

  choicesElement.innerHTML = "";
  const activeQuestion = questions[activeQuestionIndex];
  questionElement.innerHTML = activeQuestion.question;

  const fragment = document.createDocumentFragment();

  const allChoices = [...activeQuestion.incorrect_answers, activeQuestion.correct_answer];
  allChoices.sort(() => Math.random() - 0.5);
  allChoices.forEach(choice => {
    const button = document.createElement("button");
    button.innerHTML = choice;
    button.classList.add("choice-button", "btn", "m-2", "btn-success");
    button.addEventListener("click", () => checkChoice(choice, activeQuestion.correct_answer));
    fragment.appendChild(button);
  });
  choicesElement.appendChild(fragment);
};

const countingScore = () => {
  score++;
  scoreElement.textContent = `Score: ${score}/${totalQuestions}`;
};

const checkChoice = (selectedChoice, correctChoice) => {
  if (selectedChoice === correctChoice) {
    Swal.fire({
      title: "Great job!",
      text: "Your answer is correct!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500
    });
    countingScore();

  } else {
    Swal.fire({
      title: "Oops!",
      text: "No worries, you'll get it next time!",
      icon: "error",
      showConfirmButton: false,
      timer: 1500
    });
  }

  saveState();

  activeQuestionIndex++;
  if (activeQuestionIndex < totalQuestions) {
    displayQuestion();
  } else {
    endGame();
  }
};

const playAgainButton = document.getElementById("restart-button");
const closingSpeech = document.getElementById("closing-speech");
const nameContainer = document.getElementById("name-container");

const endGame = () => {
  choicesElement.innerHTML = "";
  questionElement.innerHTML = "";
  localStorage.removeItem("gameState");

  elementsVisibility([progressContainer], [closingSpeech, nameContainer]);
  scoreElement.textContent = `Total score: ${score}/${totalQuestions}`;
  clearInterval(timerInterval);
};

const playAgain = () => {
  score = 0;
  elementsVisibility([playAgainButton, closingSpeech, deleteHistoryButton, historyElement], [difficultyButtons]);
  scoreElement.textContent = `Score: ${score}/${totalQuestions}`;
};
playAgainButton.addEventListener("click", playAgain);

let maxTime = null;
let timeLeft = maxTime;
let timerInterval;

const progressBar = document.getElementById("progress-bar");

const startTimer = () => {
  let timeLeft = maxTime;

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    timeLeft--;
    console.log("Remaining time:", timeLeft);
    const progressPercent = (timeLeft / maxTime) * 100;
    progressBar.style.width = `${progressPercent}%`;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      saveState();
      handleTimeout();
    }
  }, 100);
};

const handleTimeout = () => {
  Swal.fire({
    title: "Oops!",
    text: "No worries, you'll get it next time!",
    icon: "error",
    showConfirmButton: false,
    timer: 1500
  });
  activeQuestionIndex++;

  if (activeQuestionIndex < totalQuestions) {
    displayQuestion();
  } else {
    endGame();
  }
};

const saveState = () => {
  const state = {
    activeQuestionIndex: activeQuestionIndex,
    score: score,
  };
  console.log("the game state is saved:", state);
  localStorage.setItem("gameState", JSON.stringify(state));
};

const loadState = () => {
  const savedState = localStorage.getItem("gameState");
  return savedState ? JSON.parse(savedState) : null;
};

const playerNameInput = document.getElementById("player-name");

const savePlayerName = () => {
  const playerName = playerNameInput.value.trim();

  if (!playerName) {
    Swal.fire("Please enter your name!");
    return;
  }

  saveGame(playerName, score);
  showHistory();

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Your game has been saved",
    showConfirmButton: false,
    timer: 1500
  });
};

const submitButton = document.getElementById("button-addon2");

submitButton.addEventListener("click", () => {
  savePlayerName();
});

let gameHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];

const saveGame = (playerName, score) => {
  const dataGame = {
    playerName: playerName,
    score: score,
    timestamp: new Date().toISOString(),
  };
  gameHistory.push(dataGame);
  localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  console.log("Game history:", dataGame);
};

const historyElement = document.getElementById("game-history");
const historyTable = document.getElementById("history-table");

const showHistory = () => {
  elementsVisibility([closingSpeech, scoreElement, nameContainer], [historyElement, deleteHistoryButton, playAgainButton]);

  if (gameHistory.length === 0) {
    historyTable.innerHTML = "<tr><td colspan='4'>No games played yet.</td></tr>";
    return;
  }

  historyTable.innerHTML = gameHistory
    .sort((a, b) => b.score - a.score)
    .map(
      (game, index) => `
        <tr>
          <td>${game.playerName}</td>
          <td>${game.score}</td>
          <td>${new Date(game.timestamp).toLocaleString()}</td>
          <td><button class="delete-button btn btn-light" data-index="${index}">Delete</button></td>
        </tr> 
      `
    )
    .join("");

  const deleteButtons = document.querySelectorAll(".delete-button");
  if (deleteButtons.length > 0) {
    deleteButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        deleteHistory(index);
      });
    });
  }
};

const deleteHistory = (index) => {
  gameHistory.splice(index, 1);
  localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  showHistory();

};

const clearAllHistory = () => {
  localStorage.removeItem("gameHistory");
  gameHistory = [];
  showHistory();
};

const deleteHistoryButton = document.getElementById("delete-history");
deleteHistoryButton.addEventListener("click", clearAllHistory);