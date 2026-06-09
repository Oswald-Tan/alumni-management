const prisma = require("../config/prisma");

const deriveStatus = (alumni) => {
  if (alumni.tanggalPengambilanIjazah) return "IJAZAH_DIAMBIL";
  if (alumni.nomorIjazah && alumni.nomorIjazah.trim() !== "") return "IJAZAH_TERBIT";
  if (alumni.tanggalKelulusan) return "LULUS";
  if (alumni.tanggalWisuda) return "TERDAFTAR_WISUDA";
  return "TERDAFTAR_WISUDA";
};

// GET /api/v1/dashboard
const getDashboard = async (req, res) => {
  try {
    const [
      totalAlumni,
      totalProdi,
      sudahAmbilIjazah,
      belumAmbilIjazah,
      alumniPerProdi,
      allAlumni,
    ] = await Promise.all([
      prisma.alumni.count(),
      prisma.programStudi.count(),
      prisma.alumni.count({ where: { tanggalPengambilanIjazah: { not: null } } }),
      prisma.alumni.count({ where: { tanggalPengambilanIjazah: null } }),
      prisma.alumni.groupBy({
        by: ["programStudiId"],
        _count: { programStudiId: true },
        orderBy: { _count: { programStudiId: "desc" } },
      }),
      prisma.alumni.findMany({
        select: {
          tanggalPengambilanIjazah: true,
          nomorIjazah: true,
          tanggalKelulusan: true,
          tanggalWisuda: true,
        },
      }),
    ]);

    // Hitung distribusi status alumni secara dinamis
    const distribution = {
      TERDAFTAR_WISUDA: 0,
      LULUS: 0,
      IJAZAH_TERBIT: 0,
      IJAZAH_DIAMBIL: 0,
    };
    allAlumni.forEach((a) => {
      const status = deriveStatus(a);
      if (distribution[status] !== undefined) {
        distribution[status]++;
      }
    });

    const statusDistribusi = Object.entries(distribution).map(([status, total]) => ({
      status,
      total,
    }));

    // Ambil nama prodi untuk distribusi per prodi
    const prodiIds = alumniPerProdi.map((a) => a.programStudiId);
    const prodiList = await prisma.programStudi.findMany({
      where: { id: { in: prodiIds } },
    });
    const prodiMap = Object.fromEntries(prodiList.map((p) => [p.id, p.namaProdi]));

    const alumniPerProdiFormatted = alumniPerProdi.map((a) => ({
      prodiId: a.programStudiId,
      namaProdi: prodiMap[a.programStudiId] || "Unknown",
      total: a._count.programStudiId,
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalAlumni,
        totalProdi,
        sudahAmbilIjazah,
        belumAmbilIjazah,
        statusDistribusi,
        alumniPerProdi: alumniPerProdiFormatted,
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

module.exports = { getDashboard };
