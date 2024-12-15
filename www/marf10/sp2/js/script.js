$(document).ready(function () {
    const API_URL = 'https://opentdb.com/api.php';
    const CATEGORY_URL = 'https://opentdb.com/api_category.php';
    let currentQuestion = 0;
    let questions = [];
    let score = 0;

    // Dynamické načítání kategorií
    async function loadCategories() {
        try {
            const response = await fetch(CATEGORY_URL);
            const data = await response.json();
            const categories = data.trivia_categories;

            $('#category').empty();
            categories.forEach(category => {
                $('#category').append(
                    `<option value="${category.id}">${category.name}</option>`
                );
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Dynamické načítání obtížností
    function loadDifficulties() {
        const difficulties = ['easy', 'medium', 'hard'];
        $('#difficulty').empty();
        difficulties.forEach(difficulty => {
            $('#difficulty').append(
                `<option value="${difficulty}">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</option>`
            );
        });
    }

    // Spuštění funkcí pro načítání dat
    loadCategories();
    loadDifficulties();

    // Zahájení kvízu
    $('#start-quiz').on('click', async function () {
        const category = $('#category').val();
        const difficulty = $('#difficulty').val();
        const amount = $('#amount').val();

        const response = await fetch(`${API_URL}?amount=${amount}&category=${category}&difficulty=${difficulty}`);
        const data = await response.json();
        questions = data.results;

        currentQuestion = 0;
        score = 0;
        $('#settings').addClass('hidden');
        $('#quiz').removeClass('hidden');
        showQuestion();
    });

    // Zobrazení otázky
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
                    }
                    if (currentQuestion + 1 < questions.length) {
                        currentQuestion++;
                        showQuestion();
                    } else {
                        showResults();
                    }
                });
            $('#answers').append(button);
        });
    }

    // Zobrazení výsledků
    function showResults() {
        $('#quiz').addClass('hidden');
        $('#results').removeClass('hidden');
        $('#score').text(`Your Score: ${score}/${questions.length}`);
        renderChart();
    }

    // Vykreslení grafu
    function renderChart() {
        const ctx = document.getElementById('results-chart').getContext('2d');
        new Chart(ctx, {
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

    // Restartování kvízu
    $('#play-again, #change-settings').on('click', function () {
        $('#results').addClass('hidden');
        $('#settings').removeClass('hidden');
    });
});
