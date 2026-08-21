const prisma = require("../config/prisma");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer-core");

// Deteksi otomatis Google Chrome atau Microsoft Edge di Windows
const getChromePath = () => {
  const paths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
};

// ==========================================
// 1. PERIODE TRACER (ADMIN)
// ==========================================

const getAllPeriods = async (req, res) => {
  try {
    const periods = await prisma.tracerPeriod.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, data: periods });
  } catch (error) {
    console.error("Get all periods error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const createPeriod = async (req, res) => {
  try {
    const { namaPeriode, tanggalMulai, tanggalSelesai, status, modePengisian } = req.body;
    if (!namaPeriode || !tanggalMulai || !tanggalSelesai || !status || !modePengisian) {
      return res.status(400).json({ success: false, message: "Semua field periode wajib diisi" });
    }

    // Jika status "Aktif", nonaktifkan periode lain terlebih dahulu
    if (status === "Aktif") {
      await prisma.tracerPeriod.updateMany({
        where: { status: "Aktif" },
        data: { status: "Tidak Aktif" },
      });
    }

    const period = await prisma.tracerPeriod.create({
      data: {
        namaPeriode,
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        status,
        modePengisian,
      },
    });

    return res.status(201).json({ success: true, message: "Periode tracer berhasil dibuat", data: period });
  } catch (error) {
    console.error("Create period error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const updatePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaPeriode, tanggalMulai, tanggalSelesai, status, modePengisian } = req.body;

    const existing = await prisma.tracerPeriod.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Periode tidak ditemukan" });
    }

    // Jika status diubah ke "Aktif", nonaktifkan periode aktif lain
    if (status === "Aktif" && existing.status !== "Aktif") {
      await prisma.tracerPeriod.updateMany({
        where: { status: "Aktif" },
        data: { status: "Tidak Aktif" },
      });
    }

    const updated = await prisma.tracerPeriod.update({
      where: { id: parseInt(id) },
      data: {
        namaPeriode,
        tanggalMulai: tanggalMulai ? new Date(tanggalMulai) : undefined,
        tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai) : undefined,
        status,
        modePengisian,
      },
    });

    return res.status(200).json({ success: true, message: "Periode tracer berhasil diupdate", data: updated });
  } catch (error) {
    console.error("Update period error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const removePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tracerPeriod.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: "Periode tracer berhasil dihapus" });
  } catch (error) {
    console.error("Delete period error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 2. PERTANYAAN DINAMIS (ADMIN)
// ==========================================

const getAllQuestions = async (req, res) => {
  try {
    const { category, jurusanId } = req.query;
    const where = {};

    if (category) {
      where.category = category;
    }

    if (req.session.role === "ADMIN_PRODI" && req.session.jurusanId) {
      where.OR = [{ jurusanId: null }, { jurusanId: req.session.jurusanId }];
    } else if (jurusanId) {
      where.OR = [{ jurusanId: null }, { jurusanId: parseInt(jurusanId) }];
    }

    const questions = await prisma.tracerQuestion.findMany({
      where,
      include: { jurusan: true },
      orderBy: [{ section: "asc" }, { urutan: "asc" }],
    });
    return res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error("Get all questions error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { pertanyaan, tipe, opsi, isRequired, urutan, isActive, category, section, jurusanId } = req.body;
    if (!pertanyaan || !tipe) {
      return res.status(400).json({ success: false, message: "Pertanyaan dan tipe wajib diisi" });
    }

    // Jika Admin Prodi, otomatis tetapkan jurusanId dari session
    let targetJurusanId = null;
    if (req.session.role === "ADMIN_PRODI" && req.session.jurusanId) {
      targetJurusanId = req.session.jurusanId;
    } else if (jurusanId) {
      targetJurusanId = parseInt(jurusanId);
    }

    const question = await prisma.tracerQuestion.create({
      data: {
        pertanyaan,
        tipe,
        opsi: opsi || null,
        isRequired: isRequired !== undefined ? isRequired : true,
        urutan: urutan !== undefined ? parseInt(urutan) : 0,
        isActive: isActive !== undefined ? isActive : true,
        category: category || "DIKTI",
        section: section || null,
        jurusanId: targetJurusanId,
      },
    });

    return res.status(201).json({ success: true, message: "Pertanyaan berhasil ditambahkan", data: question });
  } catch (error) {
    console.error("Create question error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { pertanyaan, tipe, opsi, isRequired, urutan, isActive, category, section, jurusanId } = req.body;

    const existing = await prisma.tracerQuestion.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Pertanyaan tidak ditemukan" });
    }

    // Hanya Admin Prodi pengelola atau Super Admin yang bisa mengedit
    if (req.session.role === "ADMIN_PRODI" && existing.jurusanId && existing.jurusanId !== req.session.jurusanId) {
      return res.status(403).json({ success: false, message: "Anda tidak memiliki akses untuk mengubah pertanyaan prodi lain" });
    }

    const updated = await prisma.tracerQuestion.update({
      where: { id: parseInt(id) },
      data: {
        pertanyaan,
        tipe,
        opsi: opsi !== undefined ? opsi : undefined,
        isRequired: isRequired !== undefined ? isRequired : undefined,
        urutan: urutan !== undefined ? parseInt(urutan) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        category: category !== undefined ? category : undefined,
        section: section !== undefined ? section : undefined,
        jurusanId: jurusanId !== undefined ? (jurusanId ? parseInt(jurusanId) : null) : undefined,
      },
    });

    return res.status(200).json({ success: true, message: "Pertanyaan berhasil diupdate", data: updated });
  } catch (error) {
    console.error("Update question error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const removeQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.tracerQuestion.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Pertanyaan tidak ditemukan" });
    }

    if (req.session.role === "ADMIN_PRODI" && existing.jurusanId && existing.jurusanId !== req.session.jurusanId) {
      return res.status(403).json({ success: false, message: "Anda tidak memiliki akses untuk menghapus pertanyaan prodi lain" });
    }

    await prisma.tracerQuestion.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ success: true, message: "Pertanyaan berhasil dihapus" });
  } catch (error) {
    console.error("Delete question error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 3. ALUMNI PORTAL FLOW (CHECK & SUBMIT)
// ==========================================

const checkEligibility = async (req, res) => {
  try {
    const alumniId = req.session.userId;
    if (!alumniId || req.session.role !== "ALUMNI") {
      return res.status(401).json({ success: false, message: "Hanya alumni yang dapat mengecek status tracer" });
    }

    const alumni = await prisma.alumni.findUnique({
      where: { id: alumniId },
      include: { jurusan: true },
    });

    if (!alumni) {
      return res.status(404).json({ success: false, message: "Data alumni tidak ditemukan" });
    }

    const activePeriod = await prisma.tracerPeriod.findFirst({
      where: { status: "Aktif" },
    });

    if (!activePeriod) {
      return res.status(200).json({
        success: true,
        eligible: false,
        status: "TIDAK_ADA_PERIODE",
        message: "Tidak ada periode tracer study yang aktif saat ini.",
      });
    }

    const now = new Date();
    if (now < new Date(activePeriod.tanggalMulai) || now > new Date(activePeriod.tanggalSelesai)) {
      return res.status(200).json({
        success: true,
        eligible: false,
        status: "EXPIRED",
        message: "Periode pengisian tracer study telah berakhir atau belum dimulai.",
      });
    }

    // Validasi Ganjil/Genap NIM
    const lastDigit = parseInt(alumni.nim.slice(-1));
    if (isNaN(lastDigit)) {
      return res.status(400).json({ success: false, message: "Digit terakhir NIM tidak valid" });
    }

    if (activePeriod.modePengisian === "Ganjil" && ![1, 3, 5, 7, 9].includes(lastDigit)) {
      return res.status(200).json({
        success: true,
        eligible: false,
        status: "NOT_ELIGIBLE",
        message: "Anda belum dapat mengisi tracer study pada periode ini (Khusus NIM Ganjil).",
      });
    }

    if (activePeriod.modePengisian === "Genap" && ![0, 2, 4, 6, 8].includes(lastDigit)) {
      return res.status(200).json({
        success: true,
        eligible: false,
        status: "NOT_ELIGIBLE",
        message: "Anda belum dapat mengisi tracer study pada periode ini (Khusus NIM Genap).",
      });
    }

    // Menghitung selisih tahun lulus alumni dari tahun berjalan
    const gradDate = alumni.tanggalKelulusan || alumni.tanggalWisuda;
    const gradYear = gradDate ? new Date(gradDate).getFullYear() : parseInt("20" + alumni.nim.substring(0, 2)) || now.getFullYear() - 1;
    const currentYear = now.getFullYear();
    const yearsPostGraduation = Math.max(1, currentYear - gradYear);

    // Menentukan eligibilitas DIKTI vs IKU
    // DIKTI = Lulusan 1 Tahun
    // IKU = Lulusan 1-5 Tahun (input 5 tahun ke belakang)
    const isEligibleDikti = (yearsPostGraduation === 1);
    const isEligibleIku = (yearsPostGraduation >= 1 && yearsPostGraduation <= 5);

    // Cek pengisian yang sudah dilakukan
    const existingResponses = await prisma.tracerResponse.findMany({
      where: {
        tracerPeriodId: activePeriod.id,
        alumniId: alumni.id,
      },
    });

    const filledCategories = existingResponses.map(r => r.category);

    return res.status(200).json({
      success: true,
      eligible: isEligibleDikti || isEligibleIku,
      status: "ELIGIBILITY_INFO",
      yearsPostGraduation,
      isEligibleDikti,
      isEligibleIku,
      filledCategories,
      period: activePeriod,
      message: "Status kelayakan pengisian kuesioner tracer study.",
    });
  } catch (error) {
    console.error("Check eligibility error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const getActiveQuestions = async (req, res) => {
  try {
    const alumniId = req.session.userId;
    const { category } = req.query; // "DIKTI" atau "IKU"

    const alumni = await prisma.alumni.findUnique({
      where: { id: alumniId },
    });

    const targetCategory = category || "DIKTI";

    const where = {
      isActive: true,
      category: targetCategory,
      OR: [
        { jurusanId: null }, // Pertanyaan umum/global
        { jurusanId: alumni ? alumni.jurusanId : undefined }, // Pertanyaan spesifik prodi
      ],
    };

    const questions = await prisma.tracerQuestion.findMany({
      where,
      orderBy: [{ section: "asc" }, { urutan: "asc" }],
    });
    return res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error("Get active questions error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const submitResponse = async (req, res) => {
  try {
    const alumniId = req.session.userId;
    if (!alumniId || req.session.role !== "ALUMNI") {
      return res.status(401).json({ success: false, message: "Hanya alumni yang dapat mengisi tracer" });
    }

    const { category, answers, job } = req.body; // category: "DIKTI" | "IKU", answers: [{questionId, jawaban}], job: {...}

    const targetCategory = category || "DIKTI";

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: "Jawaban kuisioner wajib dikirim" });
    }

    const activePeriod = await prisma.tracerPeriod.findFirst({
      where: { status: "Aktif" },
    });

    if (!activePeriod) {
      return res.status(400).json({ success: false, message: "Tidak ada periode tracer yang aktif" });
    }

    // Cek pengisian ganda untuk kategori yang sama pada periode ini
    const existing = await prisma.tracerResponse.findFirst({
      where: {
        tracerPeriodId: activePeriod.id,
        alumniId: alumniId,
        category: targetCategory,
      },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: `Anda sudah mengisi kuisioner tracer study kategori ${targetCategory} pada periode ini.` });
    }

    // Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Simpan Response
      const response = await tx.tracerResponse.create({
        data: {
          tracerPeriodId: activePeriod.id,
          alumniId: alumniId,
          category: targetCategory,
        },
      });

      // 2. Simpan Jawaban
      const answerData = answers.map((ans) => ({
        responseId: response.id,
        questionId: parseInt(ans.questionId),
        jawaban: ans.jawaban,
      }));

      await tx.tracerAnswer.createMany({
        data: answerData,
      });

      // 3. Simpan Pekerjaan (Jika bekerja dan data job dikirim)
      let pekerjaan = null;
      if (job && job.namaPerusahaan) {
        pekerjaan = await tx.pekerjaanAlumni.create({
          data: {
            alumniId: alumniId,
            namaPerusahaan: job.namaPerusahaan,
            jabatan: job.jabatan || "",
            bidangPekerjaan: job.bidangPekerjaan || "",
            statusPekerjaan: job.statusPekerjaan || "Tetap",
            tahunMulai: parseInt(job.tahunMulai) || new Date().getFullYear(),
            gajiPertama: job.gajiPertama ? parseFloat(job.gajiPertama) : null,
            kesesuaianBidang: job.kesesuaianBidang || "Sesuai",
            lokasiKerja: job.lokasiKerja || "Dalam Negeri",
            waktuTunggu: parseInt(job.waktuTunggu) || 0,
          },
        });
      }

      return { response, pekerjaan };
    });

    return res.status(201).json({
      success: true,
      message: `Kuesioner Tracer Study (${targetCategory}) berhasil dikirim. Terima kasih!`,
      data: result,
    });
  } catch (error) {
    console.error("Submit tracer response error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 4. MONITORING HASIL TRACER (ADMIN)
// ==========================================

const getMonitoringResults = async (req, res) => {
  try {
    const { jurusanId, status, periodId, category } = req.query;

    const where = {};
    // Admin Prodi: otomatis filter berdasarkan jurusan
    if (req.session.role === "ADMIN_PRODI" && req.session.jurusanId) {
      where.jurusanId = req.session.jurusanId;
    } else if (jurusanId) {
      where.jurusanId = parseInt(jurusanId);
    }

    // Ambil semua alumni
    const alumniList = await prisma.alumni.findMany({
      where,
      include: {
        jurusan: true,
        pekerjaanAlumni: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { nama: "asc" },
    });

    // Ambil periode filter atau periode aktif
    let targetPeriod = null;
    if (periodId && !isNaN(parseInt(periodId))) {
      targetPeriod = await prisma.tracerPeriod.findUnique({ where: { id: parseInt(periodId) } });
    } else {
      targetPeriod = await prisma.tracerPeriod.findFirst({ where: { status: "Aktif" } });
    }

    if (!targetPeriod) {
      const result = alumniList.map((a) => ({
        id: a.id,
        nama: a.nama,
        nim: a.nim,
        jurusan: a.jurusan,
        statusTracer: "Belum Mengisi",
        categoriesFilled: [],
        tanggalSubmit: null,
      }));
      return res.status(200).json({ success: true, data: result });
    }

    // Ambil semua response untuk periode target
    const responseWhere = { tracerPeriodId: targetPeriod.id };
    if (category) {
      responseWhere.category = category;
    }

    const responses = await prisma.tracerResponse.findMany({
      where: responseWhere,
    });

    // Map responses per alumni
    const alumniResponseMap = {};
    responses.forEach((r) => {
      if (!alumniResponseMap[r.alumniId]) {
        alumniResponseMap[r.alumniId] = {
          categories: [],
          lastSubmittedAt: r.submittedAt,
        };
      }
      alumniResponseMap[r.alumniId].categories.push(r.category);
    });

    let results = alumniList.map((a) => {
      const responseData = alumniResponseMap[a.id];
      const sudahMengisi = Boolean(responseData && responseData.categories.length > 0);
      return {
        id: a.id,
        nama: a.nama,
        nim: a.nim,
        jurusan: a.jurusan,
        statusTracer: sudahMengisi ? "Sudah Mengisi" : "Belum Mengisi",
        categoriesFilled: responseData ? responseData.categories : [],
        tanggalSubmit: responseData ? responseData.lastSubmittedAt : null,
      };
    });

    // Filter berdasarkan status pengisian jika diminta
    if (status) {
      results = results.filter((r) => r.statusTracer === status);
    }

    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Get monitoring results error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 5. LAPORAN AKREDITASI (ADMIN)
// ==========================================

const getAccreditationReport = async (req, res) => {
  try {
    const { jurusanId, periodId } = req.query;

    // Ambil periode target
    let targetPeriod = null;
    if (periodId && !isNaN(parseInt(periodId))) {
      targetPeriod = await prisma.tracerPeriod.findUnique({ where: { id: parseInt(periodId) } });
    } else {
      targetPeriod = await prisma.tracerPeriod.findFirst({ where: { status: "Aktif" } });
    }

    const where = {};
    // Admin Prodi: otomatis filter berdasarkan jurusan
    if (req.session.role === "ADMIN_PRODI" && req.session.jurusanId) {
      where.id = req.session.jurusanId;
    } else if (jurusanId) {
      where.id = parseInt(jurusanId);
    }

    // Ambil program studi/jurusan yang aktif
    const jurusans = await prisma.jurusan.findMany({
      where,
      include: {
        alumni: {
          include: {
            pekerjaanAlumni: true,
            tracerResponses: targetPeriod ? { where: { tracerPeriodId: targetPeriod.id } } : false,
          },
        },
      },
    });

    const report = jurusans.map((j) => {
      const alumni = j.alumni;
      const totalAlumni = alumni.length;

      // Filter target alumni sesuai ganjil/genap (jika ada periode aktif)
      let targetAlumni = alumni;
      if (targetPeriod) {
        if (targetPeriod.modePengisian === "Ganjil") {
          targetAlumni = alumni.filter((a) => [1, 3, 5, 7, 9].includes(parseInt(a.nim.slice(-1))));
        } else if (targetPeriod.modePengisian === "Genap") {
          targetAlumni = alumni.filter((a) => [0, 2, 4, 6, 8].includes(parseInt(a.nim.slice(-1))));
        }
      }

      const totalTarget = targetAlumni.length;

      // Hitung pengisian
      let sudahMengisi = 0;
      if (targetPeriod) {
        sudahMengisi = targetAlumni.filter((a) => a.tracerResponses && a.tracerResponses.length > 0).length;
      }
      const belumMengisi = Math.max(0, totalTarget - sudahMengisi);

      // Hitung statistik pekerjaan
      const pekerjaanList = targetAlumni.flatMap((a) => a.pekerjaanAlumni).filter(Boolean);
      const bekerja = pekerjaanList.length;
      const belumBekerja = Math.max(0, totalTarget - bekerja);

      // Kesesuaian bidang
      const sesuaiBidang = pekerjaanList.filter((p) => p.kesesuaianBidang === "Sesuai").length;
      const tidakSesuaiBidang = bekerja - sesuaiBidang;

      // Rata-rata waktu tunggu kerja (dalam bulan)
      const totalWaktuTunggu = pekerjaanList.reduce((acc, curr) => acc + curr.waktuTunggu, 0);
      const rataWaktuTunggu = bekerja > 0 ? parseFloat((totalWaktuTunggu / bekerja).toFixed(1)) : 0;

      return {
        jurusanId: j.id,
        namaJurusan: j.namaJurusan,
        namaProdi: j.namaProdi,
        jenjang: j.jenjang,
        akreditasi: j.akreditasi,
        totalAlumni,
        totalTarget,
        sudahMengisi,
        belumMengisi,
        persentaseMengisi: totalTarget > 0 ? Math.round((sudahMengisi / totalTarget) * 100) : 0,
        bekerja,
        belumBekerja,
        sesuaiBidang,
        tidakSesuaiBidang,
        rataWaktuTunggu,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        periode: targetPeriod ? targetPeriod.namaPeriode : "Tidak ada periode tracer",
        report,
      },
    });
  } catch (error) {
    console.error("Get accreditation report error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 6. EXPORT LAPORAN TRACER (EXCEL & PDF)
// ==========================================

const buildTracerWorksheet = async (workbook, { category, targetPeriod, targetJurusan, targetJurusanId }) => {
  const sheetName = category === "DIKTI" ? "Tracer Study DIKTI" : "Tracer Study IKU";
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ showGridLines: true }],
  });

  // 1. Ambil pertanyaan untuk kategori ini
  const questionWhere = {
    category,
    isActive: true,
    tipe: { not: "label" }, // Pertanyaan kuis aktual
  };
  if (targetJurusanId) {
    questionWhere.OR = [{ jurusanId: null }, { jurusanId: targetJurusanId }];
  }

  const questions = await prisma.tracerQuestion.findMany({
    where: questionWhere,
    include: { jurusan: true },
    orderBy: [{ section: "asc" }, { urutan: "asc" }, { id: "asc" }],
  });

  // 2. Ambil respons tracer untuk kategori ini
  const responseWhere = {
    category,
  };
  if (targetPeriod) {
    responseWhere.tracerPeriodId = targetPeriod.id;
  }
  if (targetJurusanId) {
    responseWhere.alumni = { jurusanId: targetJurusanId };
  }

  const responses = await prisma.tracerResponse.findMany({
    where: responseWhere,
    include: {
      alumni: {
        include: { jurusan: true },
      },
      answers: true,
      period: true,
    },
    orderBy: { submittedAt: "asc" },
  });

  // 3. Header Kolom (Baris 1) sesuai format kuesioner response Google Form (tanpa warna latar, tanpa NIM)
  const headers = [
    "Timestamp",
    "Email Address",
    "Nama Alumni",
    "Program Studi",
    ...questions.map((q) => q.pertanyaan),
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.values = headers;
  headerRow.height = 32;

  const thinBorder = {
    top: { style: "thin", color: { argb: "FFCBD5E1" } },
    bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
    left: { style: "thin", color: { argb: "FFCBD5E1" } },
    right: { style: "thin", color: { argb: "FFCBD5E1" } },
  };

  headerRow.eachCell((cell) => {
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF000000" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = thinBorder;
  });

  // Set widths
  worksheet.getColumn(1).width = 22; // Timestamp
  worksheet.getColumn(2).width = 28; // Email Address
  worksheet.getColumn(3).width = 28; // Nama Alumni
  worksheet.getColumn(4).width = 28; // Program Studi

  questions.forEach((q, idx) => {
    worksheet.getColumn(5 + idx).width = 35; // Kolom pertanyaan
  });

  // 4. Menulis Baris Data Responden (Mulai Baris 2)
  responses.forEach((resp, rIdx) => {
    const rowNum = 2 + rIdx;
    const ansMap = new Map();
    (resp.answers || []).forEach((a) => ansMap.set(a.questionId, a.jawaban));

    const row = worksheet.getRow(rowNum);

    const timestampVal = resp.submittedAt
      ? new Date(resp.submittedAt).toLocaleString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "-";

    const emailVal = resp.alumni?.email || "-";
    const namaVal = resp.alumni?.nama || "-";
    const prodiVal = resp.alumni?.jurusan
      ? `${resp.alumni.jurusan.namaJurusan} / ${resp.alumni.jurusan.namaProdi}`
      : "-";

    const questionAnswers = questions.map((q) => {
      const val = ansMap.get(q.id);
      return val !== undefined && val !== null && val !== "" ? val : "-";
    });

    row.values = [timestampVal, emailVal, namaVal, prodiVal, ...questionAnswers];
    row.height = 24;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.font = { name: "Arial", size: 9 };
      cell.border = thinBorder;
      if (colNumber === 1 || colNumber === 2) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else if (colNumber === 3 || colNumber === 4) {
        cell.alignment = { horizontal: "left", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
      }
    });
  });
};

const buildCombinedTracerWorksheet = async (workbook, { targetPeriod, targetJurusan, targetJurusanId }) => {
  const sheetTitle = "Tracer Study (Gabungan)";
  const worksheet = workbook.addWorksheet(sheetTitle, {
    views: [{ showGridLines: true }],
  });

  // 1. Ambil seluruh pertanyaan aktif DIKTI dan IKU
  const [diktiQuestions, ikuQuestions] = await Promise.all([
    prisma.tracerQuestion.findMany({
      where: {
        category: "DIKTI",
        isActive: true,
        ...(targetJurusanId ? { OR: [{ jurusanId: null }, { jurusanId: targetJurusanId }] } : {}),
      },
      include: { jurusan: true },
      orderBy: [{ section: "asc" }, { urutan: "asc" }, { id: "asc" }],
    }),
    prisma.tracerQuestion.findMany({
      where: {
        category: "IKU",
        isActive: true,
        ...(targetJurusanId ? { OR: [{ jurusanId: null }, { jurusanId: targetJurusanId }] } : {}),
      },
      include: { jurusan: true },
      orderBy: [{ section: "asc" }, { urutan: "asc" }, { id: "asc" }],
    }),
  ]);

  const allQuestions = [...diktiQuestions, ...ikuQuestions];

  // 2. Ambil respons tracer
  const responseWhere = {};
  if (targetPeriod) {
    responseWhere.tracerPeriodId = targetPeriod.id;
  }
  if (targetJurusanId) {
    responseWhere.alumni = { jurusanId: targetJurusanId };
  }

  const responses = await prisma.tracerResponse.findMany({
    where: responseWhere,
    include: {
      alumni: {
        include: { jurusan: true },
      },
      answers: true,
      period: true,
    },
    orderBy: { submittedAt: "asc" },
  });

  // Gabungkan respons per alumni
  const alumniMap = new Map();
  for (const resp of responses) {
    if (!alumniMap.has(resp.alumniId)) {
      alumniMap.set(resp.alumniId, {
        alumni: resp.alumni,
        submittedAt: resp.submittedAt,
        answers: new Map(),
      });
    }
    const entry = alumniMap.get(resp.alumniId);
    if (new Date(resp.submittedAt) > new Date(entry.submittedAt)) {
      entry.submittedAt = resp.submittedAt;
    }
    (resp.answers || []).forEach((a) => entry.answers.set(a.questionId, a.jawaban));
  }

  // 3. Header Kolom (Baris 1)
  const headers = [
    "Timestamp",
    "Email Address",
    "Nama Alumni",
    "Program Studi",
    ...allQuestions.map((q) => q.pertanyaan),
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.values = headers;
  headerRow.height = 32;

  const thinBorder = {
    top: { style: "thin", color: { argb: "FFCBD5E1" } },
    bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
    left: { style: "thin", color: { argb: "FFCBD5E1" } },
    right: { style: "thin", color: { argb: "FFCBD5E1" } },
  };

  headerRow.eachCell((cell) => {
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF000000" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = thinBorder;
  });

  // Set widths
  worksheet.getColumn(1).width = 22; // Timestamp
  worksheet.getColumn(2).width = 28; // Email Address
  worksheet.getColumn(3).width = 28; // Nama Alumni
  worksheet.getColumn(4).width = 28; // Program Studi

  allQuestions.forEach((q, idx) => {
    worksheet.getColumn(5 + idx).width = 35; // Kolom pertanyaan
  });

  // 4. Baris data
  let rowNum = 2;
  for (const entry of alumniMap.values()) {
    const row = worksheet.getRow(rowNum);

    const timestampVal = entry.submittedAt
      ? new Date(entry.submittedAt).toLocaleString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "-";

    const emailVal = entry.alumni?.email || "-";
    const namaVal = entry.alumni?.nama || "-";
    const prodiVal = entry.alumni?.jurusan
      ? `${entry.alumni.jurusan.namaJurusan} / ${entry.alumni.jurusan.namaProdi}`
      : "-";

    const questionAnswers = allQuestions.map((q) => {
      const val = entry.answers.get(q.id);
      return val !== undefined && val !== null && val !== "" ? val : "-";
    });

    row.values = [timestampVal, emailVal, namaVal, prodiVal, ...questionAnswers];
    row.height = 24;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.font = { name: "Arial", size: 9 };
      cell.border = thinBorder;
      if (colNumber === 1 || colNumber === 2) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else if (colNumber === 3 || colNumber === 4) {
        cell.alignment = { horizontal: "left", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
      }
    });

    rowNum++;
  }
};

const exportTracerExcel = async (req, res) => {
  try {
    const { jurusanId, periodId, category } = req.query;

    let targetPeriod = null;
    if (periodId && !isNaN(parseInt(periodId))) {
      targetPeriod = await prisma.tracerPeriod.findUnique({ where: { id: parseInt(periodId) } });
    } else {
      targetPeriod = await prisma.tracerPeriod.findFirst({ where: { status: "Aktif" } });
    }

    let targetJurusanId = null;
    if (req.session.role === "ADMIN_PRODI" && req.session.jurusanId) {
      targetJurusanId = req.session.jurusanId;
    } else if (jurusanId && !isNaN(parseInt(jurusanId))) {
      targetJurusanId = parseInt(jurusanId);
    }

    const targetJurusan = targetJurusanId
      ? await prisma.jurusan.findUnique({ where: { id: targetJurusanId } })
      : null;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Alumni Management Polimdo";
    workbook.created = new Date();

    const normalizedCategory = category ? category.toUpperCase() : "ALL";

    if (normalizedCategory === "DIKTI") {
      await buildTracerWorksheet(workbook, {
        category: "DIKTI",
        targetPeriod,
        targetJurusan,
        targetJurusanId,
      });
    } else if (normalizedCategory === "IKU") {
      await buildTracerWorksheet(workbook, {
        category: "IKU",
        targetPeriod,
        targetJurusan,
        targetJurusanId,
      });
    } else {
      // Gabungan DIKTI & IKU (ALL)
      await buildCombinedTracerWorksheet(workbook, {
        targetPeriod,
        targetJurusan,
        targetJurusanId,
      });
    }

    const cleanPeriodName = targetPeriod ? targetPeriod.namaPeriode.replace(/[^a-zA-Z0-9_-]/g, "_") : "Semua_Periode";
    const categoryTag = normalizedCategory ? `_${normalizedCategory}` : "_GABUNGAN";
    const fileName = `Laporan_Jawaban_Tracer${categoryTag}_${cleanPeriodName}_${new Date().getFullYear()}.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error("Export tracer excel error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengekspor Excel: " + error.message });
  }
};

const getAlumniResponseDetail = async (req, res) => {
  try {
    const { alumniId } = req.params;
    const { periodId } = req.query;

    const alumni = await prisma.alumni.findUnique({
      where: { id: parseInt(alumniId) },
      include: { jurusan: true },
    });

    if (!alumni) {
      return res.status(404).json({ success: false, message: "Alumni tidak ditemukan" });
    }

    if (req.session.role === "ADMIN_PRODI" && alumni.jurusanId !== req.session.jurusanId) {
      return res.status(403).json({ success: false, message: "Akses ditolak untuk jurusan alumni ini" });
    }

    const where = { alumniId: parseInt(alumniId) };
    if (periodId && !isNaN(parseInt(periodId))) {
      where.tracerPeriodId = parseInt(periodId);
    }

    const responses = await prisma.tracerResponse.findMany({
      where,
      include: {
        period: true,
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    // Urutkan jawaban berdasarkan urutan pertanyaan
    const formattedResponses = responses.map((r) => ({
      ...r,
      answers: r.answers.sort((a, b) => (a.question?.urutan || 0) - (b.question?.urutan || 0)),
    }));

    return res.status(200).json({
      success: true,
      data: {
        alumni,
        responses: formattedResponses,
      },
    });
  } catch (error) {
    console.error("Get alumni response detail error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  getAllPeriods,
  createPeriod,
  updatePeriod,
  removePeriod,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  removeQuestion,
  checkEligibility,
  getActiveQuestions,
  submitResponse,
  getMonitoringResults,
  getAlumniResponseDetail,
  getAccreditationReport,
  exportTracerExcel,
};
