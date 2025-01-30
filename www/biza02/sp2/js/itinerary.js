import API from './api.js';
import Notifications from './notifications.js';
import Utils from './utils.js';
import TravelMap from './map.js';
import Weather from './weather.js';
import Sharing from './sharing.js';

class Itinerary {
    constructor() {
        this.trips = [];
        this.currentTrip = null;
    }

    async init() {
        try {
            this.trips = await API.getTrips();
        } catch (error) {
            console.error('Error initializing trips:', error);
        }
    }

    async renderTripsList() {
        try {
            const trips = await API.getTrips();
            const container = document.createElement('div');
            container.className = 'container py-4';
    
            const header = document.createElement('div');
            header.className = 'd-flex justify-content-between align-items-center mb-4';
    
            const title = document.createElement('h2');
            title.textContent = 'Your Trips';
    
            const newTripBtn = document.createElement('button');
            newTripBtn.className = 'btn btn-primary';
            newTripBtn.id = 'newTripButton';
            newTripBtn.textContent = '✈️ Create New Trip';
    
            header.append(title, newTripBtn);
            container.appendChild(header);
    
            if (!trips || trips.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'alert alert-info';
                emptyState.textContent = "You haven't created any trips yet. Start planning your next adventure!";
                container.appendChild(emptyState);
            } else {
                const tripsGrid = document.createElement('div');
                tripsGrid.className = 'row';
                trips.forEach(trip => {
                    tripsGrid.appendChild(this.createTripCard(trip));
                });
                container.appendChild(tripsGrid);
            }
    
            // Bind events after adding to DOM
            setTimeout(() => this.bindEvents(), 0);
            return container;
        } catch (error) {
            console.error('Error rendering trips:', error);
            return this.renderError('Failed to load trips');
        }
    }

    createTripCard(trip) {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        const card = document.createElement('div');
        card.className = 'card h-100';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = trip.name;

        const info = document.createElement('p');
        info.className = 'card-text';

        const locationText = document.createTextNode(`📍 ${trip.destination}`);
        const dateText = document.createTextNode(`📅 ${Utils.formatDate(trip.startDate)} - ${Utils.formatDate(trip.endDate)}`);

        info.append(locationText, document.createElement('br'), dateText);
        
        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'd-flex flex-column gap-2 mt-3';

        // View button
        const viewButton = document.createElement('button');
        viewButton.className = 'btn btn-outline-primary trip-action-btn';
        viewButton.dataset.action = 'view';
        viewButton.dataset.tripId = trip.id;
        viewButton.textContent = '👁️ View Trip';

        // Share button
        const shareButton = document.createElement('button');
        shareButton.className = 'btn btn-outline-success trip-action-btn';
        shareButton.dataset.action = 'share';
        shareButton.dataset.tripId = trip.id;
        shareButton.textContent = '🔗 Share Trip';

        // Export PDF button
        const exportButton = document.createElement('button');
        exportButton.className = 'btn btn-outline-info trip-action-btn';
        exportButton.dataset.action = 'export';
        exportButton.dataset.tripId = trip.id;
        exportButton.textContent = '📄 Export PDF';

        // Add all elements to card
        buttonsContainer.append(viewButton, shareButton, exportButton);
        cardBody.append(title, info, buttonsContainer);
        card.appendChild(cardBody);
        col.appendChild(card);

        return col;
    }

    async renderTripDetails(tripId) {
        try {
            const trip = await API.getTrip(tripId);
            if (!trip) throw new Error('Trip not found');

            const container = document.createElement('div');
            container.className = 'container py-4';

            // Header section
            const header = document.createElement('div');
            header.className = 'd-flex justify-content-between align-items-center mb-4';

            const title = document.createElement('h2');
            title.textContent = trip.name;

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'btn-group';

            const shareBtn = document.createElement('button');
            shareBtn.className = 'btn btn-outline-success trip-action-btn';
            shareBtn.dataset.action = 'share';
            shareBtn.dataset.tripId = tripId;
            shareBtn.textContent = '🔗 Share';

            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn btn-outline-info trip-action-btn';
            exportBtn.dataset.action = 'export';
            exportBtn.dataset.tripId = tripId;
            exportBtn.textContent = '📄 Export PDF';

            const backBtn = document.createElement('a');
            backBtn.href = '#trips';
            backBtn.className = 'btn btn-outline-secondary';
            backBtn.textContent = 'Back to Trips';

            buttonGroup.append(shareBtn, exportBtn, backBtn);
            header.append(title, buttonGroup);

            // Trip details card
            const detailsCard = this.createTripDetailsCard(trip);
            
            // Places and Schedule section
            const contentRow = document.createElement('div');
            contentRow.className = 'row';
            
            const placesCol = document.createElement('div');
            placesCol.className = 'col-md-6';
            placesCol.appendChild(this.createPlacesCard(trip.places || []));

            const scheduleCol = document.createElement('div');
            scheduleCol.className = 'col-md-6';
            scheduleCol.appendChild(this.createScheduleCard(trip.schedule || []));

            contentRow.append(placesCol, scheduleCol);

            // Assemble everything
            container.append(header, detailsCard, contentRow);

            // Bind events after adding to DOM
            setTimeout(() => this.bindEvents(), 0);
            return container;

        } catch (error) {
            console.error('Error rendering trip details:', error);
            return this.renderError('Failed to load trip details');
        }
    }

