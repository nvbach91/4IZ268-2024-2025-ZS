const appContainer = document.querySelector('#app');
const usersContainer = document.createElement('div');
const postsContainer = document.createElement('div');
appContainer.append(usersContainer, postsContainer);

const createSpinner = () => {
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    return spinner;
};
const fetchUsers = async () => {
    const url = 'https://jsonplaceholder.typicode.com/users';
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
};
const displayUsers = (users) => {
    const userElements = users.map((user) => {
        const { id, name, email } = user;
        const userElement = document.createElement('button');
        userElement.textContent = name;
        userElement.setAttribute('data-id', id);
        userElement.setAttribute('data-email', email);
        userElement.addEventListener('click', async () => {
            const spinner = createSpinner();
            appContainer.append(spinner);
            try {
                const posts = await fetchPostsByUserId(id);
                spinner.remove();
                displayPosts(posts);
            } catch (err) {
                spinner.remove();
                // alert('Request failed');
                Swal.fire({
                    title: 'Request failed',
                    icon: 'error',
                });
            }
        });
        return userElement;
    });
    usersContainer.append(...userElements);
};
const fetchPostsByUserId = async (id) => {
    const url = `https://jsonplaceholder.typicode.com/posts?userId=${id}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
};
const fetchCommentsByPostId = async (id) => {
    const url = `https://jsonplaceholder.typicode.com/comments?postId=${id}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
};
const displayPosts = (posts) => {
    const postElements = posts.map((post) => {
        const { title, body, id } = post;
        const postElement = document.createElement('article');
        const titleElement = document.createElement('h3');
        const bodyElement = document.createElement('p');
        titleElement.textContent = title;
        bodyElement.textContent = body;
        const commentsButton = document.createElement('button');
        commentsButton.textContent = 'Show comments';
        commentsButton.addEventListener('click', async () => {
            const comments = await fetchCommentsByPostId(id);
            console.log(comments);
            // displayComments(comments);
        });
        postElement.append(titleElement, bodyElement, commentsButton);
        return postElement;
    });
    postsContainer.innerHTML = '';
    postsContainer.append(...postElements);
};
const init = async () => {
    const users = await fetchUsers();
    displayUsers(users);
};
init();
