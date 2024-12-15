const App = {
  users: [],
  currentUser: null,

  // Kontrola přihlášení uživatele
  checkAuth() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      $('#auth-section').hide();
      $('#map-section, #directions-section, #itineraries-section, #itinerary-details-section').show();
      this.renderUserMenu();
    } else {
      this.currentUser = null;
      $('#auth-section').show();
      $('#map-section, #directions-section, #itineraries-section, #itinerary-details-section').hide();
    }
  },

  // Vykreslení uživatelského menu
  renderUserMenu() {
    const userMenu = `
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="userMenuButton"
                data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person-circle"></i> ${this.currentUser?.email || 'Uživatel'}
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#" id="new-itinerary">Nový itinerář</a></li>
          <li><a class="dropdown-item" href="#" id="my-trips">Moje cesty</a></li>
          <li><a class="dropdown-item" href="#" id="settings">Nastavení</a></li>
          <li><a class="dropdown-item text-danger" href="#" id="logout">Odhlásit se</a></li>
        </ul>
      </div>
    `;
    $('#user-menu-container').html(userMenu);

    $('#logout').on('click', () => {
      localStorage.removeItem('currentUser');
      this.checkAuth();
    });

    $('#new-itinerary').on('click', () => {
      $('#map-section, #directions-section, #itineraries-section, #itinerary-details-section').hide();
      $('#itinerary-form').show();
    });

    $('#my-trips').on('click', () => {
      $('#map-section, #directions-section, #itinerary-form').hide();
      $('#itineraries-section, #itinerary-details-section').show();
      ItineraryDetails.renderDetails();
    });

    $('#settings').on('click', () => {
      Swal.fire('Nastavení', 'Zde můžete měnit nastavení uživatelského profilu.', 'info');
    });
  },

  Itineraries: {
    addItinerary() {
      const name = $('#itinerary-name').val().trim();
      const date = $('#itinerary-date').val();
      const destination = $('#itinerary-destination').val().trim();

      if (!name || !date || !destination) {
        Swal.fire('Chyba!', 'Vyplňte všechny údaje pro nový itinerář.', 'error');
        return;
      }

      const newItinerary = {
        name,
        date,
        destination,
        activities: []
      };

      if (!App.currentUser.itineraries) {
        App.currentUser.itineraries = [];
      }

      App.currentUser.itineraries.push(newItinerary);
      localStorage.setItem('currentUser', JSON.stringify(App.currentUser));

      Swal.fire('Úspěch!', `Itinerář "${name}" byl vytvořen.`, 'success');
      $('#itinerary-name, #itinerary-date, #itinerary-destination').val('');
      ItineraryDetails.renderDetails();
    },

    addActivity(name, time) {
      const currentItinerary = this.getCurrentItinerary();
      if (!currentItinerary) return;

      const activity = { type: 'activity', name, time };
      currentItinerary.activities.push(activity);
      this.saveItineraries();
    },

    addRoute(origin, destination, distance, duration) {
      const currentItinerary = this.getCurrentItinerary();
      if (!currentItinerary) return;

      const route = { type: 'route', origin, destination, distance, duration };
      currentItinerary.activities.push(route);
      this.saveItineraries();
    },

    addPlace(name, description) {
      const currentItinerary = this.getCurrentItinerary();
      if (!currentItinerary) return;

      const place = { type: 'place', name, description };
      currentItinerary.activities.push(place);
      this.saveItineraries();
    },

    getCurrentItinerary() {
      if (!App.currentUser.itineraries || App.currentUser.itineraries.length === 0) {
        Swal.fire('Chyba!', 'Žádný itinerář není aktuálně vytvořen.', 'error');
        return null;
      }
      return App.currentUser.itineraries[App.currentUser.itineraries.length - 1];
    },

    saveItineraries() {
      localStorage.setItem('currentUser', JSON.stringify(App.currentUser));
      ItineraryDetails.renderDetails();
    }
  },

  // Přidávání aktivit do itineráře
  initializeActivityForm() {
    $('#add-activity-form').on('submit', (e) => {
      e.preventDefault();
      const name = $('#activity-name').val();
      const time = $('#activity-time').val();
      App.Itineraries.addActivity(name, time);
      Swal.fire('Úspěch!', 'Aktivita byla přidána do itineráře.', 'success');
    });
  },

  initialize() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    this.checkAuth();
    Auth.initializeAuth();
    Places.initializePlaces();
    Directions.initializeDirections();
    ItineraryDetails.renderDetails();
  }
};

$(document).ready(() => {
  App.initialize();
});
