const App = (() => {
    // Private constants and variables
    const API_BASE_URL = "https://gsi.fly.dev";
    const characterCards = document.querySelector("#characterCards");
    const characterDetail = document.querySelector("#characterDetail");
    const characterImage = document.querySelector("#characterImage");
    const characterName = document.querySelector("#characterName");
    // const characterDescription = document.querySelector("#characterDescription");
    const searchInput = document.querySelector("#searchInput");
    const searchButton = document.querySelector("#searchButton");
    // const showAllCharactersButton = document.querySelector("#showAllCharacters");
    const showSavedCharactersButton = document.querySelector("#showSavedCharacters");
    const saveCharacterButton = document.querySelector("#saveCharacterButton");
    const removeCharacterButton = document.querySelector("#removeCharacterButton");
    const errorMessage = document.querySelector("#errorMessage");
    const loader = document.querySelector("#loader");
    const filterButtons = document.querySelectorAll("[data-element], #showAllCharacters");
    const characterNote = document.querySelector("#characterNote");

    // Vision icons
    const visionIcons = {
        Pyro: '<i class="fas fa-fire" style="color: #e74c3c;"></i>',
        Hydro: '<i class="fas fa-tint" style="color: #3498db;"></i>',
        Anemo: '<i class="fas fa-wind" style="color: #1abc9c;"></i>',
        Electro: '<i class="fas fa-bolt" style="color: #9b59b6;"></i>',
        Dendro: '<i class="fas fa-seedling" style="color: #2ecc71;"></i>',
        Cryo: '<i class="fas fa-snowflake" style="color: #5dade2;"></i>',
        Geo: '<i class="fas fa-mountain" style="color: #f1c40f;"></i>',
    };

    // Weapon icons
    const weaponIcons = {
        Bow: '<i class="fas fa-bullseye" style="color: #e67e22;"></i>',
        Sword: '<i class="fas fa-cut" style="color: #3498db;"></i>',
        Polearm: '<i class="fas fa-chess-rook" style="color: #1abc9c;"></i>',
        Catalyst: '<i class="fas fa-book" style="color: #9b59b6;"></i>',
        Claymore: '<i class="fas fa-hammer" style="color: #e74c3c;"></i>',
    };

    // In-memory objekt pro uložené postavy
    let savedCharacters = [];

    // Inicializace in-memory objektu z localStorage
    const loadSavedCharacters = () => {
        const saved = localStorage.getItem("savedCharacterNames");
        savedCharacters = saved ? JSON.parse(saved) : [];
    };

    // Uložení in-memory objektu zpět do localStorage
    const saveToLocalStorage = () => {
        localStorage.setItem("savedCharacterNames", JSON.stringify(savedCharacters));
    };

    // Přidání postavy do uložených
    const addCharacter = (characterName, characterNote) => {
        if (!savedCharacters.includes(characterName)) {
            savedCharacters.push({ name: characterName, note: characterNote });
            saveToLocalStorage(); // Uložit do localStorage
        }
    };

    // Odebrání postavy z uložených
    const removeCharacter = (characterName) => {
        savedCharacters = savedCharacters.filter(character => character.name !== characterName);
        saveToLocalStorage(); // Uložit do localStorage
    };

    // Kontrola, zda je postava uložena
    const isCharacterSaved = (characterName) => {
        return savedCharacters.includes(characterName);
    };

    // Private helper functions
    const capitalizeName = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join("-");
    };

    const getVisionIcon = (vision) => {
        return visionIcons[vision] || '<i class="fas fa-question-circle" style="color: #7f8c8d;"></i>';
    };

    const getWeaponIcon = (weapon) => {
        return weaponIcons[weapon] || '<i class="fas fa-question-circle" style="color: #7f8c8d;"></i>';
    };

    const showLoader = () => loader.classList.add("d-flex");
    const hideLoader = () => loader.classList.remove("d-flex");

    // Public methods
    const fetchCharacterByName = async (name) => {
        showLoader();
        try {
            const formattedName = capitalizeName(name);
            const searchResponse = await fetch(
                `${API_BASE_URL}/characters/search?name=${encodeURIComponent(formattedName)}`
            );
            const searchData = await searchResponse.json();

            if (searchData.results && searchData.results.length > 0) {
                const characterId = searchData.results[0].id;
                const detailsResponse = await fetch(`${API_BASE_URL}/characters/${characterId}`);
                const detailsData = await detailsResponse.json();
                return detailsData.result;
            } else {
                throw new Error("Character not found.");
            }
        } catch (error) {
            console.error("Error fetching character details:", error);
            return null;
        } finally {
            hideLoader();
        }
    };

    const fetchAndRenderCharactersByElement = async (element) => {
        showLoader();
        try {
            const response = await fetch(
                `${API_BASE_URL}/characters/search?vision=${encodeURIComponent(element)}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                characterCards.innerHTML = "";
                data.results.forEach(renderCharacterCard);
            } else {
                characterCards.innerHTML = `<p>No characters found for element: ${element}</p>`;
            }
        } catch (error) {
            console.error(`Error fetching characters for element ${element}:`, error);
            characterCards.innerHTML = `<p>Error fetching characters for element: ${element}.</p>`;
        } finally {
            hideLoader();
        }
    };

    const fetchAndShowCharacterDetail = async (characterId) => {
        // Reset the error message
        errorMessage.style.display = "none";
        errorMessage.textContent = "";

        characterNote.value = "";

        showLoader();
        try {
            const response = await fetch(`${API_BASE_URL}/characters/${characterId}`);
            const data = await response.json();

            if (data.result) {
                // Show character details
                showCharacterDetail(data.result);

                // Clear the character cards container
                characterCards.innerHTML = "";
            } else {
                console.error("Character not found.");
            }
        } catch (error) {
            console.error("Error fetching character details:", error);
        } finally {
            hideLoader();
        }
    };

    // Function to show character details
    const showCharacterDetail = ((character) => {
        // Reset the error message
        errorMessage.style.display = "none";
        errorMessage.textContent = "";

        if (character) {
            // Clear the character cards container
            characterCards.innerHTML = "";

            // Generate dynamic image URL
            const imageUrl = getCharacterImageURL(character.name);

            // Update the character image
            characterImage.src = imageUrl;
            characterImage.alt = character.name;

            // Update the name
            characterName.textContent = character.name;

            // Update rarity stars
            if (character.rarity) {
                const rarity = character.rarity === "4_star" ? 4 : 5; // Determine number of stars
                const starColor = rarity === 4 ? "color: #9b59b6;" : "color: #f1c40f;"; // Purple for 4-star, Gold for 5-star
                const stars = Array(rarity)
                    .fill(`<i class="fas fa-star" style="${starColor} font-size: 1.5em;"></i>`)
                    .join("");
                characterRarity.innerHTML = stars; // Set stars in the placeholder
            } else {
                characterRarity.innerHTML = "Unknown rarity"; // Fallback if rarity is missing
            }

            // Update titles
            if (character.title && Array.isArray(character.title)) {
                characterTitles.textContent = character.title.join(", ");
            } else if (character.title) {
                characterTitles.textContent = character.title;
            } else {
                characterTitles.textContent = "No titles available";
            }

            // Update Vision and Icon
            if (character.vision) {
                const visionIcon = getVisionIcon(character.vision);
                characterVision.innerHTML = `${character.vision} ${visionIcon}`;
            } else {
                characterVision.textContent = "Unknown vision";
            }

            // Update Weapon and Icon
            if (character.weapon) {
                const weaponIcon = getWeaponIcon(character.weapon);
                characterWeapon.innerHTML = `${character.weapon} ${weaponIcon}`;
            } else {
                characterWeapon.textContent = "Unknown weapon";
            }

            // Update Region
            if (character.region && Array.isArray(character.region)) {
                characterRegion.textContent = character.region.join(", ");
            } else if (character.region) {
                characterRegion.textContent = character.region;
            } else {
                characterRegion.textContent = "Unknown region";
            }

            // Update Affiliation
            if (character.affiliation && Array.isArray(character.affiliation)) {
                characterAffiliation.textContent = character.affiliation.join(", ");
            } else if (character.affiliation) {
                characterAffiliation.textContent = character.affiliation;
            } else {
                characterAffiliation.textContent = "No affiliation";
            }

            // Update Special Dish
            characterDish.textContent = character.special_dish || "Unknown dish";

            // Update Birthday
            characterBirthday.textContent = character.birthday || "Unknown birthday";

            // Update How to Obtain
            if (character.how_to_obtain && Array.isArray(character.how_to_obtain)) {
                characterObtainMethods.innerHTML = character.how_to_obtain
                    .map(method => `<li>${method}</li>`)
                    .join("");
            } else {
                characterObtainMethods.innerHTML = "<li>Unknown methods</li>";
            }

            // Show the details section
            characterDetail.style.display = "flex";

            // Check if the character is already saved
            savedCharacters.every(e => {
                if (e.name === character.name) {
                    characterNote.value = e.note;
                    saveCharacterButton.style.display = "none";
                    removeCharacterButton.style.display = "block";
                    return false;
                } else {
                    saveCharacterButton.style.display = "block";
                    removeCharacterButton.style.display = "none";
                    return true;
                }
            });
        }
    });

    const renderCharacterCard = (character) => {
        if (!character) {
            characterCards.innerHTML = "<p>Character not found.</p>";
            return;
        }
        const imageUrl = getCharacterImageURL(character.name);
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card" data-character-id="${character.id}">
                    <img src="${imageUrl}" class="card-img-top" alt="${character.name}">
                    <div class="card-body">
                        <h5 class="card-title">${character.name}</h5>
                    </div>
                </div>
            </div>
        `;
        characterCards.insertAdjacentHTML("beforeend", card);
    };

    // Reason for if statement: Character names from API dont align with public database image file names
    const getCharacterImageURL = (name) => {
        // Nahradíme mezery a speciální znaky prázdnými znaky
        const cleanName = name.replace(/[^a-zA-Z]/g, "");
        return `https://u.cubeupload.com/Forgott3n/${cleanName}.png`;
    };


    const attachEventListeners = () => {
        searchButton.addEventListener("click", async (e) => {
            e.preventDefault();
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            let query = searchInput.value.trim();

            // Reset the error message
            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            // Validation: Check if the input is empty
            if (!query) {
                errorMessage.textContent = "Please enter a character name.";
                errorMessage.style.display = "block";
                return;
            }

            // Validation: Allow only letters and spaces
            const validInputPattern = /^[a-zA-Z\s]+$/; // Only letters and spaces allowed
            if (!validInputPattern.test(query)) {
                errorMessage.textContent = "Invalid input. Please use only letters and spaces.";
                errorMessage.style.display = "block";
                return;
            }

            // If the input is valid, proceed with the search
            characterCards.innerHTML = "";
            const character = await fetchCharacterByName(query);

            // Render the card and details
            renderCharacterCard(character);
        });

        saveCharacterButton.addEventListener("click", () => {
            // Get the character name from the details section
            const characterNameToSave = characterName.textContent;

            // Check if the name is already saved
            if (!isCharacterSaved(characterNameToSave)) {
                // Save updated list to localStorage
                addCharacter(characterNameToSave, characterNote.value);

                showLoader();
                hideLoader();
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Character has been saved!"
                });

                // Replace the Save button with the Remove button
                saveCharacterButton.style.display = "none";
                removeCharacterButton.style.display = "block";
            } else {
                showLoader();
                hideLoader();
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            }
        });

        showSavedCharactersButton.addEventListener("click", async () => {
            // Reset the error message
            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            // // Retrieve saved character names from localStorage
            // const savedCharacterNames = JSON.parse(localStorage.getItem("savedCharacterNames")) || [];

            // Clear the card container
            characterCards.innerHTML = "";

            if (savedCharacters.length === 0) {
                // Display a message if no characters are saved
                characterCards.innerHTML = "<p>No saved characters found.</p>";
                return;
            }

            // Fetch and render each saved character"s details using forEach
            const fetchPromises = savedCharacters.map(async (e) => {
                const character = await fetchCharacterByName(e.name); // Fetch details by name
                if (character) {
                    renderCharacterCard(character); // Render card for each character
                }
            });


            // Wait for all fetches to complete
            await Promise.all(fetchPromises);

            // Hide the character details section
            characterDetail.style.display = "none";
        });

        removeCharacterButton.addEventListener("click", () => {
            // Reset the error message
            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            // Get the character name from the details section
            const characterNameToRemove = characterName.textContent;

            removeCharacter(characterNameToRemove);

            showLoader();
            hideLoader();
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: `${characterNameToRemove} has been removed from Saved Characters.`
            });

            // Replace the Remove button with the Save button
            removeCharacterButton.style.display = "none";
            saveCharacterButton.style.display = "block";
        });

        const fetchAllCharacters = async () => {
            showLoader();
            try {
                // Jedno volání pro získání všech postav
                const response = await fetch(`${API_BASE_URL}/characters?limit=1000`);
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    renderCharacterCards(data.results);
                } else {
                    characterCards.innerHTML = "<p>No characters found.</p>";
                }
            } catch (error) {
                console.error("Error fetching all characters:", error);
                characterCards.innerHTML = "<p>Error fetching characters. Please try again later.</p>";
            } finally {
                hideLoader();
            }
        };

        const renderCharacterCards = (characters) => {
            const characterCards = document.querySelector("#characterCards");

            // Vyčistíme stávající obsah
            characterCards.innerHTML = "";

            // Pokud nejsou postavy k dispozici, zobrazí se zpráva
            if (!characters || characters.length === 0) {
                characterCards.innerHTML = "<p>No characters found.</p>";
                return;
            }

            const fragment = document.createDocumentFragment();

            characters.forEach((character) => {
                // Vytvoříme kartu postavy
                const card = document.createElement("div");
                card.className = "col-md-4 mb-4";

                card.innerHTML = `
            <div class="card" data-character-id="${character.id}">
                <img src="${getCharacterImageURL(character.name)}" class="card-img-top" alt="${character.name}">
                <div class="card-body">
                    <h5 class="card-title">${character.name}</h5>
                </div>
            </div>`;

                fragment.appendChild(card);
            });

            characterCards.appendChild(fragment);
        };

        // Attach event listeners to filter buttons
        filterButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                // Reset všech aktivních tlačítek
                filterButtons.forEach((btn) => btn.classList.remove("active"));

                // Nastavení aktivního tlačítka
                button.classList.add("active");

                // Hide the character details section
                characterDetail.style.display = "none";

                // Logika pro tlačítko "All"
                if (button.id === "showAllCharacters") {
                    await fetchAllCharacters();
                } else {
                    // Jinak načti postavy podle vision
                    const element = button.getAttribute("data-element");
                    await fetchAndRenderCharactersByElement(capitalizeName(element));
                }
            });
        });

        characterCards.addEventListener("click", (e) => {
            const card = e.target.closest(".card");
            if (card && card.dataset.characterId) {
                filterButtons.forEach((btn) => btn.classList.remove("active"));
                App.fetchAndShowCharacterDetail(card.dataset.characterId);
            }
        });
    };

    const init = () => {
        loadSavedCharacters();
        hideLoader();
        attachEventListeners();
    };

    return {
        init,
        addCharacter,
        removeCharacter,
        isCharacterSaved,
        fetchCharacterByName,
        fetchAndRenderCharactersByElement,
        renderCharacterCard,
        fetchAndShowCharacterDetail,
    };
})();

// Initialize App
App.init();