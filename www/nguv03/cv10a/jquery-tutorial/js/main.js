const app = $('#app');


const api_key = '0rTiRN1UXHubG8k8HOCZMb6HxMtfAek9';

(async () => {
    const resp = await fetch('https://api.nytimes.com/svc/books/v3/lists.json', {
        headers: {
            'Authorization': `Bearer ${api_key}`
        }
    });
    const data = resp.json();
    console.log(data);
})();



























const students = [
    {name: 'Greg', id: 1},
    {name: 'Peter', id: 2},
    {name: 'Kyle', id: 3},
    {name: 'Danny', id: 4},
    {name: 'Mark', id: 5},
];;
app.append(students.map((student) => {
    const studentElement = $(`
        <div class="student">${student.name}</div>
    `);
    return studentElement;
}));



























const form = $(`
    <form>
        <input name="email">
    </form>
`);

app.append(form);
form.find('input[name="email"]').val('this@jquery.com');

// app.append(`
//     <div id="users"></div>
//     <div id="posts"></div>
// `)
const users = $('<div>');
const posts = $('<div>');
app.append(users, posts);


const fetchUsers = async () => {
    const usersURL = 'https://jsonplaceholder.typicode.com/users';
    const resp = await fetch(usersURL);
    const data = await resp.json();
    return data;
};
const fetchPostsByUserId = async (id) => {
    const postsURL = `https://jsonplaceholder.typicode.com/posts?userId=${id}`;
    const resp = await fetch(postsURL);
    const data = await resp.json();
    return data;
};

const displayLoading = () => {
    const spinner = $(`
        <div class="spinner"></div>
    `);
    app.append(spinner);
    return spinner;
};
const hideLoading = (spinner) => {
    spinner.remove();
};
const displayPosts = (postsData) => {
    const postElements = postsData.map(({ title, body, id }) => {
        const postElement = $(`
            <article>
                <h3>${title}</h3>
                <p>${body}</p>
                <button>Show comments</button>
            </article>
        `);
        postElement.find('button').click(() => {
            const comments = '...';
            console.log(comments);
        });
        return postElement;
    });
    posts.empty().append(postElements);
};
const displayUsers = (usersData) => {
    const userElements = usersData.map((user) => {
        const { id, name } = user;
        const userElement = $(`
            <button data-id="${id}">${name}</button>
        `).click(() => {
            const spinner = displayLoading();
            (async () => {
                try {
                    const posts = await fetchPostsByUserId(id);
                    // status code 200
                    hideLoading(spinner);
                    displayPosts(posts);
                } catch (err) {
                    console.log(err.status);
                    // status code 400 / 500
                    hideLoading(spinner);
                    Swal.fire({
                        title: 'Request failed',
                        icon: 'error',
                    });
                }
            })()
        });
        return userElement;
    });
    users.append(userElements);
    setTimeout(() => {
        $(userElements[0]).fadeOut();
    }, 1000);
};
const init = async () => {
    const users = await fetchUsers();
    displayUsers(users);
};
init();