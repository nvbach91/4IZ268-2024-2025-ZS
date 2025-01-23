const Itinerary = {
    itineraries: JSON.parse(localStorage.getItem('itineraries')) || [],

    initialize() {
        this.renderItineraries();
        this.addEventListeners();
    },

    createItinerary(title, date, destination) {
        const newItinerary = {
            id: Date.now(),
            title,
            date,
            destination,
            activities: []
        };
        this.itineraries.push(newItinerary);
        localStorage.setItem('itineraries', JSON.stringify(this.itineraries));
        alert('Itinerary created!');
        this.renderItineraries();
    },

    addActivity(itineraryId, activity) {
        const itinerary = this.itineraries.find(it => it.id === itineraryId);
        if (itinerary) {
            itinerary.activities.push(activity);
            localStorage.setItem('itineraries', JSON.stringify(this.itineraries));
            alert('Activity added!');
            this.renderItineraries();
        }
    },

    deleteItinerary(itineraryId) {
        this.itineraries = this.itineraries.filter(it => it.id !== itineraryId);
        localStorage.setItem('itineraries', JSON.stringify(this.itineraries));
        alert('Itinerary deleted!');
        this.renderItineraries();
    },

    exportToPDF(itineraryId) {
        const itinerary = this.itineraries.find(it => it.id === itineraryId);
        if (!itinerary) return;
        const docDefinition = {
            content: [
                { text: itinerary.title, style: 'header' },
                { text: `Date: ${itinerary.date}`, style: 'subheader' },
                { text: `Destination: ${itinerary.destination}`, style: 'subheader' },
                { text: 'Activities:', style: 'subheader' },
                ...itinerary.activities.map(act => `- ${act.time}: ${act.description}`)
            ]
        };
        pdfMake.createPdf(docDefinition).download(`${itinerary.title}.pdf`);
    },

    renderItineraries() {
        const container = document.getElementById('itineraries-list');
        container.innerHTML = '';
        this.itineraries.forEach(itinerary => {
            const div = document.createElement('div');
            div.className = 'itinerary-item';
            div.innerHTML = `
                <h3>${itinerary.title}</h3>
                <p>${itinerary.date} - ${itinerary.destination}</p>
                <button onclick="Itinerary.exportToPDF(${itinerary.id})">Export to PDF</button>
                <button onclick="Itinerary.deleteItinerary(${itinerary.id})">Delete</button>
            `;
            container.appendChild(div);
        });
    },

    addEventListeners() {
        document.getElementById('itinerary-form').addEventListener('submit', e => {
            e.preventDefault();
            const title = document.getElementById('itinerary-title').value;
            const date = document.getElementById('itinerary-date').value;
            const destination = document.getElementById('itinerary-destination').value;
            this.createItinerary(title, date, destination);
        });
    }
};

Itinerary.initialize();
