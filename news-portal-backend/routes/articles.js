// routes/articles.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * GET /api/articles/featured
 * Ambil 1–3 berita utama (is_featured = true)
 */
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.title, a.slug, a.thumbnail_url, a.created_at,
              a.excerpt, a.author, a.views, c.name AS category
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.is_featured = TRUE
       ORDER BY a.created_at DESC
       LIMIT 3`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/articles
 * Query:
 *  - category=Teknologi
 *  - q=kata+kunci
 *  - sort=popular (default: newest)
 *  - limit, offset
 */
router.get('/', async (req, res) => {
  try {
    const { category, q, sort, limit = 12, offset = 0 } = req.query;

    const params = [];
    const whereClauses = [];

    let baseQuery = `
      SELECT a.id, a.title, a.slug, a.thumbnail_url, a.created_at,
             a.excerpt, a.author, a.views,
             c.name AS category
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
    `;

    if (category) {
      params.push(category);
      whereClauses.push(`c.name = $${params.length}`);
    }

    if (q) {
      params.push(`%${q}%`);
      whereClauses.push(
        `(a.title ILIKE $${params.length} OR a.content ILIKE $${params.length})`
      );
    }

    if (whereClauses.length > 0) {
      baseQuery += ' WHERE ' + whereClauses.join(' AND ');
    }

    let orderBy = ' ORDER BY a.created_at DESC';
    if (sort === 'popular') {
      orderBy = ' ORDER BY a.views DESC, a.created_at DESC';
    }

    params.push(limit);
    params.push(offset);

    const finalQuery =
      baseQuery +
      orderBy +
      ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await pool.query(finalQuery, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/articles/:slug
 * Detail berita
 */
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.*, c.name AS category
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.slug = $1
       LIMIT 1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/articles/:slug/view
 * Naikkan view count ketika artikel dibaca
 */
router.post('/:slug/view', async (req, res) => {
  const { slug } = req.params;
  try {
    await pool.query(
      `UPDATE articles
       SET views = COALESCE(views, 0) + 1
       WHERE slug = $1`,
      [slug]
    );
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
