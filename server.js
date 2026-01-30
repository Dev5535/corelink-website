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

const ACTIVE_DOMAIN = (process.env.ACTIVE_DOMAIN || 'corelink-website.onrender.com').toLowerCase();
const STANDBY_DOMAIN = (process.env.STANDBY_DOMAIN || 'corelinkautomation.com').toLowerCase();
const SWITCH_REASON = process.env.SWITCH_REASON || 'domain cutover';
let switchedAt = null;

function logEvent(type, payload = {}) {
  const ts = new Date().toISOString();
  console.log(JSON.stringify({ ts, type, ...payload }));
}

function startPromotions(domain) {
  logEvent('core_pulse_start', { domain });
}

function stopPromotions(domain) {
  logEvent('core_pulse_stop', { domain });
}

 

 

 

 

const ROUTES_FOR_SITEMAP = ['/', '/products', '/payments', '/contact', '/legal'];
function generateSitemap(baseUrl, publish = true) {
  const urlset = ROUTES_FOR_SITEMAP.map((r) => `  <url><loc>https://${baseUrl}${r}</loc><changefreq>weekly</changefreq></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;
  const filename = publish ? 'sitemap.xml' : 'sitemap-standby.xml';
  try {
    fs.writeFileSync(path.join(DIST_DIR, filename), xml, 'utf-8');
    logEvent(publish ? 'sitemap_generated' : 'sitemap_prepared', { base: baseUrl, count: ROUTES_FOR_SITEMAP.length, file: filename });
  } catch (e) {
    logEvent('sitemap_error', { error: e.message, file: filename });
  }
}

async function orchestrateSwitch() {
  stopPromotions(ACTIVE_DOMAIN);
  startPromotions(STANDBY_DOMAIN);
  switchedAt = new Date().toISOString();
  logEvent('domain_switched', { from: ACTIVE_DOMAIN, to: STANDBY_DOMAIN, reason: SWITCH_REASON, at: switchedAt });
  generateSitemap(STANDBY_DOMAIN, true);
}

await orchestrateSwitch();

const server = http.createServer((req, res) => {
  const host = (req.headers.host || '').toLowerCase().split(':')[0];
  if (host === ACTIVE_DOMAIN || host === `www.${ACTIVE_DOMAIN}`) {
    const location = `https://${STANDBY_DOMAIN}${req.url}`;
    res.writeHead(301, { Location: location });
    res.end();
    logEvent('redirect_301', { from: host, to: STANDBY_DOMAIN, path: req.url });
    return;
  }
  const standbyActive = false;

  if (standbyActive) {
    return;
  }
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

    if (!ext || ext === '.html') {
       console.log(`[VISIT] ${req.method} ${req.url} ${statusCode} - IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`CoreLink Server running on port ${PORT}`);
  console.log(`Serving static files from: ${DIST_DIR}`);
});
