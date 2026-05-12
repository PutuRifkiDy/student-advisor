const bcrypt = require('bcryptjs');
const { getPool } = require('./db');

module.exports = async function run() {
  const pool = getPool();

  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  await pool.query('TRUNCATE TABLE mahasiswa');
  await pool.query('TRUNCATE TABLE dosen');
  await pool.query("DELETE FROM users WHERE role != 'admin'");
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');

  const dosen = [
    ['198501012010011001', 'Dr. Budi Santoso, M.Kom.', 'Teknik Informatika', 'Lektor Kepala'],
    ['197803152005012002', 'Prof. Siti Rahayu, Ph.D.', 'Sistem Informasi', 'Guru Besar'],
    ['198912202015041003', 'Eko Prasetyo, M.T.', 'Teknik Elektro', 'Lektor'],
    ['199002102018031004', 'Dewi Anggraini, M.Sc.', 'Teknik Informatika', 'Asisten Ahli'],
    ['197605281999031005', 'Dr. Hendra Wijaya, M.M.', 'Sistem Informasi', 'Lektor Kepala'],
  ];

  const [dosenResult] = await pool.query('INSERT INTO dosen (nip, nama, jurusan, jabatan) VALUES ?', [dosen]);
  const firstDosenId = dosenResult.insertId;

  const mahasiswa = [
    ['2021050001', 'Andi Pratama', 'Teknik Informatika', 3, firstDosenId],
    ['2021050002', 'Bela Safitri', 'Teknik Informatika', 3, firstDosenId],
    ['2020060003', 'Cahyo Nugroho', 'Sistem Informasi', 5, firstDosenId + 1],
    ['2020060004', 'Dina Marlina', 'Sistem Informasi', 5, firstDosenId + 1],
    ['2020060005', 'Eka Surya', 'Sistem Informasi', 5, firstDosenId + 1],
    ['2019070006', 'Fajar Ramadhan', 'Teknik Elektro', 7, firstDosenId + 2],
    ['2019070007', 'Gita Permata', 'Teknik Elektro', 7, firstDosenId + 2],
    ['2022040008', 'Hani Kusuma', 'Teknik Informatika', 1, firstDosenId + 3],
    ['2022040009', 'Irfan Hakim', 'Teknik Informatika', 1, firstDosenId + 3],
    ['2021080010', 'Joko Susilo', 'Sistem Informasi', 3, firstDosenId + 4],
    ['2021080011', 'Kartika Dewi', 'Sistem Informasi', 3, firstDosenId + 4],
    ['2023010012', 'Luthfi Azhar', 'Teknik Informatika', 1, null],
  ];

  const [mResult] = await pool.query('INSERT INTO mahasiswa (nim, nama, jurusan, semester, dosen_id) VALUES ?', [mahasiswa]);
  const firstMhsId = mResult.insertId;

  const hash = (p) => bcrypt.hash(p, 10);
  for (let i = 0; i < dosen.length; i++) {
    const nip = dosen[i][0];
    await pool.query('INSERT IGNORE INTO users (username, password, role, ref_id) VALUES (?, ?, ?, ?)',
      [nip, await hash(nip), 'dosen', firstDosenId + i]);
  }
  for (let i = 0; i < mahasiswa.length; i++) {
    const nim = mahasiswa[i][0];
    await pool.query('INSERT IGNORE INTO users (username, password, role, ref_id) VALUES (?, ?, ?, ?)',
      [nim, await hash(nim), 'mahasiswa', firstMhsId + i]);
  }
};
