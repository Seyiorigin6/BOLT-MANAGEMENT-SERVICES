const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// --- 1. INTERNAL HELPERS ---

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'main_db',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0
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

const sendResponse = (status, message, data = null) => {
    console.log("Content-Type: application/json");
    console.log("");
    console.log(JSON.stringify({ status, message, ...data }));
};

// --- 2. MAIN LOGIC ---

const main = async () => {
    let connection;
    try {
        const body = await getBody();
        const { email, password } = body;

        if (!email || !password) {
            return sendResponse('error', 'Email and password required');
        }

        connection = await mysql.createConnection(dbConfig);

        // Find User
        const [rows] = await connection.execute(
            'SELECT * FROM riders WHERE email = ?', 
            [email]
        );

        if (rows.length === 0) {
            return sendResponse('error', 'Invalid email or password');
        }

        const user = rows[0];

        // Verify Password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return sendResponse('error', 'Invalid email or password');
        }

        // Success
        sendResponse('success', 'Login successful', {
            user: {
                id: user.rider_id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        sendResponse('error', 'Internal Server Error');
    } finally {
        if (connection) await connection.end();
    }
};

main();