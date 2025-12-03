require('dotenv').config({ path: '../../.env' });
const mysql = require('mysql2/promise');

const sendResponse = (status, message, data = null) => {
    console.log("Content-Type: application/json");
    console.log("");
    console.log(JSON.stringify({ status, message, ...data }));
};

const main = async () => {
    // 1. Get User ID from Query String (process.env.QUERY_STRING)
    const queryString = process.env.QUERY_STRING || '';
    const userIdMatch = queryString.match(/user_id=(\d+)/);
    
    if (!userIdMatch) {
        return sendResponse('error', 'Missing user_id parameter');
    }
    
    const userId = userIdMatch[1];

    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'main_db'
    };

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        // 2. Fetch Rides (Newest first)
        const [rows] = await connection.execute(
            'SELECT * FROM rides WHERE rider_id = ? ORDER BY requested_at DESC LIMIT 10', 
            [userId]
        );

        sendResponse('success', 'Rides fetched', { data: rows });

    } catch (err) {
        console.error(err);
        sendResponse('error', 'Database error');
    } finally {
        if(connection) await connection.end();
    }
};

main();