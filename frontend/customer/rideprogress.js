// Ride Progress Page - Load driver and trip information
document.addEventListener('DOMContentLoaded', () => {
    console.log('rideprogress.js loaded');

    // Get ride data from localStorage
    const rideDataStr = localStorage.getItem('currentRide');

    if (rideDataStr) {
        try {
            const rideData = JSON.parse(rideDataStr);
            console.log('Loaded ride data:', rideData);

            // Update driver information
            if (rideData.driver) {
                const driver = rideData.driver;

                // Update driver name
                const driverNameEl = document.querySelector('.driver-name');
                if (driverNameEl) {
                    driverNameEl.textContent = driver.name;
                }

                // Update driver rating
                const driverRatingEl = document.querySelector('.driver-rating span:last-child');
                if (driverRatingEl) {
                    driverRatingEl.textContent = `${driver.rating} (${driver.trips} trips)`;
                }

                // Update driver vehicle
                const driverVehicleEl = document.querySelector('.driver-vehicle');
                if (driverVehicleEl) {
                    driverVehicleEl.innerHTML = `${driver.vehicle} - <span class="vehicle-plate">${driver.plate}</span>`;
                }

                // Update driver avatar
                const driverAvatarEl = document.querySelector('.driver-avatar');
                if (driverAvatarEl && driver.photo) {
                    driverAvatarEl.style.backgroundImage = `url('${driver.photo}')`;
                }
            }

            // Update trip details
            if (rideData.pickup && rideData.destination) {
                // Update pickup location
                const pickupAddressEl = document.querySelector('.trip-location:first-child .trip-location-address');
                if (pickupAddressEl) {
                    pickupAddressEl.textContent = rideData.pickup;
                }

                // Update destination location
                const destAddressEl = document.querySelector('.trip-location:last-child .trip-location-address');
                if (destAddressEl) {
                    destAddressEl.textContent = rideData.destination;
                }
            }

            // Update fare
            if (rideData.fare) {
                const fareAmountEl = document.querySelector('.trip-fare-amount');
                if (fareAmountEl) {
                    fareAmountEl.textContent = rideData.fare;
                }
            }

            // Clear localStorage after reading (optional - comment out if you want to keep it)
            // localStorage.removeItem('currentRide');

        } catch (error) {
            console.error('Error parsing ride data:', error);
        }
    } else {
        console.log('No ride data found in localStorage');
    }
});
