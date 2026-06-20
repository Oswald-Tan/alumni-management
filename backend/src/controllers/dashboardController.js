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
      totalProdi, // totalJurusan/Prodi
      sudahAmbilIjazah,
      belumAmbilIjazah,
      alumniPerJurusan,
      allAlumni,
      activePeriod,
    ] = await Promise.all([
      prisma.alumni.count(),
      prisma.jurusan.count(),
      prisma.alumni.count({ where: { tanggalPengambilanIjazah: { not: null } } }),
      prisma.alumni.count({ where: { tanggalPengambilanIjazah: null } }),
      prisma.alumni.groupBy({
        by: ["jurusanId"],
        _count: { jurusanId: true },
        orderBy: { _count: { jurusanId: "desc" } },
      }),
      prisma.alumni.findMany({
        select: {
          id: true,
          nim: true,
          tanggalPengambilanIjazah: true,
          nomorIjazah: true,
          tanggalKelulusan: true,
          tanggalWisuda: true,
          jurusanId: true,
          pekerjaanAlumni: true,
        },
      }),
      prisma.tracerPeriod.findFirst({
        where: { status: "Aktif" },
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

    // Ambil nama prodi untuk distribusi per prodi/jurusan
    const jurusanIds = alumniPerJurusan.map((a) => a.jurusanId);
    const jurusanList = await prisma.jurusan.findMany({
      where: { id: { in: jurusanIds } },
    });
    const jurusanMap = Object.fromEntries(jurusanList.map((j) => [j.id, `${j.namaJurusan} / ${j.namaProdi}`]));

    const alumniPerProdiFormatted = alumniPerJurusan.map((a) => ({
      prodiId: a.jurusanId,
      namaProdi: jurusanMap[a.jurusanId] || "Unknown",
      total: a._count.jurusanId,
    }));

    // Hitung statistik pekerjaan alumni secara global
    let sesuaiCount = 0;
    let tidakSesuaiCount = 0;
    let tetapCount = 0;
    let kontrakCount = 0;
    let belumBekerjaCount = 0;

    const waktuTungguPerJurusan = {}; // jurusanId -> { totalWaktu: X, count: Y }

    allAlumni.forEach((alumni) => {
      const jobs = alumni.pekerjaanAlumni || [];
      if (jobs.length > 0) {
        // Ambil pekerjaan terbaru (terakhir diinput)
        const latestJob = jobs[jobs.length - 1];
        if (latestJob.kesesuaianBidang === "Sesuai") {
          sesuaiCount++;
        } else {
          tidakSesuaiCount++;
        }

        if (latestJob.statusPekerjaan === "Tetap") {
          tetapCount++;
        } else {
          kontrakCount++; // default/lainnya dianggap kontrak
        }

        const jId = alumni.jurusanId;
        if (!waktuTungguPerJurusan[jId]) {
          waktuTungguPerJurusan[jId] = { totalWaktu: 0, count: 0 };
        }
        waktuTungguPerJurusan[jId].totalWaktu += latestJob.waktuTunggu || 0;
        waktuTungguPerJurusan[jId].count += 1;
      } else {
        belumBekerjaCount++;
      }
    });

    const waktuTungguPerProdiFormatted = alumniPerProdiFormatted.map((p) => {
      const stats = waktuTungguPerJurusan[p.prodiId];
      const rataRata = stats && stats.count > 0 ? parseFloat((stats.totalWaktu / stats.count).toFixed(1)) : 0;
      return {
        prodiId: p.prodiId,
        namaProdi: p.namaProdi,
        rataWaktuTunggu: rataRata,
      };
    });

    // Hitung statistik Tracer Study berdasarkan periode aktif
    let tracerStats = {
      namaPeriodeAktif: "Tidak ada periode aktif",
      status: "Tidak Aktif",
      totalAlumniTarget: 0,
      sudahMengisi: 0,
      belumMengisi: 0,
      persentase: 0,
    };

    if (activePeriod) {
      // Tentukan target alumni berdasarkan digit NIM (jika mode Ganjil / Genap)
      let eligibleAlumni = allAlumni;
      if (activePeriod.modePengisian === "Ganjil") {
        eligibleAlumni = allAlumni.filter((a) => {
          const lastDigit = parseInt(a.nim.slice(-1));
          return [1, 3, 5, 7, 9].includes(lastDigit);
        });
      } else if (activePeriod.modePengisian === "Genap") {
        eligibleAlumni = allAlumni.filter((a) => {
          const lastDigit = parseInt(a.nim.slice(-1));
          return [0, 2, 4, 6, 8].includes(lastDigit);
        });
      }

      const totalTarget = eligibleAlumni.length;

      // Hitung berapa yang sudah mengisi untuk periode ini
      const sudahMengisiCount = await prisma.tracerResponse.count({
        where: {
          tracerPeriodId: activePeriod.id,
          alumniId: { in: eligibleAlumni.map((a) => a.id) },
        },
      });

      tracerStats = {
        namaPeriodeAktif: activePeriod.namaPeriode,
        status: activePeriod.status,
        totalAlumniTarget: totalTarget,
        sudahMengisi: sudahMengisiCount,
        belumMengisi: Math.max(0, totalTarget - sudahMengisiCount),
        persentase: totalTarget > 0 ? Math.round((sudahMengisiCount / totalTarget) * 100) : 0,
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        totalAlumni,
        totalProdi, // Di frontend dibaca totalProdi, sekarang berisi totalJurusan
        sudahAmbilIjazah,
        belumAmbilIjazah,
        statusDistribusi,
        alumniPerProdi: alumniPerProdiFormatted,
        tracerStats,
        pekerjaanStats: {
          kesesuaianBidang: [
            { name: "Sesuai", value: sesuaiCount },
            { name: "Tidak Sesuai", value: tidakSesuaiCount },
          ],
          statusPekerjaan: [
            { name: "Tetap", value: tetapCount },
            { name: "Kontrak", value: kontrakCount },
            { name: "Belum Bekerja", value: belumBekerjaCount },
          ],
          waktuTungguPerProdi: waktuTungguPerProdiFormatted,
        },
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

module.exports = { getDashboard };
