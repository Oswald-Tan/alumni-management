-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 29, 2026 at 01:29 AM
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

--
-- Dumping data for table `alumni`
--

INSERT INTO `alumni` (`id`, `nama`, `nim`, `password`, `jurusan_id`, `tanggal_wisuda`, `tanggal_kelulusan`, `nomor_ijazah`, `tanggal_pengambilan_ijazah`, `created_at`, `updated_at`, `foto`) VALUES
(1, 'Ahmad Fauzan', '2020714001', '$2b$10$ozAQ5lt42ihfDHY8i2Cyb.gNFEi1tjasC6MAxh9FMqNzjYIEloH0u', 1, '2024-07-20 00:00:00.000', '2024-06-15 00:00:00.000', 'I-1029302', '2024-08-01 00:00:00.000', '2026-06-20 06:05:12.535', '2026-06-20 06:05:12.535', NULL),
(2, 'Siti Rahayu', '2020714002', '$2b$10$0Vt0bF9tifGZs0iWkMZoAe0MkV3JzrtL4Ri6me.ItrqbMJ1f3Vxsa', 1, '2024-07-20 00:00:00.000', '2024-06-15 00:00:00.000', 'I-1029303', NULL, '2026-06-20 06:05:12.672', '2026-06-20 06:05:12.672', NULL),
(3, 'Budi Santoso', '2020713001', '$2b$10$bulqu/mh0aCmX0gYoEhAqOCivyeCAvsJm02OF182/YyIXPyJ23IHm', 2, '2024-07-20 00:00:00.000', '2024-06-15 00:00:00.000', NULL, NULL, '2026-06-20 06:05:12.746', '2026-06-20 06:05:12.746', NULL),
(4, 'Dewi Lestari', '2020713002', '$2b$10$OWeSMACDAyKd/ci8I1RR.OCIOsXG20GDF.wr4SclXeUtsJnjTGgO2', 2, '2024-07-10 00:00:00.000', '2026-06-12 00:00:00.000', NULL, NULL, '2026-06-20 06:05:12.819', '2026-06-20 07:27:17.125', 'foto-1781940437103-906579701.jpg');

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
(2, 'Teknik Elektro', 'D4 Teknologi Rekayasa Perangkat Lunak', 'D4', 'Baik Sekali', '2026-06-20 06:05:12.364', '2026-06-20 06:05:12.364'),
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
  `updated_at` datetime(3) NOT NULL
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

--
-- Dumping data for table `tracer_answers`
--

INSERT INTO `tracer_answers` (`id`, `response_id`, `question_id`, `jawaban`) VALUES
(1, 1, 1, 'Tidak'),
(2, 1, 2, 'Lebih dari 6 bulan'),
(3, 1, 3, 'Tidak Sesuai'),
(4, 1, 4, 'test saran');

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
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tracer_periods`
--

INSERT INTO `tracer_periods` (`id`, `nama_periode`, `tanggal_mulai`, `tanggal_selesai`, `status`, `mode_pengisian`, `created_at`, `updated_at`) VALUES
(1, 'Tracer Study Periode 2026', '2026-01-01 00:00:00.000', '2026-12-31 00:00:00.000', 'Aktif', 'Semua', '2026-06-20 06:05:12.825', '2026-06-20 06:05:12.825');

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
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tracer_questions`
--

INSERT INTO `tracer_questions` (`id`, `pertanyaan`, `tipe`, `opsi`, `is_required`, `urutan`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Apakah Anda saat ini sudah bekerja?', 'radio', 'Ya,Tidak', 1, 1, 1, '2026-06-20 06:05:12.829', '2026-06-20 06:05:12.829'),
(2, 'Berapa lama waktu tunggu untuk mendapatkan pekerjaan pertama Anda?', 'select', 'Kurang dari 3 bulan,3 - 6 bulan,Lebih dari 6 bulan', 0, 2, 1, '2026-06-20 06:05:12.833', '2026-06-20 06:05:12.833'),
(3, 'Apakah pekerjaan Anda saat ini sesuai dengan bidang studi Anda?', 'radio', 'Sesuai,Tidak Sesuai', 0, 3, 1, '2026-06-20 06:05:12.836', '2026-06-20 06:05:12.836'),
(4, 'Masukkan saran Anda untuk peningkatan kurikulum program studi.', 'textarea', '', 0, 4, 1, '2026-06-20 06:05:12.838', '2026-06-20 06:05:12.838');

-- --------------------------------------------------------

--
-- Table structure for table `tracer_responses`
--

CREATE TABLE `tracer_responses` (
  `id` int NOT NULL,
  `tracer_period_id` int NOT NULL,
  `alumni_id` int NOT NULL,
  `submitted_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tracer_responses`
--

INSERT INTO `tracer_responses` (`id`, `tracer_period_id`, `alumni_id`, `submitted_at`) VALUES
(1, 1, 1, '2026-06-20 06:22:25.390');

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
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`, `foto`) VALUES
(1, 'Admin Akademik', 'admin@polimdo.ac.id', '$2b$10$gaEaRVdec7SZLI5fMaO6EuglWFBd5R/fhSY5BRQf3XijT5/Jb/mUm', '2026-06-20 06:05:12.312', '2026-06-20 06:05:12.312', NULL);

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
  ADD PRIMARY KEY (`id`);

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
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumni`
--
ALTER TABLE `alumni`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jurusan`
--
ALTER TABLE `jurusan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `pekerjaan_alumni`
--
ALTER TABLE `pekerjaan_alumni`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tracer_answers`
--
ALTER TABLE `tracer_answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tracer_periods`
--
ALTER TABLE `tracer_periods`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tracer_questions`
--
ALTER TABLE `tracer_questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tracer_responses`
--
ALTER TABLE `tracer_responses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- Constraints for table `tracer_responses`
--
ALTER TABLE `tracer_responses`
  ADD CONSTRAINT `tracer_responses_alumni_id_fkey` FOREIGN KEY (`alumni_id`) REFERENCES `alumni` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tracer_responses_tracer_period_id_fkey` FOREIGN KEY (`tracer_period_id`) REFERENCES `tracer_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
