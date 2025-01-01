const CLIENT_ID = 'Ov23liJsJsn1Mc7FHiCU';
const CLIENT_SECRET = '9128c2f5abcdb42e91e26e2308dd8cce97209388';
const BASE_API_URL = 'https://api.github.com';

const fetchUser = async (username) => {
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('User not found');
    return response.json();
};

const fetchRepositories = async (username) => {
    const url = `${BASE_API_URL}/users/${username}/repos`;
    const response = await fetch(url);
    return response.json();
};

const displayUser = (user) => {
    const profileHTML = `
        <img src="${user.avatar_url}">
        <table>
            <tr><td><strong>Login</strong></td><td>${user.login}</td></tr>
            <tr><td><strong>Bio</strong></td><td>${user.bio || 'Not available'}</td></tr>
            <tr><td><strong>Location</strong></td><td>${user.location || 'Not available'}</td></tr>
            <tr><td><strong>Followers</strong></td><td>${user.followers}</td></tr>
            <tr><td><strong>Registered</strong></td><td>${new Date(user.created_at).toLocaleDateString()}</td></tr>
            <tr><td><strong>Profile</strong></td><td><a href="${user.html_url}" target="_blank">${user.html_url}</a></td></tr>
        </table>
    `;
    document.getElementById('user-profile').innerHTML = profileHTML;
};

const displayRepositories = (repositories) => {
    let reposHTML = '<h3>Repositories</h3>';
    if (repositories.length === 0) {
        reposHTML += '<p>No repositories.</p>';
    } else {
        reposHTML += '<ul>';
        repositories.forEach(repo => {
            reposHTML += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`;
        });
        reposHTML += '</ul>';
    }
    document.getElementById('user-repositories').innerHTML = reposHTML;
};

document.getElementById('search').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert('Enter a username');
        return;
    }

    try {
        document.getElementById('user-profile').innerHTML = '<p>Loading...</p>';
        document.getElementById('user-repositories').innerHTML = '';

        const user = await fetchUser(username);
        displayUser(user);

        const repositories = await fetchRepositories(username);
        displayRepositories(repositories);
    } catch (error) {
        document.getElementById('user-profile').innerHTML = `<p>${error.message}</p>`;
        document.getElementById('user-repositories').innerHTML = '';
    }
});
