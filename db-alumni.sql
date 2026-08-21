-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 21, 2026 at 07:50 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db-alumni`
--

-- --------------------------------------------------------

--
-- Table structure for table `alumni`
--

CREATE TABLE `alumni` (
  `id` int NOT NULL,
  `nama` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nim` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jurusan_id` int NOT NULL,
  `tanggal_wisuda` datetime(3) DEFAULT NULL,
  `tanggal_kelulusan` datetime(3) DEFAULT NULL,
  `nomor_ijazah` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal_pengambilan_ijazah` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jurusan`
--

CREATE TABLE `jurusan` (
  `id` int NOT NULL,
  `nama_jurusan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_prodi` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenjang` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `akreditasi` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jurusan`
--

INSERT INTO `jurusan` (`id`, `nama_jurusan`, `nama_prodi`, `jenjang`, `akreditasi`, `created_at`, `updated_at`) VALUES
(1, 'Teknik Elektro', 'D4 Teknik Informatika', 'D4', 'A', '2026-06-20 06:05:12.364', '2026-06-20 06:05:12.364'),
(3, 'Teknik Elektro', 'D3 Teknik Listrik', 'D3', 'B', '2026-06-20 06:05:12.364', '2026-06-20 06:05:12.364'),
(4, 'Administrasi Bisnis', 'D4 Administrasi Bisnis', 'D4', 'A', '2026-06-20 06:05:12.364', '2026-06-20 06:05:12.364'),
(5, 'Teknik Sipil', 'D4 Teknik Sipil', 'D4', 'A', '2026-06-20 06:05:12.364', '2026-06-20 06:05:12.364'),
(6, 'Akuntansi', 'D4 Akuntansi', 'D4', 'A', '2026-06-20 06:05:12.364', '2026-06-20 06:05:12.364'),
(7, 'Teknik Mesin', 'D4 Teknik Mesin', 'D4', 'B', '2026-06-20 06:05:12.364', '2026-06-20 06:05:12.364');

-- --------------------------------------------------------

--
-- Table structure for table `pekerjaan_alumni`
--

CREATE TABLE `pekerjaan_alumni` (
  `id` int NOT NULL,
  `alumni_id` int NOT NULL,
  `nama_perusahaan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jabatan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bidang_pekerjaan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_pekerjaan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tahun_mulai` int NOT NULL,
  `gaji_pertama` double DEFAULT NULL,
  `kesesuaian_bidang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `waktu_tunggu` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `lokasi_kerja` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Dalam Negeri'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('LVtBJAnJPmEOhwyPmAVoTpVw1Svihda6', 1787159436, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-08-19T16:57:52.488Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":7,\"role\":\"ALUMNI\",\"name\":\"Agung\",\"foto\":null,\"nim\":\"20024037\"}'),
