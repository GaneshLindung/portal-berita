<<<<<<< HEAD
// index.js (Backend)
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// DB
const pool = require('./db');

// ROUTERS
const articlesRouter = require('./routes/articles');
const trendingRouter = require('./routes/trending');
const commentsRouter = require('./routes/comments'); // ⬅️ TAMBAHKAN INI

// REGISTER ROUTES
app.use('/api/articles', articlesRouter);
app.use('/api/trending', trendingRouter);
app.use('/api/comments', commentsRouter); // ⬅️ DAFTARKAN ROUTE INI

// ROOT ENDPOINT
app.get('/', (req, res) => {
  res.send('News Portal Backend API is running 🚀');
});

// START SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
=======
// index.js (Backend)
const express = require('express');
const cors = require('cors');
const app = express();
const DEFAULT_PORT = 4000;
const DEFAULT_MAX_PORT_RETRIES = 5;

const isValidPort = (port) => Number.isInteger(port) && port > 0 && port < 65536;

const parseEnvNumber = (name, defaultValue, { min, max, allowZero = false }) => {
  const rawValue = process.env[name];

  if (rawValue === undefined || rawValue === '') {
    return defaultValue;
  }

  const parsed = Number(rawValue);
  const isInteger = Number.isInteger(parsed);
  const belowMin = min !== undefined && parsed < min;
  const aboveMax = max !== undefined && parsed > max;
  const zeroNotAllowed = !allowZero && parsed === 0;

  if (!isInteger || belowMin || aboveMax || zeroNotAllowed) {
    const minPart = min !== undefined ? `>= ${min}` : '';
    const maxPart = max !== undefined ? `${minPart ? ' and ' : ''}<= ${max}` : '';
    const rangePart = minPart || maxPart ? ` ${minPart}${maxPart}` : '';
    const zeroPart = zeroNotAllowed ? ' (0 is not allowed)' : '';

    console.error(
      `${name} must be an integer${rangePart}${zeroPart}. Current value: ${rawValue}`,
    );
    process.exit(1);
  }

  return parsed;
};

const configuredPort = parseEnvNumber('PORT', DEFAULT_PORT, {
  min: 1,
  max: 65535,
});

const configuredRetries = parseEnvNumber('MAX_PORT_RETRIES', DEFAULT_MAX_PORT_RETRIES, {
  min: 0,
  allowZero: true,
});

// Middleware
app.use(cors());
app.use(express.json());

// DB
const pool = require('./db');

// ROUTERS
const articlesRouter = require('./routes/articles');
const trendingRouter = require('./routes/trending');
const commentsRouter = require('./routes/comments'); // ⬅️ TAMBAHKAN INI

// REGISTER ROUTES
app.use('/api/articles', articlesRouter);
app.use('/api/trending', trendingRouter);
app.use('/api/comments', commentsRouter); // ⬅️ DAFTARKAN ROUTE INI

// ROOT ENDPOINT
app.get('/', (req, res) => {
  res.send('News Portal Backend API is running 🚀');
});

// START SERVER WITH FALLBACK PORT SEARCH
const startServer = (portToTry, attempt = 0) => {
  if (!isValidPort(portToTry)) {
    console.error(
      `Invalid port: ${portToTry}. Please set PORT to a value between 1 and 65535.`,
    );
    process.exit(1);
  }

  const server = app.listen(portToTry, () => {
    console.log(`Server running on port ${portToTry}`);
  });

  server.on('error', (err) => {
    if (err.code !== 'EADDRINUSE') {
      console.error('Failed to start the server:', err.message);
      process.exit(1);
    }

    if (process.env.PORT) {
      console.error(
        `Port ${portToTry} (from PORT env) is already in use. Stop the process using it or set PORT to a free port.`,
      );
      process.exit(1);
    }

    if (attempt < configuredRetries) {
      const nextPort = portToTry + 1;
      console.warn(
        `Port ${portToTry} is in use. Retrying with port ${nextPort} (attempt ${attempt + 1}/${configuredRetries}).`,
      );
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error(
      `Unable to find an open port after ${configuredRetries + 1} attempts starting at ${DEFAULT_PORT}. Please free a port and restart the server.`,
    );
    process.exit(1);
  });
};

startServer(configuredPort);
>>>>>>> 73c5256d0d5cb2db52ef34721ad5ce9698a04c33
