const App = (() => {
    // Private constants and variables
    const API_BASE_URL = "https://gsi.fly.dev";
    const characterCards = document.querySelector("#characterCards");
    const characterDetail = document.querySelector("#characterDetail");
    const characterImage = document.querySelector("#characterImage");
    const characterName = document.querySelector("#characterName");
    const characterDescription = document.querySelector("#characterDescription");
    const searchInput = document.querySelector("#searchInput");
    const searchButton = document.querySelector("#searchButton");
    const showAllCharactersButton = document.querySelector("#showAllCharacters");
    const showSavedCharactersButton = document.querySelector("#showSavedCharacters");
    const saveCharacterButton = document.querySelector("#saveCharacterButton");
    const removeCharacterButton = document.querySelector("#removeCharacterButton");
    const errorMessage = document.querySelector("#errorMessage");

    // Private helper functions
    const capitalizeName = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join("-");
    };

    const getVisionIcon = (vision) => {
        const visionIcons = {
            Pyro: '<i class="fas fa-fire" style="color: #e74c3c;"></i>',
            Hydro: '<i class="fas fa-tint" style="color: #3498db;"></i>',
            Anemo: '<i class="fas fa-wind" style="color: #1abc9c;"></i>',
            Electro: '<i class="fas fa-bolt" style="color: #9b59b6;"></i>',
            Dendro: '<i class="fas fa-seedling" style="color: #2ecc71;"></i>',
            Cryo: '<i class="fas fa-snowflake" style="color: #5dade2;"></i>',
            Geo: '<i class="fas fa-mountain" style="color: #f1c40f;"></i>',
        };
        return visionIcons[vision] || '<i class="fas fa-question-circle" style="color: #7f8c8d;"></i>';
    };

    const getWeaponIcon = (weapon) => {
        const weaponIcons = {
            Bow: '<i class="fas fa-bullseye" style="color: #e67e22;"></i>',
            Sword: '<i class="fas fa-cut" style="color: #3498db;"></i>',
            Polearm: '<i class="fas fa-chess-rook" style="color: #1abc9c;"></i>',
            Catalyst: '<i class="fas fa-book" style="color: #9b59b6;"></i>',
            Claymore: '<i class="fas fa-hammer" style="color: #e74c3c;"></i>',
        };
        return weaponIcons[weapon] || '<i class="fas fa-question-circle" style="color: #7f8c8d;"></i>';
    };

    const showLoader = () => {
        const loader = document.querySelector("#loader");
        loader.classList.add("d-flex");
    };

    const hideLoader = () => {
        const loader = document.querySelector("#loader");
        loader.classList.remove("d-flex");
    };

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

    const fetchAndShowCharacterDetail = (async (characterId) => {
        // Reset the error message
        errorMessage.style.display = "none";
        errorMessage.textContent = "";

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
    });

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

            // Check if the character is already saved
            const savedCharacterNames = JSON.parse(localStorage.getItem("savedCharacterNames")) || [];
            if (savedCharacterNames.includes(character.name)) {
                saveCharacterButton.style.display = "none";
                removeCharacterButton.style.display = "block";
            } else {
                saveCharacterButton.style.display = "block";
                removeCharacterButton.style.display = "none";
            }

            // Show the details section
            characterDetail.style.display = "flex";
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
                <div class="card" onclick="App.fetchAndShowCharacterDetail(${character.id})">
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
        if (name === "Traveller (female)") {
            return "https://u.cubeupload.com/Forgott3n/Travellerfemale.png";
        } else if (name === "Traveller (male)") {
            return "https://u.cubeupload.com/Forgott3n/Travellermale.png";
        } else {
            return `https://u.cubeupload.com/Forgott3n/${name.replace(" ", "")}.png`
        };
    };

    const attachEventListeners = () => {
        searchButton.addEventListener("click", async () => {
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

            // Retrieve existing saved character names from localStorage
            let savedCharacterNames = JSON.parse(localStorage.getItem("savedCharacterNames")) || [];

            // Check if the name is already saved
            if (!savedCharacterNames.includes(characterNameToSave)) {
                // Add the new character name to the saved names list
                savedCharacterNames.push(characterNameToSave);

                // Save updated list to localStorage
                localStorage.setItem("savedCharacterNames", JSON.stringify(savedCharacterNames));

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

            // Retrieve saved character names from localStorage
            const savedCharacterNames = JSON.parse(localStorage.getItem("savedCharacterNames")) || [];

            // Clear the card container
            characterCards.innerHTML = "";

            if (savedCharacterNames.length === 0) {
                // Display a message if no characters are saved
                characterCards.innerHTML = "<p>No saved characters found.</p>";
                return;
            }

            // Fetch and render each saved character"s details using forEach
            const fetchPromises = savedCharacterNames.map(async (name) => {
                const character = await fetchCharacterByName(name); // Fetch details by name
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

            // Retrieve existing saved character names from localStorage
            let savedCharacterNames = JSON.parse(localStorage.getItem("savedCharacterNames")) || [];

            // Filter out the character to be removed
            savedCharacterNames = savedCharacterNames.filter(name => name !== characterNameToRemove);

            // Save the updated list back to localStorage
            localStorage.setItem("savedCharacterNames", JSON.stringify(savedCharacterNames));

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

        showAllCharactersButton.addEventListener("click", async () => {
            // Reset the error message
            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            showLoader();
            try {
                let allCharacters = [];
                let currentPage = 1;
                let totalPages = 1;

                // Fetch all pages of characters
                do {
                    const response = await fetch(`${API_BASE_URL}/characters?page=${currentPage}`);
                    const data = await response.json();

                    if (data.results) {
                        allCharacters = allCharacters.concat(data.results); // Add results to the list
                    }

                    currentPage++;
                    totalPages = data.total_pages || 1; // Update total pages if available
                } while (currentPage <= totalPages);

                if (allCharacters.length > 0) {
                    // Render all character cards
                    characterCards.innerHTML = ""; // Clear existing cards
                    console.log(allCharacters);
                    allCharacters.forEach(character => renderCharacterCard(character));
                } else {
                    characterCards.innerHTML = "<p>No characters found.</p>"; // Fallback for empty results
                }

                // Hide the character details section
                characterDetail.style.display = "none";
            } catch (error) {
                console.error("Error fetching all characters:", error);
                characterCards.innerHTML = "<p>Error fetching characters. Please try again later.</p>";
            } finally {
                hideLoader();
            }
        });

        // Attach event listeners to filter buttons
        document.querySelectorAll("[data-element]").forEach(filterButton => {
            filterButton.addEventListener("click", async () => {
                // Reset the error message
                errorMessage.style.display = "none";
                errorMessage.textContent = "";

                const element = filterButton.getAttribute("data-element"); // Get the element type (e.g., Pyro, Hydro)
                await fetchAndRenderCharactersByElement(capitalizeName(element));
            });
        });

        showAllCharactersButton.addEventListener("click", async () => {
            // Fetch and display all characters
        });
    };

    const init = () => {
        hideLoader();
        attachEventListeners();
    };

    return {
        init,
        fetchCharacterByName,
        fetchAndRenderCharactersByElement,
        renderCharacterCard,
        fetchAndShowCharacterDetail,
    };
})();

// Initialize App
App.init();
