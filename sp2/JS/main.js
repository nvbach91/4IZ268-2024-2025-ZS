const API_KEY = 'wcjTZpjqrrT9lDL9xHSZXFtG6MkMAjujYpQcpbtx';

let QUESTIONS = [];
let CURRENT_QUESTION_INDEX = 0;
let CURRENT_CATEGORY = '';
let CORRECT_ANSWERS_COUNT = 0;
let INCORRECT_ANSWERS_COUNT = 0;

let ALL_STATS = {};

function initState(questions, category) {
    QUESTIONS = questions;
    CURRENT_CATEGORY = category;
    CURRENT_QUESTION_INDEX = 0;
    CORRECT_ANSWERS_COUNT = 0;
    INCORRECT_ANSWERS_COUNT = 0;
};

function updateStateFromStorage(category) {
    const state = JSON.parse(localStorage.getItem(`${category}-state`));
    if (state === null) {
        return;
    }

    QUESTIONS = state.questions;
    CURRENT_QUESTION_INDEX = state.currentQuestionIndex;
    CURRENT_CATEGORY = state.currentCategory;
    CORRECT_ANSWERS_COUNT = state.correctAnswersCount;
    INCORRECT_ANSWERS_COUNT = state.incorrectAnswersCount;
}

function nextQuestion() {
    if (CURRENT_QUESTION_INDEX < QUESTIONS.length) {
        localStorage.setItem(`${CURRENT_CATEGORY}-state`, JSON.stringify({
            questions: QUESTIONS,
            currentQuestionIndex: CURRENT_QUESTION_INDEX,
            currentCategory: CURRENT_CATEGORY,
            correctAnswersCount: CORRECT_ANSWERS_COUNT,
            incorrectAnswersCount: INCORRECT_ANSWERS_COUNT
        }));

        renderQuestion(QUESTIONS[CURRENT_QUESTION_INDEX]);

        return;
    }

    localStorage.setItem(`${CURRENT_CATEGORY}-state`, null);
    setButtonsText();

    const currentStats = calculateStats();
    ALL_STATS[CURRENT_CATEGORY].correct += currentStats.correct;
    ALL_STATS[CURRENT_CATEGORY].incorrect += currentStats.incorrect;
    localStorage.setItem('stats', JSON.stringify(ALL_STATS));

    const $categoriesSection = $('#questions-section');
    $categoriesSection.html(`
        <p>Konec 10 náhodně vygenerovaných otázek, podívej se jak sis vedl:</p>
        <p>Správné odpovědi: ${currentStats.correct}</p>
        <p>Špatné odpovědi: ${currentStats.incorrect}</p>
        <button id="restart-category">Zopakovat kategorii</button>
        <button id="back-to-categories">Zpět na výběr kategorií</button>
        <button id="reset-stats">Vynulovat statistiky</button>
    `);

    $("#restart-category").on("click", function () {
        fetchQuestions(CURRENT_CATEGORY, () => {
            nextQuestion();
            $('#stats-section').hide();
        });
    });

    $("#back-to-categories").on("click", function () {
        $('#categories-section').show();
        $('#stats-section').show();
        $('#questions-section').hide();
    });

    $("#reset-stats").on("click", function () {
        localStorage.setItem('stats', null);
        resetStats();
        renderOverallCharts();
    });

    renderOverallCharts();
}

