// Load environment variables (The Keys) immediately!
require('dotenv').config(); 

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8000;
// We assume this file is in BOLT/backend-node/server.js
// So we go up one level to reach the BOLT root
const WEB_ROOT = path.join(__dirname, '../'); 

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // --- 1. CORS Headers (Crucial for frontend fetch) ---
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle Preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- 2. Handle CGI Scripts (The "Kitchen") ---
    // Matches URLs like /cgi-script/cgi-bin/register.js
    if (req.url.startsWith('/cgi-script/cgi-bin/')) {
        const scriptName = req.url.split('/').pop(); // Gets 'register.js'
        const scriptPath = path.join(__dirname, 'cgi-bin', scriptName);

        if (!fs.existsSync(scriptPath)) {
            res.writeHead(404);
            res.end(`Script not found: ${scriptName}`);
            return;
        }

        // Spawn a new Node process (The "CGI" part)
        // This is like the Head Chef shouting "Order Up!" to a specific line cook
        // Note: process.env already contains the loaded .env vars now!
        const env = Object.assign({}, process.env, {
            REQUEST_METHOD: req.method,
            CONTENT_LENGTH: req.headers['content-length'] || 0,
            CONTENT_TYPE: req.headers['content-type'] || ''
        });

        // 'node' is the command, [scriptPath] is the argument
        const script = spawn('node', [scriptPath], { env });

        // Pipe the request body (POST data) FROM the browser TO the script
        req.pipe(script.stdin);

        // Capture the output FROM the script
        let output = '';
        script.stdout.on('data', (data) => {
            output += data.toString();
        });

        script.stdout.on('end', () => {
            // Check if script outputted headers (separated by double newline)
            const parts = output.split('\n\n');
            if (parts.length >= 2) {
                // If headers exist, parse them (e.g., Content-Type: application/json)
                const headers = parts[0].split('\n');
                headers.forEach(h => {
                    // Safety check: Ignore lines that don't look like headers (prevents dotenv log crashes)
                    if (!h.includes(': ')) return;
                    
                    const [key, val] = h.split(': ');
                    if(key && val && !key.includes('[')) { // Extra safety against [debug] logs
                        res.setHeader(key, val.trim());
                    }
                });
                res.writeHead(200);
                res.write(parts.slice(1).join('\n\n'));
            } else {
                // Fallback: Just send raw output
                res.writeHead(200);
                res.write(output);
            }
            res.end();
        });

        // Handle Script Errors
        script.stderr.on('data', (data) => console.error(`CGI Error: ${data}`));
        
        return;
    }

    // --- 3. Handle Static Files (The "Dining Room") ---
    // Serves HTML, CSS, JS from the 'frontend' folder
    
    // Default to frontend/register.html if root is requested
    let filePath = path.join(WEB_ROOT, req.url === '/' ? 'frontend/register.html' : req.url);
    
    // Security: Prevent accessing files outside project
    if (!filePath.startsWith(WEB_ROOT)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
    }

    const ext = path.extname(filePath);
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`Node CGI Server running at http://localhost:${PORT}`);
    console.log(`Serving files from: ${WEB_ROOT}`);
    console.log(`Expecting CGI scripts in: ${path.join(__dirname, 'cgi-bin')}`);
    console.log(`--------------------------------------------------`);
});