const CLIENT_ID = 'Ov23liW3ag4VLP0yXA3t';
const CLIENT_SECRET = '8cb212a12649560c75600adc97f78facb1bfc056';
const BASE_API_URL = 'https://api.github.com';

const userProfileContainer = $('#user-profile');

const fetchUser = async (username) => {
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    return $.ajax({ url });
};

const fetchRepositories = async (userLogin) => {
    const url = `${BASE_API_URL}/users/${userLogin}/repos?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    return $.ajax({ url });
};

const displayUser = (user) => {
    userProfileContainer.html(`
        <div>
            <img src="${user.avatar_url}" alt="${user.login}" width="100" />
            <h2>${user.name || user.login}</h2>
            <p>${user.bio || 'No bio available'}</p>
            <p><a href="${user.html_url}" target="_blank">View Profile</a></p>
        </div>
        <div class="repo-list">
            <h3>Repositories:</h3>
            <ul id="repo-list"></ul>
        </div>
    `).show();
};

const displayRepositories = (repositories) => {
    const repoList = repositories.map(repo => `
        <li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>
    `).join('');
    $('#repo-list').html(repoList || '<p>No repositories found.</p>');
};

const hideUserProfile = () => {
    userProfileContainer.empty().hide();
};

$('#search-form').on('submit', async (e) => {
    e.preventDefault();
    const username = $('#username').val().trim();

    if (!username) return;

    hideUserProfile();

    try {
        const userResp = await fetchUser(username);
        displayUser(userResp);
        const repositoriesResp = await fetchRepositories(userResp.login);
        displayRepositories(repositoriesResp);
    } catch (err) {
        console.error(err);
        userProfileContainer.html('<p>User not found</p>');
    }
});