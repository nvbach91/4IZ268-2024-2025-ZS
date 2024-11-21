# Git The Hub

Vytvořte aplikaci, která bude umět zobrazit informace o uživatelích na GitHubu. Použijte **jQuery** pro manupulaci s DOM a AJAX. 

### Jak to funguje
Aplikace nejprve vyzve uživatele k **zadání** uživatelského jména **GitHub uživatele**. Po každém submitnutí asynchronním způsobem (tj. bez reloadu stránky) pošle **GET požadavek** na **GitHub API** a v případě nalezení uživatele zobrazí jeho informace v HTML (podle obrázku dole). V případě nenalezení uživatele aplikace vypíše příslušnou hlášku do HTML stránky. 

Po zobrazení základních informací aplikace pošle další **GET požadavek** na GitHub API a načte **seznam repozitářů** vyhledaného uživatele a zobrazí je na stránce pod uživatelem.

### GitHub API
Dokumentace: https://developer.github.com/v3/
- Autentizace k API https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api
- Načtení uživatele https://docs.github.com/en/rest/users/users (Get a user)
- Načtení seznamu repozitářů určitého uživatele https://docs.github.com/en/rest/repos/repos (List repositories for a user)

### FYI
Abyste mohli libovolně používat **GitHub API**, je potřeba si zaregistrovat **OAuth účet** na GitHubu následovně
- Přihlašte se na GitHub a otevřete **Settings** [https://github.com/settings/](https://github.com/settings/)
- Vyberte **Developer settings**
- Vytvořte novou **OAuth aplikaci** dle obrázku
- Poznamenejte si **Client ID** a **Client Secret** a uložte je do proměnných ve vašem JavaScriptu
![image](https://user-images.githubusercontent.com/20724910/49305911-f3797b80-f4d0-11e8-97f8-ba00205b8f4b.png)

### Příklad volání na GitHub API
```js
// Příklad volání na GitHub API
const CLIENT_ID = '...';     // client_id získáte po registraci OAuth účtu
const CLIENT_SECRET = '...'; // client_secret získáte po registraci OAuth účtu
const BASE_API_URL = 'https://api.github.com';

const userProfileContainer = $('#user-profile')

const fetchUser = async (username) => {
    // sestavujeme URL, který obsahuje parametry CLIENT_ID a CLIENT_SECRET
    // každý parametr se určuje v podobě klíč=hodnota, parametry se oddělují ampersandem, 
    // na začátek přidáme otazník
    // např. ?client_id=abcdef&client_secret=fedcba
    const url = `${BASE_API_URL}/users/${username}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    // TODO
};
const fetchRepositories = async (userLogin) => {
    // TODO
};
const displayUser = (user) => {
    // TODO
};
const displayRepositories = (repositories) => {
    // TODO
};
(async () => {
    try {
        const userResp = await fetchUser('some_username');
        displayUser(userResp.data);
        const repositoriesResp = await fetchRepositories(userResp.data.login);
        displayRepositories(repositoriesResp.data);
  } catch (err) {
        console.error(err);
        userProfileContainer.empty().append('<p>User not found</p>');
  }
})();
```
Můžete použít výše uvedený výchozí kód

### Testování
Funkčnost aplikace otestujte s použitím několika z následujících GitHub uživatelských jmen:
- https://gist.github.com/paulmillr/2657075

### Demo
![image](https://user-images.githubusercontent.com/20724910/49305585-f031c000-f4cf-11e8-962c-77b231916b7e.png)

[Demo aplikace](https://fcp.vse.cz/4IZ268/2018-2019-ZS/www/nguv03/homework-08/solution/) jen pro vyzkoušení, ne copypaste.
