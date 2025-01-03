const Directions = {
  initializeDirections() {
    $('#directions-form').on('submit', (e) => {
      e.preventDefault();

      const origin = $('#origin').val().trim(); // Získání startu
      const destination = $('#destination-directions').val().trim(); // Získání cíle

      if (!origin || !destination) {
        Swal.fire('Chyba!', 'Vyplňte výchozí bod a cíl trasy.', 'error');
        return;
      }

      const apiKey = 'AIzaSyCS8gebxgM-srFi2R1eXNCrsuSjxY_pu74';
      const corsProxy = 'https://cors-anywhere.herokuapp.com/'; // Veřejná proxy pro CORS
      const url = `${corsProxy}https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;

      console.log("Testing Google API URL: ", url);

      axios.get(url)
        .then((response) => {
          const route = response.data.routes[0];
          this.displayRoute(route, origin, destination);
        })
        .catch((error) => {
          console.error("Chyba při načítání trasy:", error);
          Swal.fire('Chyba!', 'Došlo k problému při načítání trasy.', 'error');
        });
    });
  },

  displayRoute(route, origin, destination) {
    if (!route || !route.legs || route.legs.length === 0) {
      Swal.fire('Chyba!', 'Trasa nebyla nalezena.', 'error');
      return;
    }

    const leg = route.legs[0]; // První úsek trasy
    const distance = leg.distance.text; // Vzdálenost
    const duration = leg.duration.text; // Doba trvání

    // Vykreslení informací o trase
    Swal.fire({
      title: 'Trasa nalezena!',
      html: `
        <p><strong>Výchozí bod:</strong> ${origin}</p>
        <p><strong>Cíl:</strong> ${destination}</p>
        <p><strong>Vzdálenost:</strong> ${distance}</p>
        <p><strong>Čas:</strong> ${duration}</p>
        <button id="add-to-itinerary" class="btn btn-success mt-2">Přidat do itineráře</button>
      `,
      didOpen: () => {
        document.getElementById('add-to-itinerary').addEventListener('click', () => {
          App.Itineraries.addRouteToItinerary(origin, destination, distance, duration);
          Swal.fire('Úspěch!', 'Trasa byla přidána do itineráře.', 'success');
        });
      },
    });

    // Dekódování a vykreslení polyliny na mapě
    const polyline = L.polyline(this.decodePolyline(route.overview_polyline.points), { color: 'blue' }).addTo(Places.map);
    Places.map.fitBounds(polyline.getBounds());
  },

  decodePolyline(encoded) {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push([lat / 1e5, lng / 1e5]);
    }

    return points;
  },
};
