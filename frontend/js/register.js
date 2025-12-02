document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const userType = document.getElementById('user-type');
    const licenceField = document.getElementById('licence-field');
    const submitButton = form.querySelector('button[type="submit"]');

    // Toggle licence field for drivers
    userType.addEventListener('change', () => {
        licenceField.style.display = userType.value === 'driver' ? 'block' : 'none';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable button and show loading state
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Registering...';

        // collect values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm-password').value;
        const type = userType.value;
        const licence = document.getElementById('licence-number')?.value.trim() || null;

        // DEBUG: Log all collected values
        console.log('=== FORM DATA COLLECTED ===');
        console.log('Name:', name);
        console.log('Phone:', phone);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Confirm:', confirm);
        console.log('User Type:', type);
        console.log('Licence:', licence);

        // simple client-side validation
        let valid = true;
        if (!name) { document.getElementById('name-error').textContent = 'Name required'; valid = false; } else { document.getElementById('name-error').textContent = ''; }
        if (!phone) { document.getElementById('phone-error').textContent = 'Phone required'; valid = false; } else { document.getElementById('phone-error').textContent = ''; }
        if (!email) { document.getElementById('email-error').textContent = 'Email required'; valid = false; } else { document.getElementById('email-error').textContent = ''; }
        if (!password) { document.getElementById('password-error').textContent = 'Password required'; valid = false; } else { document.getElementById('password-error').textContent = ''; }
        if (password !== confirm) { document.getElementById('confirm-password-error').textContent = 'Passwords do not match'; valid = false; } else { document.getElementById('confirm-password-error').textContent = ''; }
        if (type === 'driver' && !licence) { document.getElementById('licence-number-error').textContent = 'Licence required for drivers'; valid = false; } else if (type !== 'driver') { document.getElementById('licence-number-error').textContent = ''; }

        console.log('Validation Valid:', valid);
        if (!valid) {
            console.log('Validation failed, stopping submission');
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            return;
        }

        // prepare payload
        const payload = { name, phone, email, password, user_type: type };
        if (licence) payload.licence_number = licence;

        console.log('=== PAYLOAD TO SEND ===');
        console.log(JSON.stringify(payload, null, 2));

        try {
            console.log('Fetching from: http://localhost:8000/cgi-script/cgi-bin/register.cgi');
            
            const res = await fetch('http://localhost:8000/cgi-script/cgi-bin/register.cgi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

     

            console.log('=== RESPONSE STATUS ===');
            console.log('Status:', res.status);
            console.log('Status Text:', res.statusText);

            // Check if response is valid
            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
            }

            const result = await res.json();

            console.log('=== RESPONSE DATA ===');
            console.log(JSON.stringify(result, null, 2));

            if (result.status === 'success') {
                console.log('✓ Registration successful!');
                alert(`✓ Registered: ${result.message}\nYour Rider ID: ${result.rider_id || result.user_id || 'N/A'}`);
                form.reset();
                licenceField.style.display = 'none';
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            } else {
                console.error('✗ Server returned error:', result.message);
                // map server error to fields when possible
                const msg = (result.message || '').toLowerCase();
                if (msg.includes('email')) {
                    document.getElementById('email-error').textContent = result.message;
                } else if (msg.includes('phone')) {
                    document.getElementById('phone-error').textContent = result.message;
                } else if (msg.includes('password')) {
                    document.getElementById('password-error').textContent = result.message;
                } else {
                    alert('❌ Registration error: ' + result.message);
                }
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        } catch (err) {
            console.error('=== FETCH ERROR ===');
            console.error('Error:', err);
            console.error('Error message:', err.message);
            alert('❌ Network/Server error: ' + err.message + '\n\nMake sure:\n1. Server is running (python -m http.server --cgi 8000)\n2. CGI endpoint exists: cgi-script/cgi-bin/register.cgi\n3. Check console (F12) for details');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
});