// app.js
import API from './api.js';
import Auth from './auth.js';
import Itinerary from './itinerary.js';
import Recommendations from './recommendations.js';
import Profile from './profile.js';
import Budget from './budget.js';
import Notifications from './notifications.js';
import Utils from './utils.js';
import TravelMap from './map.js';
import Weather from './weather.js';
import Stats from './stats.js';
import Sharing from './sharing.js';
import { auth } from './firebase-init.js';

class App {
    constructor() {
        this.elements = {
            appContainer: null,
            navLinks: null,
            themeToggle: null,
            loadingOverlay: null,
            logoutButton: null,
            navbarToggler: null,
            navbarCollapse: null
        };
    }

    async init() {
        try {
            await new Promise((resolve) => auth.onAuthStateChanged(resolve));
            
            // Cache all DOM elements
            this.elements = {
                appContainer: document.getElementById('app'),
                navLinks: document.querySelectorAll('.nav-link'),
                themeToggle: document.getElementById('themeToggle'),
                loadingOverlay: document.getElementById('loading'),
                logoutButton: document.getElementById('logoutButton'),
                navbarToggler: document.querySelector('.navbar-toggler'),
                navbarCollapse: document.getElementById('navbarNav')
            };

            Utils.init();
            await Auth.init();
            await Itinerary.init();
            
            this.bindNavbarEvents();
            this.bindEvents();
            
            await this.router(window.location.hash.slice(1) || 'home');
            this.setupTheme();
        } catch (error) {
            console.error('Initialization error:', error);
            Notifications.showAlert('Failed to initialize application', 'error');
        }
    }

