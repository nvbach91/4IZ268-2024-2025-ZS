// places.js
import CONFIG from './config.js';
import NotificationManager from './notifications.js';
import directionsService from './directions.js';
import loadingManager from './loading.js';

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
            loadingManager.show('Initializing map...');
            
            const mapContainer = document.getElementById('map');
            if (!mapContainer) {
                console.log('Map container not present, skipping initialization');
                return;
            }

            if (this.initialized) {
                console.log('Places service already initialized');
                return;
            }

            // Set explicit height for map container
            mapContainer.style.height = '500px';
            mapContainer.style.width = '100%';

            // Initialize the map
            this.map = L.map('map').setView(
                [CONFIG.MAP.DEFAULT_CENTER.LAT, CONFIG.MAP.DEFAULT_CENTER.LNG],
                CONFIG.MAP.DEFAULT_ZOOM
            );

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: CONFIG.MAP.MAX_ZOOM,
                minZoom: CONFIG.MAP.MIN_ZOOM
            }).addTo(this.map);

            // Initialize bounds
            this.bounds = L.latLngBounds();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize directions service
            await directionsService.initialize(this.map);
            
            this.initialized = true;
            console.log('Places service initialized successfully');

            // Force a map resize to handle any display issues
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);

        } catch (error) {
            console.error('Places initialization error:', error);
            NotificationManager.show({
                type: 'error',
                message: 'Failed to initialize map'
            });
        } finally {
            loadingManager.hide();
        }
    }

    setupEventListeners() {
        const searchForm = document.getElementById('places-form');
        if (searchForm) {
            searchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput && searchInput.value.trim()) {
                    await this.searchPlaces(searchInput.value.trim());
                }
            });
        }

        const placeTypeFilter = document.getElementById('place-type');
        if (placeTypeFilter) {
            placeTypeFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }
    }

    async searchPlaces(query) {
        try {
            loadingManager.show('Searching locations...');
            this.clearResults();

            // Geocode the location using Nominatim
            const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
            const response = await fetch(nominatimUrl, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'TravelPlanner/1.0'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error('Location not found');
            }

            const location = data[0];
            const lat = parseFloat(location.lat);
            const lon = parseFloat(location.lon);

            // Center map on found location
            this.map.setView([lat, lon], 13);

            // Search for places using OpenTripMap
            const radius = 5000;
            const placesUrl = `${CONFIG.API.OPENTRIPMAP.BASE_URL}/radius?apikey=${CONFIG.API.OPENTRIPMAP.API_KEY}&radius=${radius}&lon=${lon}&lat=${lat}&format=json`;
            
            const placesResponse = await fetch(placesUrl);
            if (!placesResponse.ok) {
                throw new Error('Failed to fetch nearby places');
            }

            const places = await placesResponse.json();
            this.searchResults = places;

            if (places && places.length > 0) {
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
            loadingManager.hide();
        }
    }

    async displaySearchResults(places, searchQuery) {
        const placesListContainer = document.getElementById('places-list');
        if (!placesListContainer) return;

        // Clear previous results
        this.clearResults();

        const resultsHTML = document.createElement('div');
        resultsHTML.className = 'row mt-3';

        // Reset bounds
        this.bounds = L.latLngBounds();

        places.forEach(place => {
            if (place.lat && place.lon) {
                // Create and add marker
                const marker = L.marker([place.lat, place.lon])
                    .addTo(this.map)
                    .bindPopup(`
                        <div class="place-popup">
                            <h6>${place.name}</h6>
                            <p class="text-muted small">${place.kinds || 'No category available'}</p>
                            <div class="btn-group">
                                <button onclick="places.showPlaceDetails('${place.xid}')" 
                                    class="btn btn-sm btn-primary">View Details</button>
                                <button onclick="places.addToItinerary('${place.xid}')" 
                                    class="btn btn-sm btn-success">Add to Itinerary</button>
                            </div>
                        </div>
                    `);

                this.markers.push(marker);
                this.bounds.extend([place.lat, place.lon]);

                // Create place card
                const placeCard = document.createElement('div');
                placeCard.className = 'col-md-6 mb-3';
                placeCard.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${place.name}</h5>
                            <p class="card-text text-muted">
                                ${place.kinds ? place.kinds.split(',').slice(0, 3).join(', ') : 'No category available'}
                            </p>
                            <div class="btn-group">
                                <button onclick="places.showPlaceDetails('${place.xid}')" 
                                    class="btn btn-sm btn-primary">Details</button>
                                <button onclick="places.setAsRoutePoint('${place.name}', [${place.lat}, ${place.lon}])" 
                                    class="btn btn-sm btn-secondary">Set as Route Point</button>
                                <button onclick="places.addToItinerary('${place.xid}')" 
                                    class="btn btn-sm btn-success">Add to Itinerary</button>
                            </div>
                        </div>
                    </div>
                `;
                resultsHTML.appendChild(placeCard);
            }
        });

        // Add results to container
        placesListContainer.innerHTML = '';
        placesListContainer.appendChild(resultsHTML);

        // Fit map to bounds
        if (!this.bounds.isEmpty()) {
            this.map.fitBounds(this.bounds, {
                padding: [50, 50],
                maxZoom: 15
            });
        }

        NotificationManager.show({
            type: 'success',
            message: `Found ${places.length} places near ${searchQuery}`
        });
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
        // Clear markers
        this.markers.forEach(marker => {
            if (marker && this.map) {
                this.map.removeLayer(marker);
            }
        });
        this.markers = [];

        // Reset bounds
        this.bounds = L.latLngBounds();

        // Clear results list
        const placesListContainer = document.getElementById('places-list');
        if (placesListContainer) {
            placesListContainer.innerHTML = '';
        }
    }

    showNoResults() {
        const resultsContainer = document.getElementById('places-list');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="alert alert-info mt-3">
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