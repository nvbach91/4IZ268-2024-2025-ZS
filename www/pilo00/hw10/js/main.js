const CLIENT_ID = 'Ov23liLlz95KVE3kP1E3';
const CLIENT_SECRET = '413d19fe7ced0146739e80cabf80146b07c35d42';
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
  
  // Display user information
  const displayUser = (user) => {
    $('#user-profile').html(`
      <div class="user-info">
        <img src="${user.avatar_url}" alt="${user.login}'s avatar">
        <div class="details">
          <h2>${user.login.toUpperCase()}</h2>
          <p><strong>Bio:</strong> ${user.bio || 'Not available'}</p>
          <p><strong>Location:</strong> ${user.location || 'Not specified'}</p>
          <p><strong>Followers:</strong> ${user.followers}</p>
          <p><strong>Registered:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
          <a href="${user.html_url}" target="_blank">View Profile</a>
        </div>
      </div>
    `);
    $('#user-profile').css('display', 'block'); // Make the user profile visible
  };
  
  // Display repositories
  const displayRepositories = (repositories) => {
    if (repositories.length === 0) {
      $('#repositories').html('<p>No repositories found</p>');
    } else {
      const repoList = repositories
        .map(
          (repo) =>
            `<tr>
              <td>${repo.name}</td>
              <td><a href="${repo.html_url}" target="_blank">${repo.html_url}</a></td>
            </tr>`
        )
        .join('');
      $('#repositories').html(`
        <h2>Repositories</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            ${repoList}
          </tbody>
        </table>
      `);
    }
    $('#repositories').css('display', 'block'); // Make the repositories section visible
  };
  
  // Handle button click
  $('#find-btn').on('click', async () => {
    const username = $('#username').val().trim();
    if (!username) {
      alert('Please enter a GitHub username');
      return;
    }
  
    try {
      // Fetch user data
      const user = await fetchUser(username);
      displayUser(user);
  
      // Fetch repositories
      const repositories = await fetchRepositories(username);
      displayRepositories(repositories);
    } catch (err) {
      $('#user-profile').html('<p>User not found</p>').css('display', 'block');
      $('#repositories').html('<p>No repositories to display</p>').css('display', 'block');
    }
  });
  