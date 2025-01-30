// notifications.js
const Notifications = {
    init() {
        this.checkNotificationPermission();
        this.setupServiceWorker();
    },

    async checkNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                await Notification.requestPermission();
            }
        }
    },

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
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

    async scheduleReminder(activity, time) {
        const timestamp = new Date(time).getTime();
        const now = Date.now();
        const delay = timestamp - now;

        if (delay <= 0) {
            console.warn('Cannot schedule reminder for past time');
            return;
        }

        if (delay > 2147483647) {
            console.warn('Reminder scheduled too far in the future');
            return;
        }

        setTimeout(() => {
            this.showNotification('Travel Reminder', `Time for: ${activity}`);
        }, delay);

        // Also save to localStorage for persistence
        const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        reminders.push({ activity, time });
        localStorage.setItem('reminders', JSON.stringify(reminders));
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
        Swal.close();
    },

    restoreReminders() {
        const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        reminders.forEach(reminder => {
            this.scheduleReminder(reminder.activity, reminder.time);
        });
    },

    clearAllReminders() {
        localStorage.removeItem('reminders');
    }
};
export default Notifications;