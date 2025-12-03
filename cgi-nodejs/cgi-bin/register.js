
// const mysql = require('mysql2/promise');
// const bcrypt = require('bcryptjs');

// // --- 1. INTERNAL HELPERS (Formerly in utils) ---

// // Helper: Database Config (Living directly inside the file)
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME || 'main_db',
//     waitForConnections: true,
//     connectionLimit: 1, // Keep it low for CGI
//     queueLimit: 0
// };

// // Helper: Parse JSON Body from STDIN
// const getBody = async () => {
//     return new Promise((resolve) => {
//         let body = '';
//         process.stdin.setEncoding('utf8');
//         process.stdin.on('data', chunk => body += chunk);
//         process.stdin.on('end', () => {
//             try { resolve(body ? JSON.parse(body) : {}); } 
//             catch (e) { resolve({}); }
//         });
//     });
// };

// // Helper: Send JSON Response
// const sendResponse = (status, message, data = null) => {
//     console.log("Content-Type: application/json");
//     console.log(""); // Header/Body separator
//     console.log(JSON.stringify({ status, message, ...data }));
// };

// // --- 2. MAIN LOGIC ---

// const main = async () => {
//     let connection;
//     try {
//         const body = await getBody();
//         const { name, phone, email, password, user_type } = body;

//         // Validation
//         if (!name || !phone || !email || !password) {
//             return sendResponse('error', 'Missing required fields');
//         }

//         // Connect to DB
//         connection = await mysql.createConnection(dbConfig);

//         // Hash Password
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(password, salt);

//         // Insert
//         const [result] = await connection.execute(
//             `INSERT INTO riders (name, phone, email, password_hash) VALUES (?, ?, ?, ?)`,
//             [name, phone, email, hash]
//         );

//         sendResponse('success', 'Rider registered successfully', { rider_id: result.insertId });

//     } catch (error) {
//         if (error.code === 'ER_DUP_ENTRY') {
//             sendResponse('error', 'Phone number or Email already exists');
//         } else {
//             // Log to server console for debugging, but send generic error to user
//             console.error("Register Error:", error);
//             sendResponse('error', 'Internal Server Error');
//         }
//     } finally {
//         if (connection) await connection.end();
//     }
// };

// main();

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// --- 1. INTERNAL HELPERS (Formerly in utils) ---

// Helper: Database Config (Living directly inside the file)
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'main_db',
    waitForConnections: true,
    connectionLimit: 1, // Keep it low for CGI
    queueLimit: 0
};

// Helper: Parse JSON Body from STDIN
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

// Helper: Send JSON Response
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
        // Added 'licence_number' to destructuring
        const { name, phone, email, password, user_type, licence_number } = body;

        // Validation
        if (!name || !phone || !email || !password) {
            return sendResponse('error', 'Missing required fields');
        }

        // Connect to DB
        connection = await mysql.createConnection(dbConfig);

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // --- SORTING LOGIC ---
        if (user_type === 'driver') {
            // DRIVER REGISTRATION
            if (!licence_number) {
                return sendResponse('error', 'License number is required for drivers');
            }

            // Insert into 'drivers' table
            // Note: We map frontend 'licence_number' to DB 'license_number'
            const [result] = await connection.execute(
                `INSERT INTO drivers (name, phone, email, password_hash, license_number) VALUES (?, ?, ?, ?, ?)`,
                [name, phone, email, hash, licence_number]
            );

            sendResponse('success', 'Driver registered successfully', { driver_id: result.insertId });

        } else {
            // CUSTOMER (RIDER) REGISTRATION
            const [result] = await connection.execute(
                `INSERT INTO riders (name, phone, email, password_hash) VALUES (?, ?, ?, ?)`,
                [name, phone, email, hash]
            );

            sendResponse('success', 'Rider registered successfully', { rider_id: result.insertId });
        }

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            sendResponse('error', 'Phone number, Email, or License already exists');
        } else if (error.code === 'ER_BAD_FIELD_ERROR') {
             // Specific error if you forgot to run the ALTER TABLE command
             console.error("Schema Error:", error);
             sendResponse('error', 'Database schema mismatch (Missing password_hash in drivers?)');
        } else {
            // Log to server console for debugging
            console.error("Register Error:", error);
            sendResponse('error', 'Internal Server Error');
        }
    } finally {
        if (connection) await connection.end();
    }
};

main();