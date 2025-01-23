// itinerary-details.js
import CONFIG from './config.js';
import StorageManager from './storage.js';
import NotificationManager from './notifications.js';
import auth from './auth.js';
import Utils from './utils.js';

class ItineraryDetails {
    constructor() {
        this.itineraries = [];
        this.currentItinerary = null;
        this.map = null;
        this.routeLayer = null;
    }

    async initialize() {
        try {
            await this.loadItineraries();
            
            // Create a default itinerary if none exists
            if (this.itineraries.length === 0) {
                await this.createDefaultItinerary();
            }
            
            this.renderItineraryList();
            this.setupEventListeners();
        } catch (error) {
            NotificationManager.show({ 
                type: 'error', 
                message: 'Failed to load itineraries.' 
            });
            console.error('Error initializing itineraries:', error);
        }
    }

    async createDefaultItinerary() {
        const newItinerary = {
            id: Utils.generateId(),
            name: 'My First Trip',
            destination: 'Explore',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
            activities: []
        };

        const user = StorageManager.getData(CONFIG.STORAGE.KEYS.USER) || {};
        user.itineraries = user.itineraries || [];
        user.itineraries.push(newItinerary);
        
        StorageManager.saveData(CONFIG.STORAGE.KEYS.USER, user);
        this.itineraries.push(newItinerary);
    }

    setupEventListeners() {
        // Listen for global events to add items to itinerary
        document.addEventListener('addToItinerary', (event) => {
            console.log('Add to Itinerary event received:', event.detail);
            this.showAddToItineraryModal(event.detail);
        });
    }

