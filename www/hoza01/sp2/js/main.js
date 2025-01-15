const fetchQuestions = async () => {
  const questionsURL = `https://opentdb.com/api.php?amount=27&category=25&type=multiple`;

  try {
    const resp = await fetch(questionsURL);
    const data = await resp.json();

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

const startGame = async () => {
  const savedState = loadState();

  if (savedState) {
    Swal.fire({
      title: "Keep playing?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        loadingSpinner.classList.remove("d-none");

        questions = await fetchQuestions();
        activeQuestionIndex = savedState.activeQuestionIndex + 1;
        score = savedState.score;

        loadingSpinner.classList.add("d-none");
        scoreElement.textContent = `Score: ${score}/${totalQuestions}`;
        scoreElement.classList.remove("d-none");
        progressContainer.classList.remove("d-none");

        displayQuestion();

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        localStorage.removeItem("gameState");
        newGame();
      }
    });
  } else {
    newGame();
  }
};

const newGame = async () => {
  loadingSpinner.classList.remove("d-none");

  questions = await fetchQuestions();

  loadingSpinner.classList.add("d-none");
  scoreElement.classList.remove("d-none");
  scoreElement.textContent = `Score: 0/${totalQuestions}`;
  progressContainer.classList.remove("d-none");

  activeQuestionIndex = 0;
  score = 0;

  displayQuestion();
};

startButton.addEventListener("click", () => {
  welcomeSpeech.classList.add("d-none");
  startButton.classList.add("d-none");
  startGame();
});

const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");

const displayQuestion = () => {
  startTimer();

  choicesElement.innerHTML = "";
  const activeQuestion = questions[activeQuestionIndex];
  questionElement.innerHTML = activeQuestion.question;

  const allChoices = [...activeQuestion.incorrect_answers, activeQuestion.correct_answer];
  allChoices.sort(() => Math.random() - 0.5);
  allChoices.forEach(choice => {
    const button = document.createElement("button");
    button.innerHTML = choice;
    button.classList.add("choice-button", "btn", "m-2", "btn-success");
    button.addEventListener("click", () => checkChoice(choice, activeQuestion.correct_answer, activeQuestion.incorrect_answers));
    choicesElement.append(button);
  });
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

const endGame = () => {
  choicesElement.innerHTML = "";
  questionElement.innerHTML = "";

  playAgainButton.classList.remove("d-none");
  scoreElement.textContent = `Total score: ${score}/${totalQuestions}`;
  progressContainer.classList.add("d-none");
  clearInterval(timerInterval);
  closingSpeech.classList.remove("d-none");
};

const playAgain = () => {
  localStorage.removeItem("gameState");
  playAgainButton.classList.add("d-none");
  score = 0;
  scoreElement.textContent = `Score: ${score}/${totalQuestions}`;
  closingSpeech.classList.add("d-none");

  startGame();
};
playAgainButton.addEventListener("click", playAgain);

const maxTime = 10 * 10;
let timeLeft = maxTime;
let timerInterval;

const startTimer = () => {
  timeLeft = maxTime;
  const progressBar = document.getElementById("progress-bar");

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    timeLeft--;
    const progressPercent = (timeLeft / maxTime) * 100;
    progressBar.style.width = `${progressPercent}%`;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
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