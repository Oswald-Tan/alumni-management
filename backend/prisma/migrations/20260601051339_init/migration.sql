-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'ALUMNI') NOT NULL DEFAULT 'ALUMNI',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_studi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_prodi` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alumni` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `program_studi_id` INTEGER NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `tanggal_kelulusan` DATETIME(3) NOT NULL,
    `status_alumni` ENUM('LULUS', 'DAFTAR_WISUDA', 'MENUNGGU_VERIFIKASI', 'TERVERIFIKASI', 'IJAZAH_TERBIT', 'IJAZAH_DIAMBIL') NOT NULL DEFAULT 'LULUS',
    `foto` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `alumni_user_id_key`(`user_id`),
    UNIQUE INDEX `alumni_nim_key`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `berkas_wisuda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alumni_id` INTEGER NOT NULL,
    `nama_berkas` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `status` ENUM('MENUNGGU', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'MENUNGGU',
    `catatan` TEXT NULL,
    `verified_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ijazah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alumni_id` INTEGER NOT NULL,
    `nomor_ijazah` VARCHAR(191) NOT NULL,
    `tanggal_terbit` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ijazah_alumni_id_key`(`alumni_id`),
    UNIQUE INDEX `ijazah_nomor_ijazah_key`(`nomor_ijazah`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengambilan_ijazah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ijazah_id` INTEGER NOT NULL,
    `tanggal_pengambilan` DATETIME(3) NOT NULL,
    `penerima` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pengambilan_ijazah_ijazah_id_key`(`ijazah_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alumni` ADD CONSTRAINT `alumni_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alumni` ADD CONSTRAINT `alumni_program_studi_id_fkey` FOREIGN KEY (`program_studi_id`) REFERENCES `program_studi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `berkas_wisuda` ADD CONSTRAINT `berkas_wisuda_alumni_id_fkey` FOREIGN KEY (`alumni_id`) REFERENCES `alumni`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `berkas_wisuda` ADD CONSTRAINT `berkas_wisuda_verified_by_fkey` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ijazah` ADD CONSTRAINT `ijazah_alumni_id_fkey` FOREIGN KEY (`alumni_id`) REFERENCES `alumni`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengambilan_ijazah` ADD CONSTRAINT `pengambilan_ijazah_ijazah_id_fkey` FOREIGN KEY (`ijazah_id`) REFERENCES `ijazah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
