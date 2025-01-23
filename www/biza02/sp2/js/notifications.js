// notifications.js
import CONFIG from './config.js';

class NotificationManager {
    /**
     * Request browser notification permission
     * @returns {Promise<string>} Permission status
     */
    static async requestPermission() {
        if ('Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                return permission;
            } catch (error) {
                console.warn('Notification permission error:', error);
                return 'denied';
            }
        }
        return 'unsupported';
    }

    /**
     * Show a notification
     * @param {Object} options - Notification configuration
     */
    static show(options) {
        const {
            type = 'info',
            message,
            title = this.getTitleForType(type),
            duration = CONFIG.NOTIFICATIONS.DURATION.SHORT
        } = options;

        // Browser notification for supported browsers
        this.showBrowserNotification(title, message);

        // SweetAlert toast notification
        this.showSwalNotification(type, message, duration);
    }

    /**
     * Show browser notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    static showBrowserNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: this.getNotificationIcon(title)
            });
        }
    }

    /**
     * Show SweetAlert toast notification
     * @param {string} type - Notification type
     * @param {string} message - Notification message
     * @param {number} duration - Notification duration
     */
    static showSwalNotification(type, message, duration) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: duration,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
    }

    /**
     * Get notification title based on type
     * @param {string} type - Notification type
     * @returns {string} Notification title
     */
    static getTitleForType(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || 'Notification';
    }

    /**
     * Get notification icon
     * @param {string} title - Notification title
     * @returns {string} Icon path
     */
    static getNotificationIcon(title) {
        const icons = {
            Success: '/icons/success.png',
            Error: '/icons/error.png',
            Warning: '/icons/warning.png',
            Information: '/icons/info.png'
        };
        return icons[title] || '/icons/default.png';
    }

    /**
     * Schedule a reminder notification
     * @param {Object} activity - Activity details
     */
    static scheduleReminder(activity) {
        if (!CONFIG.FEATURES.NOTIFICATIONS) return;

        const { name, date, time, description } = activity;
        
        // Calculate notification time (e.g., 1 hour before activity)
        const notificationTime = new Date(`${date} ${time}`);
        notificationTime.setHours(notificationTime.getHours() - 1);

        // Schedule local notification
        if ('Notification' in window && Notification.permission === 'granted') {
            const timeout = notificationTime.getTime() - Date.now();
            
            if (timeout > 0) {
                setTimeout(() => {
                    this.show({
                        type: 'info',
                        title: `Upcoming Activity: ${name}`,
                        message: description
                    });
                }, timeout);
            }
        }
    }

    /**
     * Handle system-wide events
     * @param {string} eventType - Type of event
     * @param {Object} [data] - Additional event data
     */
    static handleSystemEvent(eventType, data = {}) {
        switch (eventType) {
            case 'offline':
                this.show({
                    type: 'warning',
                    message: 'You are currently offline. Some features may be limited.'
                });
                break;
            
            case 'online':
                this.show({
                    type: 'success',
                    message: 'Connection restored.'
                });
                break;
            
            case 'sync-complete':
                this.show({
                    type: 'info',
                    message: 'Data synchronized successfully.'
                });
                break;
            
            default:
                console.warn('Unhandled system event:', eventType, data);
        }
    }

    /**
     * Send custom notification
     * @param {Object} options - Notification options
     */
    static custom(options) {
        const defaultOptions = {
            type: 'info',
            message: '',
            duration: CONFIG.NOTIFICATIONS.DURATION.MEDIUM
        };

        const mergedOptions = { ...defaultOptions, ...options };
        this.show(mergedOptions);
    }
}

export default NotificationManager;