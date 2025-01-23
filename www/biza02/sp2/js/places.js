// places.js
import CONFIG from './config.js';
import NotificationManager from './notifications.js';
import directionsService from './directions.js';

class PlacesService {
    constructor() {
        this.map = null;
        this.markers = [];
        this.searchResults = [];
        this.placeDetails = new Map();
        this.bounds = null;
        this.initialized = false;
    }

    async initialize() {
        try {
            if (!document.getElementById('map')) {
                console.log('Map container not present, skipping initialization');
                return;
            }

            if (this.initialized) {
                console.log('Places service already initialized');
                return;
            }

            await this.initializeMap();
            this.setupEventListeners();
            this.bounds = L.latLngBounds();
            this.initialized = true;
            console.log('Places service initialized successfully');
        } catch (error) {
            console.error('Places initialization error:', error);
            NotificationManager.show({
                type: 'error',
                message: 'Failed to initialize places service'
            });
        }
    }

    async initializeMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            throw new Error('Map container not found');
        }

        this.map = L.map('map').setView(
            [CONFIG.MAP.DEFAULT_CENTER.LAT, CONFIG.MAP.DEFAULT_CENTER.LNG],
            CONFIG.MAP.DEFAULT_ZOOM
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: CONFIG.MAP.MAX_ZOOM,
            minZoom: CONFIG.MAP.MIN_ZOOM
        }).addTo(this.map);

        await directionsService.initialize(this.map);
    }

    setupEventListeners() {
        const searchForm = document.getElementById('places-form');
        if (searchForm) {
            searchForm.addEventListener('submit', this.handleSearchSubmit.bind(this));
        }

        const placeTypeFilter = document.getElementById('place-type');
        if (placeTypeFilter) {
            placeTypeFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }

        const routeForm = document.getElementById('route-form');
        if (routeForm) {
            routeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const start = document.getElementById('route-start').value;
                const end = document.getElementById('route-end').value;
                const mode = document.getElementById('transport-mode').value;
                
                if (start && end) {
                    directionsService.calculateRoute(start, end, [], mode);
                }
            });
        }
    }

    async handleSearchSubmit(event) {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        const query = searchInput.value.trim();
        if (query) {
            await this.searchPlaces(query);
        }
    }

    async searchPlaces(query) {
        try {
            this.clearResults();
            this.showLoadingState(true);

            const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
            const response = await fetch(nominatimUrl, {
                headers: { 'Accept': 'application/json' }
            });
            
            const data = await response.json();
            
            if (!data || data.length === 0) {
                throw new Error('Location not found');
            }

            const location = data[0];
            const lat = parseFloat(location.lat);
            const lon = parseFloat(location.lon);

            this.map.setView([lat, lon], 13);

            const radius = 5000;
            const placesUrl = `${CONFIG.API.OPENTRIPMAP.BASE_URL}${CONFIG.API.OPENTRIPMAP.ENDPOINTS.RADIUS}?radius=${radius}&lon=${lon}&lat=${lat}&format=json&apikey=${CONFIG.API.OPENTRIPMAP.API_KEY}`;
            
            const placesResponse = await fetch(placesUrl);
            const places = await placesResponse.json();

            this.searchResults = places;

            if (places && places.length > 0) {
                this.bounds = L.latLngBounds();
                await this.displaySearchResults(places, query);
            } else {
                this.showNoResults();
            }
        } catch (error) {
            console.error('Search error:', error);
            NotificationManager.show({
                type: 'error',
                message: error.message || 'Failed to search places'
            });
        } finally {
            this.showLoadingState(false);
        }
    }

    async displaySearchResults(places, searchQuery) {
        this.clearResults();
        
        let placesListContainer = document.getElementById('places-list');
        if (!placesListContainer) {
            placesListContainer = document.createElement('div');
            placesListContainer.id = 'places-list';
            document.querySelector('.col-md-8')?.appendChild(placesListContainer);
        }

        if (!places || places.length === 0) {
            placesListContainer.innerHTML = `
                <div class="alert alert-info mt-3">
                    No places found matching your search criteria.
                </div>
            `;
            return;
        }

        const listHTML = document.createElement('div');
        listHTML.className = 'row mt-3';

        places.forEach(place => {
            if (place.lat && place.lon) {
                const marker = this.createMarker(place);
                this.markers.push(marker);

                if (!this.bounds) {
                    this.bounds = L.latLngBounds([place.lat, place.lon]);
                } else {
                    this.bounds.extend([place.lat, place.lon]);
                }

                const placeElement = document.createElement('div');
                placeElement.className = 'col-md-6 mb-3';
                placeElement.innerHTML = `
                    <div class="card h-100" data-place-id="${place.xid}" data-categories="${place.kinds || ''}">
                        <div class="card-body">
                            <h5 class="card-title">${place.name}</h5>
                            <p class="card-text text-muted">
                                ${place.kinds ? place.kinds.split(',').slice(0, 3).join(', ') : 'No category available'}
                            </p>
                            <div class="btn-group">
                                <button onclick="places.showPlaceDetails('${place.xid}')" class="btn btn-sm btn-primary">
                                    Details
                                </button>
                                <button onclick="places.setAsRoutePoint('${place.name}', [${place.lat}, ${place.lon}])" class="btn btn-sm btn-secondary">
                                    Set as Route Point
                                </button>
                                <button onclick="places.addToItinerary('${place.xid}')" class="btn btn-sm btn-success">
                                    Add to Itinerary
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                listHTML.appendChild(placeElement);
            }
        });

        placesListContainer.innerHTML = '';
        placesListContainer.appendChild(listHTML);

        if (this.bounds && !this.bounds.isEmpty()) {
            this.map.fitBounds(this.bounds, {
                padding: [50, 50]
            });
        }

        NotificationManager.show({
            type: 'success',
            message: `Found ${places.length} places near ${searchQuery}`
        });
    }

    createMarker(place) {
        const marker = L.marker([place.lat, place.lon], {
            title: place.name
        }).addTo(this.map);

        const popupContent = `
            <div class="place-popup">
                <h6>${place.name}</h6>
                <p class="text-muted">${place.kinds || 'No category available'}</p>
                <div class="btn-group btn-group-sm">
                    <button onclick="places.showPlaceDetails('${place.xid}')" class="btn btn-primary">
                        Details
                    </button>
                    <button onclick="places.setAsRoutePoint('${place.name}', [${place.lat}, ${place.lon}])" class="btn btn-secondary">
                        Set as Route Point
                    </button>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        return marker;
    }

    async showPlaceDetails(placeId) {
        try {
            const detailsUrl = `${CONFIG.API.OPENTRIPMAP.BASE_URL}${CONFIG.API.OPENTRIPMAP.ENDPOINTS.DETAILS}/${placeId}?apikey=${CONFIG.API.OPENTRIPMAP.API_KEY}`;
            const response = await fetch(detailsUrl);
            const details = await response.json();

            Swal.fire({
                title: details.name,
                html: `
                    <div class="place-details">
                        ${details.preview?.source ? `
                            <img src="${details.preview.source}" alt="${details.name}" class="img-fluid mb-3">
                        ` : ''}
                        <p>${details.wikipedia_extracts?.text || details.info?.descr || 'No description available.'}</p>
                        ${details.url ? `<p><a href="${details.url}" target="_blank">More Information</a></p>` : ''}
                        <div class="mt-3">
                            <strong>Categories:</strong> ${details.kinds || 'N/A'}
                        </div>
                    </div>
                `,
                width: '600px',
                showCloseButton: true,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error fetching place details:', error);
            NotificationManager.show({
                type: 'error',
                message: 'Failed to load place details'
            });
        }
    }

    setAsRoutePoint(placeName, coordinates) {
        const startInput = document.getElementById('route-start');
        const endInput = document.getElementById('route-end');

        if (!startInput.value) {
            startInput.value = placeName;
        } else if (!endInput.value) {
            endInput.value = placeName;
        } else {
            NotificationManager.show({
                type: 'warning',
                message: 'Both route points are already set. Clear one first.'
            });
        }
    }

    addToItinerary(placeId) {
        const place = this.searchResults.find(p => p.xid === placeId);
        if (place) {
            const event = new CustomEvent('addToItinerary', {
                detail: {
                    type: 'place',
                    name: place.name,
                    location: {
                        lat: place.lat,
                        lon: place.lon
                    },
                    categories: place.kinds?.split(',') || [],
                    xid: place.xid
                }
            });
            document.dispatchEvent(event);
        }
    }

    handleFilterChange(event) {
        const selectedCategory = event.target.value.toLowerCase();
        const cards = document.querySelectorAll('[data-categories]');

        cards.forEach(card => {
            const categories = card.dataset.categories.toLowerCase();
            if (selectedCategory === 'all' || categories.includes(selectedCategory)) {
                card.closest('.col-md-6').style.display = '';
            } else {
                card.closest('.col-md-6').style.display = 'none';
            }
        });
    }

    clearResults() {
        this.markers.forEach(marker => marker && this.map.removeLayer(marker));
        this.markers = [];
        this.bounds = L.latLngBounds();

        const placesListContainer = document.getElementById('places-list');
        if (placesListContainer) {
            placesListContainer.innerHTML = '';
        }
    }

    showNoResults() {
        const resultsContainer = document.getElementById('places-list');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-info text-center">
                    No places found matching your search criteria.
                </div>
            `;
        }
    }

    showLoadingState(isLoading) {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.display = isLoading ? 'block' : 'none';
        }
    }
}

const places = new PlacesService();
window.places = places;
export default places;