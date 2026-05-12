const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await getPool().query('SELECT * FROM users WHERE username = ?', [username]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Username atau password salah.' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, ref_id: user.ref_id },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, role: user.role, username: user.username, ref_id: user.ref_id });
});

module.exports = router;
