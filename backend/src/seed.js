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

    // Seed Program Studi
    const prodiData = [
      { namaProdi: "D4 Teknik Informatika" },
      { namaProdi: "D4 Teknik Elektro" },
      { namaProdi: "D4 Teknik Mesin" },
      { namaProdi: "D4 Teknik Sipil" },
      { namaProdi: "D4 Akuntansi" },
      { namaProdi: "D4 Administrasi Bisnis" },
      { namaProdi: "D4 Teknologi Rekayasa Perangkat Lunak" },
    ];

    const prodis = await Promise.all(
      prodiData.map((p) => prisma.programStudi.create({ data: p }))
    );
    console.log(`✅ ${prodis.length} Program Studi seeded`);

    // Seed beberapa alumni contoh
    const alumniContoh = [
      {
        nim: "2020714001",
        nama: "Ahmad Fauzan",
        prodiIdx: 0,
        tanggalKelulusan: new Date("2024-06-15"),
        tanggalWisuda: new Date("2024-07-20"),
        nomorIjazah: "I-1029302",
        tanggalPengambilanIjazah: new Date("2024-08-01"),
      },
      {
        nim: "2020714002",
        nama: "Siti Rahayu",
        prodiIdx: 0,
        tanggalKelulusan: new Date("2024-06-15"),
        tanggalWisuda: new Date("2024-07-20"),
        nomorIjazah: "I-1029303",
        tanggalPengambilanIjazah: null,
      },
      {
        nim: "2020713001",
        nama: "Budi Santoso",
        prodiIdx: 1,
        tanggalKelulusan: new Date("2024-06-15"),
        tanggalWisuda: new Date("2024-07-20"),
        nomorIjazah: null,
        tanggalPengambilanIjazah: null,
      },
      {
        nim: "2020713002",
        nama: "Dewi Lestari",
        prodiIdx: 1,
        tanggalKelulusan: null,
        tanggalWisuda: new Date("2024-07-10"),
        nomorIjazah: null,
        tanggalPengambilanIjazah: null,
      },
    ];

    for (const alumni of alumniContoh) {
      await prisma.alumni.create({
        data: {
          nim: alumni.nim,
          nama: alumni.nama,
          programStudiId: prodis[alumni.prodiIdx].id,
          tanggalKelulusan: alumni.tanggalKelulusan,
          tanggalWisuda: alumni.tanggalWisuda,
          nomorIjazah: alumni.nomorIjazah,
          tanggalPengambilanIjazah: alumni.tanggalPengambilanIjazah,
        },
      });
    }
    console.log(`✅ ${alumniContoh.length} Alumni contoh seeded`);
    console.log("🌱 Seeding selesai!");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
  }
}

module.exports = { seedDatabase };
