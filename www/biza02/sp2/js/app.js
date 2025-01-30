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

function ensureNode(content) {
    if (typeof content === 'string') {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = content;
        return wrapper;
    }
    return content instanceof HTMLElement ? content : document.createElement('div');
}

class App {
    constructor() {
        this.appContainer = null;
    }

    async init() {
        try {
            await new Promise((resolve) => auth.onAuthStateChanged(resolve));
            this.appContainer = document.getElementById('app');
            Utils.init();
            await Auth.init();
            await Itinerary.init();
            this.bindEvents();
            await this.router(window.location.hash.slice(1) || 'home');
            this.setupTheme();
        } catch (error) {
            console.error('Initialization error:', error);
            Notifications.showAlert('Failed to initialize application', 'error');
        }
    }

    async router(page) {
        try {
            Utils.showLoading();
            
            this.removeExistingContent();

            const protectedRoutes = ['trips', 'profile', 'budget'];
            const isAuthenticated = await Auth.checkLoginState();
            
            // Check if the base route is protected
            const baseRoute = page.split('/')[0];
            if (protectedRoutes.includes(baseRoute) && !isAuthenticated) {
                window.location.hash = 'login';
                return;
            }

            this.updateNavigation(baseRoute);
            let pageContent = null;

            // Handle trip details route first
            if (page.match(/^trips\/[^/]+$/) && page !== 'trips/new') {
                const tripId = page.split('/')[1];
                pageContent = await ensureNode(await Itinerary.renderTripDetails(tripId));
                this.appContainer.appendChild(pageContent);
                if (Itinerary.bindEvents) {
                    Itinerary.bindEvents();
                }
                return;
            }

            switch (page) {
                case 'recommendations': {
                    pageContent = await ensureNode(await Recommendations.render());
                    this.appContainer.appendChild(pageContent);
                    
                    setTimeout(() => {
                        const mapElement = document.getElementById('map');
                        if (mapElement) {
                            TravelMap.init('map');
                            if (Recommendations.init) Recommendations.init();
                        }
                    }, 100);
                    break;
                }
                case 'search': {
                    pageContent = await ensureNode(await Stats.render());
                    this.appContainer.appendChild(pageContent);
                    
                    requestAnimationFrame(async () => {
                        const stats = await Stats.collectStatistics();
                        if (stats) {
                            Stats.initializeCharts(stats);
                        }
                    });
                    break;
                }
                case 'profile': {
                    const profilePage = await Profile.render();
                    if (profilePage) {
                        this.appContainer.appendChild(ensureNode(profilePage));
                        await Profile.init();
                    } else {
                        this.appContainer.innerHTML = '<p>Error loading profile.</p>';
                    }
                    break;
                }
                case 'trips': {
                    const tripsContent = await Itinerary.renderTripsList();
                    if (tripsContent instanceof HTMLElement) {
                        this.appContainer.appendChild(tripsContent);
                        if (Itinerary.bindEvents) {
                            Itinerary.bindEvents();
                        }
                    } else {
                        this.appContainer.innerHTML = '<p>Error loading trips.</p>';
                    }
                    break;
                }
                case 'trips/new': {
                    pageContent = await ensureNode(await Itinerary.createTripForm());
                    this.appContainer.appendChild(pageContent);
                    if (Itinerary.bindEvents) {
                        Itinerary.bindEvents();
                    }
                    break;
                }
                case 'budget': {
                    pageContent = await ensureNode(await Budget.render());
                    this.appContainer.appendChild(pageContent);
                    if (Budget.init) {
                        Budget.init();
                    }
                    break;
                }
                case 'weather': {
                    pageContent = await ensureNode(await Weather.render());
                    this.appContainer.appendChild(pageContent);
                    if (Weather.init) {
                        Weather.init();
                    }
                    break;
                }
                case 'login': {
                    pageContent = document.createElement('div');
                    pageContent.innerHTML = Auth.renderLoginForm();
                    this.appContainer.appendChild(pageContent);
                    Auth.bindEvents();
                    break;
                }
                case 'register': {
                    pageContent = document.createElement('div');
                    pageContent.innerHTML = Auth.renderRegisterForm();
                    this.appContainer.appendChild(pageContent);
                    Auth.bindEvents();
                    break;
                }
                case 'home': {
                    pageContent = this.renderHome();
                    this.appContainer.appendChild(pageContent);
                    break;
                }
                default: {
                    this.removeMap();
                    pageContent = this.renderNotFound();
                    this.appContainer.appendChild(pageContent);
                }
            }
        } catch (error) {
            console.error('Routing error:', error);
            Notifications.showAlert(error.message, 'error');
            this.appContainer.innerHTML = '<h2 class="text-center">Oops! Something went wrong</h2>';
        } finally {
            Utils.hideLoading();
        }
    }

