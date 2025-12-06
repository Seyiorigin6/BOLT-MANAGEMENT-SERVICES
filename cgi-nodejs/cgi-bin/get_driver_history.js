require('dotenv').config({ path: '../../.env' });
const mysql = require('mysql2/promise');

const sendResponse = (status, message, data = null) => {
    console.log("Content-Type: application/json");
    console.log("");
    console.log(JSON.stringify({ status, message, ...data }));
};

const main = async () => {
    const queryString = process.env.QUERY_STRING || '';
    const driverIdMatch = queryString.match(/driver_id=(\d+)/);
    
    if (!driverIdMatch) {
        return sendResponse('error', 'Missing driver_id parameter');
    }
    const driverId = driverIdMatch[1];

    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'main_db'
    };

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        // Fetch rides assigned to this driver
        const [rows] = await connection.execute(
            "SELECT * FROM rides WHERE driver_id = ? ORDER BY accepted_at DESC",
            [driverId]
        );

        sendResponse('success', 'History fetched', { data: rows });

    } catch (err) {
        console.error(err);
        sendResponse('error', 'Database error');
    } finally {
        if(connection) await connection.end();
    }
};

main();