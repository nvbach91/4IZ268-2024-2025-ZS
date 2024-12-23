document.addEventListener('DOMContentLoaded', () => {
    // Spinner
    const spinner = document.getElementById('spinner');
    window.addEventListener('load', () => {
        spinner.style.display = 'none';
    });

    // Leaflet.js map
    const map = L.map('map').setView([50.0501380, 14.4589387], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.marker([50.0501380, 14.4589387]).addTo(map)
        .bindPopup('<strong>Letokruh, z.ú.</strong><br>Michelská 21/61<br>141 00 Praha 4')
        .openPopup();

    // Formulář
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = form.querySelector('button');
        button.textContent = 'Odesílání...';
        button.disabled = true;

        setTimeout(() => {
            alert('Děkujeme za váš zájem! Ozveme se vám co nejdříve.');
            button.textContent = 'Odeslat';
            button.disabled = false;
            form.reset();
        }, 2000);
    });
});
