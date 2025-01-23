// statistics.js
import CONFIG from './config.js';
import StorageManager from './storage.js';
import auth from './auth.js';
import NotificationManager from './notifications.js';

class StatisticsService {
    constructor() {
        this.itineraries = [];
        this.statisticsContainer = null;
    }

    async initialize() {
        try {
            this.loadItineraries();
            this.findStatisticsContainer();
            this.renderDashboard();
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    findStatisticsContainer() {
        this.statisticsContainer = document.getElementById('statistics-container');
    }

    loadItineraries() {
        const currentUser = auth.getCurrentUser();
        this.itineraries = currentUser?.itineraries || [];
    }

    generateOverallStatistics() {
        const stats = {
            totalTrips: this.itineraries.length,
            totalDistance: 0,
            totalTravelTime: 0,
            destinationFrequency: {}
        };

        this.itineraries.forEach(itinerary => {
            // Track destination frequency
            stats.destinationFrequency[itinerary.destination] = 
                (stats.destinationFrequency[itinerary.destination] || 0) + 1;

            // Analyze activities
            itinerary.activities?.forEach(activity => {
                if (activity.type === 'route') {
                    const distance = this.parseDistance(activity.distance);
                    const duration = this.parseDuration(activity.duration);

                    stats.totalDistance += distance;
                    stats.totalTravelTime += duration;
                }
            });
        });

        // Format total distance and travel time
        stats.totalDistance = this.formatDistance(stats.totalDistance);
        stats.totalTravelTime = this.formatDuration(stats.totalTravelTime);

        return stats;
    }

    renderDashboard() {
        if (!this.statisticsContainer) return;

        const stats = this.generateOverallStatistics();

        this.statisticsContainer.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Total Trips</h5>
                            <div class="d-flex justify-content-between align-items-center">
                                <i class="bi bi-journal-text fs-2 text-primary"></i>
                                <h3 class="mb-0">${stats.totalTrips}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Total Distance</h5>
                            <div class="d-flex justify-content-between align-items-center">
                                <i class="bi bi-signpost-2 fs-2 text-success"></i>
                                <h3 class="mb-0">${stats.totalDistance}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Total Travel Time</h5>
                            <div class="d-flex justify-content-between align-items-center">
                                <i class="bi bi-clock fs-2 text-warning"></i>
                                <h3 class="mb-0">${stats.totalTravelTime}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Destinations Visited</h5>
                            <canvas id="destinations-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Export Statistics</h5>
                            <button class="btn btn-primary" onclick="statisticsService.exportStatisticsPDF()">
                                <i class="bi bi-file-earmark-pdf me-2"></i>Export as PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render only destinations chart
        this.renderDestinationsChart(stats.destinationFrequency);
    }

    renderDestinationsChart(destinationFrequency) {
        if (!window.Chart) return;

        const ctx = document.getElementById('destinations-chart');
        new window.Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(destinationFrequency),
                datasets: [{
                    data: Object.values(destinationFrequency),
                    backgroundColor: this.generateChartColors(Object.keys(destinationFrequency).length)
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Destinations Visited'
                    }
                }
            }
        });
    }

    generateChartColors(count) {
        const baseColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ];
        return baseColors.slice(0, count);
    }

    parseDistance(distance) {
        const value = parseFloat(distance);
        return distance.includes('km') ? value * 1000 : value;
    }

    parseDuration(duration) {
        const hoursMatch = duration.match(/(\d+)h/);
        const minutesMatch = duration.match(/(\d+)min/);

        const hours = hoursMatch ? parseInt(hoursMatch[1]) * 60 : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

        return hours + minutes;
    }

    formatDistance(meters) {
        return meters >= 1000 
            ? `${(meters / 1000).toFixed(1)} km` 
            : `${Math.round(meters)} m`;
    }

    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours} h`;
        return `${hours} h ${mins} min`;
    }

    async exportStatisticsPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const stats = this.generateOverallStatistics();

            doc.setFontSize(18);
            doc.text('Travel Statistics', 10, 10);

            doc.setFontSize(12);
            doc.text(`Total Trips: ${stats.totalTrips}`, 10, 20);
            doc.text(`Total Distance: ${stats.totalDistance}`, 10, 30);
            doc.text(`Total Travel Time: ${stats.totalTravelTime}`, 10, 40);

            doc.save('travel_statistics.pdf');

            NotificationManager.show({
                type: 'success',
                message: 'Statistics exported successfully'
            });
        } catch (error) {
            console.error('PDF export error:', error);
            NotificationManager.show({
                type: 'error',
                message: 'Failed to export statistics'
            });
        }
    }

    handleInitializationError(error) {
        console.error('Statistics service initialization error:', error);
        NotificationManager.show({
            type: 'error',
            message: 'Failed to initialize statistics service'
        });
    }
}

// Create singleton instance
const statisticsService = new StatisticsService();

// Make globally accessible
window.statisticsService = statisticsService;

export default statisticsService;