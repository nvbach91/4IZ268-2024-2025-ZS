const CLIENT_ID = 'Ov23lifUurRuQGJS8q56';
const CLIENT_SECRET = 'bc9252ff9c08888f3eab548bdd6e09c6d58c54a8';
const BASE_API_URL = 'https://api.github.com';

const userProfileContainer = $('#user-profile')
const userRepositories = $('#repositories');
const searchForm = $('#search-form');

const fetchUser = async (username) => {
    // sestavujeme URL, který obsahuje parametry CLIENT_ID a CLIENT_SECRET
    // každý parametr se určuje v podobě klíč=hodnota, parametry se oddělují ampersandem, 
    // na začátek přidáme otazník
    // např. ?client_id=abcdef&client_secret=fedcba
    try {
        const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
        
        const resp = await fetch(url); //  odpověď od serveru - data usera
        if (!resp.ok) { // pokud je odpověď neúspěšná
            throw new Error(`Failed to fetch user: ${resp.status} ${resp.statusText}`);
        }
        const data = await resp.json(); // 'data' obsahuje JSON data jako JavaScriptový objekt

        
        if (!data || !data.login) { // ověření struktury dat - data není null, undefined atd., v objektu data existuje klíč login 
            throw new Error("API response does not contain the expected user data");
        }

        return data;
    } catch (error) { // zachycení chyb z bloku try
        console.error("Error fetching user:", error.message); // chybová zpráva se ukáže v konzoli
        throw error; // předává chybu dále, aby ji mohl řešit kód, který tuto funkci volá
    }
};
const fetchRepositories = async (userLogin) => {
    
    try {
        const url = `${BASE_API_URL}/users/${userLogin}/repos?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
        const resp = await fetch(url);

        if (!resp.ok) {
            throw new Error(`Failed to fetch repositories: ${resp.status} ${resp.statusText}`);
        }

        const data = await resp.json();
        return data; // vrací seznam repozitářů
    } catch (error) {
        console.error("Error fetching repositories:", error.message);
        throw error;
    }
};
const displayUser = (user) => {
    
    if (!user || !user.login) {
        console.error("User data is invalid:", user);
        return;
    }

    const userProfileUrl = `https://github.com/${user.login}`;// získání url adresy profilu uživatele
    const userAvatarUrl = user.avatar_url; // URL na avatar uživatele

    // vytvoří HTML obsah na základě dat uživatele, jQuerry objekt
    const userElements = $(` 
        <article>
            <div class="user-profile">
                <div class="profile-header">
                    <h3>${user.login}</h3>
                </div>
                <div class="profile-content">
                    <img src="${userAvatarUrl}" alt="${user.login}'s avatar" class="avatar"> 
                    <div class="user-info">
                        <p><strong>Bio:</strong> ${user.bio || 'No bio available'}</p>
                        <p><strong>Location:</strong> ${user.location || 'Unknown'}</p>
                        <p><strong>Email:</strong> ${user.email || 'Not provided'}</p>
                        <p><strong>Followers:</strong> ${user.followers}</p>
                        <p><strong>Following:</strong> ${user.following}</p>
                        <p><strong>Account created:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
                        <p><strong>Profile URL:</strong> <a href="${userProfileUrl}" target="_blank">${userProfileUrl}</a></p>
                    </div>
                </div>
            </div>
        </article>
    `);
    
//odstranění dat z userProfileContainer z předchozího hledání a vyplnění nových dat
    userProfileContainer.empty().append(userElements);
};

const displayRepositories = (repositories) => {
    
    if (!Array.isArray(repositories) || repositories.length === 0) { // kontrola, zda ropositories je pole a je neprázdné
        userRepositories.empty().append('<p>No repositories found</p>');
        return;
    }

    const repositoriesCount = repositories.length; // spočítání repozitářů
    const repoCountMessage = `<p>This user has <strong>${repositoriesCount}</strong> public repositories</p>`; // vypsání počtu repozitářů
    // vytvoření seznamu z prvků pole repositories, klikací odkaz, popis
    const repoElements = repositories.map(repo => `
        <li>
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            - ${repo.description || 'No description'}
        </li>
    `).join('');

    userRepositories.empty().append(repoCountMessage + `<ul>${repoElements}</ul>`);
};

searchForm.on('submit', async (event) => { // akce po potvrzení formuláře
    event.preventDefault(); // zákaz defaultního chování formuláře
    const username = searchForm.find('input[name="username"]').val().trim(); // získání hodnoty ze vstupu a odstranění přebytečných mezer

    if (!username) { // pokud je potvrzen prázdný formulář
        userRepositories.empty();
        userProfileContainer.empty().append('<p>Please enter a username!</p>');
        //alert("Please enter a username!");
        return;
    }

    userProfileContainer.empty(); // vymaže předchozí uživatelská data
    userRepositories.empty(); // vymaže předchozí seznam repozitářů

    try {
        // načtení a zobrazení uživatelských dat
        const userResp = await fetchUser(username);
        displayUser(userResp);
        // načtení a zobrazení uživatelských repozitářů
        const repositoriesResp = await fetchRepositories(userResp.login);
        displayRepositories(repositoriesResp);
    } catch (err) {
        console.error(err);
        userProfileContainer.empty().append('<p>User not found</p>');
    }
});
