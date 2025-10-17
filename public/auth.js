    function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleBtn = document.querySelector('.password-toggle');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        }



        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate login process
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.textContent = 'Signing In...';
            loginBtn.style.opacity = '0.7';
            
            setTimeout(() => {
                alert('Login successful! In a real app, you would be redirected to the dashboard.');
                loginBtn.textContent = 'Sign In';
                loginBtn.style.opacity = '1';
            }, 1500);
        });

        // Add loading animation on form submit
        document.getElementById('loginForm').addEventListener('submit', function() {
            document.querySelector('.login-container').style.transform = 'scale(0.98)';
            setTimeout(() => {
                document.querySelector('.login-container').style.transform = 'scale(1)';
            }, 200);
        });

        // sign up 
          // Form validation state
        const validation = {
            firstName: false,
            lastName: false,
            email: false,
            password: false,
            confirmPassword: false,
            terms: false
        };
        
        // Password strength checker
        function checkPasswordStrength(password) {
            const strengthBar = document.getElementById('strengthBar');
            const strengthText = document.getElementById('strengthText');
            
            let strength = 0;
            const checks = {
                length: password.length >= 8,
                lowercase: /[a-z]/.test(password),
                uppercase: /[A-Z]/.test(password),
                numbers: /\d/.test(password),
                symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            };
            
            strength = Object.values(checks).filter(Boolean).length;
            
            // Reset classes
            strengthBar.className = 'strength-fill';
            
            if (strength === 0) {
                strengthText.textContent = 'Enter a password';
                strengthText.style.color = '#6b7280';
            } else if (strength <= 2) {
                strengthBar.classList.add('strength-1');
                strengthText.textContent = 'Weak password';
                strengthText.style.color = '#ef4444';
            } else if (strength === 3) {
                strengthBar.classList.add('strength-2');
                strengthText.textContent = 'Fair password';
                strengthText.style.color = '#f59e0b';
            } else if (strength === 4) {
                strengthBar.classList.add('strength-3');
                strengthText.textContent = 'Good password';
                strengthText.style.color = '#10b981';
            } else {
                strengthBar.classList.add('strength-4');
                strengthText.textContent = 'Strong password';
                strengthText.style.color = '#059669';
            }
            
            return strength;
        }

        // Field validation
        function validateField(fieldName, value) {
            const errorElement = document.getElementById(fieldName + 'Error');
            let isValid = false;
            
            switch (fieldName) {
                case 'firstName':
                case 'lastName':
                    isValid = value.trim().length >= 2;
                    break;
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    isValid = emailRegex.test(value.trim());
                    break;
                    
                case 'password':
                    const strength = checkPasswordStrength(value);
                    isValid = value.length >= 8 && strength >= 3;
                    break;
                    
                case 'confirmPassword':
                    const passwordValue = document.getElementById('password').value;
                    isValid = value === passwordValue && value.length > 0;
                    break;
                    
                case 'terms':
                    isValid = document.getElementById('terms').checked;
                    break;
            }
            
            if (isValid) {
                errorElement.classList.remove('show');
            } else {
                errorElement.classList.add('show');
            }
            
            validation[fieldName] = isValid;
            updateSubmitButton();
            
            return isValid;
        }

        // Update submit button state
        function updateSubmitButton() {
            const submitBtn = document.getElementById('submitBtn');
            const isFormValid = Object.values(validation).every(valid => valid);
            submitBtn.disabled = !isFormValid;
        }

   
   

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Add input event listeners
            ['firstName', 'lastName', 'email', 'password', 'confirmPassword'].forEach(field => {
                const element = document.getElementById(field);
                element.addEventListener('input', (e) => {
                    validateField(field, e.target.value);
                });
                element.addEventListener('blur', (e) => {
                    validateField(field, e.target.value);
                });
            });

            // Terms checkbox
            document.getElementById('terms').addEventListener('change', (e) => {
                validateField('terms', e.target.checked);
            });

            // Form submission
            document.getElementById('signupForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate all fields
                const formData = new FormData(this);
                let isValid = true;
                
                ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'terms'].forEach(field => {
                    const value = field === 'terms' 
                        ? document.getElementById(field).checked
                        : formData.get(field) || '';
                    if (!validateField(field, value)) {
                        isValid = false;
                    }
                });
                
                if (isValid) {
                    const submitBtn = document.getElementById('submitBtn');
                    submitBtn.textContent = 'Creating Account...';
                    submitBtn.disabled = true;
                    
                    // Simulate API call
                    setTimeout(() => {
                        alert('Account created successfully! Please check your email for verification.');
                        submitBtn.textContent = 'Create Account';
                        submitBtn.disabled = false;
                        this.reset();
                        
                        // Reset validation state
                        Object.keys(validation).forEach(key => validation[key] = false);
                        updateSubmitButton();
                        
                        // Reset password strength
                        document.getElementById('strengthBar').className = 'strength-fill';
                        document.getElementById('strengthText').textContent = 'Enter a password';
                        document.getElementById('strengthText').style.color = '#6b7280';
                    }, 2000);
                }
            });
        });