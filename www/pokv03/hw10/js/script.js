const CLIENT_ID = 'Ov23liFbrYl8RKiInswM';
const CLIENT_SECRET = '815c1ecd84f56549a6009b418c9eedccbf5313ca';
const BASE_API_URL = 'https://api.github.com';

const userForm = document.querySelector("#form");
const usernameInput = document.querySelector("#username");
const userProfileContainer = document.querySelector("#profile");
const repositoriesContainer = document.querySelector("#repositories");

userForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = usernameInput.value;
    if (username.trim() === "") {
        alert("Zadejte username");
        return;
    }

    fetchUser(username);
});

function fetchUser(username) {
    const url = BASE_API_URL + "/users/" + username + "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Uživatel nenalezen");
            }
            return response.json();
        })
        .then(function (data) {
            displayUser(data);
            fetchRepositories(username);
        })
        .catch(function (error) {
            userProfileContainer.innerHTML = "<p>Uživatel nenalezen</p>";
            repositoriesContainer.innerHTML = "";
            alert("Požadavek selhal :(");
            console.error(error);
        });
};


function fetchRepositories(username) {
    const url = BASE_API_URL + "/users/" + username + "/repos?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("chyba");
            }
            return response.json();
        })
        .then(function (repos) {
            displayRepositories(repos);
        })
        .catch(function (error) {
            repositoriesContainer.innerHTML = "<p>Nelze načíst repozitáře</p>";
            console.error(error);
        });
};

function displayUser(user) {
    userProfileContainer.innerHTML = `
        <img src="${user.avatar_url}" class="profile-picture" alt="profilovka" width="400px">
        <h2 class="profile-name">${user.name ? user.name : "Neznámé jméno"}</h2>
        <p>Uživatelské jméno: ${user.login}</p>
        <p>Počet repozitářů: ${user.public_repos}</p>
        <p>Popis: ${user.bio ? user.bio : "Žádný popis"}</p>
    `;
};

function displayRepositories(repositories) {
    repositoriesContainer.innerHTML = "<h3>Repozitáře:</h3>";
    const list = document.createElement("ul");

    repositories.forEach(function (repo) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a> - ${repo.description ? repo.description : "Bez popisu"}
        `;
        list.appendChild(listItem);
    });

    repositoriesContainer.appendChild(list);
};