    removeExistingContent() {
        // Clear the app container
        this.appContainer.innerHTML = '';
        
        // Remove any existing recommendations container
        const existingRecommendations = document.getElementById('recommendationsContainer');
        if (existingRecommendations && existingRecommendations.parentElement !== this.appContainer) {
            existingRecommendations.remove();
        }

        // Remove any existing map instance
        this.removeMap();
    }

    removeMap() {
        const mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.remove();
        }
    }

    bindEvents() {
        window.addEventListener("hashchange", () => this.router(window.location.hash.slice(1) || 'home'));

        document.addEventListener("click", (e) => {
            if (e.target.matches('.logout-btn')) {
                Auth.logout();
            }
        });

        const themeToggle = document.getElementById("themeToggle");
        if (themeToggle) {
            themeToggle.addEventListener("click", () => this.toggleTheme());
        }
    }

    updateNavigation(currentPage) {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            const href = link.getAttribute('href')?.slice(1); // Remove the # from href
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    renderHome() {
        const container = document.createElement('div');
        container.className = 'home-section container py-4';

        const title = document.createElement('h1');
        title.className = 'display-4';
        title.textContent = 'Welcome to Travel Planner';

        const subtitle = document.createElement('p');
        subtitle.className = 'lead';
        subtitle.textContent = 'Plan your perfect trip with ease';

        const featuresContainer = document.createElement('div');
        featuresContainer.className = 'row mt-4';

        const features = [
            { title: "📍 Plan Your Trip", desc: "Create detailed itineraries for your next adventure.", link: "#trips" },
            { title: "🔍 Discover Places", desc: "Find interesting locations and activities.", link: "#search" },
            { title: "⭐ Get Recommendations", desc: "Personalized suggestions based on your interests.", link: "#recommendations" }
        ];

        features.forEach(feature => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';

            const card = document.createElement('div');
            card.className = 'card h-100';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = feature.title;

            const cardText = document.createElement('p');
            cardText.className = 'card-text';
            cardText.textContent = feature.desc;

            const link = document.createElement('a');
            link.href = feature.link;
            link.className = 'btn btn-primary';
            link.textContent = 'Explore';

            cardBody.append(cardTitle, cardText, link);
            card.appendChild(cardBody);
            col.appendChild(card);
            featuresContainer.appendChild(col);
        });

        container.append(title, subtitle, featuresContainer);
        return container;
    }

    renderNotFound() {
        const container = document.createElement('div');
        container.className = 'not-found-page text-center py-5';
        
        const title = document.createElement('h2');
        title.textContent = '404 - Page Not Found';
        
        const message = document.createElement('p');
        message.textContent = "The page you're looking for doesn't exist.";
        
        const backLink = document.createElement('a');
        backLink.href = '#home';
        backLink.className = 'btn btn-primary mt-3';
        backLink.textContent = 'Go to Home';
        
        container.append(title, message, backLink);
        return container;
    }

    setupTheme() {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.body.classList.toggle("dark-mode", savedTheme === "dark");
    }

    toggleTheme() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init().catch(error => {
        console.error('App initialization error:', error);
        Notifications.showAlert('Failed to start application', 'error');
    });
});