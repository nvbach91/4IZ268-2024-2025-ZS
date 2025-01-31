import API from './api.js';
import TravelMap from './map.js';
import Notifications from './notifications.js';
import Utils from './utils.js';

class Recommendations {
    constructor() {
        this.map = null;
        this.elements = {
            container: null,
            searchForm: null,
            routeForm: null,
            searchResults: null,
            mapContainer: null,
            destinationInput: null,
            typeSelect: null,
            startLocation: null,
            endLocation: null
        };
    }

    createSearchForm() {
        const form = document.createElement('form');
        form.className = 'search-form mb-4';
        form.id = 'searchForm';

        form.innerHTML = `
            <div class="row g-3">
                <div class="col-md-6">
                    <input type="text" id="destinationInput" name="destination" 
                           class="form-control" placeholder="Enter destination (e.g., Prague, Paris)" required>
                </div>
                <div class="col-md-4">
                    <select name="type" class="form-control" id="typeSelect">
                        <option value="interesting_places">Tourist Attractions</option>
                        <option value="cultural">Cultural</option>
                        <option value="natural">Nature</option>
                        <option value="architecture">Architecture</option>
                        <option value="restaurants">Food & Dining</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <button type="submit" class="btn btn-primary w-100">🔍 Search</button>
                </div>
            </div>
        `;

        return form;
    }

    createRouteForm() {
        const form = document.createElement('form');
        form.className = 'route-form mb-4';
        form.id = 'routeForm';

        form.innerHTML = `
            <h4>Plan a Route</h4>
            <div class="row g-3">
                <div class="col-md-5">
                    <input type="text" id="startLocation" class="form-control" 
                           placeholder="Enter start location" required>
                </div>
                <div class="col-md-5">
                    <input type="text" id="endLocation" class="form-control" 
                           placeholder="Enter destination" required>
                </div>
                <div class="col-md-2">
                    <button type="submit" class="btn btn-success w-100">Plan Route</button>
                </div>
            </div>
        `;

        return form;
    }

    async render() {
        const container = document.createElement('div');
        container.id = 'recommendationsContainer';
        container.className = 'container';

        const title = document.createElement('h2');
        title.className = 'mb-4';
        title.textContent = 'Discover Places & Plan Routes';
        container.appendChild(title);

        const searchForm = this.createSearchForm();
        const routeForm = this.createRouteForm();
        container.appendChild(searchForm);
        container.appendChild(routeForm);

        const mapContainer = document.createElement('div');
        mapContainer.id = 'map';
        mapContainer.className = 'map-container mb-4';
        container.appendChild(mapContainer);

        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.className = 'search-results row';
        container.appendChild(resultsContainer);

        return container;
    }

    async init() {
        this.cacheElements();
        await this.initializeMap();
        this.bindEvents();
    }

    cacheElements() {
        this.elements = {
            container: document.getElementById('recommendationsContainer'),
            searchForm: document.getElementById('searchForm'),
            routeForm: document.getElementById('routeForm'),
            searchResults: document.getElementById('searchResults'),
            mapContainer: document.getElementById('map'),
            destinationInput: document.getElementById('destinationInput'),
            typeSelect: document.getElementById('typeSelect'),
            startLocation: document.getElementById('startLocation'),
            endLocation: document.getElementById('endLocation')
        };
    }

    async initializeMap() {
        if (this.elements.mapContainer) {
            await TravelMap.init('map');
        }
    }

