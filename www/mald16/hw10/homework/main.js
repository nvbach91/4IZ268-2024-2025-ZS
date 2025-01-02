const app = $("#app");
const output = $("<div>").attr("id", "output");
const repos = $("<div>").attr("id", "repos");
app.append(output, repos);

const clientId = "Ov23lij3XD1GX3R7oigj";
const clientSecret = "02bc9928281422d69431776956e030dc2cf200cd";

const fetchUser = async (username) => {
	const userURL = `https://api.github.com/users/${username}?client_id=${clientId}&client_secret=${clientSecret}`;
	const response = await fetch(userURL);
	if (!response.ok) throw new Error("User not found");
	const userData = await response.json();
	return userData;
};

const fetchRepos = async (username) => {
	const reposURL = `https://api.github.com/users/${username}/repos?client_id=${clientId}&client_secret=${clientSecret}`;
	const response = await fetch(reposURL);
	if (!response.ok) throw new Error("Repositories not found");
	const repoData = await response.json();
	return repoData;
};

const displayLoading = () => {
	const spinner = $(`
        <div class="spinner">Loading...</div>
    `);
	app.append(spinner);
	return spinner;
};

const hideLoading = (spinner) => {
	spinner.remove();
};

const displayUser = (user) => {
	const registrationDate = new Date(user.created_at).toLocaleDateString(
		"cs-CZ"
	);
	const userElement = $(`
        <div class="user-info">
            <img src="${user.avatar_url}" alt="${
		user.login
	}" class="profile-pic">
            <p><strong>Login:</strong> ${user.login}</p>
            <p><strong>Bio:</strong> ${user.bio || "No bio available"}</p>
            <p><strong>Location:</strong> ${
							user.location || "Not specified"
						}</p>
            <p><strong>Description:</strong> ${
							user.company || "Not specified"
						}</p>
            <p><strong>Email:</strong> ${user.email || "Not available"}</p>
            <p><strong>Followers:</strong> ${user.followers}</p>
            <p><strong>Registered:</strong> ${registrationDate}</p>
            <p><a href="${user.html_url}">GitHub Profile</a></p>
        </div>
    `);
	output.empty().append(userElement);
};

const displayRepos = (repoData) => {
	const repoElements = repoData.map((repo) => {
		return $(`
            <li>
                <a href="${repo.html_url}">${repo.name}</a> - ⭐ ${repo.stargazers_count}
            </li>
        `);
	});
	repos.empty().append($("<ul>").append(repoElements));
};

const handleSearch = async (username) => {
	const spinner = displayLoading();
	try {
		const user = await fetchUser(username);
		displayUser(user);

		const userRepos = await fetchRepos(username);
		displayRepos(userRepos);
	} catch (error) {
		output.empty().append(`<p>${error.message}</p>`);
		repos.empty();
	} finally {
		hideLoading(spinner);
	}
};

const init = () => {
	const form = $(`
        <form id="search-form">
            <input type="text" id="username" placeholder="Enter GitHub username" required>
            <button type="submit">Search</button>
        </form>
    `);

	app.find("h1").after(form);

	form.on("submit", (event) => {
		event.preventDefault();
		const username = $("#username").val().trim();
		if (username) {
			handleSearch(username);
		} else {
			output.empty().append("<p>Please enter a username.</p>");
		}
	});
};

init();