function renderQuestion(question) {
    const $categoriesSection = $('#questions-section');
    $categoriesSection.empty();

    const $categoryDiv = $('<div>').addClass('category');
    const $buttonsDiv = $('<div>').addClass('buttons');

    let answersHtml = '';

    $.each(question.answers, (key, value) => {
        if (value !== null) {
            const isCorrect = question.correct_answers[`${key}_correct`] === 'true';

            answersHtml += `
                <button class="answer" data-key="${key}" data-question-id="${question.id}" data-is-correct="${isCorrect}">
                    ${key.split('_')[1].toUpperCase()}) ${value}
                </button>
            `;
        }
    });

    $categoryDiv.html(`
        <h2>Otázka ${CURRENT_QUESTION_INDEX + 1}: ${question.question}</h2>
        <div class="answers">${answersHtml}</div>
        <p class="feedback" id="feedback-${question.id}" style="display:none;"></p>
    `);

    $buttonsDiv.html(`
        <div id="questionButtons" class="questionButtons">
            <button id="question-previous" style="display:none;">Předchozí otázka</button>
            <button id="question-next" style="display:none;">Další otázka</button>
            <button id="question-result" style="display:none;">Výsledky</button>
        </div>
    `);

    $buttonsDiv.find('#question-next').on('click', function () {
        CURRENT_QUESTION_INDEX++;
        nextQuestion();
    });

    $buttonsDiv.find('#question-previous').on('click', function () {
        CURRENT_QUESTION_INDEX--;
        nextQuestion();
    });

    $buttonsDiv.find('#question-result').on('click', function () {
        CURRENT_QUESTION_INDEX = QUESTIONS.length;
        nextQuestion();
    });

    $categoriesSection.append($categoryDiv);
    $categoriesSection.append($buttonsDiv);
}


function fetchQuestions(category, callback) {
  

    let url = '';

    switch (category) {
        case 'Linux':
            url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=linux&difficulty=Easy&limit=10`;
            break;
        case 'Code':
            url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=code&difficulty=Easy&limit=10`;
            break;
        case 'SQL':
            url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=sql&difficulty=Easy&limit=10`;
            break;
        case 'Docker':
            url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=docker&difficulty=Easy&limit=10`;
            break;
        default:
            console.error('Neznámá kategorie');
            return;
    }


    $.ajax({
        url: url,
        method: 'GET',
        success: function (questions) {
         

            initState(questions, category);
            callback();
        },
        error: function (xhr, status, error) {
            console.error('Chyba při získávání otázek:', status, error);
        }
    });
}


function checkAnswer(selectedAnswer, questionId) {
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) {
        console.error('Otázka nebyla nalezena!');
        return;
    }

    const isCorrect = question.correct_answers[`${selectedAnswer}_correct`] === 'true';

    const $feedbackElement = $(`#feedback-${questionId}`);
    const $CORRECT_ANSWERS_COUNT = $('<p>').addClass('correct-answer');

    // Zobrazení správné odpovědi
    $.each(question.answers, (key, value) => {
        if (question.correct_answers[`${key}_correct`] === 'true') {
            $CORRECT_ANSWERS_COUNT.text(`Správná odpověď je: ${key.split('_')[1].toUpperCase()}) ${value}`);
        }
    });

    if (isCorrect) {
        CORRECT_ANSWERS_COUNT++;
        $feedbackElement.text('Správná odpověď!').css('color', 'green');
    } else {
        INCORRECT_ANSWERS_COUNT++;
        $feedbackElement.text('Špatná odpověď.').css('color', 'red');
        $feedbackElement.after($CORRECT_ANSWERS_COUNT); 
    }

    if (CURRENT_QUESTION_INDEX !== 0) {
        const $previousQuestionButton = $('#question-previous');
        $previousQuestionButton.show();
    }
    
    if (CURRENT_QUESTION_INDEX !== QUESTIONS.length - 1) {
        const $nextQuestionButton = $('#question-next');
        $nextQuestionButton.show();
    }

    if (CURRENT_QUESTION_INDEX === QUESTIONS.length - 1) {
        const $resultButton = $('#question-result');
        $resultButton.show();
    }

    $feedbackElement.show();

    // Deaktivujeme tlačítka
    $('.answer').prop('disabled', true);
}


function calculateStats() {
    const currentStats = {
        correct: CORRECT_ANSWERS_COUNT,
        incorrect: INCORRECT_ANSWERS_COUNT,
    };
    return currentStats;
}

function renderOverallCharts() {
    const $statsSection = $('#stats-section');
    $statsSection.show();

    const categories = ['Linux', 'Code', 'SQL', 'Docker'];
    
    categories.forEach(category => {
        const canvasId = `chart-${category}`;
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        if (window.chartInstances && window.chartInstances[canvasId]) {
            window.chartInstances[canvasId].destroy();
        }

        const data = [ALL_STATS[category]?.correct || 0, ALL_STATS[category]?.incorrect || 0];
        
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Správně', 'Špatně'],
                datasets: [{
                    label: category,
                    data: data,
                    borderColor: '#74d7cd',
                    backgroundColor: 'rgba(116, 215, 205, 0.5)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
  
                    }
                }
            }
        });

        window.chartInstances = window.chartInstances || {};
        window.chartInstances[canvasId] = chart;
    });
}