('rSytS-6uvE15HpTDRHEp61iNYZ6nUryU', 1787159766, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-08-19T15:53:23.983Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":1,\"role\":\"ADMIN\",\"name\":\"Admin Akademik\",\"foto\":null,\"email\":\"admin@polimdo.ac.id\"}');

-- --------------------------------------------------------

--
-- Table structure for table `tracer_answers`
--

CREATE TABLE `tracer_answers` (
  `id` int NOT NULL,
  `response_id` int NOT NULL,
  `question_id` int NOT NULL,
  `jawaban` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tracer_periods`
--

CREATE TABLE `tracer_periods` (
  `id` int NOT NULL,
  `nama_periode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_mulai` datetime(3) NOT NULL,
  `tanggal_selesai` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode_pengisian` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SEMUA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tracer_periods`
--

INSERT INTO `tracer_periods` (`id`, `nama_periode`, `tanggal_mulai`, `tanggal_selesai`, `status`, `mode_pengisian`, `created_at`, `updated_at`, `category`) VALUES
(1, 'Tracer Study Periode 2026', '2026-01-01 00:00:00.000', '2026-12-31 00:00:00.000', 'Aktif', 'Semua', '2026-06-20 06:05:12.825', '2026-06-20 06:05:12.825', 'SEMUA');

-- --------------------------------------------------------

--
-- Table structure for table `tracer_questions`
--

CREATE TABLE `tracer_questions` (
  `id` int NOT NULL,
  `pertanyaan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opsi` text COLLATE utf8mb4_unicode_ci,
  `is_required` tinyint(1) NOT NULL DEFAULT '1',
  `urutan` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DIKTI',
  `jurusan_id` int DEFAULT NULL,
  `section` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tracer_questions`
--

INSERT INTO `tracer_questions` (`id`, `pertanyaan`, `tipe`, `opsi`, `is_required`, `urutan`, `is_active`, `created_at`, `updated_at`, `category`, `jurusan_id`, `section`) VALUES
(12, 'Bagaimana Anda menilai penguasaan konsep teoritis yang Anda peroleh selama kuliah dalam mendukung pekerjaan saat ini?', 'radio', 'Sangat Mendukung,Mendukung,Cukup Mendukung,Kurang Mendukung,Tidak Mendukung', 1, 1, 1, '2026-08-05 05:55:41.068', '2026-08-05 05:55:41.068', 'IKU', NULL, 'Bagian 1: Kompetensi Utama (Hard Skills)'),
(13, 'Sejauh mana keterampilan teknis (penggunaan alat/software/metode spesifik) yang diajarkan di Prodi relevan dengan kebutuhan industri tempat Anda bekerja?', 'radio', 'Sangat Relevan,Relevan,Cukup Relevan,Kurang Relevan,Tidak Relevan', 1, 2, 1, '2026-08-05 05:55:41.070', '2026-08-05 05:55:41.070', 'IKU', NULL, 'Bagian 1: Kompetensi Utama (Hard Skills)'),
(14, 'Dalam menyelesaikan tugas teknis yang kompleks, apakah bekal metodologi penelitian/pemecahan masalah dari kampus sudah memadai?', 'radio', 'Sangat Memadai,Memadai,Cukup Memadai,Kurang Memadai,Tidak Memadai', 1, 3, 1, '2026-08-05 05:55:41.073', '2026-08-05 05:55:41.073', 'IKU', NULL, 'Bagian 1: Kompetensi Utama (Hard Skills)'),
(15, 'Seberapa baik kemampuan komunikasi (presentasi dan penulisan laporan) yang Anda miliki berkat proses pembelajaran di Prodi?', 'radio', 'Sangat Baik,Baik,Cukup Baik,Kurang Baik,Sangat Kurang', 1, 4, 1, '2026-08-05 05:55:41.076', '2026-08-05 05:55:41.076', 'IKU', NULL, 'Bagian 2: Kompetensi Pendukung (Soft Skills)'),
(16, 'Kemampuan bekerja dalam tim (teamwork) yang dibentuk selama masa perkuliahan sangat membantu saya dalam berkolaborasi di dunia kerja.', 'radio', 'Sangat Setuju,Setuju,Ragu-ragu,Tidak Setuju,Sangat Tidak Setuju', 1, 5, 1, '2026-08-05 05:55:41.079', '2026-08-05 05:55:41.079', 'IKU', NULL, 'Bagian 2: Kompetensi Pendukung (Soft Skills)'),
(17, 'Seberapa sering Anda menggunakan kemampuan Bahasa Inggris/Asing dalam lingkup profesional Anda saat ini?', 'radio', 'Setiap Hari,Sering,Kadang-kadang,Jarang,Tidak Pernah', 1, 6, 1, '2026-08-05 05:55:41.081', '2026-08-05 05:55:41.081', 'IKU', NULL, 'Bagian 2: Kompetensi Pendukung (Soft Skills)'),
(18, 'Sejauh mana pemahaman terhadap etika profesi yang diajarkan di kampus diterapkan dalam lingkungan kerja Anda?', 'radio', 'Selalu Diterapkan,Sering Diterapkan,Kadang-kadang Diterapkan,Jarang Diterapkan,Belum Pernah Diterapkan', 1, 7, 1, '2026-08-05 05:55:41.084', '2026-08-05 05:55:41.084', 'IKU', NULL, 'Bagian 3: Sikap dan Etika'),
(19, 'Kemampuan untuk beradaptasi dan belajar secara mandiri (lifelong learning) terhadap perubahan teknologi/regulasi di kantor dinilai:', 'radio', 'Sangat Tinggi,Tinggi,Cukup,Rendah,Sangat Rendah', 1, 8, 1, '2026-08-05 05:55:41.086', '2026-08-05 05:55:41.086', 'IKU', NULL, 'Bagian 3: Sikap dan Etika'),
(20, 'Menurut Anda, apa aspek yang paling perlu ditingkatkan dari kurikulum Prodi agar lulusan lebih siap kerja?', 'radio', 'Penambahan porsi praktikum/skill teknis,Penguatan kemampuan bahasa asing,Pengembangan kepemimpinan dan karakter,Kerjasama dengan industri/magang lebih lama,Penajaman materi teoritis terbaru', 1, 9, 1, '2026-08-05 05:55:41.089', '2026-08-05 05:55:41.089', 'IKU', NULL, 'Bagian 4: Evaluasi Program Studi'),
(21, 'Jika Anda diminta merekomendasikan Program Studi ini kepada orang lain berdasarkan pengalaman capaian pembelajaran Anda, Anda akan:', 'radio', 'Sangat Merekomendasikan,Merekomendasikan,Ragu-ragu,Tidak Merekomendasikan,Sangat Tidak Merekomendasikan', 1, 10, 1, '2026-08-05 05:55:41.092', '2026-08-05 05:55:41.092', 'IKU', NULL, 'Bagian 4: Evaluasi Program Studi'),
(177, 'NIK (Nomor Induk Kependudukan)', 'text', '', 1, 1, 1, '2026-08-08 02:20:24.185', '2026-08-08 02:20:24.185', 'DIKTI', NULL, 'Data Pribadi'),
(178, 'NPWP (Jika ada)', 'text', '', 0, 2, 1, '2026-08-08 02:20:24.224', '2026-08-08 02:20:24.224', 'DIKTI', NULL, 'Data Pribadi'),
(179, 'Alamat Tempat Tinggal (Nama Jalan)', 'text', '', 1, 3, 1, '2026-08-08 02:20:24.228', '2026-08-08 02:20:24.228', 'DIKTI', NULL, 'Data Pribadi'),
(180, 'RT/RW Tempat Tinggal Saat Ini', 'text', '', 0, 4, 1, '2026-08-08 02:20:24.233', '2026-08-08 02:20:24.233', 'DIKTI', NULL, 'Data Pribadi'),
(181, 'Kecamatan Tempat Tinggal Saat Ini', 'text', '', 1, 5, 1, '2026-08-08 02:20:24.238', '2026-08-08 02:20:24.238', 'DIKTI', NULL, 'Data Pribadi'),
(182, 'Kota/Kabupaten Tempat Tinggal Saat Ini', 'text', '', 1, 6, 1, '2026-08-08 02:20:24.242', '2026-08-08 02:20:24.242', 'DIKTI', NULL, 'Data Pribadi'),
(183, 'Provinsi Tempat Tinggal Saat Ini', 'text', '', 1, 7, 1, '2026-08-08 02:20:24.246', '2026-08-08 02:20:24.246', 'DIKTI', NULL, 'Data Pribadi'),
(184, 'Pilih salah satu status keberkerjaan Anda saat ini?', 'select', 'Sudah Bekerja (Penuh/Paruh waktu),Wiraswasta,Melanjutkan Pendidikan,Tidak Kerja tetapi sedang mencari kerja,Belum memungkinkan bekerja', 1, 8, 1, '2026-08-08 02:20:24.250', '2026-08-08 02:20:24.250', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(185, 'Dapatkah Anda menjelaskan faktor penyebab Anda belum memungkinkan bekerja? (Bagi yang menjawab Belum memungkinkan bekerja)', 'textarea', '', 0, 9, 1, '2026-08-08 02:20:24.255', '2026-08-08 02:20:24.255', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(186, 'Apakah Anda mendapatkan pekerjaan pertama kurang dari 6 bulan setelah lulus?', 'select', 'Ya,Tidak / Lebih dari 6 bulan', 0, 10, 1, '2026-08-08 02:20:24.260', '2026-08-08 02:20:24.260', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(187, 'Jika lebih dari 6 bulan mendapatkan pekerjaan pertama, berapa bulan Anda mencari/mendapatkan pekerjaan?', 'select', '6-9 Bulan,9-12 Bulan,12-15 Bulan,Diatas 15 Bulan', 0, 11, 1, '2026-08-08 02:20:24.263', '2026-08-08 02:20:24.263', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(188, 'Berapa rata-rata pendapatan Anda perbulan? (Dalam Angka Rupiah)', 'select', 'Dibawah Rp. 3 Juta,Rp 3-5 Juta,Rp. 5-7,Rp. 7-9,Rp. 9-12,Diatas Rp. 12 Juta', 0, 12, 1, '2026-08-08 02:20:24.266', '2026-08-08 02:20:24.266', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(189, 'Provinsi tempat Anda bekerja?', 'select', 'Aceh,Sumatera Utara,Sumatera Barat,Riau,Kepulauan Riau,Jambi,Bengkulu,Sumatera Selatan,Kepulauan Bangka Belitung,Lampung,DKI Jakarta,Banten,Jawa Barat,Jawa Tengah,DI Yogyakarta,Jawa Timur,Bali,Nusa Tenggara Barat,Nusa Tenggara Timur,Kalimantan Barat,Kalimantan Tengah,Kalimantan Selatan,Kalimantan Timur,Kalimantan Utara,Sulawesi Utara,Gorontalo,Sulawesi Tengah,Sulawesi Barat,Sulawesi Selatan,Sulawesi Tenggara,Maluku,Maluku Utara,Papua,Papua Barat,Papua Selatan,Papua Tengah,Papua Pegunungan,Papua Barat Daya', 0, 13, 1, '2026-08-08 02:20:24.270', '2026-08-08 02:20:24.270', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(190, 'Kabupaten/Kota tempat Anda bekerja?', 'text', '', 0, 14, 1, '2026-08-08 02:20:24.274', '2026-08-08 02:20:24.274', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(191, 'Apa jenis perusahaan/instansi/institusi tempat Anda bekerja sekarang?', 'select', 'Instansi Pemerintah,BUMN/BUMD,Organisasi Non-Profit/LSM,Perusahaan Swasta,Wiraswasta/Usaha Mandiri,Institusi/Organisasi Multilateral', 0, 15, 1, '2026-08-08 02:20:24.278', '2026-08-08 02:20:24.278', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(192, 'Apa nama perusahaan/kantor tempat Anda bekerja?', 'text', '', 0, 16, 1, '2026-08-08 02:20:24.283', '2026-08-08 02:20:24.283', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(193, 'Bila berwiraswasta, apa posisi/jabatan Anda saat ini?', 'text', '', 0, 17, 1, '2026-08-08 02:20:24.287', '2026-08-08 02:20:24.287', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(194, 'Apa tingkat tempat kerja Anda?', 'select', 'Lokal/Wilayah/Berwirausaha tidak berizin,Nasional/Berwirausaha berbadan hukum,Internasional/Multinasional', 0, 18, 1, '2026-08-08 02:20:24.292', '2026-08-08 02:20:24.292', 'DIKTI', NULL, 'Kuesioner Wajib Status Keberkerjaan'),
(195, 'Sumber biaya pendidikan tinggi lanjut?', 'select', 'Biaya Sendiri,Beasiswa', 0, 19, 1, '2026-08-08 02:20:24.296', '2026-08-08 02:20:24.296', 'DIKTI', NULL, 'Pertanyaan Lanjut Pendidikan'),
(196, 'Nama Perguruan Tinggi Lanjut', 'text', '', 0, 20, 1, '2026-08-08 02:20:24.300', '2026-08-08 02:20:24.300', 'DIKTI', NULL, 'Pertanyaan Lanjut Pendidikan'),
(197, 'Program Studi Pendidikan Lanjut', 'text', '', 0, 21, 1, '2026-08-08 02:20:24.304', '2026-08-08 02:20:24.304', 'DIKTI', NULL, 'Pertanyaan Lanjut Pendidikan'),
(198, 'Tanggal Masuk Pendidikan Lanjut', 'text', '', 0, 22, 1, '2026-08-08 02:20:24.307', '2026-08-08 02:20:24.307', 'DIKTI', NULL, 'Pertanyaan Lanjut Pendidikan'),
(199, 'Sumber dana pembiayaan pada waktu kuliah di Politeknik Negeri Manado', 'select', 'Biaya sendiri/Keluarga,Beasiswa ADIK,Beasiswa BIDIKMISI/KIP,Beasiswa PPA,Beasiswa AFIRMASI,Beasiswa perusahaan/Swasta', 0, 23, 1, '2026-08-08 02:20:24.312', '2026-08-08 02:20:24.312', 'DIKTI', NULL, 'Pertanyaan Lanjut Pendidikan'),
(200, 'Seberapa erat hubungan bidang studi dengan pekerjaan Anda?', 'radio', 'Sangat Erat,Erat,Cukup Erat,Kurang Erat,Tidak Erat Sama Sekali', 1, 24, 1, '2026-08-08 02:20:24.315', '2026-08-08 02:20:24.315', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(201, 'Tingkat pendidikan apa yang paling tepat/sesuai untuk pekerjaan Anda saat ini?', 'select', 'Setingkat lebih tinggi,Tingkat yang sama,Setingkat lebih rendah,Tidak perlu pendidikan tinggi', 0, 25, 1, '2026-08-08 02:20:24.319', '2026-08-08 02:20:24.319', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(202, 'Pada saat lulus  (A)  , pada tingkat mana kompetensi di bawah ini anda kuasai dan pada tingkat mana kompetensi di bawah ini diperlukan dalam pekerjaan (B)? \n\nBidang Kompetensi  (Pilih jawaban bidang dibawah ini)', 'label', '', 0, 26, 1, '2026-08-08 02:20:24.322', '2026-08-08 02:20:24.322', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(203, 'Etika (A - Pada saat lulus)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 27, 1, '2026-08-08 02:20:24.327', '2026-08-08 02:20:24.327', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(204, 'Etika (B - Diperlukan dalam pekerjaan)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 28, 1, '2026-08-08 02:20:24.330', '2026-08-08 02:20:24.330', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(205, 'Keahlian berdasarkan bidang ilmu (A - Pada saat lulus)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 29, 1, '2026-08-08 02:20:24.359', '2026-08-08 02:20:24.359', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(206, 'Keahlian berdasarkan bidang ilmu (B - Diperlukan dalam pekerjaan)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 30, 1, '2026-08-08 02:20:24.362', '2026-08-08 02:20:24.362', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(207, 'Bahasa Inggris (A - Pada saat lulus)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 31, 1, '2026-08-08 02:20:24.366', '2026-08-08 02:20:24.366', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(208, 'Bahasa Inggris (B - Diperlukan dalam pekerjaan)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 32, 1, '2026-08-08 02:20:24.371', '2026-08-08 02:20:24.371', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(209, 'Penggunaan Teknologi Informasi (A - Pada saat lulus)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 33, 1, '2026-08-08 02:20:24.406', '2026-08-08 02:20:24.406', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(210, 'Penggunaan Teknologi Informasi (B - Diperlukan dalam pekerjaan)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 34, 1, '2026-08-08 02:20:24.410', '2026-08-08 02:20:24.410', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(211, 'Komunikasi (A - Pada saat lulus)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 35, 1, '2026-08-08 02:20:24.413', '2026-08-08 02:20:24.413', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(212, 'Komunikasi (B - Diperlukan dalam pekerjaan)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 36, 1, '2026-08-08 02:20:24.417', '2026-08-08 02:20:24.417', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(213, 'Kerja sama tim (A - Pada saat lulus)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 37, 1, '2026-08-08 02:20:24.422', '2026-08-08 02:20:24.422', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(214, 'Kerja sama tim (B - Diperlukan dalam pekerjaan)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 38, 1, '2026-08-08 02:20:24.427', '2026-08-08 02:20:24.427', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(215, 'Pengembangan Diri (A - Pada saat lulus)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 39, 1, '2026-08-08 02:20:24.430', '2026-08-08 02:20:24.430', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(216, 'Pengembangan Diri (B - Diperlukan dalam pekerjaan)', 'radio', 'Sangat Rendah,Rendah,Cukup,Tinggi,Sangat Tinggi', 0, 40, 1, '2026-08-08 02:20:24.434', '2026-08-08 02:20:24.434', 'DIKTI', NULL, 'Keselarasan Bidang & Kompetensi'),
(217, 'Menurut anda seberapa besar penekanan pada metode pembelajaran dibawah ini dilaksanakan di program studi anda?', 'label', '', 0, 41, 1, '2026-08-08 02:20:24.438', '2026-08-08 02:20:24.438', 'DIKTI', NULL, 'Penekanan Metode Pembelajaran'),
(218, 'Perkuliahan / Tatap muka dikelas dengan Dosen (Teori)', 'radio', 'Sangat Besar,Besar,Cukup Besar,Kurang Besar,Tidak Sama Sekali', 0, 42, 1, '2026-08-08 02:20:24.442', '2026-08-08 02:20:24.442', 'DIKTI', NULL, 'Penekanan Metode Pembelajaran'),
(219, 'Demonstrasi/Peragaan', 'radio', 'Sangat Besar,Besar,Cukup Besar,Kurang Besar,Tidak Sama Sekali', 0, 43, 1, '2026-08-08 02:20:24.445', '2026-08-08 02:20:24.445', 'DIKTI', NULL, 'Penekanan Metode Pembelajaran'),
(220, 'Partisipasi dalam proyek pembelajaran / penelitian / Pengabdian', 'radio', 'Sangat Besar,Besar,Cukup Besar,Kurang Besar,Tidak Sama Sekali', 0, 44, 1, '2026-08-08 02:20:24.449', '2026-08-08 02:20:24.449', 'DIKTI', NULL, 'Penekanan Metode Pembelajaran'),
(221, 'Magang', 'radio', 'Sangat Besar,Besar,Cukup Besar,Kurang Besar,Tidak Sama Sekali', 0, 45, 1, '2026-08-08 02:20:24.452', '2026-08-08 02:20:24.452', 'DIKTI', NULL, 'Penekanan Metode Pembelajaran'),
(222, 'Praktikum', 'radio', 'Sangat Besar,Besar,Cukup Besar,Kurang Besar,Tidak Sama Sekali', 0, 46, 1, '2026-08-08 02:20:24.457', '2026-08-08 02:20:24.457', 'DIKTI', NULL, 'Penekanan Metode Pembelajaran'),
(223, 'Kerja di Industri', 'radio', 'Sangat Besar,Besar,Cukup Besar,Kurang Besar,Tidak Sama Sekali', 0, 47, 1, '2026-08-08 02:20:24.461', '2026-08-08 02:20:24.461', 'DIKTI', NULL, 'Penekanan Metode Pembelajaran'),
(224, 'Diskusi / Studi Kasus', 'radio', 'Sangat Besar,Besar,Cukup Besar,Kurang Besar,Tidak Sama Sekali', 0, 48, 1, '2026-08-08 02:20:24.464', '2026-08-08 02:20:24.464', 'DIKTI', NULL, 'Penekanan Metode Pembelajaran'),
(225, 'Kapan Anda mulai mencari pekerjaan? (Sebutkan berapa bulan sebelum/setelah lulus)', 'select', 'Kira-kira beberapa bulan sebelum lulus,Kira-kira beberapa bulan setelah lulus,Saya tidak mencari kerja', 0, 49, 1, '2026-08-08 02:20:24.468', '2026-08-08 02:20:24.468', 'DIKTI', NULL, 'Pencarian Kerja'),
(226, 'Bagaimana Anda mencari pekerjaan tersebut?', 'checkbox', 'Iklan di koran/majalah/brosur,Melamar ke perusahaan tanpa tahu lowongan,Bursa/Pameran kerja,Internet/Iklan online/Medsos,Dihubungi oleh perusahaan,Menghubungi Kemenaker/Disnaker,Agen tenaga kerja komersial/swasta,Unit Pengembangan Karir Polimdo,Hubungan Alumni/Kemahasiswaan,Membangun jejaring (network) sejak kuliah,Melalui relasi (dosen/orang tua/teman),Membangun bisnis sendiri,Melalui penempatan kerja atau magang,Bekerja di tempat sama sewaktu kuliah,Lainnya', 0, 50, 1, '2026-08-08 02:20:24.472', '2026-08-08 02:20:24.472', 'DIKTI', NULL, 'Pencarian Kerja'),
(227, 'Berapa perusahaan/instansi yang Anda lamar sebelum memperoleh pekerjaan pertama?', 'text', '', 0, 51, 1, '2026-08-08 02:20:24.476', '2026-08-08 02:20:24.476', 'DIKTI', NULL, 'Pencarian Kerja'),
(228, 'Berapa banyak perusahaan/instansi yang merespons lamaran Anda?', 'text', '', 0, 52, 1, '2026-08-08 02:20:24.479', '2026-08-08 02:20:24.479', 'DIKTI', NULL, 'Pencarian Kerja'),
(229, 'Berapa banyak perusahaan/instansi yang mengundang Anda untuk wawancara?', 'text', '', 0, 53, 1, '2026-08-08 02:20:24.483', '2026-08-08 02:20:24.483', 'DIKTI', NULL, 'Pencarian Kerja'),
(230, 'Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir?', 'checkbox', 'Tidak,Tidak tapi saya sedang menunggu hasil lamaran kerja,Ya saya akan mulai bekerja dalam 2 minggu ke depan,Ya tapi saya belum pasti akan bekerja dalam 2 minggu ke depan', 0, 54, 1, '2026-08-08 02:20:24.488', '2026-08-08 02:20:24.488', 'DIKTI', NULL, 'Pencarian Kerja'),
(231, 'Jika pekerjaan saat ini tidak sesuai dengan pendidikan Anda, mengapa Anda mengambilnya?', 'select', 'Pekerjaan saya sekarang sudah sesuai dengan pendidikan,Belum mendapatkan pekerjaan yang lebih sesuai,Prospek karir yang baik,Suka pekerjaan yang tidak berhubungan dengan pendidikan,Dipromosikan ke posisi kurang berhubungan dengan pendidikan,Pendapatan lebih tinggi,Pekerjaan lebih aman/terjamin,Pekerjaan lebih menarik,Lokasi lebih dekat dari rumah,Kebutuhan keluarga lebih terjamin,Harus menerima pekerjaan tidak berhubungan pada awal karir,Lainnya', 0, 55, 1, '2026-08-08 02:20:24.492', '2026-08-08 02:20:24.492', 'DIKTI', NULL, 'Pencarian Kerja');

-- --------------------------------------------------------

--
-- Table structure for table `tracer_responses`
--

CREATE TABLE `tracer_responses` (
  `id` int NOT NULL,
  `tracer_period_id` int NOT NULL,
  `alumni_id` int NOT NULL,
  `submitted_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DIKTI'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jurusan_id` int DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ADMIN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`, `foto`, `jurusan_id`, `role`) VALUES
(1, 'Admin Akademik', 'admin@polimdo.ac.id', '$2b$10$gaEaRVdec7SZLI5fMaO6EuglWFBd5R/fhSY5BRQf3XijT5/Jb/mUm', '2026-06-20 06:05:12.312', '2026-06-20 06:05:12.312', NULL, NULL, 'ADMIN');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumni`
--
ALTER TABLE `alumni`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `alumni_nim_key` (`nim`),
  ADD KEY `alumni_jurusan_id_fkey` (`jurusan_id`);

--
-- Indexes for table `jurusan`
--
ALTER TABLE `jurusan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pekerjaan_alumni`
--
ALTER TABLE `pekerjaan_alumni`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pekerjaan_alumni_alumni_id_fkey` (`alumni_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `tracer_answers`
--
ALTER TABLE `tracer_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tracer_answers_response_id_fkey` (`response_id`),
  ADD KEY `tracer_answers_question_id_fkey` (`question_id`);

--
-- Indexes for table `tracer_periods`
--
ALTER TABLE `tracer_periods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tracer_questions`
--
ALTER TABLE `tracer_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tracer_questions_jurusan_id_fkey` (`jurusan_id`);

--
-- Indexes for table `tracer_responses`
--
ALTER TABLE `tracer_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tracer_responses_tracer_period_id_fkey` (`tracer_period_id`),
  ADD KEY `tracer_responses_alumni_id_fkey` (`alumni_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `users_jurusan_id_fkey` (`jurusan_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumni`
--
ALTER TABLE `alumni`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `jurusan`
--
ALTER TABLE `jurusan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `pekerjaan_alumni`
--
ALTER TABLE `pekerjaan_alumni`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tracer_answers`
--
ALTER TABLE `tracer_answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `tracer_periods`
--
ALTER TABLE `tracer_periods`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tracer_questions`
--
ALTER TABLE `tracer_questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=232;

--
-- AUTO_INCREMENT for table `tracer_responses`
--
ALTER TABLE `tracer_responses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alumni`
--
ALTER TABLE `alumni`
  ADD CONSTRAINT `alumni_jurusan_id_fkey` FOREIGN KEY (`jurusan_id`) REFERENCES `jurusan` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `pekerjaan_alumni`
--
ALTER TABLE `pekerjaan_alumni`
  ADD CONSTRAINT `pekerjaan_alumni_alumni_id_fkey` FOREIGN KEY (`alumni_id`) REFERENCES `alumni` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tracer_answers`
--
ALTER TABLE `tracer_answers`
  ADD CONSTRAINT `tracer_answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `tracer_questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tracer_answers_response_id_fkey` FOREIGN KEY (`response_id`) REFERENCES `tracer_responses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tracer_questions`
--
ALTER TABLE `tracer_questions`
  ADD CONSTRAINT `tracer_questions_jurusan_id_fkey` FOREIGN KEY (`jurusan_id`) REFERENCES `jurusan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tracer_responses`
--
ALTER TABLE `tracer_responses`
  ADD CONSTRAINT `tracer_responses_alumni_id_fkey` FOREIGN KEY (`alumni_id`) REFERENCES `alumni` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tracer_responses_tracer_period_id_fkey` FOREIGN KEY (`tracer_period_id`) REFERENCES `tracer_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_jurusan_id_fkey` FOREIGN KEY (`jurusan_id`) REFERENCES `jurusan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
