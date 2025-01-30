// stats.js
import API from './api.js';
import Utils from './utils.js';

const Stats = {
    async render() {
        const stats = await this.collectStatistics();
        const container = document.createElement('div');
        container.className = 'container py-4';
        
        // Add main statistics cards row
        container.innerHTML = `
            <h2 class="mb-4">Travel Statistics</h2>
            
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Trips</h5>
                            <p class="card-text display-6">${stats.totalTrips}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Places Visited</h5>
                            <p class="card-text display-6">${stats.totalPlaces}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Average Stay</h5>
                            <p class="card-text display-6">${stats.averageStayDuration.toFixed(1)} days</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Spent</h5>
                            <p class="card-text display-6">${Utils.formatCurrency(stats.totalSpent)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Monthly Trips</h5>
                            <div style="height: 200px;">
                                <canvas id="tripsTimeline"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Popular Destinations</h5>
                            <div style="height: 200px;">
                                <canvas id="destinationsChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Travel Categories</h5>
                            <div style="height: 200px;">
                                <canvas id="categoriesChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Monthly Spending</h5>
                            <div style="height: 200px;">
                                <canvas id="spendingChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Store stats for chart initialization
        container.dataset.stats = JSON.stringify(stats);
        return container;
    },

    async collectStatistics() {
        try {
            const trips = await API.getTrips();
            const stats = {
                totalTrips: trips.length,
                totalPlaces: this.calculateTotalPlaces(trips),
                averageStayDuration: this.calculateAverageStay(trips),
                totalSpent: this.calculateTotalSpent(trips),
                monthlyTrips: this.calculateMonthlyTrips(trips),
                popularDestinations: this.getPopularDestinations(trips),
                travelCategories: this.analyzeTravelCategories(trips),
                monthlySpending: this.calculateMonthlySpending(trips)
            };
            return stats;
        } catch (error) {
            console.error('Error collecting statistics:', error);
            return {
                totalTrips: 0,
                totalPlaces: 0,
                averageStayDuration: 0,
                totalSpent: 0,
                monthlyTrips: [],
                popularDestinations: [],
                travelCategories: [],
                monthlySpending: []
            };
        }
    },

    calculateTotalPlaces(trips) {
        return trips.reduce((total, trip) => total + (trip.places?.length || 0), 0);
    },

    calculateAverageStay(trips) {
        if (!trips.length) return 0;
        const totalDays = trips.reduce((sum, trip) => {
            const start = new Date(trip.startDate);
            const end = new Date(trip.endDate);
            return sum + ((end - start) / (1000 * 60 * 60 * 24));
        }, 0);
        return totalDays / trips.length;
    },

    calculateTotalSpent(trips) {
        return trips.reduce((total, trip) => 
            total + (trip.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0), 0
        );
    },

    calculateMonthlyTrips(trips) {
        const monthlyCounts = {};
        trips.forEach(trip => {
            const date = new Date(trip.startDate);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
        });
        return Object.entries(monthlyCounts)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month));
    },

    getPopularDestinations(trips) {
        const destinations = {};
        trips.forEach(trip => {
            destinations[trip.destination] = (destinations[trip.destination] || 0) + 1;
        });
        return Object.entries(destinations)
            .map(([destination, count]) => ({ destination, count }))
            .sort((a, b) => b.count - a.count);
    },

    analyzeTravelCategories(trips) {
        const categories = {};
        trips.forEach(trip => {
            trip.places?.forEach(place => {
                const types = place.kinds?.split(',') || [];
                types.forEach(type => {
                    const cleanType = type.trim();
                    if (cleanType) {
                        categories[cleanType] = (categories[cleanType] || 0) + 1;
                    }
                });
            });
        });
        return Object.entries(categories)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    },

    calculateMonthlySpending(trips) {
        const monthly = {};
        trips.forEach(trip => {
            if (!trip.expenses) return;
            trip.expenses.forEach(expense => {
                const date = new Date(expense.date);
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthly[monthYear] = (monthly[monthYear] || 0) + expense.amount;
            });
        });
        return Object.entries(monthly)
            .map(([month, amount]) => ({ month, amount }))
            .sort((a, b) => a.month.localeCompare(b.month));
    },

    initializeCharts(stats) {
        this.initializeMonthlyTripsChart(stats.monthlyTrips);
        this.initializeDestinationsChart(stats.popularDestinations);
        this.initializeCategoriesChart(stats.travelCategories);
        this.initializeSpendingChart(stats.monthlySpending);
    },

    initializeMonthlyTripsChart(monthlyTrips) {
        const ctx = document.getElementById('tripsTimeline')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthlyTrips.map(item => item.month),
                datasets: [{
                    label: 'Number of Trips',
                    data: monthlyTrips.map(item => item.count),
                    backgroundColor: '#007bff',
                    borderColor: '#0056b3',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    },

    initializeDestinationsChart(destinations) {
        const ctx = document.getElementById('destinationsChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: destinations.map(d => d.destination),
                datasets: [{
                    label: 'Number of Visits',
                    data: destinations.map(d => d.count),
                    backgroundColor: '#28a745',
                    borderColor: '#1e7e34',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    },

    initializeCategoriesChart(categories) {
        const ctx = document.getElementById('categoriesChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map(c => c.category.replace(/_/g, ' ')),
                datasets: [{
                    data: categories.map(c => c.count),
                    backgroundColor: [
                        '#007bff', '#28a745', '#ffc107', '#dc3545',
                        '#17a2b8', '#6c757d', '#20c997', '#6610f2'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    },

    initializeSpendingChart(monthlySpending) {
        const ctx = document.getElementById('spendingChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlySpending.map(item => item.month),
                datasets: [{
                    label: 'Monthly Spending ($)',
                    data: monthlySpending.map(item => item.amount),
                    borderColor: '#17a2b8',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
};

export default Stats;