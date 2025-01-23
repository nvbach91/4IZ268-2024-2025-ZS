// app.js
import CONFIG from './config.js';
import router from './router.js';
import auth from './auth.js';
import places from './places.js';
import directions from './directions.js';
import itineraryDetails from './itinerary-details.js';
import NotificationManager from './notifications.js';
import recommendationService from './recommendations.js';
import statisticsService from './statistics.js';

class TripPlannerApp {
    constructor() {
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Setup error handling
            this.setupErrorHandling();

            // Setup offline capabilities
            this.setupOfflineSupport();

            // Initialize core components
            await this.initializeComponents();

            // Check initial authentication state
            this.checkAuthenticationState();

            // Initialize notifications
            this.initializeNotifications();

            // Setup global event listeners
            this.setupGlobalEventListeners();

        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('🚨 Unhandled Error:', event.error);
            NotificationManager.show({
                type: 'error',
                message: 'An unexpected error occurred. Please try again.'
            });
        });

        // Handle promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Unhandled Promise Rejection:', event.reason);
            NotificationManager.show({
                type: 'error',
                message: 'An unhandled error occurred. Please check the console.'
            });
        });
    }

    setupOfflineSupport() {
        if ('serviceWorker' in navigator && CONFIG.FEATURES.OFFLINE_MODE) {
            window.addEventListener('load', async () => {
                try {
                    // Dynamically calculate the base path
                    const basePath = window.location.pathname.replace(/\/[^/]*$/, '');
                    const registration = await navigator.serviceWorker.register(`${basePath}/js/service-worker.js`, {
                        scope: `${basePath}/`
                    });
        
                    console.log('Service Worker registered successfully', registration);
                } catch (error) {
                    console.error('Service Worker registration failed', error);
                }
            });
        }
    }

    async initializeComponents() {
        try {
            // Core services that should always initialize
            await auth.initialize();
    
            // Initialize route-dependent services based on current path
            const currentPath = window.location.pathname;
            
            // Initialize only required services based on route
            const initPromises = [];
    
            // Auth should always initialize
            initPromises.push(auth.initialize());
    
            // Only initialize services if we're on their respective pages
            if (currentPath === '/search') {
                // Delay places initialization until after router renders the page
                setTimeout(() => places.initialize(), 100);
            }
    
            if (currentPath === '/recommendations') {
                setTimeout(() => recommendationService.initialize(), 100);
            }
    
            if (currentPath === '/itineraries') {
                initPromises.push(itineraryDetails.initialize());
            }
    
            // Statistics should only initialize on dashboard
            if (currentPath === '/dashboard') {
                initPromises.push(statisticsService.initialize());
            }
    
            await Promise.allSettled(initPromises);
            console.log('✅ Core components initialized successfully');
        } catch (error) {
            console.error('❌ Component initialization failed:', error);
        }
    }
    
    setupGlobalEventListeners() {
        // Global event delegation for route and action buttons
        document.addEventListener('click', (event) => {
            const loginButton = event.target.closest('#loginButton');
            const signUpButton = event.target.closest('#signUpButton');
            const logoutButton = event.target.closest('#logout-btn');

            if (loginButton) {
                console.log('🔐 Login button clicked');
                router.navigateTo('/login');
            }

            if (signUpButton) {
                console.log('🆕 Sign Up button clicked');
                router.navigateTo('/register');
            }

            if (logoutButton) {
                console.log('🚪 Logout button clicked');
                auth.logout();
                router.navigateTo('/');
            }
        });

        // Setup global custom events
        document.addEventListener('addToItinerary', (event) => {
            console.log('📅 Add to Itinerary Event:', event.detail);
            NotificationManager.show({
                type: 'success',
                message: 'Item added to itinerary'
            });
        });

        // Network status events
        window.addEventListener('online', () => {
            NotificationManager.show({
                type: 'success',
                message: 'Internet connection restored'
            });
        });

        window.addEventListener('offline', () => {
            NotificationManager.show({
                type: 'warning',
                message: 'You are currently offline'
            });
        });
    }

    checkAuthenticationState() {
        const user = auth.getCurrentUser();
        if (user) {
            // User is logged in, navigate to dashboard
            router.navigateTo(CONFIG.ROUTES.DASHBOARD);
        } else {
            // No user, navigate to home
            router.navigateTo(CONFIG.ROUTES.HOME);
        }
    }

    initializeNotifications() {
        if (CONFIG.FEATURES.NOTIFICATIONS) {
            NotificationManager.requestPermission();
        }
    }

    handleInitializationError(error) {
        console.error('🚨 App initialization failed:', error);
        NotificationManager.show({
            type: 'error',
            message: 'Failed to start the application. Please refresh or contact support.'
        });
    }
}

// Create and initialize the app
const app = new TripPlannerApp();

export default app;