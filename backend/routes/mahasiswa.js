const router = require('express').Router();
const { getPool } = require('../db');
const cache = require('../cache');
const auth = require('../middleware/auth');

// Update profil sendiri (mahasiswa login) — harus sebelum /:id
router.put('/me', auth('mahasiswa'), async (req, res) => {
  const { nama, jurusan, semester } = req.body;
  try {
    await getPool().query('UPDATE mahasiswa SET nama=?, jurusan=?, semester=? WHERE id=?',
      [nama, jurusan, semester, req.user.ref_id]);
    cache.del('mahasiswa');
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.get('/', auth(), async (req, res) => {
  const cached = cache.get('mahasiswa');
  if (cached) return res.json(cached);
  const [rows] = await getPool().query(`
    SELECT m.*, d.nama AS nama_dosen, d.nip AS nip_dosen
    FROM mahasiswa m
    LEFT JOIN dosen d ON m.dosen_id = d.id
    ORDER BY m.nama
  `);
  cache.set('mahasiswa', rows);
  res.json(rows);
});

router.post('/', auth('admin'), async (req, res) => {
  const { nim, nama, jurusan, semester, dosen_id } = req.body;
  try {
    const [result] = await getPool().query(
      'INSERT INTO mahasiswa (nim, nama, jurusan, semester, dosen_id) VALUES (?, ?, ?, ?, ?)',
      [nim, nama, jurusan, semester, dosen_id || null]
    );
    cache.del('mahasiswa');
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: `NIM ${nim} sudah terdaftar.` });
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.put('/:id', auth('admin'), async (req, res) => {
  const { nim, nama, jurusan, semester, dosen_id } = req.body;
  try {
    await getPool().query(
      'UPDATE mahasiswa SET nim=?, nama=?, jurusan=?, semester=?, dosen_id=? WHERE id=?',
      [nim, nama, jurusan, semester, dosen_id || null, req.params.id]
    );
    cache.del('mahasiswa');
    res.json({ message: 'Updated' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: `NIM ${nim} sudah terdaftar.` });
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.delete('/:id', auth('admin'), async (req, res) => {
  await getPool().query('DELETE FROM mahasiswa WHERE id=?', [req.params.id]);
  cache.del('mahasiswa');
  res.json({ message: 'Deleted' });
});

module.exports = router;
