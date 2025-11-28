let driverState = {
    isOnline: true,
    currentRide: null,
    stats: {
        earnings: 12000,
        trips: 10,
        rating: 4.5
    }
};

function initOnlineToggle() {
    const toggleBtn = document.querySelector('.page-header .btn.primary');
    const statusChip = document.querySelector('.status-chip');
    
    if (!toggleBtn) return;
    
    // Set initial state
    updateOnlineStatus();
    
    toggleBtn.addEventListener('click', function() {
        driverState.isOnline = !driverState.isOnline;
        updateOnlineStatus();
    });
}

function updateOnlineStatus() {
    const toggleBtn = document.querySelector('.page-header .btn.primary');
    const statusChip = document.querySelector('.status-chip');
    
    if (driverState.isOnline) {
        toggleBtn.textContent = 'Go Offline';
        toggleBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        statusChip.textContent = 'Online';
        statusChip.className = 'status-chip online';
    } else {
        toggleBtn.textContent = 'Go Online';
        toggleBtn.style.background = 'linear-gradient(135deg, #04923a 0%, #04923a 100%)';
        statusChip.textContent = 'Offline';
        statusChip.className = 'status-chip offline';
    }
}

function showRideRequest() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'ride-request-modal';
    modal.innerHTML = `
        <div class="ride-request-card">
            <div class="request-header">
                <h2>New Ride Request</h2>
                <div class="timer">
                    <span class="timer-text">15</span>
                    <span class="timer-label">seconds</span>
                </div>
            </div>
            
            <div class="request-passenger">
                <div class="passenger-avatar">AO</div>
                <div>
                    <h3>Adebayo Oluwaseun</h3>
                    <p>⭐ 4.8 • 150 rides</p>
                </div>
            </div>
            
            <div class="request-route">
                <div class="request-location">
                    <span class="location-icon">📍</span>
                    <div>
                        <span class="location-label">Pickup</span>
                        <p>15 Admiralty Way, Lekki Phase 1</p>
                    </div>
                </div>
                <div class="request-location">
                    <span class="location-icon">🎯</span>
                    <div>
                        <span class="location-label">Drop-off</span>
                        <p>Plot 1234, Adeola Odeku St, VI</p>
                    </div>
                </div>
            </div>
            
            <div class="request-details">
                <div class="detail-item">
                    <span>Distance</span>
                    <strong>8.5 km</strong>
                </div>
                <div class="detail-item">
                    <span>Est. Fare</span>
                    <strong>₦3,500</strong>
                </div>
                <div class="detail-item">
                    <span>Est. Time</span>
                    <strong>15 mins</strong>
                </div>
            </div>
            <div class="request-passenger">
                <div class="passenger-avatar">IM</div>
                <div>
                    <h3>Ibrahim Musa</h3>
                    <p>⭐ 4.5 • 87 rides</p>
                </div>
            </div>
            
            <div class="request-route">
                <div class="request-location">
                    <span class="location-icon">📍</span>
                    <div>
                        <span class="location-label">Pickup</span>
                        <p>The Palms Shopping Mall, Lekki</p>
                    </div>
                </div>
                <div class="request-location">
                    <span class="location-icon">🎯</span>
                    <div>
                        <span class="location-label">Drop-off</span>
                        <p>Ikeja GRA</p>
                    </div>
                </div>
            </div>

            <div class="request-details">
                <div class="detail-item">
                    <span>Distance</span>
                    <strong>18.7 km</strong>
                </div>
                <div class="detail-item">
                    <span>Est. Fare</span>
                    <strong>₦5,800</strong>
                </div>
                <div class="detail-item">
                    <span>Est. Time</span>
                    <strong>35 mins</strong>
                </div>
            </div>
            <div class="request-actions">
                <button class="btn-reject">Reject</button>
                <button class="btn-accept">Accept Ride</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    let timeLeft = 15;
    const timerElement = modal.querySelector('.timer-text');
    const countdown = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            closeRideRequest();
        }
    }, 1000);
    
    modal.querySelector('.btn-accept').addEventListener('click', () => {
        clearInterval(countdown);
        acceptRide();
        closeRideRequest();
    });
    
    modal.querySelector('.btn-reject').addEventListener('click', () => {
        clearInterval(countdown);
        closeRideRequest();
        alert('Ride rejected. Waiting for next request...');
    });
}

function closeRideRequest() {
    const modal = document.querySelector('.ride-request-modal');
    if (modal) {
        modal.remove();
    }
}

function acceptRide() {
    alert('Ride accepted! Navigating to pickup location...');
    // In a real app, you would redirect to current-ride page
    // window.location.href = 'driver-current-ride.html';
}

function initRideStatusButtons() {
    const completeBtn = document.querySelector('.ride-actions .btn.primary');
    const cancelBtn = document.querySelector('.ride-actions .btn.secondary');
    
    if (completeBtn) {
        completeBtn.addEventListener('click', completeTrip);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelTrip);
    }
}

function completeTrip() {
    const confirmed = confirm('Complete this trip?');
    if (confirmed) {
        // Update stats
        driverState.stats.earnings += 3500;
        driverState.stats.trips += 1;
        updateStats();
        
        alert('Trip completed! ₦3,500 earned.');
        
        // In a real app, redirect to dashboard
        // window.location.href = 'driver-dashboard.html';
    }
}

function cancelTrip() {
    const confirmed = confirm('Are you sure you want to cancel this trip?');
    if (confirmed) {
        alert('Trip cancelled. This may affect your rating.');
        // In a real app, redirect to dashboard
        // window.location.href = 'driver-dashboard.html';
    }
}

function updateStats() {
    const earningsElement = document.querySelector('.card-icon.earnings')?.closest('.card').querySelector('p');
    const tripsElement = document.querySelector('.card-icon.trips')?.closest('.card').querySelector('p');
    const ratingElement = document.querySelector('.card-icon.ratings')?.closest('.card').querySelector('p');
    
    if (earningsElement) {
        earningsElement.textContent = `₦${driverState.stats.earnings.toLocaleString()}`;
    }
    
    if (tripsElement) {
        tripsElement.textContent = driverState.stats.trips;
    }
    
    if (ratingElement) {
        ratingElement.textContent = driverState.stats.rating.toFixed(1);
    }
}

// Simulate random stats updates (mock)
function simulateStatsUpdate() {
    setInterval(() => {
        // Random small increases
        const earningsIncrease = Math.floor(Math.random() * 500) + 100;
        driverState.stats.earnings += earningsIncrease;
        
        if (Math.random() > 0.7) {
            driverState.stats.trips += 1;
        }
        
        updateStats();
    }, 30000); // Update every 30 seconds
}

function initProfileEdit() {
    const editBtn = document.querySelector('.profile-header .btn.secondary');
    
    if (!editBtn) return;
    
    editBtn.addEventListener('click', toggleProfileEdit);
}

function toggleProfileEdit() {
    const profileInfo = document.querySelector('.profile-info');
    const editBtn = document.querySelector('.profile-header .btn.secondary');
    const isEditing = editBtn.textContent === 'Save Changes';
    
    if (isEditing) {
        // Save mode - get values from inputs
        const nameInput = document.querySelector('.profile-name-input');
        const emailInput = document.querySelector('.profile-email-input');
        const phoneInput = document.querySelector('.profile-phone-input');
        
        if (nameInput && emailInput && phoneInput) {
            // Update display
            profileInfo.querySelector('h2').textContent = nameInput.value;
            profileInfo.querySelector('.profile-email').textContent = emailInput.value;
            profileInfo.querySelector('.profile-phone').textContent = phoneInput.value;
            
            editBtn.textContent = 'Edit Profile';
            alert('Profile updated successfully!');
        }
    } else {
        // Edit mode - convert to inputs
        const currentName = profileInfo.querySelector('h2').textContent;
        const currentEmail = profileInfo.querySelector('.profile-email').textContent;
        const currentPhone = profileInfo.querySelector('.profile-phone').textContent;
        
        profileInfo.querySelector('h2').innerHTML = `<input type="text" class="profile-name-input" value="${currentName}">`;
        profileInfo.querySelector('.profile-email').innerHTML = `<input type="email" class="profile-email-input" value="${currentEmail}">`;
        profileInfo.querySelector('.profile-phone').innerHTML = `<input type="tel" class="profile-phone-input" value="${currentPhone}">`;
        
        editBtn.textContent = 'Save Changes';
        editBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        editBtn.style.color = 'white';
    }
}

function addTestButton() {
    // Only add on dashboard page
    if (!document.querySelector('.cards')) return;
    
    const pageHeader = document.querySelector('.page-header');
    if (!pageHeader) return;
    
    const testBtn = document.createElement('button');
    testBtn.className = 'btn secondary';
    testBtn.textContent = 'Ride Request';
    testBtn.style.marginLeft = '1rem';
    testBtn.addEventListener('click', showRideRequest);
    
    pageHeader.appendChild(testBtn);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize based on current page
    initOnlineToggle();
    initRideStatusButtons();
    initProfileEdit();
    
    // Start stats simulation (optional - remove if you don't want auto-updates)
    // simulateStatsUpdate();
    
    // Add test button for development (remove in production)
    addTestButton();
    
    console.log('Driver Dashboard JS loaded successfully! 🚗');
});
