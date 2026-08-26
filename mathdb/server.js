/**
 * MathVault - Node.js Backend Server & Persistent Storage Engine
 * Features:
 * - Direct JSON File Persistence (questions.json)
 * - REST API (/api/questions, /api/questions/:id, /api/questions/bulk, /api/questions/clear)
 * - Built-in Static File Web Server with MIME types
 * - Zero Dependencies (runs natively on any standard Node.js installation)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'questions.json');
const SAMPLE_DATA_FILE = path.join(__dirname, 'sample_data.js');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// -------------------------------------------------------------
// Database Helper Methods (questions.json)
// -------------------------------------------------------------
function readInitialSeedFromSampleData() {
  try {
    if (fs.existsSync(SAMPLE_DATA_FILE)) {
      const code = fs.readFileSync(SAMPLE_DATA_FILE, 'utf8');
      const match = code.match(/const\s+INITIAL_SAMPLE_QUESTIONS\s*=\s*(\[[\s\S]*?\]);/);
      if (match) {
        // Safe evaluation of sample data array
        const parsed = new Function(`return ${match[1]};`)();
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch (err) {
    console.warn('[Server] Could not extract seed data from sample_data.js:', err.message);
  }
  return [];
}

function loadQuestions() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = readInitialSeedFromSampleData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
      console.log(`[Server] Initialized questions.json with ${initial.length} default questions.`);
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[Server] Error reading questions.json:', err.message);
    return [];
  }
}

function saveQuestions(questionsList) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(questionsList, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[Server] Error saving questions.json:', err.message);
    return false;
  }
}

// -------------------------------------------------------------
// Request Body Reader
// -------------------------------------------------------------
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) { // 50MB limit (for base64 diagrams)
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// -------------------------------------------------------------
// HTTP Server & Route Handler
// -------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // ---------------- API Routes ----------------

  // 1. GET /api/questions -> List all questions
  if (req.method === 'GET' && pathname === '/api/questions') {
    const questions = loadQuestions();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(questions));
    return;
  }

  // 2. GET /api/health -> Health Check
  if (req.method === 'GET' && pathname === '/api/health') {
    const questions = loadQuestions();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', totalQuestions: questions.length, file: 'questions.json' }));
    return;
  }

  // 3. POST /api/questions -> Add or Update a Question
  if (req.method === 'POST' && pathname === '/api/questions') {
    try {
      const question = await parseRequestBody(req);
      if (!question || !question.id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Question object with valid id is required' }));
        return;
      }

      const questions = loadQuestions();
      const existingIdx = questions.findIndex((q) => q.id === question.id);
      if (existingIdx >= 0) {
        questions[existingIdx] = question;
      } else {
        questions.unshift(question);
      }

      saveQuestions(questions);
      console.log(`[Server] Saved question "${question.title || question.id}" (${questions.length} total)`);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, count: questions.length, question }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 4. DELETE /api/questions/:id -> Delete a question by ID
  if (req.method === 'DELETE' && pathname.startsWith('/api/questions/')) {
    const idToDelete = decodeURIComponent(pathname.replace('/api/questions/', ''));
    if (!idToDelete) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Question ID required' }));
      return;
    }

    const questions = loadQuestions();
    const initialLen = questions.length;
    const filtered = questions.filter((q) => q.id !== idToDelete);

    saveQuestions(filtered);
    console.log(`[Server] Deleted question ID "${idToDelete}". (${initialLen} -> ${filtered.length})`);

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, count: filtered.length, deletedId: idToDelete }));
    return;
  }

  // 5. POST /api/questions/bulk -> Bulk import/replace questions
  if (req.method === 'POST' && pathname === '/api/questions/bulk') {
    try {
      const payload = await parseRequestBody(req);
      const incomingList = Array.isArray(payload) ? payload : (payload.questions || []);

      const questions = loadQuestions();
      const map = new Map();
      questions.forEach((q) => map.set(q.id, q));
      incomingList.forEach((q) => map.set(q.id, q));

      const combined = Array.from(map.values());
      saveQuestions(combined);
      console.log(`[Server] Bulk updated questions. (${questions.length} -> ${combined.length})`);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, count: combined.length }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 6. POST /api/questions/clear -> Clear all questions
  if (req.method === 'POST' && pathname === '/api/questions/clear') {
    saveQuestions([]);
    console.log('[Server] Cleared all questions.');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, count: 0 }));
    return;
  }

  // ---------------- Static File Serving ----------------
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = 'index.html';
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for client-side routing
      const indexFile = path.join(__dirname, 'index.html');
      fs.readFile(indexFile, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error loading file');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

// Initialize on startup
// Start server with dynamic port fallback
function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`\n========================================================`);
    console.log(`  🚀 MathVault Server is running!`);
    console.log(`  🌐 Web URL:    http://localhost:${portToTry}`);
    console.log(`  📁 Data File:  ${DATA_FILE}`);
    console.log(`========================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Server] Port ${portToTry} is in use. Trying port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('[Server] Fatal error:', err);
    }
  });
}

startServer(Number(PORT));

