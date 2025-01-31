import Notifications from './notifications.js';

const Utils = {
    elements: {
        loadingElement: null
    },

    init() {
        this.elements.loadingElement = document.getElementById('loading');
        this.setupErrorHandling();
        this.checkLocalStorageSpace();
    },

    showLoading() {
        this.elements.loadingElement?.classList.remove('d-none');
    },

    hideLoading() {
        this.elements.loadingElement?.classList.add('d-none');
    },

    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatTime(time) {
        if (!time) return '';
        return time.replace(/(:\d{2}| [AP]M)$/, '');
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    setupErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            Notifications.showAlert('An error occurred. Please try again.', 'error');
        });

        window.addEventListener('error', (event) => {
            console.error('Runtime error:', event.error);
            Notifications.showAlert('An error occurred. Please try again.', 'error');
        });
    },

    getLocalStorageSize() {
        let total = 0;
        for (let x in localStorage) {
            if (localStorage.hasOwnProperty(x)) {
                total += localStorage[x].length * 2;
            }
        }
        return total;
    },

    checkLocalStorageSpace() {
        const maxSize = 5 * 1024 * 1024; // 5MB limit
        const currentSize = this.getLocalStorageSize();
        if (currentSize > maxSize * 0.9) {
            Notifications.showAlert('Local storage is almost full. Please clear some data.', 'warning');
        }
    },

    parseQueryString(queryString) {
        const params = new URLSearchParams(queryString);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },

    buildQueryString(params) {
        return Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    },

    groupBy(array, key) {
        return array.reduce((result, item) => {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
    },

    getDatesBetween(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate);

        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    },

    createElement(tag, className = '', textContent = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }
};

export default Utils;