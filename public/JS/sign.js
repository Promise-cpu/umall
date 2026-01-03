/**
 * Cell Noun Authentication - Optimized Version
 * Email-first verification flow
 */

document.addEventListener('DOMContentLoaded', function() {
    // State management
    let state = {
        userEmail: '',
        verificationCode: '',
        isVerified: false
    };
    
    // DOM elements
    const pages = {
        signin: document.getElementById('signin-page'),
        signup: document.getElementById('signup-page'),
        verify: document.getElementById('verification-page'),
        password: document.getElementById('password-setup-page'),
        success: document.getElementById('signup-success-page'),
        reset: document.getElementById('reset-request-page')
    };
    
    // Forms
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const verifyForm = document.getElementById('verificationForm');
    const passwordForm = document.getElementById('passwordSetupForm');
    const resetForm = document.getElementById('resetRequestForm');
    
    // Inputs
    const codeInputs = Array.from({length: 6}, (_, i) => 
        document.getElementById(`code${i + 1}`)
    );
    
    // Initialize
    init();
    
    function init() {
        setupEventListeners();
        setupVerificationInputs();
        
        // Check URL for page
        const hash = window.location.hash.substring(1);
        if (hash && pages[hash]) {
            showPage(hash);
        }
    }
    
    function showPage(pageName) {
        // Hide all pages
        Object.values(pages).forEach(page => {
            if (page) page.classList.remove('active');
        });
        
        // Show requested page
        if (pages[pageName]) {
            pages[pageName].classList.add('active');
            window.location.hash = pageName;
        }
        
        // Clear errors
        clearErrors();
    }
    
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    }
    
    function showError(elementId, message) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = message;
    }
    
    // Event Listeners
    function setupEventListeners() {
        // Navigation
        document.getElementById('go-to-signup')?.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('signup');
        });
        
        document.getElementById('go-to-signin')?.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('signin');
        });
        
        document.getElementById('back-to-signup')?.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('signup');
        });
        
        document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('reset');
        });
        
        document.getElementById('back-to-signin-from-reset')?.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('signin');
        });
        
        document.getElementById('go-to-signin-from-success')?.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('signin');
        });
        
        // Form submissions
        signupForm?.addEventListener('submit', handleEmailVerification);
        verifyForm?.addEventListener('submit', handleCodeVerification);
        passwordForm?.addEventListener('submit', handlePasswordSetup);
        signinForm?.addEventListener('submit', handleSignIn);
        resetForm?.addEventListener('submit', handlePasswordReset);
        
        // Password toggles
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                const input = document.getElementById(target);
                const icon = this.querySelector('i');
                
                if (input && icon) {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
                }
            });
        });
    }
    
    // Email verification handler
    async function handleEmailVerification(e) {
        e.preventDefault();
        clearErrors();
        
        const email = document.getElementById('signup-email').value.trim();
        
        if (!email) {
            showError('signup-email-error', 'Email is required');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('signup-email-error', 'Please enter a valid email');
            return;
        }
        
        // Store email in state
        state.userEmail = email;
        
        // Generate and send verification code
        state.verificationCode = generateCode();
        console.log('Generated code:', state.verificationCode); // For debugging
        
        try {
            const sent = await sendEmail(email, state.verificationCode, 'verification');
            
            if (sent) {
                // Update UI and show verification page
                document.getElementById('verification-email-display').textContent = email;
                showPage('verify');
                
                // Clear email input
                document.getElementById('signup-email').value = '';
            }
        } catch (error) {
            showError('signup-email-error', 'Failed to send verification email');
            console.error('Email error:', error);
            
            // Fallback: show code for testing
            alert(`For testing: Your code is ${state.verificationCode}`);
            document.getElementById('verification-email-display').textContent = email;
            showPage('verify');
        }
    }
    
    // Code verification handler
    function handleCodeVerification(e) {
        e.preventDefault();
        
        const enteredCode = codeInputs.map(input => input.value).join('');
        
        if (enteredCode.length !== 6) {
            showError('verification-code-error', 'Please enter the complete code');
            return;
        }
        
        if (enteredCode === state.verificationCode) {
            state.isVerified = true;
            
            // Enable password fields
            const passwordFields = ['signup-password', 'confirm-password'];
            passwordFields.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.disabled = false;
                    field.focus();
                }
            });
            
            showPage('password');
            clearErrors();
        } else {
            showError('verification-code-error', 'Incorrect verification code');
            
            // Clear inputs on wrong code
            codeInputs.forEach(input => {
                input.value = '';
                input.classList.remove('verified');
            });
            codeInputs[0].focus();
        }
    }
    
    // Password setup handler
    function handlePasswordSetup(e) {
        e.preventDefault();
        clearErrors();
        
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('confirm-password').value;
        
        // Validate password
        const passwordValid = validatePassword(password);
        if (!passwordValid.valid) {
            showError('signup-password-error', passwordValid.message);
            return;
        }
        
        if (password !== confirm) {
            showError('confirm-password-error', 'Passwords do not match');
            return;
        }
        
        // Save user to localStorage (simulated database)
        saveUser(state.userEmail, password);
        
        // Show success page
        showPage('success');
        
        // Reset state
        state = { userEmail: '', verificationCode: '', isVerified: false };
    }
    
    // Sign in handler
    function handleSignIn(e) {
        e.preventDefault();
        clearErrors();
        
        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value;
        
        // Validate
        if (!email || !password) {
            showError('signin-email-error', 'Email and password are required');
            return;
        }
        
        // Check user exists (from localStorage)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
            showError('signin-email-error', 'No account found with this email');
            return;
        }
        
        if (user.password !== password) {
            showError('signin-password-error', 'Incorrect password');
            return;
        }
        
        // Save session
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    }
    
    // Password reset handler
    async function handlePasswordReset(e) {
        e.preventDefault();
        clearErrors();
        
        const email = document.getElementById('reset-email').value.trim();
        
        if (!email) {
            showError('reset-email-error', 'Email is required');
            return;
        }
        
        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(u => u.email === email);
        
        if (!userExists) {
            showError('reset-email-error', 'No account found with this email');
            return;
        }
        
        // Generate reset code
        const resetCode = generateCode();
        console.log('Reset code:', resetCode); // For debugging
        
        try {
            const sent = await sendEmail(email, resetCode, 'reset');
            
            if (sent) {
                alert(`Reset code sent to ${email}\nFor testing, code is: ${resetCode}`);
                showPage('signin');
            }
        } catch (error) {
            showError('reset-email-error', 'Failed to send reset email');
            console.error('Reset email error:', error);
        }
    }
    
    // Email sending function
    async function sendEmail(to, code, type) {
        try {
            const templateId = type === 'verification' 
                ? 'template_mgdn1p7' 
                : 'template_90nk5yc';
            
            const response = await emailjs.send(
                'service_gb5yh0l',
                templateId,
                {
                    to_email: to,
                    verification_code: code,
                    app_name: 'U-Mall'
                }
            );
            
            return response.status === 200;
        } catch (error) {
            console.error('EmailJS error:', error);
            throw error;
        }
    }
    
    // Helper functions
    function setupVerificationInputs() {
        codeInputs.forEach((input, index) => {
            if (!input) return;
            
            input.addEventListener('input', function(e) {
                const value = this.value;
                
                // Only allow numbers
                if (!/^\d*$/.test(value)) {
                    this.value = '';
                    return;
                }
                
                // Auto-advance
                if (value && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            });
            
            // Handle backspace
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && !this.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
        });
    }
    
    function generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function validatePassword(password) {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters' };
        }
        
        if (!/[a-zA-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain letters' };
        }
        
        if (!/\d/.test(password)) {
            return { valid: false, message: 'Password must contain numbers' };
        }
        
        return { valid: true, message: '' };
    }
    
    function saveUser(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Remove existing user if any
        const filteredUsers = users.filter(u => u.email !== email);
        
        // Add new user
        const user = {
            id: Date.now().toString(),
            email: email,
            password: password,
            verified: true,
            createdAt: new Date().toISOString()
        };
        
        filteredUsers.push(user);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        
        console.log('User saved:', user);
    }
});