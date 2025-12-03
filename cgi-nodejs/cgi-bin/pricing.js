// 1. FIXED LOCATIONS (The "Bus Stops")
// we give each a "distance_marker" (imaginary km from a center point)
// Ikeja (0) -> Yaba (10) = 10km distance
const LOCATIONS = [
    { id: 1, name: "Ikeja City Mall", distance_marker: 0 },
    { id: 2, name: "Yaba Tech", distance_marker: 10 },    
    { id: 3, name: "Eko Hotel (VI)", distance_marker: 18 }, 
    { id: 4, name: "Lekki Phase 1", distance_marker: 22 },  
    { id: 5, name: "Ajah Bridge", distance_marker: 35 }     
];

// 2. PRICING CONSTANTS (In Naira)
const PRICE_PER_KM = 300; 
const BASE_FARE = 500;    

// 3. THE CALCULATOR
function calculateFare(pickupId, dropoffId) {
    // Find the full location objects based on the ID sent from dropdown
    const pickup = LOCATIONS.find(l => l.id === parseInt(pickupId));
    const dropoff = LOCATIONS.find(l => l.id === parseInt(dropoffId));

    if (!pickup || !dropoff) return null;

    // Calculate distance (absolute difference between markers)
    const distance = Math.abs(pickup.distance_marker - dropoff.distance_marker);
    
    // Logic: Base Fare + (Distance * Rate)
    // Example: Ikeja to Yaba (10km) = 500 + (10 * 300) = 3500 Naira
    const price = BASE_FARE + (distance * PRICE_PER_KM);

    return {
        distance_km: distance,
        amount: price,
        pickup_name: pickup.name,
        dropoff_name: dropoff.name
    };
}

module.exports = { LOCATIONS, calculateFare };