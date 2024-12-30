const CLIENT_ID = 'Ov23liZCtJrsTXkARlJL';
const CLIENT_SECRET = '6c2b439e8d4020fd85245af7dfa08b7bf9199946';
const BASE_API_URL = 'https://api.github.com';

// Fetch user data
const fetchUser = async (username) => {
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('User not found');
    return response.json();
};

// Fetch repositories
const fetchRepositories = async (username) => {
    const url = `${BASE_API_URL}/users/${username}/repos?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Repositories not found');
    return response.json();
};

// Display user profile
const displayUser = (user) => {
    const profileHTML = `
        <div class="profile">
            <img src="${user.avatar_url}" alt="${user.login}'s avatar" class="avatar">
            <h2>${user.name || user.login}</h2>
            <p><strong>Bio:</strong> ${user.bio || 'Not available'}</p>
            <p><strong>Location:</strong> ${user.location || 'Not specified'}</p>
            <p><strong>Followers:</strong> ${user.followers}</p>
            <a href="${user.html_url}" target="_blank">View Profile</a>
        </div>
    `;
    $('#user-profile').html(profileHTML);
};

// Display repositories
const displayRepositories = (repositories) => {
    if (!repositories.length) {
        $('#repositories').html('<p>No repositories found</p>');
        return;
    }
    const repoHTML = repositories
        .map(repo => `
            <div class="repository">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'No description available'}</p>
            </div>
        `)
        .join('');
    $('#repositories').html(repoHTML);
};

// Handle form submission
$('#github-form').on('submit', async (e) => {
    e.preventDefault();
    const username = $('#username').val().trim();
    if (!username) {
        alert('Please enter a username');
        return;
    }
    $('#user-profile').html('<div class="loader"></div>');
    $('#repositories').html('');

    try {
        const user = await fetchUser(username);
        displayUser(user);
        const repos = await fetchRepositories(user.login);
        displayRepositories(repos);
    } catch (error) {
        $('#user-profile').html('<p>User not found</p>');
        $('#repositories').html('');
    }
});
