let diaryData = {}; // In-memory objekt pro jídelníček

document.addEventListener("DOMContentLoaded", function () {
    // Pridani event listeneru
    document.getElementById('delete-results-button').addEventListener('click', clearDiaryForDate);
    document.getElementById('weekly-results-button').addEventListener('click', showWeeklyResults);
    document.getElementById('date-picker').addEventListener('change', updateDiary);
    document.getElementById('search-form').addEventListener('submit', function (event) {
        handleSearch(event)
    });
    document.getElementById('results-container').addEventListener('click', function (event) {
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

    // Spusteni init funkci
    loadDiaryData(); // Načtení dat z localStorage při spuštění
    setTodayDate();
    updateDiary();
});

const loadDiaryData = () => {
    diaryData = JSON.parse(localStorage.getItem('diary')) || {}; // Načtení dat z localStorage při spuštění
}

const saveDiaryData = () => {
    localStorage.setItem('diary', JSON.stringify(diaryData)); // Uložení dat do localStorage
}

const handleSearch = async (event) => {
    event.preventDefault();
    const dirtyQuery = document.getElementById('search-input').value;
    const query = DOMPurify.sanitize(dirtyQuery);
    const resultsContainer = document.getElementById('results-container');
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

        data.products.forEach((product, index) => {
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
    }
    // <button id="add-item-button${index}" onclick="addItemToDiary('${product.product_name}', ${product.nutriments?.energy_100g || 0}, ${product.nutriments?.proteins_100g || 0}, ${product.nutriments?.fat_100g || 0}, ${product.nutriments?.carbohydrates_100g || 0}, ${product.nutriments?.sugars_100g || 0})">Přidat položku</button>
    
const addItemToDiary = (name, calories, proteins, fats, carbohydrates, sugars) => {
    const uniqueId = uuid.v4();
    const date = document.getElementById('date-picker').value;
    if (!date) {
        Swal.fire({
            icon: 'warning',
            title: 'Chyba!',
            text: 'Prosím vyberte datum pro jídelníček.'
        });
        return;
    }

    if (!diaryData[date]) {
        diaryData[date] = [];
    }

    diaryData[date].push({ id: uniqueId, name, calories, proteins, fats, carbohydrates, sugars });
    saveDiaryData(); // Uložení změn do localStorage
    updateDiary();
}

const updateDiary = () => {
    const date = document.getElementById('date-picker').value;
    if (!date) {
        Swal.fire({
            icon: 'warning',
            title: 'Chyba!',
            text: 'Prosím vyberte datum pro jídelníček.'
        });
        return;
    }

    const diaryContainer = document.getElementById('diary-container');
    diaryContainer.innerHTML = `<h3>Jídelníček pro datum: ${date}</h3>`;

    if (diaryData[date]) {
        let totalCalories = 0, totalProteins = 0, totalFats = 0, totalCarbs = 0, totalSugars = 0;
        diaryData[date].forEach((item) => {
            totalCalories += item.calories;
            totalProteins += item.proteins;
            totalFats += item.fats;
            totalCarbs += item.carbohydrates;
            totalSugars += item.sugars;
            const itemElement = document.createElement('div');
            itemElement.id = `diary-item-${item.id}`;
            const itemDeleteButtonElement = document.createElement('button');
            itemDeleteButtonElement.innerHTML = ' &#128465; Delete';
            itemDeleteButtonElement.addEventListener('click', function () { removeItem(date, item.id) })
            const itemDetailsElement = document.createElement('div');
            itemDetailsElement.innerHTML = `<b>${item.name}</b> - Kalorie: ${Number(item.calories.toFixed(2))}kcal, Bílkoviny: ${Number(item.proteins.toFixed(2))}g, Tuky: ${Number(item.fats.toFixed(2))}g, Sacharidy: ${Number(item.carbohydrates.toFixed(2))}g, Cukry: ${Number(item.sugars.toFixed(2))}g`;
            itemElement.classList.add('diary-item');
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
}

const clearDiaryForDate = () => {
    const date = document.getElementById('date-picker').value;
    if (!date) {
        Swal.fire({
            icon: 'warning',
            title: 'Chyba!',
            text: 'Prosím vyberte datum pro jídelníček.'
        });
        return;
    }

    Swal.fire({
        title: `Opravdu chcete smazat jídelníček pro datum ${date}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ano, smazat!',
        cancelButtonText: 'Zrušit'
    }).then((result) => {
        if (result.isConfirmed) {
            delete diaryData[date];
            saveDiaryData(); // Uložení změn do localStorage
            updateDiary();
        }
    });
}

const showWeeklyResults = () => {
    // loadDiaryData();
    window.location.href = 'weeklyResults'
    // Implementace pro zobrazení týdenních výsledků
}

const setTodayDate = () => {
    let today = new Date().toISOString().split("T")[0];
    document.getElementById("date-picker").value = today;
}

const removeItem = (date, itemId) => {
    const itemElement = document.getElementById(`diary-item-${itemId}`);
    itemElement.remove();
    diaryData[date] = diaryData[date].filter((item) => item.id !== itemId);
    saveDiaryData();
    updateDiary();
}

const redirectToWeekly = () => {
    window.location.href = "subdirectory";
}