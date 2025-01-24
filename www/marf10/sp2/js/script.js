$(document).ready(function () {
    const API_URL = 'https://opentdb.com/api.php';
    const CATEGORY_URL = 'https://opentdb.com/api_category.php';

    const $category = $('#category');
    const $difficulty = $('#difficulty');
    const $amount = $('#amount');
    const $settings = $('#settings');
    const $quiz = $('#quiz');
    const $results = $('#results');
    const $score = $('#score');
    const $question = $('#question');
    const $answers = $('#answers');
    const $progress = $('#progress');
    const $loader = $('#loader');
    const $resetStats = $('#reset-stats');
    const $startQuiz = $('#start-quiz');
    const $prevQuestion = $('#prev-question');
    const $nextQuestion = $('#next-question');
    const $endQuiz = $('#end-quiz');
    const $playAgain = $('#play-again');
    const $changeSettings = $('#change-settings');
    const $resultsChart = $('#results-chart');
    const $globalChart = $('#global-chart');

    let currentQuestion = 0;
    let questions = [];
    let resultsChart;
    let globalChart;

    // Load Global Stats
    let globalStats = JSON.parse(localStorage.getItem('globalStats')) || { correct: 0, incorrect: 0 };

    function saveStats() {
        localStorage.setItem('globalStats', JSON.stringify(globalStats));
    }

    function resetAllStats() {
        globalStats = { correct: 0, incorrect: 0 };
        saveStats();
        showNotification("All statistics have been reset.", "success");
        renderGlobalChart();
    }

    // Show Notification
    function showNotification(message, type) {
        const notification = $('<div>')
            .addClass(`notification ${type}`)
            .text(message);
        $('body').append(notification);

        setTimeout(() => {
            notification.fadeOut(300, () => notification.remove());
        }, 3000);
    }

    // Load Categories
    async function loadCategories() {
        try {
            showLoader();
            const response = await fetch(CATEGORY_URL);
            const data = await response.json();
            const categories = data.trivia_categories;

            if ($category.find('option[value="random"]').length === 0) {
                $category.append('<option value="random">Random</option>');
            }

            categories.forEach(category => {
                if (!$category.find(`option[value="${category.id}"]`).length) {
                    $category.append(`<option value="${category.id}">${category.name}</option>`);
                }
            });
            hideLoader();
        } catch (error) {
            hideLoader();
            showNotification('Error loading categories. Please try again later.', 'error');
            console.error('Error loading categories:', error);
        }
    }

    // Load Difficulties
    function loadDifficulties() {
        const difficulties = ['easy', 'medium', 'hard'];

        if ($difficulty.find('option[value="random"]').length === 0) {
            $difficulty.append('<option value="random">Random</option>');
        }

        difficulties.forEach(difficulty => {
            if (!$difficulty.find(`option[value="${difficulty}"]`).length) {
                $difficulty.append(
                    `<option value="${difficulty}">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</option>`
                );
            }
        });
    }

    // Show Loader
    function showLoader() {
        $loader.removeClass('hidden');
    }

    // Hide Loader
    function hideLoader() {
        $loader.addClass('hidden');
    }

    // Initialize Categories and Difficulties
    loadCategories();
    loadDifficulties();

    // Reset Stats
    $resetStats.on('click', function (e) {
        e.preventDefault();
        resetAllStats();
    });

    // Start Quiz
    $startQuiz.on('click', async function () {
        let category = $category.val();
        let difficulty = $difficulty.val();
        const amount = parseInt($amount.val(), 10);

        if (isNaN(amount) || amount < 1 || amount > 50) {
            showNotification('Please enter a valid number of questions (1 - 50).', 'error');
            return;
        }

        if (category === 'random') {
            const categories = $category.find('option:not([value="random"])').toArray();
            category = $(getRandomElement(categories)).val();
        }

        if (difficulty === 'random') {
            const difficulties = ['easy', 'medium', 'hard'];
            difficulty = getRandomElement(difficulties);
        }

        try {
            showLoader();
            const response = await fetch(`${API_URL}?amount=${amount}&category=${category}&difficulty=${difficulty}`);
            const data = await response.json();
            questions = data.results.map(q => ({
                ...q,
                userAnswer: null,
            }));
            currentQuestion = 0;
            $settings.addClass('hidden');
            $quiz.removeClass('hidden');
            updateProgress();
            showQuestion();
            hideLoader();
        } catch (error) {
            hideLoader();
            showNotification('Error fetching quiz questions. Please try again.', 'error');
        }
    });

    // Progress Update
    function updateProgress() {
        $progress.text(`${currentQuestion + 1}/${questions.length}`);
    }

    // Show Question
    function showQuestion() {
        const questionData = questions[currentQuestion];
        $question.html(questionData.question);
        $answers.empty();
    
        const answers = [...questionData.incorrect_answers, questionData.correct_answer];
        answers.sort(() => Math.random() - 0.5);
    
        answers.forEach(answer => {
            const button = $('<button>')
                .addClass('answer-button')
                .html(answer)
                .toggleClass('selected', questionData.userAnswer === answer)
                .on('click', function () {
                    questionData.userAnswer = answer;
                    $answers.find('.answer-button').removeClass('selected');
                    $(this).addClass('selected');
    
                    if (currentQuestion < questions.length - 1) {
                        currentQuestion++;
                        showQuestion();
                    } else {
                        showNotification('You are on the last question. Click "Evaluate Quiz" to finish.', 'info');
                    }
                });
            $answers.append(button);
        });
    
        updateProgress();
        updateNavigationButtons();
    }

    // Navigate Previous Question
    $prevQuestion.on('click', function () {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion();
        }
    });

    // Skip Question
    $nextQuestion.on('click', function () {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
        }
    });

    // Evaluate Quiz
    $endQuiz.on('click', function () {
        const unanswered = questions.filter(q => q.userAnswer === null).length;
        showNotification(`You skipped ${unanswered} questions.`, 'info');
        showResults();
    });

    // Show Results
    function showResults() {
        $quiz.addClass('hidden');
        $results.removeClass('hidden');

        const correctAnswers = questions.filter(q => q.userAnswer === q.correct_answer).length;
        const incorrectAnswers = questions.length - correctAnswers;

        $score.text(`Your Score: ${correctAnswers}/${questions.length}`);
        globalStats.correct += correctAnswers;
        globalStats.incorrect += incorrectAnswers;
        saveStats();

        renderResultsChart();
        renderGlobalChart();
    }

    // Charts
    function renderResultsChart() {
        const ctx = $resultsChart[0].getContext('2d');
        if (resultsChart) {
            resultsChart.destroy();
        }
        resultsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Correct', 'Incorrect'],
                datasets: [{
                    data: [
                        questions.filter(q => q.userAnswer === q.correct_answer).length,
                        questions.filter(q => q.userAnswer !== q.correct_answer).length
                    ],
                    backgroundColor: ['#4caf50', '#f44336']
                }]
            }
        });
    }

    function renderGlobalChart() {
        const ctx = $globalChart[0].getContext('2d');
        if (globalChart) {
            globalChart.destroy();
        }
        globalChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Correct', 'Incorrect'],
                datasets: [{
                    data: [globalStats.correct, globalStats.incorrect],
                    backgroundColor: ['#4caf50', '#f44336']
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Play Again
    $playAgain.on('click', function () {
        currentQuestion = 0;
        questions.forEach(q => (q.userAnswer = null));
        $results.addClass('hidden');
        $quiz.removeClass('hidden');
        showQuestion();
    });

    // Change Settings
    $changeSettings.on('click', function () {
        $results.addClass('hidden');
        $settings.removeClass('hidden');
    });

    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Remove Control Buttons When Needed
    function updateNavigationButtons() {
        if (currentQuestion === 0) {
            $prevQuestion.addClass('hidden');
        } else {
            $prevQuestion.removeClass('hidden');
        }

        if (currentQuestion === questions.length - 1) {
            $nextQuestion.addClass('hidden');
        } else {
            $nextQuestion.removeClass('hidden');
        }
    }

});

