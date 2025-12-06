require('dotenv').config({ path: '../../.env' });
const mysql = require('mysql2/promise');

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

const main = async () => {
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'main_db'
    };

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // --- 1. GET VEHICLE DETAILS (View) ---
        if (process.env.REQUEST_METHOD === 'GET') {
            const queryString = process.env.QUERY_STRING || '';
            const driverIdMatch = queryString.match(/driver_id=(\d+)/);
            
            if (!driverIdMatch) return sendResponse('error', 'Missing driver_id');
            
            const [rows] = await connection.execute(
                'SELECT * FROM vehicles WHERE driver_id = ?', [driverIdMatch[1]]
            );

            if (rows.length > 0) {
                sendResponse('success', 'Vehicle found', { vehicle: rows[0] });
            } else {
                sendResponse('empty', 'No vehicle found');
            }
        } 
        
        // --- 2. ADD VEHICLE (Insert) ---
        else if (process.env.REQUEST_METHOD === 'POST') {
            const body = await getBody();
            const { driver_id, plate_number, model, color } = body;

            if (!driver_id || !plate_number || !model) {
                return sendResponse('error', 'Missing vehicle details');
            }

            await connection.execute(
                'INSERT INTO vehicles (driver_id, plate_number, model, color) VALUES (?, ?, ?, ?)',
                [driver_id, plate_number, model, color]
            );

            sendResponse('success', 'Vehicle added successfully');
        }

    } catch (err) {
        console.error(err);
        sendResponse('error', 'Database error: ' + err.message);
    } finally {
        if(connection) await connection.end();
    }
};

main();