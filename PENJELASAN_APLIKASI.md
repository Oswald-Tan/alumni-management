# Dokumentasi & Penjelasan Aplikasi
## Sistem Informasi Pengelolaan Data Alumni (Politeknik Negeri Manado)

Dokumen ini disusun khusus sebagai panduan bagi mahasiswa/klien agar dapat menjelaskan konsep, alur kerja, arsitektur, serta teknologi aplikasi ini dengan mudah dan meyakinkan kepada **Dosen Pembimbing** maupun **Dosen Penguji** saat sidang Tugas Akhir/Skripsi.

---

## 1. 🌟 Tentang Aplikasi (Overview)

Aplikasi ini adalah **Sistem Informasi Pengelolaan Data Alumni** yang dirancang khusus untuk mendukung kegiatan administrasi akademik di **Politeknik Negeri Manado**.

* **Masalah yang Diselesaikan:** Pencatatan data alumni, status kelulusan, penomoran ijazah, dan pencatatan serah-terima ijazah sering kali masih dilakukan secara terpisah (menggunakan banyak berkas Excel manual). Hal ini rawan terhadap redudansi data, kehilangan arsip, serta menyulitkan proses pembuatan laporan yang cepat untuk keperluan akreditasi.
* **Solusi yang Ditawarkan:** Sistem berbasis web yang mengintegrasikan seluruh proses administrasi alumni secara terpusat, mulai dari pendataan program studi, pencatatan biodata alumni, tracking status kelulusan & ijazah, hingga ekspor laporan rekapitulasi data alumni dalam format **Microsoft Excel** dan **PDF** sekali klik.
* **Pengguna Utama (Role):** **Admin Akademik** yang bertugas mengelola data program studi, menginput/memperbarui data alumni, memantau riwayat status ijazah, serta mengunduh laporan rekapitulasi berkala.

---

## 2. 🏗️ Arsitektur Sistem (System Architecture)

Aplikasi ini menggunakan arsitektur modern berbasis **Client-Server** yang memisahkan bagian tampilan (*Frontend*) dengan logika bisnis (*Backend*) secara terpisah. Keduanya berkomunikasi menggunakan protokol HTTP melalui **RESTful API**.

```
   ┌────────────────────────────────────────┐
   │          FRONTEND (Client-Side)        │
   │  React JS + Tailwind CSS (Port 5173)   │
   └───────────────────┬────────────────────┘
                       │
             Request   │   Response
             API (JSON)│  (Data JSON)
                       ▼
   ┌────────────────────────────────────────┐
   │          BACKEND (Server-Side)         │
   │       Express.js (Port 5000)           │
   └───────────────────┬────────────────────┘
                       │
              Queries  │   Data
             via ORM   │  Records
                       ▼
   ┌────────────────────────────────────────┐
   │             DATABASE LAYER             │
   │       Prisma ORM <=> MySQL (Laragon)   │
   └────────────────────────────────────────┘
```

* **Frontend (React JS):** Bertindak sebagai *Single Page Application (SPA)*. Seluruh pemrosesan halaman dilakukan di browser pengguna. Navigasi terasa sangat cepat dan lancar karena tidak memerlukan *reload* halaman secara penuh ketika berpindah menu.
* **Backend (Express.js):** Bertindak sebagai penyedia layanan data (RESTful API). Mengontrol logika bisnis, keamanan sesi pengguna, validasi input, enkripsi data, dan pembuatan dokumen ekspor (Excel/PDF).
* **Database (MySQL & Prisma ORM):** Digunakan sebagai tempat penyimpanan data relasional terpusat yang aman. Prisma menjembatani kode JavaScript backend ke query database secara modern dan terstruktur.

---

## 3. 🚀 Penjelasan Teknologi Utama (Core Tech Stack)

Berikut adalah penjelasan ringkas mengenai teknologi utama yang digunakan:

### A. React JS (Frontend)
React JS adalah pustaka (*library*) JavaScript populer buatan Meta (Facebook) yang digunakan untuk membangun antarmuka pengguna (UI) secara dinamis.
* **Kenapa menggunakan React?** React menggunakan sistem komponen (*component-based*), di mana bagian-bagian UI (seperti sidebar, tombol, tabel, form) dipecah menjadi bagian-bagian kecil yang dapat digunakan kembali (*reusable*). React juga menerapkan konsep *Virtual DOM*, yang memperbarui tampilan secara instan hanya pada bagian data yang berubah tanpa merender ulang seluruh halaman, sehingga aplikasi terasa sangat responsif dan hemat sumber daya.

### B. Tailwind CSS v4 (Styling)
Tailwind CSS adalah *framework CSS utility-first* yang digunakan untuk mendesain antarmuka aplikasi.
* **Kenapa menggunakan Tailwind CSS?** Berbeda dengan CSS tradisional yang mengharuskan kita menulis baris kode CSS terpisah, Tailwind menyediakan ribuan kelas kecil siap pakai langsung di dalam tag HTML/JSX (seperti `flex`, `bg-blue-600`, `shadow-md`, `p-4`). Hal ini mempercepat proses pengembangan, memastikan konsistensi desain, serta menghasilkan tampilan web yang modern, responsif (menyesuaikan ukuran layar HP/Tablet/Laptop), dan estetik.