    bindNavbarEvents() {
        if (this.elements.navbarToggler && this.elements.navbarCollapse) {
            // Toggle navbar on button click
            this.elements.navbarToggler.addEventListener('click', () => {
                this.elements.navbarCollapse.classList.toggle('show');
            });

            // Close navbar when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.elements.navbarToggler.contains(e.target) &&
                    !this.elements.navbarCollapse.contains(e.target)) {
                    this.elements.navbarCollapse.classList.remove('show');
                }
            });

            // Close navbar when clicking a link
            this.elements.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.elements.navbarCollapse.classList.remove('show');
                });
            });
        }
    }

    bindEvents() {
        // Handle route changes
        window.addEventListener('hashchange', () => 
            this.router(window.location.hash.slice(1) || 'home')
        );

        // Handle link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.nav-link');
            if (link && link.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                window.location.hash = link.getAttribute('href').slice(1);
            }
        });

        // Handle theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Handle logout
        if (this.elements.logoutButton) {
            this.elements.logoutButton.addEventListener('click', async (e) => {
                e.preventDefault();
                await Auth.logout();
            });
        }
    }

    async router(page) {
        try {
            Utils.showLoading();
            this.clearContent();
    
            const protectedRoutes = ['trips', 'profile', 'budget'];
            const isAuthenticated = await Auth.isLoggedIn();
            
            const baseRoute = page.split('/')[0];
            if (protectedRoutes.includes(baseRoute) && !isAuthenticated) {
                window.location.hash = 'login';
                return;
            }
    
            this.updateNavigation(baseRoute, isAuthenticated);

            // Check if it's a trip details route
            if (page.startsWith('trips/') && page !== 'trips/new') {
                const tripId = page.split('/')[1];
                if (tripId) {
                    const tripContent = await Itinerary.renderTripDetails(tripId);
                    this.elements.appContainer.appendChild(tripContent);
                    await Itinerary.bindEvents();
                    Utils.hideLoading();
                    return;
                }
            }

            let pageContent = null;
            switch (page) {
                case 'recommendations':
                    pageContent = await Recommendations.render();
                    this.elements.appContainer.appendChild(pageContent);
                    await Recommendations.init();
                    if (document.getElementById('map')) {
                        await TravelMap.init('map');
                    }
                    break;

                case 'search':
                    pageContent = await Stats.render();
                    this.elements.appContainer.appendChild(pageContent);
                    break;

                case 'profile':
                    pageContent = await Profile.render();
                    if (pageContent) {
                        this.elements.appContainer.appendChild(pageContent);
                        await Profile.init();
                    }
                    break;

                case 'trips':
                    pageContent = await Itinerary.renderTripsList();
                    if (pageContent) {
                        this.elements.appContainer.appendChild(pageContent);
                        await Itinerary.bindEvents();
                    }
                    break;

                case 'trips/new':
                    if (await Auth.isLoggedIn()) {
                        pageContent = await Itinerary.createTripForm();
                        this.elements.appContainer.appendChild(pageContent);
                    } else {
                        const message = document.createElement('p');
                        message.textContent = 'Please log in to create a trip.';
                        this.elements.appContainer.appendChild(message);
                    }
                    break;

                case 'budget':
                    pageContent = await Budget.render();
                    this.elements.appContainer.appendChild(pageContent);
                    await Budget.init();
                    break;

                case 'weather':
                    pageContent = await Weather.render();
                    this.elements.appContainer.appendChild(pageContent);
                    await Weather.init();
                    break;

                case 'login':
                    if (isAuthenticated) {
                        window.location.hash = 'trips';
                        return;
                    }
                    pageContent = document.createElement('div');
                    pageContent.innerHTML = Auth.renderLoginForm();
                    this.elements.appContainer.appendChild(pageContent);
                    Auth.bindEvents();
                    break;

                case 'register':
                    if (isAuthenticated) {
                        window.location.hash = 'trips';
                        return;
                    }
                    pageContent = document.createElement('div');
                    pageContent.innerHTML = Auth.renderRegisterForm();
                    this.elements.appContainer.appendChild(pageContent);
                    Auth.bindEvents();
                    break;

                case 'home':
                    pageContent = this.renderHome();
                    this.elements.appContainer.appendChild(pageContent);
                    break;

                default:
                    pageContent = this.renderNotFound();
                    this.elements.appContainer.appendChild(pageContent);
            }
        } catch (error) {
            console.error('Routing error:', error);
            Notifications.showAlert(error.message, 'error');
            const errorMessage = document.createElement('h2');
            errorMessage.className = 'text-center';
            errorMessage.textContent = 'Oops! Something went wrong';
            this.elements.appContainer.appendChild(errorMessage);
        } finally {
            Utils.hideLoading();
        }
    }

    clearContent() {
        if (this.elements.appContainer) {
            this.elements.appContainer.innerHTML = '';
        }
    }

    updateNavigation(currentRoute, isAuthenticated) {
        // Update active state
        this.elements.navLinks?.forEach(link => {
            const href = link.getAttribute('href')?.slice(1);
            link.classList.toggle('active', href === currentRoute);
        });

        // Update auth visibility
        document.querySelectorAll('.auth-link').forEach(link => {
            if (isAuthenticated) {
                link.classList.toggle('show', link.classList.contains('logged-in'));
            } else {
                link.classList.toggle('show', link.classList.contains('logged-out'));
            }
        });
    }

    renderHome() {
        const container = document.createElement('div');
        container.className = 'home-section container py-4';
    
        const heading = document.createElement('h1');
        heading.className = 'display-4';
        heading.textContent = 'Welcome to Travel Planner';
    
        const subheading = document.createElement('p');
        subheading.className = 'lead';
        subheading.textContent = 'Plan your perfect trip with ease';
    
        const featuresRow = document.createElement('div');
        featuresRow.className = 'row mt-4';
    
        const features = [
            { title: "📍 Plan Your Trip!", desc: "Create detailed itineraries for your next adventure.", link: "#trips" },
            { title: "🔍 See your statistics!", desc: "Get information about your trip in detail.", link: "#search" },
            { title: "⭐ Get Recommendations!", desc: "Personalized suggestions based on your interests.", link: "#recommendations" }
        ];
    
        features.forEach(feature => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
    
            const card = document.createElement('div');
            card.className = 'card h-100';
    
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
    
            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = feature.title;
    
            const desc = document.createElement('p');
            desc.className = 'card-text';
            desc.textContent = feature.desc;
    
            const link = document.createElement('a');
            link.className = 'btn btn-primary';
            link.href = feature.link;
            link.textContent = 'Explore';
    
            cardBody.appendChild(title);
            cardBody.appendChild(desc);
            cardBody.appendChild(link);
            card.appendChild(cardBody);
            col.appendChild(card);
            featuresRow.appendChild(col);
        });
    
        container.appendChild(heading);
        container.appendChild(subheading);
        container.appendChild(featuresRow);
    
        return container;
    }

    renderNotFound() {
        const container = document.createElement('div');
        container.className = 'not-found-page text-center py-5';
    
        const heading = document.createElement('h2');
        heading.textContent = '404 - Page Not Found';
    
        const message = document.createElement('p');
        message.textContent = "The page you're looking for doesn't exist.";
    
        const link = document.createElement('a');
        link.href = '#home';
        link.className = 'btn btn-primary mt-3';
        link.textContent = 'Go to Home';
    
        container.appendChild(heading);
        container.appendChild(message);
        container.appendChild(link);
    
        return container;
    }

    setupTheme() {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.body.classList.toggle("dark-mode", savedTheme === "dark");
    }

    toggleTheme() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", 
            document.body.classList.contains("dark-mode") ? "dark" : "light"
        );
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init().catch(error => {
        console.error('App initialization error:', error);
        Notifications.showAlert('Failed to start application', 'error');
    });
});