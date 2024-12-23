document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});

const sendEmail = () => {
    event.preventDefault();

    const formData = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        isClient: document.getElementById('isClient').value,
        message: document.getElementById('message').value
    };

    emailjs.send(
        'service_g31m1rc',
        'template_gp02ugl',
        {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            is_client: formData.isClient,
            message: formData.message,
            to_email: 'matej.krejci4@gmail.com'
        }
    ).then((response) => {
        alert('Zpráva byla úspěšně odeslána!');
        document.getElementById('contactForm').reset();
    },
        (error) => {
            alert('Došlo k chybě při odesílání. Zkuste to prosím znovu.');
            console.error('Email failed to send:', error);
        }
    );

    return false;
}

