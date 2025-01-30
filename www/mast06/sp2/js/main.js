// Funkce pro hledání jídel z OpenFoodFacts API
async function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.add('grid');
    resultsContainer.innerHTML = 'Načítání...';

    try {
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&json=1`);
        const data = await response.json();

        // AXIOS po vyzkoušení hledání byl mnohem pomalejší, než nativní funkce JavaScriptu!!!

        // const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&json=1`);
        // const data = response.data;
        resultsContainer.innerHTML = '';

        if (data.products.length === 0) {
            resultsContainer.innerHTML = 'Žádné výsledky nebyly nalezeny.';
            return;
        }

        // Pro každý produkt vytvořím položku
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
                <button onclick="addItemToDiary('${product.product_name}', ${product.nutriments?.energy_100g || 0}, ${product.nutriments?.proteins_100g || 0}, ${product.nutriments?.fat_100g || 0}, ${product.nutriments?.carbohydrates_100g || 0}, ${product.nutriments?.sugars_100g || 0})">Přidat položku</button>
            `;
            resultsContainer.appendChild(item);
        });
    } catch (error) {
        resultsContainer.innerHTML = 'Chyba při načítání dat.';
    }
}

// Funkce pro přidání položky do jídelníčku pro zvolené datum
function addItemToDiary(name, calories, proteins, fats, carbohydrates, sugars) {
    const date = document.getElementById('date-picker').value; // Získání hodnoty z inputu pro datum
    if (!date) {
        alert("Prosím vyberte datum pro jídelníček.");
        return;
    }

    const diary = JSON.parse(localStorage.getItem('diary')) || {};
    if (!diary[date]) {
        diary[date] = [];
    }

    diary[date].push({ name, calories, proteins, fats, carbohydrates, sugars });
    localStorage.setItem('diary', JSON.stringify(diary));
    updateDiary(); // Aktualizuje jídelníček pro vybrané datum
}

// Funkce pro zobrazení jídelníčku pro vybrané datum
function updateDiary() {
    const date = document.getElementById('date-picker').value; // Získání hodnoty z inputu pro datum
    if (!date) {
        alert("Prosím vyberte datum pro jídelníček.");
        return;
    }

    const diary = JSON.parse(localStorage.getItem('diary')) || {};
    const diaryContainer = document.getElementById('diary-container');
    diaryContainer.innerHTML = `<h3>Jídelníček pro datum: ${date}</h3>`;

    if (diary[date]) {
        let totalCalories = 0, totalProteins = 0, totalFats = 0, totalCarbs = 0, totalSugars = 0;
        diary[date].forEach(item => {
            totalCalories += item.calories;
            totalProteins += item.proteins;
            totalFats += item.fats;
            totalCarbs += item.carbohydrates;
            totalSugars += item.sugars;
            const itemElement = document.createElement('div');
            itemElement.classList.add('diary-item');
            itemElement.innerHTML = `${item.name} - Kalorie: ${item.calories}kcal, Bílkoviny: ${item.proteins}g, Tuky: ${item.fats}g, Sacharidy: ${item.carbohydrates}g, Cukry: ${item.sugars}g`;
            diaryContainer.appendChild(itemElement);
        });

        // Zobrazení součtů
        const totalElement = document.createElement('div');
        totalElement.innerHTML = `
            <strong>Celkové hodnoty tento den:</strong><br>
            Kalorie: ${totalCalories} kcal<br>
            Bílkoviny: ${totalProteins} g<br>
            Tuky: ${totalFats} g<br>
            Sacharidy: ${totalCarbs} g<br>
            Cukry: ${totalSugars} g
        `;
        diaryContainer.appendChild(totalElement);
    } else {
        diaryContainer.innerHTML += 'Žádná data pro tento den.';
    }
}

// Funkce pro zobrazení a vyprázdnění jídelníčku pro vybraný den
function clearDiaryForDate() {
    const date = document.getElementById('date-picker').value; // Získání hodnoty z inputu pro datum
    if (!date) {
        alert("Prosím vyberte datum pro jídelníček.");
        return;
    }

    const diary = JSON.parse(localStorage.getItem('diary')) || {};

    // Vymazání jídelníčku pro vybrané datum
    delete diary[date];
    localStorage.setItem('diary', JSON.stringify(diary));

    updateDiary();  // Aktualizace levého panelu po vymazání
}

function setTodayDate() {
    let today = new Date().toISOString().split("T")[0];
    document.getElementById("date-picker").value = today;
}

window.onload = function () {
    setTodayDate();
    updateDiary();
};