import API from './api.js';
import TravelMap from './map.js';
import Notifications from './notifications.js';
import Utils from './utils.js';

class Recommendations {
    constructor() {
        this.map = null;
        this.searchResults = null;
        this.searchForm = null;
        this.routeForm = null;
    }

    createSearchForm() {
        const form = document.createElement('form');
        form.className = 'mb-4';
        form.id = 'searchForm';

        const row = document.createElement('div');
        row.className = 'row g-3';

        // Destination input
        const destinationCol = document.createElement('div');
        destinationCol.className = 'col-md-6';
        const destinationInput = document.createElement('input');
        destinationInput.type = 'text';
        destinationInput.id = 'destinationInput';
        destinationInput.name = 'destination';
        destinationInput.className = 'form-control';
        destinationInput.placeholder = 'Enter destination (e.g., Prague, Paris)';
        destinationInput.required = true;
        destinationCol.appendChild(destinationInput);

        // Type select
        const typeCol = document.createElement('div');
        typeCol.className = 'col-md-4';
        const typeSelect = document.createElement('select');
        typeSelect.name = 'type';
        typeSelect.className = 'form-control';

        const options = [
            { value: 'interesting_places', text: 'Tourist Attractions' },
            { value: 'cultural', text: 'Cultural' },
            { value: 'natural', text: 'Nature' },
            { value: 'architecture', text: 'Architecture' },
            { value: 'restaurants', text: 'Food & Dining' }
        ];

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            typeSelect.appendChild(option);
        });
        typeCol.appendChild(typeSelect);

        // Search button
        const buttonCol = document.createElement('div');
        buttonCol.className = 'col-md-2';
        const searchButton = document.createElement('button');
        searchButton.type = 'submit';
        searchButton.className = 'btn btn-primary w-100';
        searchButton.textContent = '🔍 Search';
        buttonCol.appendChild(searchButton);

        row.append(destinationCol, typeCol, buttonCol);
        form.appendChild(row);
        return form;
    }

    createRouteForm() {
        const form = document.createElement('form');
        form.className = 'mb-4';
        form.id = 'routeForm';

        const heading = document.createElement('h4');
        heading.textContent = 'Plan a Route';
        form.appendChild(heading);

        const row = document.createElement('div');
        row.className = 'row g-3';

        // Start location input
        const startCol = document.createElement('div');
        startCol.className = 'col-md-5';
        const startInput = document.createElement('input');
        startInput.type = 'text';
        startInput.id = 'startLocation';
        startInput.className = 'form-control';
        startInput.placeholder = 'Enter start location';
        startInput.required = true;
        startCol.appendChild(startInput);

        // End location input
        const endCol = document.createElement('div');
        endCol.className = 'col-md-5';
        const endInput = document.createElement('input');
        endInput.type = 'text';
        endInput.id = 'endLocation';
        endInput.className = 'form-control';
        endInput.placeholder = 'Enter destination';
        endInput.required = true;
        endCol.appendChild(endInput);

        // Route button
        const buttonCol = document.createElement('div');
        buttonCol.className = 'col-md-2';
        const routeButton = document.createElement('button');
        routeButton.type = 'submit';
        routeButton.className = 'btn btn-success w-100';
        routeButton.textContent = 'Plan Route';
        buttonCol.appendChild(routeButton);

        row.append(startCol, endCol, buttonCol);
        form.appendChild(row);
        return form;
    }

    async render() {
        let container = document.getElementById('recommendationsContainer');

        if (!container) {
            container = document.createElement('div');
            container.id = 'recommendationsContainer';
            container.className = 'container';
        } else {
            container.innerHTML = '';
        }

        const title = document.createElement('h2');
        title.className = 'mb-4';
        title.textContent = 'Discover Places & Plan Routes';

        const searchForm = this.createSearchForm();
        const routeForm = this.createRouteForm();

        // Check for existing map container
        let mapContainer = document.getElementById('map');
        if (!mapContainer) {
            mapContainer = document.createElement('div');
            mapContainer.id = 'map';
            mapContainer.style.height = '400px';
            mapContainer.style.marginBottom = '20px';
        }

        // Check for existing search results container
        let searchResultsContainer = document.getElementById('searchResults');
        if (!searchResultsContainer) {
            searchResultsContainer = document.createElement('div');
            searchResultsContainer.id = 'searchResults';
            searchResultsContainer.className = 'row';
        }

        container.append(title, searchForm, routeForm, mapContainer, searchResultsContainer);

        return container;
    }

    async init() {
        this.searchForm = document.getElementById('searchForm');
        this.routeForm = document.getElementById('routeForm');
        this.searchResults = document.getElementById('searchResults');

        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            await TravelMap.init('map');
        }

        this.bindEvents();
    }

    bindEvents() {
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                await this.search(formData.get('destination'), formData.get('type'));
            });
        }

        if (this.routeForm) {
            this.routeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const startLocation = document.getElementById('startLocation').value.trim();
                const endLocation = document.getElementById('endLocation').value.trim();
                
                if (startLocation && endLocation) {
                    await this.planRoute(startLocation, endLocation);
                } else {
                    Notifications.showAlert('Please enter both start and destination locations.', 'warning');
                }
            });
        }
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

                if (!this.searchResults) {
                    this.searchResults = document.getElementById('searchResults');
                }

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

    createPlaceCard(place) {
        const types = place.kinds?.split(',').map(type => 
            type.trim().replace(/_/g, ' ')
        ).join(', ') || 'No category available';

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    ${place.preview?.source ? `
                        <img src="${place.preview.source}" 
                             class="card-img-top" 
                             alt="${place.name}"
                             style="height: 200px; object-fit: cover;">
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
            </div>
        `;
    }

    async displayResults(places) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) {
            console.error("searchResults container is missing in displayResults.");
            return;
        }

        TravelMap.clearMap();

        if (!places || places.length === 0) {
            resultsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        No places found for this search. Try different keywords or category.
                    </div>
                </div>`;
            return;
        }

        let html = '<div class="row">';
        places.forEach(place => {
            html += this.createPlaceCard(place);

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
        html += '</div>';

        resultsContainer.innerHTML = html;
        TravelMap.fitMarkers();
    }
}

export default new Recommendations();