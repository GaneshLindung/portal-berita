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