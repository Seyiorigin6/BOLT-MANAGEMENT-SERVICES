// Sample Data (In production, this would come from your backend API)
let drivers = [
    { id: 'D001', name: 'John Doe', phone: '+234 801 234 5678', email: 'john@bolt.com', license: 'LAG123456', vehicle: 'Toyota Camry - ABC123XY', status: 'AVAILABLE' },
    { id: 'D002', name: 'Jane Smith', phone: '+234 802 345 6789', email: 'jane@bolt.com', license: 'LAG234567', vehicle: 'Honda Accord - DEF456YZ', status: 'ON_TRIP' },
    { id: 'D003', name: 'Mike Johnson', phone: '+234 803 456 7890', email: 'mike@bolt.com', license: 'LAG345678', vehicle: 'Hyundai Elantra - GHI789ZA', status: 'OFFLINE' },
    { id: 'D004', name: 'Sarah Williams', phone: '+234 804 567 8901', email: 'sarah@bolt.com', license: 'LAG456789', vehicle: 'Kia Optima - JKL012AB', status: 'AVAILABLE' },
    { id: 'D005', name: 'David Brown', phone: '+234 805 678 9012', email: 'david@bolt.com', license: 'LAG567890', vehicle: 'Nissan Altima - MNO345CD', status: 'ON_TRIP' },
];

let riders = [
    { id: 'R001', name: 'Alice Brown', phone: '+234 804 567 8901', email: 'alice@example.com', totalRides: 45 },
    { id: 'R002', name: 'Bob Wilson', phone: '+234 805 678 9012', email: 'bob@example.com', totalRides: 32 },
    { id: 'R003', name: 'Carol Davis', phone: '+234 806 789 0123', email: 'carol@example.com', totalRides: 28 },
    { id: 'R004', name: 'Daniel Martinez', phone: '+234 807 890 1234', email: 'daniel@example.com', totalRides: 52 },
    { id: 'R005', name: 'Emma Taylor', phone: '+234 808 901 2345', email: 'emma@example.com', totalRides: 19 },
];

let rides = [
    { id: 'T001', rider: 'Alice Brown', driver: 'Jane Smith', pickup: 'Victoria Island', dropoff: 'Lekki Phase 1', distance: 8.5, status: 'IN_PROGRESS', fare: 2500, time: '10:30 AM' },
    { id: 'T002', rider: 'Bob Wilson', driver: 'John Doe', pickup: 'Ikeja', dropoff: 'Maryland', distance: 5.2, status: 'COMPLETED', fare: 1800, time: '09:15 AM' },
    { id: 'T003', rider: 'Carol Davis', driver: 'Mike Johnson', pickup: 'Surulere', dropoff: 'Yaba', distance: 4.0, status: 'REQUESTED', fare: 1500, time: '11:00 AM' },
    { id: 'T004', rider: 'Daniel Martinez', driver: 'David Brown', pickup: 'Ajah', dropoff: 'Ikoyi', distance: 12.3, status: 'IN_PROGRESS', fare: 3200, time: '10:45 AM' },
    { id: 'T005', rider: 'Emma Taylor', driver: 'Sarah Williams', pickup: 'Festac', dropoff: 'Apapa', distance: 6.7, status: 'COMPLETED', fare: 2000, time: '09:30 AM' },
];

let payments = [
    { id: 'P001', rideId: 'T002', amount: 1800, method: 'Card', date: '2024-11-24 09:30', status: 'Completed' },
    { id: 'P002', rideId: 'T001', amount: 2500, method: 'Cash', date: '2024-11-24 10:45', status: 'Pending' },
    { id: 'P003', rideId: 'T005', amount: 2000, method: 'Card', date: '2024-11-24 09:45', status: 'Completed' },
    { id: 'P004', rideId: 'T004', amount: 3200, method: 'Cash', date: '2024-11-24 11:00', status: 'Pending' },
];

// Initialize the dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    setupNavigation();
    setupSearchHandlers();
});

