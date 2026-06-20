# Dokumentasi & Penjelasan Aplikasi

## Sistem Informasi Pengelolaan Data Alumni & Tracer Study (Politeknik Negeri Manado)

Dokumen ini disusun khusus sebagai panduan bagi mahasiswa/klien agar dapat menjelaskan konsep, alur kerja, arsitektur, serta teknologi aplikasi ini dengan mudah dan meyakinkan kepada **Dosen Pembimbing** maupun **Dosen Penguji** saat sidang Tugas Akhir/Skripsi.

---

## 1. 🌟 Tentang Aplikasi (Overview)

Aplikasi ini adalah **Sistem Informasi Pengelolaan Data Alumni dan Tracer Study** yang dirancang khusus untuk mendukung kegiatan administrasi akademik dan pelacakan karir lulusan di **Politeknik Negeri Manado**.

- **Masalah yang Diselesaikan:**
  1. Pencatatan data alumni, status kelulusan, penomoran ijazah, dan pencatatan serah-terima ijazah sering kali masih dilakukan secara terpisah (menggunakan banyak berkas Excel manual), yang rawan terhadap redudansi data.
  2. Proses pelacakan karir lulusan (_Tracer Study_) sangat lambat dan tidak efisien jika dilakukan secara manual melalui form kertas atau Google Form terpisah yang hasilnya sulit diintegrasikan ke sistem utama.
  3. Ketiadaan visualisasi statistik karir global (seperti persentase kesesuaian bidang kerja, waktu tunggu rata-rata, dan status pekerjaan) yang dibutuhkan untuk keperluan pelaporan akreditasi kampus.
- **Solusi yang Ditawarkan:** Sistem berbasis web terintegrasi yang menyediakan:
  - Manajemen data Jurusan & Program Studi.
  - Pengelolaan data Alumni dan pelacakan status kelulusan & ijazah secara dinamis.
  - **Portal Tracer Study Mandiri** bagi alumni untuk mengisi riwayat pekerjaan dan kuesioner dinamis secara aman.
  - **Visualisasi Dashboard Interaktif** yang responsif pada berbagai perangkat untuk memantau data statistik alumni.
  - Ekspor laporan rekapitulasi data alumni dan tracer study dalam format **Microsoft Excel** dan **PDF** sekali klik.
- **Pengguna Utama (Multi-Role):**
  1. **Admin Akademik:** Bertugas mengelola data jurusan, menginput data alumni, mengatur periode kuisioner Tracer Study, mengelola pertanyaan dinamis, memantau hasil kuisioner, serta mengunduh laporan rekapitulasi berkala.
  2. **Alumni:** Bertugas melengkapi data pribadi, mengunggah foto profil secara rapi, mengisi riwayat pekerjaan/karir, serta mengisi kuisioner Tracer Study pada periode pengisian yang aktif.

---

## 2. 🏗️ Arsitektur Sistem (System Architecture)

Aplikasi ini menggunakan arsitektur modern berbasis **Client-Server** (Decoupled Architecture) yang memisahkan bagian tampilan (_Frontend_) dengan logika bisnis (_Backend_). Keduanya berkomunikasi secara asinkron menggunakan protokol HTTP melalui **RESTful API** dengan data berformat **JSON**.

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
    │  Express.js + Prisma ORM (Port 5000)   │
    └───────────────────┬────────────────────┘
                        │
               Queries  │   Data
              via ORM   │  Records
                        ▼
    ┌────────────────────────────────────────┐
    │             DATABASE LAYER             │
    │              MySQL Server              │
    └────────────────────────────────────────┘
