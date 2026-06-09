# Panduan Menjalankan Project
## Sistem Informasi Pengelolaan Data Alumni (Politeknik Negeri Manado)

Panduan ini menjelaskan langkah-demi-langkah cara menyiapkan lingkungan kerja (*development environment*) dan menjalankan aplikasi **Alumni Management** (Backend & Frontend) di komputer lokal Anda menggunakan Laragon, Node.js, dan Prisma ORM.

---

## 📋 Prasyarat Sistem (Prerequisites)

Sebelum memulai, pastikan perangkat Anda telah terpasang aplikasi berikut:
1. **Node.js** (Wajib menggunakan versi **v22.13.1**). Silakan unduh di [Node.js v22.13.1 Release Page](https://nodejs.org/en/blog/release/v22.13.1).
2. **Laragon** (Digunakan sebagai server lokal untuk database MySQL). Unduh di [laragon.org](https://laragon.org/).
3. **Google Chrome** atau **Microsoft Edge** (Wajib terpasang di sistem operasi Windows karena fitur **Ekspor PDF** menggunakan engine Puppeteer yang otomatis mendeteksi browser ini untuk mencetak dokumen).
4. **Visual Studio Code** atau text editor pilihan Anda.

---

## 🛠️ Langkah 1: Persiapan Database dengan Laragon

Aplikasi ini menggunakan database **MySQL** yang dijalankan secara lokal via Laragon.

1. Buka aplikasi **Laragon** di komputer Anda.
2. Klik tombol **"Start All"** untuk menjalankan server Apache dan MySQL.
3. Klik tombol **"Database"** pada panel Laragon (ini akan membuka aplikasi pengelola database bawaan seperti **HeidiSQL**) atau Anda bisa membuka browser dan mengakses **phpMyAdmin** jika Anda menginstalnya (`http://localhost/phpmyadmin`).
4. Setelah terhubung ke MySQL local server:
   - Buat sebuah database baru.
   - Beri nama database tersebut: **`db-alumni`** (samakan nama database ini dengan konfigurasi di backend).
   - Pastikan database kosong tersebut berhasil dibuat.

---

## ⚙️ Langkah 2: Konfigurasi & Menjalankan Backend (Express.js)

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
   * **Langkah A (Generate Client):**
     ```bash
     npm run db:generate
     ```
     *(Perintah ini akan menjalankan `prisma generate` untuk memperbarui Prisma Client).*
   * **Langkah B (Push Schema ke MySQL):**
     ```bash
     npm run db:push
     ```
     *(Perintah ini akan menyinkronkan model data langsung ke database `db-alumni` di Laragon. Anda tidak perlu mengimpor file `.sql` secara manual, semua tabel akan dibuat otomatis oleh Prisma).*
5. Jalankan server backend dalam mode pengembangan dengan perintah:
   ```bash
   npm run dev
   ```
   * **💡 Catatan Auto-Seeding:** Ketika server backend pertama kali dijalankan dan mendeteksi database `db-alumni` masih kosong, aplikasi secara otomatis menjalankan skrip seeder (`src/seed.js`). Skrip ini akan mengisi data awal secara otomatis ke database berupa:
     * **Akun Admin Akademik:** Email `admin@polimdo.ac.id` dengan Password `admin123`.
     * **7 Program Studi:** D4 Teknik Informatika, D4 Teknik Elektro, D4 Teknik Mesin, dll.
     * **4 Data Alumni Contoh:** Untuk mempermudah pengujian di dashboard.

---

## 💻 Langkah 3: Konfigurasi & Menjalankan Frontend (React JS & Vite)

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

## 🔐 Cara Login & Menguji Aplikasi

Setelah kedua server berjalan dengan sukses:
1. Akses halaman login di browser pada link `http://localhost:5173/login` (atau otomatis diarahkan ke sana).
2. Masukkan kredensial login default yang telah dibuat oleh sistem secara otomatis:
   * **Email:** `admin@polimdo.ac.id`
   * **Password:** `admin123`
3. Klik **Login**. Anda akan masuk ke halaman Dashboard Utama Admin Akademik Politeknik Negeri Manado.
4. Anda sekarang dapat mencoba seluruh fitur seperti:
   * Menambahkan/mengedit data Program Studi di menu **Program Studi**.
   * Menambahkan/mengubah data Alumni di menu **Alumni**.
   * Mengisi tanggal kelulusan, nomor ijazah, dan tanggal pengambilan ijazah untuk memantau perubahan status alur alumni di halaman dashboard.
   * Melakukan ekspor data ke format **Excel** (.xlsx) dan cetak **PDF** (.pdf) di menu **Laporan**.
