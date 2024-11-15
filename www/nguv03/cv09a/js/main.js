const appContainer = document.querySelector('#app');
const usersContainer = document.createElement('div');
const postsContainer = document.createElement('div');
appContainer.append(usersContainer, postsContainer);
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
const fetchCommentsByPostId = async (id) => {
    const commentsURL = `https://jsonplaceholder.typicode.com/comments?postId=${id}`;
    const resp = await fetch(commentsURL);
    const data = await resp.json();
    return data;
};
const displayPosts = (posts) => {
    const postElements = posts.map(({ title, body, id }) => {
        const postElement = document.createElement('article');
        const postHeading = document.createElement('h3');
        const postContent = document.createElement('p');
        postHeading.textContent = title;
        postContent.textContent = body;
        const commentsButton = document.createElement('button');
        commentsButton.textContent = 'Show comments';
        commentsButton.addEventListener('click', async () => {
            const comments = await fetchCommentsByPostId(id);
            console.log(comments);
            // displayComments(comments); // TODO
        });
        postElement.append(postHeading, postContent, commentsButton);
        return postElement;
    });
    postsContainer.innerHTML = '';
    postsContainer.append(...postElements);
};
const displayLoading = () => {
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    appContainer.append(spinner);
    return spinner;
};
const hideLoading = (spinner) => {
    spinner.remove();
};
const displayUsers = (users) => {
    const userElements = users.map((user) => {
        const { id, name } = user;
        const userElement = document.createElement('button');
        userElement.setAttribute('data-id', id);
        userElement.textContent = name;
        userElement.addEventListener('click', async () => {
            const spinner = displayLoading();
            try {
                console.log('start async request');
                const posts = await fetchPostsByUserId(id);
                hideLoading(spinner);
                console.log('end async request');
                displayPosts(posts);
            } catch (err) {
                // console.error(err);
                hideLoading(spinner);
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
const init = async () => {
    const users = await fetchUsers();
    displayUsers(users);
};


init();
