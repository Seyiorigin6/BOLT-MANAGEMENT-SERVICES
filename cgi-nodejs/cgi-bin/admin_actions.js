require('dotenv').config({ path: '../../.env' });
const mysql = require('mysql2/promise');

const sendResponse = (status, message, data = null) => {
    console.log("Content-Type: application/json");
    console.log("");
    console.log(JSON.stringify({ status, message, ...data }));
};

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
        const method = process.env.REQUEST_METHOD;
        const query = process.env.QUERY_STRING || '';

        if (method === 'GET') {
            const actionMatch = query.match(/action=([^&]+)/);
            const action = actionMatch ? actionMatch[1] : '';

            if (action === 'stats') {
                const [drivers] = await connection.execute('SELECT COUNT(*) as count FROM drivers');
                const [riders] = await connection.execute('SELECT COUNT(*) as count FROM riders');
                const [rides] = await connection.execute('SELECT COUNT(*) as count FROM rides');
                const [revenue] = await connection.execute('SELECT SUM(fare_amount) as total FROM rides');
                
                sendResponse('success', 'Stats fetched', { 
                    drivers: drivers[0].count,
                    riders: riders[0].count,
                    rides: rides[0].count,
                    revenue: revenue[0].total || 0
                });
            } 
            else if (action === 'drivers') {
                // MODIFIED QUERY: Join with vehicles table
                const query = `
                    SELECT d.*, v.plate_number, v.model, v.color 
                    FROM drivers d 
                    LEFT JOIN vehicles v ON d.driver_id = v.driver_id 
                    ORDER BY d.created_at DESC
                `;
                const [rows] = await connection.execute(query);
                sendResponse('success', 'Drivers fetched', { data: rows });
            }
            else if (action === 'riders') {
                const [rows] = await connection.execute('SELECT * FROM riders ORDER BY created_at DESC');
                sendResponse('success', 'Riders fetched', { data: rows });
            }
            else {
                sendResponse('error', 'Invalid action');
            }
        }
        else if (method === 'POST') {
            const body = await getBody();
            const { action, id } = body;

            if (action === 'delete_driver') {
                await connection.execute('DELETE FROM drivers WHERE driver_id = ?', [id]);
                sendResponse('success', 'Driver deleted');
            }
            else if (action === 'delete_rider') {
                await connection.execute('DELETE FROM riders WHERE rider_id = ?', [id]);
                sendResponse('success', 'Rider deleted');
            }
            else {
                sendResponse('error', 'Invalid action');
            }
        }

    } catch (err) {
        console.error(err);
        sendResponse('error', 'Database error: ' + err.message);
    } finally {
        if(connection) await connection.end();
    }
};

main();