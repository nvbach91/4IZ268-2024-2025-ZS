// recommendations.js
import CONFIG from './config.js';
import StorageManager from './storage.js';
import NotificationManager from './notifications.js';

class RecommendationService {
    constructor() {
        this.travelApps = this.getTravelApps().slice(0, CONFIG.RECOMMENDATIONS.MAX_APPS);
        this.initialized = false;
    }

    async initialize() {
        try {
            // Only initialize if we're on the recommendations page
            const container = document.getElementById('recommendations-container');
            if (!container) {
                console.log('Recommendations container not present, skipping initialization');
                return;
            }

            if (this.initialized) {
                console.log('Recommendations service already initialized');
                return;
            }

            await this.renderRecommendations();
            this.initialized = true;
            console.log('Recommendations service initialized successfully');
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    /**
     * Get full list of travel apps
     * @returns {Array} List of travel apps
     */
    getTravelApps() {
        return [
            {
                name: 'Booking.com',
                description: 'Comprehensive hotel and accommodation booking platform',
                category: 'Accommodation',
                url: 'https://www.booking.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Hotels', 'Hostels', 'Apartments']
            },
            {
                name: 'Airbnb',
                description: 'Unique accommodations and experiences worldwide',
                category: 'Accommodation',
                url: 'https://www.airbnb.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Homes', 'Experiences', 'Unique Stays']
            },
            {
                name: 'Skyscanner',
                description: 'Compare flights, hotels, and car rentals',
                category: 'Travel Booking',
                url: 'https://www.skyscanner.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Flights', 'Cheap Tickets', 'Price Comparison']
            },
            {
                name: 'Google Maps',
                description: 'Navigation, local information, and travel directions',
                category: 'Navigation',
                url: 'https://maps.google.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Maps', 'Navigation', 'Local Search']
            },
            {
                name: 'TripAdvisor',
                description: 'Travel reviews, ratings, and booking platform',
                category: 'Travel Planning',
                url: 'https://www.tripadvisor.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Reviews', 'Attractions', 'Restaurants']
            },
            {
                name: 'Hostelworld',
                description: 'Budget accommodation and hostel bookings',
                category: 'Accommodation',
                url: 'https://www.hostelworld.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Hostels', 'Budget Travel', 'Backpacking']
            },
            {
                name: 'Rome2Rio',
                description: 'Global transportation search engine',
                category: 'Transportation',
                url: 'https://www.rome2rio.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Travel Routes', 'Transportation', 'Global Travel']
            },
            {
                name: 'Google Translate',
                description: 'Real-time translation and language support',
                category: 'Communication',
                url: 'https://translate.google.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Translation', 'Language', 'Communication']
            },
            {
                name: 'XE Currency',
                description: 'Real-time currency conversion and exchange rates',
                category: 'Finance',
                url: 'https://www.xe.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Currency', 'Exchange Rates', 'Money']
            },
            {
                name: 'PackPoint',
                description: 'Smart packing list generator based on destination and trip details',
                category: 'Travel Planning',
                url: 'https://www.packpnt.com',
                platforms: ['iOS', 'Android'],
                tags: ['Packing', 'Travel Essentials', 'Checklist']
            },
            {
                name: 'WhatsApp',
                description: 'Global communication and messaging',
                category: 'Communication',
                url: 'https://www.whatsapp.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Messaging', 'International Calls', 'Communication']
            },
            {
                name: 'Viator',
                description: 'Book tours, attractions, and experiences',
                category: 'Activities',
                url: 'https://www.viator.com',
                platforms: ['Web', 'iOS', 'Android'],
                tags: ['Tours', 'Experiences', 'Attractions']
            }
        ];
    }

    /**
     * Initialize recommendation service
     */
    async initialize() {
        try {
            this.renderRecommendations();
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    /**
     * Render recommendations to the DOM
     */
    renderRecommendations() {
        const recommendationsContainer = document.getElementById('recommendations-container');
        if (!recommendationsContainer) {
            console.error('Recommendations container not found');
            return;
        }

        // Create category filter using categories from config
        const categories = CONFIG.RECOMMENDATIONS.APP_CATEGORIES;
        const filterHtml = `
            <div class="mb-4">
                <label for="app-category-filter" class="form-label">Filter by Category:</label>
                <select id="app-category-filter" class="form-select">
                    <option value="all">All Categories</option>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
        `;

        // Render apps
        const appsHtml = this.travelApps
            .map(app => `
                <div class="col-md-4 mb-4 app-card" data-category="${app.category}">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${this.sanitizeText(app.name)}</h5>
                            <p class="card-text">${this.sanitizeText(app.description)}</p>
                            <div class="mb-2">
                                <span class="badge bg-primary me-1">${this.sanitizeText(app.category)}</span>
                                ${app.tags.map(tag => `<span class="badge bg-secondary me-1">${this.sanitizeText(tag)}</span>`).join('')}
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <a href="${app.url}" target="_blank" class="btn btn-sm btn-outline-primary">
                                        Visit Website
                                    </a>
                                </div>
                                <small class="text-muted">
                                    ${app.platforms.join(' | ')}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            .join('');

        recommendationsContainer.innerHTML = `
            <div class="container">
                <h2 class="mb-4 text-center">Essential Travel Apps & Resources</h2>
                ${filterHtml}
                <div class="row" id="apps-grid">
                    ${appsHtml}
                </div>
            </div>
        `;

        // Add category filter functionality
        this.setupCategoryFilter();
    }

    /**
     * Setup category filtering for apps
     */
    setupCategoryFilter() {
        const categoryFilter = document.getElementById('app-category-filter');
        const appsGrid = document.getElementById('apps-grid');
        
        categoryFilter.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            const appCards = document.querySelectorAll('.app-card');
            
            appCards.forEach(card => {
                const cardCategory = card.dataset.category;
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    /**
     * Sanitize text to prevent XSS
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    sanitizeText(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Error object
     */
    /**
     * Filter travel apps by category
     * @param {string} category - Category to filter
     * @returns {Array} Filtered apps
     */
    filterAppsByCategory(category) {
        if (category === 'all') {
            return this.travelApps;
        }
        return this.travelApps.filter(app => app.category === category);
    }

    handleInitializationError(error) {
        console.error('Recommendation service initialization error:', error);
        NotificationManager.show({
            type: 'error',
            message: 'Failed to initialize recommendations service',
        });
    }
}

// Create singleton instance
const recommendationService = new RecommendationService();

// Make globally accessible
window.recommendationService = recommendationService;

export default recommendationService;