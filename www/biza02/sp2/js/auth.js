import API from './api.js';

const Auth = {
    async init() {
        await this.checkLoginState();
        this.bindEvents();
    },

    async checkLoginState() {
        try {
            const isAuthenticated = await API.isAuthenticated(); 
            this.updateNavigation(isAuthenticated);
            return isAuthenticated;
        } catch (error) {
            console.error('Error checking login state:', error);
            return false;
        }
    },

    renderLoginForm() {
        return `
            <div class="login-container">
                <h2>Login</h2>
                <form id="loginForm">
                    <label>Email:</label>
                    <input type="email" name="email" required>
                    <label>Password:</label>
                    <input type="password" name="password" required>
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <a href="#register">Register here</a></p>
            </div>
        `;
    },

    renderRegisterForm() {
        return `
            <div class="register-container">
                <h2>Register</h2>
                <form id="registerForm">
                    <label>Email:</label>
                    <input type="email" name="email" required>
                    <label>Password:</label>
                    <input type="password" name="password" required>
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <a href="#login">Login here</a></p>
            </div>
        `;
    },

    updateNavigation(isAuthenticated) {
        const authLinks = document.querySelectorAll('.auth-link');
        authLinks.forEach(link => {
            if (isAuthenticated) {
                link.classList.add('logged-in');
                link.classList.remove('logged-out');
            } else {
                link.classList.add('logged-out');
                link.classList.remove('logged-in');
            }
        });

        const loginButton = document.getElementById('loginButton');
        const logoutButton = document.getElementById('logoutButton');
        if (loginButton) loginButton.style.display = isAuthenticated ? 'none' : 'block';
        if (logoutButton) logoutButton.style.display = isAuthenticated ? 'block' : 'none';
    },

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(loginForm);
                const credentials = {
                    email: formData.get('email'),
                    password: formData.get('password')
                };
                await this.login(credentials);
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(registerForm);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password')
                };
                await this.register(userData);
            });
        }

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
                await this.logout();
            });
        }
    },

    async login(credentials) {
        try {
            const user = await API.login(credentials);
            if (user) {
                await this.checkLoginState();
                window.location.hash = 'trips'; 
                return user;
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    },

    async register(userData) {
        try {
            const user = await API.register(userData);
            if (user) {
                await this.checkLoginState();
                window.location.hash = 'trips'; 
                return user;
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    },

    async logout() {
        try {
            await API.logout();
            await this.checkLoginState();
            window.location.hash = 'login'; 
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
};

export default Auth;
