const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getPool } = require('../db');
const auth = require('../middleware/auth');

// GET all users (admin only)
router.get('/', auth('admin'), async (req, res) => {
  const [rows] = await getPool().query('SELECT id, username, role, ref_id FROM users ORDER BY role, username');
  res.json(rows);
});

// POST create user (admin only)
router.post('/', auth('admin'), async (req, res) => {
  const { username, password, role, ref_id } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await getPool().query(
      'INSERT INTO users (username, password, role, ref_id) VALUES (?, ?, ?, ?)',
      [username, hash, role, ref_id || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: `Username "${username}" sudah digunakan.` });
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// PUT update role (admin only)
router.put('/:id', auth('admin'), async (req, res) => {
  const { role, ref_id } = req.body;
  await getPool().query('UPDATE users SET role=?, ref_id=? WHERE id=?', [role, ref_id || null, req.params.id]);
  res.json({ message: 'Updated' });
});

// DELETE user (admin only)
router.delete('/:id', async (req, res) => {
  await getPool().query('DELETE FROM users WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
