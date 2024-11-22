const appContainer = $('#app');

const api_token = 'FbrWIy7mRwQEBZ7xjHunqFQtPpfbAMMn';

fetch('https://api.nytimes.com/svc/books/v3/lists.json', {
    headers: {
        Authorization: 'Bearer ' + api_token,
    }
});





const students = [
    {name: 'Greg', id: 1},
    {name: 'Peter', id: 2},
    {name: 'Kyle', id: 3},
    {name: 'Danny', id: 4},
    {name: 'Mark', id: 5},
];
const studentElements = [];
for (const student of students) {
    const studentElement = $(`<div>${student.name}</div>`);
    studentElements.push(studentElement);
}
appContainer.append(studentElements);























const loginForm = $(`
    <form>
        <input name="username">
        <input name="password">
        <button>Submit</button>
    </form>
`);
appContainer.append(loginForm, '<br>'.repeat(100));

loginForm.find('input[name="username"]').val('George');
loginForm.find('input[name="password"]').val('Washington');

const formInputs = loginForm.find('input');
// aplikuje se do vsech vybranych prvku bez iterovani
formInputs.attr('data-id', 42);
console.log(formInputs.length);
// loginForm.slideUp(2000);





















const usersContainer = $('<div>');
const postsContainer = $('<div>');
appContainer.append(usersContainer, postsContainer);

const fetchUsers = async () => {
    const url = 'https://jsonplaceholder.typicode.com/users';
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
};
const fetchPostsByUserId = async (id) => {
    const url = `https://jsonplaceholder.typicode.com/postss?userId=${id}xx`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
};
const createSpinner = () => {
    return $('<div class="spinner">');
};
const displayPosts = (posts) => {
    const postElements = posts.map(({ title, body, id }) => {
        const postElement = $(`
            <article>
                <h3>${title}</h3>
                <p>${body}</p>
            </article>
        `);
        return postElement;
    });
    postsContainer.empty().append(postElements);
};
const displayUsers = (users) => {
    const userElements = users.map((user) => {
        const userButton = $(`<button>${user.name}</button>`);
        userButton.click(async () => {
            const spinner = createSpinner();
            try {
                appContainer.append(spinner);
                const posts = await fetchPostsByUserId(user.id);
                // 200 status
                spinner.remove();
                displayPosts(posts);
            } catch (err) {
                console.log(err);
                // 400 status, 500 status
                spinner.remove();
                console.error(err);
                Swal.fire({
                    title: 'Request failed',
                    icon: 'error',
                });
            }
        });
        return userButton;
    });
    usersContainer.append(userElements);
};
const init = async () => {
    const users = await fetchUsers();
    displayUsers(users);
};

init();