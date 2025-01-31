window.onload = function () {
    console.log("Stránka načtena, načítám data...");

    const diaryList = document.getElementById('diary-list');

    if (!diaryList) {
        console.error("Element s ID 'diary-list' nebyl nalezen.");
        return;
    }

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