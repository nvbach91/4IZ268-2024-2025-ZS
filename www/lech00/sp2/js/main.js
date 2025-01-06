const App = (() => {
    const API_BASE_URL = "https://gsi.fly.dev";
    const characterCards = document.querySelector("#characterCards");
    const characterDetail = document.querySelector("#characterDetail");
    const characterImage = document.querySelector("#characterImage");
    const characterName = document.querySelector("#characterName");
    const characterTitles = document.querySelector("#characterTitles");
    const characterVision = document.querySelector("#characterVision");
    const characterWeapon = document.querySelector("#characterWeapon");
    const searchInput = document.querySelector("#searchInput");
    const searchButton = document.querySelector("#searchButton");
    const errorMessage = document.querySelector("#errorMessage");

    const capitalizeName = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    const fetchCharacterByName = async (name) => {
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
        }
    };

    const renderCharacterCard = (character) => {
        if (!character) {
            characterCards.innerHTML = "<p>Character not found.</p>";
            return;
        }
        const imageUrl = `./images/${capitalizeName(character.name.replace(" ", "-"))}.webp`;
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${imageUrl}" class="card-img-top" alt="${character.name}">
                    <div class="card-body">
                        <h5 class="card-title">${character.name}</h5>
                    </div>
                </div>
            </div>
        `;
        characterCards.insertAdjacentHTML("beforeend", card);
    };

    const showCharacterDetail = (character) => {
        if (character) {
            const imageUrl = `./images/${capitalizeName(character.name.replace(" ", "-"))}.webp`;

            characterImage.src = imageUrl;
            characterImage.alt = character.name;
            characterName.textContent = character.name;
            characterTitles.textContent = character.title || "No titles available";
            characterVision.textContent = character.vision || "Unknown vision";
            characterWeapon.textContent = character.weapon || "Unknown weapon";

            characterDetail.style.display = "flex";
        }
    };

    const attachEventListeners = () => {
        searchButton.addEventListener("click", async () => {
            const query = searchInput.value.trim();

            if (!query) {
                errorMessage.textContent = "Please enter a character name.";
                errorMessage.style.display = "block";
                return;
            }

            characterCards.innerHTML = "";
            const character = await fetchCharacterByName(query);
            if (character) {
                renderCharacterCard(character);
                showCharacterDetail(character);
            }
        });
    };

    const init = () => {
        attachEventListeners();
    };

    return { init };
})();

App.init();
