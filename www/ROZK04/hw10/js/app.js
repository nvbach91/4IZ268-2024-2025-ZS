/**
 * Git The Hub
 */
// It is best practice to create variables and functions under one object to avoid global pollution
const App = {};

App.client_id = 'Ov23liBvBoFaxYgQKhEv'; 
App.client_secret = 'da580cfcfadc1a2e6b75175910246d0f02e30a72'; 
App.baseApiUrl = 'https://api.github.com';


App.renderUser = (user) => {
  const userProfileContainer = $('#user-profile');

  userProfileContainer.html(`
    <div>
      <img src="${user.avatar_url}" alt="${user.login}'s avatar" width="100">
      <h3>${user.name || user.login}</h3>
      <p><strong>Bio:</strong> ${user.bio || 'N/A'}</p>
      <p><strong>Location:</strong> ${user.location || 'N/A'}</p>
      <p><strong>Public Repos:</strong> ${user.public_repos}</p>
      <p><a href="${user.html_url}" target="_blank">View on GitHub</a></p>
    </div>
  `);
};


App.fetchRepositories = (username) => {
  const url = `${App.baseApiUrl}/users/${username}/repos?client_id=${App.client_id}&client_secret=${App.client_secret}`;

  return $.ajax({
    url: url,
    method: 'GET',
    success: (data) => {
      App.renderRepositories(data);
    },
    error: (err) => {
      $('#repositories').html('<p class="error">Repositories not found or user does not have any.</p>');
    }
  });
};


App.renderRepositories = (repositories) => {
  const repositoriesContainer = $('#repositories');
  
  if (repositories.length === 0) {
    repositoriesContainer.html('<p>No repositories found</p>');
    return;
  }

  const reposList = repositories.map(repo => `
    <li>
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      - ${repo.description || 'No description available'}
    </li>
  `).join('');

  repositoriesContainer.html(`
    <h3>Repositories:</h3>
    <ul>${reposList}</ul>
  `);
};


App.fetchUser = (username) => {
  const url = `${App.baseApiUrl}/users/${username}?client_id=${App.client_id}&client_secret=${App.client_secret}`;

  $.ajax({
    url: url,
    method: 'GET',
    success: (data) => {
      App.renderUser(data);
      App.fetchRepositories(data.login);
    },
    error: (err) => {
      $('#user-profile').html('<p class="error">User not found.</p>');
      $('#repositories').empty();
    }
  });
};


App.init = () => {
  $('#search-form').on('submit', (event) => {
    event.preventDefault();
    const username = $('input[name="username"]').val().trim();
    if (!username) return;
    $('#user-profile').empty();
    $('#repositories').empty();
    App.fetchUser(username);
  });
};
$(document).ready(() => {
  App.init();
});
