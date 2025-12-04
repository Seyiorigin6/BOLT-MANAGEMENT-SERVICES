// Temporary fix: Add missing IDs to elements for home.js compatibility
document.addEventListener('DOMContentLoaded', () => {
  console.log('bookride-fix.js loaded');

  // Add class to body
  document.body.classList.add('book-ride-page');

  // Find and add IDs to elements
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    // Convert div to form
    const form = document.createElement('form');
    form.id = 'bookingForm';
    form.className = bookingForm.className;
    form.innerHTML = bookingForm.innerHTML;
    bookingForm.parentNode.replaceChild(form, bookingForm);
    console.log('Converted booking form to form element');
  }

  // Wait a bit for DOM to settle, then replace inputs
  setTimeout(() => {
    // Find all form inputs
    const allInputs = document.querySelectorAll('.form-input[type="text"]');
    console.log('Found inputs:', allInputs.length);

    if (allInputs.length >= 2) {
      const cities = ['Lagos', 'Abuja', 'Ogun', 'Kano', 'Anambra'];

      // Replace first input (pickup) with select dropdown
      const pickupInput = allInputs[0];
      const pickupSelect = document.createElement('select');
      pickupSelect.id = 'pickup';
      pickupSelect.className = pickupInput.className;
      pickupSelect.style.cssText = pickupInput.style.cssText;

      cities.forEach((city, index) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        if (index === 0) option.selected = true; // Select Lagos by default
        pickupSelect.appendChild(option);
      });

      pickupInput.parentNode.replaceChild(pickupSelect, pickupInput);
      console.log('Replaced pickup input with dropdown');

      // Replace second input (destination) with select dropdown
      const destInput = allInputs[1];
      const destSelect = document.createElement('select');
      destSelect.id = 'destination';
      destSelect.className = destInput.className;
      destSelect.style.cssText = destInput.style.cssText;

      cities.forEach((city, index) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        if (index === 1) option.selected = true; // Select Abuja by default
        destSelect.appendChild(option);
      });

      destInput.parentNode.replaceChild(destSelect, destInput);
      console.log('Replaced destination input with dropdown');
    }

    // Function to update fare details based on selected vehicle
    function updateFareDetails(vehiclePrice) {
      // Parse the price (remove ₦ and convert to number)
      const totalPrice = parseFloat(vehiclePrice.replace('₦', ''));

      // Calculate breakdown (you can adjust these percentages)
      const baseFare = (totalPrice * 0.857).toFixed(2); // ~85.7% of total
      const bookingFee = (totalPrice * 0.061).toFixed(2); // ~6.1% of total
      const taxes = (totalPrice * 0.082).toFixed(2); // ~8.2% of total

      // Update the fare details in the DOM
      const fareRows = document.querySelectorAll('.fare-row');
      if (fareRows.length >= 3) {
        fareRows[0].querySelector('span:last-child').textContent = `₦${baseFare}`;
        fareRows[1].querySelector('span:last-child').textContent = `₦${bookingFee}`;
        fareRows[2].querySelector('span:last-child').textContent = `₦${taxes}`;
      }

      // Update total
      const totalAmount = document.querySelector('.fare-total-amount');
      if (totalAmount) {
        totalAmount.textContent = vehiclePrice;
      }

      console.log('Updated fare details for price:', vehiclePrice);
    }

    // Add vehicle selection functionality
    const vehicleOptions = document.querySelectorAll('.vehicle-option');
    vehicleOptions.forEach(option => {
      option.addEventListener('click', function () {
        // Remove 'selected' class from all options
        vehicleOptions.forEach(opt => opt.classList.remove('selected'));
        // Add 'selected' class to clicked option
        this.classList.add('selected');

        // Get the price from this vehicle option
        const priceElement = this.querySelector('.vehicle-price');
        if (priceElement) {
          const price = priceElement.textContent.trim();
          updateFareDetails(price);
        }

        const vehicleName = this.querySelector('.vehicle-name').textContent;
        console.log('Selected vehicle:', vehicleName);
      });

      // Make it look clickable
      option.style.cursor = 'pointer';
    });
    console.log('Added vehicle selection handlers');

    // Note: confirmBtn will be declared below with driver selection logic
    const confirmButton = document.querySelector('.btn-primary');
    if (confirmButton) {
      confirmButton.id = 'confirmRideBtn';
      console.log('Added ID to confirm button');
    }

    // Create and add the loader element
    const formElement = document.querySelector('#bookingForm');
    if (formElement) {
      const loader = document.createElement('div');
      loader.id = 'findingDriverLoader';
      loader.className = 'booking-card hidden';
      loader.style.textAlign = 'center';
      loader.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: var(--spacing-4); padding: var(--spacing-6);">
          <div id="findingDriverSpinner" style="width: 48px; height: 48px; border: 4px solid var(--gray-200); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p id="findingDriverMessage" style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">Searching for drivers...</p>
        </div>
      `;
      formElement.appendChild(loader);
      console.log('Added loader element');
    }

    // Sample drivers data (Nigerian context)
    const drivers = [
      {
        id: 1,
        name: "Chukwudi Okafor",
        rating: 4.9,
        trips: 342,
        vehicle: "Toyota Camry",
        plate: "LAG-234-AB",
        distance: "1.2 km away",
        eta: "2 mins",
        photo: "https://i.pravatar.cc/150?img=12"
      },
      {
        id: 2,
        name: "Amina Bello",
        rating: 4.8,
        trips: 289,
        vehicle: "Honda Accord",
        plate: "ABJ-567-CD",
        distance: "1.8 km away",
        eta: "4 mins",
        photo: "https://i.pravatar.cc/150?img=5"
      },
      {
        id: 3,
        name: "Emeka Nwosu",
        rating: 4.7,
        trips: 198,
        vehicle: "Toyota Corolla",
        plate: "LAG-891-EF",
        distance: "2.5 km away",
        eta: "5 mins",
        photo: "https://i.pravatar.cc/150?img=33"
      },
      {
        id: 4,
        name: "Fatima Yusuf",
        rating: 4.9,
        trips: 412,
        vehicle: "Honda Civic",
        plate: "KAN-123-GH",
        distance: "3.1 km away",
        eta: "6 mins",
        photo: "https://i.pravatar.cc/150?img=9"
      }
    ];

    let selectedDriver = null;

    // Change "Confirm Ride" button to "Find Drivers" initially
    const confirmBtn = document.querySelector('#confirmRideBtn');
    if (confirmBtn) {
      confirmBtn.textContent = 'Find Drivers';
      confirmBtn.dataset.mode = 'find'; // Track button mode
    }

    // Add Find Drivers functionality
    confirmBtn?.addEventListener('click', function (e) {
      e.preventDefault();

      const mode = this.dataset.mode;

      if (mode === 'find') {
        // Find Drivers mode
        const pickup = document.querySelector('#pickup')?.value;
        const destination = document.querySelector('#destination')?.value;

        if (!pickup || !destination) {
          alert('Please select pickup and destination locations');
          return;
        }

        if (pickup === destination) {
          alert('Pickup and destination cannot be the same');
          return;
        }

        // Show existing loader
        const loader = document.querySelector('#findingDriverLoader');
        if (loader) {
          loader.classList.remove('hidden');
        }

        // Simulate driver search (2 seconds)
        setTimeout(() => {
          displayDriversInLoader();
          // Change button to "Confirm Ride" but keep it disabled until driver is selected
          this.textContent = 'Confirm Ride';
          this.dataset.mode = 'confirm';
          this.disabled = true;
          this.style.opacity = '0.5';
          this.style.cursor = 'not-allowed';
        }, 2000);

      } else if (mode === 'confirm') {
        // Confirm Ride mode
        if (!selectedDriver) {
          alert('Please select a driver');
          return;
        }

        // Save ride details to localStorage
        const pickup = document.querySelector('#pickup')?.value;
        const destination = document.querySelector('#destination')?.value;
        const selectedVehicle = document.querySelector('.vehicle-option.selected');
        const fare = document.querySelector('.fare-total-amount')?.textContent;

        const rideData = {
          driver: selectedDriver,
          pickup: pickup,
          destination: destination,
          vehicle: selectedVehicle?.querySelector('.vehicle-name')?.textContent || 'Standard',
          fare: fare || '24.50',
          timestamp: new Date().toISOString()
        };

        localStorage.setItem('currentRide', JSON.stringify(rideData));
        console.log('Saved ride data:', rideData);

        // Show confirming animation in loader
        const loader = document.querySelector('#findingDriverLoader');
        if (loader) {
          loader.classList.remove('hidden');
          loader.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: var(--spacing-4); padding: var(--spacing-6);">
              <div style="width: 48px; height: 48px; border: 4px solid var(--gray-200); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
              <p style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">Confirming your ride...</p>
            </div>
          `;
        }

        // Redirect to ride progress page after animation
        setTimeout(() => {
          window.location.href = 'rideprogress.html';
        }, 1500);
      }
    });


    function displayDriversInLoader() {
      const loader = document.querySelector('#findingDriverLoader');
      if (!loader) return;

      // Replace loader content with driver list
      let driversHTML = `
        <div style="padding: var(--spacing-5);">
          <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--text-light); margin-bottom: var(--spacing-4);">
            Available Drivers
          </h3>
          <div class="drivers-list">
      `;

      drivers.forEach(driver => {
        driversHTML += `
          <div class="driver-card" data-driver-id="${driver.id}">
            <div class="driver-card-left">
              <div class="driver-avatar" style="background-image: url('${driver.photo}');"></div>
              <div class="driver-info">
                <h4 class="driver-name">${driver.name}</h4>
                <div class="driver-rating">
                  <span style="color: #FFC107;">⭐</span>
                  <span>${driver.rating}</span>
                  <span style="color: var(--subtext-light);">(${driver.trips} trips)</span>
                </div>
                <p class="driver-vehicle">${driver.vehicle} • ${driver.plate}</p>
              </div>
            </div>
            <div class="driver-card-right">
              <p class="driver-distance">${driver.distance}</p>
              <p class="driver-eta">ETA: ${driver.eta}</p>
            </div>
          </div>
        `;
      });

      driversHTML += `
          </div>
        </div>
      `;

      loader.innerHTML = driversHTML;
      loader.classList.remove('hidden');

      // Add click handlers to driver cards
      const driverCards = loader.querySelectorAll('.driver-card');
      driverCards.forEach(card => {
        card.addEventListener('click', function () {
          // Remove selected class from all cards
          driverCards.forEach(c => c.classList.remove('selected'));
          // Add selected class to clicked card
          this.classList.add('selected');

          // Get driver data
          const driverId = parseInt(this.dataset.driverId);
          selectedDriver = drivers.find(d => d.id === driverId);
          console.log('Selected driver:', selectedDriver);

          // Enable confirm button
          const confirmBtn = document.querySelector('#confirmRideBtn');
          if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            confirmBtn.style.cursor = 'pointer';
          }
        });
      });
    }

    console.log('bookride-fix.js complete');
  }, 100); // Small delay to ensure DOM is ready
});
