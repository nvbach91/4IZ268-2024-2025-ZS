// auth.js
import CONFIG from './config.js';
import StorageManager from './storage.js';
import router from './router.js';
import NotificationManager from './notifications.js';
import ErrorHandler from './error-handling.js';

class Auth {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
    }

    /**
     * Initialize authentication system
     */
    async initialize() {
        try {
            await this.checkSession();
            this.setupEventListeners();
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    /**
     * Setup event listeners for authentication-related interactions
     */
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }

        // Registration form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegistrationSubmit.bind(this));
        }

        // Logout buttons
        document.querySelectorAll('[data-action="logout"]').forEach(button => {
            button.addEventListener('click', this.logout.bind(this));
        });
    }

    /**
     * Handle login form submission
     * @param {Event} event - Form submission event
     */
    async handleLoginSubmit(event) {
        event.preventDefault();
        
        try {
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            await this.login({ email, password });
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    /**
     * Handle registration form submission
     * @param {Event} event - Form submission event
     */
    async handleRegistrationSubmit(event) {
        event.preventDefault();
        
        try {
            const emailInput = document.getElementById('register-email');
            const passwordInput = document.getElementById('register-password');
            const confirmPasswordInput = document.getElementById('register-confirm-password');
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            await this.register({ email, password, confirmPassword });
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    /**
     * Login user with comprehensive validation and security checks
     * @param {Object} credentials - User login credentials
     * @returns {Promise<Object>} Logged-in user object
     */
    async login(credentials) {
        // Validate inputs
        const validationResult = ErrorHandler.validateInputs({
            email: credentials.email,
            password: credentials.password
        });

        if (!validationResult.isValid) {
            throw new Error(Object.values(validationResult.errors)[0]);
        }

        // Check if account is locked
        if (this.isAccountLocked()) {
            throw new Error('Too many login attempts. Account temporarily locked.');
        }

        // Find user
        const user = this.findUserByEmail(credentials.email);
        if (!user) {
            this.incrementLoginAttempts();
            throw new Error('User not found');
        }

        // Verify password
        const isPasswordValid = await this.verifyPassword(
            credentials.password, 
            user.password, 
            user.salt
        );

        if (!isPasswordValid) {
            this.incrementLoginAttempts();
            throw new Error('Incorrect password');
        }

        // Reset login attempts on successful login
        this.resetLoginAttempts();

        // Update user session
        this.setCurrentUser(user);

        // Navigate to dashboard
        router.navigateTo(CONFIG.ROUTES.DASHBOARD);

        // Show success notification
        NotificationManager.show({
            type: 'success',
            message: 'Login successful!'
        });

        return user;
    }

    /**
     * Register new user with comprehensive validation
     * @param {Object} registrationData - User registration details
     * @returns {Promise<Object>} Created user object
     */
    async register(registrationData) {
        // Validate registration inputs
        const validationResult = ErrorHandler.validateRegistration(registrationData);
        
        if (!validationResult.isValid) {
            throw new Error(Object.values(validationResult.errors)[0]);
        }

        // Check if user already exists
        if (this.findUserByEmail(registrationData.email)) {
            throw new Error('User with this email already exists');
        }

        // Create secure user
        const newUser = await this.createSecureUser(registrationData);

        // Set current user
        this.setCurrentUser(newUser);

        // Navigate to dashboard
        router.navigateTo(CONFIG.ROUTES.DASHBOARD);

        // Show success notification
        NotificationManager.show({
            type: 'success',
            message: 'Registration successful!'
        });

        return newUser;
    }

    /**
     * Create a secure user with enhanced protection
     * @param {Object} registrationData - User registration details
     * @returns {Promise<Object>} Created user object
     */
    async createSecureUser(registrationData) {
        const { email, password } = registrationData;

        // Generate secure salt
        const salt = this.generateSalt();

        // Hash password with salt
        const hashedPassword = await this.hashPasswordWithSalt(password, salt);

        const newUser = {
            id: this.generateUniqueId(),
            email,
            password: hashedPassword,
            salt,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            profile: {
                preferences: {},
                securityLevel: 'standard'
            },
            security: {
                passwordResetRequired: false,
                twoFactorEnabled: false
            },
            loginAttempts: {
                count: 0,
                lastAttempt: null
            }
        };

        // Save user
        this.users.push(newUser);
        this.saveUsers();

        return newUser;
    }

    /**
     * Generate a cryptographically secure salt
     * @returns {string} Generated salt
     */
    generateSalt() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Hash password with additional salt for security
     * @param {string} password - User password
     * @param {string} salt - Salt for hashing
     * @returns {Promise<string>} Hashed password
     */
    async hashPasswordWithSalt(password, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Verify password with salt
     * @param {string} inputPassword - Provided password
     * @param {string} storedHash - Stored password hash
     * @param {string} salt - User's salt
     * @returns {Promise<boolean>} Whether password is valid
     */
    async verifyPassword(inputPassword, storedHash, salt) {
        const hashedInput = await this.hashPasswordWithSalt(inputPassword, salt);
        return hashedInput === storedHash;
    }

    /**
     * Increment login attempts for an account
     */
    incrementLoginAttempts() {
    const user = this.currentUser;
    if (user) {
        user.loginAttempts = user.loginAttempts || { count: 0, lastAttempt: null };
        user.loginAttempts.count += 1;
        user.loginAttempts.lastAttempt = new Date().toISOString();

        // Update user in storage
        this.saveUsers();
    }
}

/**
 * Reset login attempts for an account
 */
resetLoginAttempts() {
    const user = this.currentUser;
    if (user) {
        user.loginAttempts = { count: 0, lastAttempt: null };
        this.saveUsers();
    }
}

/**
 * Check if account is locked due to multiple failed login attempts
 * @returns {boolean} Whether the account is locked
 */
isAccountLocked() {
    const user = this.currentUser;
    if (!user || !user.loginAttempts) return false;

    const { count, lastAttempt } = user.loginAttempts;
    
    // Check if attempts exceed max allowed
    if (count >= CONFIG.SECURITY.MAX_LOGIN_ATTEMPTS) {
        const lockoutEnd = new Date(lastAttempt);
        lockoutEnd.setMilliseconds(
            lockoutEnd.getMilliseconds() + CONFIG.SECURITY.LOCKOUT_DURATION
        );

        // Check if lockout period has passed
        return lockoutEnd > new Date();
    }

    return false;
}

/**
 * Logout user and clear session
 */
logout() {
    // Clear current user
    this.currentUser = null;

    // Remove user from storage
    StorageManager.removeData(CONFIG.STORAGE.KEYS.USER);

    // Navigate to home page
    router.navigateTo(CONFIG.ROUTES.HOME);

    // Show logout notification
    NotificationManager.show({
        type: 'info',
        message: 'You have been logged out'
    });
}

/**
 * Check and restore user session
 */
async checkSession() {
    const storedUser = StorageManager.getData(CONFIG.STORAGE.KEYS.USER);
    
    if (storedUser && this.isSessionValid(storedUser)) {
        this.currentUser = storedUser;
    } else if (storedUser) {
        // Session expired, logout user
        this.logout();
    }
}

/**
 * Validate user session
 * @param {Object} user - User session data
 * @returns {boolean} Whether the session is valid
 */
isSessionValid(user) {
    if (!user || !user.loginTime) return false;

    const loginTime = new Date(user.loginTime).getTime();
    const currentTime = Date.now();
    const sessionDuration = CONFIG.SESSION.DURATION;

    return (currentTime - loginTime) < sessionDuration;
}

/**
 * Set current user and update session
 * @param {Object} user - User object
 */
setCurrentUser(user) {
    // Update last login
    user.lastLogin = new Date().toISOString();

    // Create session data
    this.currentUser = {
        ...user,
        loginTime: new Date().toISOString()
    };

    // Save to storage
    StorageManager.saveData(
        CONFIG.STORAGE.KEYS.USER, 
        this.currentUser
    );
}

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Object|null} Found user or null
 */
findUserByEmail(email) {
    return this.users.find(user => user.email === email);
}

/**
 * Generate unique user ID
 * @returns {string} Unique identifier
 */
generateUniqueId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Load users from storage
 * @returns {Array} List of users
 */
loadUsers() {
    return StorageManager.getData(CONFIG.STORAGE.KEYS.USERS) || [];
}

/**
 * Save users to storage
 */
saveUsers() {
    StorageManager.saveData(
        CONFIG.STORAGE.KEYS.USERS, 
        this.users
    );
}

/**
 * Check if user is currently authenticated
 * @returns {boolean} Authentication status
 */
isAuthenticated() {
    return this.currentUser !== null && this.isSessionValid(this.currentUser);
}

/**
 * Get current authenticated user
 * @returns {Object|null} Current user or null
 */
getCurrentUser() {
    return this.currentUser;
}

/**
 * Handle authentication errors
 * @param {Error} error - Authentication error
 */
handleAuthError(error) {
    // Log the error
    ErrorHandler.log(error, { context: 'Authentication' });

    // Show user-friendly error notification
    NotificationManager.show({
        type: 'error',
        message: error.message || 'Authentication failed'
    });

    console.error('Authentication error:', error);
}

/**
 * Handle initialization errors
 * @param {Error} error - Initialization error
 */
handleInitializationError(error) {
    // Log the error
    ErrorHandler.log(error, { context: 'Authentication Initialization' });

    // Show user-friendly error notification
    NotificationManager.show({
        type: 'error',
        message: 'Failed to initialize authentication'
    });

    console.error('Authentication initialization error:', error);
}

/**
 * Initiate password reset process
 * @param {string} email - User email
 */
async initiatePasswordReset(email) {
    try {
        // Validate email
        if (!CONFIG.VALIDATION.EMAIL.REGEX.test(email)) {
            throw new Error('Invalid email address');
        }

        // Find user
        const user = this.findUserByEmail(email);
        if (!user) {
            throw new Error('No account found with this email');
        }

        // Generate reset token
        const resetToken = this.generateResetToken();

        // Store reset token (in a real app, this would be in a secure backend)
        user.passwordResetToken = {
            token: resetToken,
            expires: new Date(Date.now() + 3600000) // 1 hour from now
        };

        // Save updated user
        this.saveUsers();

        // In a real application, you would send an email with the reset link
        // For demonstration, we'll just log the token
        console.log(`Password Reset Token for ${email}: ${resetToken}`);

        // Show success notification
        NotificationManager.show({
            type: 'success',
            message: 'Password reset instructions sent to your email'
        });
    } catch (error) {
        this.handleAuthError(error);
    }
}

/**
 * Generate a secure reset token
 * @returns {string} Reset token
 */
generateResetToken() {
    return crypto.randomUUID();
}
}

// Create singleton instance
const auth = new Auth();

// Make globally accessible
window.auth = auth;

export default auth;