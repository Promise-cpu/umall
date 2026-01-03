// Auth state management for header component

class AuthStateManager {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is logged in from localStorage
        this.checkLoginStatus();
        this.setupEventListeners();
        this.updateHeader();
    }

    checkLoginStatus() {
        // Check localStorage for login status
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isLoggedIn = true;
            } catch (e) {
                console.error('Error parsing user data:', e);
                this.logout();
            }
        }
    }

    setupEventListeners() {
        // Logout link click handler
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Listen for login events from other pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'user') {
                this.checkLoginStatus();
                this.updateHeader();
            }
        });
    }

    updateHeader() {
        const loggedInLinks = document.getElementById('logged-in-links');
        const loggedOutLinks = document.getElementById('logged-out-links');
        const usernameDisplay = document.getElementById('username-display');

        if (this.isLoggedIn && this.currentUser) {
            // Show logged in state
            if (loggedInLinks) loggedInLinks.style.display = 'flex';
            if (loggedOutLinks) loggedOutLinks.style.display = 'none';
            
            // Display username
            if (usernameDisplay) {
                usernameDisplay.textContent = `Hi, ${this.currentUser.username || this.currentUser.email || 'User'}`;
            }
        } else {
            // Show logged out state
            if (loggedInLinks) loggedInLinks.style.display = 'none';
            if (loggedOutLinks) loggedOutLinks.style.display = 'flex';
        }
    }

    login(userData) {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        this.currentUser = userData;
        this.isLoggedIn = true;
        this.updateHeader();
        
        // Dispatch event for other components
        window.dispatchEvent(new Event('userLogin'));
    }

    logout() {
        // Clear user data
        localStorage.removeItem('user');
        this.currentUser = null;
        this.isLoggedIn = false;
        this.updateHeader();
        
        // Redirect to home page (optional)
        if (window.location.pathname.includes('profile.html') || 
            window.location.pathname.includes('manage-listing.html')) {
            window.location.href = 'index.html';
        }
        
        // Dispatch event for other components
        window.dispatchEvent(new Event('userLogout'));
    }

    // Helper method to get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Helper method to check if user is logged in
    getIsLoggedIn() {
        return this.isLoggedIn;
    }
}

// Initialize auth state manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authState = new AuthStateManager();
});