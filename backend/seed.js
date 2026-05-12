require('dotenv').config();
const { init } = require('./db');
const run = require('./seed-runner');

async function seed() {
  await init();
  await run();
  console.log('Seed berhasil!');
  console.log('Admin    : username=admin, password=admin123');
  console.log('Dosen    : username=NIP, password=NIP');
  console.log('Mahasiswa: username=NIM, password=NIM');
  process.exit(0);
}

seed().catch((err) => { console.error('Seed gagal:', err.message); process.exit(1); });