// Setup Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            // Show selected section
            const section = this.getAttribute('data-section');
            document.getElementById(section).classList.add('active');
            
            // Load section data
            loadSectionData(section);
        });
    });
}

// Load section data
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'drivers':
            loadDrivers();
            break;
        case 'riders':
            loadRiders();
            break;
        case 'rides':
            loadActiveRides();
            break;
        case 'payments':
            loadPayments();
            break;
    }
}

// Load Dashboard
function loadDashboard() {
    // Update statistics
    document.getElementById('totalDrivers').textContent = drivers.length;
    document.getElementById('activeRides').textContent = rides.filter(r => r.status === 'IN_PROGRESS').length;
    document.getElementById('totalRiders').textContent = riders.length;
    
    const todayRevenue = rides.reduce((sum, ride) => sum + ride.fare, 0);
    document.getElementById('todayRevenue').textContent = '₦' + todayRevenue.toLocaleString();
    
    // Load recent rides
    const tbody = document.getElementById('recentRidesTable');
    tbody.innerHTML = rides.map(ride => `
        <tr>
            <td>${ride.id}</td>
            <td>${ride.rider}</td>
            <td>${ride.driver}</td>
            <td><span class="status-badge status-${ride.status.toLowerCase().replace('_', '-')}">${ride.status}</span></td>
            <td>₦${ride.fare.toLocaleString()}</td>
            <td>${ride.time}</td>
        </tr>
    `).join('');
}

