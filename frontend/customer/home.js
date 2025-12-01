/* customer.js
   Unified client logic for:
   - book-ride.html
   - ride-progress.html
   - payment.html
*/

/* -------------------------------
   Utility helpers
--------------------------------*/
const q = (sel, root = document) => root.querySelector(sel);
const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function formatCurrency(n) {
  // uses NGN symbol by default (₦). Adjust if you prefer $
  return "₦" + Number(n).toLocaleString();
}

/* -------------------------------
   BOOK RIDE PAGE
   (body has class "book-ride-page")
--------------------------------*/
if (document.body.classList.contains("book-ride-page")) {

  // Elements
  const bookingForm = q("#bookingForm");
  const pickupInput = q("#pickup");
  const destInput = q("#destination");
  const findBtn = q("#findDriverBtn");
  const loaderCard = q("#findingDriverLoader");
  const confirmBtn = q("#confirmRideBtn");

  // For convenience, set placeholder values if empty
  if (!pickupInput.value) pickupInput.value = "123 Main Street, Anytown";
  if (!destInput.value) destInput.value = "456 Oak Avenue, Sometown";

  // Clicking confirm triggers form submit
  confirmBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    bookingForm.requestSubmit();
  });

  // Submit handler
  bookingForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const pickup = pickupInput.value.trim();
    const destination = destInput.value.trim();

    if (!pickup || !destination) {
      alert("Please enter both pickup and destination.");
      return;
    }
    if (pickup === destination) {
      alert("Pickup and destination cannot be the same.");
      return;
    }

    // Save to localStorage to pass between pages
    localStorage.setItem("bm_pickup", pickup);
    localStorage.setItem("bm_destination", destination);
    localStorage.setItem("bm_requested_at", new Date().toISOString());

    // Show loader / find-driver animation
    loaderCard.classList.remove("hidden");
    findBtn.disabled = true;
    findBtn.innerText = "Finding driver...";

    // Simulate "finding driver" steps
    const steps = [
      { text: "Searching nearby drivers...", delay: 1000 },
      { text: "Contacting drivers...", delay: 1200 },
      { text: "Driver found! Preparing to dispatch...", delay: 1600 }
    ];

    let totalDelay = 0;
    steps.forEach((s, i) => {
      totalDelay += s.delay;
      setTimeout(() => {
        q("#findingDriverMessage").innerText = s.text;
        q("#findingDriverSpinner").classList.toggle("animate-spin");
      }, totalDelay);
    });

    // After simulated wait, redirect to ride-progress page
    setTimeout(() => {
      // Hide loader quickly (so user sees "Driver found" briefly)
      loaderCard.classList.add("hidden");
      // Save mock driver info
      localStorage.setItem("bm_driver", JSON.stringify({
        name: "Alex Johnson",
        car: "Toyota Camry",
        plate: "LA-54321",
        rating: 4.9,
      }));
      // Generate an estimated fare now and save it
      const estimatedFare = generateFare(pickup, destination);
      localStorage.setItem("bm_fare", estimatedFare.toString());
      window.location.href = "ride-progress.html";
    }, totalDelay + 900); // small pause after last step
  });

  // Simple fare generator (pseudo-distance, deterministic-ish)
  function generateFare(from, to) {
    // Use string lengths to simulate distance: deterministic but varied
    const base = 300; // base fare in NGN
    const lengthFactor = Math.abs(from.length - to.length) * 25;
    const avgLen = Math.floor((from.length + to.length) / 2);
    const distanceFactor = Math.min(2000, avgLen * 8); // cap
    const randomTiny = Math.floor(Math.random() * 100); // small variance
    const fare = base + lengthFactor + distanceFactor + randomTiny;
    // Round to nearest 10
    return Math.round(fare / 10) * 10;
  }
}

