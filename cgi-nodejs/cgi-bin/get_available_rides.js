require('dotenv').config({ path: '../../.env' });
const mysql = require('mysql2/promise');

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
        
        // Fetch rides that are 'Requested' and have NO driver assigned
        const [rows] = await connection.execute(
            "SELECT * FROM rides WHERE status = 'Requested' AND driver_id IS NULL ORDER BY requested_at DESC"
        );

        sendResponse('success', 'Available rides fetched', { data: rows });

    } catch (err) {
        console.error(err);
        sendResponse('error', 'Database error');
    } finally {
        if(connection) await connection.end();
    }
};

main();