import API from './api.js';
import Utils from './utils.js';
import Notifications from './notifications.js';

const Budget = {
    expenses: [],
    currentTripId: null,

    async render() {
        const trips = await API.getTrips();
        
        const container = document.createElement("div");
        container.className = "container py-4";
        
        // Trip selector
        const tripSelector = document.createElement("select");
        tripSelector.id = "tripSelector";
        tripSelector.className = "form-select mb-4";
        
        if (trips.length === 0) {
            container.innerHTML = `
                <h2>Trip Budget Manager</h2>
                <div class="alert alert-info">Create a trip first to manage its budget.</div>
            `;
            return container;
        }

        trips.forEach(trip => {
            const option = document.createElement("option");
            option.value = trip.id;
            option.textContent = trip.name;
            tripSelector.appendChild(option);
        });

        // Budget form
        const budgetForm = document.createElement("div");
        budgetForm.className = "budget-form mb-4";
        budgetForm.innerHTML = `
            <h2>Trip Budget Manager</h2>
            <p>Manage your trip expenses.</p>
            <div class="row g-3 mb-4">
                <div class="col-md-5">
                    <input type="text" id="expenseName" class="form-control" placeholder="Expense Name">
                </div>
                <div class="col-md-5">
                    <input type="number" id="expenseAmount" class="form-control" placeholder="Amount" step="0.01">
                </div>
                <div class="col-md-2">
                    <button id="addExpenseBtn" class="btn btn-success w-100">Add Expense</button>
                </div>
            </div>
            <div id="expenseList" class="mt-4"></div>
            <div id="budgetSummary" class="mt-4"></div>
        `;

        container.appendChild(tripSelector);
        container.appendChild(budgetForm);
        
        return container;
    },

    async init() {
        this.bindEvents();
        await this.loadTripExpenses();
    },

    async loadTripExpenses() {
        const tripSelector = document.getElementById("tripSelector");
        if (!tripSelector) return;

        this.currentTripId = tripSelector.value;
        const trip = await API.getTrip(this.currentTripId);
        
        if (trip && trip.expenses) {
            this.expenses = trip.expenses;
        } else {
            this.expenses = [];
        }
        
        this.updateExpenseList();
    },

    bindEvents() {
        const addButton = document.getElementById("addExpenseBtn");
        const tripSelector = document.getElementById("tripSelector");

        if (addButton) {
            addButton.addEventListener("click", (e) => {
                e.preventDefault();
                this.addExpense();
            });
        }

        if (tripSelector) {
            tripSelector.addEventListener("change", () => this.loadTripExpenses());
        }

        document.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && document.activeElement.matches("#expenseName, #expenseAmount")) {
                e.preventDefault();
                this.addExpense();
            }
        });
    },

    async addExpense() {
        const nameInput = document.getElementById("expenseName");
        const amountInput = document.getElementById("expenseAmount");
        
        if (!nameInput || !amountInput) return;

        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);

        if (!name || isNaN(amount) || amount <= 0) {
            Notifications.showAlert("Please enter a valid expense name and amount.", "warning");
            return;
        }

        try {
            const newExpense = {
                id: Utils.generateUniqueId(),
                name,
                amount,
                date: new Date().toISOString()
            };

            // Add to local state
            this.expenses.push(newExpense);

            // Save to Firebase
            await API.updateTrip(this.currentTripId, {
                expenses: this.expenses
            });

            // Clear inputs
            nameInput.value = "";
            amountInput.value = "";
            nameInput.focus();

            // Update the display
            this.updateExpenseList();
            Notifications.showAlert("Expense added successfully!", "success");
        } catch (error) {
            console.error("Error saving expense:", error);
            Notifications.showAlert("Failed to save expense", "error");
        }
    },

    async deleteExpense(id) {
        try {
            const index = this.expenses.findIndex(expense => expense.id === id);
            if (index !== -1) {
                this.expenses.splice(index, 1);
                
                // Save to Firebase
                await API.updateTrip(this.currentTripId, {
                    expenses: this.expenses
                });

                this.updateExpenseList();
                Notifications.showAlert("Expense deleted successfully!", "success");
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
            Notifications.showAlert("Failed to delete expense", "error");
        }
    },

    updateExpenseList() {
        const expenseList = document.getElementById("expenseList");
        const summary = document.getElementById("budgetSummary");
        
        if (!expenseList || !summary) return;

        if (this.expenses.length === 0) {
            expenseList.innerHTML = '<div class="alert alert-info">No expenses added yet.</div>';
            summary.innerHTML = '';
            return;
        }

        // Create expense list HTML
        let html = '<div class="list-group">';
        this.expenses.forEach(expense => {
            html += `
                <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${expense.name}</h6>
                        <small class="text-muted">${new Date(expense.date).toLocaleDateString()}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="me-3">${Utils.formatCurrency(expense.amount)}</span>
                        <button class="btn btn-danger btn-sm delete-expense" data-id="${expense.id}">×</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        expenseList.innerHTML = html;

        // Update summary
        const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        summary.innerHTML = `
            <div class="card bg-light">
                <div class="card-body">
                    <h4>Summary</h4>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Total Expenses:</strong> ${Utils.formatCurrency(total)}</p>
                            <p><strong>Number of Expenses:</strong> ${this.expenses.length}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Average Expense:</strong> ${Utils.formatCurrency(total / this.expenses.length)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind delete buttons
        const deleteButtons = document.querySelectorAll(".delete-expense");
        deleteButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                this.deleteExpense(id);
            });
        });
    }
};

export default Budget;