import API from './api.js';
import Utils from './utils.js';
import Notifications from './notifications.js';

const Budget = {
    expenses: [],
    currentTripId: null,
    elements: {
        expenseList: null,
        summary: null,
        tripSelector: null,
        expenseName: null,
        expenseAmount: null,
        addExpenseBtn: null
    },

    async render() {
        const trips = await API.getTrips();
        const container = document.createElement("div");
        container.className = "container budget-container";
        
        if (trips.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'budget-empty-state';
            emptyState.innerHTML = `
                <h2>Trip Budget Manager</h2>
                <div class="alert alert-info">Create a trip first to manage its budget.</div>
            `;
            container.appendChild(emptyState);
            return container;
        }

        const budgetContent = document.createElement('div');
        budgetContent.className = 'budget-content';
        
        const title = document.createElement('h2');
        title.textContent = 'Trip Budget Manager';

        const subtitle = document.createElement('p');
        subtitle.textContent = 'Manage your trip expenses.';

        const tripSelect = document.createElement('select');
        tripSelect.id = 'tripSelector';
        tripSelect.className = 'form-select trip-selector';
        trips.forEach(trip => {
            const option = document.createElement('option');
            option.value = trip.id;
            option.textContent = trip.name;
            tripSelect.appendChild(option);
        });

        const expenseForm = document.createElement('div');
        expenseForm.className = 'expense-form';
        expenseForm.innerHTML = `
            <div class="row">
                <div class="col-md-5">
                    <input type="text" id="expenseName" class="form-control" placeholder="Expense Name" required>
                </div>
                <div class="col-md-5">
                    <input type="number" id="expenseAmount" class="form-control" placeholder="Amount" step="0.01" required>
                </div>
                <div class="col-md-2">
                    <button id="addExpenseBtn" class="btn btn-success w-100">Add Expense</button>
                </div>
            </div>
        `;

        const expenseList = document.createElement('div');
        expenseList.id = 'expenseList';
        expenseList.className = 'expense-list';

        const summarySection = document.createElement('div');
        summarySection.id = 'budgetSummary';
        summarySection.className = 'budget-summary';

        budgetContent.appendChild(title);
        budgetContent.appendChild(subtitle);
        budgetContent.appendChild(tripSelect);
        budgetContent.appendChild(expenseForm);
        budgetContent.appendChild(expenseList);
        budgetContent.appendChild(summarySection);

        container.appendChild(budgetContent);
        return container;
    },

    async init() {
        this.cacheElements();
        this.bindEvents();
        await this.loadTripExpenses();
    },

    cacheElements() {
        this.elements = {
            tripSelector: document.getElementById('tripSelector'),
            expenseList: document.getElementById('expenseList'),
            summary: document.getElementById('budgetSummary'),
            expenseName: document.getElementById('expenseName'),
            expenseAmount: document.getElementById('expenseAmount'),
            addExpenseBtn: document.getElementById('addExpenseBtn')
        };
    },

    async loadTripExpenses() {
        if (!this.elements.tripSelector) return;

        this.currentTripId = this.elements.tripSelector.value;
        const trip = await API.getTrip(this.currentTripId);
        
        if (trip && trip.expenses) {
            this.expenses = trip.expenses;
        } else {
            this.expenses = [];
        }
        
        this.updateExpenseList();
    },

    bindEvents() {
        if (this.elements.addExpenseBtn) {
            this.elements.addExpenseBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.addExpense();
            });
        }

        if (this.elements.tripSelector) {
            this.elements.tripSelector.addEventListener("change", () => this.loadTripExpenses());
        }

        document.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && document.activeElement.matches("#expenseName, #expenseAmount")) {
                e.preventDefault();
                this.addExpense();
            }
        });
    },

    createExpenseItem(expense) {
        const item = document.createElement('div');
        item.className = 'expense-item';

        const expenseContent = document.createElement('div');
        expenseContent.className = 'expense-content';

        const nameElement = document.createElement('h6');
        nameElement.className = 'expense-name';
        nameElement.textContent = expense.name;

        const dateElement = document.createElement('small');
        dateElement.className = 'expense-date';
        dateElement.textContent = new Date(expense.date).toLocaleDateString();

        const amountGroup = document.createElement('div');
        amountGroup.className = 'expense-amount-group';

        const amountElement = document.createElement('span');
        amountElement.className = 'expense-amount';
        amountElement.textContent = Utils.formatCurrency(expense.amount);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm delete-expense';
        deleteButton.dataset.id = expense.id;
        deleteButton.textContent = '×';
        deleteButton.addEventListener('click', () => this.deleteExpense(expense.id));

        expenseContent.appendChild(nameElement);
        expenseContent.appendChild(dateElement);
        amountGroup.appendChild(amountElement);
        amountGroup.appendChild(deleteButton);

        item.appendChild(expenseContent);
        item.appendChild(amountGroup);

        return item;
    },

    createSummaryCard(total, count) {
        const card = document.createElement('div');
        card.className = 'summary-card';

        const content = document.createElement('div');
        content.className = 'summary-content';

        const title = document.createElement('h4');
        title.textContent = 'Summary';

        const stats = document.createElement('div');
        stats.className = 'summary-stats';
        stats.innerHTML = `
            <div class="summary-row">
                <p><strong>Total Expenses:</strong> ${Utils.formatCurrency(total)}</p>
                <p><strong>Number of Expenses:</strong> ${count}</p>
            </div>
            <div class="summary-row">
                <p><strong>Average Expense:</strong> ${count > 0 ? Utils.formatCurrency(total / count) : Utils.formatCurrency(0)}</p>
            </div>
        `;

        content.appendChild(title);
        content.appendChild(stats);
        card.appendChild(content);

        return card;
    },

    async addExpense() {
        if (!this.elements.expenseName || !this.elements.expenseAmount) return;

        const name = this.elements.expenseName.value.trim();
        const amount = parseFloat(this.elements.expenseAmount.value);

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
            this.elements.expenseName.value = "";
            this.elements.expenseAmount.value = "";
            this.elements.expenseName.focus();

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
        if (!this.elements.expenseList || !this.elements.summary) return;

        // Clear previous content
        this.elements.expenseList.innerHTML = '';
        this.elements.summary.innerHTML = '';

        if (this.expenses.length === 0) {
            this.elements.expenseList.appendChild(
                (() => {
                    const alert = document.createElement('div');
                    alert.className = 'alert alert-info';
                    alert.textContent = 'No expenses added yet.';
                    return alert;
                })()
            );
            return;
        }

        // Create expense list
        this.expenses.forEach(expense => {
            this.elements.expenseList.appendChild(this.createExpenseItem(expense));
        });

        // Create summary
        const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        this.elements.summary.appendChild(this.createSummaryCard(total, this.expenses.length));
    }
};

export default Budget;