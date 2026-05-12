const router = require('express').Router();
const { getPool } = require('../db');
const cache = require('../cache');
const auth = require('../middleware/auth');

// Update profil sendiri (dosen login)
router.put('/me', auth('dosen'), async (req, res) => {
  const { nama, jurusan, jabatan } = req.body;
  try {
    await getPool().query('UPDATE dosen SET nama=?, jurusan=?, jabatan=? WHERE id=?',
      [nama, jurusan, jabatan, req.user.ref_id]);
    cache.del('dosen', 'mahasiswa');
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.get('/', auth(), async (req, res) => {
  const cached = cache.get('dosen');
  if (cached) return res.json(cached);
  const [rows] = await getPool().query('SELECT * FROM dosen ORDER BY nama');
  cache.set('dosen', rows);
  res.json(rows);
});

router.post('/', auth('admin'), async (req, res) => {
  const { nip, nama, jurusan, jabatan } = req.body;
  try {
    const [result] = await getPool().query(
      'INSERT INTO dosen (nip, nama, jurusan, jabatan) VALUES (?, ?, ?, ?)',
      [nip, nama, jurusan, jabatan]
    );
    cache.del('dosen', 'mahasiswa');
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: `NIP ${nip} sudah terdaftar.` });
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.put('/:id', auth('admin'), async (req, res) => {
  const { nip, nama, jurusan, jabatan } = req.body;
  try {
    await getPool().query(
      'UPDATE dosen SET nip=?, nama=?, jurusan=?, jabatan=? WHERE id=?',
      [nip, nama, jurusan, jabatan, req.params.id]
    );
    cache.del('dosen', 'mahasiswa');
    res.json({ message: 'Updated' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: `NIP ${nip} sudah terdaftar.` });
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

router.delete('/:id', auth('admin'), async (req, res) => {
  await getPool().query('DELETE FROM dosen WHERE id=?', [req.params.id]);
  cache.del('dosen', 'mahasiswa');
  res.json({ message: 'Deleted' });
});

module.exports = router;
