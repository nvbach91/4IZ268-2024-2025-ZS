// router.js
import CONFIG from './config.js';
import auth from './auth.js';
import places from './places.js';
import itineraryDetails from './itinerary-details.js';
import recommendationService from './recommendations.js';
import statisticsService from './statistics.js';
import NotificationManager from './notifications.js';

class Router {
    constructor() {
        this.routes = {
            '/': this.renderHomePage,
            '/dashboard': this.renderDashboardPage,
            '/itineraries': this.renderItinerariesPage,
            '/search': this.renderSearchPage,
            '/recommendations': this.renderRecommendationsPage,
            '/login': this.renderLoginPage,
            '/register': this.renderRegisterPage,
            '/404': this.render404Page
        };
        this.currentRoute = null;
        this.baseUrl = this.getBaseUrl(); // Store the base URL
        this.initializeRouting();
    }

    // Get the base URL from the current path
    getBaseUrl() {
        const scriptPath = document.querySelector('script[src*="/js/router.js"]').getAttribute('src');
        return scriptPath.substring(0, scriptPath.indexOf('/js/router.js'));
    }

    initializeRouting() {
        console.log('🚦 Initializing Routing System');

        // Handle initial page load
        window.addEventListener('DOMContentLoaded', () => {
            this.handleInitialRoute();
        });

        // Handle browser back/forward navigation
        window.addEventListener('popstate', (event) => {
            this.handleNavigation(this.getRelativePath(window.location.pathname));
        });

        // Global event delegation for route navigation
        document.addEventListener('click', (event) => {
            const routeElement = event.target.closest('[data-route]');
            if (routeElement) {
                event.preventDefault();
                const route = routeElement.getAttribute('data-route');
                console.log('🔗 Navigate to:', route);
                this.navigateTo(route);
            }
        });
    }

    // Convert absolute path to relative path while preserving the base context
    getRelativePath(absolutePath) {
        return absolutePath.replace(this.baseUrl, '') || '/';
    }

    handleNavigation(path) {
        console.log('🚏 Handling navigation to:', path);
        
        // Handle protected routes
        if (this.isProtectedRoute(path) && !auth.isAuthenticated()) {
            console.warn('🔒 Unauthorized access. Redirecting to login.');
            path = '/login';
        }
    
        // Render the route
        this.renderRoute(path);
    }
    
    handleInitialRoute() {
        const path = this.getRelativePath(window.location.pathname);
        console.log('🏁 Initial Route:', path);
        this.navigateTo(path, {}, true);
    }

    navigateTo(route, params = {}, isInitial = false) {
        console.group('🚀 Navigation');
        console.log('Attempting to navigate to:', route);

        // Handle protected routes
        if (this.isProtectedRoute(route) && !auth.isAuthenticated()) {
            console.warn('🔒 Unauthorized access. Redirecting to login.');
            route = '/login';
        }

        // Construct the full URL preserving the base context
        const fullUrl = this.baseUrl + (route.startsWith('/') ? route : '/' + route);

        // Update browser history
        if (!isInitial) {
            window.history.pushState({}, '', fullUrl);
        }

        // Render the route
        this.renderRoute(route, params);
        console.groupEnd();
    }

