document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    // Safety check: if form doesn't exist, don't run the code
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        // --- 1. STOP THE REFRESH (Crucial) ---
        // This stops the browser from reloading the page automatically
        e.preventDefault();

        // --- 2. UI Feedback (Loading State) ---
        const originalText = submitButton.textContent;
        submitButton.disabled = true;           // Prevent double-clicks
        submitButton.textContent = 'Logging in...'; 
        submitButton.style.opacity = '0.7';     // Visual "disabled" look
        
        // Clear previous error messages
        const emailError = document.getElementById('email-error');
        const passError = document.getElementById('password-error');
        if (emailError) emailError.textContent = '';
        if (passError) passError.textContent = '';

        // --- 3. Collect Data ---
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Basic client-side validation
        if (!email || !password) {
            if (!email && emailError) emailError.textContent = 'Email is required';
            if (!password && passError) passError.textContent = 'Password is required';
            resetButton(submitButton, originalText);
            return;
        }

        try {
            // --- 4. Send to Node.js Backend ---
            const res = await fetch('http://localhost:8000/cgi-script/cgi-bin/login.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await res.json();
            console.log(res.json)

            // --- 5. Handle Response ---
            if (result.status === 'success') {
                console.log('✓ Login successful:', result.user);
                
                // Store user session
                sessionStorage.setItem('bolt_user', JSON.stringify(result.user));
                
                // Show success on button
                submitButton.textContent = 'Success!';
                submitButton.style.backgroundColor = '#4CAF50'; // Green

                // Redirect based on user type (using localhost:8000)
                // setTimeout(() => {
                //     if (result.user.type === 'rider') {
                //         window.location.href = 'http://localhost:8000/frontend/customer/customerhome.html';
                //     } else {
                //         window.location.href = 'http://localhost:8000/frontend/driver/driver-dashboard.html';
                //     }
                // }, 500);
                 setTimeout(() => {
                        window.location.href = 'http://localhost:8000/frontend/customer/customerhome.html';
                   
                }, 500); // Small delay to let user see "Success!"

            } else {
                // Show Error from Backend
                console.error('Login failed:', result.message);
                
                const msg = (result.message || '').toLowerCase();
                
                // Map errors to specific fields if possible
                if (msg.includes('email') || msg.includes('user')) {
                    if (emailError) emailError.textContent = result.message;
                } else if (msg.includes('password')) {
                    if (passError) passError.textContent = result.message;
                } else {
                    alert('❌ ' + result.message);
                }
                
                // Reset button so they can try again
                resetButton(submitButton, originalText);
            }

        } catch (err) {
            console.error('Fetch Error:', err);
            alert('❌ Connection Error: Ensure Node server is running (node server.js)');
            resetButton(submitButton, originalText);
        }
    });
});

// Helper to reset button state
function resetButton(button, originalText) {
    button.disabled = false;
    button.textContent = originalText;
    button.style.opacity = '1';
    button.style.backgroundColor = ''; // Reset color
}
