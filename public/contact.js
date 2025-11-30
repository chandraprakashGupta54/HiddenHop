// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const alertSuccess = document.getElementById('alertSuccess');
    const alertError = document.getElementById('alertError');
    const errorMessage = document.getElementById('errorMessage');

    // Hide alerts initially
    function hideAlerts() {
        alertSuccess.style.display = 'none';
        alertError.style.display = 'none';
    }

    // Show success alert
    function showSuccess(message) {
        hideAlerts();
        alertSuccess.querySelector('span').textContent = message;
        alertSuccess.style.display = 'flex';
        
        // Scroll to alert
        alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertSuccess.style.display = 'none';
        }, 5000);
    }

    // Show error alert
    function showError(message) {
        hideAlerts();
        errorMessage.textContent = message;
        alertError.style.display = 'flex';
        
        // Scroll to alert
        alertError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertError.style.display = 'none';
        }, 5000);
    }

    // Validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate phone number (10 digits)
    function validatePhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/\s|-/g, ''));
    }

    // Form validation
    function validateForm(formData) {
        const errors = [];

        if (formData.fullName.trim().length < 2) {
            errors.push('Full name must be at least 2 characters long');
        }

        if (!validateEmail(formData.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!validatePhone(formData.phone)) {
            errors.push('Please enter a valid 10-digit phone number');
        }

        if (formData.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }

        return errors;
    }

    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };

        // Validate form
        const validationErrors = validateForm(formData);
        
        if (validationErrors.length > 0) {
            showError(validationErrors[0]);
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        hideAlerts();

        try {
            // Send data to backend
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showSuccess('Message sent successfully! We\'ll get back to you soon.');
                contactForm.reset();
            } else {
                showError(result.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Network error. Please check your connection and try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    });

    // Add input animation effects
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Add focus class for animation
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });

        // Real-time validation feedback
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                validateField(this);
            }
        });
    });

    // Individual field validation with visual feedback
    function validateField(field) {
        let isValid = true;
        const value = field.value.trim();

        switch(field.id) {
            case 'fullName':
                isValid = value.length >= 2;
                break;
            case 'email':
                isValid = validateEmail(value);
                break;
            case 'phone':
                isValid = validatePhone(value);
                break;
            case 'message':
                isValid = value.length >= 10;
                break;
        }

        if (isValid) {
            field.style.borderColor = '#00c49a';
        } else {
            field.style.borderColor = '#dc3545';
        }

        // Reset border color after a short delay
        setTimeout(() => {
            field.style.borderColor = '#e0e0e0';
        }, 2000);
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll for fade-in elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});