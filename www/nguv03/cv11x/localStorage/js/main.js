const appContainer = $('#app');
const form = $(`
    <form>
        <input name="value" required>
        <button type="submit">Submit</button>
    </form>
`);
const list = $('<ul>');
const input = form.find('input');
appContainer.append(form, list);

let existingValues = [];

if (localStorage.getItem('values') !== null) {
    existingValues = JSON.parse(localStorage.getItem('values'));
}

const createItem = (value) => {
    const item = $(`
        <li>
            <span>${value}</span>
            <button>Remove</button>
        </li>
    `);
    const deleteButton = item.find('button');
    deleteButton.on('click', () => {
        item.remove();
        existingValues = existingValues.filter((v) => {
            return v !== value;
        });
        localStorage.setItem('values', JSON.stringify(existingValues));
    });
    item.append(deleteButton);
    return item;
};

const existingItems = existingValues.map((v) => {
    return createItem(v);
});

list.append(existingItems);

form.on('submit', (e) => {
    e.preventDefault();
    const value = input.val();
    input.val('');
    const item = createItem(value);
    list.append(item);
    existingValues.push(value);
    localStorage.setItem('values', JSON.stringify(existingValues));
});
