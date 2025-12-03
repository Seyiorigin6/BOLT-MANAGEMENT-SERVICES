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
    console.log(""); // Header/Body separator
    console.log(JSON.stringify({ status, message, ...data }));
};

// --- 2. MAIN LOGIC ---

const main = async () => {
    let connection;
    try {
        const body = await getBody();
        const { email, password } = body;

        // 1. Basic Validation
        if (!email || !password) {
            return sendResponse('error', 'Email and password required');
        }

        connection = await mysql.createConnection(dbConfig);

        // --- CHECK 1: IS IT AN ADMIN? (Priority) ---
        const [adminRows] = await connection.execute(
            'SELECT * FROM admins WHERE email = ?', 
            [email]
        );

        if (adminRows.length > 0) {
            const user = adminRows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (isMatch) {
                return sendResponse('success', 'Admin Login successful', {
                    user: {
                        id: user.admin_id,
                        name: user.name,
                        email: user.email,
                        type: 'admin' // Special badge for redirection
                    }
                });
            }
        }

        // --- CHECK 2: IS IT A RIDER? ---
        const [riderRows] = await connection.execute(
            'SELECT * FROM riders WHERE email = ?', 
            [email]
        );

        if (riderRows.length > 0) {
            const user = riderRows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (isMatch) {
                return sendResponse('success', 'Login successful', {
                    user: {
                        id: user.rider_id, 
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        type: 'rider' 
                    }
                });
            } else {
                return sendResponse('error', 'Invalid email or password');
            }
        }

        // --- CHECK 3: IS IT A DRIVER? ---
        const [driverRows] = await connection.execute(
            'SELECT * FROM drivers WHERE email = ?', 
            [email]
        );

        if (driverRows.length > 0) {
            const user = driverRows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (isMatch) {
                return sendResponse('success', 'Login successful', {
                    user: {
                        id: user.driver_id, 
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        type: 'driver' 
                    }
                });
            } else {
                return sendResponse('error', 'Invalid email or password');
            }
        }

        // --- CHECK 4: NOT FOUND ANYWHERE ---
        return sendResponse('error', 'Invalid email or password');

    } catch (error) {
        console.error("Login Error:", error);
        sendResponse('error', 'Internal Server Error');
    } finally {
        if (connection) await connection.end();
    }
};

main();