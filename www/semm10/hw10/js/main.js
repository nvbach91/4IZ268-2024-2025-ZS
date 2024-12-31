const CONFIG = {
    clientId: "Ov23liI63jYjcJ1HulTk",
    clientSecret: "d88066829401fa0e74ff0393140e0da061a466e6",
    apiUrl: "https://api.github.com"
  };
  
  const userProfileContainer = $("#user-profile");
  const repositoriesContainer = $(".repositories");
  
  $("form").on("submit", async (event) => {
    event.preventDefault();
    const username = $('input[name="git"]').val();
    $("input").trigger("blur");
    await fetchUser(username);
  });
  
  async function fetchUser(username) {
    const apiUrl = `${CONFIG.apiUrl}/users/${username}?client_id=${CONFIG.clientId}&client_secret=${CONFIG.clientSecret}`;
    
    clearContainers();
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("User not found");
      }
      
      const userData = await response.json();
      displayUser(userData);
      await fetchRepositories(userData.repos_url);
    } catch (error) {
      console.error(error);
      userProfileContainer.append("<p>User was not found</p>");
    }
  }
  
  function clearContainers() {
    userProfileContainer.empty();
    repositoriesContainer.empty();
  }
  
  async function fetchRepositories(url) {
    try {
      const response = await fetch(url);
      const repositoryData = await response.json();
      displayRepositories(repositoryData);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  }
  
  function createTableRow(label, value) {
    if (!value) return '';
    
    return `
      <tr>
        <th>${label}:</th>
        <td>${value}</td>
      </tr>
    `;
  }
  
  function displayUser(user) {
    const profileInfo = [
      createTableRow('Name', user.name),
      createTableRow('Public repos', user.public_repos),
      createTableRow('Followers', user.followers),
      createTableRow('Member since', user.created_at.slice(0, -10)),
      createTableRow('Location', user.location),
      createTableRow('Company', user.company),
      createTableRow('Hireable', user.hireable),
      createTableRow('Email', user.email)
    ].join('');
  
    const html = `
      <div class="user-box">
        <img width="120" class="user-picture" src="${user.avatar_url}" alt="User profile picture">
        <table class="user-table">
          ${profileInfo}
        </table>
        <button>
          <a href="${user.html_url}" target="_blank">View GitHub profile</a>
        </button>
      </div>`;
  
    userProfileContainer.append(html);
  }
  
  function displayRepositories(repositories) {
    const repoCountMessage = repositories.length === 30
      ? '<p id="repo-desc">Showing first 30 repositories.</p>'
      : `<p>This user has ${repositories.length} repositories.</p>`;
  
    const repositoriesList = repositories.map(repo => `
      <div class="repository">
        <h3>
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        </h3>
        <p>${repo.description || ''}</p>
      </div>
    `).join('');
  
    const html = `
      <div class="title">
        <h2>Repositories:</h2>
      </div>
      ${repoCountMessage}
      ${repositoriesList}
    `;
  
    repositoriesContainer.append(html);
  }