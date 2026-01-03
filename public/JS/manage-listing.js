/**
 * Manage Business Listing JavaScript
 * Single business listing management
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const noBusinessMessage = document.getElementById('no-business-message');
    const businessCard = document.getElementById('business-card');
    const editBusinessBtn = document.getElementById('edit-business-btn');
    const deleteBusinessBtn = document.getElementById('delete-business-btn');
    const editModal = document.getElementById('edit-modal');
    const deleteModal = document.getElementById('delete-modal');
    const successModal = document.getElementById('success-modal');
    const editForm = document.getElementById('edit-business-form');
    const deleteBusinessName = document.getElementById('delete-business-name');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const closeModalBtns = document.querySelectorAll('.close-modal, .btn-close-modal, .btn-cancel');
    
    // Business data (initialize from localStorage or use empty object)
    let businessData = loadBusinessData() || null;
    
    // Update UI based on whether user has a business
    function updateUI() {
        if (businessData) {
            // User has a business - show business card
            noBusinessMessage.style.display = 'none';
            businessCard.style.display = 'block';
            
            // Update business card with data
            document.getElementById('business-name').textContent = businessData.name;
            document.getElementById('business-category').textContent = getCategoryName(businessData.category);
            document.getElementById('business-location').textContent = businessData.location;
            document.getElementById('business-hours').textContent = businessData.hours || 'Not specified';
            document.getElementById('business-contact').textContent = businessData.contact;
            document.getElementById('business-description-text').textContent = businessData.description;
            document.getElementById('business-date').textContent = formatDate(businessData.createdAt);
            document.getElementById('business-status').textContent = 'Active';
            
            // Update placeholder color based on category
            updatePlaceholderColor(businessData.category);
        } else {
            // User doesn't have a business - show message
            noBusinessMessage.style.display = 'block';
            businessCard.style.display = 'none';
        }
    }
    
    /**
     * Initialize the page
     */
    function init() {
        console.log('Manage Business page initialized');
        updateUI();
        initEventListeners();
        
        // Check if user just created a business (from listings page)
        checkForNewBusiness();
    }
    
    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        // Edit business button
        if (editBusinessBtn) {
            editBusinessBtn.addEventListener('click', openEditModal);
        }
        
        // Delete business button
        if (deleteBusinessBtn) {
            deleteBusinessBtn.addEventListener('click', openDeleteModal);
        }
        
        // Edit form submission
        if (editForm) {
            editForm.addEventListener('submit', handleEditSubmit);
        }
        
        // Delete confirmation
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', handleDeleteBusiness);
        }
        
        // Modal close buttons
        closeModalBtns.forEach(button => {
            button.addEventListener('click', closeModals);
        });
        
        // Modal overlay click
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModals();
                }
            });
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModals();
            }
        });
    }
    
    /**
     * Check if user just created a business from listings page
     */
    function checkForNewBusiness() {
        // Check if there's a new business in localStorage (set by listings page)
        const newBusiness = localStorage.getItem('newBusiness');
        if (newBusiness) {
            try {
                businessData = JSON.parse(newBusiness);
                saveBusinessData();
                localStorage.removeItem('newBusiness'); // Clear the flag
                updateUI();
                showSuccess('Business created successfully!');
            } catch (error) {
                console.error('Error parsing new business data:', error);
            }
        }
    }
    
    /**
     * Open edit modal
     */
    function openEditModal() {
        if (!businessData) return;
        
        // Populate form with business data
        document.getElementById('edit-business-name').value = businessData.name || '';
        document.getElementById('edit-business-category').value = businessData.category || '';
        document.getElementById('edit-business-campus').value = businessData.campus || '';
        document.getElementById('edit-business-location').value = businessData.location || '';
        document.getElementById('edit-business-description').value = businessData.description || '';
        document.getElementById('edit-business-hours').value = businessData.hours || '';
        document.getElementById('edit-business-contact').value = businessData.contact || '';
        
        // Show modal
        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Open delete confirmation modal
     */
    function openDeleteModal() {
        if (!businessData) return;
        
        // Set business name in confirmation message
        deleteBusinessName.textContent = businessData.name;
        
        // Show modal
        deleteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Close all modals
     */
    function closeModals() {
        editModal.classList.remove('active');
        deleteModal.classList.remove('active');
        successModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    /**
     * Handle edit form submission
     * @param {Event} e - Form submit event
     */
    function handleEditSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const updatedBusiness = {
            name: document.getElementById('edit-business-name').value.trim(),
            category: document.getElementById('edit-business-category').value,
            campus: document.getElementById('edit-business-campus').value,
            location: document.getElementById('edit-business-location').value.trim(),
            description: document.getElementById('edit-business-description').value.trim(),
            hours: document.getElementById('edit-business-hours').value.trim() || null,
            contact: document.getElementById('edit-business-contact').value.trim(),
            updatedAt: new Date().toISOString()
        };
        
        // Keep original creation date
        if (businessData && businessData.createdAt) {
            updatedBusiness.createdAt = businessData.createdAt;
        } else {
            updatedBusiness.createdAt = new Date().toISOString();
        }
        
        // Validate required fields
        if (!updatedBusiness.name || !updatedBusiness.category || !updatedBusiness.campus || 
            !updatedBusiness.location || !updatedBusiness.description || !updatedBusiness.contact) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Update business data
        businessData = updatedBusiness;
        
        // Save to localStorage
        saveBusinessData();
        
        // Update UI
        updateUI();
        
        // Show success message
        showSuccess('Business updated successfully!');
        
        // Close modal
        closeModals();
    }
    
    /**
     * Handle business deletion
     */
    function handleDeleteBusiness() {
        // Clear business data
        businessData = null;
        
        // Remove from localStorage
        localStorage.removeItem('userBusiness');
        
        // Update UI
        updateUI();
        
        // Show success message
        alert('Business removed successfully.');
        
        // Close modal
        closeModals();
    }
    
    /**
     * Save business data to localStorage
     */
    function saveBusinessData() {
        if (businessData) {
            localStorage.setItem('userBusiness', JSON.stringify(businessData));
        }
    }
    
    /**
     * Load business data from localStorage
     */
    function loadBusinessData() {
        try {
            const saved = localStorage.getItem('userBusiness');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading business data:', error);
            return null;
        }
    }
    
    /**
     * Get category display name
     * @param {string} category - Category code
     * @returns {string} Category name
     */
    function getCategoryName(category) {
        const names = {
            'electronics': 'Electronics & Gadgets',
            'food': 'Food & Snacks',
            'books': 'Textbooks & Stationery',
            'dorm': 'Dorm Essentials',
            'services': 'Student Services',
            'lab': 'Lab Equipment',
            'accommodation': 'Accommodation',
            'fashion': 'Fashion & Clothing',
            'health': 'Health & Wellness',
            'other': 'Other'
        };
        return names[category] || 'Other';
    }
    
    /**
     * Update placeholder color based on category
     * @param {string} category - Category code
     */
    function updatePlaceholderColor(category) {
        const placeholder = document.querySelector('.img-placeholder');
        if (!placeholder) return;
        
        const colors = {
            'electronics': ['#3498db', '#2c3e50'],
            'food': ['#e74c3c', '#c0392b'],
            'books': ['#9b59b6', '#8e44ad'],
            'dorm': ['#1abc9c', '#16a085'],
            'services': ['#f39c12', '#d35400'],
            'lab': ['#34495e', '#2c3e50'],
            'accommodation': ['#e67e22', '#d35400'],
            'fashion': ['#e84393', '#fd79a8'],
            'health': ['#00b894', '#00a085'],
            'other': ['#636e72', '#2d3436']
        };
        
        const [color1, color2] = colors[category] || ['#3498db', '#2c3e50'];
        placeholder.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
    }
    
    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    function formatDate(dateString) {
        if (!dateString) return 'Recently';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    /**
     * Show success modal
     * @param {string} message - Success message to display
     */
    function showSuccess(message) {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.textContent = message;
        }
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            closeModals();
        }, 3000);
    }
    
    // Initialize the page
    init();
});

// Export function for listings page to call when creating a business
window.createNewBusiness = function(businessData) {
    // This function will be called from the listings page
    // Save business data to localStorage
    if (businessData && typeof businessData === 'object') {
        // Add creation timestamp
        businessData.createdAt = new Date().toISOString();
        localStorage.setItem('userBusiness', JSON.stringify(businessData));
        
        // Also set a flag for this page to detect
        localStorage.setItem('newBusiness', JSON.stringify(businessData));
        
        return true;
    }
    return false;
};