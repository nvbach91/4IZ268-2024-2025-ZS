// map.js
import Notifications from './notifications.js';
import Utils from './utils.js';

class TravelMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.routes = [];
        this.googleClient = null;
        this.routeDetailsContainer = null;
    }

    async init(containerId = 'map', lat = 48.8566, lon = 2.3522, zoom = 12) {
        const mapContainer = document.getElementById(containerId);
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        try {
            mapContainer.classList.add('map-container');

            if (!this.map) {
                this.map = L.map(containerId).setView([lat, lon], zoom);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19
                }).addTo(this.map);

                // Initialize Google Maps client
                this.googleClient = new google.maps.DirectionsService();

                // Add event listener for map clicks
                this.map.on('click', (e) => this.handleMapClick(e));
            } else {
                this.map.setView([lat, lon], zoom);
            }

            // Create route details container
            this.routeDetailsContainer = this.createRouteDetailsContainer();
            this.map.getContainer().appendChild(this.routeDetailsContainer);

            return this.map;
        } catch (error) {
            console.error('Error initializing map:', error);
            Notifications.showAlert('Failed to initialize map', 'error');
        }
    }

    clearMap() {
        if (this.map) {
            this.markers.forEach(marker => this.map.removeLayer(marker));
            this.markers = [];
            this.routes.forEach(route => this.map.removeLayer(route));
            this.routes = [];
        }
    }

    addMarker(lat, lon, title, popupContent = '') {
        try {
            if (!this.map) {
                throw new Error('Map not initialized');
            }

            const marker = L.marker([lat, lon]);
            
            if (popupContent) {
                const popup = L.popup().setContent(this.createPopupContent(title, popupContent));
                marker.bindPopup(popup);
            } else {
                marker.bindPopup(title);
            }
            
            marker.addTo(this.map);
            this.markers.push(marker);
            return marker;
        } catch (error) {
            console.error('Error adding marker:', error);
            Notifications.showAlert('Failed to add marker', 'error');
        }
    }

    createPopupContent(title, content) {
        const container = document.createElement('div');
        container.className = 'map-popup';
        
        const header = document.createElement('h6');
        header.className = 'popup-title';
        header.textContent = title;
        
        const body = document.createElement('div');
        body.className = 'popup-content';
        body.innerHTML = content;
        
        container.appendChild(header);
        container.appendChild(body);
        return container;
    }

    async showRoute(start, end) {
        try {
            if (!this.map || !this.googleClient) throw new Error('Map or Google client not initialized');

            const { path, distance, duration } = await this.getRoutePath(start, end);
            if (!path) throw new Error('Could not calculate route');

            const route = L.polyline(path, {
                color: 'blue',
                weight: 3,
                opacity: 0.7
            }).addTo(this.map);

            this.routes.push(route);
            this.map.fitBounds(route.getBounds());

            this.updateRouteDetails(distance, duration);

            return route;
        } catch (error) {
            console.error('Error showing route:', error);
            Notifications.showAlert('Failed to show route', 'error');
        }
    }

    async getRoutePath(start, end) {
        try {
            const request = {
                origin: { lat: start.lat, lng: start.lon },
                destination: { lat: end.lat, lng: end.lon },
                travelMode: google.maps.TravelMode.DRIVING
            };

            const response = await new Promise((resolve, reject) => {
                this.googleClient.route(request, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        resolve(result);
                    } else {
                        reject(new Error(`Google Maps Directions API error: ${status}`));
                    }
                });
            });

            if (response?.routes?.[0]?.overview_path) {
                const path = response.routes[0].overview_path.map(({ lat, lng }) => [lat(), lng()]);
                const distance = response.routes[0].legs[0].distance.text;
                const duration = response.routes[0].legs[0].duration.text;
                return { path, distance, duration };
            } else {
                return { path: null, distance: null, duration: null };
            }
        } catch (error) {
            console.error('Error getting route path:', error);
            return { path: null, distance: null, duration: null };
        }
    }

    createRouteDetailsContainer() {
        const container = document.createElement('div');
        container.className = 'route-details';

        this.distanceElement = document.createElement('p');
        this.durationElement = document.createElement('p');

        container.appendChild(this.distanceElement);
        container.appendChild(this.durationElement);

        return container;
    }

    updateRouteDetails(distance, duration) {
        this.distanceElement.textContent = `Distance: ${distance}`;
        this.durationElement.textContent = `Duration: ${duration}`;
    }

    centerOn(lat, lon, zoom = 13) {
        if (this.map) {
            this.map.setView([lat, lon], zoom);
        }
    }

    fitMarkers() {
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds());
        }
    }

    handleMapClick(e) {
        const { lat, lng } = e.latlng;
        this.addMarker(lat, lng, 'Selected Location');
    }
}

export default new TravelMap();