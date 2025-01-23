const MapManager = {
    map: null,

    initializeMap(lat = 50.08, lon = 14.42) {
        this.map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);
    },

    addMarker(lat, lon, label = 'Marker') {
        const marker = L.marker([lat, lon]);
        marker.bindPopup(label);
        marker.addTo(this.map);
    },

    drawRoute(routeCoordinates) {
        L.polyline(routeCoordinates, { color: 'blue' }).addTo(this.map);
    }
};

// Initialize map on page load
document.addEventListener('DOMContentLoaded', () => {
    MapManager.initializeMap();
});
