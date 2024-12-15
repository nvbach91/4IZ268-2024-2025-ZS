const ItineraryDetails = {
  renderDetails() {
    const detailsContainer = $('#itinerary-details');
    detailsContainer.empty();

    const currentUser = App.currentUser || {};
    const itineraries = currentUser.itineraries || [];

    if (itineraries.length === 0) {
      detailsContainer.html('<p>Žádné itineráře nebyly vytvořeny.</p>');
      return;
    }

    itineraries.forEach((itinerary, index) => {
      const itineraryElement = `
        <div class="itinerary-item">
          <h5>${itinerary.name} (${itinerary.date} - ${itinerary.destination})</h5>
          <ul>
            ${itinerary.activities.map(activity => `
              <li>${activity.type === 'activity' ? `🗓️ ${activity.name} v ${activity.time}` : ''}
                  ${activity.type === 'route' ? `🛣️ Z ${activity.origin} do ${activity.destination} (${activity.distance}, ${activity.duration})` : ''}
                  ${activity.type === 'place' ? `📍 ${activity.name} – ${activity.description}` : ''}
              </li>
            `).join('')}
          </ul>
          <button class="btn btn-sm btn-danger" onclick="ItineraryDetails.deleteItinerary(${index})">Smazat</button>
        </div>
      `;
      detailsContainer.append(itineraryElement);
    });
  },

  deleteItinerary(index) {
    const currentUser = App.currentUser;
    currentUser.itineraries.splice(index, 1);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.renderDetails();
  }
};
