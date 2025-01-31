import API from './api.js';
import Utils from './utils.js';

const Stats = {
    elements: {
        tripsTimeline: null,
        destinationsChart: null,
        spendingChart: null
    },
    charts: [],

    async render() {
        const stats = await this.collectStatistics();
        const container = document.createElement('div');
        container.className = 'container stats-container';
        
        const statsHeader = document.createElement('h2');
        statsHeader.className = 'stats-header';
        statsHeader.textContent = 'Travel Statistics';
        
        const mainStatsRow = this.createMainStatsRow(stats);
        const chartsGrid = this.createChartsGrid();

        container.appendChild(statsHeader);
        container.appendChild(mainStatsRow);
        container.appendChild(chartsGrid);

        setTimeout(() => {
            this.destroyCharts();
            this.cacheElements();
            this.initializeCharts(stats);
        }, 0);

        return container;
    },

    destroyCharts() {
        this.charts.forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = [];
    },

    createMainStatsRow(stats) {
        const row = document.createElement('div');
        row.className = 'stats-cards-row';

        const statCards = [
            { title: 'Total Trips', value: stats.totalTrips },
            { title: 'Places Visited', value: stats.totalPlaces },
            { title: 'Average Stay', value: `${stats.averageStayDuration.toFixed(1)} days` },
            { title: 'Total Spent', value: Utils.formatCurrency(stats.totalSpent) }
        ];

        statCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'stat-card';

            const cardBody = document.createElement('div');
            cardBody.className = 'stat-card-body';

            const title = document.createElement('h5');
            title.className = 'stat-card-title';
            title.textContent = card.title;

            const value = document.createElement('p');
            value.className = 'stat-card-value';
            value.textContent = card.value;

            cardBody.appendChild(title);
            cardBody.appendChild(value);
            cardElement.appendChild(cardBody);
            row.appendChild(cardElement);
        });

        return row;
    },

    createChartsGrid() {
        const chartsContainer = document.createElement('div');
        chartsContainer.className = 'charts-grid';

        const chartConfigs = [
            { id: 'tripsTimeline', title: 'Monthly Trips' },
            { id: 'destinationsChart', title: 'Popular Destinations' },
            { id: 'spendingChart', title: 'Monthly Spending' }
        ];

        chartConfigs.forEach(config => {
            const chartSection = document.createElement('div');
            chartSection.className = 'chart-section';

            const card = document.createElement('div');
            card.className = 'chart-card';

            const cardBody = document.createElement('div');
            cardBody.className = 'chart-card-body';

            const title = document.createElement('h5');
            title.className = 'chart-title';
            title.textContent = config.title;

            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container';
            
            const canvas = document.createElement('canvas');
            canvas.id = config.id;
            chartContainer.appendChild(canvas);

            cardBody.appendChild(title);
            cardBody.appendChild(chartContainer);
            card.appendChild(cardBody);
            chartSection.appendChild(card);
            chartsContainer.appendChild(chartSection);
        });

        return chartsContainer;
    },

    cacheElements() {
        this.elements = {
            tripsTimeline: document.getElementById('tripsTimeline'),
            destinationsChart: document.getElementById('destinationsChart'),
            spendingChart: document.getElementById('spendingChart')
        };
    },

    async collectStatistics() {
        try {
            const trips = await API.getTrips();
            return {
                totalTrips: trips.length,
                totalPlaces: this.calculateTotalPlaces(trips),
                averageStayDuration: this.calculateAverageStay(trips),
                totalSpent: this.calculateTotalSpent(trips),
                monthlyTrips: this.calculateMonthlyTrips(trips),
                popularDestinations: this.getPopularDestinations(trips),
                monthlySpending: this.calculateMonthlySpending(trips)
            };
        } catch (error) {
            console.error('Error collecting statistics:', error);
            return {
                totalTrips: 0,
                totalPlaces: 0,
                averageStayDuration: 0,
                totalSpent: 0,
                monthlyTrips: [],
                popularDestinations: [],
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
        if (!stats || !Array.isArray(stats.monthlyTrips)) {
            console.error("Invalid statistics data");
            stats = {
                ...stats,
                monthlyTrips: [],
                popularDestinations: [],
                monthlySpending: []
            };
        }

        const chartConfigs = {
            tripsTimeline: {
                type: 'bar',
                data: {
                    labels: stats.monthlyTrips.map(item => item.month),
                    datasets: [{
                        label: 'Number of Trips',
                        data: stats.monthlyTrips.map(item => item.count),
                        backgroundColor: '#007bff',
                        borderColor: '#0056b3',
                        borderWidth: 1
                    }]
                }
            },
            destinationsChart: {
                type: 'bar',
                data: {
                    labels: stats.popularDestinations.map(d => d.destination),
                    datasets: [{
                        label: 'Number of Visits',
                        data: stats.popularDestinations.map(d => d.count),
                        backgroundColor: '#28a745',
                        borderColor: '#1e7e34',
                        borderWidth: 1
                    }]
                }
            },
            spendingChart: {
                type: 'line',
                data: {
                    labels: stats.monthlySpending.map(item => item.month),
                    datasets: [{
                        label: 'Monthly Spending ($)',
                        data: stats.monthlySpending.map(item => item.amount),
                        borderColor: '#17a2b8',
                        backgroundColor: 'rgba(23, 162, 184, 0.1)',
                        borderWidth: 2,
                        fill: true
                    }]
                }
            }
        };

        Object.entries(chartConfigs).forEach(([chartId, config]) => {
            const canvas = this.elements[chartId];
            if (canvas) {
                const chart = new Chart(canvas, {
                    type: config.type,
                    data: config.data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: config.type !== 'doughnut' ? {
                            y: { beginAtZero: true }
                        } : undefined,
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        }
                    }
                });
                this.charts.push(chart);
            }
        });
    }
};

export default Stats;