```

- **Frontend (React JS):** Bertindak sebagai _Single Page Application (SPA)_. Seluruh pemrosesan halaman dilakukan di browser pengguna secara instan tanpa memicu reload halaman web secara penuh ketika berpindah menu.
- **Backend (Express.js):** Bertindak sebagai penyedia layanan data (RESTful API). Mengontrol logika bisnis, keamanan sesi pengguna, validasi input, enkripsi data, manajemen unggahan file, pembatasan request (_rate limiting_), dan pembuatan dokumen ekspor (Excel/PDF).
- **Database (MySQL & Prisma ORM):** Digunakan sebagai tempat penyimpanan data relasional terpusat. Prisma ORM menjembatani kode JavaScript backend ke database MySQL secara modern dan terstruktur tanpa menulis query SQL manual secara mentah.

---

## 3. 🚀 Penjelasan Teknologi Utama (Core Tech Stack)

Berikut adalah penjelasan ringkas mengenai teknologi utama yang digunakan:

### A. React JS (Frontend)

React JS adalah pustaka (_library_) JavaScript populer buatan Meta (Facebook) yang digunakan untuk membangun antarmuka pengguna (UI) secara dinamis.

- **Kenapa menggunakan React?** React menggunakan sistem komponen (_component-based_), di mana bagian-bagian UI (seperti sidebar, tombol, tabel, form, modal) dipecah menjadi bagian-bagian kecil yang dapat digunakan kembali (_reusable_). React juga menerapkan konsep _Virtual DOM_, yang memperbarui tampilan secara instan hanya pada bagian data yang berubah tanpa merender ulang seluruh halaman, sehingga aplikasi terasa sangat responsif dan hemat sumber daya.

### B. Tailwind CSS (Styling)

Tailwind CSS adalah _framework CSS utility-first_ yang digunakan untuk mendesain antarmuka aplikasi.

- **Kenapa menggunakan Tailwind CSS?** Berbeda dengan CSS tradisional yang mengharuskan kita menulis baris kode CSS terpisah, Tailwind menyediakan ribuan kelas kecil siap pakai langsung di dalam tag HTML/JSX (seperti `flex`, `bg-teal-650`, `shadow-md`, `p-4`). Hal ini mempercepat proses pengembangan, memastikan konsistensi desain, serta menghasilkan tampilan web yang modern, responsif (menyesuaikan ukuran layar HP/Tablet/Laptop), dan estetik.

### C. Recharts (Frontend Charts)

Recharts adalah pustaka grafik deklaratif yang dibangun dengan komponen React untuk memudahkan visualisasi data.

- **Kenapa menggunakan Recharts?** Digunakan untuk merender grafik data statistik yang interaktif di dashboard admin dan dashboard alumni (seperti grafik kesesuaian bidang pekerjaan, grafik status pekerjaan, rata-rata waktu tunggu kerja, dan sebaran program studi). Grafik ini sepenuhnya responsif dan secara otomatis menyesuaikan ukuran layout layar.

### D. Express JS (Backend)

Express JS adalah _framework web_ minimalis dan fleksibel untuk runtime environment Node.js.

- **Kenapa menggunakan Express?** Node.js memungkinkan kita menjalankan JavaScript di sisi server (bukan hanya di browser). Express menyederhanakan pembuatan server tersebut dengan menyediakan fitur pengaturan rute URL (_routing_), pengelolaan sesi login (_sessions_), penanganan request-response, dan integrasi middleware keamanan secara mudah dan efisien.

### E. MySQL (Database)

MySQL adalah _Relational Database Management System (RDBMS)_ berbasis SQL yang sangat populer dan berkinerja tinggi.

- **Kenapa menggunakan MySQL?** Data alumni sangat bersifat terstruktur dan memiliki hubungan erat satu sama lain (misalnya: data alumni berelasi dengan data program studi, pengisian kuesioner berelasi dengan periode kuesioner dan data alumni). MySQL sangat cocok untuk menyimpan data dengan integritas relasi yang kuat, aman, serta memiliki performa baca-tulis data yang cepat.

---

## 4. 📦 Penjelasan Package Penting yang Diinstal

Untuk mempercepat pengembangan dan menjaga standar keamanan aplikasi, beberapa pustaka (_package_) pihak ketiga telah diintegrasikan:

### 📥 Sisi Backend (`backend/package.json`)

| Nama Package                                        | Fungsi Utama dalam Aplikasi      | Penjelasan untuk Dosen                                                                                                                                                                                                                                                    |
| :-------------------------------------------------- | :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`prisma`** & **`@prisma/client`**                 | ORM (Object-Relational Mapping)  | Mengizinkan backend berinteraksi dengan database MySQL menggunakan objek JavaScript langsung. Kita tidak perlu menulis query SQL manual (`SELECT * FROM...`), melainkan cukup memanggil fungsi seperti `prisma.alumni.findMany()`. Ini meminimalkan bug pengetikan query. |
| **`bcryptjs`**                                      | Pengaman & Hashing Password      | Mengamankan password pengguna. Sebelum password disimpan ke database, bcrypt akan mengubah password mentah (contoh: "admin123") menjadi string acak terenkripsi yang tidak dapat dibaca kembali secara langsung. Ini memenuhi standar keamanan data user.                 |
| **`express-session`** & **`express-mysql-session`** | Manajemen Sesi Login             | Mengelola status login pengguna. Server mencatat sesi login pengguna dan menyimpannya ke dalam tabel `sessions` di MySQL. Hal ini mencegah pengguna yang belum login mengakses data sensitif tanpa otorisasi.                                                             |
| **`exceljs`**                                       | Pembuat File Microsoft Excel     | Digunakan untuk mengekstrak data rekapitulasi dari database dan menyusunnya menjadi file spreadsheet (.xlsx) yang rapi, lengkap dengan gaya header, border, warna, serta auto-fit lebar kolom.                                                                            |
| **`puppeteer-core`**                                | Browser Headless (PDF Generator) | Mengontrol browser web (Google Chrome/Edge) di latar belakang secara otomatis untuk merender tampilan HTML laporan akademik (EJS), lalu mengekspornya menjadi dokumen PDF berukuran A4 berorientasi lanskap secara presisi.                                               |
| **`ejs`**                                           | Template Engine HTML             | Digunakan untuk membuat struktur tata letak (layout) dan desain visual laporan akademis. EJS menggabungkan file HTML dengan data dinamis dari database sebelum dicetak menjadi PDF oleh Puppeteer.                                                                        |
| **`cors`**                                          | Cross-Origin Resource Sharing    | Mengizinkan frontend (berjalan di port 5173) melakukan pengiriman request data ke backend (berjalan di port 5000). Secara bawaan browser melarang interaksi ini jika CORS tidak dikonfigurasi.                                                                            |
| **`helmet`**                                        | Keamanan HTTP Headers            | Mengamankan aplikasi Express secara instan dari serangan eksploitasi web umum dengan cara mengatur header HTTP yang dikirimkan oleh server.                                                                                                                               |
| **`express-rate-limit`**                            | Pencegah Brute-force             | Membatasi jumlah request dari satu alamat IP dalam jangka waktu tertentu untuk menghindari serangan brute-force atau spamming request yang dapat memberatkan server.                                                                                                      |
| **`multer`**                                        | Penangan Upload Berkas           | Digunakan untuk memproses file statis yang diunggah ke server (seperti foto alumni atau lampiran dokumen wisuda).                                                                                                                                                         |

### 📤 Sisi Frontend (`frontend/package.json`)

| Nama Package                               | Fungsi Utama dalam Aplikasi        | Penjelasan untuk Dosen                                                                                                                                                                                                              |
| :----------------------------------------- | :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`react-router-dom`**                     | Sistem Navigasi Halaman            | Mengelola perpindahan halaman di frontend secara dinamis tanpa memicu reload halaman web. Ini memberikan pengalaman penggunaan aplikasi yang mulus dan cepat seperti aplikasi desktop/mobile.                                       |
| **`@reduxjs/toolkit`** & **`react-redux`** | State Management Global            | Digunakan untuk menyimpan dan mendistribusikan data global ke seluruh komponen React, seperti menyimpan informasi user yang sedang login agar nama admin/alumni bisa diakses secara instan di navbar, sidebar, atau halaman profil. |
| **`axios`**                                | HTTP Client                        | Pustaka yang digunakan frontend untuk mengirimkan permintaan (_request_) API seperti GET, POST, PUT, DELETE ke server backend dan menerima respon data JSON.                                                                        |
| **`lucide-react`**                         | Kumpulan Icon Vektor               | Menyediakan ikon visual (seperti ikon dashboard, users, folder, logout) berbasis SVG yang ringan, modern, tajam, dan mudah diubah warnanya menggunakan Tailwind CSS.                                                                |
| **`react-toastify`**                       | Notifikasi Pop-up UI               | Digunakan untuk menampilkan pesan notifikasi yang estetik berupa pop-up kecil di pojok layar (contoh: "Login Berhasil!", "Data Alumni Berhasil Diupdate", "Koneksi Terputus").                                                      |
| **`recharts`**                             | Grafik Interaktif                  | Pustaka visualisasi grafik berbasis React untuk menampilkan metrik karir alumni secara menarik (Pie chart, Bar chart, Line chart).                                                                                                  |
| **`react-image-crop`**                     | Pemotong Gambar (1:1 Aspect Ratio) | Mengizinkan pengguna frontend melakukan pemotongan (_crop_) foto profil berbentuk lingkaran dengan rasio aspek tepat 1:1 sebelum dikirim ke server.                                                                                 |

---

## 5. 🔄 Alur & Flow Kerja Aplikasi

### A. Alur Status Alumni (State Machine Progress)

Salah satu fitur unggulan sistem ini adalah pelacakan status alumni secara bertahap dan dinamis berdasarkan kelengkapan administrasi mereka. Status alumni tersinkronisasi secara otomatis melalui aturan berikut:

1. **`TERDAFTAR_WISUDA` (Status Awal):** Alumni baru ditambahkan ke sistem tetapi belum memiliki data kelulusan terperinci.
2. **`LULUS`:** Berubah otomatis setelah Admin menginput tanggal kelulusan alumni di sistem.
3. **`IJAZAH_TERBIT`:** Berubah otomatis jika Admin telah menginput nomor ijazah alumni.
4. **`IJAZAH_DIAMBIL`:** Berubah otomatis jika Admin telah mengisi tanggal pengambilan ijazah (menandakan fisik ijazah sudah diserahkan ke alumni).

Di halaman dashboard utama, status ini akan dihitung secara persentase dan divisualisasikan dalam grafik atau indikator statistik untuk memudahkan pihak akademik melihat jumlah alumni yang sudah/belum mengambil ijazah.

### B. Alur Pengisian Tracer Study & Pembatasan Target NIM

Proses pengisian data tracer study dirancang agar dinamis dan tepat sasaran:

1. **Pendaftaran Periode Tracer:** Admin membuat periode pengisian Tracer Study baru di sistem, menentukan tanggal mulai, tanggal selesai, serta aturan filter target NIM (Semua Alumni, khusus NIM Ganjil, atau khusus NIM Genap).
2. **Kesesuaian Target:** Saat Alumni masuk (_login_) menggunakan NIM mereka, sistem di backend secara otomatis memverifikasi kecocokan digit terakhir NIM (apakah ganjil atau genap) dengan periode pengisian yang saat ini sedang aktif.
3. **Pengisian Kuesioner Dinamis:** Jika cocok dan berada dalam rentang tanggal pengisian, Alumni dapat mengisi kuesioner dinamis yang jenis pertanyaannya dibuat oleh admin (Tipe teks pendek, paragraf, pilihan dropdown, atau pilihan satu/radio button), serta melengkapi riwayat pekerjaan mereka.
4. **Visualisasi Instan:** Setelah kuesioner berhasil disubmit, data pekerjaan alumni akan langsung masuk ke database dan dihitung secara global, memperbarui diagram lingkaran (_pie chart_) secara real-time pada dashboard admin dan alumni.

### C. Alur Upload & Hapus Foto Profil (Crop 1:1, Max 3MB)

1. **Pemilihan File:** Pengguna memilih gambar untuk foto profil. Sistem membatasi tipe gambar standar (JPG, JPEG, PNG, WEBP) dengan ukuran maksimal **3MB**.
2. **Pemotongan Gambar:** Foto yang terpilih ditampilkan pada modal dengan batas seleksi melingkar berskala 1:1 melalui pustaka `react-image-crop`.
3. **Pengunggahan:** Setelah dicrop, potongan gambar dikirimkan ke backend melalui middleware `multer` untuk disimpan di direktori server `uploads/foto`.
4. **Pembersihan Berkas Otomatis:** Ketika pengguna memperbarui foto profil mereka atau menghapus foto profil secara permanen, server secara otomatis akan **menghapus file foto fisik lama** dari folder `uploads/foto` di server menggunakan `fs.unlinkSync` untuk menghindari penumpukan memori.

### D. Penggantian Alert dengan ConfirmModal Tailwind CSS

Seluruh alur tindakan kritis yang membutuhkan konfirmasi (seperti menghapus alumni, menghapus jurusan/prodi, menghapus periode kuesioner, menghapus pertanyaan kuesioner, atau menghapus foto profil) tidak lagi menggunakan alert bawaan browser (`window.confirm()`).
Sebagai gantinya, aplikasi menggunakan komponen kustom `ConfirmModal` yang dirancang dengan Tailwind CSS yang elegan, memberikan UI yang konsisten dengan tema warna aplikasi, efek transisi halus, dan responsivitas penuh.

---

## 6. 🗄️ Rancangan Database (Skema Relasi)

Struktur database dirancang menggunakan 9 tabel yang saling berhubungan untuk mendukung penyimpanan data pengelolaan alumni dan pengisian kuesioner tracer study secara rapi:

```
  ┌───────────────────────┐             ┌────────────────────────┐
  │       jurusan         │             │         alumni         │
  ├───────────────────────┤             ├────────────────────────┤
  │ PK │ id (Int)         │◄──┐         │ PK │ id (Int)          │
  │    │ nama_jurusan     │   │         │    │ nama (String)     │
  │    │ nama_prodi       │   │         │ UK │ nim (String)      │
  │    │ jenjang          │   └─────────┼─FK │ jurusan_id        │
  │    │ akreditasi       │    (1 to N) │    │ password (String) │
  │    │ created_at       │             │    │ foto (String)     │
  │    │ updated_at       │             │    │ tanggal_wisuda    │
  │    └──────────────────┘             │    │ tanggal_kelulusan │
                                        │    │ nomor_ijazah      │
  ┌───────────────────────┐             │    │ tgl_pengambilan   │
  │         users         │             │    │ created_at        │
  ├───────────────────────┤             │    │ updated_at        │
  │ PK │ id (Int)         │             └───────────┬───────┬────┘
  │ UK │ email (String)   │                         │       │
  │    │ name (String)    │                         │       │ (1 to N)
  │    │ password (String)│                (1 to N) │       ▼
  │    │ foto (String)    │                         │  ┌───────────────────────┐
  │    │ created_at       │                         │  │   pekerjaan_alumni    │
  │    │ updated_at       │                         │  ├───────────────────────┤
  │    └──────────────────┘                         │  │ PK │ id (Int)         │
                                                    │  │ FK │ alumni_id        │
  ┌───────────────────────┐                         │  │    │ nama_perusahaan   │
  │        sessions       │                         │  │    │ jabatan           │
  ├───────────────────────┤                         │  │    │ bidang_pekerjaan  │
  │ PK │ session_id       │                         │  │    │ status_pekerjaan  │
  │    │ expires          │                         │  │    │ tahun_mulai       │
  │    │ data             │                         │  │    │ gaji_pertama      │
  │    └──────────────────┘                         │  │    │ kesesuaian_bidang │
                                                    │  │    │ waktu_tunggu      │
  ┌───────────────────────┐                         │  │    │ created_at        │
  │    tracer_periods     │                         │  │    │ updated_at        │
  ├───────────────────────┤                         │  └───────────────────────┘
  │ PK │ id (Int)         │◄──┐                     │
  │    │ nama_periode     │   │                     ▼
  │    │ tanggal_mulai    │   │            ┌────────────────────────┐
  │    │ tanggal_selesai  │   │            │    tracer_responses    │
  │    │ status           │   │            ├────────────────────────┤
  │    │ mode_pengisian   │   └────────────┼─FK │ tracer_period_id  │
  │    │ created_at       │      (1 to N)  │ PK │ id (Int)          │
  │    │ updated_at       │                │ FK │ alumni_id         │
  │    └──────────────────┘                │    │ submitted_at      │
                                           └────┬───────────────────┘
  ┌───────────────────────┐                     │
  │   tracer_questions    │                     │ (1 to N)
  ├───────────────────────┤                     ▼
  │ PK │ id (Int)         │◄──┐            ┌────────────────────────┐
  │    │ pertanyaan (Text)│   │            │     tracer_answers     │
  │    │ tipe (String)    │   │            ├────────────────────────┤
  │    │ opsi (Text)      │   └────────────┼─FK │ response_id       │
  │    │ is_required      │      (1 to N)  │ PK │ id (Int)          │
  │    │ urutan           │                │ FK │ question_id       │
  │    │ is_active        │                │    │ jawaban (Text)    │
  │    │ created_at       │                └────────────────────────┘
  │    │ updated_at       │
  │    └──────────────────┘
