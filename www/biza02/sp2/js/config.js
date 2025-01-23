// config.js
const CONFIG = {
    // Application Core Configuration
    APP: {
        NAME: 'Travel Planner',
        VERSION: '1.0.0',
        ENVIRONMENT: 'production'
    },

    // API Configurations
    API: {
        OPENTRIPMAP: {
            API_KEY: '5ae2e3f221c38a28845f05b6bb142d31dc50a82823a0d9578bdd5f4f', // Your OpenTripMap API key
            BASE_URL: 'https://api.opentripmap.com/0.1/en/places',
            ENDPOINTS: {
                GEONAME: '/geoname',
                RADIUS: '/radius',
                DETAILS: '/xid'
            }
        },
        GOOGLE_MAPS: {
            API_KEY: 'AIzaSyCS8gebxgM-srFi2R1eXNCrsuSjxY_pu74', // Your Google Maps API key
            ENDPOINTS: {
                DIRECTIONS: 'https://maps.googleapis.com/maps/api/directions/json',
                GEOCODING: 'https://maps.googleapis.com/maps/api/geocode/json'
            }
        }
    },

    // Routing Configuration
    ROUTES: {
        HOME: '/',
        LOGIN: '/login',
        REGISTER: '/register',
        DASHBOARD: '/dashboard',
        ITINERARIES: '/itineraries',
        ITINERARY_CREATE: '/itinerary/create',
        ITINERARY_DETAILS: '/itinerary/:id',
        SEARCH: '/search',
        RECOMMENDATIONS: '/recommendations',
        PROFILE: '/profile',
        NOT_FOUND: '/404'
    },

    // Validation Rules
    VALIDATION: {
        EMAIL: {
            REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            MIN_LENGTH: 5,
            MAX_LENGTH: 100
        },
        PASSWORD: {
            MIN_LENGTH: 8,
            MAX_LENGTH: 100,
            REQUIRE_UPPERCASE: true,
            REQUIRE_LOWERCASE: true,
            REQUIRE_NUMBER: true,
            REQUIRE_SPECIAL_CHAR: true,
            SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        },
        ITINERARY: {
            NAME: {
                MIN_LENGTH: 3,
                MAX_LENGTH: 100
            },
            DESTINATION: {
                MIN_LENGTH: 2,
                MAX_LENGTH: 100
            },
            DATE: {
                MIN_DAYS_AHEAD: 1,
                MAX_DAYS_AHEAD: 365
            }
        }
    },

    // Local Storage Configuration
    STORAGE: {
        KEYS: {
            USERS: 'travel_planner_users',           // All users array
            USER: 'travel_planner_current_user',     // Current user session
            ITINERARIES: 'travel_planner_itineraries',
            RECOMMENDATIONS: 'travel_planner_recommendations',
            OFFLINE_DATA: 'travel_planner_offline_cache',
            SETTINGS: 'travel_planner_settings',
            LAST_SEARCH: 'travel_planner_last_search'
        },
        CACHE_DURATION: {
            SHORT: 1000 * 60 * 60,     // 1 hour
            MEDIUM: 1000 * 60 * 60 * 24, // 24 hours
            LONG: 1000 * 60 * 60 * 24 * 7 // 7 days
        }
    },

    // Notification Configuration
    NOTIFICATIONS: {
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        },
        DURATION: {
            SHORT: 3000,  // 3 seconds
            MEDIUM: 5000, // 5 seconds
            LONG: 7000    // 7 seconds
        },
        POSITION: 'top-end'
    },

    // Map Configuration
    MAP: {
        DEFAULT_CENTER: {
            LAT: 40.7128,
            LNG: -74.0060
        },
        DEFAULT_ZOOM: 13,
        MAX_ZOOM: 19,
        MIN_ZOOM: 3,
        MARKER_COLORS: {
            DEFAULT: '#4285f4',
            HIGHLIGHT: '#34a853',
            SELECTED: '#fbbc05',
            WARNING: '#ea4335'
        }
    },

    // Recommendations Configuration
    RECOMMENDATIONS: {
        APP_CATEGORIES: [
            'Accommodation',
            'Travel Booking',
            'Navigation',
            'Communication',
            'Travel Planning',
            'Finance',
            'Activities'
        ],
        MAX_APPS: 12
    },

    // Feature Flags
    FEATURES: {
        OFFLINE_MODE: true,
        RECOMMENDATIONS: true,
        SHARING: true,
        STATISTICS: true,
        NOTIFICATIONS: true,
        DARK_MODE: true,
        WEATHER: true
    },

    // Export Configuration
    EXPORT: {
        PDF: {
            FORMAT: 'a4',
            ORIENTATION: 'portrait',
            MARGIN: {
                TOP: 20,
                RIGHT: 20,
                BOTTOM: 20,
                LEFT: 20
            }
        },
        ALLOWED_FORMATS: ['pdf', 'json', 'csv']
    },

    // Geolocation Configuration
    GEOLOCATION: {
        TIMEOUT: 5000,
        MAXIMUM_AGE: 0,
        HIGH_ACCURACY: true,
        WATCH_POSITION: false
    },

    // Session Configuration
    SESSION: {
        DURATION: 24 * 60 * 60 * 1000, // 24 hours
        REFRESH_THRESHOLD: 30 * 60 * 1000, // 30 minutes
        INACTIVE_TIMEOUT: 60 * 60 * 1000 // 1 hour
    },

    // Error Messages
    ERRORS: {
        AUTH: {
            INVALID_EMAIL: 'Invalid email address',
            INVALID_PASSWORD: 'Invalid password',
            USER_NOT_FOUND: 'User not found',
            USER_EXISTS: 'User already exists',
            PASSWORDS_NOT_MATCH: 'Passwords do not match',
            SESSION_EXPIRED: 'Session has expired'
        },
        API: {
            NETWORK_ERROR: 'Network error occurred',
            TIMEOUT: 'Request timed out',
            SERVER_ERROR: 'Server error occurred'
        }
    },

    // Default Settings
    DEFAULTS: {
        LANGUAGE: 'en',
        THEME: 'light',
        CURRENCY: 'USD',
        DISTANCE_UNIT: 'km',
        DATE_FORMAT: 'YYYY-MM-DD'
    },

    // Security Configuration
    SECURITY: {
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
        PASSWORD_HISTORY: 5,
        MIN_PASSWORD_AGE: 24 * 60 * 60 * 1000 // 24 hours
    }
};

// Freeze the configuration to prevent modifications
Object.freeze(CONFIG);

export default CONFIG;