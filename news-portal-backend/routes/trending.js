const express = require("express");
const router = express.Router();
const pool = require("../db");

// Helper untuk range tanggal
function getDateRange(type) {
  const now = new Date();
  let start;

  if (type === "day") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (type === "week") {
    const first = now.getDate() - now.getDay();
    start = new Date(now.setDate(first));
  } else if (type === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return start.toISOString();
}

router.get("/:range", async (req, res) => {
  const { range } = req.params;

  if (!["day", "week", "month"].includes(range)) {
    return res.status(400).json({ message: "Invalid range" });
  }

  const startDate = getDateRange(range);

  try {
    const result = await pool.query(
      `
      SELECT a.id, a.title, a.slug, a.thumbnail_url,
             a.views, a.excerpt, a.created_at,
             c.name AS category
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.created_at >= $1
      ORDER BY a.views DESC
      LIMIT 5
      `,
      [startDate]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
