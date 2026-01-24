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
  '.xml': 'application/xml',
  '.txt': 'text/plain',
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
  // PRIORITY 1: Explicitly handle robots.txt to ensure 200 OK and text/plain
  // This prevents any SPA routing hijack
  if (req.url === '/robots.txt') {
    const robotsPath = path.join(DIST_DIR, 'robots.txt');
    fs.readFile(robotsPath, (err, content) => {
      if (err) {
        console.error(`[ERROR] Failed to serve robots.txt: ${err.message}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(content, 'utf-8');
      console.log(`[VISIT] ${req.method} ${req.url} 200 - Served robots.txt`);
    });
    return;
  }

  // PRIORITY 2: Explicitly handle sitemap.xml
  if (req.url === '/sitemap.xml') {
    const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
    fs.readFile(sitemapPath, (err, content) => {
      if (err) {
        console.error(`[ERROR] Failed to serve sitemap.xml: ${err.message}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/xml' });
      res.end(content, 'utf-8');
      console.log(`[VISIT] ${req.method} ${req.url} 200 - Served sitemap.xml`);
    });
    return;
  }

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
    // Filter out asset requests to only log human visits (HTML pages or root)
    if (!ext || ext === '.html') {
       console.log(`[VISIT] ${req.method} ${req.url} ${statusCode} - IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`CoreLink Server running on port ${PORT}`);
  console.log(`Serving static files from: ${DIST_DIR}`);
});
