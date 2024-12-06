const CLIENT_ID = 'YOUR_CLIENT_ID'; // Nahraďte vaším Client ID
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // Nahraďte vaším Client Secret
const BASE_API_URL = 'https://api.github.com';

const userProfileContainer = $('#user-profile');

const fetchUser = async (username) => {
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    return $.ajax({ url, method: 'GET' });
};

const fetchRepositories = async (userLogin) => {
    const url = `${BASE_API_URL}/users/${userLogin}/repos?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    return $.ajax({ url, method: 'GET' });
};

const displayUser = (user) => {
    const formattedDate = new Date(user.created_at).toLocaleDateString();
    userProfileContainer.empty().append(`
        <div class="profile-container">
            <div class="profile-left">
                <img src="${user.avatar_url}" alt="Avatar">
                <h2>${user.name || user.login}</h2>
                <a href="${user.html_url}" target="_blank">View profile</a>
            </div>
            <div class="profile-right">
                <table class="profile-table">
                    <tr>
                        <td>Login</td>
                        <td>${user.login}</td>
                    </tr>
                    <tr>
                        <td>Bio</td>
                        <td>${user.bio || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Location</td>
                        <td>${user.location || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td>${user.bio || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>${user.email || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Followers</td>
                        <td>${user.followers}</td>
                    </tr>
                    <tr>
                        <td>Registered</td>
                        <td>${formattedDate}</td>
                    </tr>
                    <tr>
                        <td>Profile URL</td>
                        <td><a href="${user.html_url}" target="_blank">${user.html_url}</a></td>
                    </tr>
                </table>
            </div>
        </div>
        <h3>Repositories:</h3>
        <div id="repositories"></div>
    `);
};

const displayRepositories = (repositories) => {
    const repositoriesContainer = $('#repositories');
    repositoriesContainer.empty();
    if (repositories.length === 0) {
        repositoriesContainer.append('<p>No repositories found</p>');
        return;
    }
    repositories.forEach((repo) => {
        repositoriesContainer.append(`
            <div class="repository">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'No description'}</p>
            </div>
        `);
    });
};

$('#github-form').on('submit', async (event) => {
    event.preventDefault();
    const username = $('#username').val().trim();
    if (!username) return;

    try {
        const userResp = await fetchUser(username);
        displayUser(userResp);
        const repositoriesResp = await fetchRepositories(userResp.login);
        displayRepositories(repositoriesResp);
    } catch (err) {
        console.error(err);
        userProfileContainer.empty().append('<p>User not found</p>');
    }
});
