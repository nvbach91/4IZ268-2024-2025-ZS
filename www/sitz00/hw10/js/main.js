const CLIENT_ID = 'Ov23liqWKQto8CAzBJWj';
const CLIENT_SECRET = '8f6e1eaf50ad91f273e8200965c64f592eacb2f2';
const BASE_API_URL = 'https://api.github.com';

const userProfile = $('#userData');
const repoContainer = $('#repoContainer');

userProfile.hide();
repoContainer.hide();

const fetchUser = async (username) => {
    console.log(username)
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    const userResponse = await fetch(url);
    if (!userResponse.ok) throw new Error("User not found");
    return await userResponse.json();
};

const fetchRepositories = async (userLogin) => {
    const url = `${BASE_API_URL}/users/${userLogin}/repos?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    const repositoriesResponse = await fetch(url);
    if (!repositoriesResponse.ok) throw new Error("Repositories not found");
    return await repositoriesResponse.json();
};

const displayUser = (user) => {
    const userProfile = $('#userData');
    userProfile.empty().append(`
        <div>
            <img src="${user.avatar_url}" alt="${user.name}" class="user-avatar">
            <h2>${user.name || user.login}</h2>
            <p>${user.bio || 'Žádný popis není k dispozici'}</p>
            <div class="user-stats">
                <span>Sledující: ${user.followers}</span>
                <span>Sleduje: ${user.following}</span>
                <span>Veřejné repozitáře: ${user.public_repos}</span>
            </div>
        </div>
    `);
    userProfile.show();
};

const displayRepositories = (repositories) => {
    const repoHTML = repositories.map(repo => `
        <div class="repo-item">
            <h3>${repo.name}</h3>
            <p>${repo.description || 'Žádný popis není k dispozici'}</p>
            <div class="repo-stats">
                <a href="${repo.html_url}" target="_blank">Zobrazit repozitář</a>
            </div>
        </div>
    `).join('');

    repoContainer.empty().append(repoHTML).show();
};


$('#submit').on('click', async (event) => {
    event.preventDefault();
    const username = $('#searchInput').val();

    if (!username) {
        alert("Please enter a username.");
        return;
    }

    try {

        const user = await fetchUser(username);
        displayUser(user);

        const repositories = await fetchRepositories(user.login);
        displayRepositories(repositories);
    } catch (err) {
        console.error(err);
        userProfile.empty().append('<p>User not found</p>');
        repoContainer.hide();
    }
});