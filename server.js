import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
// We are now in the root of the project (website/), so dist should be here.
const DIST_DIR = path.join(__dirname, 'dist'); 

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  // Handle request
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  let ext = path.extname(filePath);
  
  // If no extension, it's likely a route (e.g. /merch), so serve index.html (SPA)
  if (!ext) {
    filePath = path.join(DIST_DIR, 'index.html');
    ext = '.html';
  }

  fs.readFile(filePath, (err, content) => {
    let statusCode = 200;
    
    if (err) {
      if (err.code === 'ENOENT') {
        // If file not found...
        // 1. If it was an asset (has extension), return 404
        if (req.url.includes('.')) {
             statusCode = 404;
             res.writeHead(404);
             res.end('Not Found');
        } else {
            // 2. If it was a route, try index.html (SPA fallback) again just in case logic above failed
             statusCode = 404;
             res.writeHead(404);
             res.end('Not Found');
        }
      } else {
        statusCode = 500;
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }

    // LOGGING TO STDOUT (Captured by Render)
    // Format: [VISIT] METHOD URL STATUS
    console.log(`[VISIT] ${req.method} ${req.url} ${statusCode}`);
  });
});

server.listen(PORT, () => {
  console.log(`CoreLink Server running on port ${PORT}`);
  console.log(`Serving static files from: ${DIST_DIR}`);
});
