// directions.js
import CONFIG from './config.js';
import NotificationManager from './notifications.js';
import StorageManager from './storage.js';
import places from './places.js';

class DirectionsService {
    constructor() {
        this.map = null;
        this.routeLayer = null;
        this.currentRoute = null;
        this.markers = [];
    }

    /**
     * Initialize directions functionality
     * @param {Object} mapInstance - Leaflet map instance
     */
    async initialize(mapInstance) {
        try {
            this.map = mapInstance;
            this.initializeRouteLayer();
            this.setupEventListeners();
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    /**
     * Create a layer group for routes on the map
     */
    initializeRouteLayer() {
        if (!this.map) return;
        this.routeLayer = L.layerGroup().addTo(this.map);
    }

    /**
     * Setup event listeners for directions functionality
     */
    setupEventListeners() {
        // Directions form submission
        const directionsForm = document.getElementById('directions-form');
        if (directionsForm) {
            directionsForm.addEventListener('submit', this.handleDirectionsSubmit.bind(this));
        }
    }

    /**
     * Handle directions form submission
     * @param {Event} event - Form submission event
     */
    async handleDirectionsSubmit(event) {
        event.preventDefault();

        try {
            const origin = document.getElementById('route-start').value.trim();
            const destination = document.getElementById('route-end').value.trim();
            const transportMode = document.getElementById('transport-mode').value;

            if (!this.validateInputs(origin, destination)) {
                return;
            }

            await this.calculateRoute(origin, destination, [], transportMode);
        } catch (error) {
            this.handleRouteCalculationError(error);
        }
    }

    /**
     * Validate route input fields
     * @param {string} origin - Starting point
     * @param {string} destination - Ending point
     * @returns {boolean} Whether inputs are valid
     */
    validateInputs(origin, destination) {
        if (!origin || !destination) {
            NotificationManager.show({
                type: 'warning',
                message: 'Please enter both origin and destination'
            });
            return false;
        }
        return true;
    }

    /**
     * Calculate route using geocoding and mapping
     * @param {string} origin - Starting point
     * @param {string} destination - Ending point
     * @param {string[]} [waypoints=[]] - Intermediate waypoints
     * @param {string} [mode='driving'] - Transport mode
     */
    async calculateRoute(origin, destination, waypoints = [], mode = 'driving') {
        try {
            // Clear previous route
            this.clearPreviousRoute();

            // Geocode origin and destination
            const [originCoords, destinationCoords] = await Promise.all([
                this.geocodeLocation(origin),
                this.geocodeLocation(destination)
            ]);

            // Geocode waypoints
            const waypointCoords = await Promise.all(
                waypoints.map(wp => this.geocodeLocation(wp))
            );

            // Draw route on map
            this.drawRouteOnMap(originCoords, destinationCoords, waypointCoords, mode);

            // Store current route
            this.currentRoute = {
                origin,
                destination,
                waypoints,
                originCoords,
                destinationCoords,
                waypointCoords,
                mode
            };

            // Display route details
            this.displayRouteDetails();

            NotificationManager.show({
                type: 'success',
                message: 'Route calculated successfully'
            });
        } catch (error) {
            this.handleRouteCalculationError(error);
        }
    }

    /**
     * Geocode a location to get its coordinates
     * @param {string} location - Location to geocode
     * @returns {Promise<{lat: number, lon: number}>} Coordinates
     */
    async geocodeLocation(location) {
        const apiKey = CONFIG.API.GOOGLE_MAPS.API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== 'OK') {
                throw new Error(`Geocoding failed: ${data.status}`);
            }

            const { lat, lng: lon } = data.results[0].geometry.location;
            return { lat, lon };
        } catch (error) {
            console.error('Geocoding error:', error);
            throw new Error(`Could not geocode location: ${location}`);
        }
    }

    /**
     * Draw route on the map
     * @param {Object} origin - Origin coordinates
     * @param {Object} destination - Destination coordinates
     * @param {Array} waypoints - Waypoint coordinates
     * @param {string} mode - Transport mode
     */
    drawRouteOnMap(origin, destination, waypoints, mode) {
        // Create route points
        const routePoints = [origin, ...waypoints, destination];

        // Draw polyline connecting points
        const routeLine = L.polyline(
            routePoints.map(point => [point.lat, point.lon]),
            {
                color: this.getRouteColor(mode),
                weight: 5,
                opacity: 0.7
            }
        ).addTo(this.routeLayer);

        // Add markers
        this.addRouteMarkers(routePoints);

        // Fit map to route
        this.map.fitBounds(routeLine.getBounds());
    }

    /**
     * Get route color based on transport mode
     * @param {string} mode - Transport mode
     * @returns {string} Color for the route
     */
    getRouteColor(mode) {
        const colors = {
            'driving': '#4285f4',   // Blue
            'walking': '#34a853',   // Green
            'bicycling': '#fbbc05', // Yellow
            'transit': '#ea4335'    // Red
        };
        return colors[mode] || '#4285f4';
    }

    /**
     * Add markers for route points
     * @param {Array} points - Route points
     */
    addRouteMarkers(points) {
        points.forEach((point, index) => {
            const marker = L.marker([point.lat, point.lon], {
                icon: L.divIcon({
                    className: 'route-marker',
                    html: `<div class="marker-label">${String.fromCharCode(65 + index)}</div>`
                })
            }).addTo(this.routeLayer);
            this.markers.push(marker);
        });
    }