$(document).ready(function () {
    initStats();
    returnHome();

    $("#reset-stats-home").on("click", function () {
        localStorage.setItem('stats', null);
        resetStats();
        renderOverallCharts();
    });
});


$('#questions-section').on('click', 'button.answer', function () {
    const selectedAnswer = $(this).data('key');
    const questionId = $(this).data('question-id');
    checkAnswer(selectedAnswer, questionId);
});


$('#category-1-button').on('click', function () {
    fetchQuestions('Linux', () =>  { 
        updateStateFromStorage('Linux');
        nextQuestion();
        $('#categories-section').hide();
        $('#questions-section').show();
        $('#stats-section').hide();
    });
});

$('#category-2-button').on('click', function () {
    fetchQuestions('Code', () => {
        updateStateFromStorage('Code');
        nextQuestion();
        $('#categories-section').hide();
        $('#questions-section').show();
        $('#stats-section').hide();
    });
});

$('#category-3-button').on('click', function () {
    fetchQuestions('SQL', () => {
        updateStateFromStorage('SQL');
        nextQuestion();
        $('#categories-section').hide();
        $('#questions-section').show();
        $('#stats-section').hide();
    });
});

$('#category-4-button').on('click', function () {
    fetchQuestions('Docker', () => {
        updateStateFromStorage('Docker');
        nextQuestion();
        $('#categories-section').hide();
        $('#questions-section').show();
        $('#stats-section').hide();
    });
});

$('.header-title').on('click', function () {
    returnHome();
});

$('.header-title, .profile-link').on('click', function () {
    returnHome();
});

function returnHome() {
    setButtonsText();

    $('#questions-section').hide();
    $(".categories").show();

    document.getElementById('stats-section').style.display = 'block';
    sessionStorage.removeItem('gameState_' + CURRENT_CATEGORY);

    if (window.chartInstances) {
        Object.values(window.chartInstances).forEach(chart => chart.destroy());
        window.chartInstances = {}; 
    }

   
    const stats = JSON.parse(localStorage.getItem('categoryStats')) || {};
    renderOverallCharts(stats);  
}

let startTime = Date.now();
let timeSpent = 0;  


function updateTimeSpent() {
    const now = Date.now();
    timeSpent = Math.floor((now - startTime) / 1000);  
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    document.getElementById('time-spent').textContent = `${minutes}m ${seconds}s`; // Aktualizace textu
}

setInterval(updateTimeSpent, 1000);


function initStats() {
    const stats = JSON.parse(localStorage.getItem('stats'));
    if (stats !== null) {
        ALL_STATS = stats;
        return;
    }

    resetStats();
}

function resetStats() {
    ALL_STATS = {
        Linux: { correct: 0, incorrect: 0 },
        Code: { correct: 0, incorrect: 0 },
        SQL: { correct: 0, incorrect: 0 },
        Docker: { correct: 0, incorrect: 0 }
    };
}

function setButtonsText() {
    if (JSON.parse(localStorage.getItem('Linux-state')) !== null) {
        $('#category-1-button').text('Continue Learning');
    }
    else {
        $('#category-1-button').text('Start Learning');
    }

    if (JSON.parse(localStorage.getItem('Code-state')) !== null) {
        $('#category-2-button').text('Continue Learning');
    }
    else {
        $('#category-2-button').text('Start Learning');
    }

    if (JSON.parse(localStorage.getItem('SQL-state')) !== null) {
        $('#category-3-button').text('Continue Learning');
    }
    else {
        $('#category-3-button').text('Start Learning');
    }

    if (JSON.parse(localStorage.getItem('Docker-state')) !== null) {
        $('#category-4-button').text('Continue Learning');
    }
    else {
        $('#category-4-button').text('Start Learning');
    }
}
