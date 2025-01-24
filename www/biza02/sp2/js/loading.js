// loading.js
class LoadingManager {
    constructor() {
        this.loadingCount = 0;
        this.spinner = document.getElementById('loading-spinner');
    }

    show(message = 'Loading...') {
        this.loadingCount++;
        if (this.spinner) {
            this.spinner.querySelector('.loading-text').textContent = message;
            this.spinner.classList.remove('d-none');
        }
    }

    hide() {
        this.loadingCount--;
        if (this.loadingCount <= 0) {
            this.loadingCount = 0;
            if (this.spinner) {
                this.spinner.classList.add('d-none');
            }
        }
    }

    showContentLoading(element, message = 'Loading...') {
        element.classList.add('content-loading');
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'spinner-border text-primary';
        loadingIndicator.setAttribute('role', 'status');
        element.appendChild(loadingIndicator);
    }

    hideContentLoading(element) {
        element.classList.remove('content-loading');
        const spinner = element.querySelector('.spinner-border');
        if (spinner) {
            spinner.remove();
        }
    }
}

const loadingManager = new LoadingManager();
export default loadingManager;