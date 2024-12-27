const CLIENT_ID = 'Ov23liYHsezmJeBQTbWY';
const CLIENT_SECRET = '0a8599351f1050ffac90a3c7ca39f7bd516244e7';
const BASE_API_URL = 'https://api.github.com';

const userProfileContainer = document.getElementById('user-profile');
const repositoriesContainer = document.getElementById('repositories');


const fetchUser = async (username) => {
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('User not found');
        }
        return await response.json();
    } catch (error) {
        throw new Error('User not found');
    }
};

const fetchRepositories = async (userLogin) => {
    const url = `${BASE_API_URL}/users/${userLogin}/repos?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Repositories not found');
        }
        return await response.json();
    } catch (error) {
        throw new Error('Repositories not found');
    }
};

const displayUser = (user) => {
    userProfileContainer.innerHTML = `
        <h2>${user.name || user.login}</h2>
        <img src="${user.avatar_url}" alt="User Avatar">
        <p><strong>Username:</strong> ${user.login}</p>
        <p><strong>Followers:</strong> ${user.followers}</p>
        <p><strong>Following:</strong> ${user.following}</p>
        <p><strong>Public Repositories:</strong> ${user.public_repos}</p>
        <a href="${user.html_url}" target="_blank">Visit Profile</a>
    `;
};

const displayRepositories = (repositories) => {
    repositoriesContainer.innerHTML = '';
    if (repositories.length === 0) {
        repositoriesContainer.innerHTML = '<p>No repositories found.</p>';
        return;
    }
    const reposList = document.createElement('div');
    reposList.innerHTML = '<h3>Repositories:</h3>';
    repositories.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.className = 'repo';
        repoElement.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>&#9733; ${repo.stargazers_count}</p>
        `;
        reposList.appendChild(repoElement);
    });
    repositoriesContainer.appendChild(reposList);
};

document.getElementById('github-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    if (!username) return;

    userProfileContainer.innerHTML = '';
    repositoriesContainer.innerHTML = '';

    try {
        const user = await fetchUser(username);
        displayUser(user);

        const repositories = await fetchRepositories(user.login);
        displayRepositories(repositories);
    } catch (error) {
        userProfileContainer.innerHTML = '<p>User not found. Please try again.</p>';
    }
});