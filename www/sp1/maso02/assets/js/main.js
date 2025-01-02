/**
* Utility function to calculate the current theme setting.
* Look for a local storage value.
* Fall back to system setting.
* Fall back to light mode.
*/
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
    if (localStorageTheme !== null) {
        return localStorageTheme;
    };

    if (systemSettingDark.matches) {
        return "dark";
    };

    return "light";
};

/**
* Utility function to update the button text and aria-label.
*/
function updateButtonAndPage({ buttonEl, fzuIcon, matcaIcon, isDark }) {
    const newAria = isDark ? "Change to light theme" : "Change to dark theme";
    const newIcon = isDark ? '<i class="fa-solid fa-sun fa-2xl"></i>' : '<i class="fa-solid fa-moon fa-2xl"></i>';
    const newFooterIconFZU = isDark ? '/~maso02/sp1/assets/img/logo-fzu-w.png' : '/~maso02/sp1/assets/img/logo-fzu-b.png';
    const newFooterIconMATCA = isDark ? '/~maso02/sp1/assets/img/logo-matca-w.png' : '/~maso02/sp1/assets/img/logo-matca-b.png';

    buttonEl.setAttribute("aria-label", newAria);
    buttonEl.innerHTML = newIcon;
    fzuIcon.src = newFooterIconFZU;
    matcaIcon.src = newFooterIconMATCA;
};

/**
* Utility function to update the theme setting on the html tag
*/
function updateThemeOnHtmlEl({ theme }) {
    document.querySelector("html").setAttribute("data-theme", theme);
};


/**
* On page load:
*/

/**
* 1. Grab what we need from the DOM and system settings on page load
*/
const buttonDarkMode = document.querySelector("#dark-mode-toggle");
const imgLogoFzu = document.getElementById("logo-fzu");
const imgLogoMatca = document.getElementById("logo-matca");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
* 2. Work out the current site settings
*/
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

/**
* 3. Update the theme setting and buttonDarkMode text accoridng to current settings
*/
updateButtonAndPage({ buttonEl: buttonDarkMode, fzuIcon: imgLogoFzu, matcaIcon: imgLogoMatca, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

/**
* 4. Add an event listener to toggle the theme
*/
buttonDarkMode.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    console.log(imgLogoFzu)
    updateButtonAndPage({ buttonEl: buttonDarkMode, fzuIcon: imgLogoFzu, matcaIcon: imgLogoMatca, isDark: newTheme === "dark" });
    updateThemeOnHtmlEl({ theme: newTheme });

    currentThemeSetting = newTheme;
});
