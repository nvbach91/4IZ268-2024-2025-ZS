const CLIENT_ID = 'Ov23liy62ABR2OSNcpwQ';
const CLIENT_SECRET = '5be4340a3d0645139cf2c74598284631baf07f6a';
const BASE_API_URL = 'https://api.github.com';

const userProfileContainer = $('#user-profile');
const repositoriesContainer = $('#repositories');

const fetchUser = async (username) => {
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('User not found');
    return response.json();
};

const fetchRepositories = async (userLogin) => {
    const url = `${BASE_API_URL}/users/${userLogin}/repos?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Repositories not found');
    return response.json();
};

const displayUser = (user) => {
    userProfileContainer.empty().append(`
        <h2>${user.login}</h2>
        <img src="${user.avatar_url}" alt="${user.login}" width="100">
        <p>${user.bio ? user.bio : 'No bio available'}</p>
        <p>Followers: ${user.followers}</p>
        <p>Following: ${user.following}</p>
        <p>Public Repos: ${user.public_repos}</p>
    `);
};

const displayRepositories = (repositories) => {
    repositoriesContainer.empty().append('<h3>Repositories:</h3>');
    repositories.forEach(repo => {
        repositoriesContainer.append(`
            <div>
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description}</p>
            </div>
        `);
    });
};

$('#search').on('click', async () => {
    const username = $('#username').val();
    try {
        const user = await fetchUser(username);
        displayUser(user);
        const repositories = await fetchRepositories(user.login);
        displayRepositories(repositories);
    } catch (err) {
        console.error(err);
        userProfileContainer.empty().append('<p>User not found</p>');
        repositoriesContainer.empty();
    }
});