    showAddToItineraryModal(itemDetails) {
        // Prepare itinerary selection HTML
        const itineraryOptions = this.itineraries.map(itinerary => 
            `<option value="${itinerary.id}">${itinerary.name} (${itinerary.destination})</option>`
        ).join('');

        Swal.fire({
            title: 'Add to Itinerary',
            html: `
                <div class="mb-3">
                    <label class="form-label">Select Itinerary</label>
                    <select id="itinerary-select" class="form-select">
                        <option value="">Choose an Itinerary</option>
                        ${itineraryOptions}
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input type="date" id="item-date" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Notes (Optional)</label>
                    <textarea id="item-notes" class="form-control" rows="3"></textarea>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Add to Itinerary',
            preConfirm: () => {
                const itineraryId = document.getElementById('itinerary-select').value;
                const date = document.getElementById('item-date').value;
                const notes = document.getElementById('item-notes').value;

                if (!itineraryId) {
                    Swal.showValidationMessage('Please select an itinerary');
                    return false;
                }

                return {
                    itineraryId,
                    date,
                    notes,
                    item: itemDetails
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.addItemToItinerary(result.value);
            }
        });
    }

    addItemToItinerary(addDetails) {
        const { itineraryId, date, notes, item } = addDetails;

        // Find the specific itinerary
        const itinerary = this.itineraries.find(itin => itin.id === itineraryId);
        if (!itinerary) {
            NotificationManager.show({
                type: 'error',
                message: 'Itinerary not found'
            });
            return;
        }

        // Prepare the new activity item
        const newActivity = {
            id: Utils.generateId(),
            type: item.type || (item.lat ? 'place' : 'route'),
            name: this.generateActivityName(item),
            details: item,
            date: date,
            notes: notes || ''
        };

        // Ensure activities array exists
        itinerary.activities = itinerary.activities || [];
        itinerary.activities.push(newActivity);

        // Update user data in storage
        this.saveItineraries();

        // Show success notification
        NotificationManager.show({
            type: 'success',
            message: `Added to ${itinerary.name} Itinerary`
        });

        console.log('Activity added:', newActivity);
    }

    generateActivityName(item) {
        if (item.name) return item.name;
        
        if (item.type === 'route') {
            return `Route: ${item.origin} to ${item.destination}`;
        }
        
        if (item.lat) {
            return `Location at (${item.lat}, ${item.lon})`;
        }
        
        return 'Unnamed Activity';
    }

    saveItineraries() {
        const user = StorageManager.getData(CONFIG.STORAGE.KEYS.USER);
        if (user) {
            user.itineraries = this.itineraries;
            StorageManager.saveData(CONFIG.STORAGE.KEYS.USER, user);
        }
    }

    loadItineraries() {
        const user = StorageManager.getData(CONFIG.STORAGE.KEYS.USER);
        if (user && user.itineraries) {
            this.itineraries = user.itineraries;
        } else {
            this.itineraries = [];
        }
    }

    renderItineraryList() {
        const container = document.getElementById('main-content');
        if (!container) {
            console.error('Main content container not found.');
            return;
        }

        container.innerHTML = `
            <div class="container py-4">
                <h2>My Itineraries</h2>
                <div id="itineraries-grid" class="row">
                    ${this.itineraries.map(itinerary => `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${itinerary.name}</h5>
                                    <p class="card-text">
                                        <strong>Destination:</strong> ${itinerary.destination}<br>
                                        <strong>Dates:</strong> ${itinerary.startDate} - ${itinerary.endDate}
                                    </p>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-primary view-itinerary-btn" data-id="${itinerary.id}">
                                            View Details
                                        </button>
                                        <span class="badge bg-info">
                                            ${(itinerary.activities || []).length} Activities
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('') || '<p class="text-center w-100">No itineraries yet. Create one!</p>'}
                </div>
                <div class="text-center mt-4">
                    <button class="btn btn-primary" id="create-itinerary-btn">
                        Create New Itinerary
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        document.querySelectorAll('.view-itinerary-btn').forEach(button => {
            button.addEventListener('click', event => {
                const itineraryId = event.target.getAttribute('data-id');
                this.loadItineraryDetails(itineraryId);
            });
        });

        const createItineraryBtn = document.getElementById('create-itinerary-btn');
        if (createItineraryBtn) {
            createItineraryBtn.addEventListener('click', () => this.createNewItinerary());
        }
    }

    async createNewItinerary() {
        try {
            const { value: formData } = await Swal.fire({
                title: 'Create New Itinerary',
                html: `
                    <div class="mb-3">
                        <label class="form-label">Itinerary Name</label>
                        <input id="itinerary-name" class="swal2-input" placeholder="Enter itinerary name">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Destination</label>
                        <input id="itinerary-destination" class="swal2-input" placeholder="Enter destination">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Start Date</label>
                        <input id="itinerary-start-date" type="date" class="swal2-input">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">End Date</label>
                        <input id="itinerary-end-date" type="date" class="swal2-input">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Details</label>
                        <textarea id="itinerary-details" class="swal2-textarea" 
                            placeholder="Enter itinerary details, notes, or plans"></textarea>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Create',
                preConfirm: () => {
                    const name = document.getElementById('itinerary-name').value;
                    const destination = document.getElementById('itinerary-destination').value;
                    const startDate = document.getElementById('itinerary-start-date').value;
                    const endDate = document.getElementById('itinerary-end-date').value;
                    const details = document.getElementById('itinerary-details').value;
    
                    if (!name || !destination || !startDate || !endDate) {
                        Swal.showValidationMessage('Please fill all required fields');
                        return false;
                    }
    
                    return { name, destination, startDate, endDate, details };
                }
            });
    
            if (formData) {
                const newItinerary = {
                    id: Utils.generateId(),
                    ...formData,
                    activities: [],
                    places: [],
                    routes: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
    
                this.itineraries.push(newItinerary);
                this.saveItineraries();
                
                // Refresh the display
                this.renderItineraryList();
    
                NotificationManager.show({
                    type: 'success',
                    message: 'Itinerary created successfully'
                });
            }
        } catch (error) {
            console.error('Error creating itinerary:', error);
            NotificationManager.show({
                type: 'error',
                message: 'Failed to create itinerary'
            });
        }
    }
    
    loadItineraryDetails(itineraryId) {
        this.currentItinerary = this.itineraries.find(itinerary => itinerary.id === itineraryId);
    
        if (!this.currentItinerary) {
            NotificationManager.show({ 
                type: 'error', 
                message: 'Itinerary not found.' 
            });
            return;
        }
    
        const container = document.getElementById('main-content');
        container.innerHTML = `
            <div class="container py-4">
                <div class="row">
                    <div class="col-md-4">
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">${this.currentItinerary.name}</h5>
                                <p><strong>Destination:</strong> ${this.currentItinerary.destination}</p>
                                <p><strong>Dates:</strong> ${this.currentItinerary.startDate} - ${this.currentItinerary.endDate}</p>
                                <p><strong>Details:</strong></p>
                                <p class="text-muted">${this.currentItinerary.details || 'No details added yet'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div id="itinerary-activities">
                            ${this.renderActivities()}
                        </div>
                    </div>
                </div>
                <div class="text-center mt-3">
                    <button class="btn btn-secondary" onclick="itineraryDetails.renderItineraryList()">
                        Back to Itineraries
                    </button>
                </div>
            </div>
        `;
    }
    
    async editItineraryDetails(itineraryId) {
        const itinerary = this.itineraries.find(i => i.id === itineraryId);
        if (!itinerary) return;
    
        const { value: formData } = await Swal.fire({
            title: 'Edit Itinerary Details',
            html: `
                <div class="mb-3">
                    <label class="form-label">Details</label>
                    <textarea id="edit-itinerary-details" class="swal2-textarea" 
                        placeholder="Enter itinerary details, notes, or plans">${itinerary.details || ''}</textarea>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save',
            preConfirm: () => {
                return {
                    details: document.getElementById('edit-itinerary-details').value
                };
            }
        });
    
        if (formData) {
            itinerary.details = formData.details;
            itinerary.updatedAt = new Date().toISOString();
            
            this.saveItineraries();
            this.loadItineraryDetails(itineraryId);
    
            NotificationManager.show({
                type: 'success',
                message: 'Itinerary details updated successfully'
            });
        }
    }

    renderActivities() {
        if (!this.currentItinerary?.activities?.length) {
            return '<div class="alert alert-info">No activities added yet</div>';
        }
    
        return `
            <div class="list-group">
                ${this.currentItinerary.activities.map(activity => `
                    <div class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1">${activity.name}</h6>
                                <p class="mb-1 text-muted">${activity.date}</p>
                                ${activity.notes ? `<small>${activity.notes}</small>` : ''}
                            </div>
                            <span class="badge bg-primary">${activity.type}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getActivityBadgeColor(type) {
        const colors = {
            'place': 'bg-primary',
            'route': 'bg-success',
            'default': 'bg-secondary'
        };
        return colors[type] || colors['default'];
    }
}

const itineraryDetails = new ItineraryDetails();
export default itineraryDetails;