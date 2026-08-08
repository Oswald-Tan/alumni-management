# Panduan Aturan & Cara Kerja Pengujian Tracer Study (DIKTI & IKU)
**Politeknik Negeri Manado - Sistem Pengelolaan Data Alumni**

Dokumen ini disusun secara rinci untuk memberikan pemahaman mengenai **aturan waktu kelayakan**, **mekanisme kuesioner**, serta **panduan simulasi/pengujian** pengisian Tracer Study DIKTI dan IKU bagi alumni.

---

## 1. Konsep & Kategori Tracer Study

Sistem kuesioner alumni terbagi menjadi 2 kategori utama sesuai dengan standar Kemendikbudristek / DIKTI:

### A. Tracer Study DIKTI (Lulusan 1 Tahun)
* **Tujuan**: Memenuhi standar kuesioner pelaporan tahunan nasional Kemendikbudristek / DIKTI.
* **Target Alumni**: Alumni yang telah lulus **1 Tahun** dari perguruan tinggi.
* **Cakupan Kuesioner**: Data pribadi, status keberkerjaan, keselarasan bidang ilmu, kompetensi yang dikuasai/dibutuhkan, metode pembelajaran, dan riwayat pencarian kerja.

### B. Tracer Study IKU (Lulusan 1 s.d. 5 Tahun)
* **Tujuan**: Mengukur Indikator Kinerja Utama (IKU) PTN/PTS terkait Capaian Pembelajaran Lulusan (CPL) dan mutu lulusan dalam lingkup 1 hingga 5 tahun pasca lulus.
* **Target Alumni**: Alumni yang lulus dalam rentang waktu **1 hingga 5 Tahun**.
* **Cakupan Kuesioner**: Evaluasi Hard Skills (konsep teoritis & praktis), Soft Skills (komunikasi, kerja sama tim), etika profesi, serta masukan penguatan kurikulum prodi.

---

## 2. Aturan Perhitungan Waktu Kelayakan (Eligibility Rules)

Sistem secara otomatis menghitung selisih tahun antara **Tahun Berjalan (Saat Ini)** dengan **Tahun Kelulusan Alumni**:

$$\text{Selisih Tahun Lulus} = \text{Tahun Berjalan Saat Ini} - \text{Tahun Kelulusan Alumni}$$

> **Keterangan Tanggal Kelulusan**:
> 1. Sistem memprioritaskan tanggal dari field `tanggalKelulusan`.
> 2. Jika kosong, sistem membaca `tanggalWisuda`.
> 3. Jika keduanya belum terisi, sistem mengekstrak 2 digit awal NIM alumni sebagai estimasi tahun masuk/lulus.

### Matriks Kelayakan Kuesioner:

| Selisih Tahun Lulus | Kelayakan Tracer DIKTI | Kelayakan Tracer IKU | Status Tampilan Sistem |
| :---: | :---: | :---: | :--- |
| **0 - 1 Tahun** | **AKTIF** ✅ | **AKTIF** ✅ | Kuesioner **DIKTI** dan **IKU** muncul & siap diisi. |
| **2 - 5 Tahun** | **TIDAK AKTIF** ❌ | **AKTIF** ✅ | Hanya kuesioner **IKU** yang muncul & siap diisi. |
| **> 5 Tahun** | **TIDAK AKTIF** ❌ | **TIDAK AKTIF** ❌ | Kuesioner **TIDAK MUNCUL** (Menampilkan info alumni di luar rentang evaluasi 1-5 tahun). |

---

## 3. Aturan Konfigurasi Periode oleh Admin

Kuesioner Tracer Study di website **HANYA** dapat diakses alumni apabila 3 syarat admin ini terpenuhi:

1. **Status Periode Aktif**: Admin Program Studi / Admin Utama telah membuat/mengaktifkan periode tracer study dengan status **`Aktif`**.
2. **Rentang Tanggal Berlaku**: Tanggal pengisian saat ini berada di dalam rentang `Tanggal Mulai` s.d. `Tanggal Selesai` periode tersebut.
3. **Aturan Digit NIM (Ganjil / Genap)**:
   * **Mode Semua**: Seluruh alumni eligible dapat mengisi.
   * **Mode Khusus Ganjil**: Hanya alumni dengan **digit terakhir NIM bernilai ganjil** (1, 3, 5, 7, 9) yang dapat mengisi.
   * **Mode Khusus Genap**: Hanya alumni dengan **digit terakhir NIM bernilai genap** (0, 2, 4, 6, 8) yang dapat mengisi.

---

## 4. Mekanisme Pengisian & Status di Dashboard Alumni

