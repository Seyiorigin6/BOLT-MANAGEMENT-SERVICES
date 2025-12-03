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
    const body = await getBody();
    const { ride_id, driver_id } = body;

    if (!ride_id || !driver_id) {
        return sendResponse('error', 'Missing ride or driver details');
    }

    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'main_db'
    };

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        // 1. Check if ride is still available (Concurrency check)
        const [check] = await connection.execute(
            "SELECT ride_id FROM rides WHERE ride_id = ? AND status = 'Requested'", 
            [ride_id]
        );

        if (check.length === 0) {
            return sendResponse('error', 'Ride is no longer available');
        }

        // 2. Assign Driver
        await connection.execute(
            "UPDATE rides SET driver_id = ?, status = 'Accepted', accepted_at = NOW() WHERE ride_id = ?",
            [driver_id, ride_id]
        );

        sendResponse('success', 'Ride accepted successfully');

    } catch (err) {
        console.error(err);
        sendResponse('error', 'Database error');
    } finally {
        if(connection) await connection.end();
    }
};

main();