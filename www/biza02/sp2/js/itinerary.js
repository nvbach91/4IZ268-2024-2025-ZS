// itinerary.js
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
        this.elements = {
            newTripForm: null,
            cancelTripButton: null,
            newTripNameInput: null,
            newTripDestinationInput: null,
            newTripStartDateInput: null,
            newTripEndDateInput: null,
            newTripNotesInput: null
        };
    }

    async init() {
        try {
            this.trips = await API.getTrips();
        } catch (error) {
            console.error('Error initializing trips:', error);
        }
    }

    async createTripForm() {
        const container = document.createElement('div');
        container.className = 'container py-4';

        const form = document.createElement('form');
        form.id = 'newTripForm';
        form.className = 'card';

        form.innerHTML = `
            <div class="card-body">
                <h3 class="card-title mb-4">Create New Trip</h3>
                <div class="form-group mb-3">
                    <label for="tripName">Trip Name</label>
                    <input type="text" class="form-control" id="tripName" required>
                </div>
                <div class="form-group mb-3">
                    <label for="destination">Destination</label>
                    <input type="text" class="form-control" id="destination" required>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="startDate">Start Date</label>
                        <input type="date" class="form-control" id="startDate" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="endDate">End Date</label>
                        <input type="date" class="form-control" id="endDate" required>
                    </div>
                </div>
                <div class="form-group mb-3">
                    <label for="tripNotes">Notes (Optional)</label>
                    <textarea class="form-control" id="tripNotes" rows="3"></textarea>
                </div>
                <div class="d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" id="cancelTrip">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Trip</button>
                </div>
            </div>
        `;

        container.appendChild(form);

        setTimeout(() => {
            this.elements = {
                newTripForm: form,
                cancelTripButton: document.getElementById('cancelTrip'),
                newTripNameInput: document.getElementById('tripName'),
                newTripDestinationInput: document.getElementById('destination'),
                newTripStartDateInput: document.getElementById('startDate'),
                newTripEndDateInput: document.getElementById('endDate'),
                newTripNotesInput: document.getElementById('tripNotes')
            };
            this.bindNewTripFormEvents();
        }, 0);

        return container;
    }

    bindNewTripFormEvents() {
        this.elements.newTripForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleNewTripSubmit();
        });

        this.elements.cancelTripButton.addEventListener('click', () => {
            window.location.hash = '#trips';
        });
    }

    async handleNewTripSubmit() {
        try {
            const newTrip = {
                name: this.elements.newTripNameInput.value,
                destination: this.elements.newTripDestinationInput.value,
                startDate: this.elements.newTripStartDateInput.value,
                endDate: this.elements.newTripEndDateInput.value,
                notes: this.elements.newTripNotesInput.value
            };

            await API.createTrip(newTrip);
            window.location.hash = '#trips';
            Notifications.showAlert('Trip created successfully!', 'success');
        } catch (error) {
            console.error('Error creating trip:', error);
            Notifications.showAlert('Failed to create trip', 'error');
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
            buttonGroup.className = 'btn-group gap-2';

            // Share button
            const shareBtn = document.createElement('button');
            shareBtn.className = 'btn btn-outline-success trip-action-btn';
            shareBtn.dataset.action = 'share';
            shareBtn.dataset.tripId = tripId;
            shareBtn.textContent = '🔗 Share';

            // Export button
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn btn-outline-info trip-action-btn';
            exportBtn.dataset.action = 'export';
            exportBtn.dataset.tripId = tripId;
            exportBtn.textContent = '📄 Export PDF';

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-outline-danger trip-action-btn';
            deleteBtn.dataset.action = 'delete';
            deleteBtn.dataset.tripId = tripId;
            deleteBtn.textContent = '🗑️ Delete Trip';

            // Back button
            const backBtn = document.createElement('a');
            backBtn.href = '#trips';
            backBtn.className = 'btn btn-outline-secondary';
            backBtn.textContent = 'Back to Trips';

            buttonGroup.append(shareBtn, exportBtn, deleteBtn, backBtn);
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
                    case 'delete':
                        await this.handleDeleteAction(tripId);
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

    async handleDeleteAction(tripId) {
        try {
            const result = await Notifications.showConfirmation(
                'Delete Trip',
                'Are you sure you want to delete this trip? This action cannot be undone.'
            );

            if (result.isConfirmed) {
                Utils.showLoading();
                await API.deleteTrip(tripId);
                window.location.hash = '#trips';
                Notifications.showAlert('Trip deleted successfully!', 'success');
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
            Notifications.showAlert('Failed to delete trip', 'error');
        } finally {
            Utils.hideLoading();
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