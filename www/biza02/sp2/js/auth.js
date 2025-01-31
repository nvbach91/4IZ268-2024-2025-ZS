// auth.js
import API from './api.js';
import { auth } from './firebase-init.js';
import Notifications from './notifications.js';
import Utils from './utils.js';

const Auth = {
    elements: {
        loginForm: null,
        registerForm: null,
        loginButton: null,
        logoutButton: null,
        authLinks: null
    },
    
    user: null,

    async init() {
        await new Promise(resolve => auth.onAuthStateChanged(resolve));
        const isAuthenticated = await this.isLoggedIn();
        this.updateNavigation(isAuthenticated);
        this.cacheElements();
        this.bindEvents();
        this.setupLogoutHandler();
    },

    async checkLoginState() {
        try {
            const user = auth.currentUser;
            if (user) {
                this.user = user;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking login state:', error);
            return false;
        }
    },

    cacheElements() {
        this.elements = {
            loginForm: document.getElementById('loginForm'),
            registerForm: document.getElementById('registerForm'),
            loginButton: document.getElementById('loginButton'),
            logoutButton: document.getElementById('logoutButton'),
            authLinks: document.querySelectorAll('.auth-link')
        };
    },

    async isLoggedIn() {
        return !!auth.currentUser;
    },

    renderLoginForm() {
        const container = document.createElement('div');
        container.className = 'login-container';

        container.innerHTML = `
            <h2 class="text-center mb-4">Login</h2>
            <div class="card">
                <div class="card-body">
                    <form id="loginForm" class="auth-form">
                        <div class="form-group mb-3">
                            <label for="loginEmail">Email</label>
                            <input type="email" class="form-control" id="loginEmail" name="email" required>
                        </div>
                        <div class="form-group mb-3">
                            <label for="loginPassword">Password</label>
                            <input type="password" class="form-control" id="loginPassword" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Login</button>
                    </form>
                    <div class="text-center mt-3">
                        <p>Don't have an account? <a href="#register">Register here</a></p>
                    </div>
                </div>
            </div>
        `;

        return container.innerHTML;
    },
    
    renderRegisterForm() {
        const container = document.createElement('div');
        container.className = 'register-container';

        container.innerHTML = `
            <h2 class="text-center mb-4">Register</h2>
            <div class="card">
                <div class="card-body">
                    <form id="registerForm" class="auth-form">
                        <div class="form-group mb-3">
                            <label for="registerEmail">Email</label>
                            <input type="email" class="form-control" id="registerEmail" name="email" required>
                        </div>
                        <div class="form-group mb-3">
                            <label for="registerPassword">Password</label>
                            <input type="password" class="form-control" id="registerPassword" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Register</button>
                    </form>
                    <div class="text-center mt-3">
                        <p>Already have an account? <a href="#login">Login here</a></p>
                    </div>
                </div>
            </div>
        `;

        return container.innerHTML;
    },
    
    updateNavigation(isAuthenticated) {
        document.querySelectorAll('.auth-link').forEach(link => {
            if (isAuthenticated) {
                link.classList.toggle('show', link.classList.contains('logged-in'));
            } else {
                link.classList.toggle('show', link.classList.contains('logged-out'));
            }
        });
    },

    setupLogoutHandler() {
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.handleLogout();
            });
        }
    },

    bindEvents() {
        this.cacheElements();

        if (this.elements.loginForm) {
            this.elements.loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        }

        if (this.elements.registerForm) {
            this.elements.registerForm.addEventListener('submit', (e) => this.handleRegisterSubmit(e));
        }

        if (this.elements.logoutButton) {
            this.elements.logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    },
    
    async handleLoginSubmit(event) {
        event.preventDefault();
        
        try {
            Utils.showLoading();
            const form = event.target;
            const formData = new FormData(form);
            
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            await this.login(credentials);
        } catch (error) {
            console.error('Login submission error:', error);
            Notifications.showAlert('Login failed. Please try again.', 'error');
        } finally {
            Utils.hideLoading();
        }
    },
    
    async handleRegisterSubmit(event) {
        event.preventDefault();
        
        try {
            Utils.showLoading();
            const form = event.target;
            const formData = new FormData(form);
            
            const userData = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            await this.register(userData);
        } catch (error) {
            console.error('Registration submission error:', error);
            Notifications.showAlert('Registration failed. Please try again.', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    async handleLogout() {
        try {
            const result = await Notifications.showConfirmation(
                'Logout',
                'Are you sure you want to logout?'
            );

            if (result.isConfirmed) {
                Utils.showLoading();
                await this.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
            Notifications.showAlert('Logout failed. Please try again.', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    async login(credentials) {
        try {
            const user = await API.login(credentials);
            if (user) {
                await this.checkLoginState();
                this.updateNavigation(true);
                window.location.hash = 'trips';
                Notifications.showAlert('Login successful!', 'success');
                return user;
            }
        } catch (error) {
            console.error('Login failed:', error);
            Notifications.showAlert('Login failed. Please check your credentials.', 'error');
            throw error;
        }
    },

    async register(userData) {
        try {
            const user = await API.register(userData);
            if (user) {
                await this.checkLoginState();
                this.updateNavigation(true);
                window.location.hash = 'trips';
                Notifications.showAlert('Registration successful!', 'success');
                return user;
            }
        } catch (error) {
            console.error('Registration failed:', error);
            Notifications.showAlert('Registration failed. Please try again.', 'error');
            throw error;
        }
    },

    async logout() {
        try {
            await API.logout();
            this.user = null;
            
            // Clear stored data
            sessionStorage.clear();
            localStorage.removeItem('authToken');

            // Update UI
            this.updateNavigation(false);
            window.location.hash = 'login';
            Notifications.showAlert('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout failed:', error);
            Notifications.showAlert('Logout failed. Please try again.', 'error');
            throw error;
        }
    }
};

export default Auth;