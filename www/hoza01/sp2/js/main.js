
const fetchQuestions = async () => {
  const questionsURL = `https://opentdb.com/api.php?amount=27&category=25&type=multiple`;
  const resp = await fetch(questionsURL);
  const data = await resp.json();
  return data.results;
};

let questions = [];
let activeQuestionIndex = 0;

const displayQuestion = () => {
  const questionElement = document.getElementById('question');
  const choicesElement = document.getElementById('choices');

  choicesElement.innerHTML = "";
  const activeQuestion = questions[activeQuestionIndex];
  questionElement.innerHTML = activeQuestion.question;

  const allChoices = [...activeQuestion.incorrect_answers, activeQuestion.correct_answer];
  allChoices.forEach(choice => {
    const button = document.createElement("button");
    button.innerHTML = choice;
    button.addEventListener("click", () => checkChoice(choice, activeQuestion.correct_answer));
    choicesElement.append(button);
  });

};

const checkChoice = (selectedChoice, correctChoice) => {
  if (selectedChoice === correctChoice) {
    alert("správně");
  } else {
    alert("špatně");
  }

  activeQuestionIndex++;
  if (activeQuestionIndex < questions.length) {
    displayQuestion();
  }
}

const startButton = document.getElementById("start-button");
const startGame = async () => {
  startButton.style.display = "none";

  questions = await fetchQuestions();
  activeQuestionIndex = 0;
  displayQuestion();


};
document.getElementById("start-button").addEventListener("click", startGame);