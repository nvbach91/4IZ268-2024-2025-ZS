const API_KEY = 'wcjTZpjqrrT9lDL9xHSZXFtG6MkMAjujYpQcpbtx';
const $questionsSection = $('#questions-section');
const $categoriesSection = $('#categories-section');
const $statsSection = $('#stats-section');
const $loader = $('#loader');

let questions = [];
let current_questions_index = 0;
let current_category = '';
let correct_answers_count = 0;
let incorrect_answers_count = 0;
let userAnswers = {};  
let all_stats = {};

function initState(questions_setup, category, difficulty) {
    questions = questions_setup;
    current_category = category;
    current_difficulty = difficulty;
    current_questions_index = 0; // 
    correct_answers_count = 0;
    incorrect_answers_count = 0;
}

function updateStateFromStorage(category, difficulty) {
    const storageKey = `${category}-${difficulty}-state`; // 
    const state = JSON.parse(localStorage.getItem(storageKey));

    if (state === null) {
        console.warn(`Nebyl nalezen žádný uložený stav pro: ${storageKey}`);
        return;
    }

    console.log("Obnovuji uložený stav:", state);
    questions = state.questions;
    current_questions_index = state.currentQuestionIndex;
    current_category = state.currentCategory;
    current_difficulty = state.currentDifficulty;
    correct_answers_count = state.correctAnswersCount;
    incorrect_answers_count = state.incorrectAnswersCount;
}


