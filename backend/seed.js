require('dotenv').config();
const mysql = require('mysql2/promise');

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Clear existing data
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  await conn.query('TRUNCATE TABLE mahasiswa');
  await conn.query('TRUNCATE TABLE dosen');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  // Insert dosen
  const dosen = [
    ['198501012010011001', 'Dr. Budi Santoso, M.Kom.', 'Teknik Informatika', 'Lektor Kepala'],
    ['197803152005012002', 'Prof. Siti Rahayu, Ph.D.', 'Sistem Informasi', 'Guru Besar'],
    ['198912202015041003', 'Eko Prasetyo, M.T.', 'Teknik Elektro', 'Lektor'],
    ['199002102018031004', 'Dewi Anggraini, M.Sc.', 'Teknik Informatika', 'Asisten Ahli'],
    ['197605281999031005', 'Dr. Hendra Wijaya, M.M.', 'Sistem Informasi', 'Lektor Kepala'],
  ];

  const [dosenResult] = await conn.query(
    'INSERT INTO dosen (nip, nama, jurusan, jabatan) VALUES ?',
    [dosen]
  );

  // Insert mahasiswa (dosen_id 1-5)
  const mahasiswa = [
    ['2021050001', 'Andi Pratama', 'Teknik Informatika', 3, 1],
    ['2021050002', 'Bela Safitri', 'Teknik Informatika', 3, 1],
    ['2020060003', 'Cahyo Nugroho', 'Sistem Informasi', 5, 2],
    ['2020060004', 'Dina Marlina', 'Sistem Informasi', 5, 2],
    ['2020060005', 'Eka Surya', 'Sistem Informasi', 5, 2],
    ['2019070006', 'Fajar Ramadhan', 'Teknik Elektro', 7, 3],
    ['2019070007', 'Gita Permata', 'Teknik Elektro', 7, 3],
    ['2022040008', 'Hani Kusuma', 'Teknik Informatika', 1, 4],
    ['2022040009', 'Irfan Hakim', 'Teknik Informatika', 1, 4],
    ['2021080010', 'Joko Susilo', 'Sistem Informasi', 3, 5],
    ['2021080011', 'Kartika Dewi', 'Sistem Informasi', 3, 5],
    ['2023010012', 'Luthfi Azhar', 'Teknik Informatika', 1, null],
  ];

  await conn.query(
    'INSERT INTO mahasiswa (nim, nama, jurusan, semester, dosen_id) VALUES ?',
    [mahasiswa]
  );

  await conn.end();
  console.log('Seed berhasil! Data simulasi sudah dimasukkan.');
}

seed().catch((err) => { console.error('Seed gagal:', err.message); process.exit(1); });
