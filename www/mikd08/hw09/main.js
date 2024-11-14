{
  /**
 * Git The Hub
 */
const App = {};

App.client_id = 'no need';
App.client_secret = 'interesting'; 
App.baseApiUrl = 'https://api.github.com';

App.renderUser = (user) => {
  $('#user-profile').html(`
    <div>
      <img src="${user.avatar_url}" alt="User Avatar" style="width: 150px; border-radius: 50%;" />
      <h3>${user.name} (${user.login})</h3>
      <p>${user.bio || 'No bio available'}</p>
      <p>Public Repos: ${user.public_repos}</p>
      <a href="${user.html_url}" target="_blank">View Profile</a>
    </div>
    <hr>
  `);
};

App.renderRepositories = (repos) => {
  $('#repositories').empty(); // clear the list first
  if (repos.length === 0) {
    $('#repositories').append('<li>No repositories available.</li>');
  } else {
    repos.forEach((repo) => {
      $('#repositories').append(`
        <li>
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <p>${repo.description || 'No description'}</p>
        </li>
      `);
    });
  }
};

App.fetchRepositories = (username) => {
  $.ajax({
    url: `${App.baseApiUrl}/users/${username}/repos`,
    data: {
      client_id: App.client_id,
      client_secret: App.client_secret
    },
    success: (repos) => {
      App.renderRepositories(repos);
    },
    error: () => {
      $('#repositories').html('<li>Error fetching repositories.</li>');
    }
  });
};

// fetch the user by username
App.fetchUser = (username) => {
  $.ajax({
    url: `${App.baseApiUrl}/users/${username}`,
    data: {
      client_id: App.client_id,
      client_secret: App.client_secret
    },
    success: (user) => {
      App.renderUser(user);
      App.fetchRepositories(username); // fetch the repositories after fetching the user
    },
    error: () => {
      $('#user-profile').html('<p>User not found.</p>');
      $('#repositories').empty(); // clear repositories if the user is not found
    }
  });
};

// initialize the app
App.init = () => {
  $('#search-form').on('submit', function (e) {
    e.preventDefault();
    const username = $('#username').val().trim();
    if (username) {
      App.fetchUser(username);
    } else {
      alert('Please enter a GitHub username');
    }
  });
};

$(document).ready(() => {
  App.init();
});

}