/**
 * Git The Hub
 */
// It is best practice to create variables and functions under one object to avoid global polution
const App = {};
// INSERT CLIENT ID FROM GITHUB
App.client_id = 'Ov23ligsg5dPXrWI6ZGk';
// INSERT CLIENT SECRET FROM GITHUB
App.client_secret = '5a393e3fd172b613b173339349e0b5447b8fc059';
App.baseApiUrl = 'https://api.github.com';

// render the user's information
App.renderUser = (user) => {
  var createdDate = new Date(user.created_at).toLocaleDateString('cs-CZ');
  var html = /*html*/`
    <div class="basic-info">
      <div class="bi-name">${user.name || ''}</div>
      <div class="bi-avatar" style="background-image: url(${user.avatar_url})"></div>
      <div class="bi-info bi-username">
        <div>Login</div>
        <div>${user.login}</div>
      </div>
      <div class="bi-info bi-company">
        <div>Bio</div>
        <div>${user.company || ''}</div>
      </div>
      <div class="bi-info bi-location">
        <div>Location</div>
        <div>${user.location || ''}</div>
      </div>
      <div class="bi-info bi-bio">
        <div>Description</div>
        <div>${user.bio || ''}</div>
      </div>
      <div class="bi-info bi-email">
        <div>Email</div>
        <div>${user.email || ''}</div>
      </div>
      <div class="bi-info bi-followers">
        <div>Followers</div>
        <div>${user.followers || ''}</div>
      </div>
      <div class="bi-info bi-created">
        <div>Registered</div>
        <div>${createdDate}</div>
      </div>
      <div class="bi-info bi-profile"><a href="${user.html_url || ''}">${user.html_url || ''}</a></div>
      <a class="btn bi-view" href="${user.html_url || ''}" target="_blank">View profile</a>
    </div>
  `;
  App.jUserProfile.html(html);
  
};

// a function that fetches repositories of users based on their username
App.fetchRepositories = (username) => {
  App.jRepositories.empty();
  App.jRepositories.append(App.loader);
  var url = App.baseApiUrl + '/users/' + username + '/repos';
  $.ajax({
    url: url,
    data: {
      client_id: App.client_id,
      client_secret: App.client_secret,
    },
  }).done(function(repositories) {
    App.loader.remove();
    var html = `<p>This user has ${repositories.length} repositories</p>`;
    repositories.forEach(function(repository) {
      html += /*html*/`
        <li class="repository">
          <div class="repo-name">${repository.name}</div>
          <div class="repo-url"><a href="${repository.html_url}">${repository.html_url}</a></div>
        </li>
      `;
    });
    App.jRepositories.empty().append(html);
  });
  
};



App.init = () => {
  App.jUserProfile = $('#user-profile');
  App.jSearchInput = $('#search-input');
  App.jSearchForm = $('#search-form');
  App.jRepositories = $('#repositories');
  App.loader = $('<div class="loader"></div>');
  App.jSearchForm.submit(function(e) {
    e.preventDefault();
    var searchValue = App.jSearchInput.val();
    if (!searchValue) {
      return false;
    }
    var url = App.baseApiUrl + '/users/' + searchValue;
    App.jUserProfile.empty();
    App.jUserProfile.append(App.loader);
    $.ajax({
      url: url,
      data: {
        client_id: App.client_id,
        client_secret: App.client_secret,
      },
    }).done(function(user) {
      App.renderUser(user);
      App.fetchRepositories(user.login);
    }).fail(function() {
      App.jUserProfile.html('<p>User not found</p>');
    });
  });
  
};


// wait for the page to load, then execute the main processes
$(document).ready(() => {
  App.init();
});