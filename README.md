# Sistem Bimbingan Akademik

Aplikasi web untuk mencatat hubungan bimbingan antara dosen dan mahasiswa.

## Fitur
- CRUD data **Dosen** (NIP, nama, jurusan, jabatan)
- CRUD data **Mahasiswa** (NIM, nama, jurusan, semester, dosen pembimbing)
- **Tabel Bimbingan** — tampilan mahasiswa dikelompokkan per dosen pembimbing

## Teknologi
- **Backend**: Node.js, Express, MySQL2, CORS, dotenv
- **Frontend**: React, Vite, Tailwind CSS v3

---

## Cara Menjalankan

### 1. Siapkan Database MySQL

Buka MySQL client (MySQL Workbench, phpMyAdmin, atau terminal), lalu jalankan:

```sql
-- Dari file backend/schema.sql
source path/to/student-advisor/backend/schema.sql
```

Atau copy-paste isi file `backend/schema.sql` ke MySQL client Anda.

### 2. Konfigurasi Backend

Edit file `backend/.env` sesuai konfigurasi MySQL Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_anda
DB_NAME=student_advisor
PORT=5000
```

### 3. Jalankan Backend

```bash
cd backend
npm install
npm start
```

Server berjalan di `http://localhost:5000`

### 4. Jalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

---

## Struktur Project

```
student-advisor/
├── backend/
│   ├── routes/
│   │   ├── dosen.js       # API /api/dosen
│   │   └── mahasiswa.js   # API /api/mahasiswa
│   ├── db.js              # Koneksi MySQL
│   ├── index.js           # Entry point Express
│   ├── schema.sql         # Skema database
│   └── .env               # Konfigurasi (tidak di-commit)
└── frontend/
    └── src/
        ├── components/
        │   ├── DosenPage.jsx
        │   ├── MahasiswaPage.jsx
        │   ├── BimbinganPage.jsx
        │   └── Modal.jsx
        ├── App.jsx
        ├── api.js
        └── main.jsx
```

## API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /api/dosen | Ambil semua dosen |
| POST | /api/dosen | Tambah dosen baru |
| PUT | /api/dosen/:id | Update data dosen |
| DELETE | /api/dosen/:id | Hapus dosen |
| GET | /api/mahasiswa | Ambil semua mahasiswa (+ nama dosen) |
| POST | /api/mahasiswa | Tambah mahasiswa baru |
| PUT | /api/mahasiswa/:id | Update data mahasiswa |
| DELETE | /api/mahasiswa/:id | Hapus mahasiswa |
