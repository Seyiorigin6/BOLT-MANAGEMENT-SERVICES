// Run this once: node create_admin.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const main = async () => {
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'main_db'
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Admin Credentials
        // use to create an admin only
        // const email = 'admin@bolt.com';
        // const password = 'enter password';
        // const name = 'djskldkls';

        // Hash it
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        console.log(`🔑 Creating Admin...`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        // Insert (Ignore if exists)
        await connection.execute(
            `INSERT IGNORE INTO admins (name, email, password_hash) VALUES (?, ?, ?)`,
            [name, email, hash]
        );

        console.log('✅ Admin inserted successfully! You can now login.');
        await connection.end();

    } catch (e) {
        console.error('❌ Error:', e.message);
    }
};

main();