// Load Drivers
function loadDrivers(filteredDrivers = null) {
    const driversList = filteredDrivers || drivers;
    const tbody = document.getElementById('driversTable');
    
    if(driversList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No drivers found</td></tr>';
        return;
    }
    
    tbody.innerHTML = driversList.map(driver => `
        <tr>
            <td>${driver.id}</td>
            <td>${driver.name}</td>
            <td>${driver.phone}</td>
            <td>${driver.license}</td>
            <td>${driver.vehicle}</td>
            <td><span class="status-badge status-${driver.status.toLowerCase().replace('_', '-')}">${driver.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-small" onclick="viewDriver('${driver.id}')">View</button>
                    <button class="btn btn-success btn-small" onclick="approveDriver('${driver.id}')">Approve</button>
                    <button class="btn btn-danger btn-small" onclick="deactivateDriver('${driver.id}')">Deactivate</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load Riders
function loadRiders(filteredRiders = null) {
    const ridersList = filteredRiders || riders;
    const tbody = document.getElementById('ridersTable');
    
    if(ridersList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No riders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = ridersList.map(rider => `
        <tr>
            <td>${rider.id}</td>
            <td>${rider.name}</td>
            <td>${rider.phone}</td>
            <td>${rider.email}</td>
            <td>${rider.totalRides}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-small" onclick="viewRider('${rider.id}')">View</button>
                    <button class="btn btn-danger btn-small" onclick="suspendRider('${rider.id}')">Suspend</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load Active Rides
function loadActiveRides() {
    const tbody = document.getElementById('activeRidesTable');
    
    if(rides.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #999;">No active rides</td></tr>';
        return;
    }
    
    tbody.innerHTML = rides.map(ride => `
        <tr>
            <td>${ride.id}</td>
            <td>${ride.rider}</td>
            <td>${ride.driver}</td>
            <td>${ride.pickup}</td>
            <td>${ride.dropoff}</td>
            <td>${ride.distance} km</td>
            <td><span class="status-badge status-${ride.status.toLowerCase().replace('_', '-')}">${ride.status}</span></td>
            <td>
                <button class="btn btn-primary btn-small" onclick="viewRideDetails('${ride.id}')">Details</button>
            </td>
        </tr>
    `).join('');
}

// Load Payments
function loadPayments(filteredPayments = null) {
    const paymentsList = filteredPayments || payments;
    const tbody = document.getElementById('paymentsTable');
    
    if(paymentsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No payments found</td></tr>';
        return;
    }
    
    tbody.innerHTML = paymentsList.map(payment => `
        <tr>
            <td>${payment.id}</td>
            <td>${payment.rideId}</td>
            <td>₦${payment.amount.toLocaleString()}</td>
            <td>${payment.method}</td>
            <td>${payment.date}</td>
            <td><span class="status-badge status-${payment.status.toLowerCase()}">${payment.status}</span></td>
        </tr>
    `).join('');
}

// Driver Actions
function viewDriver(id) {
    const driver = drivers.find(d => d.id === id);
    if(!driver) return;
    
    document.getElementById('driverModalBody').innerHTML = `
        <div class="form-group">
            <label>Driver ID:</label>
            <input type="text" value="${driver.id}" readonly>
        </div>
        <div class="form-group">
            <label>Name:</label>
            <input type="text" value="${driver.name}" readonly>
        </div>
        <div class="form-group">
            <label>Phone:</label>
            <input type="text" value="${driver.phone}" readonly>
        </div>
        <div class="form-group">
            <label>Email:</label>
            <input type="text" value="${driver.email}" readonly>
        </div>
        <div class="form-group">
            <label>License Number:</label>
            <input type="text" value="${driver.license}" readonly>
        </div>
        <div class="form-group">
            <label>Vehicle:</label>
            <input type="text" value="${driver.vehicle}" readonly>
        </div>
        <div class="form-group">
            <label>Status:</label>
            <div style="margin-top: 8px;">
                <span class="status-badge status-${driver.status.toLowerCase().replace('_', '-')}">${driver.status}</span>
            </div>
        </div>
    `;
    openModal('driverModal');
}

function approveDriver(id) {
    if(confirm('Are you sure you want to approve this driver?')) {
        const driver = drivers.find(d => d.id === id);
        if(driver) {
            driver.status = 'AVAILABLE';
            loadDrivers();
            alert('Driver ' + id + ' has been approved and is now available!');
        }
    }
}

function deactivateDriver(id) {
    if(confirm('Are you sure you want to deactivate this driver?')) {
        const driver = drivers.find(d => d.id === id);
        if(driver) {
            driver.status = 'OFFLINE';
            loadDrivers();
            alert('Driver ' + id + ' has been deactivated!');
        }
    }
}

// Rider Actions
function viewRider(id) {
    const rider = riders.find(r => r.id === id);
    if(!rider) return;
    
    document.getElementById('riderModalBody').innerHTML = `
        <div class="form-group">
            <label>Rider ID:</label>
            <input type="text" value="${rider.id}" readonly>
        </div>
        <div class="form-group">
            <label>Name:</label>
            <input type="text" value="${rider.name}" readonly>
        </div>
        <div class="form-group">
            <label>Phone:</label>
            <input type="text" value="${rider.phone}" readonly>
        </div>
        <div class="form-group">
            <label>Email:</label>
            <input type="text" value="${rider.email}" readonly>
        </div>
        <div class="form-group">
            <label>Total Rides:</label>
            <input type="text" value="${rider.totalRides}" readonly>
        </div>
    `;
    openModal('riderModal');
}

function suspendRider(id) {
    if(confirm('Are you sure you want to suspend this rider?')) {
        alert('Rider ' + id + ' has been suspended!');
        // In production: Make API call to suspend rider
    }
}

// Ride Actions
function viewRideDetails(id) {
    const ride = rides.find(r => r.id === id);
    if(!ride) return;
    
    document.getElementById('rideModalBody').innerHTML = `
        <div class="form-group">
            <label>Ride ID:</label>
            <input type="text" value="${ride.id}" readonly>
        </div>
        <div class="form-group">
            <label>Rider:</label>
            <input type="text" value="${ride.rider}" readonly>
        </div>
        <div class="form-group">
            <label>Driver:</label>
            <input type="text" value="${ride.driver}" readonly>
        </div>
        <div class="form-group">
            <label>Pickup Location:</label>
            <input type="text" value="${ride.pickup}" readonly>
        </div>
        <div class="form-group">
            <label>Dropoff Location:</label>
            <input type="text" value="${ride.dropoff}" readonly>
        </div>
        <div class="form-group">
            <label>Distance:</label>
            <input type="text" value="${ride.distance} km" readonly>
        </div>
        <div class="form-group">
            <label>Fare:</label>
            <input type="text" value="₦${ride.fare.toLocaleString()}" readonly>
        </div>
        <div class="form-group">
            <label>Status:</label>
            <div style="margin-top: 8px;">
                <span class="status-badge status-${ride.status.toLowerCase().replace('_', '-')}">${ride.status}</span>
            </div>
        </div>
        <div class="form-group">
            <label>Time:</label>
            <input type="text" value="${ride.time}" readonly>
        </div>
    `;
    openModal('rideModal');
}

function refreshRides() {
    alert('Refreshing active rides...');
    loadActiveRides();
    // In production: Make API call to fetch latest rides
}

// Report Functions
function generateReport() {
    alert('Generating comprehensive system report...');
    // In production: Generate and download report
}

function generateDriverReport() {
    const output = document.getElementById('reportOutput');
    const availableDrivers = drivers.filter(d => d.status === 'AVAILABLE').length;
    const onTripDrivers = drivers.filter(d => d.status === 'ON_TRIP').length;
    const offlineDrivers = drivers.filter(d => d.status === 'OFFLINE').length;
    
    output.innerHTML = `
        <h3 style="margin-bottom: 15px; color: #333;">Driver Performance Report</h3>
        <div style="margin-bottom: 10px;"><strong>Total Drivers:</strong> ${drivers.length}</div>
        <div style="margin-bottom: 10px;"><strong>Available Drivers:</strong> ${availableDrivers}</div>
        <div style="margin-bottom: 10px;"><strong>On Trip:</strong> ${onTripDrivers}</div>
        <div style="margin-bottom: 10px;"><strong>Offline:</strong> ${offlineDrivers}</div>
        <div style="margin-bottom: 10px;"><strong>Availability Rate:</strong> ${((availableDrivers / drivers.length) * 100).toFixed(1)}%</div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 14px;">Report generated on: ${new Date().toLocaleString()}</p>
    `;
}

function generateRevenueReport() {
    const output = document.getElementById('reportOutput');
    const totalRevenue = rides.reduce((sum, ride) => sum + ride.fare, 0);
    const completedRides = rides.filter(r => r.status === 'COMPLETED');
    const avgFare = completedRides.length > 0 ? totalRevenue / completedRides.length : 0;
    const maxFare = rides.length > 0 ? Math.max(...rides.map(r => r.fare)) : 0;
    const minFare = rides.length > 0 ? Math.min(...rides.map(r => r.fare)) : 0;
    
    output.innerHTML = `
        <h3 style="margin-bottom: 15px; color: #333;">Revenue Report</h3>
        <div style="margin-bottom: 10px;"><strong>Total Revenue:</strong> ₦${totalRevenue.toLocaleString()}</div>
        <div style="margin-bottom: 10px;"><strong>Total Rides:</strong> ${rides.length}</div>
        <div style="margin-bottom: 10px;"><strong>Completed Rides:</strong> ${completedRides.length}</div>
        <div style="margin-bottom: 10px;"><strong>Average Fare:</strong> ₦${avgFare.toFixed(2)}</div>
        <div style="margin-bottom: 10px;"><strong>Highest Fare:</strong> ₦${maxFare.toLocaleString()}</div>
        <div style="margin-bottom: 10px;"><strong>Lowest Fare:</strong> ₦${minFare.toLocaleString()}</div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 14px;">Report generated on: ${new Date().toLocaleString()}</p>
    `;
}

function generateRideReport() {
    const output = document.getElementById('reportOutput');
    const totalDistance = rides.reduce((sum, ride) => sum + ride.distance, 0);
    const inProgressRides = rides.filter(r => r.status === 'IN_PROGRESS').length;
    const completedRides = rides.filter(r => r.status === 'COMPLETED').length;
    const requestedRides = rides.filter(r => r.status === 'REQUESTED').length;
    
    output.innerHTML = `
        <h3 style="margin-bottom: 15px; color: #333;">Ride Statistics Report</h3>
        <div style="margin-bottom: 10px;"><strong>Total Rides:</strong> ${rides.length}</div>
        <div style="margin-bottom: 10px;"><strong>In Progress:</strong> ${inProgressRides}</div>
        <div style="margin-bottom: 10px;"><strong>Completed:</strong> ${completedRides}</div>
        <div style="margin-bottom: 10px;"><strong>Requested:</strong> ${requestedRides}</div>
        <div style="margin-bottom: 10px;"><strong>Total Distance:</strong> ${totalDistance.toFixed(1)} km</div>
        <div style="margin-bottom: 10px;"><strong>Average Distance:</strong> ${(totalDistance / rides.length).toFixed(1)} km</div>
        <div style="margin-bottom: 10px;"><strong>Completion Rate:</strong> ${((completedRides / rides.length) * 100).toFixed(1)}%</div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 14px;">Report generated on: ${new Date().toLocaleString()}</p>
    `;
}

function generatePaymentReport() {
    const output = document.getElementById('reportOutput');
    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
    const cardPayments = payments.filter(p => p.method === 'Card').length;
    const cashPayments = payments.filter(p => p.method === 'Cash').length;
    const completedPayments = payments.filter(p => p.status === 'Completed').length;
    const pendingPayments = payments.filter(p => p.status === 'Pending').length;
    
    output.innerHTML = `
        <h3 style="margin-bottom: 15px; color: #333;">Payment Summary Report</h3>
        <div style="margin-bottom: 10px;"><strong>Total Payments:</strong> ${payments.length}</div>
        <div style="margin-bottom: 10px;"><strong>Total Amount:</strong> ₦${totalPayments.toLocaleString()}</div>
        <div style="margin-bottom: 10px;"><strong>Card Payments:</strong> ${cardPayments} (${((cardPayments/payments.length)*100).toFixed(1)}%)</div>
        <div style="margin-bottom: 10px;"><strong>Cash Payments:</strong> ${cashPayments} (${((cashPayments/payments.length)*100).toFixed(1)}%)</div>
        <div style="margin-bottom: 10px;"><strong>Completed:</strong> ${completedPayments}</div>
        <div style="margin-bottom: 10px;"><strong>Pending:</strong> ${pendingPayments}</div>
        <div style="margin-bottom: 10px;"><strong>Average Payment:</strong> ₦${(totalPayments / payments.length).toFixed(2)}</div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 14px;">Report generated on: ${new Date().toLocaleString()}</p>
    `;
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if(e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Search Functions
function setupSearchHandlers() {
    // Driver Search
    document.getElementById('driverSearch').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredDrivers = drivers.filter(d => 
            d.name.toLowerCase().includes(searchTerm) ||
            d.phone.includes(searchTerm) ||
            d.license.toLowerCase().includes(searchTerm) ||
            d.email.toLowerCase().includes(searchTerm)
        );
        loadDrivers(filteredDrivers);
    });

    // Rider Search
    document.getElementById('riderSearch').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredRiders = riders.filter(r => 
            r.name.toLowerCase().includes(searchTerm) ||
            r.phone.includes(searchTerm) ||
            r.email.toLowerCase().includes(searchTerm)
        );
        loadRiders(filteredRiders);
    });

    // Payment Search
    document.getElementById('paymentSearch').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPayments = payments.filter(p => 
            p.id.toLowerCase().includes(searchTerm) ||
            p.rideId.toLowerCase().includes(searchTerm) ||
            p.method.toLowerCase().includes(searchTerm)
        );
        loadPayments(filteredPayments);
    });
}