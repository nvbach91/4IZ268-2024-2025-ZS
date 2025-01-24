// error-handling.js
import CONFIG from './config.js';
import NotificationManager from './notifications.js';
import Utils from './utils.js';

class ErrorHandler {
    static handleNetworkError(error) {
        let userMessage = '';
        let errorDetails = '';
        
        if (error.name === 'TypeError') {
            userMessage = 'Connection Error';
            errorDetails = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (error.response) {
            // The request was made and the server responded with a status code
            switch (error.response.status) {
                case 400:
                    userMessage = 'Invalid Request';
                    errorDetails = 'The request was invalid. Please check your input data and try again. ' +
                                 (error.response.data?.message || 'Details: Invalid or missing parameters.');
                    break;
                case 401:
                    userMessage = 'Authentication Required';
                    errorDetails = 'Your session has expired or you are not logged in. Please log in again to continue.';
                    break;
                case 403:
                    userMessage = 'Access Denied';
                    errorDetails = 'You do not have permission to perform this action. If you believe this is a mistake, please contact support.';
                    break;
                case 404:
                    userMessage = 'Not Found';
                    errorDetails = 'The requested resource could not be found. Please check the URL or contact support if the problem persists.';
                    break;
                case 408:
                    userMessage = 'Request Timeout';
                    errorDetails = 'The request timed out. Please check your internet connection and try again.';
                    break;
                case 429:
                    userMessage = 'Too Many Requests';
                    errorDetails = 'You have made too many requests. Please wait a few minutes before trying again.';
                    break;
                case 500:
                    userMessage = 'Server Error';
                    errorDetails = 'An internal server error occurred. Our team has been notified. Please try again later.';
                    break;
                case 503:
                    userMessage = 'Service Unavailable';
                    errorDetails = 'The service is temporarily unavailable. Please try again later.';
                    break;
                default:
                    userMessage = 'Error';
                    errorDetails = `An unexpected error occurred (Status: ${error.response.status}). ${error.response.data?.message || ''}`;
            }
        } else if (error.request) {
            userMessage = 'Network Error';
            errorDetails = 'No response received from the server. Please check your internet connection and try again.';
        } else {
            userMessage = 'Application Error';
            errorDetails = error.message || 'An unexpected error occurred. Please try again or contact support.';
        }

        // Log the error with additional context
        console.error('Error Details:', {
            message: userMessage,
            details: errorDetails,
            originalError: error
        });

        // Show detailed error notification
        Swal.fire({
            icon: 'error',
            title: userMessage,
            html: `
                <div class="alert alert-danger">
                    <p class="mb-2"><strong>${errorDetails}</strong></p>
                    ${error.stack ? `
                        <details class="mt-2">
                            <summary>Technical Details</summary>
                            <pre class="mt-2"><code>${error.stack}</code></pre>
                        </details>
                    ` : ''}
                </div>
            `,
            showConfirmButton: true,
            showCancelButton: error.response?.status === 401,
            confirmButtonText: 'Try Again',
            cancelButtonText: 'Login',
            footer: '<a href="/support" class="text-decoration-none">Need help? Contact Support</a>'
        }).then((result) => {
            if (result.isConfirmed) {
                // Retry the last action if possible
                if (error.config) {
                    fetch(error.config.url, error.config)
                        .catch(this.handleNetworkError);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel && error.response?.status === 401) {
                window.location.href = '/login';
            }
        });

        return {
            isError: true,
            message: userMessage,
            details: errorDetails,
            originalError: error
        };
    }

    static handleApplicationError(error, context) {
        const errorInfo = {
            message: error.message || 'An unexpected error occurred',
            context: context || 'General',
            timestamp: new Date().toISOString(),
            details: error.details || {},
            stack: error.stack
        };

        // Log error
        console.error('Application Error:', errorInfo);

        // Show detailed error to user
        Swal.fire({
            icon: 'error',
            title: `Error in ${errorInfo.context}`,
            html: `
                <div class="alert alert-danger">
                    <p class="mb-2"><strong>${errorInfo.message}</strong></p>
                    ${error.details ? `
                        <p class="mb-0 text-muted small">Additional Details: ${error.details}</p>
                    ` : ''}
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            footer: `
                <div class="text-center">
                    <a href="#" onclick="window.location.reload()" class="me-3">Reload Page</a>
                    <a href="/support">Contact Support</a>
                </div>
            `
        });

        return errorInfo;
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