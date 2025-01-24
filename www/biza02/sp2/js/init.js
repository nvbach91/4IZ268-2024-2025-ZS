// init.js

// Handle script loading errors 
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT') {
        console.error('Script loading error:', e.target.src);
    }
}, true);

// Initialize service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('ServiceWorker registration successful');
        } catch (error) {
            console.error('ServiceWorker registration failed:', error);
        }
    });
}

// Function to validate dates
window.validateDates = () => {
    const startDate = document.getElementById('itinerary-start-date');
    const endDate = document.getElementById('itinerary-end-date');
    
    if (startDate && endDate && startDate.value && endDate.value) {
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        
        if (start > end) {
            endDate.value = startDate.value;
        }
        
        // Set min date for end date to be start date
        endDate.min = startDate.value;
    }
}