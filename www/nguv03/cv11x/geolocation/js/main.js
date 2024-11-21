if ('geolocation' in navigator) {
    const mapContainer = $('#map');
    const coordinatesContainer = $('#coordinates');
    navigator.geolocation.getCurrentPosition((position) => {
        mapContainer.geomap({
            center: [
                position.coords.longitude,
                position.coords.latitude,
            ],
            zoom: 15
        });
        coordinatesContainer.text(`lon: ${position.coords.longitude}, lat: ${position.coords.latitude}`);
    });
} else {
    console.log('Geolocation is not available');
}