    renderRoute(route, params = {}) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('❌ Main content element not found');
            return;
        }
    
        // Clear previous content
        mainContent.innerHTML = '';
    
        // Find and call the appropriate route handler
        const routeHandler = this.routes[route] || this.routes['/404'];
        
        if (routeHandler) {
            console.log('🎯 Rendering route:', route);
            routeHandler.call(this, mainContent, params);
    
            // Initialize services after rendering the route
            this.initializeRouteServices(route);
        } else {
            console.error('❌ No route handler found for:', route);
            this.routes['/404'].call(this, mainContent);
        }
    
        // Update UI based on authentication state
        this.updateAuthUI();
    }
    
    initializeRouteServices(route) {
        // Initialize specific services based on the route
        switch (route) {
            case '/search':
                setTimeout(() => places.initialize(), 100);
                break;
            case '/recommendations':
                setTimeout(() => recommendationService.initialize(), 100);
                break;
            case '/itineraries':
                setTimeout(() => itineraryDetails.initialize(), 100);
                break;
            case '/dashboard':
                setTimeout(() => statisticsService.initialize(), 100);
                break;
        }
    }

    renderHomePage(container) {
        container.innerHTML = `
            <div class="container py-4">
                <h1 class="display-4 mb-4">Welcome to Travel Planner</h1>
                <p class="lead">Plan your travels, discover destinations, and create memorable experiences.</p>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <button class="btn btn-primary btn-lg w-100" data-route="/search">
                            <i class="bi bi-search me-2"></i>Explore Destinations
                        </button>
                    </div>
                    <div class="col-md-6 mb-3">
                        <button class="btn btn-outline-primary btn-lg w-100" data-route="/recommendations">
                            <i class="bi bi-magic me-2"></i>Get Recommendations
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderDashboardPage(container) {
        const user = auth.getCurrentUser();
        container.innerHTML = `
            <div class="container py-4">
                <h2 class="mb-4">Dashboard</h2>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Welcome, ${user?.email || 'Traveler'}</h5>
                                <p>Manage your travel experiences</p>
                                <button class="btn btn-primary" data-route="/itineraries">
                                    View Itineraries
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div id="statistics-container"></div>
                    </div>
                </div>
            </div>
        `;
        statisticsService.initialize();
    }

    renderItinerariesPage(container) {
        container.innerHTML = `
            <div class="container py-4">
                <h2 class="mb-4">My Itineraries</h2>
                <div id="itineraries-list"></div>
                <button class="btn btn-primary mt-3" id="create-itinerary-btn">
                    Create New Itinerary
                </button>
            </div>
        `;
        itineraryDetails.initialize();
    }

    renderSearchPage(container) {
        container.innerHTML = `
            <div class="container py-4">
                <div class="row">
                    <!-- Left Column -->
                    <div class="col-md-4">
                        <!-- Search Form -->
                        <div class="card mb-3">
                            <div class="card-body">
                                <form id="places-form">
                                    <div class="mb-3">
                                        <label class="form-label">Search Places</label>
                                        <div class="input-group">
                                            <input type="text" 
                                                id="search-input" 
                                                class="form-control" 
                                                placeholder="Enter city, address, or place..."
                                                required>
                                            <button type="submit" class="btn btn-primary">
                                                <i class="bi bi-search"></i> Search
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Filter by Type</label>
                                    <select id="place-type" class="form-select">
                                        <option value="all">All Places</option>
                                        <option value="cultural">Cultural</option>
                                        <option value="historical">Historical</option>
                                        <option value="natural">Natural</option>
                                    </select>
                                </div>
                            </div>
                        </div>
    
                        <!-- Route Form -->
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Plan Route</h5>
                                <form id="route-form">
                                    <div class="mb-3">
                                        <label class="form-label">Start Point</label>
                                        <input type="text" id="route-start" class="form-control">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">End Point</label>
                                        <input type="text" id="route-end" class="form-control">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Transport Mode</label>
                                        <select id="transport-mode" class="form-select">
                                            <option value="driving">Driving</option>
                                            <option value="walking">Walking</option>
                                            <option value="bicycling">Cycling</option>
                                            <option value="transit">Transit</option>
                                        </select>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Get Directions</button>
                                </form>
                            </div>
                        </div>
                    </div>
    
                     <!-- Right Column -->
                    <div class="col-md-8">
                        <!-- Map Container -->
                        <div class="card mb-3">
                            <div class="card-body p-0">
                                <div id="map" class="map-container"></div>
                            </div>
                        </div>
                        
                        <!-- Results Container -->
                        <div id="places-list" class="row"></div>
                    </div>
                </div>
            </div>
        `;
    
        // Initialize places service after rendering
        setTimeout(() => places.initialize(), 100);
    }
    
    renderRecommendationsPage(container) {
        container.innerHTML = `
            <div class="container py-4">
                <h2 class="mb-4">Travel Recommendations</h2>
                <div id="recommendations-container"></div>
            </div>
        `;
        recommendationService.initialize();
    }

    renderLoginPage(container) {
        container.innerHTML = `
            <div class="container py-4">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">Login</div>
                            <div class="card-body">
                                <form id="login-form">
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" id="login-email" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Password</label>
                                        <input type="password" id="login-password" class="form-control" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Login</button>
                                    <div class="text-center mt-3">
                                        <a href="#" data-route="/register">Create an account</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            auth.login({ email, password });
        });
    }

    renderRegisterPage(container) {
        container.innerHTML = `
            <div class="container py-4">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">Register</div>
                            <div class="card-body">
                                <form id="register-form">
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" id="register-email" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Password</label>
                                        <input type="password" id="register-password" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Confirm Password</label>
                                        <input type="password" id="register-confirm-password" class="form-control" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Register</button>
                                    <div class="text-center mt-3">
                                        <a href="#" data-route="/login">Already have an account?</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            auth.register({ email, password, confirmPassword });
        });
    }

    render404Page(container) {
        container.innerHTML = `
            <div class="container py-4 text-center">
                <h1 class="display-4">404 - Page Not Found</h1>
                <p class="lead">Oops! The page you're looking for doesn't exist.</p>
                <button class="btn btn-primary" data-route="/">Return to Home</button>
            </div>
        `;
    }

    updateAuthUI() {
        const authButtons = document.getElementById('authButtons');
        if (authButtons) {
            const isAuthenticated = auth.isAuthenticated();
            authButtons.innerHTML = isAuthenticated 
                ? `<button class="btn btn-outline-danger" id="logout-btn">Logout</button>` 
                : `
                    <button id="loginButton" class="btn btn-outline-primary me-2" data-route="/login">
                        <i class="bi bi-person"></i> Login
                    </button>
                    <button id="signUpButton" class="btn btn-primary" data-route="/register">
                        <i class="bi bi-person-plus"></i> Sign Up
                    </button>
                `;

            // Attach logout event
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    auth.logout();
                    this.navigateTo('/');
                });
            }
        }
    }

    isProtectedRoute(route) {
        const protectedRoutes = [
            '/dashboard', 
            '/itineraries', 
            '/profile'
        ];
        return protectedRoutes.includes(route);
    }
}

// Create singleton instance
const router = new Router();
export default router;