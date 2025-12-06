// --- 1. BOUNCER CHECK ---
document.addEventListener('DOMContentLoaded', () => {
    const session = sessionStorage.getItem('bolt_user');
    if (!session) {
        window.location.href = '../login.html';
        return;
    }
    const user = JSON.parse(session);
    if (user.type !== 'admin') {
        alert("Access Denied");
        window.location.href = '../login.html';
        return;
    }

    // Load initial data
    loadStats();
});

// --- 2. NAVIGATION ---
function showSection(id) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(id).classList.add('active');
    
    const navItems = document.querySelectorAll('.nav-item');
    if(id === 'dashboard') navItems[0].classList.add('active');
    if(id === 'drivers') { navItems[1].classList.add('active'); loadDrivers(); }
    if(id === 'riders') { navItems[2].classList.add('active'); loadRiders(); }
}

// --- 3. LOAD DATA ---
async function loadStats() {
    try {
        const res = await fetch('http://localhost:8000/cgi-script/cgi-bin/admin_actions.js?action=stats');
        const data = await res.json();
        if (data.status === 'success') {
            document.getElementById('count-drivers').textContent = data.drivers;
            document.getElementById('count-riders').textContent = data.riders;
            document.getElementById('count-rides').textContent = data.rides;
            document.getElementById('count-revenue').textContent = '₦' + parseFloat(data.revenue).toLocaleString();
        }
    } catch (e) { console.error(e); }
}

async function loadDrivers() {
    const tbody = document.getElementById('drivers-table');
    tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    try {
        const res = await fetch('http://localhost:8000/cgi-script/cgi-bin/admin_actions.js?action=drivers');
        const result = await res.json();
        
        if (result.status === 'success' && result.data.length > 0) {
            tbody.innerHTML = result.data.map(d => {
                // Format Vehicle Display
                let vehicleInfo = '<span style="color:#999; font-style:italic;">No Vehicle</span>';
                if (d.plate_number) {
                    vehicleInfo = `<strong>${d.plate_number}</strong><br><span style="font-size:11px; color:#666;">${d.model || ''} ${d.color || ''}</span>`;
                }

                return `
                <tr>
                    <td>#${d.driver_id}</td>
                    <td>${d.name}</td>
                    <td>${d.phone}</td>
                    <td>${d.license_number}</td>
                    <td>${vehicleInfo}</td>
                    <td>
                        <button class="btn-delete" onclick="deleteUser('driver', ${d.driver_id})">Delete</button>
                    </td>
                </tr>
            `}).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6">No drivers found.</td></tr>';
        }
    } catch (e) { console.error(e); }
}

async function loadRiders() {
    const tbody = document.getElementById('riders-table');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    try {
        const res = await fetch('http://localhost:8000/cgi-script/cgi-bin/admin_actions.js?action=riders');
        const result = await res.json();
        
        if (result.status === 'success' && result.data.length > 0) {
            tbody.innerHTML = result.data.map(r => `
                <tr>
                    <td>#${r.rider_id}</td>
                    <td>${r.name}</td>
                    <td>${r.email}</td>
                    <td>${r.phone}</td>
                    <td>
                        <button class="btn-delete" onclick="deleteUser('rider', ${r.rider_id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5">No riders found.</td></tr>';
        }
    } catch (e) { console.error(e); }
}

// --- 4. ACTIONS ---
async function deleteUser(type, id) {
    if(!confirm(`Are you sure you want to permanently delete this ${type}?`)) return;

    try {
        const res = await fetch('http://localhost:8000/cgi-script/cgi-bin/admin_actions.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: `delete_${type}`, id: id })
        });
        const result = await res.json();
        
        if (result.status === 'success') {
            alert('Deleted successfully');
            if (type === 'driver') loadDrivers();
            else loadRiders();
            loadStats(); 
        } else {
            alert('Error: ' + result.message);
        }
    } catch (e) { alert('Network Error'); }
}

function logout() {
    if(confirm('Log out?')) {
        sessionStorage.removeItem('bolt_user');
        window.location.href = '../login.html';
    }
}