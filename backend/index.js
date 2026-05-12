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

const PORT = process.env.PORT || 5000;

init()
  .then(() => app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`)))
  .catch((err) => { console.error('Gagal koneksi ke database:', err.message); process.exit(1); });
