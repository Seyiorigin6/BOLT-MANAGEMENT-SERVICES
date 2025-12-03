document.addEventListener('DOMContentLoaded', () => {
    // --- 1. BOUNCER CHECK ---
    const session = sessionStorage.getItem('bolt_user');
    if (!session) {
        window.location.href = '../login.html';
        return;
    }
    const driver = JSON.parse(session);
    document.getElementById('driver-name-display').textContent = driver.name || 'Driver';

    // --- 2. LOGOUT ---
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm('Log out?')) {
            sessionStorage.removeItem('bolt_user');
            window.location.href = '../login.html';
        }
    });

    // --- 3. VEHICLE MANAGER (New) ---
    const checkVehicle = async () => {
        const displayDiv = document.getElementById('vehicle-display');
        const formDiv = document.getElementById('vehicle-form');

        try {
            const res = await fetch(`http://localhost:8000/cgi-script/cgi-bin/manage_vehicle.js?driver_id=${driver.id}`);
            const result = await res.json();

            if (result.status === 'success') {
                // Vehicle Exists -> Show Display
                const v = result.vehicle;
                document.getElementById('d-plate').textContent = v.plate_number;
                document.getElementById('d-model').textContent = v.model;
                document.getElementById('d-color').textContent = v.color;
                
                displayDiv.style.display = 'block';
                formDiv.style.display = 'none';
            } else {
                // No Vehicle -> Show Form
                displayDiv.style.display = 'none';
                formDiv.style.display = 'grid'; // Grid layout for form
            }
        } catch (e) { console.error(e); }
    };

    // Handle Vehicle Form Submit
    document.getElementById('vehicle-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            driver_id: driver.id,
            plate_number: document.getElementById('plate_number').value,
            model: document.getElementById('model').value,
            color: document.getElementById('color').value
        };

        try {
            const res = await fetch('http://localhost:8000/cgi-script/cgi-bin/manage_vehicle.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            
            if (result.status === 'success') {
                alert('Vehicle Added Successfully!');
                checkVehicle(); // Refresh to show the display view
            } else {
                alert('Error: ' + result.message);
            }
        } catch (e) { alert('Server Error'); }
    });

    // --- 4. LOAD & CALCULATE HISTORY (Existing) ---
    const loadHistory = async () => {
        const tbody = document.getElementById('history-body');
        const earningsDisplay = document.getElementById('total-earnings');
        const tripsDisplay = document.getElementById('total-trips');

        try {
            const res = await fetch(`http://localhost:8000/cgi-script/cgi-bin/get_driver_history.js?driver_id=${driver.id}`);
            const result = await res.json();

            if (result.status === 'success' && result.data.length > 0) {
                let totalMoney = 0;
                let totalCount = 0;

                tbody.innerHTML = result.data.map(ride => {
                    totalMoney += parseFloat(ride.fare_amount || 0);
                    totalCount++;
                    return `
                    <tr>
                        <td>${new Date(ride.accepted_at || ride.requested_at).toLocaleDateString()}</td>
                        <td>${ride.pickup_location}</td>
                        <td>${ride.dropoff_location}</td>
                        <td>₦${ride.fare_amount}</td>
                        <td>${ride.status}</td>
                    </tr>`;
                }).join('');

                earningsDisplay.textContent = `₦${totalMoney.toLocaleString()}`;
                tripsDisplay.textContent = totalCount;
            } else {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No trips yet.</td></tr>';
            }
        } catch (e) { console.error(e); }
    };

    // --- 5. LOAD REQUESTS (Existing) ---
    const loadRequests = async () => {
        const tbody = document.getElementById('requests-body');
        try {
            const res = await fetch('http://localhost:8000/cgi-script/cgi-bin/get_available_rides.js');
            const result = await res.json();

            if (result.status === 'success' && result.data.length > 0) {
                tbody.innerHTML = result.data.map(ride => `
                    <tr>
                        <td>${ride.pickup_location}</td>
                        <td>${ride.dropoff_location}</td>
                        <td style="font-weight:bold;">₦${ride.fare_amount}</td>
                        <td><button class="btn-accept" onclick="acceptRide(${ride.ride_id})">Accept</button></td>
                    </tr>`).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No new requests.</td></tr>';
            }
        } catch (e) { console.error(e); }
    };

    window.acceptRide = async (rideId) => {
        if (!confirm("Accept this ride?")) return;
        try {
            const res = await fetch('http://localhost:8000/cgi-script/cgi-bin/accept_ride.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ride_id: rideId, driver_id: driver.id })
            });
            const result = await res.json();
            if (result.status === 'success') {
                alert("✅ Ride Accepted!");
                loadRequests();
                loadHistory();
            } else { alert("❌ " + result.message); loadRequests(); }
        } catch (e) { alert("Network Error"); }
    };

    // Initial Load
    checkVehicle(); // Check for car first
    loadHistory();
    loadRequests();
    setInterval(loadRequests, 10000);
}); 