    /**
     * Display route details in the UI
     */
    displayRouteDetails() {
        if (!this.currentRoute) return;

        const detailsContainer = document.getElementById('route-details');
        if (!detailsContainer) return;

        detailsContainer.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Route Details</h5>
                    <p><strong>From:</strong> ${this.currentRoute.origin}</p>
                    <p><strong>To:</strong> ${this.currentRoute.destination}</p>
                    <p><strong>Mode:</strong> ${this.currentRoute.mode}</p>
                    ${this.currentRoute.waypoints.length > 0
                        ? `<p><strong>Waypoints:</strong> ${this.currentRoute.waypoints.join(', ')}</p>`
                        : ''}
                    <button class="btn btn-primary" onclick="directions.addRouteToItinerary()">
                        Add to Itinerary
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Add current route to an itinerary
     */
    addRouteToItinerary() {
        if (!this.currentRoute) {
            NotificationManager.show({
                type: 'error',
                message: 'No route selected'
            });
            return;
        }

        // Trigger route addition through places service
        places.addRouteToItinerary({
            origin: this.currentRoute.origin,
            destination: this.currentRoute.destination,
            distance: this.calculateRouteDistance(this.currentRoute),
            duration: this.calculateRouteDuration(this.currentRoute),
            mode: this.currentRoute.mode,
            waypoints: this.currentRoute.waypoints,
            polyline: this.currentRoute.polyline
        });
    }

    /**
     * Calculate route distance
     * @param {Object} route - Route details
     * @returns {number} Route distance in meters
     */
    calculateRouteDistance(route) {
        let distance = 0;
        const { originCoords, destinationCoords, waypointCoords } = route;

        distance += this.calculateDistanceBetweenPoints(originCoords, destinationCoords);

        for (let i = 0; i < waypointCoords.length - 1; i++) {
            distance += this.calculateDistanceBetweenPoints(waypointCoords[i], waypointCoords[i + 1]);
        }

        return distance;
    }

    /**
     * Calculate route duration
     * @param {Object} route - Route details
     * @returns {Promise<number>} Route duration in minutes
     */
    async calculateRouteDuration(route) {
        try {
            const apiUrl = this.buildDirectionsApiUrl(
                route.originCoords,
                route.destinationCoords,
                route.waypointCoords,
                route.mode
            );

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === 'OK') {
                const duration = data.routes[0].legs.reduce((total, leg) => {
                    return total + leg.duration.value;
                }, 0);

                return Math.round(duration / 60); // Convert seconds to minutes
            } else {
                console.error('Error from Directions API:', data.error_message || data.status);
                return 0;
            }
        } catch (error) {
            console.error('Failed to fetch route duration:', error);
            return 0;
        }
    }

    /**
     * Build URL for Google Maps Directions API
     * @param {Object} origin - Origin coordinates
     * @param {Object} destination - Destination coordinates
     * @param {Array} waypoints - Waypoint coordinates
     * @param {string} mode - Transport mode
     * @returns {string} Constructed API URL
     */
    buildDirectionsApiUrl(origin, destination, waypoints, mode) {
        const baseUrl = CONFIG.API.GOOGLE_MAPS.ENDPOINTS.DIRECTIONS;
        const params = new URLSearchParams({
            origin: `${origin.lat},${origin.lon}`,
            destination: `${destination.lat},${destination.lon}`,
            mode: mode,
            key: CONFIG.API.GOOGLE_MAPS.API_KEY
        });

        if (waypoints.length > 0) {
            params.append('waypoints', waypoints.map(wp => `${wp.lat},${wp.lon}`).join('|'));
        }

        return `${baseUrl}?${params.toString()}`;
    }

    /**
     * Calculate distance between two points
     * @param {Object} point1 - { lat, lon }
     * @param {Object} point2 - { lat, lon }
     * @returns {number} Distance in meters
     */
    calculateDistanceBetweenPoints(point1, point2) {
        const R = 6371e3; // Earth's radius in meters
        const phi1 = (point1.lat * Math.PI) / 180;
        const phi2 = (point2.lat * Math.PI) / 180;
        const deltaPhi = ((point2.lat - point1.lat) * Math.PI) / 180;
        const deltaLambda = ((point2.lon - point1.lon) * Math.PI) / 180;

        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                  Math.cos(phi1) * Math.cos(phi2) *
                  Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Format distance
     * @param {number} meters - Distance in meters
     * @returns {string} Formatted distance
     */
    formatDistance(meters) {
        return meters >= 1000
            ? `${(meters / 1000).toFixed(1)} km`
            : `${Math.round(meters)} m`;
    }

    /**
     * Format duration
     * @param {number} minutes - Duration in minutes
     * @returns {string} Formatted duration
     */
    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours} h`;
        return `${hours} h ${mins} min`;
    }

    /**
     * Clear previous route visualization
     */
    clearPreviousRoute() {
        if (this.routeLayer) {
            this.routeLayer.clearLayers();
        }
        this.markers = [];
        this.currentRoute = null;

        const detailsContainer = document.getElementById('route-details');
        if (detailsContainer) {
            detailsContainer.innerHTML = '';
        }
    }

    /**
     * Handle route calculation errors
     * @param {Error} error - Error object
     */
    handleRouteCalculationError(error) {
        console.error('Route calculation error:', error);
        NotificationManager.show({
            type: 'error',
            message: error.message || 'Failed to calculate route'
        });
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Error object
     */
    handleInitializationError(error) {
        console.error('Directions service initialization error:', error);
        NotificationManager.show({
            type: 'error',
            message: 'Failed to initialize directions service'
        });
    }
}

// Create singleton instance
const directionsService = new DirectionsService();

// Make globally accessible
window.directions = directionsService;

export default directionsService;