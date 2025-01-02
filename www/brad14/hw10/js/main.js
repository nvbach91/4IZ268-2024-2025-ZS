const CLIENT_ID = 'Ov23liFQYCog25JzKTfv';
const CLIENT_SECRET = '99afb8245a93c34510288cf26d2aeb7309f42e92';
const BASE_API_URL = 'https://api.github.com';

const userProfileContainer = $('#user-profile')

const fetchUser = async (username) => {
  const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('User not found');
    }
    const data = await res.json();
    displayUser(data);
    fetchRepositories(data.repos_url);
  } catch (err) {
    console.error(err);
    userProfileContainer.empty().append('<p>User not found</p>');
  }
};



const fetchRepositories = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  displayRepositories(data);
};


const displayUser = (user) => {
  const html = `
      <div class="user-box">
          <img width="120" class="user-picture" src="${user.avatar_url}"
              alt="User profile picture">
          <table class="user-table">
            ${user.name ? `
              <tr>
                <th>Name:</th>
                <td>${user.name}</td>
              </tr>
              ` : ''}
              <tr>
                  <th>Public repos:</th>
                  <td>${user.public_repos}</td>
              </tr>
              <tr>
                  <th>Followers:</th>
                  <td>${user.followers}</td>
              </tr>
              <tr>
                  <th>Member since:</th>
                  <td>${user.created_at.slice(0, this.length - 10)}</td>
              </tr>
              ${user.location ? `
                <tr>
                  <th>Location:</th>
                  <td>${user.location}</td>
                </tr>
                ` : ''}
              ${user.company ? `
                <tr>
                  <th>Company:</th>
                  <td>${user.company}</td>
                </tr>
                ` : ''}
              ${user.hireable ? `
                <tr>
                  <th>Hireable:</th>
                  <td>${user.hireable}</td>
                </tr>
                ` : ''}
              ${user.email ? `
                <tr>
                  <th>Email:</th>
                  <td>${user.email}</td>
                </tr>
                ` : ''}
          </table>
          <button><a href="${user.html_url}">View profile</a></button>
      </div>`;
  userProfileContainer.empty().append(html);
};



const displayRepositories = (repositories) => {
  const html = `
    <div class="title">
      <h2>Repositories:</h2>
    </div>
    ${repositories.length === 30 ? `<p>Showing first 30 repositories.</p>` : `<p>This user has ${repositories.length} repositories.</p>`}
    ${populateRepositories(repositories)}
    `;
  $('.repositories').empty().append(html);
};

const populateRepositories = (repositories) => {
  let html = '';
  repositories.forEach((repo) => {
    const repoHtml = `
      <div class="repository">
        <h3>
            <a href="${repo.html_url}">${repo.name}</a>
        </h3>
        <p>${repo.description}</p>
      </div>
    `;
    html += repoHtml;
  });
  return html;
}

$('form').on('submit', async (e) => {
  e.preventDefault();
  const username = $('input[name="username"]').val();
  fetchUser(username);
});