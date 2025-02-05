let diaryData = {}; // In-memory object for meal tracking

// Cache DOM elements
const deleteResultsButton = document.getElementById('delete-results-button');
const datePicker = document.getElementById('date-picker');
const searchForm = document.getElementById('search-form');
const resultsContainer = document.getElementById('results-container');
const diaryContainer = document.getElementById('diary-container');
const summaryModal = document.getElementById("summary-modal");
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalSpan = document.getElementsByClassName("close")[0];
const diaryList = document.getElementById('diary-list');



// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
    deleteResultsButton.addEventListener('click', clearDiaryForDate);
    datePicker.addEventListener('change', updateDiary);
    searchForm.addEventListener('submit', handleSearch);
    resultsContainer.addEventListener('click', event => {
        if (event.target.classList.contains('add-item-button')) {
            const button = event.target;
            addItemToDiary(
                button.dataset.name,
                parseFloat(button.dataset.calories),
                parseFloat(button.dataset.proteins),
                parseFloat(button.dataset.fats),
                parseFloat(button.dataset.carbs),
                parseFloat(button.dataset.sugars)
            );
        }
    });

    // Modal logic
    openModalBtn.addEventListener('click', function() {
      summaryModal.style.display = "block";
    });

    closeModalSpan.addEventListener('click', function() {
      summaryModal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target == summaryModal) {
          summaryModal.style.display = "none";
    }});

    // Initialize functions
    loadDiaryData();
    setTodayDate();
    updateDiary();
    loadWeeklySummary();
});

// Load and save diary data
const loadDiaryData = () => {
    diaryData = JSON.parse(localStorage.getItem('diary')) || {};
};

const saveDiaryData = () => {
    localStorage.setItem('diary', JSON.stringify(diaryData));
};

// Handle food search
const handleSearch = async (event) => {
    event.preventDefault();
    const dirtyQuery = document.getElementById('search-input').value;
    const query = DOMPurify.sanitize(dirtyQuery);
    resultsContainer.classList.add('grid');
    resultsContainer.innerHTML = 'Načítání...';

    try {
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1`);
        const data = await response.json();
        resultsContainer.innerHTML = '';

        if (data.products.length === 0) {
            resultsContainer.innerHTML = 'Žádné výsledky nebyly nalezeny.';
            return;
        }

        data.products.forEach(product => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <p>${product.product_name || 'Název neuveden'}</p>
                <img src="${product.image_url || './img/notfound.png'}" alt="${product.product_name}">
                <p>Kalorie: ${product.nutriments?.energy_100g || 'Není k dispozici'}</p>
                <p>Bílkoviny: ${product.nutriments?.proteins_100g || 'Není k dispozici'}</p>
                <p>Tuky: ${product.nutriments?.fat_100g || 'Není k dispozici'}</p>
                <p>Sacharidy: ${product.nutriments?.carbohydrates_100g || 'Není k dispozici'}</p>
                <p>Cukry: ${product.nutriments?.sugars_100g || 'Není k dispozici'}</p>
                <button class="add-item-button"
                    data-name="${product.product_name}" 
                    data-calories="${product.nutriments?.energy_100g || 0}" 
                    data-proteins="${product.nutriments?.proteins_100g || 0}" 
                    data-fats="${product.nutriments?.fat_100g || 0}" 
                    data-carbs="${product.nutriments?.carbohydrates_100g || 0}" 
                    data-sugars="${product.nutriments?.sugars_100g || 0}">
                    Přidat položku
                </button>
            `;
            resultsContainer.appendChild(item);
        });
    } catch (error) {
        resultsContainer.innerHTML = 'Chyba při načítání dat.';
    }
};

// Add item to diary
const addItemToDiary = (name, calories, proteins, fats, carbohydrates, sugars) => {
    const uniqueId = uuid.v4();
    const date = datePicker.value;
    if (!date) {
        Swal.fire({ icon: 'warning', title: 'Chyba!', text: 'Prosím vyberte datum pro jídelníček.' });
        return;
    }

    if (!diaryData[date]) {
        diaryData[date] = [];
    }

    diaryData[date].push({ id: uniqueId, name, calories, proteins, fats, carbohydrates, sugars });
    saveDiaryData();
    updateDiary();
};

