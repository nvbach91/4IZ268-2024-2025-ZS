const App = {
    baseApiUrl: 'https://api.github.com',
    clientId: 'Ov23ctpFSK90V2VjkuLF',
    clientSecret: '26a089403e0b3ebfea6f2ee20073c2ff54072d1e',

    renderUser: (user) => {
        const createdDate = new Date(user.created_at).toLocaleDateString('cs-CZ');
        const html = `
          <section class="user-profile">
              <header>
                  <h2 class="user-name">${user.name || ''}</h2>
                  <figure class="user-avatar">
                      <img src="${user.avatar_url}" alt="${user.name || ''} avatar">
                  </figure>
              </header>
              <article class="user-details">
                  <dl>
                      <dt>Login</dt>
                      <dd>${user.login}</dd>
                      <dt>Bio</dt>
                      <dd>${user.company || ''}</dd>
                      <dt>Location</dt>
                      <dd>${user.location || ''}</dd>
                      <dt>Description</dt>
                      <dd>${user.bio || ''}</dd>
                      <dt>Email</dt>
                      <dd>${user.email || ''}</dd>
                      <dt>Followers</dt>
                      <dd>${user.followers || ''}</dd>
                      <dt>Registered</dt>
                      <dd>${createdDate}</dd>
                  </dl>
                  <a class="btn view-profile" href="${user.html_url || ''}" target="_blank">View profile</a>
              </article>
          </section>
      `;
        App.jUserProfile.innerHTML = html;
    },

    fetchRepositories: async (username) => {
        App.jRepositories.innerHTML = '';
        App.jRepositories.appendChild(App.loader);

        const url = `${App.baseApiUrl}/users/${username}/repos?client_id=${App.clientId}&client_secret=${App.clientSecret}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const repositories = await response.json();
            App.loader.remove();

            let html = `<p>This user has ${repositories.length} repositories</p><ul>`;
            repositories.forEach(repository => {
                html += `
                  <li class="repository">
                      <div class="repo-name">${repository.name}</div>
                      <div class="repo-url"><a href="${repository.html_url}">${repository.html_url}</a></div>
                  </li>
              `;
            });
            html += "</ul>";
            App.jRepositories.innerHTML = html;
        } catch (error) {
            console.error("Error fetching repositories:", error);
            App.jRepositories.innerHTML = '<p>Error fetching repositories.</p>';
            App.loader.remove();
        }
    },

    init: () => {
        App.jUserProfile = document.getElementById('user-profile');
        App.jSearchInput = document.getElementById('search-input');
        App.jSearchForm = document.getElementById('search-form');
        App.jRepositories = document.getElementById('repositories');
        App.loader = document.createElement('div');
        App.loader.className = 'loader';

        App.jSearchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchValue = App.jSearchInput.value;
            if (!searchValue) {
                return;
            }

            const url = `${App.baseApiUrl}/users/${searchValue}?client_id=${App.clientId}&client_secret=${App.clientSecret}`;

            App.jUserProfile.innerHTML = '';
            App.jUserProfile.appendChild(App.loader);

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("User not found");
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                const user = await response.json();
                App.renderUser(user);
                App.fetchRepositories(user.login);
            } catch (error) {
                console.error("Error fetching user:", error);
                App.jUserProfile.innerHTML = `<p>${error.message}</p>`;
                App.loader.remove();
            }
        });
    },
};
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});