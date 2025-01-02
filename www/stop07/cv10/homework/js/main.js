const CLIENT_ID = 'Ov23liT9xreOfe0W4Vbu';
const CLIENT_SECRET = '4ecb14101ff5091d0c140cf68b64c840a9c0394d';
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
        <p><strong>Login:</strong> ${user.login}</p>
        <p><strong>Bio:</strong> ${user.bio || 'No bio available'}</p>
        <p><strong>Location:</strong> ${user.location || 'No location available'}</p>
        <p><strong>Email:</strong> ${user.email || 'No email available'}</p>
        <p><strong>Followers:</strong> ${user.followers}</p>
        <p><strong>Registered:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
        <p><strong>GitHub Profile:</strong> <a href="${user.html_url}" target="_blank">${user.html_url}</a></p>
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
        userProfileContainer.hide();
        repositoriesContainer.hide();
        
        const user = await fetchUser(username);
        displayUser(user);
        userProfileContainer.show();
        
        const repositories = await fetchRepositories(user.login);
        displayRepositories(repositories);
        repositoriesContainer.show();
    } catch (error) {
        console.error(error);
        userProfileContainer.empty().append('<p>User not found</p>').show();
        repositoriesContainer.empty().hide();
    }
});