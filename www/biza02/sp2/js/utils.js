// utils.js
import CONFIG from './config.js';

class Utils {
    /**
     * Show loading spinner
     */
    static showLoader() {
        const loader = document.getElementById('loading-spinner');
        if (loader) {
            loader.classList.remove('d-none');
        }
    }

    /**
     * Hide loading spinner
     */
    static hideLoader() {
        const loader = document.getElementById('loading-spinner');
        if (loader) {
            loader.classList.add('d-none');
        }
    }

    /**
     * Generate unique ID
     * @returns {string} Unique identifier
     */
    static generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Validate email
     * @param {string} email - Email to validate
     * @returns {boolean} Validation result
     */
    static validateEmail(email) {
        return CONFIG.VALIDATION.EMAIL.test(email);
    }

    /**
     * Validate password
     * @param {string} password - Password to validate
     * @returns {boolean} Validation result
     */
    static validatePassword(password) {
        return CONFIG.VALIDATION.PASSWORD.REGEX.test(password);
    }

    /**
     * Format date
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted date
     */
    static formatDate(date) {
        return new Date(date).toLocaleDateString(navigator.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Format distance
     * @param {number} meters - Distance in meters
     * @returns {string} Formatted distance
     */
    static formatDistance(meters) {
        return meters >= 1000 
            ? `${(meters / 1000).toFixed(1)} km`
            : `${Math.round(meters)} m`;
    }

    /**
     * Format duration
     * @param {number} minutes - Duration in minutes
     * @returns {string} Formatted duration
     */
    static formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours} h`;
        return `${hours} h ${mins} min`;
    }

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Sanitize HTML string
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML
     */
    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     */
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            Swal.fire({
                icon: 'success',
                title: 'Copied!',
                text: 'Text copied to clipboard',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } catch (err) {
            console.error('Failed to copy: ', err);
            Swal.fire({
                icon: 'error',
                title: 'Copy Failed',
                text: 'Unable to copy text to clipboard',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }
}

export default Utils;