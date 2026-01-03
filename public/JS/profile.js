/**
 * Profile Page JavaScript
 * Simplified version focusing on username, email, password, and logout
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const profileForm = document.getElementById('profile-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const cancelBtn = document.getElementById('cancel-btn');
    const logoutLink = document.getElementById('logout-link');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.querySelector('.btn-close-modal');
    const successMessage = document.getElementById('success-message');
    const usernameDisplay = document.getElementById('username-display');
    const emailDisplay = document.getElementById('email-display');
    
    // User data (in a real app, this would come from a server/database)
    let userData = {
        username: "John Doe",
        email: "john.doe@student.cellnoun.edu",
        password: "CurrentPassword123"
    };
    
    /**
     * Initialize the page
     */
    function init() {
        console.log('Profile page initialized');
        populateUserData();
        initEventListeners();
    }
    
    /**
     * Populate user data in the UI
     */
    function populateUserData() {
        usernameInput.value = userData.username;
        emailInput.value = userData.email;
        usernameDisplay.textContent = userData.username;
        emailDisplay.textContent = userData.email;
    }
    
    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        // Form submission
        if (profileForm) {
            profileForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Cancel button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', handleCancel);
        }
        
        // Toggle password visibility
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', togglePasswordVisibility);
        });
        
        // Password strength checker
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', checkPasswordStrength);
        }
        
        // Logout functionality
        if (logoutLink) {
            logoutLink.addEventListener('click', handleLogout);
        }
        
        // Modal close button
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeSuccessModal);
        }
        
        // Modal overlay click
        if (successModal) {
            successModal.addEventListener('click', function(e) {
                if (e.target === successModal) {
                    closeSuccessModal();
                }
            });
        }
        
        // Escape key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeSuccessModal();
            }
        });
    }
    
    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validation
        if (!username || !email) {
            showError('Username and email are required.');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }
        
        // Check if password is being changed
        if (currentPassword || newPassword || confirmPassword) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                showError('Please fill in all password fields to change your password.');
                return;
            }
            
            // Check if current password is correct
            if (currentPassword !== userData.password) {
                showError('Current password is incorrect.');
                return;
            }
            
            // Check password strength
            if (!isStrongPassword(newPassword)) {
                showError('Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.');
                return;
            }
            
            // Check if passwords match
            if (newPassword !== confirmPassword) {
                showError('New passwords do not match.');
                return;
            }
            
            // Update password
            userData.password = newPassword;
            
            // Clear password fields
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
            strengthBar.style.width = '0%';
            strengthBar.className = 'strength-bar';
            strengthText.textContent = 'Enter a password to check strength';
        }
        
        // Update user data
        userData.username = username;
        userData.email = email;
        
        // Update display in sidebar
        usernameDisplay.textContent = username;
        emailDisplay.textContent = email;
        
        showSuccess('Profile updated successfully.');
        console.log('Profile data saved:', userData);
    }
    
    /**
     * Handle cancel button click
     */
    function handleCancel() {
        if (confirm('Discard changes?')) {
            profileForm.reset();
            populateUserData(); // Reset to original data
            
            // Reset password strength display
            strengthBar.style.width = '0%';
            strengthBar.className = 'strength-bar';
            strengthText.textContent = 'Enter a password to check strength';
            
            console.log('Changes cancelled');
        }
    }
    
    /**
     * Toggle password visibility
     * @param {Event} e - Click event
     */
    function togglePasswordVisibility(e) {
        const targetId = e.target.closest('button').getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        const icon = e.target.closest('button').querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
    
    /**
     * Check password strength
     */
    function checkPasswordStrength() {
        const password = newPasswordInput.value;
        
        if (!password) {
            strengthBar.style.width = '0%';
            strengthBar.className = 'strength-bar';
            strengthText.textContent = 'Enter a password to check strength';
            return;
        }
        
        let strength = 0;
        
        // Check length
        if (password.length >= 8) strength += 1;
        
        // Check for uppercase
        if (/[A-Z]/.test(password)) strength += 1;
        
        // Check for lowercase
        if (/[a-z]/.test(password)) strength += 1;
        
        // Check for numbers
        if (/\d/.test(password)) strength += 1;
        
        // Check for special characters
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update strength bar
        let width = 0;
        let className = '';
        let text = '';
        
        switch(strength) {
            case 0:
            case 1:
                width = 20;
                className = 'weak';
                text = 'Very Weak';
                break;
            case 2:
                width = 40;
                className = 'weak';
                text = 'Weak';
                break;
            case 3:
                width = 60;
                className = 'medium';
                text = 'Medium';
                break;
            case 4:
                width = 80;
                className = 'medium';
                text = 'Strong';
                break;
            case 5:
                width = 100;
                className = 'strong';
                text = 'Very Strong';
                break;
        }
        
        strengthBar.style.width = width + '%';
        strengthBar.className = 'strength-bar ' + className;
        strengthText.textContent = text;
    }
    
    /**
     * Check if password is strong enough
     * @param {string} password - Password to check
     * @returns {boolean} True if password is strong
     */
    function isStrongPassword(password) {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /\d/.test(password);
    }
    
    /**
     * Check if email is valid
     * @param {string} email - Email to validate
     * @returns {boolean} True if email is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Show success modal
     * @param {string} message - Success message to display
     */
    function showSuccess(message) {
        if (successMessage) {
            successMessage.textContent = message;
        }
        if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    /**
     * Close success modal
     */
    function closeSuccessModal() {
        if (successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    function showError(message) {
        alert(message);
    }
    
    /**
     * Handle logout
     * @param {Event} e - Click event
     */
    function handleLogout(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            alert('You have been logged out. Redirecting to homepage...');
            // In a real app, this would clear session and redirect
            window.location.href = 'index.html';
        }
    }
    
    // Initialize the page
    init();
});
   
       