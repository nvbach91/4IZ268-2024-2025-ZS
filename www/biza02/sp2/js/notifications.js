const Notifications = {
    elements: {
        loadingElement: null
    },

    init() {
        this.elements.loadingElement = document.getElementById('loading');
        this.checkNotificationPermission();
        this.setupServiceWorker();
    },

    async checkNotificationPermission() {
        if ('Notification' in window && 
            Notification.permission !== 'granted' && 
            Notification.permission !== 'denied') {
            await Notification.requestPermission();
        }
    },

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('ServiceWorker registration successful');
            } catch (error) {
                console.error('ServiceWorker registration failed:', error);
            }
        }
    },

    showAlert(message, type = 'info', duration = 3000) {
        Swal.fire({
            text: message,
            icon: type,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: duration,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
    },

    showNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/img/favicon.ico',
                badge: '/img/favicon.ico',
                requireInteraction: true
            });
        } else {
            this.showAlert(message, 'info');
        }
    },

    showConfirmation(title, text) {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true
        });
    },

    async showPrompt(title, input = 'text', placeholder = '') {
        const result = await Swal.fire({
            title,
            input,
            inputPlaceholder: placeholder,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a value!';
                }
            }
        });

        return result.value;
    },

    showLoading(message = 'Loading...') {
        if (this.elements.loadingElement) {
            this.elements.loadingElement.classList.remove('d-none');
        }
        
        Swal.fire({
            title: message,
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
    },

    hideLoading() {
        if (this.elements.loadingElement) {
            this.elements.loadingElement.classList.add('d-none');
        }
        Swal.close();
    }
};

export default Notifications;