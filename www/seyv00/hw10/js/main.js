const CLIENT_ID = 'Ov23liTRHcrf142vFJ5G';
const CLIENT_SECRET = '3f301a5e1cfe13810d3a2898c515b5c6f03ccdc6';
const BASE_API_URL = 'https://api.github.com';

const userProfileContainer = $('#user-profile');
const userRepositories = $('#repositories');

const fetchUser = (username) => {
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

    return $.ajax({
        url: url,
        method: 'GET',
    });
};

const fetchRepositories = (userLogin) => {
    const url = `${BASE_API_URL}/users/${userLogin}/repos?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

    return $.ajax({
        url: url,
        method: 'GET',
    });
};

const displayUser = (user) => {
    userProfileContainer.empty().append(` 
        <div class="user-profile">
            <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
            <h2>${user.name || user.login}</h2>
            <p>${user.bio || 'No bio available'}</p>
            <p><a href="${user.html_url}" target="_blank">GitHub Profile</a></p>
        </div>
        `);
};

const displayRepositories = (repositories) => {
    userRepositories.empty();
    if (repositories.length === 0) {
        userRepositories.append('<p>User has no repositories</p>');
        return;
    }

    userRepositories.append(`<p>${repositories.length} repositories:</p>`);

    const repoList = $('<ul></ul>');
    repositories.forEach(repo => {
        repoList.append(`
            <li>
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'Repository has no description'}</p>
            </li>
        `);
    });
    userRepositories.append(repoList);
};

$('#search-form').on('submit', (e) => {
    e.preventDefault();
    const username = $('#username-input').val();

    if (!username) {
        alert('Please enter a username');
        return;
    }

    userProfileContainer.empty();
    userRepositories.empty();

    fetchUser(username)
        .then((user) => {
            displayUser(user);
            return fetchRepositories(user.login);
        })
        .then((repositories) => {
            displayRepositories(repositories);
        })
        .catch((err) => {
            console.error(err);
            userProfileContainer.empty().append('<p>User not found</p>');
        });
});