function nextQuestion() {
    if (current_questions_index < questions.length) {
        const storageKey = `${current_category}-${current_difficulty}-state`; 
        localStorage.setItem(storageKey, JSON.stringify({
            questions: questions,
            currentQuestionIndex: current_questions_index,
            currentCategory: current_category,
            currentDifficulty: current_difficulty,
            correctAnswersCount: correct_answers_count,
            incorrectAnswersCount: incorrect_answers_count
        }));

        renderQuestion(questions[current_questions_index]);
        return;
    }

   
    localStorage.removeItem(`${current_category}-${current_difficulty}-state`);
    setButtonsText();

 
    const currentStats = calculateStats();
    all_stats[current_category] = all_stats[current_category] || { correct: 0, incorrect: 0 };
    all_stats[current_category].correct += currentStats.correct;
    all_stats[current_category].incorrect += currentStats.incorrect;
    localStorage.setItem('stats', JSON.stringify(all_stats));

   
  

        $questionsSection.html(`
        <p>Konec 10 náhodně vygenerovaných otázek, podívej se jak sis vedl:</p>
        <p>Správné odpovědi: ${currentStats.correct}</p>
        <p>Špatné odpovědi: ${currentStats.incorrect}</p>
        <button id="restart-category">Zopakovat kategorii</button>
        <button id="back-to-categories">Zpět na výběr kategorií</button>
        <button id="reset-stats">Vynulovat statistiky</button>
    `);

    $("#restart-category").on("click", function () {
        fetchQuestions(current_category, current_difficulty, () => {
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
    console.log(question.question);

    const $categoriesSection = $('#questions-section');
    $categoriesSection.empty();

    const $categoryDiv = $('<div>').addClass('category');
    const $buttonsDiv = $('<div>').addClass('buttons');

    let answersHtml = '';
    const isAnswered = userAnswers.hasOwnProperty(question.id); 
    const selectedAnswer = userAnswers[question.id]; // 

    $.each(question.answers, (key, value) => {
        if (value !== null) {
            const isCorrect = question.correct_answers[`${key}_correct`] === 'true';
            const isSelected = selectedAnswer === key; 

            answersHtml += `
                <button class="answer" data-key="${key}" data-question-id="${question.id}" data-is-correct="${isCorrect}"
                    ${isAnswered ? 'disabled' : ''} 
                    ${isSelected ? 'style="background-color: lightblue;"' : ''}>
                    ${key.split('_')[1].toUpperCase()}) ${value}
                </button>
            `;
        }
    });

    $categoryDiv.html(`
        <h2>Otázka ${current_questions_index + 1}: ${question.question}</h2>
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

    if (current_questions_index > 0) {
        $buttonsDiv.find('#question-previous').show();
    }

    if (current_questions_index < questions.length - 1) {
        $buttonsDiv.find('#question-next').show();
    }

    if (current_questions_index === questions.length - 1) {
        $buttonsDiv.find('#question-result').show();
    }


    $buttonsDiv.find('#question-next').on('click', function () {
        current_questions_index++;
        nextQuestion();
    });

    $buttonsDiv.find('#question-previous').on('click', function () {
        current_questions_index--;
        nextQuestion();
    });

    $buttonsDiv.find('#question-result').on('click', function () {
        current_questions_index = questions.length;
        nextQuestion();
    });

    $categoriesSection.append($categoryDiv);
    $categoriesSection.append($buttonsDiv);
}

    function fetchQuestions(category, difficulty, callback) {
        const API_BASE_URL = 'https://quizapi.io/api/v1/questions?apiKey=';
        const randomParam = `nocache=${new Date().getTime()}`;
        const url = `${API_BASE_URL}${API_KEY}&category=${category.toLowerCase()}&difficulty=${difficulty}&limit=10&${randomParam}`;
    
        console.log(`Odesílám dotaz na API: ${url}`);
    
        $loader.show();
    
        const storageKey = `${category}-${difficulty}-state`;
        const savedState = JSON.parse(localStorage.getItem(storageKey));
    
        if (savedState && savedState.currentDifficulty === difficulty && savedState.currentCategory === category) {
            console.log("Obnovuji uložený stav:", savedState);
            updateStateFromStorage(category, difficulty);
            $loader.hide();
            callback(questions, category, difficulty);
            return;
        }
    
        console.log(`Změna obtížnosti nebo nová hra, načítám nové otázky...`);
        $.ajax({
            url: url,
            method: 'GET',
            success: function (questionsData) {
                $loader.hide();
                console.log("Načtené otázky:", questionsData);
    
                if (!questionsData || questionsData.length === 0) {
                    console.error("API nevrátilo žádné otázky!");
                    return;
                }
    
                const filteredQuestions = questionsData.filter(q => q.multiple_correct_answers === "false");
    
                console.log(`Počet otázek po filtrování: ${filteredQuestions.length}`);
    
                if (filteredQuestions.length === 0) {
                    console.warn("Všechny otázky byly multiple-choice a byly odstraněny");
                    return;
                }


    
                initState(filteredQuestions, category, difficulty);
                saveStateToStorage();
    
                console.log("Data před voláním callbacku:", {
                    questions: filteredQuestions,
                    category: category,
                    difficulty: difficulty
                });
    
                callback(filteredQuestions, category, difficulty);
            },
            error: function (xhr, status, error) {
                $loader.hide();
                console.error('Chyba při získávání otázek:', xhr.responseText);
            }
        });
    }
    


    function saveStateToStorage() {
        const storageKey = `${current_category}-${current_difficulty}-state`; // Unikátní klíč pro každou kombinaci
        localStorage.setItem(storageKey, JSON.stringify({
            questions: questions,
            currentQuestionIndex: current_questions_index,
            currentCategory: current_category,
            currentDifficulty: current_difficulty,
            correctAnswersCount: correct_answers_count,
            incorrectAnswersCount: incorrect_answers_count
        }));
    }
    



function checkAnswer(selectedAnswer, questionId) {
    const question = questions.find(q => q.id === questionId);
    if (!question) {
        console.error('Otázka nebyla nalezena!');
        return;
    }

    const isCorrect = question.correct_answers[`${selectedAnswer}_correct`] === 'true';

    const $feedbackElement = $(`#feedback-${questionId}`);
    const $CORRECT_ANSWERS_COUNT = $('<p>').addClass('correct-answer');

    // Uložení odpovědi uživatele
    userAnswers[questionId] = selectedAnswer;

    // Zobrazení správné odpovědi
    $.each(question.answers, (key, value) => {
        if (question.correct_answers[`${key}_correct`] === 'true') {
            $CORRECT_ANSWERS_COUNT.text(`Správná odpověď je: ${key.split('_')[1].toUpperCase()}) ${value}`);
        }
    });

    if (isCorrect) {
        correct_answers_count++;
        $feedbackElement.text('Správná odpověď!').css('color', 'green');
    } else {
        incorrect_answers_count++;
        $feedbackElement.text('Špatná odpověď.').css('color', 'red');
        $feedbackElement.after($CORRECT_ANSWERS_COUNT);
    }


    $feedbackElement.show();


    $(`button[data-question-id="${questionId}"]`).prop('disabled', true);

    
    if (current_questions_index > 0) {
        $('#question-previous').show();
    }
    if (current_questions_index < questions.length - 1) {
        $('#question-next').show();
    }
    if (current_questions_index === questions.length - 1) {
        $('#question-result').show();
    }
}



function calculateStats() {
    const currentStats = {
        correct: correct_answers_count,
        incorrect: incorrect_answers_count,
    };
    return currentStats;
}

function renderOverallCharts() {
    const $statsSection = $('#stats-section');
    $statsSection.show();

    const categories = ['Linux', 'Code', 'SQL', 'Docker'];
    
    categories.forEach(category => {
        const canvasId = `chart-${category}`;
        const ctx = $(`#${canvasId}`)[0].getContext('2d');
    
        
        if (window.chartInstances && window.chartInstances[canvasId]) {
            window.chartInstances[canvasId].destroy();
        }

        const data = [all_stats[category]?.correct || 0, all_stats[category]?.incorrect || 0];
        
        
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

const categories = ['Linux', 'Code', 'SQL', 'Docker'];

categories.forEach((category, index) => {
    $(`#category-${index + 1}-button`).on('click', function () {
        const selectedDifficulty = $(`#difficulty-${category.toLowerCase()}`).val() || 'Easy';

        $('#loader').show();  

        fetchQuestions(category, selectedDifficulty, function () {
            updateStateFromStorage(category, selectedDifficulty);
            nextQuestion();
            $('#categories-section').hide();
            $('#questions-section').show();
            $('#stats-section').hide();
            $loader.hide(); 
        });
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
    $questionsSection.hide();
    $categoriesSection.show();
    $statsSection.show();
    sessionStorage.removeItem('gameState_' + current_category);
    
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
    $('#time-spent').text(`${minutes}m ${seconds}s`); // Aktualfizace textu pomocí jQuery
}


setInterval(updateTimeSpent, 1000);


function initStats() {
    const stats = JSON.parse(localStorage.getItem('stats'));
    if (stats !== null) {
        all_stats = stats;
    } else {
        resetStats();
    }
}


function resetStats() {
    all_stats = {
        Linux: { correct: 0, incorrect: 0 },
        Code: { correct: 0, incorrect: 0 },
        SQL: { correct: 0, incorrect: 0 },
        Docker: { correct: 0, incorrect: 0 }
    };
}

function setButtonsText() {
    categories.forEach((category, index) => {
        const button = $(`#category-${index + 1}-button`);
        if (JSON.parse(localStorage.getItem(`${category}-state`)) !== null) {
            button.text('Continue Learning');
        } else {
            button.text('Start Learning');
        }
    });
}
