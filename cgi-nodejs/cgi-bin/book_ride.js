require('dotenv').config({ path: '../../.env' }); 
const mysql = require('mysql2/promise');
const { calculateFare, LOCATIONS } = require('./pricing');

// --- HELPERS ---
const getBody = async () => {
    return new Promise((resolve) => {
        let body = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', chunk => body += chunk);
        process.stdin.on('end', () => {
            try { resolve(body ? JSON.parse(body) : {}); } 
            catch (e) { resolve({}); }
        });
    });
};

const sendResponse = (status, message, data = null) => {
    console.log("Content-Type: application/json");
    console.log("");
    console.log(JSON.stringify({ status, message, ...data }));
};

// --- MAIN LOGIC ---
const main = async () => {
    // 1. HANDLE GET REQUEST (Frontend asks: "What locations do you have?")
    if (process.env.REQUEST_METHOD === 'GET') {
        return sendResponse('success', 'Locations fetched', { locations: LOCATIONS });
    }

    // 2. HANDLE POST REQUEST (Frontend says: "Book this ride!")
    const body = await getBody();
    const { user_id, pickup_id, dropoff_id } = body;

    if (!user_id || !pickup_id || !dropoff_id) {
        return sendResponse('error', 'Missing details');
    }

    // A. Calculate the Price (Consult the Recipe Book)
    const fareDetails = calculateFare(pickup_id, dropoff_id);

    if (!fareDetails) {
        return sendResponse('error', 'Invalid locations selected');
    }

    // B. Save Order to Database
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'main_db'
    };

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        const query = `
            INSERT INTO rides 
            (rider_id, pickup_location, dropoff_location, distance_km, fare_amount, status, requested_at)
            VALUES (?, ?, ?, ?, ?, 'Requested', NOW())
        `;

        const [result] = await connection.execute(query, [
            user_id, 
            fareDetails.pickup_name, 
            fareDetails.dropoff_name, 
            fareDetails.distance_km, 
            fareDetails.amount
        ]);

        sendResponse('success', 'Ride booked successfully', { 
            ride_id: result.insertId,
            fare: fareDetails.amount,
            message: `Ride booked! Cost: ₦${fareDetails.amount}`
        });

    } catch (err) {
        console.error(err);
        sendResponse('error', 'Database error: ' + err.message);
    } finally {
        if(connection) await connection.end();
    }
};

main();