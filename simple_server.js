const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8091;
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

http.createServer(function (request, response) {
    // Decode URL to handle spaces and special characters appropriately
    const safeUrl = decodeURI(request.url);
    let filePath = path.join(__dirname, safeUrl);

    try {
        // If it sends to a directory, checking if it has a trailing slash
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            if (!request.url.endsWith('/')) {
                // Redirect to the same path with a trailing slash
                response.writeHead(301, { 'Location': request.url + '/' });
                response.end();
                return;
            }
            // If it has a trailing slash, serve index.html
            filePath = path.join(filePath, 'index.html');
        }
    } catch (e) {
        // Continue if standard file check fails or other error
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile(path.join(__dirname, '404.html'), function (error, content) {
                    if (error) {
                        response.writeHead(404);
                        response.end('404 Not Found', 'utf-8');
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/html' });
                        response.end(content, 'utf-8');
                    }
                });
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(port, '0.0.0.0');

console.log(`Server running at http://localhost:${port}/`);