    bindEvents() {
        if (this.elements.searchForm) {
            this.elements.searchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const destination = this.elements.destinationInput.value.trim();
                const type = this.elements.typeSelect.value;
                await this.search(destination, type);
            });
        }

        if (this.elements.routeForm) {
            this.elements.routeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const startLocation = this.elements.startLocation.value.trim();
                const endLocation = this.elements.endLocation.value.trim();
                
                if (startLocation && endLocation) {
                    await this.planRoute(startLocation, endLocation);
                } else {
                    Notifications.showAlert('Please enter both start and destination locations.', 'warning');
                }
            });
        }
    }

    createPlaceCard(place) {
        const types = place.kinds?.split(',')
            .map(type => type.trim().replace(/_/g, ' '))
            .join(', ') || 'No category available';

        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        
        card.innerHTML = `
            <div class="card h-100">
                ${place.preview?.source ? `
                    <img src="${place.preview.source}" 
                         class="card-img-top place-img" 
                         alt="${place.name}">
                ` : ''}
                <div class="card-body">
                    <h5 class="card-title">${place.name}</h5>
                    
                    <div class="mb-2">
                        <small class="text-muted">
                            📍 ${types}
                        </small>
                    </div>

                    ${place.wikipedia_extracts ? `
                        <p class="card-text">
                            ${place.wikipedia_extracts.text.slice(0, 150)}...
                        </p>
                    ` : ''}

                    <div class="buttons mt-3">
                        ${place.otm ? `
                            <a href="${place.otm}" 
                               class="btn btn-sm btn-outline-primary me-2" 
                               target="_blank">
                                🌐 More Info
                            </a>
                        ` : ''}

                        ${place.wikipedia ? `
                            <a href="${place.wikipedia}" 
                               class="btn btn-sm btn-outline-info me-2" 
                               target="_blank">
                                📚 Wikipedia
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    async search(destination, type) {
        try {
            Utils.showLoading();

            const coords = await API.geocode(destination);
            if (!coords) throw new Error('Location not found');

            console.log(`Searching places near: ${coords.lat}, ${coords.lon}`);

            const places = await API.searchPlaces(coords.lat, coords.lon, 5000, type);

            if (places && places.length > 0) {
                console.log(`Found ${places.length} places`);
                TravelMap.clearMap();
                TravelMap.centerOn(coords.lat, coords.lon);

                this.displayResults(places);
            } else {
                console.warn('No places found.');
                Notifications.showAlert('No places found for this category.', 'info');
            }
        } catch (error) {
            console.error('Search error:', error);
            Notifications.showAlert(error.message || "Search failed", 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    async planRoute(start, end) {
        try {
            Utils.showLoading();

            const startCoords = await API.geocode(start);
            const endCoords = await API.geocode(end);

            if (!startCoords || !endCoords) {
                throw new Error('One or both locations could not be found.');
            }

            TravelMap.clearMap();
            TravelMap.addMarker(startCoords.lat, startCoords.lon, `Start: ${start}`);
            TravelMap.addMarker(endCoords.lat, endCoords.lon, `End: ${end}`);
            await TravelMap.showRoute(startCoords, endCoords);

            Notifications.showAlert('Route planned successfully!', 'success');
        } catch (error) {
            console.error('Route planning error:', error);
            Notifications.showAlert(error.message, 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    async displayResults(places) {
        if (!this.elements.searchResults) {
            console.error("searchResults container is missing in displayResults.");
            return;
        }

        TravelMap.clearMap();

        if (!places || places.length === 0) {
            this.elements.searchResults.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        No places found for this search. Try different keywords or category.
                    </div>
                </div>`;
            return;
        }

        // Clear previous results
        this.elements.searchResults.innerHTML = '';

        places.forEach(place => {
            // Create and append place card
            const placeCard = this.createPlaceCard(place);
            this.elements.searchResults.appendChild(placeCard);

            // Add marker to map
            if (place.point) {
                const popupContent = `
                    <h6>${place.name}</h6>
                    <p>${place.kinds.replace(/_/g, ' ')}</p>
                `;
                TravelMap.addMarker(place.point.lat, place.point.lon, place.name, popupContent);
            } else {
                console.warn(`⚠️ No coordinates for ${place.name}`);
            }
        });

        TravelMap.fitMarkers();
    }
}

export default new Recommendations();