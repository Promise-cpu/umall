/**
 * Cell Noun Authentication JavaScript
 * Handles sign in, sign up, and forgot password functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    // Authentication elements
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const successMessage = document.getElementById('success-message');
    
    const goToSignup = document.getElementById('go-to-signup');
    const goToSignin = document.getElementById('go-to-signin');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToSignin = document.getElementById('back-to-signin');
    const backToAuth = document.getElementById('back-to-auth');
    
    // Form elements
    const signinFormElement = document.getElementById('signinForm');
    const signupFormElement = document.getElementById('signupForm');
    const forgotPasswordFormElement = document.getElementById('forgotPasswordForm');
    
    // URL hash handling for direct navigation
    const hash = window.location.hash;
    
    /**
     * Toggle the side menu open/close
     */
    function toggleMenu() {
        sideMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (sideMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    
    /**
     * Close the side menu
     */
    function closeSideMenu() {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    /**
     * Handle search functionality
     */
    function handleSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            // In a real application, this would send the search to a server
            // For now, we'll just show an alert and log to console
            console.log(`Searching for: ${searchTerm}`);
            alert(`Searching for "${searchTerm}". You will be redirected to search results.`);
            
            // Clear the search input
            searchInput.value = '';
        } else {
            // If search input is empty, show a message
            alert('Please enter a search term');
            searchInput.focus();
        }
    }
    
    /**
     * Handle keyboard events for search
     * @param {Event} event - The keyboard event
     */
    function handleSearchKeyPress(event) {
        // If Enter key is pressed in search input, trigger search
        if (event.key === 'Enter') {
            handleSearch();
        }
    }
    
    /**
     * Switch between authentication forms
     * @param {string} formId - The ID of the form to show
     */
    function switchForm(formId) {
        // Hide all forms
        signinForm.classList.remove('active');
        signupForm.classList.remove('active');
        forgotPasswordForm.classList.remove('active');
        successMessage.classList.remove('active');
        
        // Update tabs
        signinTab.classList.remove('active');
        signupTab.classList.remove('active');
        
        // Show the requested form
        if (formId === 'signin-form') {
            signinForm.classList.add('active');
            signinTab.classList.add('active');
            window.history.pushState(null, null, '#signin-form');
        } else if (formId === 'signup-form') {
            signupForm.classList.add('active');
            signupTab.classList.add('active');
            window.history.pushState(null, null, '#signup-form');
        } else if (formId === 'forgot-password-form') {
            forgotPasswordForm.classList.add('active');
            window.history.pushState(null, null, '#forgot-password-form');
        } else if (formId === 'success-message') {
            successMessage.classList.add('active');
        }
    }
    
    /**
     * Toggle password visibility
     * @param {HTMLElement} button - The toggle button element
     */
    function togglePasswordVisibility(button) {
        const targetId = button.getAttribute('data-target');
        const passwordInput = document.getElementById(targetId);
        const icon = button.querySelector('i');
        
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
     * Validate email format
     * @param {string} email - The email to validate
     * @returns {boolean} - True if email is valid
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Validate password strength
     * @param {string} password - The password to validate
     * @returns {Object} - Validation result with isValid and message
     */
    function validatePassword(password) {
        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }
        
        if (!/\d/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one number' };
        }
        
        if (!/[a-zA-Z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one letter' };
        }
        
        return { isValid: true, message: 'Password is valid' };
    }
    
    /**
     * Handle sign in form submission
     * @param {Event} event - The form submission event
     */
    function handleSignIn(event) {
        event.preventDefault();
        
        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value;
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // In a real application, this would send data to a server
        console.log('Sign in attempt:', { email, password });
        
        // Simulate API call
        setTimeout(() => {
            alert('Sign in successful! Redirecting to homepage...');
            // In a real app, you would redirect to the dashboard or homepage
            // window.location.href = 'index.html';
        }, 500);
    }
    
    /**
     * Handle sign up form submission
     * @param {Event} event - The form submission event
     */
    function handleSignUp(event) {
        event.preventDefault();
        
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Basic validation
        if (!email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            alert(passwordValidation.message);
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Check terms agreement
        const termsAgreed = document.getElementById('terms').checked;
        if (!termsAgreed) {
            alert('Please agree to the Terms of Service and Privacy Policy');
            return;
        }
        
        // In a real application, this would send data to a server
        console.log('Sign up attempt:', { email, password });
        
        // Simulate API call
        setTimeout(() => {
            alert('Account created successfully! Please check your email to verify your account.');
            switchForm('signin-form');
        }, 500);
    }
    
    /**
     * Handle forgot password form submission
     * @param {Event} event - The form submission event
     */
    function handleForgotPassword(event) {
        event.preventDefault();
        
        const email = document.getElementById('forgot-email').value.trim();
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // In a real application, this would send data to a server
        console.log('Password reset requested for:', email);
        
        // Simulate API call
        setTimeout(() => {
            switchForm('success-message');
        }, 500);
    }
    
    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        // Menu toggle button
        menuToggle.addEventListener('click', toggleMenu);
        
        // Close menu button
        closeMenu.addEventListener('click', closeSideMenu);
        
        // Overlay click to close menu
        overlay.addEventListener('click', closeSideMenu);
        
        // Search functionality
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', handleSearchKeyPress);
        
        // Menu item clicks - close menu when an item is clicked
        const menuItems = document.querySelectorAll('.menu-item a');
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.href.includes('index.html')) {
                    e.preventDefault();
                    closeSideMenu();
                    
                    // Get the text of the clicked menu item
                    const menuText = e.target.textContent || e.target.innerText;
                    console.log(`Menu item clicked: ${menuText}`);
                    
                    // Show a feedback message
                    alert(`Navigating to ${menuText}. You will be redirected to the homepage.`);
                }
            });
        });
        
        // Authentication tabs
        signinTab.addEventListener('click', () => switchForm('signin-form'));
        signupTab.addEventListener('click', () => switchForm('signup-form'));
        
        // Form navigation links
        goToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('signup-form');
        });
        
        goToSignin.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('signin-form');
        });
        
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('forgot-password-form');
        });
        
        backToSignin.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('signin-form');
        });
        
        backToAuth.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('signin-form');
        });
        
        // Password visibility toggles
        const togglePasswordButtons = document.querySelectorAll('.toggle-password');
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', () => togglePasswordVisibility(button));
        });
        
        // Form submissions
        signinFormElement.addEventListener('submit', handleSignIn);
        signupFormElement.addEventListener('submit', handleSignUp);
        forgotPasswordFormElement.addEventListener('submit', handleForgotPassword);
        
        // Top links
        const topLinks = document.querySelectorAll('.top-link');
        topLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (!e.target.href.includes('index.html')) {
                    e.preventDefault();
                    const linkText = e.target.textContent || e.target.innerText;
                    alert(`Navigating to ${linkText}. In a real application, this would load the appropriate page.`);
                }
            });
        });
    }
    
    /**
     * Handle URL hash for direct navigation to forms
     */
    function handleHashNavigation() {
        if (hash === '#signup-form') {
            switchForm('signup-form');
        } else if (hash === '#forgot-password-form') {
            switchForm('forgot-password-form');
        } else {
            // Default to sign in form
            switchForm('signin-form');
        }
    }
    
    /**
     * Initialize the authentication page
     */
    function init() {
        console.log('Cell Noun authentication page initialized');
        initEventListeners();
        handleHashNavigation();
        
        // Add a welcome message in console
        console.log('Welcome to Cell Noun Authentication!');
    }
    
    // Initialize the page
    init();
});