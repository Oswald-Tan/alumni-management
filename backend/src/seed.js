const bcrypt = require("bcryptjs");
const prisma = require("./config/prisma");

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Cek apakah sudah ada data
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      console.log("✅ Database sudah ada data, skip seeding.");
      return;
    }

    // Seed Admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "Admin Akademik",
        email: "admin@polimdo.ac.id",
        password: adminPassword,
      },
    });
    console.log("✅ Admin seeded: admin@polimdo.ac.id / admin123");

    // Seed Jurusan (Jurusan + Prodi)
    const jurusanData = [
      { namaJurusan: "Teknik Elektro", namaProdi: "D4 Teknik Informatika", jenjang: "D4", akreditasi: "A" },
      { namaJurusan: "Teknik Elektro", namaProdi: "D4 Teknologi Rekayasa Perangkat Lunak", jenjang: "D4", akreditasi: "Baik Sekali" },
      { namaJurusan: "Teknik Elektro", namaProdi: "D3 Teknik Listrik", jenjang: "D3", akreditasi: "B" },
      { namaJurusan: "Teknik Mesin", namaProdi: "D4 Teknik Mesin", jenjang: "D4", akreditasi: "B" },
      { namaJurusan: "Teknik Sipil", namaProdi: "D4 Teknik Sipil", jenjang: "D4", akreditasi: "A" },
      { namaJurusan: "Akuntansi", namaProdi: "D4 Akuntansi", jenjang: "D4", akreditasi: "A" },
      { namaJurusan: "Administrasi Bisnis", namaProdi: "D4 Administrasi Bisnis", jenjang: "D4", akreditasi: "A" },
    ];

    const jurusans = await Promise.all(
      jurusanData.map((j) => prisma.jurusan.create({ data: j }))
    );
    console.log(`✅ ${jurusans.length} Jurusan seeded`);

    // Seed beberapa alumni contoh dengan password = hashed NIM
    const hashPassword = async (pwd) => {
      return await bcrypt.hash(pwd, 10);
    };

    const alumniContoh = [
      {
        nim: "2020714001",
        nama: "Ahmad Fauzan",
        jurusanIdx: 0,
        tanggalKelulusan: new Date("2024-06-15"),
        tanggalWisuda: new Date("2024-07-20"),
        nomorIjazah: "I-1029302",
        tanggalPengambilanIjazah: new Date("2024-08-01"),
      },
      {
        nim: "2020714002",
        nama: "Siti Rahayu",
        jurusanIdx: 0,
        tanggalKelulusan: new Date("2024-06-15"),
        tanggalWisuda: new Date("2024-07-20"),
        nomorIjazah: "I-1029303",
        tanggalPengambilanIjazah: null,
      },
      {
        nim: "2020713001",
        nama: "Budi Santoso",
        jurusanIdx: 1,
        tanggalKelulusan: new Date("2024-06-15"),
        tanggalWisuda: new Date("2024-07-20"),
        nomorIjazah: null,
        tanggalPengambilanIjazah: null,
      },
      {
        nim: "2020713002",
        nama: "Dewi Lestari",
        jurusanIdx: 1,
        tanggalKelulusan: null,
        tanggalWisuda: new Date("2024-07-10"),
        nomorIjazah: null,
        tanggalPengambilanIjazah: null,
      },
    ];

    for (const alumni of alumniContoh) {
      const pwd = await hashPassword(alumni.nim);
      await prisma.alumni.create({
        data: {
          nim: alumni.nim,
          nama: alumni.nama,
          password: pwd,
          jurusanId: jurusans[alumni.jurusanIdx].id,
          tanggalKelulusan: alumni.tanggalKelulusan,
          tanggalWisuda: alumni.tanggalWisuda,
          nomorIjazah: alumni.nomorIjazah,
          tanggalPengambilanIjazah: alumni.tanggalPengambilanIjazah,
        },
      });
    }
    console.log(`✅ ${alumniContoh.length} Alumni contoh seeded`);

    // Seed Tracer Period
    const activePeriod = await prisma.tracerPeriod.create({
      data: {
        namaPeriode: "Tracer Study Periode 2026",
        tanggalMulai: new Date("2026-01-01"),
        tanggalSelesai: new Date("2026-12-31"),
        status: "Aktif",
        modePengisian: "Semua",
      },
    });
    console.log(`✅ Tracer Period "${activePeriod.namaPeriode}" seeded`);

    // Seed Tracer Questions
    const questions = [
      {
        pertanyaan: "Apakah Anda saat ini sudah bekerja?",
        tipe: "radio",
        opsi: "Ya,Tidak",
        isRequired: true,
        urutan: 1,
        isActive: true,
      },
      {
        pertanyaan: "Berapa lama waktu tunggu untuk mendapatkan pekerjaan pertama Anda?",
        tipe: "select",
        opsi: "Kurang dari 3 bulan,3 - 6 bulan,Lebih dari 6 bulan",
        isRequired: false,
        urutan: 2,
        isActive: true,
      },
      {
        pertanyaan: "Apakah pekerjaan Anda saat ini sesuai dengan bidang studi Anda?",
        tipe: "radio",
        opsi: "Sesuai,Tidak Sesuai",
        isRequired: false,
        urutan: 3,
        isActive: true,
      },
      {
        pertanyaan: "Masukkan saran Anda untuk peningkatan kurikulum program studi.",
        tipe: "textarea",
        opsi: "",
        isRequired: false,
        urutan: 4,
        isActive: true,
      },
    ];

    for (const q of questions) {
      await prisma.tracerQuestion.create({ data: q });
    }
    console.log(`✅ ${questions.length} Tracer Questions seeded`);

    console.log("🌱 Seeding selesai!");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
  }
}

module.exports = { seedDatabase };