// Update diary display
const updateDiary = () => {
    const date = datePicker.value;
    if (!date) {
        Swal.fire({ icon: 'warning', title: 'Chyba!', text: 'Prosím vyberte datum pro jídelníček.' });
        return;
    }

    diaryContainer.innerHTML = `<h3>Jídelníček pro datum: ${date}</h3>`;

    if (diaryData[date]) {
        let totalCalories = 0, totalProteins = 0, totalFats = 0, totalCarbs = 0, totalSugars = 0;
    
        diaryData[date].forEach(item => {
            totalCalories += item.calories;
            totalProteins += item.proteins;
            totalFats += item.fats;
            totalCarbs += item.carbohydrates;
            totalSugars += item.sugars;
    
            const itemElement = document.createElement('div');
            itemElement.id = `diary-item-${item.id}`;
            itemElement.classList.add('diary-item');
    
            const itemDetailsElement = document.createElement('div');
            itemDetailsElement.innerHTML = `
                <b>${item.name}</b> - Kalorie: ${Number(item.calories.toFixed(2))} kcal, 
                Bílkoviny: ${Number(item.proteins.toFixed(2))} g, Tuky: ${Number(item.fats.toFixed(2))} g, 
                Sacharidy: ${Number(item.carbohydrates.toFixed(2))} g, Cukry: ${Number(item.sugars.toFixed(2))} g
            `;
    
            const itemDeleteButtonElement = document.createElement('button');
            itemDeleteButtonElement.innerHTML = ' &#128465; Delete';
            
            // Use a regular function to ensure the correct `this` context
            itemDeleteButtonElement.addEventListener('click', function() {
                removeItem(date, item.id);
            });
    
            itemElement.appendChild(itemDetailsElement);
            itemElement.appendChild(itemDeleteButtonElement);
            diaryContainer.appendChild(itemElement);
        });
    
        const totalElement = document.createElement('div');
        totalElement.innerHTML = `
            <strong>Celkové hodnoty tento den:</strong><br>
            Kalorie: ${Number(totalCalories.toFixed(2))} kcal<br>
            Bílkoviny: ${Number(totalProteins.toFixed(2))} g<br>
            Tuky: ${Number(totalFats.toFixed(2))} g<br>
            Sacharidy: ${Number(totalCarbs.toFixed(2))} g<br>
            Cukry: ${Number(totalSugars.toFixed(2))} g
        `;
        diaryContainer.appendChild(totalElement);    
    } else {
        diaryContainer.innerHTML += 'Žádná data pro tento den.';
    }
    loadWeeklySummary();
};

// Remove an item
const removeItem = (date, itemId) => {
    console.log(date)
    console.log(itemId)
    document.getElementById(`diary-item-${itemId}`).remove();
    diaryData[date] = diaryData[date].filter(item => item.id !== itemId);
    if (diaryData[date].length === 0) {
        delete diaryData[date]
        saveDiaryData();
        updateDiary();
    }
    console.log(diaryData[date])
    saveDiaryData();
    updateDiary();
};

// Clear diary for selected date
const clearDiaryForDate = () => {
    const date = datePicker.value;
    if (!date) return;

    Swal.fire({
        title: `Opravdu chcete smazat jídelníček pro datum ${date}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ano, smazat!',
        cancelButtonText: 'Zrušit'
    }).then(result => {
        if (result.isConfirmed) {
            delete diaryData[date];
            saveDiaryData();
            updateDiary();
        }
    });
};

const showWeeklyResults = () => window.location.href = 'weeklyResults';
const setTodayDate = () => datePicker.value = new Date().toISOString().split("T")[0];

const loadWeeklySummary = () => {
    if (!diaryList) {
        console.error("Element s ID 'diary-list' nebyl nalezen.");
        return;
    }

    diaryList.innerHTML = '';

    // Načtení dat z localStorage
    const diaryData = JSON.parse(localStorage.getItem('diary')) || {};

    // Pokud jsou data prázdná
    if (Object.keys(diaryData).length === 0) {
        diaryList.innerHTML = "<li>Žádné záznamy v deníku</li>";
        return;
    }

    // Určení aktuálního data
    const today = new Date();

    // Filtrování dat tak, aby zahrnovala pouze posledních 14 dní
    const filteredDiaryData = {};
    for (const date in diaryData) {
        const entryDate = new Date(date);
        const diffTime = today - entryDate;
        const diffDays = diffTime / (1000 * 3600 * 24);

        // Pokud je rozdíl menší nebo rovný 14 dnů, přidáme záznam do filtrovaných dat
        if (diffDays <= 14) {
            filteredDiaryData[date] = diaryData[date];
        }
    }

    // Pokud nejsou žádné záznamy v posledních 14 dnech
    if (Object.keys(filteredDiaryData).length === 0) {
        diaryList.innerHTML = "<li>Žádné záznamy za posledních 14 dní</li>";
        return;
    }

    // Seřazení dat podle datumu (sestupně, nejnovější první)
    const sortedDates = Object.keys(filteredDiaryData).sort((a, b) => new Date(b) - new Date(a));

    // Procházení dní v deníku podle seřazených dat
    sortedDates.forEach(date => {
        const entryList = document.createElement('ul');
        entryList.innerHTML = `<h3>${date}</h3>`; // Nadpis s datem

        // Přidání jednotlivých položek do seznamu pro daný den
        filteredDiaryData[date].forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.name} - Kalorie: ${entry.calories}`;
            entryList.appendChild(listItem);
        });

        // Spočítání celkových kalorií pro daný den
        const totalCalories = filteredDiaryData[date].reduce((total, entry) => total + entry.calories, 0);

        // Vytvoření div pro celkové kalorie a nastavení tučného písma
        const totalCaloriesDiv = document.createElement('div');
        totalCaloriesDiv.textContent = `Celkové kalorie: ${totalCalories}`;
        totalCaloriesDiv.style.fontWeight = 'bold'; // Tučný text
        totalCaloriesDiv.style.marginTop = '10px'; // Mezera nad celkovými kaloriemi

        // Přidání divu pro celkové kalorie pod seznam
        entryList.appendChild(totalCaloriesDiv);
        
        diaryList.appendChild(entryList);
    });
};