# Panduan Menjalankan Project

## Sistem Informasi Pengelolaan Data Alumni & Tracer Study (Politeknik Negeri Manado)

Panduan ini menjelaskan langkah-demi-langkah cara menyiapkan lingkungan kerja (_development environment_) dan menjalankan aplikasi **Alumni Management & Tracer Study** (Backend & Frontend) di komputer lokal Anda menggunakan Laragon, Node.js, dan Prisma ORM.

---

## 📋 Prasyarat Sistem (Prerequisites)

Sebelum memulai, pastikan perangkat Anda telah terpasang aplikasi berikut:

1. **Node.js** (Wajib menggunakan versi **v22.13.1**). Silakan unduh di [Node.js v22.13.1 Release Page](https://nodejs.org/en/blog/release/v22.13.1).
2. **Laragon** (Digunakan sebagai server lokal untuk database MySQL). Unduh di [laragon.org](https://laragon.org/). Cara install Laragon [(Tutorial YouTube)](https://youtu.be/2slaFy_YdfE?si=AYgzEsXaQ4z-7qnK)
3. **Google Chrome** atau **Microsoft Edge** (Wajib terpasang di sistem operasi Windows karena fitur **Ekspor PDF** menggunakan engine Puppeteer yang otomatis mendeteksi browser ini untuk mencetak dokumen).
4. **Visual Studio Code** atau text editor pilihan Anda.

---

## 📥 Langkah 1: Mengunduh Source Code Proyek

Sebelum mulai mengonfigurasi, Anda harus mengunduh kode program dari repositori GitHub ([Oswald-Tan/alumni-management](https://github.com/Oswald-Tan/alumni-management)). Ada dua cara yang dapat Anda gunakan:

### Cara A: Mengunduh sebagai File ZIP (Mudah & Cepat)
1. Buka browser dan kunjungi link repositori berikut: [https://github.com/Oswald-Tan/alumni-management](https://github.com/Oswald-Tan/alumni-management)
2. Klik tombol hijau bertuliskan **"Code"** di bagian kanan atas.
3. Klik **"Download ZIP"**.
4. Setelah file selesai diunduh, ekstrak file `.zip` tersebut ke folder lokal komputer Anda (misalnya di folder `C:\laragon\www\alumni-management` atau direktori lainnya).

### Cara B: Menggunakan perintah Git Clone (Direkomendasikan)
1. Pastikan Anda sudah menginstal Git di komputer Anda. Jika belum, silakan unduh dan instal dari [Git Downloads](https://git-scm.com/downloads).
2. Buka Terminal, Command Prompt, atau Git Bash di direktori tempat Anda ingin menyimpan proyek.
3. Jalankan perintah clone berikut:
   ```bash
   git clone https://github.com/Oswald-Tan/alumni-management.git
   ```
4. Masuk ke direktori proyek yang baru saja di-clone:
   ```bash
   cd alumni-management
   ```

---

## 🛠️ Langkah 2: Persiapan Database dengan Laragon

Aplikasi ini menggunakan database **MySQL** yang dijalankan secara lokal via Laragon.

1. Buka aplikasi **Laragon** di komputer Anda.
2. Klik tombol **"Start All"** untuk menjalankan server Apache dan MySQL.
3. Klik tombol **"Database"** pada panel Laragon (ini akan membuka aplikasi pengelola database bawaan seperti **HeidiSQL**) atau Anda bisa membuka browser dan mengakses **phpMyAdmin** jika Anda menginstalnya (`http://localhost/phpmyadmin`).
4. Setelah terhubung ke MySQL local server:
   - Buat sebuah database baru.
   - Beri nama database tersebut: **`db-alumni`** (samakan nama database ini dengan konfigurasi di backend).
   - Pastikan database kosong tersebut berhasil dibuat.

---

## ⚙️ Langkah 3: Konfigurasi & Menjalankan Backend (Express.js)

1. Buka Terminal / Command Prompt baru, lalu masuk ke direktori `backend` proyek Anda:
   ```bash
   cd backend
   ```
2. Pastikan file konfigurasi lingkungan **`.env`** sudah ada di dalam folder `backend` tersebut. Isi file `.env` default yang digunakan untuk koneksi lokal adalah sebagai berikut:

   ```env
   NODE_ENV=development
   DATABASE_URL="mysql://root:@localhost:3306/db-alumni"
   PORT=5000
   SESS_SECRET=gfa87hioa7d7gsnvjs83363vssbd8f9993nhaf394583bwivas
   SESSION_EXPIRY=86400000
   SECURE_COOKIE=false

   # Konfigurasi Opsional Email (bila diperlukan fitur email)
   EMAIL_USER=example@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=example@gmail.com

   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
   CLIENT_URL=http://localhost:5173
   FRONTEND_URL=http://localhost:5173
   ```

3. Install semua package dependencies backend menggunakan perintah:
   ```bash
   npm install
   ```
4. Lakukan sinkronisasi schema database menggunakan **Prisma ORM** agar tabel-tabel dibuat secara otomatis di MySQL:
   - **Langkah A (Generate Client):**
     ```bash
     npm run db:generate
     ```
     _(Perintah ini akan menjalankan `prisma generate` untuk memperbarui Prisma Client)._
   - **Langkah B (Push Schema ke MySQL):**
     ```bash
     npm run db:push
     ```
     _(Perintah ini akan menyinkronkan model data langsung ke database `db-alumni` di Laragon. Semua tabel, relasi, dan primary/foreign keys akan dibuat otomatis oleh Prisma)._
5. Jalankan server backend dalam mode pengembangan dengan perintah:

   ```bash
   npm run dev
   ```

   - **💡 Catatan Auto-Seeding:** Ketika server backend pertama kali dijalankan dan mendeteksi database `db-alumni` masih kosong, aplikasi secara otomatis menjalankan skrip seeder (`src/seed.js`). Skrip ini akan mengisi data awal secara otomatis ke database berupa:
     - **Akun Admin Akademik:** Email `admin@polimdo.ac.id` dengan Password `admin123`.
     - **7 Jurusan & Program Studi:** D4 Teknik Informatika, D4 TRPL, D3 Teknik Listrik, dll.
     - **4 Data Alumni Contoh:** NIM `2020714001` (Ahmad Fauzan), NIM `2020714002` (Siti Rahayu), dll (password alumni disamakan dengan NIM masing-masing).
     - **1 Periode Tracer Study Aktif:** "Tracer Study Periode 2026" (Target: Semua NIM).
     - **4 Pertanyaan Kuesioner Dinamis:** Sebagai template awal untuk pengisian tracer study.

---

## 💻 Langkah 4: Konfigurasi & Menjalankan Frontend (React JS & Vite)

1. Buka **Terminal / Command Prompt baru** (jangan menutup atau mematikan terminal backend yang sedang berjalan di atas).
2. Arahkan terminal baru tersebut ke direktori `frontend`:
   ```bash
   cd frontend
   ```
3. Pastikan file konfigurasi lingkungan **`.env`** di dalam folder `frontend` sudah terkonfigurasi dengan benar untuk mengarah ke port server backend (Port 5000):
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_API_URL_STATIC=http://localhost:5000
   ```
4. Install semua package dependencies frontend dengan menjalankan perintah:
   ```bash
   npm install
   ```
5. Jalankan server frontend React menggunakan Vite dengan perintah:
   ```bash
   npm run dev
   ```
6. Buka peramban (browser) Anda dan akses alamat URL lokal yang ditampilkan di terminal (secara standar biasanya adalah **`http://localhost:5173`**).

---

## 🔐 Cara Login & Menguji Aplikasi (Multi-Role)

Setelah kedua server berjalan dengan sukses, Anda dapat masuk menggunakan salah satu dari dua akun role berikut untuk menguji fiturnya:

### A. Menguji Fitur Sebagai Admin (Akademik)
1. Akses halaman login di browser pada link `http://localhost:5173/login`.
2. Masukkan kredensial login Admin default:
   - **Email:** `admin@polimdo.ac.id`
   - **Password:** `admin123`
3. Klik **Login**. Anda akan masuk ke halaman Dashboard Utama Admin Akademik.
4. Fitur yang dapat dicoba sebagai Admin:
   - Mengelola Program Studi/Jurusan di menu **Jurusan**.
   - Menginput, mengubah, serta menghapus data alumni di menu **Alumni**.
   - Mengelola jadwal periode tracer study beserta filter NIM target (Semua, Ganjil, atau Genap) di menu **Tracer Study -> Periode**.
   - Mengelola jenis kuesioner tracer study secara dinamis di menu **Tracer Study -> Pertanyaan**.
   - Memantau jawaban kuisioner tracer study secara real-time pada menu **Tracer Study -> Monitoring**.
   - Melakukan ekspor data ke format **Excel** (.xlsx) dan **PDF** (.pdf) di menu **Laporan**.
   - Mengubah foto profil pribadi dengan crop sirkular 1:1, dan menghapusnya dengan aman di menu **Profil**.

### B. Menguji Fitur Sebagai Alumni (Lulusan)
1. Masuk ke halaman login `http://localhost:5173/login`.
2. Masukkan kredensial login Alumni default (NIM sebagai username & password):
   - **Username / NIM:** `2020714001`
   - **Password:** `2020714001`
3. Klik **Login**. Anda akan masuk ke halaman Dashboard Portal Alumni.
4. Fitur yang dapat dicoba sebagai Alumni:
   - Memantau status kelulusan akademik & status penerbitan ijazah.
   - Mengisi kuesioner dinamis Tracer Study pada menu **Isi Tracer Study** (jika NIM Anda cocok dengan aturan periode aktif).
   - Mengisi dan melengkapi riwayat pekerjaan pertama & saat ini.
   - Memantau data statistik karir global alumni Politeknik Negeri Manado secara interaktif (diagram Recharts).
   - Mengubah data sandi pribadi serta mengunggah foto profil yang dicrop dengan rasio 1:1 di menu **Profil**.
