const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let pool;

async function init() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await conn.end();

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','dosen','mahasiswa') NOT NULL DEFAULT 'mahasiswa',
      ref_id INT DEFAULT NULL
    )
  `);

  // Buat akun admin default jika belum ada
  const [admins] = await pool.query("SELECT id FROM users WHERE role='admin' LIMIT 1");
  if (admins.length === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query("INSERT INTO users (username, password, role) VALUES ('admin', ?, 'admin')", [hash]);
    console.log('Akun admin default: username=admin, password=admin123');
  }

  console.log('Database siap.');
}

module.exports = { init, getPool: () => pool };
