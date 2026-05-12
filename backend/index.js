require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { init } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/dosen', require('./routes/dosen'));
app.use('/api/mahasiswa', require('./routes/mahasiswa'));
app.use('/api/users', require('./routes/users'));

// Endpoint seed sekali pakai — hapus setelah digunakan
app.get('/api/seed', async (req, res) => {
  if (req.query.key !== process.env.SEED_KEY)
    return res.status(403).json({ message: 'Forbidden' });
  try {
    const run = require('./seed-runner');
    await run();
    res.json({ message: 'Seed berhasil!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;

init()
  .then(() => app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`)))
  .catch((err) => { console.error('Gagal koneksi ke database:', err.message); process.exit(1); });
