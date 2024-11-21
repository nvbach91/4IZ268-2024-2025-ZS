/**
 * Git The Hub
 */
// It is best practice to create variables and functions under one object to avoid global polution
const App = {};
// INSERT CLIENT ID FROM GITHUB
App.client_id = '...';
// INSERT CLIENT SECRET FROM GITHUB
App.client_secret = '...';
App.baseApiUrl = 'https://api.github.com';

// render the user's information
App.renderUser = (user) => {
  
};

// a function that fetches repositories of users based on their username
App.fetchRepositories = (username) => {
  
};
App.init = () => {
  
};

// wait for the page to load, then execute the main processes
$(document).ready(() => {
  App.init();
});