/* -------------------------------
   RIDE PROGRESS PAGE
   (body has class "progress-page")
--------------------------------*/
if (document.body.classList.contains("progress-page")) {
  const pickup = localStorage.getItem("bm_pickup") || "Unknown pickup";
  const destination = localStorage.getItem("bm_destination") || "Unknown destination";
  const driverRaw = localStorage.getItem("bm_driver");
  const driver = driverRaw ? JSON.parse(driverRaw) : null;
  const fareSaved = Number(localStorage.getItem("bm_fare") || 0);

  // Elements
  const pickupEl = q("#pickupText");
  const destEl = q("#destinationText");
  const driverNameEl = q("#driverName");
  const carPlateEl = q("#driverCar");
  const statusEl = q("#statusText");
  const progressBarEl = q("#progressBarFill");
  const etaEl = q("#etaText");
  const callBtn = q("#callDriverBtn");
  const messageBtn = q("#messageDriverBtn");

  // Populate UI
  if (pickupEl) pickupEl.innerText = pickup;
  if (destEl) destEl.innerText = destination;
  if (driver) {
    driverNameEl && (driverNameEl.innerText = driver.name);
    carPlateEl && (carPlateEl.innerText = `${driver.car} • ${driver.plate}`);
  }

  // Ride stages timeline (each stage will advance percent)
  const stages = [
    { name: "Driver en route", durationSec: 6, percent: 15 },
    { name: "Driver arriving", durationSec: 8, percent: 35 },
    { name: "Passenger onboard — driving", durationSec: 12, percent: 85 },
    { name: "Approaching destination", durationSec: 4, percent: 95 },
    { name: "Ride completed", durationSec: 2, percent: 100 }
  ];

  // Show approximate ETA computed from durations
  const totalSeconds = stages.reduce((s, st) => s + st.durationSec, 0);
  let remaining = Math.ceil(totalSeconds / 60); // minutes (rounded up)
  etaEl && (etaEl.innerText = `${Math.max(1, remaining)} min`);

  // sequentially progress stages
  let currentPercent = 0;
  let stageIndex = 0;

  function advanceStage() {
    if (stageIndex >= stages.length) return;
    const st = stages[stageIndex];
    statusEl && (statusEl.innerText = st.name);

    // animate progress towards st.percent over st.durationSec
    const start = currentPercent;
    const end = st.percent;
    const duration = st.durationSec * 1000;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const value = Math.round(start + (end - start) * t);
      currentPercent = value;
      if (progressBarEl) progressBarEl.style.width = `${currentPercent}%`;
      // update ETA roughly
      const secsLeft = Math.max(0, Math.ceil((totalSeconds - elapsed / 1000)));
      const minsLeft = Math.max(0, Math.ceil(secsLeft / 60));
      etaEl && (etaEl.innerText = `${minsLeft || 1} min`);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        // finish this stage and schedule next
        stageIndex++;
        if (stageIndex < stages.length) {
          setTimeout(advanceStage, 400); // tiny pause between stages
        } else {
          // ride finished — redirect to payment after short delay
          statusEl && (statusEl.innerText = "Finishing up...");
          setTimeout(() => {
            // ensure fare is saved (fallback to computed if missing)
            if (!fareSaved) {
              // compute simple fallback fare (small)
              const fallback = 1200;
              localStorage.setItem("bm_fare", fallback.toString());
            }
            window.location.href = "payment.html";
          }, 900);
        }
      }
    }
    requestAnimationFrame(step);
  }

  // start progression shortly after page loads
  setTimeout(advanceStage, 800);

  // optional driver actions
  callBtn?.addEventListener("click", () => {
    alert("Calling driver (" + (driver?.name || "Driver") + ")...");
  });
  messageBtn?.addEventListener("click", () => {
    alert("Opening chat with driver...");
  });
}

/* -------------------------------
   PAYMENT PAGE
   (body has class "payment-page")
--------------------------------*/
if (document.body.classList.contains("payment-page")) {
  const pickup = localStorage.getItem("bm_pickup") || "Unknown pickup";
  const destination = localStorage.getItem("bm_destination") || "Unknown destination";
  let fare = Number(localStorage.getItem("bm_fare") || 0);
  const driverRaw = localStorage.getItem("bm_driver");
  const driver = driverRaw ? JSON.parse(driverRaw) : null;

  // Elements
  const pickupDisplay = q("#pickupDisplay");
  const destDisplay = q("#destinationDisplay");
  const priceDisplay = q("#priceDisplay");
  const payBtn = q("#payBtn");
  const payMethodRadios = qa("input[name='payment-method']");

  // Show ride summary
  pickupDisplay && (pickupDisplay.innerText = pickup);
  destDisplay && (destDisplay.innerText = destination);
  priceDisplay && (priceDisplay.innerText = formatCurrency(fare));

  // Payment action (simulated)
  payBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    // Basic selection validation
    const selected = payMethodRadios.find(r => r.checked);
    if (!selected) {
      alert("Please select a payment method.");
      return;
    }

    // Simulate processing
    payBtn.disabled = true;
    payBtn.innerText = "Processing payment...";

    setTimeout(() => {
      payBtn.innerText = "Payment successful";
      alert("Payment successful! Thank you.");

      // Save transaction to a simple transaction history in localStorage
      const txHistoryRaw = localStorage.getItem("bm_tx") || "[]";
      const txHistory = JSON.parse(txHistoryRaw);
      txHistory.unshift({
        id: "TX" + Date.now(),
        date: new Date().toISOString(),
        from: pickup,
        to: destination,
        amount: fare,
        status: "completed"
      });
      localStorage.setItem("bm_tx", JSON.stringify(txHistory));

      // clear ride-specific keys (leave tx history)
      localStorage.removeItem("bm_pickup");
      localStorage.removeItem("bm_destination");
      localStorage.removeItem("bm_driver");
      localStorage.removeItem("bm_fare");
      localStorage.removeItem("bm_requested_at");

      // Redirect back to booking page after short delay
      setTimeout(() => {
        window.location.href = "book-ride.html";
      }, 1000);
    }, 1500);
  });

  // Quick 'Add new payment method' button handler (if present)
  const addMethodBtn = q("#addPaymentMethodBtn");
  addMethodBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Add payment method flow (not implemented).");
  });

  // Optional: show simple pending transactions list if present
  const txTable = q("#txTableBody");
  if (txTable) {
    const txHistoryRaw = localStorage.getItem("bm_tx") || "[]";
    const txHistory = JSON.parse(txHistoryRaw);
    txHistory.slice(0, 10).forEach(tx => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2 text-sm">${new Date(tx.date).toLocaleString()}</td>
        <td class="p-2 text-sm">${tx.from} → ${tx.to}</td>
        <td class="p-2 text-sm text-right">${formatCurrency(tx.amount)}</td>
        <td class="p-2 text-sm text-center">${tx.status}</td>
      `;
      txTable.appendChild(row);
    });
  }
}