```

### 🔑 Penjelasan Istilah Database:

Untuk mempermudah penjelasan ke dosen, berikut adalah arti dari singkatan pada kolom tabel di atas:

- **PK (Primary Key - Kunci Utama):** Kolom pengenal unik untuk setiap baris data di tabel. Nilainya tidak boleh sama (duplikat) dan tidak boleh kosong (_NULL_). Contoh: kolom `id` pada tabel `users`, `alumni`, dan `jurusan`.
- **UK (Unique Key - Kunci Unik):** Kolom yang nilainya wajib unik di seluruh tabel tetapi bukan pengenal utama. Contoh: `email` pada tabel `users` dan `nim` pada tabel `alumni` (agar tidak ada admin dengan email ganda atau alumni dengan NIM ganda).
- **FK (Foreign Key - Kunci Tamu/Penghubung):** Kolom penghubung antar tabel yang menyimpan nilai dari kolom Primary Key (PK) tabel lain. Contoh: kolom `jurusan_id` di tabel `alumni` adalah FK yang merujuk ke kolom `id` (PK) di tabel `jurusan`.

### Penjelasan Tabel Utama:

1. **`users`:** Menyimpan informasi kredensial akun pengguna (Admin Akademik) beserta foto profil mereka.
2. **`jurusan`:** Menyimpan daftar jurusan, program studi, jenjang (D3/D4/S1), dan tingkat akreditasi yang tersedia.
3. **`alumni`:** Menyimpan data biodata lengkap alumni, NIM, password terenkripsi, foto profil, dan tanggal penting kelulusan akademik/ijazah.
4. **`sessions`:** Menyimpan token sesi pengguna secara persisten di database MySQL, memastikan sesi login pengguna tetap aman.
5. **`tracer_periods`:** Menyimpan jadwal atau periode pengisian kuisioner tracer study serta aturan target digit NIM (Semua, Ganjil, atau Genap).
6. **`tracer_questions`:** Menyimpan daftar pertanyaan kuesioner dinamis yang dibuat oleh admin.
7. **`tracer_responses`:** Menyimpan lembar submit respons kuesioner oleh alumni yang terhubung ke periode tracer tertentu.
8. **`tracer_answers`:** Menyimpan detail jawaban alumni untuk setiap pertanyaan kuesioner dinamis.
9. **`pekerjaan_alumni`:** Menyimpan riwayat karir/pekerjaan alumni yang digunakan untuk menghitung data statistik di dashboard secara global.
