// Příklad volání na GitHub API
const CLIENT_ID = 'Ov23liEDn09Dpa3zsBEW';
const CLIENT_SECRET = 'd8f8877319f8154fac4dc4e29886576012dcbeec';
const BASE_API_URL = 'https://api.github.com';

const userProfileContainer = $('#user-profile');
const repositoriesContainer = $('#repositories');

$(document).ready(function () {
    $('#search-form').submit(async function (event) {
        // Prevent the form from submitting
        event.preventDefault();


        repositoriesContainer.empty();
        userProfileContainer.empty();


        // Get the value from the input field
        const inputValue = $('#usernameInput').val();

        $('#loader').css('display', 'block');

        const user = await fetchUser(inputValue);
        const userRepositories = await fetchRepositories(inputValue);

        console.log('User repositories: ', userRepositories);
        console.log('User: ', user)

        if (user && userRepositories) {
            userProfileContainer.css('display', 'flex');
            displayUser(user);
            displayRepositories(userRepositories);
        } else {
            userProfileContainer.css('display', 'none');
        }
        $('#loader').css('display', 'none');

    });
});

const fetchUser = async (username) => {
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    const userResponse = await fetch(url);

    if (userResponse.ok) {
        return userResponse.json();
    }
};

const fetchRepositories = async (userLogin) => {
    const url = BASE_API_URL + "/users/" + userLogin + "/repos?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;
    const repoResponse = await fetch(url);

    if (repoResponse.ok) {
        return repoResponse.json();
    }
};

const displayUser = (user) => {
    const date = new Date(user.created_at);
    const createdAt = date.toLocaleDateString();
    const userInfo = $('<ul>' +
        `<li><p class="property-key">Login</p><p class="property-value">${user.login || 'Unknown'}</p></li>` +
        `<li><p class="property-key">Bio</p><p class="property-value">${user.bio || 'Unknown'}</p></li>` +
        `<li><p class="property-key">Location</p><p class="property-value">${user.location || 'Unknown'}</p></li>` +
        `<li><p class="property-key">Description</p><p class="property-value">${user.blog || 'Unknown'}</p></li>` +
        `<li><p class="property-key">Email</p><p class="property-value">${user.email || 'Unknown'}</p></li>` +
        `<li><p class="property-key">Followers</p><p class="property-value">${user.followers || 'Unknown'}</p></li>` +
        `<li><p class="property-key">Registered</p><p class="property-value">${createdAt}</p></li>` +
        `<li><a href="${user.html_url}">${user.html_url}</a></li>`+
        '</ul>');
    const userImg = $(`<img src="${user.avatar_url}">`);
    userProfileContainer.append(userInfo);
    userProfileContainer.append(userImg)
};

const displayRepositories = (repositories) => {

    repositories.forEach(repository => {
        const repoInfo =
            $(`<li><p class="repository-name">${repository.name}</p><p><a href="${repository.html_url}">${repository.html_url}</a></p></li>`);
        repositoriesContainer.append(repoInfo);
    })
};