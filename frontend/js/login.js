document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. UI Feedback
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Logging in...';
        
        // Clear previous errors
        const errorDisplay = document.getElementById('login-error') || { textContent: '' };
        errorDisplay.textContent = '';

        // 2. Collect Data
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            // 3. Send to Node.js Backend
            const res = await fetch('http://localhost:8000/cgi-script/cgi-bin/login.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await res.json();

            // 4. Handle Response
            if (result.status === 'success') {
                console.log('✓ Login successful:', result.user);
                
                // Store user info (Session Storage - clears on browser close)
                sessionStorage.setItem('bolt_user', JSON.stringify(result.user));
                
                // Redirect based on user type
                // Assuming your structure: frontend/customer/dashboard.html
                if (result.user.type === 'rider') {
                    window.location.href = 'customer/dashboard.html';
                } else {
                    window.location.href = 'driver/driver-dashboard.html';
                }

            } else {
                // Show Error
                console.error('Login failed:', result.message);
                
                // If you have an error div, show it there, otherwise alert
                if (document.getElementById('email-error')) {
                    document.getElementById('email-error').textContent = result.message;
                } else {
                    alert('❌ ' + result.message);
                }
            }

        } catch (err) {
            console.error('Fetch Error:', err);
            alert('❌ Connection Error: Ensure Node server is running (node server.js)');
        } finally {
            // Reset Button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
});