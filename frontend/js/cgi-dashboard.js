document.addEventListener('DOMContentLoaded', () => {
    // --- 1. THE BOUNCER (Security Check) ---
    const userSession = sessionStorage.getItem('bolt_user');

    if (!userSession) {
        
        window.location.href = '../login.html'; 
        return; 
    }

    const user = JSON.parse(userSession);

    // --- 2. THE GREETER (Personalize Page) ---
    // Update Sidebar Name
    const sidebarName = document.getElementById('user-name-sidebar');
    if (sidebarName) {
        sidebarName.textContent = user.name;
    }

    // Update Welcome Message (Optional, looks nice)
    const welcomeMsg = document.querySelector('.dashboard-subtitle');
    if (welcomeMsg) {
        welcomeMsg.textContent = `Welcome back ${user.name.split(' ')[0]}, here's an overview of your ride activity.`;
    }

    // --- 3. THE EXIT (Logout Logic) ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Destroy the ID card
            sessionStorage.removeItem('bolt_user');
            // Send back to login
            window.location.href = '../login.html';
        });
    }
});