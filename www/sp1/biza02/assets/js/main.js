// Fallback pro případ, že JavaScript není povolen
document.documentElement.classList.remove('no-js');

// Zvýraznění aktivní položky menu
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});

// Funkce: Scroll na vrchol stránky
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Carousel fallback: Pokud JavaScript není dostupný
const carouselContainer = document.querySelector('.carousel');
if (carouselContainer) {
    const images = carouselContainer.querySelectorAll('img');
    carouselContainer.style.display = 'flex';
    carouselContainer.style.flexWrap = 'wrap';
    carouselContainer.style.gap = '10px';
    images.forEach(img => {
        img.style.width = '150px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
    });
}

// Spinner pro načítání
const form = document.querySelector('form');
const spinner = document.querySelector('.spinner');
if (form && spinner) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        spinner.style.display = 'block';
        setTimeout(() => {
            spinner.style.display = 'none';
            alert('Formulář byl úspěšně odeslán!');
            form.reset();
        }, 2000);
    });
}

// Validace formuláře
const inputs = document.querySelectorAll('form input[required], form textarea[required]');
inputs.forEach(input => {
    input.addEventListener('invalid', () => {
        input.classList.add('invalid');
    });

    input.addEventListener('input', () => {
        if (input.validity.valid) {
            input.classList.remove('invalid');
        }
    });
});

// Tisková verze
const printButton = document.getElementById('print-page');
if (printButton) {
    printButton.addEventListener('click', () => {
        window.print();
    });
}

// Fallback pro starší prohlížeče
if (!('scrollTo' in window)) {
    backToTopBtn.style.display = 'none';
}
if (!('classList' in document.documentElement)) {
    navLinks.forEach(link => {
        link.style.fontWeight = link.href === window.location.href ? 'bold' : 'normal';
    });
}

// Poměr stran obrázků
const images = document.querySelectorAll('img');
images.forEach(img => {
    img.addEventListener('load', () => {
        if (img.naturalWidth / img.naturalHeight !== img.width / img.height) {
            img.style.objectFit = 'contain';
        }
    });
});
