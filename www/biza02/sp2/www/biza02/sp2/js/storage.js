// storage.js
import CONFIG from './config.js';

class StorageManager {
    /**
     * Save data to local storage with optional expiration
     * @param {string} key - Storage key
     * @param {*} data - Data to store
     * @param {number} [duration] - Optional duration for data expiration
     */
    static saveData(key, data, duration = CONFIG.STORAGE.CACHE_DURATION.MEDIUM) {
        try {
            const item = {
                data,
                timestamp: Date.now(),
                expiry: Date.now() + duration
            };
            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.error(`Storage save error for key ${key}:`, error);
            this.handleStorageError(error);
        }
    }

    /**
     * Retrieve data from local storage
     * @param {string} key - Storage key
     * @returns {*} Stored data or null
     */
    static getData(key) {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;

            const item = JSON.parse(itemStr);
            
            // Check for expiration
            if (Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }

            return item.data;
        } catch (error) {
            console.error(`Storage retrieve error for key ${key}:`, error);
            this.handleStorageError(error);
            return null;
        }
    }

    /**
     * Remove specific data from local storage
     * @param {string} key - Storage key to remove
     */
    static removeData(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Storage remove error for key ${key}:`, error);
            this.handleStorageError(error);
        }
    }

    /**
     * Clear all storage data
     */
    static clearAllData() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Storage clear error:', error);
            this.handleStorageError(error);
        }
    }

    /**
     * Save offline data
     * @param {Object} data - Data to save offline
     * @param {string} type - Type of offline data
     */
    static saveOfflineData(data, type) {
        try {
            const offlineData = this.getOfflineData();
            offlineData.push({ 
                type, 
                data, 
                timestamp: Date.now() 
            });

            localStorage.setItem(
                CONFIG.STORAGE.KEYS.OFFLINE_DATA, 
                JSON.stringify(offlineData)
            );
        } catch (error) {
            console.error('Offline data save error:', error);
            this.handleStorageError(error);
        }
    }

    /**
     * Retrieve offline data
     * @returns {Array} Offline data
     */
    static getOfflineData() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE.KEYS.OFFLINE_DATA);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Offline data retrieve error:', error);
            this.handleStorageError(error);
            return [];
        }
    }

    /**
     * Clear offline data
     */
    static clearOfflineData() {
        try {
            localStorage.removeItem(CONFIG.STORAGE.KEYS.OFFLINE_DATA);
        } catch (error) {
            console.error('Offline data clear error:', error);
            this.handleStorageError(error);
        }
    }

    /**
     * Check if storage is available
     * @returns {boolean} Storage availability
     */
    static isStorageAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Handle storage-related errors
     * @param {Error} error - Storage error
     */
    static handleStorageError(error) {
        // Notify user about storage issues
        if (!this.isStorageAvailable()) {
            Swal.fire({
                icon: 'warning',
                title: 'Storage Unavailable',
                text: 'Local storage is not available. Some features may be limited.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }

        // Log detailed error
        console.warn('Storage operation failed:', error);
    }

    /**
     * Export data to JSON file
     * @param {*} data - Data to export
     * @param {string} filename - Name of the export file
     */
    static exportToFile(data, filename = 'travel_planner_export.json') {
        try {
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Data export error:', error);
            this.handleStorageError(error);
        }
    }

    /**
     * Import data from JSON file
     * @param {File} file - JSON file to import
     * @returns {Promise<*>} Imported data
     */
    static async importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    resolve(jsonData);
                } catch (error) {
                    console.error('File import error:', error);
                    this.handleStorageError(error);
                    reject(error);
                }
            };
            reader.onerror = (error) => {
                console.error('File read error:', error);
                this.handleStorageError(error);
                reject(error);
            };
            reader.readAsText(file);
        });
    }
}

export default StorageManager;