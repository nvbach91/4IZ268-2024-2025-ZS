
document.getElementById("button-menu").addEventListener("click", function () {
    const navigationMenu = document.getElementById("navigationMenu");
    navigationMenu.classList.toggle("active");
});

const menuIcon = document.getElementById('menu-icon');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('active');
});