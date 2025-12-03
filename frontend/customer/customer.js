// ========== Notification Dropdown ============
document.addEventListener("DOMContentLoaded", () => {
    let bell = document.getElementById("bell");
    let drop = document.getElementById("notifDropdown");

    if (bell) {
        bell.onclick = () => {
            drop.style.display = drop.style.display === "block" ? "none" : "block";
        };
    }

    // ========== Profile Edit Mode ============
    let editBtn = document.getElementById("editBtn");
    let saveBtn = document.getElementById("saveBtn");
    let nameField = document.getElementById("nameField");
    let emailField = document.getElementById("emailField");

    if (editBtn) {
        editBtn.onclick = () => {
            nameField.disabled = false;
            emailField.disabled = false;
            editBtn.style.display = "none";
            saveBtn.style.display = "inline-block";
        };
    }

    if (saveBtn) {
        saveBtn.onclick = () => {
            nameField.disabled = true;
            emailField.disabled = true;
            saveBtn.style.display = "none";
            editBtn.style.display = "inline-block";
            alert("Profile Saved (UI only)");
        };
    }

    // ========== Settings Toggles ============
    let notifToggle = document.getElementById("notifToggle");
    let darkModeToggle = document.getElementById("darkModeToggle");

    if (notifToggle) {
        notifToggle.onclick = () => {
            alert("Notifications: " + (notifToggle.checked ? "ON" : "OFF"));
        };
    }

    if (darkModeToggle) {
        darkModeToggle.onclick = () => {
            document.body.style.background =
                darkModeToggle.checked ? "#111" : "white";
            document.body.style.color =
                darkModeToggle.checked ? "white" : "black";
        };
    }

    // ========== Wallet Top-Up Modal ============
    let topUpBtn = document.getElementById("topUpBtn");
    let topUpModal = document.getElementById("topUpModal");
    let closeTopUp = document.getElementById("closeTopUp");

    if (topUpBtn) {
        topUpBtn.onclick = () => {
            topUpModal.style.display = "block";
        };
    }

    if (closeTopUp) {
        closeTopUp.onclick = () => {
            topUpModal.style.display = "none";
        };
    }

    // ========== Ride History Filter ============
    let rideFilter = document.getElementById("rideFilter");
    let rides = document.querySelectorAll(".ride");

    if (rideFilter) {
        rideFilter.onchange = () => {
            let value = rideFilter.value;
            rides.forEach((ride) => {
                if (value === "all") {
                    ride.style.display = "block";
                } else if (!ride.classList.contains(value)) {
                    ride.style.display = "none";
                } else {
                    ride.style.display = "block";
                }
            });
        };
    }
});