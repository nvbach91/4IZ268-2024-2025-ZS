/**
 * Git The Hub - Verze s CLIENT_ID a CLIENT_SECRET
 */

// GitHub API URL
const CLIENT_ID = 'Ov23lihfBIAHJzG8E5yu'; // Zde nahraďte svým CLIENT_ID
const CLIENT_SECRET = ' ce72bf98c46264fb7c2dd8dd6dc9c70ee010ba73'; // Zde nahraďte svým CLIENT_SECRET
const BASE_API_URL = 'https://api.github.com';

// Funkce pro načtení informací o uživatelském profilu
const fetchUser = async (username) => {
  const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  try {
    const response = await fetch(url);
    console.log(response);
    if (!response.ok) throw new Error('User not found');
    return await response.json();
  } catch (err) {
    console.error('Error fetching user:', err);
    throw err;
  }
};

// Funkce pro načtení repozitářů uživatele
const fetchRepositories = async (userLogin) => {
  const url = `${BASE_API_URL}/users/${userLogin}/repos`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Repositories not found');
    return await response.json();
  } catch (err) {
    console.error('Error fetching repositories:', err);
    throw err;
  }
};

// Funkce pro zobrazení informací o uživatelském profilu
const displayUser = (user) => {
  const profileContainer = $('#user-profile');
  profileContainer.empty(); // Vymazání předchozích výsledků

  if (user.message === 'Not Found') {
    profileContainer.append('<p>User not found</p>');
    return;
  }

  profileContainer.append(`
    <h2>${user.name || 'No name provided'}</h2>
    <p><strong>Username:</strong> ${user.login}</p>
    <p><strong>Bio:</strong> ${user.bio || 'No bio available'}</p>
    <p><strong>Location:</strong> ${user.location || 'Not specified'}</p>
    <p><strong>Public Repositories:</strong> ${user.public_repos}</p>
    <p><a href="${user.html_url}" target="_blank">GitHub Profile</a></p>
  `);
};

// Funkce pro zobrazení seznamu repozitářů
const displayRepositories = (repositories) => {
  const repoList = $('#repositories');
  repoList.empty(); // Vymazání předchozích výsledků

  if (repositories.length === 0) {
    repoList.append('<p>No repositories found</p>');
    return;
  }

  repositories.forEach(repo => {
    repoList.append(`
      <li>
        <a href="${repo.html_url}" target="_blank">${repo.name}</a> - ${repo.description || 'No description'}
      </li>
    `);
  });
};

// Inicializační funkce pro nastavení události na formulář
const init = () => {
  $('#search-form').on('submit', (event) => {
    event.preventDefault();
    const username = $('[name="username"]').val();
    if (username.trim() === '') return;

    // Načítání dat z GitHubu
    fetchUser(username).then(user => {
      displayUser(user);

      // Načítání repozitářů
      fetchRepositories(user.login).then(repositories => {
        displayRepositories(repositories);
      }).catch(err => {
        console.error('Error fetching repositories:', err);
        $('#repositories').empty().append('<p>No repositories found</p>');
      });
    }).catch(err => {
      console.error('Error fetching user:', err);
      $('#user-profile').empty().append('<p>User not found</p>');
      $('#repositories').empty();
    });
  });
};

// Po načtení stránky spustit hlavní funkce
$(document).ready(() => {
  init();
});