### A. Apakah Kuesioner Muncul Terus Sampai Diisi?
* **YA**. Kuesioner yang menjadi hak alumni (DIKTI / IKU) akan **tetap berada di Dashboard** dengan status **`Kuisioner Tersedia`** dan tombol **`Isi Kuisioner Tracer`** selama periode tracer aktif dan alumni belum mengirimkan jawabannya.

### B. Status Pengisian pada Dashboard Alumni:
1. **`Kuisioner Tersedia`**: Alumni memenuhi syarat dan **belum mengisi** kuesioner (DIKTI / IKU).
2. **`Sebagian Terisi`**: Alumni telah mengisi 1 kategori (misal: DIKTI), tetapi **masih ada kategori lain** yang menjadi haknya (misal: IKU) belum diselesaikan. Tombol berubah menjadi **`Lanjutkan Isi Tracer`**.
3. **`Selesai Mengisi`**: Alumni telah **menyelesaikan seluruh kuesioner** yang diwajibkan untuknya. Kuesioner yang sudah diisi tidak perlu diisi ulang pada periode aktif yang sama.
4. **`Belum Dibuka / Berakhir`**: Muncul jika tidak ada periode aktif, rentang tanggal belum/sudah habis, atau NIM alumni tidak memenuhi syarat Ganjil/Genap.

---

## 5. Panduan Langkah Uji Coba (Testing / Simulation)

Untuk melakukan pengujian mandiri oleh Admin atau Klien (Asumsi tahun sistem berjalan saat ini adalah **2026**):

### Langkah 1: Pastikan Periode Tracer Aktif
1. Masuk sebagai **Admin / Admin Prodi**.
2. Buka menu **Kelola Tracer -> Periode Tracer**.
3. Buat atau atur periode dengan:
   * Status: **`Aktif`**
   * Mode Pengisian: **`Semua`**
   * Tanggal Mulai & Selesai: Melingkupi hari ini.

### Langkah 2: Atur Tanggal Kelulusan Alumni untuk Pengujian
1. Buka menu **Data Alumni**.
2. Cari data alumni yang akan digunakan untuk pengujian, klik **Edit**.
3. Cobalah mengubah `Tanggal Kelulusan` sesuai skenario pada tabel berikut:

| Skenario Pengujian | Input Tanggal Kelulusan | Hasil yang Diharapkan Saat Alumni Log in |
| :--- | :--- | :--- |
| **Uji Coba Lulusan 1 Tahun** *(Uji DIKTI & IKU)* | `2025-06-15` *(Tahun 2025)* | Dashboard menampilkan **"Kuisioner Tersedia"**. Di halaman Tracer muncul 2 tab: **Tracer DIKTI** & **Tracer IKU**. |
| **Uji Coba Lulusan 3 Tahun** *(Uji IKU Saja)* | `2023-04-20` *(Tahun 2023)* | Dashboard menampilkan **"Kuisioner Tersedia"**. Di halaman Tracer hanya muncul tab **Tracer IKU**. |
| **Uji Coba Alumni Senior (> 5 Tahun)** | `2020-01-10` *(Tahun 2020)* | Dashboard menampilkan **"Belum Dibuka / Berakhir"** dengan keterangan alumni di luar rentang evaluasi. |

### Langkah 3: Verifikasi Pengisian & Penyerahan Jawaban
1. Login sebagai akun Alumni yang telah diubah tanggal kelulusannya.
2. Buka menu **Tracer Study** dari Navbar atau klik tombol di Dashboard.
3. Isi seluruh pertanyaan kuesioner (pilihan radio, checkbox multi-select, dropdown, text) lalu klik **Simpan Jawaban Kuesioner**.
4. Kembali ke Dashboard, pastikan indikator berubah menjadi **Selesai Mengisi** (badge warna hijau).

---

## 6. Ringkasan Tanya Jawab (FAQ untuk Klien)

**Q: Mengapa alumni yang baru lulus di tahun yang sama bisa melihat kuesioner?**  
*A: Pada sistem, kelulusan tahun berjalan otomatis masuk dalam perhitungan kategori lulusan tahun pertama agar alumni fresh graduate dapat langsung mengisi tracer awal.*

**Q: Apakah alumni harus mengisi kuesioner setiap kali login?**  
*A: Tidak. Setelah jawaban disubmit, data tersimpan permanen di database untuk periode tersebut. Alumni akan melihat status "Selesai Mengisi" dan ucapan terima kasih.*

**Q: Apakah kuesioner "Bagaimana Anda mencari pekerjaan?" bisa memilih lebih dari 1 jawaban?**  
*A: Ya. Pertanyaan tersebut menggunakan tipe `checkbox` (multi-select), sehingga alumni dapat memilih beberapa saluran pencarian kerja sekaligus.*