### C. Express JS (Backend)
Express JS adalah *framework web* minimalis dan fleksibel untuk runtime environment Node.js.
* **Kenapa menggunakan Express?** Node.js memungkinkan kita menjalankan JavaScript di sisi server (bukan hanya di browser). Express menyederhanakan pembuatan server tersebut dengan menyediakan fitur pengaturan rute URL (*routing*), pengelolaan session, penanganan request-response, dan integrasi middleware keamanan secara mudah dan efisien.

### D. MySQL (Database)
MySQL adalah *Relational Database Management System (RDBMS)* berbasis SQL yang sangat populer dan berkinerja tinggi.
* **Kenapa menggunakan MySQL?** Data alumni sangat bersifat terstruktur dan memiliki hubungan erat satu sama lain (misalnya: data alumni berelasi dengan data program studi). MySQL sangat cocok untuk menyimpan data dengan integritas relasi yang kuat, aman, serta memiliki performa baca-tulis data yang cepat.

---

## 4. 📦 Penjelasan Package Penting yang Diinstal

Untuk mempercepat pengembangan dan menjaga standar keamanan aplikasi, beberapa pustaka (*package*) pihak ketiga telah diintegrasikan:

### 📥 Sisi Backend (`backend/package.json`)

| Nama Package | Fungsi Utama dalam Aplikasi | Penjelasan untuk Dosen |
| :--- | :--- | :--- |
| **`prisma`** & **`@prisma/client`** | ORM (Object-Relational Mapping) | Mengizinkan backend berinteraksi dengan database MySQL menggunakan objek JavaScript langsung. Kita tidak perlu menulis query SQL manual (`SELECT * FROM...`), melainkan cukup memanggil fungsi seperti `prisma.alumni.findMany()`. Ini meminimalkan bug pengetikan query. |
| **`bcryptjs`** | Pengaman & Hashing Password | Mengamankan password pengguna. Sebelum password disimpan ke database, bcrypt akan mengubah password mentah (contoh: "admin123") menjadi string acak terenkripsi yang tidak dapat dibaca kembali secara langsung. Ini memenuhi standar keamanan data user. |
| **`express-session`** & **`express-mysql-session`** | Manajemen Sesi Login | Mengelola status login pengguna. Server mencatat sesi login pengguna dan menyimpannya ke dalam tabel `sessions` di MySQL. Hal ini mencegah pengguna yang belum login mengakses data sensitif tanpa otorisasi. |
| **`exceljs`** | Pembuat File Microsoft Excel | Digunakan untuk mengekstrak data rekapitulasi dari database dan menyusunnya menjadi file spreadsheet (.xlsx) yang rapi, lengkap dengan gaya header, border, warna, serta auto-fit lebar kolom. |
| **`puppeteer-core`** | Browser Headless (PDF Generator) | Mengontrol browser web (Google Chrome/Edge) di latar belakang secara otomatis untuk merender tampilan HTML laporan akademik (EJS), lalu mengekspornya menjadi dokumen PDF berukuran A4 berorientasi lanskap secara presisi. |
| **`ejs`** | Template Engine HTML | Digunakan untuk membuat struktur tata letak (layout) dan desain visual laporan akademis. EJS menggabungkan file HTML dengan data dinamis dari database sebelum dicetak menjadi PDF oleh Puppeteer. |
| **`cors`** | Cross-Origin Resource Sharing | Mengizinkan frontend (berjalan di port 5173) melakukan pengiriman request data ke backend (berjalan di port 5000). Secara bawaan browser melarang interaksi ini jika CORS tidak dikonfigurasi. |
| **`helmet`** | Keamanan HTTP Headers | Mengamankan aplikasi Express secara instan dari serangan eksploitasi web umum dengan cara mengatur header HTTP yang dikirimkan oleh server. |
| **`express-rate-limit`** | Pencegah Brute-force | Membatasi jumlah request dari satu alamat IP dalam jangka waktu tertentu untuk menghindari serangan brute-force atau spamming request yang dapat memberatkan server. |
| **`multer`** | Penangan Upload Berkas | Digunakan untuk memproses file statis yang diunggah ke server (seperti foto alumni atau lampiran dokumen wisuda). |

### 📤 Sisi Frontend (`frontend/package.json`)

