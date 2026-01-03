/**
 * Business Details Page JavaScript
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get URL parameters to determine which business to display
    const urlParams = new URLSearchParams(window.location.search);
    const businessId = urlParams.get('id') || '1';
    
    // Fetch business data from localStorage (from listings page)
    function loadBusinessData() {
        // Get all businesses from localStorage
        const savedBusinesses = JSON.parse(localStorage.getItem('businessListings')) || [];
        
        // Find the specific business by ID
        const business = savedBusinesses.find(b => b.id == businessId);
        
        if (business) {
            updateBusinessDetails(business);
        } else {
            // Fallback to sample data if no business found
            loadSampleBusiness();
        }
    }
    
    // Load sample business data if no data in localStorage
    function loadSampleBusiness() {
        const sampleBusiness = {
            id: '1',
            name: 'Tech Gadgets Hub',
            campus: 'uli',
            category: 'Electronics & Gadgets',
            description: 'Tech Gadgets Hub is your one-stop shop for all electronic needs on campus. We specialize in providing quality gadgets, accessories, and repair services at student-friendly prices.',
            location: 'Block A, Room 12, Main Building, ULI Campus',
            hours: 'Monday - Friday: 8:00 AM - 6:00 PM',
            contact: '+234 812 345 6789',
            tags: ['Electronics', 'Gadgets', 'Repairs', 'Student Discount'],
            features: [
                'Phone and laptop repairs',
                'Quality headphones and speakers',
                'Chargers and power banks',
                'Study lamps and desk accessories',
                'Student discount available',
                'Warranty on all products'
            ],
            images: [
                { alt: 'Business Image 1' },
                { alt: 'Business Image 2' },
                { alt: 'Business Image 3' },
                { alt: 'Business Image 4' }
            ]
        };
        
        updateBusinessDetails(sampleBusiness);
    }
    
    // Update business details in the DOM
    function updateBusinessDetails(business) {
        // Update page title
        document.title = `${business.name} - U-Mall Marketplace`;
        
        // Update business name
        document.getElementById('business-name').textContent = business.name;
        
        // Update campus badge
        const campusBadge = document.getElementById('campus-name');
        if (campusBadge) {
            const campusName = getCampusName(business.campus).toUpperCase();
            campusBadge.textContent = campusName;
            setCampusBadgeColor(business.campus);
        }
        
        // Update tags
        const tagsContainer = document.getElementById('business-tags');
        if (tagsContainer && business.tags) {
            tagsContainer.innerHTML = '';
            business.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
        
        // Update contact info
        document.getElementById('business-location').textContent = business.location;
        document.getElementById('business-hours').textContent = business.hours;
        document.getElementById('business-contact').textContent = business.contact;
        
        // Update description
        document.getElementById('business-description').textContent = business.description;
        
        // Update features list
        const featuresList = document.getElementById('business-features');
        if (featuresList && business.features) {
            featuresList.innerHTML = '';
            business.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
                featuresList.appendChild(li);
            });
        }
        
        // Update contact button
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
            contactBtn.href = `tel:${business.contact}`;
        }
        
        // Update gallery
        updateGallery(business.images);
    }
    
    // Update gallery with business images
    function updateGallery(images) {
        const galleryGrid = document.getElementById('business-gallery');
        if (!galleryGrid || !images) return;
        
        galleryGrid.innerHTML = '';
        
        images.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            // If image has a URL, create an img element
            if (image.url) {
                const img = document.createElement('img');
                img.src = image.url;
                img.alt = image.alt || `Business Image ${index + 1}`;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                galleryItem.appendChild(img);
            } else {
                // Use placeholder if no image URL
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.innerHTML = `
                    <i class="fas fa-image"></i>
                    <span>${image.alt || `Business Image ${index + 1}`}</span>
                `;
                galleryItem.appendChild(placeholder);
            }
            
            galleryGrid.appendChild(galleryItem);
        });
    }
    
    // Set campus badge color based on campus
    function setCampusBadgeColor(campus) {
        const campusBadge = document.querySelector('.campus-badge-large');
        if (!campusBadge) return;
        
        const colors = {
            'uli': '#3498db',
            'awka': '#2ecc71',
            'igbariam': '#9b59b6',
            'online': '#f39c12'
        };
        
        campusBadge.style.backgroundColor = colors[campus] || '#2c3e50';
    }
    
    // Get campus display name
    function getCampusName(campusCode) {
        const campusNames = {
            'uli': 'ULI Campus',
            'awka': 'Awka Campus',
            'igbariam': 'Igbariam Campus',
            'online': 'Online Services'
        };
        return campusNames[campusCode] || 'Campus';
    }
    
    // Load header component
    function loadHeader() {
        fetch('header-component.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('main-header').innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading header:', error);
                // Fallback header
                document.getElementById('main-header').innerHTML = `
                    <div style="background: #2c3e50; color: white; padding: 20px;">
                        <a href="index.html" style="color: white; text-decoration: none;">
                            <h1 style="margin: 0;">U-Mall Marketplace</h1>
                        </a>
                    </div>
                `;
            });
    }
    
    // Initialize event listeners
    function initEventListeners() {
        // Share button functionality
        const shareButton = document.querySelector('.btn-outline');
        if (shareButton && shareButton.textContent.includes('Share')) {
            shareButton.addEventListener('click', function(e) {
                e.preventDefault();
                const businessName = document.getElementById('business-name').textContent;
                const shareText = `Check out ${businessName} on U-Mall Marketplace!`;
                
                if (navigator.share) {
                    navigator.share({
                        title: businessName,
                        text: shareText,
                        url: window.location.href
                    });
                } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
                        .then(() => {
                            alert('Link copied to clipboard!');
                        })
                        .catch(() => {
                            // Fallback for older browsers
                            const textArea = document.createElement('textarea');
                            textArea.value = `${shareText} ${window.location.href}`;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            alert('Link copied to clipboard!');
                        });
                }
            });
        }
    }
    
    /**
     * Initialize the page
     */
    function init() {
        console.log('Business details page initialized');
        console.log(`Loading business ID: ${businessId}`);
        
        loadHeader();
        loadBusinessData();
        initEventListeners();
        
        // Log which business is being viewed
        console.log(`Viewing business details for ID: ${businessId}`);
    }
    
    // Initialize the page
    init();
});