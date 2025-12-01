// routes/comments.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Anti spam 15 detik per IP
const cooldown = new Map();

// GET komentar per artikel
router.get("/:articleId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [req.params.articleId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /comments error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST komentar baru
router.post("/:articleId", async (req, res) => {
  const { username, message } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Pesan komentar tidak boleh kosong." });
  }

  const now = Date.now();
  if (cooldown.has(ip) && now - cooldown.get(ip) < 15000) {
    return res.status(429).json({
      error: "Tunggu 15 detik sebelum mengirim komentar lagi.",
    });
  }
  cooldown.set(ip, now);

  try {
    const result = await pool.query(
      `
      INSERT INTO comments (article_id, username, message, ip_address)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [req.params.articleId, username || "Anonim", message.trim(), ip]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("POST /comments error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