| Nama Package | Fungsi Utama dalam Aplikasi | Penjelasan untuk Dosen |
| :--- | :--- | :--- |
| **`react-router-dom`** | Sistem Navigasi Halaman | Mengelola perpindahan halaman di frontend secara dinamis tanpa memicu reload halaman web. Ini memberikan pengalaman penggunaan aplikasi yang mulus dan cepat seperti aplikasi desktop/mobile. |
| **`@reduxjs/toolkit`** & **`react-redux`** | State Management Global | Digunakan untuk menyimpan dan mendistribusikan data global ke seluruh komponen React, seperti menyimpan informasi user yang sedang login agar nama admin/alumni bisa diakses secara instan di navbar, sidebar, atau halaman profil. |
| **`axios`** | HTTP Client | Pustaka yang digunakan frontend untuk mengirimkan permintaan (*request*) API seperti GET, POST, PUT, DELETE ke server backend dan menerima respon data JSON. |
| **`lucide-react`** | Kumpulan Icon Vektor | Menyediakan ikon visual (seperti ikon dashboard, users, folder, logout) berbasis SVG yang ringan, modern, tajam, dan mudah diubah warnanya menggunakan Tailwind CSS. |
| **`react-toastify`** | Notifikasi Pop-up UI | Digunakan untuk menampilkan pesan notifikasi yang estetik berupa pop-up kecil di pojok layar (contoh: "Login Berhasil!", "Data Alumni Berhasil Diupdate", "Koneksi Terputus"). |

---

## 5. 🔄 Alur & Flow Kerja Aplikasi

### A. Alur Status Alumni (State Machine Progress)
Salah satu fitur unggulan sistem ini adalah pelacakan status alumni secara bertahap dan dinamis berdasarkan kelengkapan administrasi mereka. Status alumni tersinkronisasi secara otomatis melalui aturan berikut:

1. **`TERDAFTAR_WISUDA` (Status Awal):** Alumni baru ditambahkan ke sistem tetapi belum memiliki data kelulusan terperinci.
2. **`LULUS`:** Berubah otomatis setelah Admin menginput tanggal kelulusan alumni di sistem.
3. **`IJAZAH_TERBIT`:** Berubah otomatis jika Admin telah menginput nomor ijazah alumni.
4. **`IJAZAH_DIAMBIL`:** Berubah otomatis jika Admin telah mengisi tanggal pengambilan ijazah (menandakan fisik ijazah sudah diserahkan ke alumni).

*Di halaman dashboard utama, status ini akan dihitung secara persentase dan divisualisasikan dalam grafik atau indikator statistik untuk memudahkan pihak akademik melihat jumlah alumni yang sudah/belum mengambil ijazah.*

### B. Alur Ekspor Laporan
1. Admin masuk ke menu **Laporan**.
2. Admin memilih filter: **Program Studi**, **Tahun Kelulusan**, atau **Status Ijazah** (Sudah Diambil / Belum Diambil).
3. Admin mengklik tombol **Cetak PDF** atau **Ekspor Excel**.
4. Frontend mengirimkan request ke backend bersama parameter filter.
5. Backend melakukan query ke database menggunakan filter tersebut, menyusun data, merendernya (menggunakan EJS untuk PDF atau menyusun sheet untuk Excel), lalu mengembalikannya sebagai file unduhan langsung (*direct download*) ke browser pengguna.

---

## 6. 🗄️ Rancangan Database (Skema Relasi)

Struktur database dirancang seminimalis dan seefisien mungkin untuk menghindari redundansi data:

```
  ┌───────────────────────┐             ┌────────────────────────┐
  │       program_studi   │             │         alumni         │
  ├───────────────────────┤             ├────────────────────────┤
  │ PK │ id (Int)         │◄──┐         │ PK │ id (Int)          │
  │    │ nama_prodi       │   │         │    │ nama (String)     │
  │    │ created_at       │   │         │ UK │ nim (String)      │
  │    │ updated_at       │   └─────────┼─FK │ program_studi_id  │
  └───────────────────────┘    (1 to N) │    │ tanggal_wisuda    │
                                        │    │ tanggal_kelulusan │
  ┌───────────────────────┐             │    │ nomor_ijazah      │
  │         users         │             │    │ tgl_pengambilan   │
  ├───────────────────────┤             │    │ created_at        │
  │ PK │ id (Int)         │             │    │ updated_at        │
  │ UK │ email (String)   │             └────────────────────────┘
  │    │ name (String)    │
  │    │ password (String)│             ┌────────────────────────┐
  │    │ created_at       │             │        sessions        │
  │    │ updated_at       │             ├────────────────────────┤
  └───────────────────────┘             │ PK │ session_id        │
                                        │    │ expires           │
                                        │    │ data (MediumText) │
                                        └────────────────────────┘
```

### Penjelasan Tabel:
1. **`users`:** Menyimpan informasi kredensial akun pengguna (Admin Akademik) untuk keperluan masuk ke dalam dashboard admin secara aman.
2. **`program_studi`:** Menyimpan daftar program studi yang tersedia di Politeknik Negeri Manado.
3. **`alumni`:** Menyimpan biodata lengkap alumni, tanggal penting kelulusan akademik, nomor ijazah, dan tanggal serah terima pengambilan ijazah.
4. **`sessions`:** Menyimpan cookie token sesi pengguna secara persisten di database MySQL, memastikan sesi login pengguna tetap aman.

### Penjelasan Relasi:
* **`program_studi` ke `alumni` (One-to-Many):** Satu Program Studi dapat memiliki banyak Alumni terdaftar (Relasi 1 ke Banyak). Di sisi lain, setiap satu orang Alumni hanya dapat terdaftar pada satu Program Studi saja. Relasi ini dijembatani oleh kolom `program_studi_id` di tabel alumni yang merujuk pada `id` di tabel program studi.
