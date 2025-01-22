$(document).ready(function () {
    const API_URL = 'https://opentdb.com/api.php';
    const CATEGORY_URL = 'https://opentdb.com/api_category.php';
    let currentQuestion = 0;
    let questions = [];
    let score = 0;
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

            $('#category').empty();
            $('#category').append('<option value="random">Random</option>');
            categories.forEach(category => {
                $('#category').append(
                    `<option value="${category.id}">${category.name}</option>`
                );
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
        $('#difficulty').empty();
        $('#difficulty').append('<option value="random">Random</option>');
        difficulties.forEach(difficulty => {
            $('#difficulty').append(
                `<option value="${difficulty}">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</option>`
            );
        });
    }

    // Show Loader
    function showLoader() {
        $('#loader').removeClass('hidden');
    }

    // Hide Loader
    function hideLoader() {
        $('#loader').addClass('hidden');
    }

    // Category and Difficulty Initialization
    loadCategories();
    loadDifficulties();

    // Reset Stats
    $('#reset-stats').on('click', function (e) {
        e.preventDefault();
        resetAllStats();
    });

    // To Choose a Random Value
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Start Quiz
    $('#start-quiz').on('click', async function () {
        let category = $('#category').val();
        let difficulty = $('#difficulty').val();
        const amount = parseInt($('#amount').val(), 10);

        // Check if the Number of Questions is Allowrd
        if (isNaN(amount) || amount < 1 || amount > 50) {
            showNotification('Please enter a valid number of questions (1 - 50).', 'error');
            return;
        }

        // If we choose Random as a Category/Difficulty
        if (category === 'random') {
            const categories = $('#category option:not([value="random"])').toArray();
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
            questions = data.results;
            currentQuestion = 0;
            score = 0;
            $('#settings').addClass('hidden');
            $('#quiz').removeClass('hidden');
            updateProgress();
            showQuestion();
            hideLoader();
        } catch (error) {
            hideLoader();
            showNotification('Error fetching quiz questions. Please try again.', 'error');
            console.error('Error fetching quiz questions:', error);
        }
    });

    // Progress thru the Quiz
    function updateProgress() {
        $('#progress').text(`${currentQuestion + 1}/${questions.length}`);
    }

    // Show Question
    function showQuestion() {
        const questionData = questions[currentQuestion];
        $('#question').html(questionData.question);
        $('#answers').empty();

        const answers = [...questionData.incorrect_answers, questionData.correct_answer];
        answers.sort(() => Math.random() - 0.5);

        answers.forEach(answer => {
            const button = $('<button>')
                .addClass('answer-button')
                .html(answer)
                .on('click', function () {
                    if (answer === questionData.correct_answer) {
                        score++;
                        globalStats.correct++;
                    } else {
                        globalStats.incorrect++;
                    }

                    saveStats();
                    nextQuestionOrEnd();
                });
            $('#answers').append(button);
        });

        updateProgress();
    }

    // Next Question
    $('#next-question').on('click', function () {
        globalStats.incorrect++;
        saveStats();
        nextQuestionOrEnd();
    });

    // End Quiz
    $('#end-quiz').on('click', function () {
        const skippedQuestions = questions.length - currentQuestion;
        globalStats.incorrect += skippedQuestions;
        saveStats();
        showResults();
    });

    // Is the Quiz Finished?
    function nextQuestionOrEnd() {
        if (currentQuestion + 1 < questions.length) {
            currentQuestion++;
            showQuestion();
        } else {
            showResults();
        }
    }

    // Results
    function showResults() {
        $('#quiz').addClass('hidden');
        $('#results').removeClass('hidden');
        $('#score').text(`Your Score: ${score}/${questions.length}`);
        renderResultsChart();
        renderGlobalChart();
    }

    // Charts
    function renderResultsChart() {
        const ctx = document.getElementById('results-chart').getContext('2d');
        if (resultsChart) {
            resultsChart.destroy();
        }
        resultsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Correct', 'Incorrect'],
                datasets: [{
                    data: [score, questions.length - score],
                    backgroundColor: ['#4caf50', '#f44336']
                }]
            }
        });
    }

    function renderGlobalChart() {
        const ctx = document.getElementById('global-chart').getContext('2d');
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
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }


    // Play Again
    $('#play-again').on('click', function () {
        $('#results').addClass('hidden');
        $('#quiz').removeClass('hidden');
        score = 0;
        currentQuestion = 0;
        showQuestion();
    });

    // Change Settings
    $('#change-settings').on('click', function () {
        $('#results').addClass('hidden');
        $('#settings').removeClass('hidden');
    });
});
