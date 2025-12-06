// Load environment variables (The Keys) immediately!
require('dotenv').config(); 

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const url = require('url'); // Import URL module

const PORT = 8000;
const WEB_ROOT = path.join(__dirname, '../'); 

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // --- 1. CORS Headers ---
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- 2. Handle CGI Scripts ---
    // Clean the URL to remove query parameters (The FIX)
    // e.g., "/cgi-bin/get_rides.js?user_id=2" becomes "/cgi-bin/get_rides.js"
    const parsedUrl = url.parse(req.url); 
    const pathname = parsedUrl.pathname;

    if (pathname.startsWith('/cgi-script/cgi-bin/')) {
        const scriptName = pathname.split('/').pop(); // Now gets just 'get_rides.js'
        const scriptPath = path.join(__dirname, 'cgi-bin', scriptName);

        if (!fs.existsSync(scriptPath)) {
            console.error(`404 Not Found: ${scriptPath}`); // Log the exact path it tried
            res.writeHead(404);
            res.end(`Script not found: ${scriptName}`);
            return;
        }

        // Spawn Node process
        const env = Object.assign({}, process.env, {
            REQUEST_METHOD: req.method,
            CONTENT_LENGTH: req.headers['content-length'] || 0,
            CONTENT_TYPE: req.headers['content-type'] || '',
            QUERY_STRING: parsedUrl.query || '' // Pass the "Note" (user_id=2) to the script
        });

        const script = spawn('node', [scriptPath], { env });

        req.pipe(script.stdin);

        let output = '';
        script.stdout.on('data', (data) => { output += data.toString(); });

        script.stdout.on('end', () => {
            const parts = output.split('\n\n');
            if (parts.length >= 2) {
                const headers = parts[0].split('\n');
                headers.forEach(h => {
                    if (!h.includes(': ')) return;
                    const [key, val] = h.split(': ');
                    if(key && val && !key.includes('[')) {
                        res.setHeader(key, val.trim());
                    }
                });
                res.writeHead(200);
                res.write(parts.slice(1).join('\n\n'));
            } else {
                res.writeHead(200);
                res.write(output);
            }
            res.end();
        });

        script.stderr.on('data', (data) => console.error(`CGI Error: ${data}`));
        return;
    }

    // --- 3. Handle Static Files ---
    let filePath = path.join(WEB_ROOT, pathname === '/' ? 'frontend/register.html' : pathname);
    
    // Security check
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
    console.log(`Node CGI Server running at http://localhost:${PORT}`);
});