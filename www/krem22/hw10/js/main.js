const CLIENT_ID = 'Ov23liGcbxOpR4VDjFRY';
const CLIENT_SECRET = 'c178c0318a75d3c6aaeace7c814fa4269f788b38';
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
    userProfileContainer.empty();
    userProfileContainer.append(`
    <h2>${user.name || user.login}</h2>
    <img src="${user.avatar_url}" alt="${user.login}" width="100">
    <p>Bio: ${user.bio || 'No bio available'}</p>
    <p>Location: ${user.location || 'No location available'}</p>
    <p>Public Repos: ${user.public_repos}</p>
  `);
};

const displayRepositories = (repositories) => {
    repositoriesContainer.empty();
    if (repositories.length === 0) {
        repositoriesContainer.append('<p>No repositories found</p>');
        return;
    }
    repositoriesContainer.append('<h3>Repositories:</h3>');
    repositories.forEach((repo) => {
        repositoriesContainer.append(`
      <div class="repository">
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <p>${repo.description || 'No description available'}</p>
      </div>
    `);
    });
};

$('#search-button').click(async () => {
    const username = $('#username').val().trim();
    if (!username) {
        alert('Please enter a username');
        return;
    }
    try {
        const user = await fetchUser(username);
        displayUser(user);
        const repositories = await fetchRepositories(user.login);
        displayRepositories(repositories);
    } catch (error) {
        console.error(error);
        userProfileContainer.empty().append('<p>User not found</p>');
        repositoriesContainer.empty();
    }
});
