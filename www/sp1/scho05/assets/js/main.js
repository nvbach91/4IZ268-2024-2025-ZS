const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-menu');
const contactHidden = document.getElementById('contact-hidden');

hamburgerMenu.addEventListener('click', () => {
  hamburgerMenu.classList.toggle('active');
  navLinks.classList.toggle('active');
  contactHidden.classList.toggle('active');
});
