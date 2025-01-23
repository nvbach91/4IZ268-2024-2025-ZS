// error-handling.js
import CONFIG from './config.js';
import NotificationManager from './notifications.js';
import Utils from './utils.js';

class ErrorHandler {
    /**
     * Log errors with optional additional context
     * @param {Error} error - Error object
     * @param {Object} [context] - Additional context information
     */
    static log(error, context = {}) {
        const errorLog = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            ...context
        };

        // Console logging
        console.error('Application Error:', errorLog);

        // Optional: Send to error tracking service
        // In a real-world scenario, you might integrate with services like Sentry
        this.reportToErrorTrackingService(errorLog);
    }

    /**
     * Placeholder for error tracking service
     * @param {Object} errorLog - Error log details
     */
    static reportToErrorTrackingService(errorLog) {
        // Implement error tracking integration
        // For now, just log to console
        console.warn('Error Tracking:', errorLog);
    }

    /**
     * Handle network-related errors
     * @param {Error} error - Network error
     * @returns {Object} Processed error information
     */
    static handleNetworkError(error) {
        let userMessage = 'An unexpected network error occurred.';
        
        if (error.name === 'TypeError') {
            userMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.response) {
            // The request was made and the server responded with a status code
            switch (error.response.status) {
                case 400:
                    userMessage = 'Bad request. Please check your input.';
                    break;
                case 401:
                    userMessage = 'Unauthorized. Please log in again.';
                    break;
                case 403:
                    userMessage = 'You do not have permission to access this resource.';
                    break;
                case 404:
                    userMessage = 'The requested resource could not be found.';
                    break;
                case 500:
                    userMessage = 'Internal server error. Please try again later.';
                    break;
                default:
                    userMessage = `Server error: ${error.response.status}`;
            }
        }

        // Log the error
        this.log(error, { type: 'network' });

        // Show user-friendly notification
        NotificationManager.show({
            type: 'error',
            message: userMessage
        });

        return {
            isError: true,
            message: userMessage,
            originalError: error
        };
    }

    /**
     * Validate form inputs based on configuration
     * @param {Object} inputs - Object containing input fields
     * @returns {Object} Validation result
     */
    static validateInputs(inputs) {
        const errors = {};

        Object.entries(inputs).forEach(([key, value]) => {
            switch (key) {
                case 'email':
                    if (!CONFIG.VALIDATION.EMAIL.REGEX.test(value)) {
                        errors[key] = 'Invalid email address';
                    }
                    break;
                case 'password':
                    const passwordConfig = CONFIG.VALIDATION.PASSWORD;
                    
                    if (value.length < passwordConfig.MIN_LENGTH) {
                        errors[key] = `Password must be at least ${passwordConfig.MIN_LENGTH} characters long`;
                    }

                    if (passwordConfig.REQUIRE_UPPERCASE && !/[A-Z]/.test(value)) {
                        errors[key] = 'Password must contain at least one uppercase letter';
                    }

                    if (passwordConfig.REQUIRE_LOWERCASE && !/[a-z]/.test(value)) {
                        errors[key] = 'Password must contain at least one lowercase letter';
                    }

                    if (passwordConfig.REQUIRE_NUMBER && !/[0-9]/.test(value)) {
                        errors[key] = 'Password must contain at least one number';
                    }

                    if (passwordConfig.REQUIRE_SPECIAL_CHAR) {
                        const specialChars = passwordConfig.SPECIAL_CHARS || '!@#$%^&*()_+-=[]{}|;:,.<>?';
                        const specialCharRegex = new RegExp(`[${specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
                        
                        if (!specialCharRegex.test(value)) {
                            errors[key] = `Password must contain at least one special character (${specialChars})`;
                        }
                    }
                    break;
                // Add more specific validations as needed
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Centralized error handler for async operations
     * @param {Function} asyncFunction - Async function to execute
     * @param {Object} [options] - Additional options
     * @returns {Promise} Result of the async function
     */
    static async asyncHandler(asyncFunction, options = {}) {
        const { 
            showLoadingIndicator = true, 
            silentFailure = false,
            errorMessage = 'An unexpected error occurred'
        } = options;

        try {
            if (showLoadingIndicator) {
                Utils.showLoader();
            }

            const result = await asyncFunction();
            return result;
        } catch (error) {
            // Handle different types of errors
            if (!silentFailure) {
                const processedError = this.handleNetworkError(error);
                
                // Optional: Additional error handling logic
                if (processedError.message.includes('Unauthorized')) {
                    // Automatically log out user if unauthorized
                    import('./auth.js').then(module => {
                        module.default.logout();
                    });
                }

                // Show custom error message if provided
                NotificationManager.show({
                    type: 'error',
                    message: errorMessage
                });
            }

            throw error;
        } finally {
            if (showLoadingIndicator) {
                Utils.hideLoader();
            }
        }
    }

    /**
     * Validate registration inputs comprehensively
     * @param {Object} registrationData - User registration details
     * @returns {Object} Validation result
     */
    static validateRegistration(registrationData) {
        const { email, password, confirmPassword } = registrationData;
        const errors = {};

        // Email validation
        if (!CONFIG.VALIDATION.EMAIL.REGEX.test(email)) {
            errors.email = 'Invalid email address';
        }

        // Password validation
        const passwordValidation = this.validateInputs({ password });
        if (!passwordValidation.isValid) {
            errors.password = Object.values(passwordValidation.errors)[0];
        }

        // Confirm password match
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export default ErrorHandler;