    createTripDetailsCard(trip) {
        const card = document.createElement('div');
        card.className = 'card mb-4';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = 'Trip Details';

        const destination = document.createElement('p');
        destination.innerHTML = `<strong>Destination:</strong> ${trip.destination}`;

        const dates = document.createElement('p');
        dates.innerHTML = `<strong>Dates:</strong> ${Utils.formatDate(trip.startDate)} - ${Utils.formatDate(trip.endDate)}`;

        cardBody.append(title, destination, dates);

        if (trip.notes) {
            const notes = document.createElement('p');
            notes.innerHTML = `<strong>Notes:</strong> ${trip.notes}`;
            cardBody.appendChild(notes);
        }

        card.appendChild(cardBody);
        return card;
    }

    createPlacesCard(places) {
        const card = document.createElement('div');
        card.className = 'card mb-4';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = 'Places to Visit';

        const placesList = document.createElement('div');
        placesList.className = 'list-group';

        if (places.length === 0) {
            const emptyState = document.createElement('p');
            emptyState.className = 'text-muted';
            emptyState.textContent = 'No places added yet';
            cardBody.append(title, emptyState);
        } else {
            places.forEach(place => {
                const item = document.createElement('div');
                item.className = 'list-group-item';

                const placeName = document.createElement('h6');
                placeName.className = 'mb-1';
                placeName.textContent = place.name;

                const placeType = document.createElement('p');
                placeType.className = 'mb-1';
                placeType.innerHTML = `<small>${place.kinds?.replace(/_/g, ' ') || ''}</small>`;

                item.append(placeName, placeType);
                placesList.appendChild(item);
            });
            cardBody.append(title, placesList);
        }

        card.appendChild(cardBody);
        return card;
    }

    createScheduleCard(schedule) {
        const card = document.createElement('div');
        card.className = 'card mb-4';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = 'Schedule';

        if (schedule.length === 0) {
            const emptyState = document.createElement('p');
            emptyState.className = 'text-muted';
            emptyState.textContent = 'No activities scheduled yet';
            cardBody.append(title, emptyState);
        } else {
            const scheduleList = document.createElement('div');
            scheduleList.className = 'list-group';

            schedule.forEach(item => {
                const scheduleItem = document.createElement('div');
                scheduleItem.className = 'list-group-item';

                const header = document.createElement('div');
                header.className = 'd-flex justify-content-between';

                const activity = document.createElement('h6');
                activity.className = 'mb-1';
                activity.textContent = item.activity;

                const time = document.createElement('small');
                time.textContent = `${item.startTime} - ${item.endTime}`;

                header.append(activity, time);
                scheduleItem.appendChild(header);

                if (item.notes) {
                    const notes = document.createElement('p');
                    notes.className = 'mb-1';
                    notes.innerHTML = `<small>${item.notes}</small>`;
                    scheduleItem.appendChild(notes);
                }

                scheduleList.appendChild(scheduleItem);
            });

            cardBody.append(title, scheduleList);
        }

        card.appendChild(cardBody);
        return card;
    }

    bindEvents() {
        // New trip button
        const newTripBtn = document.getElementById('newTripButton');
        if (newTripBtn) {
            newTripBtn.addEventListener('click', () => {
                window.location.hash = 'trips/new';
            });
        }

        // Trip action buttons
        document.querySelectorAll('.trip-action-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const action = e.target.dataset.action;
                const tripId = e.target.dataset.tripId;

                if (!tripId) return;

                switch (action) {
                    case 'view':
                        window.location.hash = `trips/${tripId}`;
                        break;
                    case 'share':
                        await this.handleShareAction(tripId);
                        break;
                    case 'export':
                        await this.handleExportAction(tripId);
                        break;
                }
            });
        });
    }

    async handleShareAction(tripId) {
        try {
            await Sharing.shareTrip(tripId);
        } catch (error) {
            console.error('Error sharing trip:', error);
            Notifications.showAlert('Failed to share trip', 'error');
        }
    }

    async handleExportAction(tripId) {
        try {
            await Sharing.exportToPDF(tripId);
        } catch (error) {
            console.error('Error exporting trip:', error);
            Notifications.showAlert('Failed to export trip', 'error');
        }
    }

    renderError(message) {
        const container = document.createElement('div');
        container.className = 'container py-4';
        
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.setAttribute('role', 'alert');
        alert.textContent = message;
        
        const backButton = document.createElement('a');
        backButton.href = '#trips';
        backButton.className = 'btn btn-primary';
        backButton.textContent = 'Back to Trips';
        
        container.append(alert, backButton);
        return container;
    }
}

export default new Itinerary();