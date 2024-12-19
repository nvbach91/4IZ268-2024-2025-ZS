
const CLIENT_ID = 'Ov23liNQ20VdBQ0WmxeF';
const CLIENT_SECRET = '1fcd0d8d84cd6f970d6dabaf7f251597348004d1';
const BASE_API_URL = 'https://api.github.com';

const userProfileContainer = $('#user-profile');
const userInput = $('#user-input');

userInput.on('submit', async (e) => {
    e.preventDefault();
    const username = userInput.find('input').val();
    try {
        const data = await fetchUser(username);
        const repos = await fetchRepos(data.repos_url)
        const html = displayUsers(data, repos);
        userProfileContainer.empty().append(html)
    } catch (err) {
        userProfileContainer.empty().append('<p>User not found</p>');
    }

});

const displayUsers = (data, repos) => {
    const date = new Date(data.created_at);
    const date_string = `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`
    var repos_html = `<p>${data.login} has ${repos.length} repositories</p>`;

    repos.forEach(element => {
        repos_html += `<div class="repo">${element.name}: <a href="${element.html_url}" target="_blank">${element.html_url}</a></div>`;
    });

    const html = `<div>
                <h2>${data.name || ''}</h2>
                <ul class="info">
                    <img src="${data.avatar_url}">
                    <li>Login: ${data.login}</li>
                    <li>Bio: ${data.bio || '---'}</li>
                    <li>Location: ${data.location || '---'}</li>
                    <li>Email: ${data.email || '---'}</li>
                    <li>Followers: ${data.followers}</li>
                    <li>Created at: ${date_string}</li>
                    <li>Link: ${data.url}</li>
                </ul>
            </div>
            <div class="repos">
                <h2>Repositories</h2>
                ${repos_html}
            </div>`

    return html;
}

const fetchRepos = async (link) => {
    const url = `${link}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
};

const fetchUser = async (username) => {
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
};



