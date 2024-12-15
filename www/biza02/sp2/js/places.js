const Places = {
  map: null,
  API_KEY: '5ae2e3f221c38a28845f05b6bb142d31dc50a82823a0d9578bdd5f4f',
  markers: [],

  initializePlaces() {
    this.map = L.map('map').setView([50.08, 14.42], 13); // Výchozí Praha
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    $('#places-form').on('submit', (e) => {
      e.preventDefault();
      const destination = $('#destination').val().trim();
      this.searchPlaces(destination);
    });
  },

  searchPlaces(destination) {
    const url = `https://api.opentripmap.com/0.1/en/places/geoname?apikey=${this.API_KEY}&name=${destination}`;
    axios.get(url)
      .then((response) => {
        const { lat, lon } = response.data;
        this.loadPlaces(lat, lon);
        this.map.setView([lat, lon], 13);
      })
      .catch(() => {
        Swal.fire('Chyba!', 'Nepodařilo se načíst lokaci.', 'error');
      });
  },

  loadPlaces(lat, lon) {
    const type = $('#filter-type').val(); // Typ filtrování
    const radius = 5000; // Poloměr 5 km
    const url = `https://api.opentripmap.com/0.1/en/places/radius?apikey=${this.API_KEY}&radius=${radius}&lon=${lon}&lat=${lat}&kinds=${type}`;

    axios.get(url)
      .then((response) => {
        const places = response.data.features;
        this.renderPlaces(places);
      })
      .catch(() => {
        Swal.fire('Chyba!', 'Nepodařilo se načíst seznam míst.', 'error');
      });
  },

  renderPlaces(places) {
    const list = $('#places-list');
    list.empty();
    this.clearMarkers();

    places.forEach((place) => {
      const name = place.properties.name || 'Neznámé místo';
      const description = place.properties.kinds || 'Bez popisu';
      const lat = place.geometry.coordinates[1];
      const lon = place.geometry.coordinates[0];
      const xid = place.properties.xid || null;

      const listItem = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>${name}</strong><br>
            <small>${description}</small>
          </div>
          <div>
            <button class="btn btn-sm btn-info detail-btn" data-xid="${xid}">Detail</button>
            <button class="btn btn-sm btn-success add-to-itinerary-btn" data-name="${name}" data-description="${description}">
              Přidat do itineráře
            </button>
          </div>
        </li>
      `;

      // Přidání markeru na mapu
      const marker = L.marker([lat, lon]).addTo(this.map).bindPopup(name);
      this.markers.push(marker);

      // Přidání do seznamu
      list.append(listItem);
    });

    // Nastavení událostí pro tlačítka
    this.setupEventHandlers();
  },

  setupEventHandlers() {
    // Detail tlačítko
    $('.detail-btn').on('click', function () {
      const xid = $(this).data('xid');
      if (xid) {
        Places.loadPlaceDetails(xid);
      } else {
        Swal.fire('Chyba!', 'Detaily nejsou dostupné.', 'error');
      }
    });

    // Přidat do itineráře tlačítko
    $('.add-to-itinerary-btn').on('click', function () {
      const name = $(this).data('name');
      const description = $(this).data('description');
      App.Itineraries.addPlace(name, description);
      Swal.fire('Úspěch!', 'Místo bylo přidáno do itineráře.', 'success');
    });
  },

  loadPlaceDetails(xid) {
    const url = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${this.API_KEY}`;
    axios.get(url)
      .then((response) => {
        const place = response.data;
        Swal.fire({
          title: place.name || 'Detail místa',
          html: `
            <p><strong>Popis:</strong> ${place.wikipedia_extracts?.text || 'Popis není dostupný.'}</p>
            <img src="${place.preview?.source || ''}" alt="Obrázek místa" style="max-width:100%; margin-top:10px;"/>
          `,
        });
      })
      .catch(() => {
        Swal.fire('Chyba!', 'Nepodařilo se načíst detaily místa.', 'error');
      });
  },

  clearMarkers() {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }
};
