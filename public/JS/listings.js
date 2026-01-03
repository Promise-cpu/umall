/**
 * Listings Page JavaScript - Functional Version
 * Handles business listing creation with proper integration
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const listingForm = document.getElementById('listingForm');
    const businessNameInput = document.getElementById('businessName');
    const businessDescriptionInput = document.getElementById('businessDescription');
    const businessCategorySelect = document.getElementById('businessCategory');
    const campusLocationSelect = document.getElementById('campusLocation');
    const contactLinkInput = document.getElementById('contactLink');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const emailAddressInput = document.getElementById('emailAddress');
    const businessHoursInput = document.getElementById('businessHours');
    const contactInfoInput = document.getElementById('contactInfo');
    const coverPhotoUpload = document.getElementById('coverPhotoUpload');
    const additionalPhotosUpload = document.getElementById('additionalPhotosUpload');
    const coverPhotoUploadArea = document.getElementById('coverPhotoUploadArea');
    const additionalPhotosUploadArea = document.getElementById('additionalPhotosUploadArea');
    const coverPhotoPreview = document.getElementById('coverPhotoPreview');
    const additionalPhotosPreview = document.getElementById('additionalPhotosPreview');
    const descCharCount = document.getElementById('desc-char-count');
    const termsCheckbox = document.getElementById('listingTerms');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');
    
    // Uploaded files storage
    let coverPhoto = null;
    let additionalPhotos = [];
    
    /**
     * Initialize the page
     */
    function init() {
        console.log('Listings page initialized');
        initEventListeners();
        checkExistingBusiness();
    }
    
    /**
     * Check if user already has a business
     */
    function checkExistingBusiness() {
        const existingBusiness = getBusinessData();
        if (existingBusiness) {
            // Redirect to manage listing page if business already exists
            window.location.href = 'manage-listing.html';
        }
    }
    
    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        // Form submission
        listingForm.addEventListener('submit', handleFormSubmit);
        
        // Character count for description
        businessDescriptionInput.addEventListener('input', updateCharCount);
        
        // Cover photo upload
        coverPhotoUpload.addEventListener('change', handleCoverPhotoUpload);
        setupDragAndDrop(coverPhotoUploadArea, handleCoverPhotoUpload);
        
        // Additional photos upload
        additionalPhotosUpload.addEventListener('change', handleAdditionalPhotosUpload);
        setupDragAndDrop(additionalPhotosUploadArea, handleAdditionalPhotosUpload);
        
        // Terms checkbox
        termsCheckbox.addEventListener('change', validateForm);
        
        // Input validation on change
        const requiredInputs = [
            businessNameInput,
            businessDescriptionInput,
            businessCategorySelect,
            campusLocationSelect,
            contactLinkInput,
            coverPhotoUpload
        ];
        
        requiredInputs.forEach(input => {
            input.addEventListener('change', validateForm);
            if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                input.addEventListener('input', validateForm);
            }
        });
    }
    
    /**
     * Update character count for description
     */
    function updateCharCount() {
        const count = businessDescriptionInput.value.length;
        descCharCount.textContent = count;
    }
    
    /**
     * Setup drag and drop for upload areas
     */
    function setupDragAndDrop(uploadArea, callback) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop area
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        // Handle drop
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        function highlight() {
            uploadArea.classList.add('drag-over');
        }
        
        function unhighlight() {
            uploadArea.classList.remove('drag-over');
        }
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            const event = { target: { files } };
            callback(event);
        }
    }
    
    /**
     * Handle cover photo upload
     */
    function handleCoverPhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file
        if (!validateImageFile(file)) {
            showError('coverPhoto-error', 'Please upload a valid image file (JPG, PNG, GIF)');
            return;
        }
        
        // Clear any previous error
        clearError('coverPhoto-error');
        
        // Read and preview image
        const reader = new FileReader();
        reader.onload = function(e) {
            coverPhoto = {
                file: file,
                dataUrl: e.target.result
            };
            displayCoverPhotoPreview();
        };
        reader.readAsDataURL(file);
    }
    
    /**
     * Handle additional photos upload
     */
    function handleAdditionalPhotosUpload(e) {
        const files = Array.from(e.target.files);
        
        // Validate files
        const validFiles = files.filter(file => validateImageFile(file));
        
        // Limit to 3 files
        const remainingSlots = 3 - additionalPhotos.length;
        const filesToAdd = validFiles.slice(0, remainingSlots);
        
        if (filesToAdd.length < files.length) {
            showError('additionalPhotos-error', `Only ${remainingSlots} more photos allowed (max 3 total)`);
        }
        
        // Read and preview each image
        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                additionalPhotos.push({
                    file: file,
                    dataUrl: e.target.result
                });
                displayAdditionalPhotosPreview();
            };
            reader.readAsDataURL(file);
        });
        
        // Clear input for new selections
        additionalPhotosUpload.value = '';
    }
    
    /**
     * Validate image file
     */
    function validateImageFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        
        if (!validTypes.includes(file.type)) {
            return false;
        }
        
        if (file.size > maxSize) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Display cover photo preview
     */
    function displayCoverPhotoPreview() {
        coverPhotoPreview.innerHTML = '';
        
        if (!coverPhoto) return;
        
        const preview = document.createElement('div');
        preview.className = 'file-preview';
        preview.innerHTML = `
            <img src="${coverPhoto.dataUrl}" alt="Cover photo preview">
            <button type="button" class="remove-file" onclick="removeCoverPhoto()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        coverPhotoPreview.appendChild(preview);
    }
    
    /**
     * Display additional photos preview
     */
    function displayAdditionalPhotosPreview() {
        additionalPhotosPreview.innerHTML = '';
        
        additionalPhotos.forEach((photo, index) => {
            const preview = document.createElement('div');
            preview.className = 'file-preview';
            preview.innerHTML = `
                <img src="${photo.dataUrl}" alt="Photo ${index + 1}">
                <button type="button" class="remove-file" onclick="removeAdditionalPhoto(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            additionalPhotosPreview.appendChild(preview);
        });
    }
    
    /**
     * Remove cover photo
     */
    window.removeCoverPhoto = function() {
        coverPhoto = null;
        coverPhotoUpload.value = '';
        coverPhotoPreview.innerHTML = '';
    };
    
    /**
     * Remove additional photo
     */
    window.removeAdditionalPhoto = function(index) {
        additionalPhotos.splice(index, 1);
        displayAdditionalPhotosPreview();
    };
    
    /**
     * Handle form submission
     */
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Listing...';
        
        try {
            // Create business data object
            const businessData = {
                name: businessNameInput.value.trim(),
                description: businessDescriptionInput.value.trim(),
                category: businessCategorySelect.value,
                campus: campusLocationSelect.value,
                contactLink: contactLinkInput.value.trim(),
                phone: phoneNumberInput.value.trim() || null,
                email: emailAddressInput.value.trim() || null,
                hours: businessHoursInput.value.trim() || null,
                contactInfo: contactInfoInput.value.trim() || null,
                coverPhoto: coverPhoto ? coverPhoto.dataUrl : null,
                additionalPhotos: additionalPhotos.map(photo => photo.dataUrl),
                status: 'active',
                createdAt: new Date().toISOString(),
                views: 0
            };
            
            // Save to localStorage
            saveBusinessData(businessData);
            
            // Also save to marketplace listings
            addToMarketplaceListings(businessData);
            
            // Show success message
            setTimeout(() => {
                successModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 1000);
            
        } catch (error) {
            console.error('Error saving business:', error);
            alert('An error occurred. Please try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> List My Business';
        }
    }
    
    /**
     * Validate the form
     */
    function validateForm() {
        let isValid = true;
        
        // Clear all errors
        clearAllErrors();
        
        // Validate required fields
        if (!businessNameInput.value.trim()) {
            showError('businessName-error', 'Business name is required');
            isValid = false;
        }
        
        if (!businessDescriptionInput.value.trim()) {
            showError('businessDescription-error', 'Business description is required');
            isValid = false;
        } else if (businessDescriptionInput.value.trim().length < 20) {
            showError('businessDescription-error', 'Description must be at least 20 characters');
            isValid = false;
        }
        
        if (!businessCategorySelect.value) {
            showError('businessCategory-error', 'Please select a category');
            isValid = false;
        }
        
        if (!campusLocationSelect.value) {
            showError('campusLocation-error', 'Please select a campus location');
            isValid = false;
        }
        
        if (!contactLinkInput.value.trim()) {
            showError('contactLink-error', 'Contact link is required');
            isValid = false;
        } else if (!isValidUrl(contactLinkInput.value.trim())) {
            showError('contactLink-error', 'Please enter a valid URL');
            isValid = false;
        }
        
        if (!coverPhoto) {
            showError('coverPhoto-error', 'Cover photo is required');
            isValid = false;
        }
        
        if (!termsCheckbox.checked) {
            showError('terms-error', 'You must agree to the terms and conditions');
            isValid = false;
        }
        
        // Validate email if provided
        if (emailAddressInput.value.trim() && !isValidEmail(emailAddressInput.value.trim())) {
            showError('emailAddress-error', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate phone if provided
        if (phoneNumberInput.value.trim() && !isValidPhone(phoneNumberInput.value.trim())) {
            showError('phoneNumber-error', 'Please enter a valid phone number');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Validate URL
     */
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    /**
     * Validate email
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    /**
     * Validate phone number
     */
    function isValidPhone(phone) {
        const re = /^[\d\s\-\+\(\)]{10,}$/;
        return re.test(phone);
    }
    
    /**
     * Show error message
     */
    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        }
    }
    
    /**
     * Clear error message
     */
    function clearError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '';
        }
    }
    
    /**
     * Clear all errors
     */
    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.innerHTML = '';
        });
    }
    
    /**
     * Save business data to localStorage
     */
    function saveBusinessData(businessData) {
        localStorage.setItem('userBusiness', JSON.stringify(businessData));
        console.log('Business saved to localStorage:', businessData);
    }
    
    /**
     * Get business data from localStorage
     */
    function getBusinessData() {
        try {
            const data = localStorage.getItem('userBusiness');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading business data:', error);
            return null;
        }
    }
    
    /**
     * Add business to marketplace listings
     */
    function addToMarketplaceListings(businessData) {
        try {
            // Get existing listings or initialize empty array
            const listings = JSON.parse(localStorage.getItem('marketplaceListings') || '[]');
            
            // Add new listing with unique ID
            const newListing = {
                ...businessData,
                id: Date.now().toString(), // Simple unique ID
                status: 'approved',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Add to beginning of array
            listings.unshift(newListing);
            
            // Save back to localStorage
            localStorage.setItem('marketplaceListings', JSON.stringify(listings));
            
            console.log('Added to marketplace listings:', newListing);
            
        } catch (error) {
            console.error('Error adding to marketplace listings:', error);
        }
    }
    
    // Initialize the page
    init();
});

// Helper function for homepage to load listings
function loadMarketplaceListings() {
    try {
        const listings = JSON.parse(localStorage.getItem('marketplaceListings') || '[]');
        return listings;
    } catch (error) {
        console.error('Error loading marketplace listings:', error);
        return [];
    }
}