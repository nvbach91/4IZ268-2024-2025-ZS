const OfflineManager = {
    cacheData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    retrieveCachedData(key) {
        return JSON.parse(localStorage.getItem(key)) || null;
    },

    initializeOfflineSupport() {
        window.addEventListener('online', () => Notifications.alertChange('You are back online.'));
        window.addEventListener('offline', () => Notifications.alertChange('You are now offline.'));
    }
};

OfflineManager.initializeOfflineSupport();
