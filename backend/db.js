const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

async function init() {
  // Connect tanpa database dulu, buat database jika belum ada
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await conn.end();

  // Buat pool dengan database
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Buat tabel jika belum ada
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dosen (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nip VARCHAR(20) NOT NULL UNIQUE,
      nama VARCHAR(100) NOT NULL,
      jurusan VARCHAR(100) NOT NULL,
      jabatan VARCHAR(100) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mahasiswa (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nim VARCHAR(20) NOT NULL UNIQUE,
      nama VARCHAR(100) NOT NULL,
      jurusan VARCHAR(100) NOT NULL,
      semester INT NOT NULL,
      dosen_id INT,
      FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE SET NULL
    )
  `);

  console.log('Database siap.');
}

module.exports = { init, getPool: () => pool };
